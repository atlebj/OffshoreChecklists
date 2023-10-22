require('dotenv').config();
const express = require('express');
const app = express();
const { connect } = require('./src/db/db');
const { getChecklists, getChecklistById } = require('./src/dataAccess/dataAccess');
const checklistSaveRoutes = require('./src/routes/checklistSaveRoutes');
const Checklist = require('./src/models/checklists');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(checklistSaveRoutes);
app.set('view engine', 'pug');
app.set('views', './src/views');

app.get('/', async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || '';
    const checklists = await getChecklists();
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

app.get('/test-checklists', async (req, res) => {
  try {
    const checklists = await Checklist.find();
    console.log("Direct query checklists:", checklists);
    res.json(checklists);
  } catch (err) {
    console.error('Error in test-checklists route:', err);
    res.status(500).send('Internal Server Error');
  }
});


app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
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
