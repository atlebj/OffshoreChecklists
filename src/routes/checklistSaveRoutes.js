const express = require('express');
const router = express.Router();
const ChecklistType1 = require('../models/responsesType1');
const Checklist = require('../models/checklists');

/* router.post('/save-checklist', async (req, res) => {
    try {
        const checklistData = req.body;
        const newChecklist = new ChecklistType1(checklistData);
        await newChecklist.save();
        res.status(201).send('Checklist saved successfully');
    } catch (err) {
        console.error('Error saving checklist:', err);
        res.status(500).send('Internal Server Error');
    }
}); */

router.post('/save-checklist', async (req, res) => {
    try {
        const userChecklistData = req.body;
        console.log("Received data:", JSON.stringify(userChecklistData, null, 2));
        
        // Adjusting the structure of checklistAnswers to match the Mongoose schema
        const categories = Object.keys(userChecklistData.checklistAnswers).map(categoryName => {
            const questions = userChecklistData.checklistAnswers[categoryName].map(question => {
                return {
                    question_id: question.questionId,
                    question_text: question.questionText,
                    response: {
                        answer: question.answer,
                        comments: question.comments || "",
                        confirmedBy: userChecklistData.currentUser // Saving currentUser in each response
                    }
                };
            });
            return {
                category_name: categoryName,
                questions: questions
            };
        });

        // Creating a copy of the userChecklistData object and updating the categories field
        const dataToSave = { ...userChecklistData, categories };
        delete dataToSave._id;
        delete dataToSave.checklistAnswers; // Removing the old checklistAnswers field

        // Setting the status to "Completed" if all questions are answered
        const allQuestionsAnswered = categories.every(category => 
            category.questions.every(question => question.response.answer !== "")
        );
        if (allQuestionsAnswered) {
            dataToSave.status = "Completed";
        }

        console.log("Data to save:", JSON.stringify(dataToSave, null, 2));

        // Save the data to the "responsesType1" collection
        const newResponse = new ChecklistType1(dataToSave);
        await newResponse.save();

        res.status(200).send("Response saved successfully");
    } catch (error) {
        console.error("Error saving response:", error);
        res.status(500).send("Internal Server Error");
    }
});





module.exports = router;


