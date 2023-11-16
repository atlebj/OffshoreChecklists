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




module.exports = router;