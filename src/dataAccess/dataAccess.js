
// This file contains the data access layer for the application.
const ChecklistType1 = require('../models/responsesType1');
const Checklist = require('../models/checklists') // Adjust the path to where you saved the model

// Fetch all checklists or filter by title if searchTerm is provided
async function getChecklists() {
  const result = await Checklist.find();
  //console.log("Checklists from DB:", result);
  return result;
}

async function getResponses() {
  const result = await ChecklistType1.find();
  //console.log("Responses from DB:", result);
  return result;
}

async function getResponseById(id) {
  try {
    return ChecklistType1.findById(id).exec();
  } catch (err) {
    console.error('Error in getResponseById:', err);
    throw err;
  }
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
  getRecentChecklists,
  getResponses,
  getResponseById
};
