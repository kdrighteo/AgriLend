const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 100 // Minimum loan amount
  },
  purpose: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  termLength: {
    type: Number,
    required: true,
    min: 1 // Minimum term in months
  },
  termUnit: {
    type: String,
    enum: ['months', 'years'],
    default: 'months'
  },
  collateral: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'under-review', 'approved', 'rejected', 'funded', 'repaid'],
    default: 'pending'
  },
  cropType: {
    type: String,
    trim: true
  },
  farmingCycle: {
    type: String,
    enum: ['seasonal', 'annual', 'perennial'],
    default: 'seasonal'
  },
  estimatedYield: {
    type: Number,
    min: 0
  },
  estimatedRevenue: {
    type: Number,
    min: 0
  },
  revenueUnit: {
    type: String,
    enum: ['per-acre', 'per-hectare', 'total'],
    default: 'total'
  },
  // Admin review data
  adminNotes: {
    type: String,
    trim: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 100
  },
  approvedAmount: {
    type: Number,
    min: 0
  },
  rejectReason: {
    type: String,
    trim: true
  },
  // Bank assignment
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedAt: {
    type: Date
  },
  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before each save
loanSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;
