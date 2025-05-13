const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/invitationController');
const auth = require('../middleware/auth');

// @route   POST /api/invitations
// @desc    Create a new invitation code
// @access  Private (Superadmin only)
router.post('/', auth, invitationController.createInvitation);

// @route   GET /api/invitations
// @desc    Get all invitations
// @access  Private (Superadmin only)
router.get('/', auth, invitationController.getInvitations);

// @route   GET /api/invitations/verify/:code
// @desc    Verify an invitation code
// @access  Public
router.get('/verify/:code', invitationController.verifyInvitation);

// @route   DELETE /api/invitations/:id
// @desc    Delete an invitation
// @access  Private (Superadmin only)
router.delete('/:id', auth, invitationController.deleteInvitation);

module.exports = router;
