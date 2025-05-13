const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  institutionName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin']
  },
  used: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '7d' // Invitation expires after 7 days
  }
});

const Invitation = mongoose.model('Invitation', invitationSchema);

module.exports = Invitation;
