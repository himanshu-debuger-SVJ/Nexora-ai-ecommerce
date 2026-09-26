const { generateProductDescription } = require('../utils/aiContent');
const { generateEmbedding, cosineSimilarity } = require('../utils/embeddings');
const Product = require('../models/Product');

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/products (admin only)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, images, stock } = req.body;

    const embedding = await generateEmbedding(`${name} ${description} ${category}`);

    const product = await Product.create({
      name, description, price, category, images, stock, embedding,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/products/:id (admin only)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/products/:id (admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/products/search?q=your+query
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Query parameter q is required' });

    const queryEmbedding = await generateEmbedding(q);
    const products = await Product.find({});

    const scored = products
      .filter(p => p.embedding && p.embedding.length > 0)
      .map(p => ({
        product: p,
        score: cosineSimilarity(queryEmbedding, p.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    res.json(scored.map(s => ({ ...s.product.toObject(), similarity: s.score })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/products/generate-description (admin only)
const generateDescription = async (req, res) => {
  try {
    const { name, bulletPoints, category } = req.body;
    if (!name || !bulletPoints) {
      return res.status(400).json({ message: 'name and bulletPoints are required' });
    }
    const description = await generateProductDescription(name, bulletPoints, category || 'general');
    res.json({ description });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, searchProducts, generateDescription };