const mongoose = require('mongoose');

// Simple connection string without database name or options
const simpleConnectionString = 'mongodb+srv://kdrighteo:Toothached@cluster0.tmploqk.mongodb.net/';

console.log('Attempting simplified MongoDB connection...');

mongoose.connect(simpleConnectionString)
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('ERROR: MongoDB connection failed:', err.message);
    process.exit(1);
  });
