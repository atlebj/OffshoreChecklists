/* // src/dataAccess.js
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
 */

// src/dataAccess.js
const ChecklistType1 = require('../models/responsesType1');
const Checklist = require('../models/checklists') // Adjust the path to where you saved the model

// Fetch all checklists or filter by title if searchTerm is provided
async function getChecklists() {
  const result = await Checklist.find();
  //console.log("Checklists from DB:", result);
  return result;
}

// Fetch a specific checklist by its ID
async function getChecklistById(id) {
  try {
    return Checklist.findById(id).exec();
  } catch (err) {
    console.error('Error in getChecklistById:', err);
    throw err;
  }
}

// Fetch recent checklists (you can adjust the logic as needed)
async function getRecentChecklists() {
  // Replace the following query with your actual query to get recent checklists
  return Checklist.find({}).sort({ _id: -1 }).limit(10).exec(); // Fetching the last 10 checklists as an example
}

module.exports = {
  getChecklists,
  getChecklistById,
  getRecentChecklists
};
