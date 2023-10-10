require('dotenv').config();
const { MongoClient } = require('mongodb');

const dbName = 'checklistapp'; 
const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function connect() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
  } catch (error) {
    console.error('Connection error', error);
  }
  return client.db(dbName);
}

module.exports = { connect };

