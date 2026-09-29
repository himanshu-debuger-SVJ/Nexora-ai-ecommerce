require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
const User = require('./models/User');

dns.setServers(['8.8.8.8', '8.8.4.4']);

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const result = await User.updateOne(
    { email: 'admin@nexora.com' },
    { $set: { role: 'admin' } }
  );
  console.log(result);
  mongoose.disconnect();
});