const User = require('../models/User');

// Get all bank admin users
exports.getBankUsers = async (req, res) => {
  try {
    // Only superadmin can view all bank users
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to view bank users' });
    }

    const bankUsers = await User.find({ role: 'admin' })
      .select('name email institution position phoneNumber createdAt')
      .sort({ createdAt: -1 });

    res.json(bankUsers);
  } catch (error) {
    console.error('Error getting bank users:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile 
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting profile:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
