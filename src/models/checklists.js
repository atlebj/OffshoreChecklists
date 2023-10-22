const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Response Schema
const responseSchema = new Schema({
  answer: { type: String, default: "" },
  comments: { type: String, default: "" }
});

// Question Schema
const questionSchema = new Schema({
  question_id: { type: String, required: true },
  question_text: { type: String, required: true },
  response: responseSchema
});

// Category Schema
const categorySchema = new Schema({
  category_name: { type: String, required: true },
  questions: [questionSchema]
});

// Checklist Schema
const checklistSchema = new Schema({
  title: { type: String, required: true },
  procedure_no: { type: String, required: true },
  version: { type: String, required: true },
  revision_date: { type: String, required: true },
  changed_by: { type: String, required: true },
  location: { type: String, default: "" }, // New location field
  type: { type: String, default: "type1" }, // New types field
  categories: [categorySchema]
});

const Checklist = model('checklists', checklistSchema);

module.exports = Checklist;
