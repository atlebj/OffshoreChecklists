const ChecklistType1 = require('../models/responsesType1');

async function saveChecklist(data) {
  try {
    const checklist = new ChecklistType1(data);
    const result = await checklist.save();
    console.log('Checklist saved:', result);
  } catch (error) {
    console.error('Error saving checklist:', error);
  }
}
module.exports = { saveChecklist };
