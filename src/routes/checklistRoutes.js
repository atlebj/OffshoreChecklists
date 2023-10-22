const express = require('express');
const router = express.Router();
const { saveChecklist } = require('../controllers/checklistController');

/* router.post('/save-checklist', (req, res) => {
  const data = req.body;
  saveChecklist(data);
  res.send('Checklist saved!');
}); */

module.exports = router;
