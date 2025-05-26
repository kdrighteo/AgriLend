const mongoose = require('mongoose');

// Define connection string directly in the script with lowercase username
const directConnectionString = 'mongodb+srv://kdrighteo:Toothached@cluster0.tmploqk.mongodb.net/agrilend?retryWrites=true&w=majority';

console.log('Attempting direct MongoDB connection...');
console.log('Using connection string with properly encoded password:');
console.log('- Username: kdrighteo');
console.log('- Password: [REDACTED]');
console.log('- Host: cluster0.tmploqk.mongodb.net');
console.log('- Database: agrilend');

mongoose.connect(directConnectionString)
  .then(() => {
    console.log('\nSUCCESS: Connected to MongoDB!');
    console.log('Your MongoDB connection string is valid.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\nERROR: MongoDB connection failed:', err.message);
    
    if (err.name === 'MongoServerSelectionError') {
      console.log('\nThis error usually means one of the following:');
      console.log('1. Network issue - Check your internet connection');
      console.log('2. IP Restriction - Your IP may not be whitelisted in MongoDB Atlas');
      console.log('3. Cluster not running - Check your MongoDB Atlas dashboard');
    } else if (err.name === 'MongoParseError') {
      console.log('\nThis error means your connection string format is invalid:');
      console.log('1. Check for special characters in your username/password');
      console.log('2. Ensure your cluster address is correct');
      console.log('3. Verify the database name at the end is correct');
    } else if (err.name === 'MongoError' && err.code === 18) {
      console.log('\nAuthentication failed - incorrect username or password');
    }
    
    process.exit(1);
  });
