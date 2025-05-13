import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../styles/Settings.css';

interface UserSettings {
  emailNotifications: boolean;
  darkMode: boolean;
  language: string;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    darkMode: false,
    language: 'english'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  // In a real application, you would fetch the user's settings
  useEffect(() => {
    // Simulating settings fetch
    setLoading(true);
    setTimeout(() => {
      // This would be replaced with an actual API call in a real app
      setSettings({
        emailNotifications: true,
        darkMode: false,
        language: 'english'
      });
      setLoading(false);
    }, 800);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleToggle = (setting: keyof UserSettings) => {
    if (typeof settings[setting] === 'boolean') {
      setSettings({
        ...settings,
        [setting]: !settings[setting]
      });
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };

  const handleSaveSettings = () => {
    setLoading(true);
    setSuccess(false);
    setError('');

    // In a real application, this would be an API call
    setTimeout(() => {
      // Simulating API response
      setSuccess(true);
      setLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1000);
  };

  const handleResetDefaults = () => {
    setSettings({
      emailNotifications: true,
      darkMode: false,
      language: 'english'
    });
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <div className="card-header">
          <h3 className="card-title">Account Settings</h3>
          <p className="card-subtitle">Manage your preferences and account settings</p>
        </div>
        
        <div className="card-body">
          {/* Success Message */}
          {success && (
            <div className="form-success" role="alert">
              <svg className="success-icon" width="20" height="20" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              <p>Settings saved successfully!</p>
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
          
          {/* Settings Tabs */}
          <div className="settings-tabs">
            <div 
              className={`tab ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => handleTabChange('general')}
            >
              General
            </div>
            <div 
              className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => handleTabChange('notifications')}
            >
              Notifications
            </div>
            <div 
              className={`tab ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => handleTabChange('appearance')}
            >
              Appearance
            </div>
          </div>
          
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="settings-section">
              <h4 className="section-title">General Settings</h4>
              
              <div className="setting-item">
                <div className="setting-content">
                  <div className="setting-label">Language</div>
                  <div className="setting-description">Select your preferred language</div>
                </div>
                <div className="select-wrapper">
                  <select 
                    name="language"
                    value={settings.language}
                    onChange={handleSelectChange}
                    className="settings-select"
                  >
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h4 className="section-title">Notification Settings</h4>
              
              <div className="setting-item">
                <div className="setting-content">
                  <div className="setting-label">Email Notifications</div>
                  <div className="setting-description">Receive updates and notifications via email</div>
                </div>
                <label className="toggle-button">
                  <input 
                    type="checkbox" 
                    checked={settings.emailNotifications}
                    onChange={() => handleToggle('emailNotifications')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}
          
          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h4 className="section-title">Appearance Settings</h4>
              
              <div className="setting-item">
                <div className="setting-content">
                  <div className="setting-label">Dark Mode</div>
                  <div className="setting-description">Switch between light and dark themes</div>
                </div>
                <label className="toggle-button">
                  <input 
                    type="checkbox" 
                    checked={settings.darkMode}
                    onChange={() => handleToggle('darkMode')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}
          
          <div className="action-buttons">
            <button 
              type="button" 
              className="btn-reset"
              onClick={handleResetDefaults}
            >
              Reset to Defaults
            </button>
            <button 
              type="button" 
              className="btn-save"
              onClick={handleSaveSettings}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
