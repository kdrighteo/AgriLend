import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Home.css";

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
                to={user?.role === "admin" ? "/dashboard" : "/farmer-dashboard"}
                className="nav-link"
              >
                {user?.role === "admin"
                  ? "Admin Dashboard"
                  : "Farmer Dashboard"}
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
              Access affordable financing tailored for your farm's needs. Quick
              approvals and flexible terms designed for agricultural cycles.
            </p>
            <div className="hero-buttons">
              {isAuthenticated ? (
                <Link
                  to={
                    user?.role === "admin"
                      ? "/dashboard"
                      : user?.role === "superadmin"
                        ? "/super-admin-dashboard"
                        : "/farmer-dashboard"
                  }
                  className="btn-primary"
                >
                  {user?.role === "admin"
                    ? "Review Loan Applications"
                    : "Apply for Financing"}
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
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop"
              alt="Farmer in field"
              className="hero-img"
            />
          </div>
        </div>
      </div>

      {/* Image Gallery Section */}
      <div className="gallery-section">
        <div className="gallery-container">
          <div className="section-header">
            <h2 className="section-heading">Farming in Action</h2>
            <p className="section-intro">
              See how our farmers are transforming agriculture across the region
            </p>
          </div>
          <div className="gallery-grid">
            <div className="gallery-item">
              <img
                src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop"
                alt="Crop harvesting"
                className="gallery-img"
              />
              <div className="gallery-caption">Modern Harvesting</div>
            </div>
            <div className="gallery-item">
              <img
                src="https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?w=400&h=300&fit=crop"
                alt="Farm equipment"
                className="gallery-img"
              />
              <div className="gallery-caption">Advanced Equipment</div>
            </div>
            <div className="gallery-item">
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop"
                alt="Irrigation system"
                className="gallery-img"
              />
              <div className="gallery-caption">Smart Irrigation</div>
            </div>
            <div className="gallery-item">
              <img
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop"
                alt="Greenhouse farming"
                className="gallery-img"
              />
              <div className="gallery-caption">Greenhouse Technology</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-heading">Why Choose AgricLend?</h2>
            <p className="features-intro">
              Our platform connects farmers with financial institutions to
              provide accessible, transparent, and timely agricultural
              financing.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚜</div>
              <h3 className="feature-title">Farm-Focused Lending</h3>
              <p className="feature-description">
                Loans designed specifically for agricultural needs - from
                equipment to seeds, we understand farming cycles.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Fast Approvals</h3>
              <p className="feature-description">
                Get decisions within days, not weeks. Our streamlined process
                respects your time and seasonal needs.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Credit Building</h3>
              <p className="feature-description">
                Build your agricultural credit score with each successful loan,
                unlocking better rates for future financing.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏦</div>
              <h3 className="feature-title">Trusted Partners</h3>
              <p className="feature-description">
                Work with established financial institutions that understand and
                support the agricultural sector.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Easy Management</h3>
              <p className="feature-description">
                Track applications, view loan status, and manage repayments all
                from one convenient dashboard.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3 className="feature-title">Sustainable Growth</h3>
              <p className="feature-description">
                Support for sustainable farming practices and long-term
                agricultural development.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works section */}
      <div className="how-it-works-section">
        <div className="how-it-works-container">
          <div className="section-header">
            <h2 className="section-heading">How It Works</h2>
            <p className="section-intro">
              Getting agricultural financing has never been easier. Follow these
              simple steps to access the capital your farm needs.
            </p>
          </div>

          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3 className="step-title">Create Your Profile</h3>
                <p className="step-description">
                  Register as a farmer and complete your farm profile with
                  details about your operation, crops, and experience.
                </p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3 className="step-title">Apply for Financing</h3>
                <p className="step-description">
                  Submit a loan application with your funding needs, purpose,
                  and repayment timeline preferences.
                </p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3 className="step-title">Get Matched</h3>
                <p className="step-description">
                  Our platform matches your application with suitable financial
                  institutions based on your profile and needs.
                </p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3 className="step-title">Receive Funding</h3>
                <p className="step-description">
                  Once approved, receive your funds directly and start growing
                  your agricultural business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">$10M+</div>
            <div className="stat-label">Loans Funded</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">5,000+</div>
            <div className="stat-label">Farmers Supported</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Partner Banks</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Satisfaction Rate</div>
          </div>
        </div>
      </div>

      {/* Testimonials section */}
      <div className="testimonials-section">
        <div className="testimonials-container">
          <div className="section-header">
            <h2 className="section-heading">Success Stories</h2>
            <p className="section-intro">
              Real farmers, real results. See how AgricLend has transformed
              agricultural businesses across the region.
            </p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-image">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop"
                  alt="John Mbeki"
                  className="author-avatar"
                />
              </div>
              <div className="testimonial-content">
                <p className="testimonial-text">
                  "AgricLend helped me purchase new equipment just before
                  planting season. The process was quick and the terms were
                  perfect for my cash flow. My farm productivity increased by
                  40%."
                </p>
                <div className="testimonial-author">
                  <div className="author-name">John Mbeki</div>
                  <div className="author-farm">Green Valley Farm, Kenya</div>
                  <div className="author-achievement">
                    Equipment Loan: $15,000
                  </div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-image">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop"
                  alt="Sarah Osei"
                  className="author-avatar"
                />
              </div>
              <div className="testimonial-content">
                <p className="testimonial-text">
                  "As a young farmer, getting traditional financing was
                  impossible. AgricLend understood my potential and gave me the
                  chance to grow. Now I employ 5 people and expanded my farm by
                  10 acres."
                </p>
                <div className="testimonial-author">
                  <div className="author-name">Sarah Osei</div>
                  <div className="author-farm">Sunrise Acres, Ghana</div>
                  <div className="author-achievement">Startup Loan: $8,000</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-image">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                  alt="Emmanuel Adebayo"
                  className="author-avatar"
                />
              </div>
              <div className="testimonial-content">
                <p className="testimonial-text">
                  "The seasonal repayment option is a game-changer. I can focus
                  on my harvest without worrying about monthly payments during
                  lean periods. My credit score has improved significantly."
                </p>
                <div className="testimonial-author">
                  <div className="author-name">Emmanuel Adebayo</div>
                  <div className="author-farm">Golden Harvest, Nigeria</div>
                  <div className="author-achievement">Crop Loan: $25,000</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-image">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop"
                  alt="Grace Kimani"
                  className="author-avatar"
                />
              </div>
              <div className="testimonial-content">
                <p className="testimonial-text">
                  "I used AgricLend to install a modern irrigation system. Water
                  efficiency improved by 60% and my crop yields doubled. The
                  investment paid for itself in just 8 months."
                </p>
                <div className="testimonial-author">
                  <div className="author-name">Grace Kimani</div>
                  <div className="author-farm">Highland Farms, Tanzania</div>
                  <div className="author-achievement">
                    Infrastructure Loan: $32,000
                  </div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-image">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                  alt="David Mensah"
                  className="author-avatar"
                />
              </div>
              <div className="testimonial-content">
                <p className="testimonial-text">
                  "After years of struggling with traditional banks, AgricLend
                  gave me the opportunity to expand my poultry business. I now
                  supply eggs to 20 local schools and restaurants."
                </p>
                <div className="testimonial-author">
                  <div className="author-name">David Mensah</div>
                  <div className="author-farm">Mensah Poultry, Ghana</div>
                  <div className="author-achievement">
                    Business Expansion: $12,000
                  </div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-image">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
                  alt="Fatima Ibrahim"
                  className="author-avatar"
                />
              </div>
              <div className="testimonial-content">
                <p className="testimonial-text">
                  "The credit building feature helped me establish a strong
                  financial profile. After 3 successful loans, I qualified for
                  larger financing to purchase additional farmland."
                </p>
                <div className="testimonial-author">
                  <div className="author-name">Fatima Ibrahim</div>
                  <div className="author-farm">Ibrahim Estates, Nigeria</div>
                  <div className="author-achievement">
                    Land Purchase: $50,000
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="cta-section">
        <div className="cta-container">
          <h2 className="cta-heading">Ready to Grow Your Farm?</h2>
          <p className="cta-text">
            Join farmers across the country who have accessed over $10 million
            in agricultural financing through our platform.
          </p>
          <div className="cta-button-container">
            <Link
              to={
                isAuthenticated
                  ? user?.role === "admin"
                    ? "/dashboard"
                    : "/loan-application"
                  : "/register"
              }
              className="cta-button"
            >
              {isAuthenticated
                ? user?.role === "admin"
                  ? "Review Applications"
                  : "Apply for Loan"
                : "Get Started Today"}
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
                Agricultural financing solutions designed to support farmers and
                agricultural businesses.
              </p>
            </div>
            <div className="footer-links">
              <h4>Loan Products</h4>
              <ul>
                <li>
                  <a href="#">Equipment Financing</a>
                </li>
                <li>
                  <a href="#">Crop Loans</a>
                </li>
                <li>
                  <a href="#">Land Purchase</a>
                </li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Resources</h4>
              <ul>
                <li>
                  <a href="#">Farming Tips</a>
                </li>
                <li>
                  <a href="#">Success Stories</a>
                </li>
                <li>
                  <a href="#">FAQ</a>
                </li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Contact</h4>
              <ul>
                <li>
                  <a href="#">Support</a>
                </li>
                <li>
                  <a href="#">Branches</a>
                </li>
                <li>
                  <a href="#">Partnership</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-copyright">
            <p>
              &copy; {new Date().getFullYear()} AgriLend. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
