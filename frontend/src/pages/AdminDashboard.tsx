import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../styles/AdminDashboard.css';

interface Loan {
  _id: string;
  amount: number;
  purpose: string;
  status: string;
  cropType: string;
  submittedAt: string;
  farmer: {
    _id: string;
    name: string;
    email: string;
    farmName?: string;
    creditScore?: number;
  };
}

interface AdminDashboardProps {
  // Any props if needed
}

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  const [activeTab, setActiveTab] = useState('pending');

  // Redirect if not admin
  useEffect(() => {
    if (isAuthenticated && user && user.role !== 'admin') {
      navigate('/dashboard');
    } else if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch loans
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/loans/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setLoans(response.data);
        filterLoans(response.data, activeTab, searchTerm);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch loans');
        console.error('Error fetching loans:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user?.role === 'admin') {
      fetchLoans();
    }
  }, [isAuthenticated, user, activeTab]);

  // Filter loans based on tab, status filter and search term
  const filterLoans = (loansList: Loan[], tab: string, search: string) => {
    let filtered = loansList;
    
    // Filter by tab (status groups)
    if (tab === 'pending') {
      filtered = filtered.filter(loan => ['pending', 'under-review'].includes(loan.status));
    } else if (tab === 'approved') {
      filtered = filtered.filter(loan => ['approved', 'funded'].includes(loan.status));
    } else if (tab === 'rejected') {
      filtered = filtered.filter(loan => loan.status === 'rejected');
    } else if (tab === 'completed') {
      filtered = filtered.filter(loan => loan.status === 'repaid');
    }
    
    // Apply search filter if search term exists
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(loan => 
        loan.farmer.name.toLowerCase().includes(searchLower) ||
        loan.farmer.email.toLowerCase().includes(searchLower) ||
        (loan.farmer.farmName && loan.farmer.farmName.toLowerCase().includes(searchLower)) ||
        loan.purpose.toLowerCase().includes(searchLower) ||
        loan._id.includes(searchLower)
      );
    }
    
    setFilteredLoans(filtered);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterLoans(loans, activeTab, value);
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    filterLoans(loans, tab, searchTerm);
  };

  // Handle status filter change
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setShowFilterMenu(false);
    // Implement additional filtering logic if needed
  };

  // Open review modal for a loan
  const handleReviewLoan = (loan: Loan) => {
    setSelectedLoan(loan);
    setShowReviewModal(true);
  };

  // Close review modal
  const handleCloseModal = () => {
    setShowReviewModal(false);
    setSelectedLoan(null);
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

  // Calculate summary statistics
  const getLoanStats = () => {
    const pending = loans.filter(loan => loan.status === 'pending').length;
    const underReview = loans.filter(loan => loan.status === 'under-review').length;
    const approved = loans.filter(loan => ['approved', 'funded'].includes(loan.status)).length;
    const rejected = loans.filter(loan => loan.status === 'rejected').length;
    const completed = loans.filter(loan => loan.status === 'repaid').length;
    
    const totalAmount = loans
      .filter(loan => ['approved', 'funded', 'repaid'].includes(loan.status))
      .reduce((sum, loan) => sum + loan.amount, 0);
    
    return { pending, underReview, approved, rejected, completed, totalAmount };
  };

  const stats = getLoanStats();

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <div className="admin-title">AgriLend Admin Portal</div>
          <p className="admin-subtitle">Manage loan applications and track lending metrics</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="admin-stats">
        <div className="stat-card">
          <h3 className="stat-title">Pending Applications</h3>
          <div className="stat-value">{stats.pending}</div>
          <p className="stat-description">Awaiting review</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Under Review</h3>
          <div className="stat-value">{stats.underReview}</div>
          <p className="stat-description">Being evaluated</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Active Loans</h3>
          <div className="stat-value">{stats.approved}</div>
          <p className="stat-description">Approved or funded</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Total Funded</h3>
          <div className="stat-value">{formatCurrency(stats.totalAmount)}</div>
          <p className="stat-description">Loan capital deployed</p>
        </div>

        <div className="stat-card">
          <h3 className="stat-title">Registered Farmers</h3>
          <div className="stat-value">{loans.map(loan => loan.farmer._id).filter((value, index, self) => self.indexOf(value) === index).length}</div>
          <p className="stat-description">Platform subscribers</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <div 
          className={`admin-tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => handleTabChange('pending')}
        >
          Pending & Under Review
        </div>
        <div 
          className={`admin-tab ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => handleTabChange('approved')}
        >
          Approved & Funded
        </div>
        <div 
          className={`admin-tab ${activeTab === 'rejected' ? 'active' : ''}`}
          onClick={() => handleTabChange('rejected')}
        >
          Rejected
        </div>
        <div 
          className={`admin-tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => handleTabChange('completed')}
        >
          Completed
        </div>
        <div 
          className={`admin-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => handleTabChange('all')}
        >
          All Applications
        </div>
      </div>

      <div className="admin-content">
        {/* Search & Filters */}
        <div className="filters-bar">
          <div className="search-container">
            <svg className="search-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search by farmer name, email, or ID..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="filter-dropdown">
            <button 
              className="filter-button" 
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <svg className="filter-button-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              Filter
            </button>
            
            {showFilterMenu && (
              <div className="filter-menu">
                <div 
                  className={`filter-option ${statusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => handleStatusFilterChange('all')}
                >
                  All Statuses
                </div>
                <div 
                  className={`filter-option ${statusFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => handleStatusFilterChange('pending')}
                >
                  Pending
                </div>
                <div 
                  className={`filter-option ${statusFilter === 'under-review' ? 'active' : ''}`}
                  onClick={() => handleStatusFilterChange('under-review')}
                >
                  Under Review
                </div>
                <div 
                  className={`filter-option ${statusFilter === 'approved' ? 'active' : ''}`}
                  onClick={() => handleStatusFilterChange('approved')}
                >
                  Approved
                </div>
                <div 
                  className={`filter-option ${statusFilter === 'rejected' ? 'active' : ''}`}
                  onClick={() => handleStatusFilterChange('rejected')}
                >
                  Rejected
                </div>
              </div>
            )}
          </div>
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
            <p>Loading loan applications...</p>
          </div>
        ) : filteredLoans.length === 0 ? (
          <div className="dashboard-message">
            <svg className="message-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p>No loan applications found matching your criteria.</p>
          </div>
        ) : (
          <div className="loans-table-container">
            <table className="loans-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Farmer</th>
                  <th>Amount</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  <th>Date Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan) => (
                  <tr key={loan._id}>
                    <td className="loan-id">{loan._id.substring(loan._id.length - 8)}</td>
                    <td>
                      <span className="farmer-name">{loan.farmer.name}</span>
                      <span className="farmer-details">
                        {loan.farmer.farmName || 'Unknown Farm'} | Score: {loan.farmer.creditScore || 'N/A'}
                      </span>
                    </td>
                    <td className="loan-amount">{formatCurrency(loan.amount)}</td>
                    <td>
                      {loan.purpose.length > 30 ? `${loan.purpose.substring(0, 30)}...` : loan.purpose}
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(loan.status)}`}>
                        {formatStatus(loan.status)}
                      </span>
                    </td>
                    <td>{formatDate(loan.submittedAt)}</td>
                    <td>
                      <div className="loan-actions">
                        <Link 
                          to={`/loans/${loan._id}`}
                          className="action-button btn-review"
                        >
                          {loan.status === 'pending' ? 'Review' : 'View Details'}
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination - To be implemented */}
        {/* <div className="pagination">
          <button className="pagination-button">1</button>
          <button className="pagination-button active">2</button>
          <button className="pagination-button">3</button>
          <div className="pagination-ellipsis">...</div>
          <button className="pagination-button">10</button>
        </div> */}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedLoan && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Loan Application Review</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="review-section">
                <h3 className="review-section-title">Loan Details</h3>
                <div className="review-grid">
                  <div className="review-item">
                    <div className="review-label">Application ID</div>
                    <div className="review-value">{selectedLoan._id}</div>
                  </div>
                  <div className="review-item">
                    <div className="review-label">Amount Requested</div>
                    <div className="review-value">{formatCurrency(selectedLoan.amount)}</div>
                  </div>
                  <div className="review-item">
                    <div className="review-label">Purpose</div>
                    <div className="review-value">{selectedLoan.purpose}</div>
                  </div>
                  <div className="review-item">
                    <div className="review-label">Status</div>
                    <div className="review-value">
                      <span className={`status-badge ${getStatusBadgeClass(selectedLoan.status)}`}>
                        {formatStatus(selectedLoan.status)}
                      </span>
                    </div>
                  </div>
                  <div className="review-item">
                    <div className="review-label">Crop Type</div>
                    <div className="review-value">{selectedLoan.cropType}</div>
                  </div>
                  <div className="review-item">
                    <div className="review-label">Date Submitted</div>
                    <div className="review-value">{formatDate(selectedLoan.submittedAt)}</div>
                  </div>
                </div>
              </div>
              
              <div className="review-section">
                <h3 className="review-section-title">Farmer Information</h3>
                <div className="review-grid">
                  <div className="review-item">
                    <div className="review-label">Name</div>
                    <div className="review-value">{selectedLoan.farmer.name}</div>
                  </div>
                  <div className="review-item">
                    <div className="review-label">Email</div>
                    <div className="review-value">{selectedLoan.farmer.email}</div>
                  </div>
                  <div className="review-item">
                    <div className="review-label">Farm Name</div>
                    <div className="review-value">{selectedLoan.farmer.farmName || 'Not provided'}</div>
                  </div>
                  <div className="review-item">
                    <div className="review-label">Credit Score</div>
                    <div className="review-value farmer-score">{selectedLoan.farmer.creditScore || 'N/A'}</div>
                  </div>
                </div>
              </div>
              
              {/* Only show decision section for pending or under-review loans */}
              {['pending', 'under-review'].includes(selectedLoan.status) && (
                <div className="review-section">
                  <h3 className="review-section-title">Make Decision</h3>
                  
                  <div className="risk-assessment">
                    <div className="form-group">
                      <label className="form-label">Risk Assessment (0-100)</label>
                      <div className="risk-slider-container">
                        <input 
                          type="range" 
                          className="risk-slider" 
                          min="0" 
                          max="100" 
                          defaultValue="50"
                        />
                        <div className="risk-labels">
                          <span className="risk-label">Low Risk</span>
                          <span className="risk-label">Medium Risk</span>
                          <span className="risk-label">High Risk</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="adminNotes" className="form-label">Notes</label>
                      <textarea 
                        id="adminNotes" 
                        className="form-textarea" 
                        placeholder="Add your notes or comments about this loan application..."
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="decision-buttons">
                    <Link 
                      to={`/admin/loans/${selectedLoan._id}/approve`} 
                      className="action-button btn-approve"
                    >
                      Approve Loan
                    </Link>
                    <Link 
                      to={`/admin/loans/${selectedLoan._id}/reject`} 
                      className="action-button btn-reject"
                    >
                      Reject Loan
                    </Link>
                    <Link 
                      to={`/admin/loans/${selectedLoan._id}/review`} 
                      className="action-button btn-mark-reviewed"
                    >
                      Mark as Under Review
                    </Link>
                  </div>
                </div>
              )}
              
              {/* For loans that have already been decided */}
              {!['pending', 'under-review'].includes(selectedLoan.status) && (
                <div className="modal-footer">
                  <Link 
                    to={`/admin/loans/${selectedLoan._id}`} 
                    className="btn-submit"
                  >
                    View Full Details
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
