require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
const Product = require('../models/Product');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const colors = {
  fashion: '6c4cff',
  electronics: '111827',
  accessories: '92400e',
  home: '059669',
  beauty: 'db2777',
  sports: 'ea580c',
  books: '1d4ed8',
  toys: 'f59e0b',
};

const makeImageUrl = (name, category) => {
  const color = colors[category] || '6c4cff';
  const text = encodeURIComponent(name);
  return `https://placehold.co/400x400/${color}/ffffff?text=${text}`;
};

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected. Updating images...');

  const products = await Product.find({});
  for (const p of products) {
    p.images = [makeImageUrl(p.name, p.category)];
    await p.save();
    console.log(`Updated: ${p.name}`);
  }

  console.log('Done.');
  mongoose.disconnect();
};

run();