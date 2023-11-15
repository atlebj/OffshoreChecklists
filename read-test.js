const { MongoClient } = require('mongodb');

async function main() {
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