import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../styles/FarmerDashboard.css';

interface Loan {
  _id: string;
  amount: number;
  purpose: string;
  status: string;
  cropType: string;
  submittedAt: string;
  updatedAt: string;
  reviewedAt?: string;
  approvedAmount?: number;
  adminNotes?: string;
  rejectReason?: string;
}

const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch farmer's loans
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/loans/my-loans', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setLoans(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch loans');
        console.error('Error fetching loans:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoans();
  }, []);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1 className="dashboard-title">Farmer Dashboard</h1>
          <p className="dashboard-greeting">Welcome back, {user?.name}!</p>
          
          <div className="farmer-stats">
            <div className="stat-card">
              <h3 className="stat-title">Credit Score</h3>
              <div className="stat-value">{user?.creditScore || 0}</div>
              <p className="stat-description">
                {user?.creditScore && user.creditScore >= 70 ? 'Excellent' : 
                 user?.creditScore && user.creditScore >= 40 ? 'Good' : 'Fair'} standing
              </p>
            </div>
            
            <div className="stat-card">
              <h3 className="stat-title">Active Loans</h3>
              <div className="stat-value">
                {loans.filter(loan => ['approved', 'funded'].includes(loan.status)).length}
              </div>
              <p className="stat-description">Currently active</p>
            </div>
            
            <div className="stat-card">
              <h3 className="stat-title">Pending Applications</h3>
              <div className="stat-value">
                {loans.filter(loan => ['pending', 'under-review'].includes(loan.status)).length}
              </div>
              <p className="stat-description">Awaiting review</p>
            </div>

            <div className="stat-card">
              <h3 className="stat-title">Completed Loans</h3>
              <div className="stat-value">
                {loans.filter(loan => ['repaid'].includes(loan.status)).length}
              </div>
              <p className="stat-description">Successfully repaid</p>
            </div>
          </div>
        </div>
        
        <div className="action-buttons">
          <Link to="/loan-application" className="btn-apply">
            <svg className="btn-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 4v16m8-8H4"></path>
            </svg>
            Apply for New Loan
          </Link>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="section-header">
          <h2 className="section-title">Active & Pending Loans</h2>
          {loans.filter(loan => !['rejected', 'repaid'].includes(loan.status)).length > 0 && (
            <div className="loan-count">{loans.filter(loan => !['rejected', 'repaid'].includes(loan.status)).length} active/pending</div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="dashboard-message error-message">
            <svg className="message-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="dashboard-loading">
            <svg className="loading-spinner" width="40" height="40" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p>Loading your loan applications...</p>
          </div>
        ) : loans.length === 0 ? (
          <div className="dashboard-message empty-message">
            <svg className="message-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p>You haven't applied for any loans yet.</p>
            <Link to="/loan-application" className="btn-apply-small">
              Apply Now
            </Link>
          </div>
        ) : (
          <div className="loans-table-container">
            <table className="loans-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Purpose</th>
                  <th>Crop Type</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan._id}>
                    <td className="loan-id">{loan._id.substring(loan._id.length - 8)}</td>
                    <td className="loan-amount">{formatCurrency(loan.amount)}</td>
                    <td className="loan-purpose" title={loan.purpose}>
                      {loan.purpose.length > 30 ? `${loan.purpose.substring(0, 30)}...` : loan.purpose}
                    </td>
                    <td>{loan.cropType}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(loan.status)}`}>
                        {formatStatus(loan.status)}
                      </span>
                    </td>
                    <td>{formatDate(loan.submittedAt)}</td>
                    <td>
                      <Link to={`/loans/${loan._id}`} className="btn-view-loan">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Loan History Section */}
      <div className="dashboard-content">
        <div className="section-header">
          <h2 className="section-title">Loan History</h2>
          <div className="loan-count">{loans.filter(loan => ['repaid', 'rejected'].includes(loan.status)).length} total</div>
        </div>

        {loans.filter(loan => ['repaid', 'rejected'].includes(loan.status)).length === 0 ? (
          <div className="dashboard-message empty-message">
            <svg className="message-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p>No loan history yet.</p>
          </div>
        ) : (
          <div className="loans-table-container">
            <table className="loans-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Purpose</th>
                  <th>Crop Type</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans
                  .filter(loan => ['repaid', 'rejected'].includes(loan.status))
                  .map((loan) => (
                    <tr key={loan._id}>
                      <td className="loan-id">{loan._id.substring(loan._id.length - 8)}</td>
                      <td className="loan-amount">{formatCurrency(loan.amount)}</td>
                      <td className="loan-purpose" title={loan.purpose}>
                        {loan.purpose.length > 30 ? `${loan.purpose.substring(0, 30)}...` : loan.purpose}
                      </td>
                      <td>{loan.cropType}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(loan.status)}`}>
                          {formatStatus(loan.status)}
                        </span>
                      </td>
                      <td>{formatDate(loan.submittedAt)}</td>
                      <td>
                        <Link to={`/loans/${loan._id}`} className="btn-view-loan">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Farm Profile Summary */}
      <div className="dashboard-content">
        <div className="section-header">
          <h2 className="section-title">Your Farm Profile</h2>
          <Link to="/profile" className="link-edit-profile">Edit Profile</Link>
        </div>

        <div className="profile-card">
          <div className="profile-info">
            <div className="info-group">
              <h3 className="info-label">Farm Name</h3>
              <p className="info-value">{user?.farmName || 'Not provided'}</p>
            </div>
            <div className="info-group">
              <h3 className="info-label">Location</h3>
              <p className="info-value">{user?.farmLocation || 'Not provided'}</p>
            </div>
            <div className="info-group">
              <h3 className="info-label">Farm Size</h3>
              <p className="info-value">
                {user?.farmSize ? `${user.farmSize} ${user.farmSizeUnit || 'acres'}` : 'Not provided'}
              </p>
            </div>
            <div className="info-group">
              <h3 className="info-label">Main Crops</h3>
              <p className="info-value">
                {user?.mainCrops && user.mainCrops.length > 0 
                  ? user.mainCrops.join(', ') 
                  : 'Not provided'}
              </p>
            </div>
            <div className="info-group">
              <h3 className="info-label">Experience</h3>
              <p className="info-value">
                {user?.farmingExperience 
                  ? `${user.farmingExperience} years` 
                  : 'Not provided'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
