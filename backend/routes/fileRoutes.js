const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const auth = require('../middleware/auth');

// @route   POST /api/files/upload
// @desc    Upload a document for a loan
// @access  Private (Farmer or Admin)
router.post('/upload', auth, fileController.upload.single('file'), fileController.uploadDocument);

// @route   GET /api/files/loan/:loanId
// @desc    Get all documents for a loan
// @access  Private (Farmer or Admin)
router.get('/loan/:loanId', auth, fileController.getLoanDocuments);

// @route   DELETE /api/files/loan/:loanId/document/:documentId
// @desc    Delete a document
// @access  Private (Farmer or Admin)
router.delete('/loan/:loanId/document/:documentId', auth, fileController.deleteDocument);

module.exports = router;
