import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const DebugInfo: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [tokenInfo, setTokenInfo] = useState<string | null>(null);
  const [apiTest, setApiTest] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    // Get user and token from localStorage
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUserInfo(userData);
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
    
    setTokenInfo(token);

    // Test a protected API endpoint
    const testApi = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/invitations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setApiTest(response.data);
      } catch (err: any) {
        console.error('API Test Error:', err);
        setApiError(err.response?.data?.message || err.message || 'Unknown error');
      }
    };

    if (token) {
      testApi();
    }
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">User Information</h2>
        {userInfo ? (
          <pre className="bg-white p-3 rounded">
            {JSON.stringify(userInfo, null, 2)}
          </pre>
        ) : (
          <p className="text-red-500">No user information found in localStorage</p>
        )}
      </div>

      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Token Information</h2>
        {tokenInfo ? (
          <div>
            <p>Token exists in localStorage</p>
            <details>
              <summary>Show token</summary>
              <pre className="bg-white p-3 rounded mt-2 text-xs">{tokenInfo}</pre>
            </details>
          </div>
        ) : (
          <p className="text-red-500">No token found in localStorage</p>
        )}
      </div>

      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">API Test Results</h2>
        {apiTest ? (
          <pre className="bg-white p-3 rounded">
            {JSON.stringify(apiTest, null, 2)}
          </pre>
        ) : apiError ? (
          <p className="text-red-500">Error: {apiError}</p>
        ) : (
          <p>No API test performed</p>
        )}
      </div>

      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Login Form</h2>
        <form 
          className="bg-white p-4 rounded"
          onSubmit={(e) => {
            e.preventDefault();
            const email = (document.getElementById('email') as HTMLInputElement).value;
            const password = (document.getElementById('password') as HTMLInputElement).value;
            
            axios.post(`${API_BASE_URL}/auth/login`, { email, password })
              .then(res => {
                if (res.data.token) {
                  localStorage.setItem('token', res.data.token);
                  localStorage.setItem('user', JSON.stringify(res.data.user));
                  window.location.reload();
                }
              })
              .catch(err => {
                alert(`Login error: ${err.response?.data?.message || err.message}`);
              });
          }}
        >
          <div className="mb-3">
            <label htmlFor="email" className="block mb-1">Email</label>
            <input 
              id="email" 
              type="email" 
              defaultValue="superadmin@agrilend.com"
              className="w-full p-2 border rounded" 
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="block mb-1">Password</label>
            <input 
              id="password" 
              type="password" 
              defaultValue="AgriLend2025!"
              className="w-full p-2 border rounded" 
            />
          </div>
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>

      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Navigation</h2>
        <div className="flex flex-col space-y-2">
          <a 
            href="/" 
            className="text-blue-500 hover:underline"
          >
            Home
          </a>
          <a 
            href="/super-admin" 
            className="text-blue-500 hover:underline"
          >
            Super Admin Dashboard
          </a>
          <a 
            href="/admin-dashboard" 
            className="text-blue-500 hover:underline"
          >
            Admin Dashboard
          </a>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-fit mt-4"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugInfo;
