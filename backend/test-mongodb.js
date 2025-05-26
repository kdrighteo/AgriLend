const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Explicitly load the .env file
const envPath = path.resolve(__dirname, '.env');
console.log('Looking for .env file at:', envPath);

if (fs.existsSync(envPath)) {
  console.log('.env file found');
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  
  // Set each environment variable manually
  for (const key in envConfig) {
    process.env[key] = envConfig[key];
  }

  console.log('Loaded environment variables. Keys found:', Object.keys(envConfig).join(', '));
} else {
  console.log('.env file NOT found');
}

console.log('\nEnvironment variables check:');
console.log('PORT:', process.env.PORT || 'not set');
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);

if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI is undefined. Please check your .env file');
  process.exit(1);
}

console.log('\nAttempting to connect to MongoDB...');

// Remove quotes if they exist
let connectionString = process.env.MONGODB_URI.replace(/\"/g, '');
console.log('Using connection string (redacted):', 
  connectionString.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://USER:PASSWORD@'));

// Attempt connection
mongoose.connect(connectionString)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.error('Error type:', err.name);
    
    if (err.name === 'MongoParseError') {
      console.log('\nThe connection string appears to be invalid. Common issues:');
      console.log('1. Quotes around the connection string');
      console.log('2. Special characters in password not properly URL-encoded');
      console.log('3. Incorrect format (should start with mongodb:// or mongodb+srv://)');
      
      // Try to fix common issues automatically
      console.log('\nAttempting to fix connection string...');
      connectionString = connectionString.replace(/\"/g, ''); // Remove quotes
      
      // Check if @ symbol is part of password and not properly encoded
      if (connectionString.split('@').length > 2) {
        console.log('Found multiple @ symbols in connection string, attempting to fix...');
        const parts = connectionString.split('://');
        const prefix = parts[0] + '://';
        const userPassHost = parts[1];
        
        const userPassParts = userPassHost.split(':');
        const username = userPassParts[0];
        
        const remainingParts = userPassHost.substring(username.length + 1).split('@');
        const password = remainingParts[0];
        const hostPart = remainingParts.slice(1).join('@');
        
        const fixedPassword = password.replace('@', '%40');
        connectionString = `${prefix}${username}:${fixedPassword}@${hostPart}`;
        
        console.log('Fixed connection string (redacted):', 
          connectionString.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://USER:PASSWORD@'));
          
        // Try the fixed connection string
        console.log('\nAttempting connection with fixed string...');
        mongoose.connect(connectionString)
          .then(() => {
            console.log('Successfully connected to MongoDB with fixed connection string!');
            process.exit(0);
          })
          .catch((err) => {
            console.error('MongoDB connection still failing with fixed string:', err.message);
            process.exit(1);
          });
      } else {
        console.error('Could not automatically fix the connection string.');
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  });
