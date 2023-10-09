const mongoose = require('mongoose');


const { Schema, model } = mongoose;

const responseSchema = new Schema({
  answer: { type: String, default: "" },
  comments: { type: String, default: "" }
});

const questionSchema = new Schema({
  question_id: { type: String, required: true },
  question_text: { type: String, required: true },
  response: { type: responseSchema, default: () => ({}) }
});

const categorySchema = new Schema({
  category_name: { type: String, required: true },
  questions: { type: [questionSchema], default: [] }
});

const checklistSchema = new Schema({
  title: { type: String, required: true },
  procedure_no: { type: String, required: true },
  version: { type: String, required: true },
  revision_date: { type: String, required: true },
  changed_by: { type: String, required: true },
  categories: { type: [categorySchema], default: [] }
});

const ChecklistType1Responses = model('ChecklistType1Responses', checklistSchema);

