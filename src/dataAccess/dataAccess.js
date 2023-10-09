// src/dataAccess.js
const { connect } = require('../db/db');

async function getChecklists(searchTerm = '') {
  const db = await connect();
  const collection = db.collection('checklists');
  const query = searchTerm ? { title: new RegExp(searchTerm, 'i') } : {};
  return collection.find(query).toArray();
}

async function getChecklistById(id) {
  try {
    const db = await connect();
    const collection = db.collection('checklists');
    const checklist = await collection.findOne({ _id: id });
    return checklist;
  } catch (err) {
    console.error('Error in getChecklistById:', err);
    throw err;
  }
}

async function getRecentChecklists() {
  const client = new MongoClient(connectionString, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('checklists');

  // Replace the following query with your actual query to get recent checklists
  const recentChecklists = await collection.find({}).toArray();

  await client.close();
  return recentChecklists;
}


module.exports = {
  getChecklists,
  getChecklistById,
  
};
