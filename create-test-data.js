const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern_project';
console.log('MongoDB URI:', MONGODB_URI);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define models
const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ['farmer', 'admin', 'superadmin'] },
  institution: String,
  position: String,
  phoneNumber: String,
  createdAt: { type: Date, default: Date.now }
}));

const Invitation = mongoose.model('Invitation', new mongoose.Schema({
  code: String,
  email: String,
  institutionName: String,
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}));

// Create test data
async function createTestData() {
  console.log('\n----- CREATING TEST DATA -----');
  
  // 1. Create test bank users (admins)
  const bankAdmins = [
    {
      name: 'John Smith',
      email: 'john@agribank.com',
      password: await bcrypt.hash('Password123!', 10),
      role: 'admin',
      institution: 'AgriBank Financial',
      position: 'Loan Officer',
      phoneNumber: '555-123-4567'
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah@farmcredit.com',
      password: await bcrypt.hash('Password123!', 10),
      role: 'admin',
      institution: 'Farm Credit Union',
      position: 'Branch Manager',
      phoneNumber: '555-987-6543'
    },
    {
      name: 'Michael Chang',
      email: 'michael@ruralfinance.com',
      password: await bcrypt.hash('Password123!', 10),
      role: 'admin',
      institution: 'Rural Finance Partners',
      position: 'Credit Analyst',
      phoneNumber: '555-456-7890'
    }
  ];
  
  // Check if bank admins already exist
  for (const admin of bankAdmins) {
    const existingAdmin = await User.findOne({ email: admin.email });
    if (!existingAdmin) {
      await User.create(admin);
      console.log(`Created bank admin: ${admin.name} (${admin.institution})`);
    } else {
      console.log(`Bank admin already exists: ${admin.name}`);
    }
  }
  
  // 2. Create test invitations
  const invitations = [
    {
      code: 'INVTEST1',
      email: 'newbank1@example.com',
      institutionName: 'New Agricultural Bank',
      used: false
    },
    {
      code: 'INVTEST2',
      email: 'newbank2@example.com',
      institutionName: 'Farmers Cooperative Credit',
      used: false
    }
  ];
  
  // Check if invitations already exist
  for (const invitation of invitations) {
    const existingInvitation = await Invitation.findOne({ code: invitation.code });
    if (!existingInvitation) {
      await Invitation.create(invitation);
      console.log(`Created invitation code ${invitation.code} for ${invitation.institutionName}`);
    } else {
      console.log(`Invitation already exists: ${invitation.code}`);
    }
  }
  
  console.log('\n----- TEST DATA CREATION COMPLETE -----');
  console.log('\nYou can now log in with the following test accounts:');
  console.log('\nBank Admin 1:');
  console.log('- Email: john@agribank.com');
  console.log('- Password: Password123!');
  console.log('\nBank Admin 2:');
  console.log('- Email: sarah@farmcredit.com');
  console.log('- Password: Password123!');
  console.log('\nBank Admin 3:');
  console.log('- Email: michael@ruralfinance.com');
  console.log('- Password: Password123!');
  console.log('\nSuperAdmin:');
  console.log(`- Email: ${process.env.SUPER_ADMIN_EMAIL || 'superadmin@agrilend.com'}`);
  console.log(`- Password: ${process.env.SUPER_ADMIN_PASSWORD || 'AgriLend2025!'}`);
  
  mongoose.connection.close();
}

createTestData().catch(err => {
  console.error('Error creating test data:', err);
  mongoose.connection.close();
});
