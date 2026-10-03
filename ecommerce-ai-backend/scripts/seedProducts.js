require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
const Product = require('../models/Product');
const { generateEmbedding } = require('../utils/embeddings');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const products = [
  { name: 'Cotton T-Shirt', description: 'Soft breathable everyday t-shirt', price: 499, category: 'fashion', stock: 40, images: ['https://picsum.photos/seed/tshirt1/400/400'] },
  { name: 'Denim Jacket', description: 'Classic blue denim jacket with a relaxed fit', price: 1999, category: 'fashion', stock: 20, images: ['https://picsum.photos/seed/jacket1/400/400'] },
  { name: 'Running Shoes', description: 'Lightweight cushioned running shoes for daily training', price: 3499, category: 'fashion', stock: 25, images: ['https://picsum.photos/seed/shoes1/400/400'] },
  { name: 'Leather Wallet', description: 'Premium bifold leather wallet', price: 799, category: 'accessories', stock: 30, images: ['https://picsum.photos/seed/wallet1/400/400'] },
  { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse with USB receiver', price: 599, category: 'electronics', stock: 50, images: ['https://picsum.photos/seed/mouse1/400/400'] },
  { name: 'Mechanical Keyboard', description: 'RGB backlit mechanical keyboard with tactile switches', price: 2999, category: 'electronics', stock: 15, images: ['https://picsum.photos/seed/keyboard1/400/400'] },
  { name: 'Bluetooth Headphones', description: 'Over-ear wireless headphones with noise cancellation', price: 4499, category: 'electronics', stock: 18, images: ['https://picsum.photos/seed/headphones1/400/400'] },
  { name: 'Smart Watch', description: 'Fitness tracking smartwatch with heart rate monitor', price: 5999, category: 'electronics', stock: 22, images: ['https://picsum.photos/seed/watch1/400/400'] },
  { name: 'Ceramic Coffee Mug Set', description: 'Set of 4 handcrafted ceramic coffee mugs', price: 899, category: 'home', stock: 35, images: ['https://picsum.photos/seed/mugs1/400/400'] },
  { name: 'Scented Candle', description: 'Long-lasting lavender scented soy candle', price: 449, category: 'home', stock: 50, images: ['https://picsum.photos/seed/candle1/400/400'] },
  { name: 'Throw Pillow Cover', description: 'Soft cotton-blend decorative pillow cover', price: 349, category: 'home', stock: 60, images: ['https://picsum.photos/seed/pillow1/400/400'] },
  { name: 'Face Moisturizer', description: 'Lightweight daily moisturizer with SPF 30', price: 599, category: 'beauty', stock: 40, images: ['https://picsum.photos/seed/moisturizer1/400/400'] },
  { name: 'Matte Lipstick', description: 'Long-wearing matte finish lipstick', price: 349, category: 'beauty', stock: 45, images: ['https://picsum.photos/seed/lipstick1/400/400'] },
  { name: 'Yoga Mat', description: 'Non-slip eco-friendly yoga mat with carry strap', price: 1299, category: 'sports', stock: 30, images: ['https://picsum.photos/seed/yogamat1/400/400'] },
  { name: 'Dumbbell Set', description: 'Adjustable dumbbell set for home workouts', price: 2499, category: 'sports', stock: 12, images: ['https://picsum.photos/seed/dumbbell1/400/400'] },
  { name: 'Mystery Novel', description: 'Bestselling thriller novel, paperback edition', price: 349, category: 'books', stock: 25, images: ['https://picsum.photos/seed/book1/400/400'] },
  { name: 'Wooden Puzzle Set', description: 'Educational wooden puzzle set for kids', price: 599, category: 'toys', stock: 20, images: ['https://picsum.photos/seed/puzzle1/400/400'] },
  { name: 'Remote Control Car', description: 'High-speed remote control racing car', price: 1799, category: 'toys', stock: 15, images: ['https://picsum.photos/seed/rccar1/400/400'] },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB. Seeding...');

  for (const p of products) {
    try {
      const embedding = await generateEmbedding(`${p.name} ${p.description} ${p.category}`);
      await Product.create({ ...p, embedding });
      console.log(`Created: ${p.name}`);
    } catch (err) {
      console.error(`Failed: ${p.name} —`, err.message);
    }
  }

  console.log('Seeding complete.');
  mongoose.disconnect();
};

seed();