// Debug Tools for AgriLend

/**
 * Debug function to check authentication status
 * Use this in browser console by calling: checkAuthStatus()
 */
export const checkAuthStatus = () => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.group('Authentication Debug Info');
    console.log('Token exists:', !!token);
    if (token) {
      // Basic token validation (doesn't verify signature)
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('Token payload:', payload);
        console.log('Token expiration:', new Date(payload.exp * 1000).toLocaleString());
        console.log('Token expired:', payload.exp * 1000 < Date.now());
      } else {
        console.log('Token format invalid');
      }
    }
    
    console.log('User in localStorage:', user ? JSON.parse(user) : null);
    console.groupEnd();
    
    return { token, user: user ? JSON.parse(user) : null };
  } catch (error) {
    console.error('Error checking auth status:', error);
    return { error };
  }
};

/**
 * Debug function to test API connectivity
 * Use in browser console: testApiEndpoint('/api/loans/all')
 */
export const testApiEndpoint = async (endpoint: string) => {
  try {
    const token = localStorage.getItem('token');
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.group(`API Test: ${endpoint}`);
    console.log('Status:', response.status);
    console.log('OK:', response.ok);
    
    const data = await response.json();
    console.log('Response data:', data);
    console.groupEnd();
    
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error testing endpoint ${endpoint}:`, error);
    return { error };
  }
};

// Automatically add these functions to the window object for easy console access
declare global {
  interface Window {
    checkAuthStatus: () => any;
    testApiEndpoint: (endpoint: string) => Promise<any>;
  }
}

// Only execute in browser environment
if (typeof window !== 'undefined') {
  // Use proper type assertion to avoid TypeScript errors
  (window as any).checkAuthStatus = checkAuthStatus;
  (window as any).testApiEndpoint = testApiEndpoint;
}
