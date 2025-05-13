import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../styles/Dashboard.css';

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('http://localhost:5000/api/auth/me');
        setUserData(response.data);
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        setError('Failed to load your profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-indicator">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-error">
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="banner-content">
          <div className="banner-text">
            <h1>Welcome back, {user?.name}!</h1>
            <p>Here's an overview of your account.</p>
          </div>
          <div className="banner-meta">
            <span className="login-badge">
              Last Login: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="dashboard-grid">
        {/* User Profile Card */}
        <div className="grid-main">
          <div className="content-card profile-card">
            <div className="card-header">
              <div className="header-content">
                <h3 className="section-title">User Profile</h3>
                <button 
                  onClick={() => navigate('/profile')} 
                  className="action-link"
                >
                  <span>Edit</span>
                  <svg className="action-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            {userData ? (
              <div className="card-body">
                <dl className="profile-details">
                  <div className="detail-item">
                    <dt className="detail-label">Full name</dt>
                    <dd className="detail-value">{userData.name}</dd>
                  </div>
                  <div className="detail-item">
                    <dt className="detail-label">Email address</dt>
                    <dd className="detail-value">{userData.email}</dd>
                  </div>
                  <div className="detail-item">
                    <dt className="detail-label">Role</dt>
                    <dd>
                      <span className="status-badge status-active">
                        {userData.role}
                      </span>
                    </dd>
                  </div>
                  <div className="detail-item">
                    <dt className="detail-label">Member since</dt>
                    <dd className="detail-value">
                      {new Date(userData.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className="card-body loading-state">
                <div className="skeleton-loader">
                  <div className="skeleton-line skeleton-short"></div>
                  <div className="skeleton-line skeleton-medium"></div>
                  <div className="skeleton-line skeleton-xsmall"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="grid-sidebar">
          <div className="content-card actions-card">
            <div className="card-header">
              <h3 className="section-title">Quick Actions</h3>
            </div>
            <div className="card-body">
              <div className="action-buttons">
                <button 
                  onClick={() => navigate('/profile')} 
                  className="action-tile profile-action"
                >
                  <div className="action-icon-wrapper">
                    <svg className="action-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div className="action-content">
                    <h4 className="action-title">Update Profile</h4>
                    <p className="action-description">Edit your personal information</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => navigate('/change-password')} 
                  className="action-tile password-action"
                >
                  <div className="action-icon-wrapper">
                    <svg className="action-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                    </svg>
                  </div>
                  <div className="action-content">
                    <h4 className="action-title">Change Password</h4>
                    <p className="action-description">Update your account password</p>
                  </div>
                </button>
                
                <button 
                  onClick={logout} 
                  className="action-tile logout-action"
                >
                  <div className="action-icon-wrapper">
                    <svg className="action-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                  </div>
                  <div className="action-content">
                    <h4 className="action-title">Logout</h4>
                    <p className="action-description">Sign out of your account</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
