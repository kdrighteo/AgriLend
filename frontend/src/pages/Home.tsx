import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Home.css';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-container">
      {/* Top navigation bar */}
      <nav className="nav-bar">
        <div className="nav-container">
          <div className="nav-logo">AgriLend</div>
          <div className="nav-links">
            {isAuthenticated ? (
              <Link 
                to={user?.role === 'admin' ? '/dashboard' : '/farmer-dashboard'} 
                className="nav-link"
              >
                {user?.role === 'admin' ? 'Admin Dashboard' : 'Farmer Dashboard'}
              </Link>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Sign In
                </Link>
                <Link to="/register" className="nav-button">
                  Register as Farmer
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <div className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-heading">
              Agricultural Lending <br />
              <span>for Farmers</span>
            </h1>
            <p className="hero-text">
              Access affordable financing tailored for your farm's needs. Quick approvals and flexible terms designed for agricultural cycles.
            </p>
            <div className="hero-buttons">
              <Link to="/debug" className="nav-button" style={{marginRight: '10px'}}>
                Debug Page
              </Link>
              {isAuthenticated ? (
                <Link 
                  to={user?.role === 'admin' ? '/dashboard' : (user?.role === 'superadmin' ? '/super-admin-dashboard' : '/farmer-dashboard')} 
                  className="btn-primary"
                >
                  {user?.role === 'admin' ? 'Review Loan Applications' : 'Apply for Financing'}
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary">
                    Register as Farmer
                  </Link>
                  <Link to="/register-admin" className="btn-secondary">
                    Register as Bank
                  </Link>
                  <Link to="/login" className="btn-text-link">
                    Already have an account? Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">
              <div className="placeholder-content">
                <div className="placeholder-title">Agricultural Financing</div>
                <p className="placeholder-text">Supporting farmers with capital when they need it most</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-heading">Financing Solutions for Farmers</h2>
            <p className="features-intro">
              Our lending platform is designed specifically for agricultural needs, with features that understand farming cycles.
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-number">
                <span>01</span>
              </div>
              <h3 className="feature-title">Quick Application Process</h3>
              <p className="feature-description">
                Simple online application with minimal documentation. Get approved within days, not weeks.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-number">
                <span>02</span>
              </div>
              <h3 className="feature-title">Seasonal Repayment Options</h3>
              <p className="feature-description">
                Flexible repayment schedules aligned with harvest cycles and seasonal cash flow patterns.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-number">
                <span>03</span>
              </div>
              <h3 className="feature-title">Competitive Interest Rates</h3>
              <p className="feature-description">
                Fair and transparent pricing with rates designed specifically for agricultural businesses.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="cta-section">
        <div className="cta-container">
          <h2 className="cta-heading">Ready to Grow Your Farm?</h2>
          <p className="cta-text">
            Join farmers across the country who have accessed over $10 million in agricultural financing through our platform.
          </p>
          <div className="cta-button-container">
            <Link 
              to={isAuthenticated ? 
                  (user?.role === 'admin' ? '/dashboard' : '/loan-application') : 
                  '/register'} 
              className="cta-button"
            >
              {isAuthenticated ? 
                (user?.role === 'admin' ? 'Review Applications' : 'Apply for Loan') : 
                'Get Started Today'}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>AgriLend</h3>
              <p>
                Agricultural financing solutions designed to support farmers and agricultural businesses.
              </p>
            </div>
            <div className="footer-links">
              <h4>Loan Products</h4>
              <ul>
                <li><a href="#">Equipment Financing</a></li>
                <li><a href="#">Crop Loans</a></li>
                <li><a href="#">Land Purchase</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Farming Tips</a></li>
                <li><a href="#">Success Stories</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Contact</h4>
              <ul>
                <li><a href="#">Support</a></li>
                <li><a href="#">Branches</a></li>
                <li><a href="#">Partnership</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-copyright">
            <p>&copy; {new Date().getFullYear()} AgriLend. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
