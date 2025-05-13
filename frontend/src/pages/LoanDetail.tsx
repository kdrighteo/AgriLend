import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as loanService from '../services/loanService';
import '../styles/LoanDetail.css';

interface LoanDetail {
  _id: string;
  amount: number;
  purpose: string;
  description: string;
  status: string;
  termLength: number;
  termUnit: string;
  collateral?: string;
  cropType: string;
  farmingCycle: string;
  estimatedYield?: number;
  estimatedRevenue?: number;
  revenueUnit?: string;
  submittedAt: string;
  reviewedAt?: string;
  updatedAt: string;
  adminNotes?: string;
  approvedAmount?: number;
  rejectReason?: string;
  riskScore?: number;
  farmer: {
    _id: string;
    name: string;
    email: string;
    farmName?: string;
    farmLocation?: string;
    creditScore?: number;
    phoneNumber?: string;
  };
  adminId?: {
    _id: string;
    name: string;
    email: string;
  };
}

const LoanDetail: React.FC = () => {
  const { loanId } = useParams<{ loanId: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [loan, setLoan] = useState<LoanDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const [reviewData, setReviewData] = useState({
    status: 'under-review',
    adminNotes: '',
    riskScore: 50,
    approvedAmount: '',
    rejectReason: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch loan details
  useEffect(() => {
    const fetchLoanDetails = async () => {
      if (!loanId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const loanData = await loanService.getLoanById(loanId);
        setLoan(loanData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch loan details');
        console.error('Error fetching loan details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchLoanDetails();
    }
  }, [loanId, isAuthenticated]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReviewData({ ...reviewData, [name]: value });
  };

  // Handle risk score slider change
  const handleRiskScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReviewData({ ...reviewData, riskScore: parseInt(e.target.value) });
  };

  // Handle review form submission
  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loanId) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Prepare review data
      const formData: loanService.LoanReviewData = {
        status: reviewData.status,
        adminNotes: reviewData.adminNotes,
        riskScore: reviewData.riskScore
      };
      
      // Add conditional fields based on status
      if (reviewData.status === 'approved') {
        formData.approvedAmount = parseFloat(reviewData.approvedAmount);
      } else if (reviewData.status === 'rejected') {
        formData.rejectReason = reviewData.rejectReason;
      }
      
      // Submit the review
      await loanService.updateLoanStatus(loanId, formData);
      
      // Show success message and refresh loan data
      setSuccessMessage('Loan application has been successfully updated.');
      
      // Refresh loan data
      const updatedLoan = await loanService.getLoanById(loanId);
      setLoan(updatedLoan);
      setShowReviewForm(false);
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update loan status');
      console.error('Error updating loan status:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'status-badge-pending';
      case 'under-review':
        return 'status-badge-review';
      case 'approved':
        return 'status-badge-approved';
      case 'funded':
        return 'status-badge-funded';
      case 'rejected':
        return 'status-badge-rejected';
      case 'repaid':
        return 'status-badge-repaid';
      default:
        return 'status-badge-pending';
    }
  };

  // Format status text
  const formatStatus = (status: string): string => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (isLoading) {
    return (
      <div className="loan-detail-container">
        <div className="loading-spinner-container">
          <svg className="loading-spinner" width="40" height="40" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>Loading loan details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loan-detail-container">
        <div className="error-container">
          <svg className="error-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <h2>Error Loading Loan</h2>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="loan-detail-container">
        <div className="error-container">
          <h2>Loan Not Found</h2>
          <p>The loan application you're looking for doesn't exist or you don't have permission to view it.</p>
          <button onClick={() => navigate(-1)} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="loan-detail-container">
      <div className="loan-detail-header">
        <div>
          <h1 className="loan-detail-title">Loan Application</h1>
          <p className="loan-id">ID: {loan._id}</p>
        </div>
        
        <div className="loan-status-container">
          <span className={`status-badge ${getStatusBadgeClass(loan.status)}`}>
            {formatStatus(loan.status)}
          </span>
          <p className="loan-date">Submitted on {formatDate(loan.submittedAt)}</p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          <svg className="success-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M5 13l4 4L19 7"></path>
          </svg>
          <p>{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <svg className="error-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <p>{error}</p>
        </div>
      )}

      <div className="loan-detail-content">
        <div className="loan-detail-card">
          <h2 className="card-title">Loan Details</h2>
          
          <div className="loan-info-grid">
            <div className="info-item">
              <h3 className="info-label">Amount Requested</h3>
              <p className="info-value">{formatCurrency(loan.amount)}</p>
            </div>
            
            {loan.approvedAmount && (
              <div className="info-item">
                <h3 className="info-label">Amount Approved</h3>
                <p className="info-value approved-amount">{formatCurrency(loan.approvedAmount)}</p>
              </div>
            )}
            
            <div className="info-item">
              <h3 className="info-label">Purpose</h3>
              <p className="info-value">{loan.purpose}</p>
            </div>
            
            <div className="info-item">
              <h3 className="info-label">Term</h3>
              <p className="info-value">{loan.termLength} {loan.termUnit}</p>
            </div>
            
            <div className="info-item">
              <h3 className="info-label">Collateral</h3>
              <p className="info-value">{loan.collateral || 'None'}</p>
            </div>
          </div>
          
          <div className="loan-description">
            <h3 className="info-label">Description</h3>
            <p className="description-text">{loan.description}</p>
          </div>
        </div>

        <div className="loan-detail-card">
          <h2 className="card-title">Farm Details</h2>
          
          <div className="loan-info-grid">
            <div className="info-item">
              <h3 className="info-label">Crop Type</h3>
              <p className="info-value">{loan.cropType}</p>
            </div>
            
            <div className="info-item">
              <h3 className="info-label">Farming Cycle</h3>
              <p className="info-value">{formatStatus(loan.farmingCycle)}</p>
            </div>
            
            {loan.estimatedYield && (
              <div className="info-item">
                <h3 className="info-label">Estimated Yield</h3>
                <p className="info-value">{loan.estimatedYield} tons/bushels</p>
              </div>
            )}
            
            {loan.estimatedRevenue && (
              <div className="info-item">
                <h3 className="info-label">Estimated Revenue</h3>
                <p className="info-value">
                  {formatCurrency(loan.estimatedRevenue)}
                  {loan.revenueUnit !== 'total' && ` (${loan.revenueUnit})`}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="loan-detail-card">
          <h2 className="card-title">Applicant Information</h2>
          
          <div className="loan-info-grid">
            <div className="info-item">
              <h3 className="info-label">Farmer Name</h3>
              <p className="info-value">{loan.farmer.name}</p>
            </div>
            
            <div className="info-item">
              <h3 className="info-label">Email</h3>
              <p className="info-value">{loan.farmer.email}</p>
            </div>
            
            {loan.farmer.farmName && (
              <div className="info-item">
                <h3 className="info-label">Farm Name</h3>
                <p className="info-value">{loan.farmer.farmName}</p>
              </div>
            )}
            
            {loan.farmer.farmLocation && (
              <div className="info-item">
                <h3 className="info-label">Farm Location</h3>
                <p className="info-value">{loan.farmer.farmLocation}</p>
              </div>
            )}
            
            {loan.farmer.phoneNumber && (
              <div className="info-item">
                <h3 className="info-label">Phone Number</h3>
                <p className="info-value">{loan.farmer.phoneNumber}</p>
              </div>
            )}
            
            {loan.farmer.creditScore !== undefined && (
              <div className="info-item">
                <h3 className="info-label">Credit Score</h3>
                <p className="info-value credit-score">{loan.farmer.creditScore}</p>
              </div>
            )}
          </div>
        </div>

        {/* Admin Review Section - Only show if loan has been reviewed */}
        {(loan.adminNotes || loan.rejectReason || loan.riskScore) && (
          <div className="loan-detail-card">
            <h2 className="card-title">Admin Review</h2>
            
            <div className="loan-info-grid">
              {loan.reviewedAt && (
                <div className="info-item">
                  <h3 className="info-label">Reviewed On</h3>
                  <p className="info-value">{formatDate(loan.reviewedAt)}</p>
                </div>
              )}
              
              {loan.adminId && (
                <div className="info-item">
                  <h3 className="info-label">Reviewed By</h3>
                  <p className="info-value">{loan.adminId.name}</p>
                </div>
              )}
              
              {loan.riskScore !== undefined && (
                <div className="info-item">
                  <h3 className="info-label">Risk Assessment</h3>
                  <p className="info-value risk-score">{loan.riskScore}/100</p>
                </div>
              )}
            </div>
            
            {loan.adminNotes && (
              <div className="admin-notes">
                <h3 className="info-label">Admin Notes</h3>
                <p className="notes-text">{loan.adminNotes}</p>
              </div>
            )}
            
            {loan.rejectReason && (
              <div className="reject-reason">
                <h3 className="info-label">Reason for Rejection</h3>
                <p className="notes-text reject-text">{loan.rejectReason}</p>
              </div>
            )}
          </div>
        )}

        {/* Admin Review Form - Only show if admin is logged in and loan is pending or under review */}
        {user?.role === 'admin' && ['pending', 'under-review'].includes(loan.status) && (
          <div className="loan-detail-card">
            <div className="review-header">
              <h2 className="card-title">Review Application</h2>
              <button 
                className="toggle-review-button"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? 'Hide Form' : 'Show Form'}
              </button>
            </div>
            
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="review-form">
                <div className="form-group">
                  <label htmlFor="status" className="form-label">Decision</label>
                  <select
                    id="status"
                    name="status"
                    value={reviewData.status}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="under-review">Under Review</option>
                    <option value="approved">Approve</option>
                    <option value="rejected">Reject</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="riskScore" className="form-label">Risk Assessment (0-100)</label>
                  <div className="risk-slider-container">
                    <input
                      type="range"
                      id="riskScore"
                      name="riskScore"
                      min="0"
                      max="100"
                      value={reviewData.riskScore}
                      onChange={handleRiskScoreChange}
                      className="risk-slider"
                    />
                    <div className="risk-score-value">{reviewData.riskScore}</div>
                    <div className="risk-labels">
                      <span className="risk-label">Low Risk</span>
                      <span className="risk-label">Medium Risk</span>
                      <span className="risk-label">High Risk</span>
                    </div>
                  </div>
                </div>
                
                {reviewData.status === 'approved' && (
                  <div className="form-group">
                    <label htmlFor="approvedAmount" className="form-label">Approved Amount</label>
                    <input
                      type="number"
                      id="approvedAmount"
                      name="approvedAmount"
                      value={reviewData.approvedAmount}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter approved amount"
                      min="100"
                      step="100"
                      required={reviewData.status === 'approved'}
                    />
                    <small className="form-hint">Must be at least $100</small>
                  </div>
                )}
                
                {reviewData.status === 'rejected' && (
                  <div className="form-group">
                    <label htmlFor="rejectReason" className="form-label">Reason for Rejection</label>
                    <textarea
                      id="rejectReason"
                      name="rejectReason"
                      value={reviewData.rejectReason}
                      onChange={handleChange}
                      className="form-textarea"
                      placeholder="Provide reason for rejecting this application"
                      required={reviewData.status === 'rejected'}
                    ></textarea>
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="adminNotes" className="form-label">Admin Notes</label>
                  <textarea
                    id="adminNotes"
                    name="adminNotes"
                    value={reviewData.adminNotes}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Add notes about this application (will be visible to internal staff only)"
                  ></textarea>
                </div>
                
                <div className="form-buttons">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      <div className="loan-detail-actions">
        <button onClick={() => navigate(-1)} className="back-button">
          <svg className="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        
        {/* If user is a farmer and loan is rejected, show apply again button */}
        {user?.role === 'farmer' && loan.status === 'rejected' && (
          <Link to="/loan-application" className="apply-again-button">
            Apply Again
          </Link>
        )}
        
        {/* If admin and loan is approved, show mark as funded button */}
        {user?.role === 'admin' && loan.status === 'approved' && (
          <button 
            className="fund-button"
            onClick={async () => {
              try {
                setIsLoading(true);
                await loanService.markLoanFunded(loan._id);
                const updatedLoan = await loanService.getLoanById(loan._id);
                setLoan(updatedLoan);
                setSuccessMessage('Loan has been marked as funded');
                setTimeout(() => {
                  setSuccessMessage(null);
                }, 5000);
              } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to mark loan as funded');
              } finally {
                setIsLoading(false);
              }
            }}
          >
            Mark as Funded
          </button>
        )}
        
        {/* If admin and loan is funded, show mark as repaid button */}
        {user?.role === 'admin' && loan.status === 'funded' && (
          <button 
            className="repaid-button"
            onClick={async () => {
              try {
                setIsLoading(true);
                await loanService.markLoanRepaid(loan._id);
                const updatedLoan = await loanService.getLoanById(loan._id);
                setLoan(updatedLoan);
                setSuccessMessage('Loan has been marked as repaid');
                setTimeout(() => {
                  setSuccessMessage(null);
                }, 5000);
              } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to mark loan as repaid');
              } finally {
                setIsLoading(false);
              }
            }}
          >
            Mark as Repaid
          </button>
        )}
      </div>
    </div>
  );
};

export default LoanDetail;
