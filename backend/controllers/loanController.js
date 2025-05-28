const Loan = require('../models/Loan');
const User = require('../models/User');

// Submit a new loan application
exports.submitLoanApplication = async (req, res) => {
  try {
    // Check if user is a farmer
    if (req.user.role !== 'farmer') {
      return res.status(403).json({ message: 'Only farmers can submit loan applications' });
    }

    const {
      amount,
      purpose,
      description,
      termLength,
      termUnit,
      collateral,
      cropType,
      farmingCycle,
      estimatedYield,
      estimatedRevenue,
      revenueUnit
    } = req.body;

    // Create new loan application (explicitly set status to pending)
    const loanApplication = new Loan({
      farmer: req.user._id,
      amount,
      purpose,
      description,
      termLength,
      termUnit,
      collateral,
      cropType,
      farmingCycle,
      estimatedYield,
      estimatedRevenue,
      revenueUnit,
      status: 'pending',  // Explicitly set status to pending for superadmin review
      adminNotes: 'New application pending superadmin review'
    });

    // Save loan application to the database
    await loanApplication.save();

    res.status(201).json({ 
      message: 'Loan application submitted successfully and awaiting superadmin review',
      loanApplication 
    });
  } catch (error) {
    console.error('Submit loan application error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all loan applications for a farmer
exports.getFarmerLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ farmer: req.user._id }).sort({ submittedAt: -1 });
    res.json(loans);
  } catch (error) {
    console.error('Get farmer loans error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all loan applications (temporary debug version - allows all authenticated users)
exports.getAllLoans = async (req, res) => {
  try {
    console.log('===== GET ALL LOANS DEBUG =====');
    console.log('User attempting to access loans:', {
      userId: req.user ? req.user._id : 'unknown',
      role: req.user ? req.user.role : 'unknown',
      name: req.user ? req.user.name : 'unknown',
      email: req.user ? req.user.email : 'unknown'
    });
    
    // TEMPORARY: Allow any authenticated user to access loans for debugging
    if (!req.user) {
      console.log('DENIED: No authenticated user');
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // No filtering for debugging - show all loans to any authenticated user
    let query = {};
    console.log('DEBUG MODE: Showing all loans to user', req.user.email);

    console.log('Query filter:', JSON.stringify(query));
    
    const loans = await Loan.find(query)
      .sort({ submittedAt: -1 })
      .populate('farmer', 'name email farmName farmLocation')
      .populate('assignedTo', 'name email institution');
    
    console.log(`Found ${loans.length} loans matching criteria`);
    console.log('===== END GET ALL LOANS DEBUG =====');
    
    res.json(loans);
  } catch (error) {
    console.error('Get all loans error:', error.message);
    console.error(error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a specific loan application by ID
exports.getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('farmer', 'name email farmName farmLocation phoneNumber creditScore')
      .populate('adminId', 'name email');
    
    // Check if loan exists
    if (!loan) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    // Check if user is authorized to view this loan
    if (req.user.role !== 'admin' && loan.farmer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.json(loan);
  } catch (error) {
    console.error('Get loan by ID error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Loan application not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update loan status (superadmin for approval, admin for assigned loans)
exports.updateLoanStatus = async (req, res) => {
  try {
    const { status, adminNotes, riskScore, approvedAmount, rejectReason } = req.body;

    // Verify user has appropriate permissions
    if (req.user.role !== 'superadmin' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    let loan = await Loan.findById(req.params.id);

    // Check if loan exists
    if (!loan) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    // Role-based permission checks for loan status updates
    if (req.user.role === 'admin') {
      // Regular admins (banks) can only update loans assigned to them
      if (!loan.assignedTo || loan.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          message: 'You can only update loans assigned to you by a superadmin' 
        });
      }
      
      // Banks can only mark loans as funded or update their notes
      if (status && status !== 'funded') {
        return res.status(403).json({ 
          message: 'Banks can only mark loans as funded or update notes' 
        });
      }
    }

    // Superadmin-specific restrictions
    if (req.user.role === 'superadmin') {
      // Superadmins handle initial review (pending → approved/rejected)
      if (status === 'funded') {
        return res.status(403).json({ 
          message: 'Only banks can mark loans as funded' 
        });
      }
    }

    // Build loan update object
    const loanFields = {};
    if (status) loanFields.status = status;
    if (adminNotes !== undefined) loanFields.adminNotes = adminNotes;
    if (riskScore !== undefined && req.user.role === 'superadmin') loanFields.riskScore = riskScore;
    if (approvedAmount !== undefined && req.user.role === 'superadmin') loanFields.approvedAmount = approvedAmount;
    if (rejectReason !== undefined && req.user.role === 'superadmin') loanFields.rejectReason = rejectReason;
    
    loanFields.adminId = req.user._id;
    loanFields.reviewedAt = Date.now();

    // Update loan
    loan = await Loan.findByIdAndUpdate(
      req.params.id,
      { $set: loanFields },
      { new: true }
    )
    .populate('farmer', 'name email farmName farmLocation phoneNumber creditScore')
    .populate('adminId', 'name email')
    .populate('assignedTo', 'name email institution');

    // Update farmer's credit score if loan is approved or rejected by superadmin
    if (req.user.role === 'superadmin' && (status === 'approved' || status === 'rejected')) {
      // Simple credit score calculation
      // The actual implementation would be more sophisticated
      const farmer = await User.findById(loan.farmer._id);
      
      // Logic to update credit score based on loan approval/rejection
      if (status === 'approved') {
        // Increase credit score for approved loans
        farmer.previousLoans += 1;
        farmer.creditScore = calculateCreditScore(farmer);
      } else if (status === 'rejected') {
        // Slightly decrease credit score for rejected loans
        farmer.creditScore = Math.max(0, farmer.creditScore - 5);
      }
      
      await farmer.save();
    }

    res.json(loan);
  } catch (error) {
    console.error('Update loan status error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Loan application not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function for basic credit score calculation
const calculateCreditScore = (farmer) => {
  // Initial score based on farming experience (max 30 points)
  let score = Math.min(30, farmer.farmingExperience * 3);
  
  // Add points for loan repayment history (max 50 points)
  if (farmer.previousLoans > 0) {
    const repaymentRatio = farmer.loansRepaid / farmer.previousLoans;
    score += Math.round(repaymentRatio * 50);
  }
  
  // Add points for farm size (max 10 points)
  if (farmer.farmSize) {
    score += Math.min(10, farmer.farmSize / 10); // 1 point per 10 acres/hectares, max 10 points
  }
  
  // Add points for crop diversity (max 10 points)
  if (farmer.mainCrops && farmer.mainCrops.length > 0) {
    score += Math.min(10, farmer.mainCrops.length * 2);
  }
  
  // Ensure score is between 0 and 100
  return Math.min(100, Math.max(0, Math.round(score)));
};

// Mark a loan as repaid (admin only)
exports.markLoanRepaid = async (req, res) => {
  try {
    // Only admins can mark loans as repaid
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    let loan = await Loan.findById(req.params.id).populate('farmer', 'name email creditScore');

    // Check if loan exists
    if (!loan) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    // Ensure loan was approved before marking as repaid
    if (loan.status !== 'approved' && loan.status !== 'funded') {
      return res.status(400).json({ message: 'Only approved or funded loans can be marked as repaid' });
    }

    // Update loan status to repaid
    loan = await Loan.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          status: 'repaid',
          updatedAt: Date.now() 
        } 
      },
      { new: true }
    );

    // Update farmer's credit score and loan repayment history
    const farmer = await User.findById(loan.farmer);
    farmer.loansRepaid += 1;
    farmer.creditScore = calculateCreditScore(farmer);
    await farmer.save();

    res.json(loan);
  } catch (error) {
    console.error('Mark loan repaid error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Loan application not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Assign loan to a bank (superadmin only)
exports.assignLoan = async (req, res) => {
  try {
    // Only superadmin can assign loans to banks
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to assign loans' });
    }

    const { bankId } = req.body;
    if (!bankId) {
      return res.status(400).json({ message: 'Bank ID is required' });
    }

    // Check if bank exists and is an admin
    const bank = await User.findOne({ _id: bankId, role: 'admin' });
    if (!bank) {
      return res.status(404).json({ message: 'Bank not found' });
    }

    let loan = await Loan.findById(req.params.id);
    // Check if loan exists
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Update loan with assignment
    loan = await Loan.findByIdAndUpdate(
      req.params.id,
      { 
        assignedTo: bankId,
        assignedAt: Date.now()
      },
      { new: true }
    )
    .populate('farmer', 'name email farmName')
    .populate('assignedTo', 'name email institution');

    res.json(loan);
  } catch (error) {
    console.error('Assign loan error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invalid ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark a loan as funded (admin only)
exports.markLoanFunded = async (req, res) => {
  try {
    // Only admins can mark loans as funded
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    let loan = await Loan.findById(req.params.id).populate('farmer', 'name email creditScore');

    // Check if loan exists
    if (!loan) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    // Ensure loan was approved before marking as funded
    if (loan.status !== 'approved') {
      return res.status(400).json({ message: 'Only approved loans can be marked as funded' });
    }

    // Update loan status to funded
    loan = await Loan.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          status: 'funded',
          updatedAt: Date.now() 
        } 
      },
      { new: true }
    ).populate('farmer', 'name email farmName farmLocation phoneNumber creditScore')
     .populate('adminId', 'name email');

    res.json(loan);
  } catch (error) {
    console.error('Mark loan funded error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Loan application not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
