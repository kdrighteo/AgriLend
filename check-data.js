const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern_project';
console.log('MongoDB URI:', MONGODB_URI);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define simplified models for checking data
const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  institution: String
}));

const Loan = mongoose.model('Loan', new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  purpose: String,
  status: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}));

const Invitation = mongoose.model('Invitation', new mongoose.Schema({
  code: String,
  email: String,
  institutionName: String,
  used: Boolean
}));

async function checkDatabase() {
  console.log('\n----- DATABASE CHECK -----');
  
  // Check Users
  const users = await User.find().select('name email role institution');
  console.log(`\nTotal Users: ${users.length}`);
  
  const farmers = users.filter(user => user.role === 'farmer');
  const admins = users.filter(user => user.role === 'admin');
  const superadmins = users.filter(user => user.role === 'superadmin');
  
  console.log(`- Farmers: ${farmers.length}`);
  console.log(`- Bank Admins: ${admins.length}`);
  console.log(`- Super Admins: ${superadmins.length}`);
  
  if (admins.length > 0) {
    console.log('\nBank Admins:');
    admins.forEach(admin => {
      console.log(`- ${admin.name} (${admin.email}) - ${admin.institution || 'No Institution'}`);
    });
  }
  
  // Check Loans
  const loans = await Loan.find().populate('farmer', 'name email').populate('assignedTo', 'name institution');
  console.log(`\nTotal Loans: ${loans.length}`);
  
  const pendingLoans = loans.filter(loan => loan.status === 'pending');
  const approvedLoans = loans.filter(loan => loan.status === 'approved');
  const rejectedLoans = loans.filter(loan => loan.status === 'rejected');
  
  console.log(`- Pending: ${pendingLoans.length}`);
  console.log(`- Approved: ${approvedLoans.length}`);
  console.log(`- Rejected: ${rejectedLoans.length}`);
  
  if (loans.length > 0) {
    console.log('\nLoan Details:');
    loans.forEach(loan => {
      console.log(`- Amount: $${loan.amount} | Purpose: ${loan.purpose} | Status: ${loan.status} | Assigned To: ${loan.assignedTo ? loan.assignedTo.institution : 'Not Assigned'}`);
    });
  }
  
  // Check Invitations
  const invitations = await Invitation.find();
  console.log(`\nTotal Invitations: ${invitations.length}`);
  
  const activeInvitations = invitations.filter(inv => !inv.used);
  console.log(`- Active: ${activeInvitations.length}`);
  console.log(`- Used: ${invitations.length - activeInvitations.length}`);
  
  console.log('\n----------------------------');
  
  // If no bank admins or loans, suggest creating test data
  if (admins.length === 0 || loans.length === 0) {
    console.log('\nNo bank admins or loans found. You may want to create test data.');
  }
  
  mongoose.connection.close();
}

checkDatabase().catch(err => {
  console.error('Error checking database:', err);
  mongoose.connection.close();
});
