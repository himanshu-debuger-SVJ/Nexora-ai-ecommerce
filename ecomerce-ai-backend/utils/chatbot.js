const { GoogleGenAI } = require('@google/genai');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { generateEmbedding, cosineSimilarity } = require('./embeddings');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const searchProductsTool = async (query) => {
  const queryEmbedding = await generateEmbedding(query);
  const products = await Product.find({});
  const scored = products
    .filter(p => p.embedding && p.embedding.length > 0)
    .map(p => ({ product: p, score: cosineSimilarity(queryEmbedding, p.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  return scored.map(s => ({
    name: s.product.name,
    price: s.product.price,
    category: s.product.category,
    stock: s.product.stock,
  }));
};

const getOrderStatusTool = async (orderId, userId) => {
  const order = await Order.findById(orderId);
  if (!order) return { error: 'Order not found' };
  if (order.user.toString() !== userId) return { error: 'Not authorized to view this order' };
  return { status: order.status, totalAmount: order.totalAmount, createdAt: order.createdAt };
};

const toolDeclarations = [
  {
    name: 'search_products',
    description: 'Search the store catalog for products matching a description or need',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'What the customer is looking for' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_order_status',
    description: "Get the status of one of the customer's own orders by order ID",
    parameters: {
      type: 'object',
      properties: {
        orderId: { type: 'string', description: 'The MongoDB order ID' },
      },
      required: ['orderId'],
    },
  },
];

const runChat = async (message, userId) => {
    const chat = ai.chats.create({
    model: 'gemini-3.6-flash',
    config: {
      tools: [{ functionDeclarations: toolDeclarations }],
      systemInstruction: `You are Nexora's friendly shopping assistant. Write like you're talking to a customer in a chat window, not writing a spec sheet.

Rules:
- No markdown formatting — no asterisks, no bold, no bullet-point lists, no headers.
- Keep replies short and conversational, 2-4 sentences typically.
- Mention price and key details naturally inside sentences, not as a data dump.
- Sound warm and helpful, like a knowledgeable friend, not a search engine.
- If recommending a product, explain briefly why it fits what they asked for.`,
    },
  });

  let response = await chat.sendMessage({ message });
  let calls = response.functionCalls;
  let rounds = 0;

  while (calls && calls.length > 0 && rounds < 3) {
    const call = calls[0];
    let result;
    if (call.name === 'search_products') {
      result = await searchProductsTool(call.args.query);
    } else if (call.name === 'get_order_status') {
      result = await getOrderStatusTool(call.args.orderId, userId);
    } else {
      result = { error: 'Unknown tool' };
    }

    response = await chat.sendMessage({
      message: [{ functionResponse: { name: call.name, response: { result } } }],
    });
    calls = response.functionCalls;
    rounds++;
  }

  return response.text;
};

module.exports = { runChat };