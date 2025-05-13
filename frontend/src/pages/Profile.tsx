import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../styles/Profile.css';

interface ProfileFormData {
  name: string;
  email: string;
}

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

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
    
    try {
      const response = await axios.put(
        'http://localhost:5000/api/auth/profile', 
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setSuccess(true);
      // Update local storage with new user data
      localStorage.setItem('user', JSON.stringify(response.data));
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Header */}
        <div className="card-header">
          <h3 className="card-title">Profile Settings</h3>
          <p>Update your personal information</p>
        </div>
        
        <div className="card-body">
          {/* Success Message */}
          {success && (
            <div className="form-success" role="alert">
              <svg className="success-icon" width="20" height="20" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              <p>Profile updated successfully!</p>
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
          
          <form onSubmit={handleSubmit}>
            <div className="profile-form-grid">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <div className="input-group">
                  <svg className="detail-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-group">
                  <svg className="detail-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
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
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate(user?.role === 'superadmin' ? '/super-admin-dashboard' : user?.role === 'admin' ? '/admin-dashboard' : '/dashboard')}
                className="btn-cancel"
              >
                Cancel
              </button>
              {user?.role === 'superadmin' && (
                <button
                  type="button"
                  onClick={() => navigate('/super-admin-dashboard')}
                  className="btn-primary ml-2"
                  style={{ marginLeft: '10px', backgroundColor: '#4a37be' }}
                >
                  Go to Super Admin Dashboard
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
