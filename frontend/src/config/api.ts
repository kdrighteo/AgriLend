// API Configuration
declare const process: {
  env: {
    REACT_APP_API_URL?: string;
  }
};

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://agrilend-1.onrender.com/api';

// For debugging API connectivity issues
console.log('Using API URL:', API_BASE_URL);

// Helper function to test API connectivity
export const testApiConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.ok;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};

export default API_BASE_URL;
