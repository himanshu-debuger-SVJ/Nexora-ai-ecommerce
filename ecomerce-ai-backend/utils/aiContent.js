const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateProductDescription = async (name, bulletPoints, category) => {
  const prompt = `Write a polished, compelling e-commerce product description (2-3 sentences) for this product.

Product name: ${name}
Category: ${category}
Key points: ${bulletPoints}

Write only the description text, no headers or extra commentary.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
  });

  return response.text.trim();
};

module.exports = { generateProductDescription };