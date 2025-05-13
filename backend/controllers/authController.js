const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new farmer
exports.register = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      farmName, 
      farmLocation, 
      farmSize, 
      farmSizeUnit, 
      phoneNumber, 
      farmingExperience, 
      mainCrops 
    } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new farmer user
    user = new User({
      name,
      email,
      password,
      role: 'farmer', // Set role to farmer
      farmName,
      farmLocation,
      farmSize,
      farmSizeUnit,
      phoneNumber,
      farmingExperience,
      mainCrops,
      // Initialize credit score based on farming experience
      creditScore: Math.min(30, (farmingExperience || 0) * 3)
    });

    // Save user to database
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        farmName: user.farmName,
        farmLocation: user.farmLocation,
        farmSize: user.farmSize,
        farmSizeUnit: user.farmSizeUnit,
        phoneNumber: user.phoneNumber,
        farmingExperience: user.farmingExperience,
        mainCrops: user.mainCrops,
        creditScore: user.creditScore
      }
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Register a new admin
exports.registerAdmin = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      institution, 
      position, 
      phone 
    } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new admin user
    user = new User({
      name,
      email,
      password,
      role: 'admin', // Set role to admin
      institution,
      position,
      phoneNumber: phone
    });

    // Save user to database
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        institution: user.institution,
        position: user.position,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    console.error('Admin Register error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create user object with properties depending on role
    let userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // Add farmer-specific data if user is a farmer
    if (user.role === 'farmer') {
      userData = {
        ...userData,
        farmName: user.farmName,
        farmLocation: user.farmLocation,
        farmSize: user.farmSize,
        farmSizeUnit: user.farmSizeUnit,
        phoneNumber: user.phoneNumber,
        farmingExperience: user.farmingExperience,
        mainCrops: user.mainCrops,
        creditScore: user.creditScore
      };
    }

    res.json({
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    // req.user is set by the auth middleware
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      farmName, 
      farmLocation, 
      farmSize, 
      farmSizeUnit, 
      phoneNumber, 
      farmingExperience, 
      mainCrops 
    } = req.body;
    
    // Build profile object based on fields submitted
    const profileFields = {};
    if (name) profileFields.name = name;
    if (email) profileFields.email = email;
    
    // Farmer-specific fields
    if (req.user.role === 'farmer') {
      if (farmName) profileFields.farmName = farmName;
      if (farmLocation) profileFields.farmLocation = farmLocation;
      if (farmSize) profileFields.farmSize = farmSize;
      if (farmSizeUnit) profileFields.farmSizeUnit = farmSizeUnit;
      if (phoneNumber) profileFields.phoneNumber = phoneNumber;
      if (farmingExperience) profileFields.farmingExperience = farmingExperience;
      if (mainCrops) profileFields.mainCrops = mainCrops;
      
      // If farming experience changed, update credit score
      if (farmingExperience && farmingExperience !== req.user.farmingExperience) {
        // Get current user with all fields to recalculate credit score
        const currentUser = await User.findById(req.user._id);
        const experienceScore = Math.min(30, farmingExperience * 3);
        
        // Simple credit score calculation for demonstration
        let score = experienceScore;
        
        // Add points for loan repayment history (max 50 points)
        if (currentUser.previousLoans > 0) {
          const repaymentRatio = currentUser.loansRepaid / currentUser.previousLoans;
          score += Math.round(repaymentRatio * 50);
        }
        
        // Add points for farm size (max 10 points)
        if (farmSize) {
          score += Math.min(10, farmSize / 10); // 1 point per 10 acres/hectares, max 10 points
        }
        
        // Add points for crop diversity (max 10 points)
        if (mainCrops && Array.isArray(mainCrops) && mainCrops.length > 0) {
          score += Math.min(10, mainCrops.length * 2);
        }
        
        // Ensure score is between 0 and 100
        profileFields.creditScore = Math.min(100, Math.max(0, Math.round(score)));
      }
    }
    
    // If email is being updated, check if it's already in use by another user
    if (email && email !== req.user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }

    // Find user by id and update
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: profileFields },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Check required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide both current and new password' });
    }
    
    // Get user with password
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if current password is correct
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
