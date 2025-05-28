import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Loan {
  _id: string;
  farmer: {
    _id: string;
    name: string;
    email: string;
    farmName: string;
  };
  amount: number;
  purpose: string;
  status: string;
  createdAt: string;
  assignedTo?: string;
}

const FixPendingLoans: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [pendingLoans, setPendingLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is superadmin
    if (user?.role !== 'superadmin') {
      navigate('/login');
      return;
    }

    fetchLoans();
  }, [user, navigate]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.get("http://localhost:5000/api/loans/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Fetched loans:', response.data);
      setLoans(response.data);
      
      // Filter pending loans
      const pending = response.data.filter(
        (loan: Loan) => loan.status === "pending" && !loan.assignedTo
      );
      console.log('Pending loans that need review:', pending);
      setPendingLoans(pending);
      
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching loans:', err);
      setError(err.response?.data?.message || "Error fetching loans");
      setLoading(false);
    }
  };

  const handleApproveLoan = async (loanId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/loans/${loanId}/status`,
        { status: "approved", adminNotes: "Approved by superadmin" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(`Loan ${loanId} approved successfully`);
      fetchLoans(); // Refresh loans list
    } catch (err: any) {
      setError(err.response?.data?.message || "Error approving loan");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectLoan = async (loanId: string) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (reason === null) return; // User canceled the prompt
    
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/loans/${loanId}/status`,
        { 
          status: "rejected", 
          adminNotes: "Rejected by superadmin",
          rejectReason: reason
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(`Loan ${loanId} rejected`);
      fetchLoans(); // Refresh loans list
    } catch (err: any) {
      setError(err.response?.data?.message || "Error rejecting loan");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Loan Applications Review</h1>
        <div className="dashboard-actions">
          <button 
            onClick={() => navigate('/super-admin-dashboard')} 
            className="btn-secondary"
          >
            Back to Dashboard
          </button>
          <button 
            onClick={fetchLoans} 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Loans'}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="dashboard-card">
        <h2>Pending Loan Applications</h2>
        {loading ? (
          <p>Loading loan applications...</p>
        ) : pendingLoans.length === 0 ? (
          <p>No pending loan applications to review</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Farmer</th>
                <th>Farm</th>
                <th>Amount</th>
                <th>Purpose</th>
                <th>Submitted Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingLoans.map((loan) => (
                <tr key={loan._id}>
                  <td>{loan.farmer.name}</td>
                  <td>{loan.farmer.farmName || 'N/A'}</td>
                  <td>{formatCurrency(loan.amount)}</td>
                  <td>{loan.purpose}</td>
                  <td>{formatDate(loan.createdAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/loans/${loan._id}`} className="btn-view">
                        View Details
                      </Link>
                      <button
                        onClick={() => handleApproveLoan(loan._id)}
                        className="btn-approve"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectLoan(loan._id)}
                        className="btn-reject"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="dashboard-card">
        <h2>All Loans ({loans.length})</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Farmer</th>
              <th>Amount</th>
              <th>Purpose</th>
              <th>Status</th>
              <th>Submitted Date</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan._id}>
                <td>{loan.farmer.name}</td>
                <td>{formatCurrency(loan.amount)}</td>
                <td>{loan.purpose}</td>
                <td>
                  <span className={`status-badge status-${loan.status.toLowerCase()}`}>
                    {loan.status}
                  </span>
                </td>
                <td>{formatDate(loan.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FixPendingLoans;
