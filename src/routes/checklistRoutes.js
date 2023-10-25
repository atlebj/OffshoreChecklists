const express = require('express');
const router = express.Router();
const { saveChecklist } = require('../controllers/checklistController');

/* router.post('/save-checklist', (req, res) => {
  const data = req.body;
  saveChecklist(data);
  res.send('Checklist saved!');
}); */


router.get('/drafts', async (req, res) => {
  try {
      const drafts = await ChecklistType1.find({ isDraft: true });
      res.json(drafts);
  } catch (error) {
      console.error("Error fetching drafts:", error);
      res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
