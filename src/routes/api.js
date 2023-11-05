const express = require('express');
const router = express.Router();
const ChecklistType1 = require('../models/responsesType1');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.get('/draft/:id', async (req, res) => {
    try {
        const draftId = req.params.id;
        const draft = await ChecklistType1.findById(draftId);
        res.json(draft);
    } catch (error) {
        res.status(400).send(error);
    }
});

/* // Example without specific dates, fetching last 24 hours
fetch('/api/get-all-drafts')
    .then(response => response.json())
    .then(data => {
        console.log('Drafts data:', data);
    });

// Example with specific dates
fetch('/api/get-all-drafts?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD')
    .then(response => response.json())
    .then(data => {
        console.log('Drafts data:', data);
    });
 */
router.get('/get-all-drafts', async (req, res) => {
    try {
        let { startDate, endDate } = req.query;
        
        // If no dates are provided, set defaults to last 24 hours
        if (!startDate) {
            startDate = moment().subtract(24, 'hours').toDate();
        } else {
            startDate = new Date(startDate);
        }
        
        if (!endDate) {
            endDate = new Date();
        } else {
            endDate = new Date(endDate);
        }
        
        const drafts = await ChecklistType1.find({
            isDraft: true,
            _id: {
                $gte: startDate,
                $lt: endDate
            }
        });
        
        res.json(drafts);
    } catch (error) {
        res.status(400).send(error);
    }
});


router.post('/update-checklist/:id', async (req, res) => {
    try {
        const checklistId = req.params.id;
        const userChecklistData = req.body;
        
        console.log(`Received update for checklist ID: ${checklistId}`);
        console.log('User data:', userChecklistData);

        // Find the existing checklist
        const checklistToUpdate = await ChecklistType1.findById(checklistId);
        console.log('isDraft status before update:', checklistToUpdate.isDraft);
        // Log the checklist as found in the database
        console.log('Checklist as found:', checklistToUpdate);

        // If checklistToUpdate is not found, send an error response
        if (!checklistToUpdate) {
            console.log('No checklist found for the given ID.');
            return res.status(404).json({ message: "Checklist not found" });
        }

        // Log the category and questions that are about to be updated
        console.log('Starting to update categories and questions based on user data.');

        // Transform the incoming data to match the schema structure
        checklistToUpdate.categories.forEach((category, index) => {
            if (userChecklistData.checklistAnswers[category.category_name]) {
                category.questions.forEach(question => {
                    const userQuestion = userChecklistData.checklistAnswers[category.category_name].find(q => q.questionId === question.question_id);
                    if (userQuestion) {
                        console.log(`Updating question: ${question.question_id}`);
                        question.response.answer = userQuestion.answer;
                        question.response.comments = userQuestion.comments || "";
                        question.response.confirmedBy = userChecklistData.currentUser;
                    }
                });
            }
        });

        // Log the checklist after making changes but before saving
        console.log('Checklist after updates (before save):', checklistToUpdate);
        console.log('isDraft status after update (before save):', checklistToUpdate.isDraft);
        // Save the updated document
        await checklistToUpdate.save();

        // Log the checklist after saving
        const updatedChecklist = await ChecklistType1.findById(checklistId);
        console.log('Checklist after save:', updatedChecklist);
        console.log('isDraft status after save:', updatedChecklist.isDraft);

        res.json({ message: 'Checklist updated successfully!' });
    } catch (error) {
        console.error('Error updating checklist:', error);
        res.status(400).send(error);
    }
});



module.exports = router;