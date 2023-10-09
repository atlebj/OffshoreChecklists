const { MongoClient } = require('mongodb');

const url = 'mongodb://checklistsapp:pxj3skdkxarK9dxT4en4gA0HwideX9HQbeFq0NkVbPINvFv4GBv9d4Hnug2AnWwwc5b5WECJGUrtACDbV9ijyg%3D%3D@checklistsapp.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@checklistsapp@';
const dbName = 'checklistapp';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function insertTestData() {
  try {
    await client.connect();
    console.log('Connected to database');
    const db = client.db(dbName);
    const collection = db.collection('checklists');

    // Test data to insert
    const testData = [
      { title: 'Checklist 3', items: ['Item 1', 'Item 2', 'Item 3'] },
      { title: 'Checklist 4', items: ['Item A', 'Item B', 'Item C'] },
      // ... add more test data as needed
    ];

    // Insert test data
    const result = await collection.insertMany(testData);
    console.log('Test data inserted:', result.insertedCount);
  } catch (err) {
    console.error('Error inserting test data:', err);
  } finally {
    await client.close();
  }
}

insertTestData();
