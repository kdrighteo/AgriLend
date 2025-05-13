import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ChangePassword.css';

const ChangePassword: React.FC = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { currentPassword, newPassword, confirmPassword } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear success and error messages when user starts typing
    setSuccess(false);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      setLoading(false);
      return;
    }
    
    try {
      await axios.put(
        'http://localhost:5000/api/auth/change-password', 
        { currentPassword, newPassword },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password');
      setLoading(false);
    }
  };

  return (
    <div className="password-container">
      <div className="password-card">
        {/* Header */}
        <div className="card-header">
          <h3 className="card-title">Change Password</h3>
          <p className="card-subtitle">Update your account password</p>
        </div>
        
        <div className="card-body">
          {/* Success Message */}
          {success && (
            <div className="form-success" role="alert">
              <svg className="success-icon" width="20" height="20" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              <p>Password changed successfully!</p>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="form-error" role="alert">
              <svg className="error-icon" width="20" height="20" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="password-form">
            <div className="form-group">
              <label htmlFor="currentPassword" className="form-label">
                Current Password
              </label>
              <div className="input-group">
                <svg className="input-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <input
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <div className="input-group">
                <svg className="input-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                </svg>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  value={newPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="form-input"
                />
              </div>
              <p className="form-hint">Password must be at least 6 characters</p>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm New Password
              </label>
              <div className="input-group">
                <svg className="input-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="form-input"
                />
              </div>
            </div>

            <div className="action-buttons">
              <button
                type="submit"
                disabled={loading}
                className="btn-save"
              >
                {loading ? (
                  <>
                    <svg className="loading-icon" width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : 'Change Password'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
