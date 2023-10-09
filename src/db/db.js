const { MongoClient } = require('mongodb');


const url = 'mongodb://checklistsapp:pxj3skdkxarK9dxT4en4gA0HwideX9HQbeFq0NkVbPINvFv4GBv9d4Hnug2AnWwwc5b5WECJGUrtACDbV9ijyg%3D%3D@checklistsapp.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@checklistsapp@';
const dbName = 'checklistapp'; // replace with your database name

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

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

