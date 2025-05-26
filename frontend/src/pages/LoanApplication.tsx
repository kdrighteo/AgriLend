import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../styles/LoanApplication.css';
import API_BASE_URL from '../config/api';

interface LoanFormData {
  amount: string;
  purpose: string;
  description: string;
  termLength: string;
  termUnit: string;
  collateral: string;
  cropType: string;
  farmingCycle: string;
  estimatedYield: string;
  estimatedRevenue: string;
  revenueUnit: string;
}

const LoanApplication: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submittedLoan, setSubmittedLoan] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<LoanFormData>({
    amount: '',
    purpose: '',
    description: '',
    termLength: '6',
    termUnit: 'months',
    collateral: '',
    cropType: '',
    farmingCycle: 'seasonal',
    estimatedYield: '',
    estimatedRevenue: '',
    revenueUnit: 'total'
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle navigation between steps
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Convert string values to numbers where appropriate
      const loanData = {
        amount: parseFloat(formData.amount),
        purpose: formData.purpose,
        description: formData.description,
        termLength: parseInt(formData.termLength),
        termUnit: formData.termUnit,
        collateral: formData.collateral,
        cropType: formData.cropType,
        farmingCycle: formData.farmingCycle,
        estimatedYield: formData.estimatedYield ? parseFloat(formData.estimatedYield) : undefined,
        estimatedRevenue: formData.estimatedRevenue ? parseFloat(formData.estimatedRevenue) : undefined,
        revenueUnit: formData.revenueUnit
      };

      // Submit loan application
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/loans`,
        loanData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setSubmittedLoan(response.data);
      setSubmissionSuccess(true);
      // No need to navigate away, show success message instead
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit loan application');
      console.error('Error submitting loan application:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eligibility check based on credit score
  const getEligibilityStatus = () => {
    const creditScore = user?.creditScore || 0;
    
    if (creditScore >= 70) {
      return { status: 'good', message: 'Good eligibility for loan approval' };
    } else if (creditScore >= 40) {
      return { status: 'medium', message: 'Moderate eligibility for loan approval' };
    } else {
      return { status: 'poor', message: 'Limited eligibility for loan approval' };
    }
  };

  const eligibility = getEligibilityStatus();

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Success view after submission
  if (submissionSuccess && submittedLoan) {
    return (
      <div className="loan-container">
        <div className="loan-form-card">
          <div className="loan-success">
            <div className="success-icon">✓</div>
            <h2 className="success-title">Loan Application Submitted!</h2>
            <p className="success-message">
              Your loan application has been successfully submitted and is now pending review. 
              You will be notified once there is an update on your application.
            </p>
            
            <div className="success-details">
              <div className="detail-row">
                <span className="detail-label">Application ID</span>
                <span className="detail-value application-id">{submittedLoan._id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Loan Amount</span>
                <span className="detail-value">${submittedLoan.amount.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Purpose</span>
                <span className="detail-value">{submittedLoan.purpose}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span className="detail-value">{submittedLoan.status.charAt(0).toUpperCase() + submittedLoan.status.slice(1)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date Submitted</span>
                <span className="detail-value">{formatDate(submittedLoan.submittedAt)}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/dashboard')} 
              className="btn-submit"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="loan-container">
      <div className="loan-header">
        <h1 className="loan-title">Agricultural Loan Application</h1>
        <p className="loan-subtitle">Fill out the form below to apply for a loan for your farming needs</p>
      </div>

      {/* Step Indicator */}
      <div className="step-indicator">
        <div className={`step ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Loan Details</div>
        </div>
        <div className={`step ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Farm Information</div>
        </div>
        <div className={`step ${currentStep === 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Review & Submit</div>
        </div>
      </div>

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
        {/* Step 1: Loan Details */}
        {currentStep === 1 && (
          <div className="loan-form-card">
            <div className="form-section">
              <h3 className="section-title">Loan Details</h3>

              <div className="form-group">
                <label htmlFor="amount" className="form-label">Loan Amount (USD)*</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="100"
                  step="100"
                  required
                  className="form-input"
                  placeholder="5000"
                />
                <small className="form-hint">Minimum loan amount is $100</small>
              </div>

              <div className="form-group">
                <label htmlFor="purpose" className="form-label">Loan Purpose*</label>
                <input
                  type="text"
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="e.g., Purchase of farming equipment"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">Detailed Description*</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="form-textarea"
                  placeholder="Provide details about how you plan to use the loan..."
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="termLength" className="form-label">Loan Term Length*</label>
                  <input
                    type="number"
                    id="termLength"
                    name="termLength"
                    value={formData.termLength}
                    onChange={handleChange}
                    min="1"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="termUnit" className="form-label">Term Unit</label>
                  <select
                    id="termUnit"
                    name="termUnit"
                    value={formData.termUnit}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="collateral" className="form-label">Collateral (if any)</label>
                <input
                  type="text"
                  id="collateral"
                  name="collateral"
                  value={formData.collateral}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Farm equipment, land title"
                />
                <small className="form-hint">Providing collateral may increase your chances of loan approval</small>
              </div>
            </div>

            <div className="form-buttons">
              <button type="button" className="btn-submit" onClick={handleNextStep}>
                Next
                <svg className="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Farm Information */}
        {currentStep === 2 && (
          <div className="loan-form-card">
            <div className="form-section">
              <h3 className="section-title">Crop & Yield Information</h3>

              <div className="form-group">
                <label htmlFor="cropType" className="form-label">Main Crop for this Loan*</label>
                <input
                  type="text"
                  id="cropType"
                  name="cropType"
                  value={formData.cropType}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="e.g., Corn, Wheat, Rice"
                />
              </div>

              <div className="form-group">
                <label htmlFor="farmingCycle" className="form-label">Farming Cycle*</label>
                <select
                  id="farmingCycle"
                  name="farmingCycle"
                  value={formData.farmingCycle}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="seasonal">Seasonal</option>
                  <option value="annual">Annual</option>
                  <option value="perennial">Perennial</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="estimatedYield" className="form-label">Estimated Yield (tons/bushels)</label>
                <input
                  type="number"
                  id="estimatedYield"
                  name="estimatedYield"
                  value={formData.estimatedYield}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="form-input"
                  placeholder="e.g., 50"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="estimatedRevenue" className="form-label">Estimated Revenue (USD)</label>
                  <input
                    type="number"
                    id="estimatedRevenue"
                    name="estimatedRevenue"
                    value={formData.estimatedRevenue}
                    onChange={handleChange}
                    min="0"
                    step="100"
                    className="form-input"
                    placeholder="e.g., 15000"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="revenueUnit" className="form-label">Revenue Calculation Basis</label>
                  <select
                    id="revenueUnit"
                    name="revenueUnit"
                    value={formData.revenueUnit}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="total">Total Revenue</option>
                    <option value="per-acre">Per Acre</option>
                    <option value="per-hectare">Per Hectare</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-buttons">
              <button type="button" className="btn-cancel" onClick={handlePrevStep}>
                Back
              </button>
              <button type="button" className="btn-submit" onClick={handleNextStep}>
                Next
                <svg className="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review and Submit */}
        {currentStep === 3 && (
          <div className="loan-form-card">
            <div className="form-section">
              <h3 className="section-title">Review and Submit</h3>
              
              <div className="credit-score-info">
                <div>
                  <div className="credit-score-label">Your Credit Score</div>
                  <div className={`eligibility-message eligibility-${eligibility.status}`}>
                    {eligibility.message}
                  </div>
                </div>
                <div className="credit-score-value">{user?.creditScore || 0}</div>
              </div>

              <div className="review-section">
                <h4>Loan Details</h4>
                <div className="detail-row">
                  <span className="detail-label">Amount</span>
                  <span className="detail-value">${parseFloat(formData.amount).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Purpose</span>
                  <span className="detail-value">{formData.purpose}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Term</span>
                  <span className="detail-value">{formData.termLength} {formData.termUnit}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Collateral</span>
                  <span className="detail-value">{formData.collateral || 'None'}</span>
                </div>
              </div>

              <div className="review-section">
                <h4>Crop Information</h4>
                <div className="detail-row">
                  <span className="detail-label">Main Crop</span>
                  <span className="detail-value">{formData.cropType}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Farming Cycle</span>
                  <span className="detail-value">{formData.farmingCycle.charAt(0).toUpperCase() + formData.farmingCycle.slice(1)}</span>
                </div>
                {formData.estimatedYield && (
                  <div className="detail-row">
                    <span className="detail-label">Estimated Yield</span>
                    <span className="detail-value">{formData.estimatedYield} tons/bushels</span>
                  </div>
                )}
                {formData.estimatedRevenue && (
                  <div className="detail-row">
                    <span className="detail-label">Estimated Revenue</span>
                    <span className="detail-value">
                      ${parseFloat(formData.estimatedRevenue).toLocaleString()}
                      {formData.revenueUnit !== 'total' && ` (${formData.revenueUnit})`}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <div className="terms-checkbox">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    required 
                    className="form-checkbox"
                  />
                  <label htmlFor="terms" className="checkbox-label">
                    I confirm that all information provided is accurate and complete. I understand that providing false information may result in loan rejection.
                  </label>
                </div>
              </div>
            </div>

            <div className="form-buttons">
              <button type="button" className="btn-cancel" onClick={handlePrevStep}>
                Back
              </button>
              <button 
                type="submit" 
                className="btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="button-icon animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : 'Submit Application'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default LoanApplication;
