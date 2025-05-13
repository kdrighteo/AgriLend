const axios = require('axios');

async function testSuperadminLogin() {
  try {
    console.log('Testing SuperAdmin login...');
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'superadmin@agrilend.com',
      password: 'AgriLend2025!'
    });
    
    console.log('Login response:', response.data);
    console.log('User role:', response.data.user.role);
    console.log('Token:', response.data.token ? 'Token received' : 'No token');
    
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
  }
}

testSuperadminLogin();
