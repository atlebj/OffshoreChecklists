require('dotenv').config();
const express = require('express');
const app = express();
const { connect } = require('./src/db/db');
const { getChecklists, getChecklistById } = require('./src/dataAccess/dataAccess');
const { getResponses, getResponseById } = require('./src/dataAccess/dataAccess');
const checklistSaveRoutes = require('./src/routes/checklistSaveRoutes');
const Checklist = require('./src/models/checklists');
const ChecklistType1 = require('./src/models/responsesType1');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(checklistSaveRoutes);
app.set('view engine', 'pug');
app.set('views', './src/views');

app.get('/main2', async (req, res) => {
  try {
    // Fetch necessary data here (e.g., recent checklists, drafts)
    const recentChecklists = await getChecklists(); // Implement this function
    res.render('main2', { recentChecklists });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/', async (req, res) => {
  try {

    const allChecklists = await ChecklistType1.find().sort({ _id: -1 });

    const searchTerm = req.query.searchTerm || '';
    const checklists = await getChecklists();
    const responses = await getResponses();
    
    const draftChecklists = responses.filter(chk => chk.status === 'draft').slice(0, 5);

    console.log("Draft Responses from DB in app.js:", draftChecklists);
    const completedChecklists = responses.filter(chk => chk.status === 'Completed').slice(0, 5);
    //const draftChecklists = await ChecklistType1.find({ isDraft: true });
    const filteredChecklists = checklists.filter(checklist => 
      checklist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checklist.procedure_no.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredDraftChecklists = draftChecklists.filter(checklist =>
      checklist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checklist.procedure_no.toLowerCase().includes(searchTerm.toLowerCase())
    );

    res.render('main', { 
      checklists: filteredChecklists,
      draftChecklists: filteredDraftChecklists,
      completedChecklists: completedChecklists
    });
    
  } catch (err) {
    console.error('Error fetching checklists:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/checklist/:id', async (req, res) => {
  try {
    const checklistId = req.params.id;
    const checklist = await getChecklistById(checklistId);
    if (!checklist) {
      return res.status(404).send('Checklist not found');
    }
    res.render('checklist', { checklist: checklist });
  } catch (err) {
    console.error('Error fetching checklist:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/responses/:id', async (req, res) => {
  try {
    const responseId = req.params.id;
    const response = await getResponseById(responseId);
    if (!response) {
      return res.status(404).send('Response not found');
    }
    res.render('responses', { response: response });
  } catch (err) {
    console.error('Error fetching response:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/draftChecklist/:id', async (req, res) => {
  try {
    const draftChecklistId = req.params.id;
    const draftChecklist = await getChecklistById(draftChecklistId); // or another function for draft checklists
    if (!draftChecklist) {
      return res.status(404).send('Draft Checklist not found');
    }
    res.render('checklist', { checklist: draftChecklist }); // adjust the render view and object as necessary
  } catch (err) {
    console.error('Error fetching draft checklist:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/completedChecklists/:id', async (req, res) => {
  try {
    const completedChecklistId = req.params.id;
    const completedChecklist = await getChecklistById(completedChecklistId); // or another function for completed checklists
    if (!completedChecklist) {
      return res.status(404).send('Completed Checklist not found');
    }
    res.render('checklist', { checklist: completedChecklist }); // adjust the render view and object as necessary
  } catch (err) {
    console.error('Error fetching completed checklist:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  //res.render('error');
});


const port = process.env.PORT || 3000;

connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB using Mongoose:', err);
  });

module.exports = app;
