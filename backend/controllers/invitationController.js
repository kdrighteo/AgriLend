const Invitation = require('../models/Invitation');
const crypto = require('crypto');

// Generate a unique invitation code
const generateUniqueCode = () => {
  return crypto.randomBytes(6).toString('hex').toUpperCase();
};

// Create a new invitation (superadmin only)
exports.createInvitation = async (req, res) => {
  try {
    // Check if user is superadmin
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to create invitations' });
    }

    const { email, institutionName } = req.body;

    if (!email || !institutionName) {
      return res.status(400).json({ message: 'Email and institution name are required' });
    }

    // Generate a unique code
    const code = generateUniqueCode();

    // Create the invitation
    const invitation = new Invitation({
      code,
      email,
      institutionName,
      createdBy: req.user.id
    });

    await invitation.save();

    res.status(201).json(invitation);
  } catch (error) {
    console.error('Error creating invitation:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all invitations (superadmin only)
exports.getInvitations = async (req, res) => {
  try {
    // Check if user is superadmin
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to view invitations' });
    }

    const invitations = await Invitation.find().sort({ createdAt: -1 });
    res.json(invitations);
  } catch (error) {
    console.error('Error getting invitations:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify an invitation code
exports.verifyInvitation = async (req, res) => {
  try {
    const { code } = req.params;

    const invitation = await Invitation.findOne({ code, used: false });

    if (!invitation) {
      return res.status(404).json({ message: 'Invalid or expired invitation code' });
    }

    res.json({
      valid: true,
      email: invitation.email,
      institutionName: invitation.institutionName
    });
  } catch (error) {
    console.error('Error verifying invitation:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an invitation (superadmin only)
exports.deleteInvitation = async (req, res) => {
  try {
    // Check if user is superadmin
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to delete invitations' });
    }

    const invitation = await Invitation.findById(req.params.id);

    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    await invitation.remove();
    res.json({ message: 'Invitation removed' });
  } catch (error) {
    console.error('Error deleting invitation:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
