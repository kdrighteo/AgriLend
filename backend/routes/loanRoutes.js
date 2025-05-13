const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const auth = require('../middleware/auth');

// @route   POST /api/loans
// @desc    Submit a new loan application
// @access  Private (Farmers only)
router.post('/', auth, loanController.submitLoanApplication);

// @route   GET /api/loans
// @desc    Get all loan applications for the logged-in farmer
// @access  Private (Farmers only)
router.get('/my-loans', auth, loanController.getFarmerLoans);

// @route   GET /api/loans/all
// @desc    Get all loan applications
// @access  Private (Admin only)
router.get('/all', auth, loanController.getAllLoans);

// @route   GET /api/loans/:id
// @desc    Get a specific loan application by ID
// @access  Private (Admin or loan owner)
router.get('/:id', auth, loanController.getLoanById);

// @route   PUT /api/loans/:id/status
// @desc    Update loan status
// @access  Private (Admin only)
router.put('/:id/status', auth, loanController.updateLoanStatus);

// @route   PUT /api/loans/:id/repaid
// @desc    Mark a loan as repaid
// @access  Private (Admin only)
router.put('/:id/repaid', auth, loanController.markLoanRepaid);

// @route   PUT /api/loans/:id/funded
// @desc    Mark a loan as funded
// @access  Private (admin only)
router.put('/:id/funded', auth, loanController.markLoanFunded);

// @route   PUT /api/loans/:id/assign
// @desc    Assign a loan to a bank
// @access  Private (superadmin only)
router.put('/:id/assign', auth, loanController.assignLoan);

module.exports = router;
