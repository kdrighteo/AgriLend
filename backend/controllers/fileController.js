const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Loan = require('../models/Loan');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/documents/';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to allow only certain file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/jpg'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, Word documents, and images are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Upload document for a loan
exports.uploadDocument = async (req, res) => {
  try {
    const { loanId, documentType } = req.body;
    
    if (!loanId) {
      return res.status(400).json({ message: 'Loan ID is required' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Find the loan
    const loan = await Loan.findById(loanId);
    
    if (!loan) {
      // Delete uploaded file if loan doesn't exist
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Loan not found' });
    }
    
    // Check if user is authorized (farmer can upload to their own loans, admin to assigned loans)
    if (req.user.role === 'farmer' && loan.farmer.toString() !== req.user._id.toString()) {
      fs.unlinkSync(req.file.path);
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    if (req.user.role === 'admin' && (!loan.assignedTo || loan.assignedTo.toString() !== req.user._id.toString())) {
      fs.unlinkSync(req.file.path);
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    // Add document to loan
    const document = {
      fileName: req.file.originalname,
      fileUrl: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.user._id,
      documentType: documentType || 'other'
    };
    
    loan.documents.push(document);
    await loan.save();
    
    res.json({
      message: 'Document uploaded successfully',
      document: loan.documents[loan.documents.length - 1]
    });
  } catch (error) {
    console.error('Upload document error:', error.message);
    
    // Delete file if error occurred
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all documents for a loan
exports.getLoanDocuments = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    
    // Check authorization
    if (req.user.role === 'farmer' && loan.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    res.json(loan.documents);
  } catch (error) {
    console.error('Get documents error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a document
exports.deleteDocument = async (req, res) => {
  try {
    const { loanId, documentId } = req.params;
    
    const loan = await Loan.findById(loanId);
    
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    
    // Check authorization
    if (req.user.role === 'farmer' && loan.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    // Find the document
    const document = loan.documents.id(documentId);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Delete file from filesystem
    if (fs.existsSync(document.fileUrl)) {
      fs.unlinkSync(document.fileUrl);
    }
    
    // Remove document from loan
    document.remove();
    await loan.save();
    
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export the upload middleware
exports.upload = upload;
