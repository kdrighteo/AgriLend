const User = require('../models/User');
require('dotenv').config();

/**
 * Seeds a super admin account if it doesn't exist.
 * This should be run when the application first initializes.
 */
async function seedSuperAdmin() {
  try {
    // Check if super admin already exists
    const superAdminExists = await User.findOne({ role: 'superadmin' });
    
    if (!superAdminExists) {
      console.log('Creating super admin account...');
      
      // Create the super admin user
      const superAdmin = new User({
        name: 'AgriLend Super Admin',
        email: process.env.SUPER_ADMIN_EMAIL || 'superadmin@agrilend.com',
        password: process.env.SUPER_ADMIN_PASSWORD || 'changeme123!', // Will be hashed by the User model pre-save hook
        role: 'superadmin',
        institution: 'AgriLend Platform',
        position: 'System Administrator'
      });
      
      await superAdmin.save();
      console.log('Super admin account created successfully');
    } else {
      console.log('Super admin account already exists');
    }
  } catch (error) {
    console.error('Error seeding super admin account:', error);
  }
}

module.exports = seedSuperAdmin;
