const express = require('express');
const app = express();
const port = 3000;
const dbModule = require('./src/db/db');
const { ObjectId } = require('mongodb');

require('dotenv').config();


const { getChecklists, getChecklistById } = require('./src/dataAccess/dataAccess');

const ChecklistType1 = require('./src/models/responsesType1');

app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', './src/views');

app.use(express.json()); // for parsing application/json


app.get('/', async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || '';
    const checklists = await getChecklists(); // Assume this function retrieves all checklists from the database
    
    const filteredChecklists = checklists.filter(checklist => 
      checklist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checklist.procedure_no.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    res.render('main', { checklists: filteredChecklists });
  } catch (err) {
    console.error('Error fetching checklists:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/main', async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || '';
    const checklists = await getChecklists(); // Assume this function retrieves all checklists from the database
    
    const filteredChecklists = checklists.filter(checklist => 
      checklist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checklist.procedure_no.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    res.render('main', { checklists: filteredChecklists });
  } catch (err) {
    console.error('Error fetching checklists:', err);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/checklist/:id', async (req, res) => {
  try {
    const checklistId = new ObjectId(req.params.id);
    const checklist = await getChecklistById(checklistId); // Use ObjectId in query
    const db = await dbModule.connect();
    const collection = db.collection('checklists');
    // Retrieve checklist from database
    if (!checklist) {
      return res.status(404).send('Checklist not found'); // Handle case where checklist is not found
    }
    res.render('checklist', { checklist: checklist }); // Render checklist view with retrieved data
  } catch (err) {
    console.error('Error fetching checklist:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Route to handle saving data
app.post('/save', async (req, res) => {
  try {
    // Create an instance of the model
    const checklist = new ChecklistType1(req.body);

    // Save the instance to the database
    await checklist.save();

    // Send a success response
    res.status(201).send('Data saved successfully');
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Main page route
/* app.get('/main', async (req, res) => {
    try {
      const recentChecklists = await getRecentChecklists(); // Replace this with your actual function to retrieve recent checklists
      res.render('main', { recentChecklists: recentChecklists });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }); */

// Search route
app.get('/search', async (req, res) => {
    const query = req.query.q;
    // Implement search logic here, e.g., search in the database
    // Return the search results
    const results = await searchInDatabase(query);
    res.render('search-results', { results });
  });


app.use(function(req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;