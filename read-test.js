// read-test.js
const { MongoClient } = require('mongodb');

const url = 'mongodb://checklistsapp:pxj3skdkxarK9dxT4en4gA0HwideX9HQbeFq0NkVbPINvFv4GBv9d4Hnug2AnWwwc5b5WECJGUrtACDbV9ijyg%3D%3D@checklistsapp.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@checklistsapp@';
const dbName = 'checklistapp'; // replace with your database name

async function readTest() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    const db = client.db(dbName);
    const collection = db.collection('checklists');
    const checklists = await collection.find({}).toArray();
    console.log(checklists); // Should log all documents in the collection
  } catch (err) {
    console.error('Error fetching checklists:', err);
  } finally {
    await client.close();
  }
}

readTest();
