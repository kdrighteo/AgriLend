import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Auth.css';
import '../styles/FarmerRegister.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    farmName: '',
    farmLocation: '',
    farmSize: '',
    farmSizeUnit: 'acres',
    phoneNumber: '',
    farmingExperience: '',
    mainCrops: ''
  });
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();

  const { 
    name, 
    email, 
    password, 
    confirmPassword, 
    farmName, 
    farmLocation, 
    farmSize, 
    farmSizeUnit, 
    phoneNumber, 
    farmingExperience, 
    mainCrops 
  } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      // Convert string values to appropriate types
      const farmData = {
        name,
        email,
        password,
        farmName,
        farmLocation,
        farmSize: farmSize ? parseFloat(farmSize) : undefined,
        farmSizeUnit,
        phoneNumber,
        farmingExperience: farmingExperience ? parseInt(farmingExperience) : undefined,
        mainCrops: mainCrops ? mainCrops.split(',').map(crop => crop.trim()) : []
      };
      
      await register(farmData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <h1>Farmer Registration</h1>
          <p>Register your farm to access agricultural loans</p>
        </div>
        
        <div className="auth-body">
          {/* Error Message */}
          {error && (
            <div className="form-error" role="alert">
              <svg className="form-error-icon" width="20" height="20" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <p>{error}</p>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit}>
            <h3 className="section-title">Personal Information</h3>
            
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name*
              </label>
              <div className="input-group">
                <svg className="input-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address*
              </label>
              <div className="input-group">
                <svg className="input-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number*
              </label>
              <div className="input-group">
                <svg className="input-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={handleChange}
                  placeholder="(123) 456-7890"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password*
              </label>
              <div className="input-group">
                <svg className="input-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password*
              </label>
              <div className="input-group">
                <svg className="input-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input"
                />
              </div>
            </div>
            
            <h3 className="section-title">Farm Information</h3>
            
            <div className="form-group">
              <label htmlFor="farmName" className="form-label">
                Farm Name*
              </label>
              <div className="input-group">
                <svg className="input-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <input
                  id="farmName"
                  name="farmName"
                  type="text"
                  required
                  value={farmName}
                  onChange={handleChange}
                  placeholder="Green Valley Farm"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="farmLocation" className="form-label">
                Farm Location/Address*
              </label>
              <div className="input-group">
                <svg className="input-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <input
                  id="farmLocation"
                  name="farmLocation"
                  type="text"
                  required
                  value={farmLocation}
                  onChange={handleChange}
                  placeholder="123 Farm Road, Rural County"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group form-group-half">
                <label htmlFor="farmSize" className="form-label">
                  Farm Size*
                </label>
                <input
                  id="farmSize"
                  name="farmSize"
                  type="number"
                  min="0"
                  step="0.1"
                  required
                  value={farmSize}
                  onChange={handleChange}
                  placeholder="5.5"
                  className="form-input"
                />
              </div>
              
              <div className="form-group form-group-half">
                <label htmlFor="farmSizeUnit" className="form-label">
                  Unit
                </label>
                <select
                  id="farmSizeUnit"
                  name="farmSizeUnit"
                  value={farmSizeUnit}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="farmingExperience" className="form-label">
                Years of Farming Experience*
              </label>
              <input
                id="farmingExperience"
                name="farmingExperience"
                type="number"
                min="0"
                required
                value={farmingExperience}
                onChange={handleChange}
                placeholder="5"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="mainCrops" className="form-label">
                Main Crops/Products (comma-separated)*
              </label>
              <textarea
                id="mainCrops"
                name="mainCrops"
                required
                value={mainCrops}
                onChange={handleChange}
                placeholder="Corn, Wheat, Soybeans"
                className="form-textarea"
              />
              <small className="form-hint">List your main crops or agricultural products, separated by commas</small>
            </div>

            <div className="terms-checkbox">
              <input 
                type="checkbox" 
                id="terms" 
                required 
                className="form-checkbox"
              />
              <label htmlFor="terms" className="checkbox-label">
                I agree to the <a href="#" className="terms-link">Terms and Conditions</a> for farmers
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="auth-button"
            >
              {isLoading ? (
                <>
                  <svg className="button-icon" width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : 'Register as a Farmer'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
