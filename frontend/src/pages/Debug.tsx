import React, { useState } from 'react';
import { checkAuthStatus, testApiEndpoint } from '../utils/debugTools';

const Debug: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [authStatus, setAuthStatus] = useState<any>(null);
  const [endpoint, setEndpoint] = useState<string>('/auth/health');
  
  const checkAuth = () => {
    const status = checkAuthStatus();
    setAuthStatus(status);
  };
  
  const testApi = async () => {
    try {
      const result = await testApiEndpoint(endpoint);
      setApiStatus(result);
    } catch (error) {
      setApiStatus({ error: String(error) });
    }
  };
  
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>AgriLend Debugging Tools</h1>
      
      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h2>Authentication Status</h2>
        <button 
          onClick={checkAuth}
          style={{ padding: '8px 16px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Check Authentication
        </button>
        
        {authStatus && (
          <div style={{ marginTop: '15px' }}>
            <h3>Results:</h3>
            <div style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
              <p><strong>Token exists:</strong> {authStatus.token ? 'Yes' : 'No'}</p>
              {authStatus.user && (
                <div>
                  <p><strong>User:</strong></p>
                  <pre style={{ background: '#eee', padding: '10px', overflow: 'auto' }}>
                    {JSON.stringify(authStatus.user, null, 2)}
                  </pre>
                </div>
              )}
              {authStatus.error && (
                <div style={{ color: 'red' }}>
                  <p><strong>Error:</strong> {String(authStatus.error)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h2>API Connection Test</h2>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="endpoint" style={{ display: 'block', marginBottom: '5px' }}>
            Endpoint to test:
          </label>
          <input
            id="endpoint"
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            placeholder="/auth/health"
          />
          <p style={{ fontSize: '0.8rem', color: '#666', margin: '5px 0' }}>
            Examples: /auth/health, /loans/all, /auth/me
          </p>
        </div>
        
        <button 
          onClick={testApi}
          style={{ padding: '8px 16px', backgroundColor: '#2196f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Test API Connection
        </button>
        
        {apiStatus && (
          <div style={{ marginTop: '15px' }}>
            <h3>API Response:</h3>
            <div style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
              {apiStatus.status && (
                <p><strong>Status code:</strong> {apiStatus.status}</p>
              )}
              {apiStatus.data && (
                <div>
                  <p><strong>Data:</strong></p>
                  <pre style={{ background: '#eee', padding: '10px', overflow: 'auto' }}>
                    {JSON.stringify(apiStatus.data, null, 2)}
                  </pre>
                </div>
              )}
              {apiStatus.error && (
                <div style={{ color: 'red' }}>
                  <p><strong>Error:</strong> {String(apiStatus.error)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h2>Troubleshooting Instructions</h2>
        <ol style={{ lineHeight: '1.6' }}>
          <li><strong>Check Authentication Status:</strong> Verify your user is logged in and the token is valid</li>
          <li><strong>Test Basic API Connection:</strong> Try the /auth/health endpoint first</li>
          <li><strong>Test Protected Endpoints:</strong> Try /auth/me to verify authentication is working</li>
          <li><strong>Test Loans API:</strong> Try /loans/all to debug the "Error fetching loans" issue</li>
          <li><strong>Clear Browser Storage and Re-login:</strong> If authentication appears invalid, try logging out and back in</li>
        </ol>
      </div>
    </div>
  );
};

export default Debug;
