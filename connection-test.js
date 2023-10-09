const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'poc_checklist';

const client = new MongoClient(url);

client.connect(err => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit the script with an error code
  }
  console.log('Connected successfully to MongoDB');
  console.log('Is Connected:', client.isConnected());
  client.close(); // Close the connection
});
