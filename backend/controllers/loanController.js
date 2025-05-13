const Loan = require('../models/Loan');
const User = require('../models/User');

// Submit a new loan application
exports.submitLoanApplication = async (req, res) => {
  try {
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

    // Create new loan application
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
      revenueUnit
    });

    // Save loan application to the database
    await loanApplication.save();

    res.status(201).json(loanApplication);
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

// Get all loan applications (admin only)
exports.getAllLoans = async (req, res) => {
  try {
    // Only admins can access all loans
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const loans = await Loan.find().sort({ submittedAt: -1 }).populate('farmer', 'name email farmName farmLocation');
    res.json(loans);
  } catch (error) {
    console.error('Get all loans error:', error.message);
    res.status(500).json({ message: 'Server error' });
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

// Update loan status (admin only)
exports.updateLoanStatus = async (req, res) => {
  try {
    const { status, adminNotes, riskScore, approvedAmount, rejectReason } = req.body;

    // Only admins can update loan status
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Build loan update object
    const loanFields = {};
    if (status) loanFields.status = status;
    if (adminNotes !== undefined) loanFields.adminNotes = adminNotes;
    if (riskScore !== undefined) loanFields.riskScore = riskScore;
    if (approvedAmount !== undefined) loanFields.approvedAmount = approvedAmount;
    if (rejectReason !== undefined) loanFields.rejectReason = rejectReason;
    
    loanFields.adminId = req.user._id;
    loanFields.reviewedAt = Date.now();

    let loan = await Loan.findById(req.params.id);

    // Check if loan exists
    if (!loan) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    // Update loan
    loan = await Loan.findByIdAndUpdate(
      req.params.id,
      { $set: loanFields },
      { new: true }
    )
    .populate('farmer', 'name email farmName farmLocation phoneNumber creditScore')
    .populate('adminId', 'name email');

    // Update farmer's credit score if loan is approved or rejected
    if (status === 'approved' || status === 'rejected') {
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
