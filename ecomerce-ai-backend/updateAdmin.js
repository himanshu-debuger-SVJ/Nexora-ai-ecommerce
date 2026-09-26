require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const result = await User.updateOne(
    { email: 'test@test.com' },
    { $set: { role: 'admin' } }
  );
  console.log(result);
  mongoose.disconnect();
});