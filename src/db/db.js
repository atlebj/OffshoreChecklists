
// db.js
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('debug', true);

async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected successfully to MongoDB using Mongoose');
  } catch (error) {
    console.error('Connection error', error);
    throw error;
  }
}

module.exports = { connect };

