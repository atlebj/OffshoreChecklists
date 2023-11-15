const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb://checklistsapp:pxj3skdkxarK9dxT4en4gA0HwideX9HQbeFq0NkVbPINvFv4GBv9d4Hnug2AnWwwc5b5WECJGUrtACDbV9ijyg%3D%3D@checklistsapp.mongo.cosmos.azure.com:10255/checklistapp?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@checklistsapp@"; // Replace with your MongoDB connection string
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db("checklistapp"); // Replace with your database name
    const checklists = database.collection("checklists");

    const query = {}; // An empty query object will select all documents
    const cursor = checklists.find(query);

    if ((await cursor.count()) === 0) {
      console.log("No documents found!");
    }

    await cursor.forEach(doc => console.log(doc));
  } finally {
    await client.close();
  }
}

main().catch(console.error);