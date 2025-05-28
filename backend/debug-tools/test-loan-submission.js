/**
 * Debug tool to test loan submission and visibility to superadmin
 * Run with: node test-loan-submission.js
 */
const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
let farmerToken = null;
let superadminToken = null;

// Test credentials - using users known to exist in the system
const farmerCredentials = {
  email: 'john@farmer.com',  // Update this to an actual farmer account in your system
  password: 'changeme123!'
};

const superadminCredentials = {
  email: 'superadmin@agrilend.com', // Default superadmin account
  password: 'changeme123!'
};

// Test loan data
const testLoanData = {
  amount: 5000,
  purpose: 'Debug Test Loan',
  description: 'This is a test loan created by the debug tool',
  termLength: 12,
  termUnit: 'months',
  cropType: 'Test Crop',
  farmingCycle: 'seasonal'
};

// Helper function to login
async function login(credentials) {
  try {
    console.log(`Logging in as ${credentials.email}...`);
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    console.log(`Login successful for ${credentials.email}`);
    return response.data.token;
  } catch (error) {
    console.error('Login error:', error.response?.data?.message || error.message);
    return null;
  }
}

// Helper function to submit a loan
async function submitLoan(token, loanData) {
  try {
    console.log('Submitting test loan application...');
    const response = await axios.post(
      `${API_BASE_URL}/loans`,
      loanData,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    console.log('Loan submitted successfully!');
    console.log('Loan ID:', response.data.loanApplication._id);
    return response.data.loanApplication._id;
  } catch (error) {
    console.error('Loan submission error:', error.response?.data?.message || error.message);
    return null;
  }
}

// Helper function to check if a loan is visible to superadmin
async function checkLoanVisibility(token, loanId) {
  try {
    console.log('Checking loan visibility for superadmin...');
    const response = await axios.get(
      `${API_BASE_URL}/loans/all`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    console.log(`Found ${response.data.length} loans in total`);
    
    // Check if the specific loan is in the results
    const foundLoan = response.data.find(loan => loan._id === loanId);
    
    if (foundLoan) {
      console.log('SUCCESS: Loan is visible to superadmin!');
      console.log('Loan details:', {
        id: foundLoan._id,
        amount: foundLoan.amount,
        status: foundLoan.status,
        purpose: foundLoan.purpose
      });
      return true;
    } else {
      console.log('ERROR: Loan is NOT visible to superadmin!');
      return false;
    }
  } catch (error) {
    console.error('Visibility check error:', error.response?.data?.message || error.message);
    return false;
  }
}

// Main function to run the test
async function runTest() {
  console.log('===== Starting Loan Submission Test =====');
  
  // Step 1: Login as farmer
  farmerToken = await login(farmerCredentials);
  if (!farmerToken) {
    console.error('Failed to login as farmer. Test aborted.');
    return;
  }
  
  // Step 2: Submit loan application
  const loanId = await submitLoan(farmerToken, testLoanData);
  if (!loanId) {
    console.error('Failed to submit loan. Test aborted.');
    return;
  }
  
  // Step 3: Login as superadmin
  superadminToken = await login(superadminCredentials);
  if (!superadminToken) {
    console.error('Failed to login as superadmin. Test aborted.');
    return;
  }
  
  // Step 4: Check if the loan is visible to superadmin
  const isVisible = await checkLoanVisibility(superadminToken, loanId);
  
  console.log('===== Test Results =====');
  if (isVisible) {
    console.log('u2705 SUCCESS: Loan application properly submitted to superadmin');
  } else {
    console.log('u274c FAILURE: Loan application is not visible to superadmin');
    console.log('Please check the filtering logic in the SuperAdminDashboard component');
  }
}

// Run the test
runTest();
