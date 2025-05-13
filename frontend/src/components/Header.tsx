import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Function to check if a link is active
  const isActive = (path: string) => location.pathname === path;
  
  // Function to toggle mobile menu
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <div className="logo-box">
              <span className="logo-letter">M</span>
            </div>
            <span className="logo-text">MERN<span className="logo-colored">Stack</span></span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <ul className="nav-list">
            <li>
              <Link 
                to="/" 
                className={isActive('/') ? 'nav-link nav-link-active' : 'nav-link'}
              >
                Home
              </Link>
            </li>
            
            {isAuthenticated ? (
              <>
                {user?.role === 'superadmin' ? (
                  <li>
                    <Link 
                      to="/super-admin-dashboard" 
                      className={isActive('/super-admin-dashboard') ? 'nav-link nav-link-active' : 'nav-link'}
                    >
                      Super Admin Dashboard
                    </Link>
                  </li>
                ) : user?.role === 'admin' ? (
                  <li>
                    <Link 
                      to="/admin-dashboard" 
                      className={isActive('/admin-dashboard') ? 'nav-link nav-link-active' : 'nav-link'}
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                ) : user?.role === 'farmer' ? (
                  <>
                    <li>
                      <Link 
                        to="/farmer-dashboard" 
                        className={isActive('/farmer-dashboard') ? 'nav-link nav-link-active' : 'nav-link'}
                      >
                        Farmer Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/loan-application" 
                        className={isActive('/loan-application') ? 'nav-link nav-link-active' : 'nav-link'}
                      >
                        Apply for Loan
                      </Link>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link 
                      to="/dashboard" 
                      className={isActive('/dashboard') ? 'nav-link nav-link-active' : 'nav-link'}
                    >
                      Dashboard
                    </Link>
                  </li>
                )}

                <li className="dropdown">
                  <button className="dropdown-button">
                    <span>{user?.name || 'Account'}</span>
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <div className="dropdown-menu">
                    <Link
                      to="/profile"
                      className="dropdown-item"
                    >
                      Edit Profile
                    </Link>
                    <Link
                      to="/change-password"
                      className="dropdown-item"
                    >
                      Change Password
                    </Link>
                    <Link
                      to="/settings"
                      className="dropdown-item"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={logout}
                      className="dropdown-signout"
                    >
                      Sign out
                    </button>
                  </div>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    to="/login" 
                    className={isActive('/login') ? 'nav-link nav-link-active' : 'nav-link'}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register" 
                    className="signup-button"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="mobile-menu-button"
          aria-label="Toggle menu"
        >
          {!mobileMenuOpen ? (
            <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          ) : (
            <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <ul className="mobile-nav-list">
            <li>
              <Link 
                to="/" 
                className={isActive('/') ? 'mobile-nav-link mobile-nav-link-active' : 'mobile-nav-link'}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' ? (
                  <li>
                    <Link 
                      to="/dashboard" 
                      className={isActive('/dashboard') ? 'mobile-nav-link mobile-nav-link-active' : 'mobile-nav-link'}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                ) : user?.role === 'farmer' ? (
                  <>
                    <li>
                      <Link 
                        to="/farmer-dashboard" 
                        className={isActive('/farmer-dashboard') ? 'mobile-nav-link mobile-nav-link-active' : 'mobile-nav-link'}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Farmer Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/loan-application" 
                        className={isActive('/loan-application') ? 'mobile-nav-link mobile-nav-link-active' : 'mobile-nav-link'}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Apply for Loan
                      </Link>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link 
                      to="/dashboard" 
                      className={isActive('/dashboard') ? 'mobile-nav-link mobile-nav-link-active' : 'mobile-nav-link'}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <Link 
                    to="/tasks" 
                    className={isActive('/tasks') ? 'mobile-nav-link mobile-nav-link-active' : 'mobile-nav-link'}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Tasks
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/profile" 
                    className="mobile-nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Edit Profile
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/change-password" 
                    className="mobile-nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Change Password
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/settings" 
                    className="mobile-nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="mobile-signout"
                  >
                    Sign out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    to="/login" 
                    className={isActive('/login') ? 'mobile-nav-link mobile-nav-link-active' : 'mobile-nav-link'}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register" 
                    className="signup-button"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
