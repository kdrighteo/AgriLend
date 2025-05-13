const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['farmer', 'admin', 'superadmin'],
    default: 'farmer'
  },
  // Admin Profile Fields
  institution: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    trim: true
  },
  // Farmer Profile Fields
  farmName: {
    type: String,
    trim: true
  },
  farmLocation: {
    type: String,
    trim: true
  },
  farmSize: {
    type: Number,
    min: 0
  },
  farmSizeUnit: {
    type: String,
    enum: ['acres', 'hectares'],
    default: 'acres'
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  farmingExperience: {
    type: Number, // years of experience
    min: 0
  },
  mainCrops: [{
    type: String,
    trim: true
  }],
  // Simple credit scoring factors
  previousLoans: {
    type: Number,
    default: 0
  },
  loansRepaid: {
    type: Number,
    default: 0
  },
  creditScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Method to hash password before saving user
userSchema.pre('save', async function(next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) return next();
  
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password along with the new salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords for login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
