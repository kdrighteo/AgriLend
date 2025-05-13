import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";

interface Invitation {
  _id: string;
  code: string;
  email: string;
  institutionName: string;
  used: boolean;
  createdAt: string;
}

interface Bank {
  _id: string;
  name: string;
  email: string;
  institution: string;
  position: string;
  phoneNumber: string;
  createdAt: string;
}

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
  durationMonths: number;
  interestRate: number;
  createdAt: string;
  assignedTo?: string;
}

const SuperAdminDashboard: React.FC = () => {
  console.log('SuperAdminDashboard component mounted');
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [unassignedLoans, setUnassignedLoans] = useState<Loan[]>([]);
  const [newInvitation, setNewInvitation] = useState({
    email: "",
    institutionName: "",
  });
  const [selectedLoan, setSelectedLoan] = useState<string>("");
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"invitations" | "banks" | "loans">(
    "invitations"
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is superadmin
    const userStr = localStorage.getItem("user");
    console.log('User from localStorage:', userStr);
    if (userStr) {
      const userData = JSON.parse(userStr);
      console.log('Parsed user data:', userData);
      console.log('User role:', userData.role);
      if (userData.role !== "superadmin") {
        console.log('User is not superadmin, redirecting to login');
        navigate("/login");
      } else {
        console.log('User is superadmin, proceeding to dashboard');
      }
    } else {
      console.log('No user in localStorage, redirecting to login');
      navigate("/login");
    }

    // Load all data
    fetchInvitations();
    fetchBanks();
    fetchLoans();
  }, [navigate]);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log('Fetching invitations with token:', token);
      const response = await axios.get(
        "http://localhost:5000/api/invitations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Invitations API response:', response.data);
      setInvitations(response.data);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching invitations:', err);
      setError(err.response?.data?.message || "Error fetching invitations");
      setLoading(false);
    }
  };

  const fetchBanks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log('Fetching banks with token:', token);
      const response = await axios.get(
        "http://localhost:5000/api/users/banks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Banks API response:', response.data);
      setBanks(response.data);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching banks:', err);
      setError(err.response?.data?.message || "Error fetching banks");
      setLoading(false);
    }
  };

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log('Fetching loans with token:', token);
      const response = await axios.get("http://localhost:5000/api/loans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Loans API response:', response.data);
      const allLoans = response.data;
      setLoans(allLoans);

      // Filter unassigned loans
      const unassigned = allLoans.filter(
        (loan: Loan) => !loan.assignedTo && loan.status === "pending"
      );
      console.log('Unassigned loans:', unassigned);
      setUnassignedLoans(unassigned);

      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching loans:', err);
      setError(err.response?.data?.message || "Error fetching loans");
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewInvitation({
      ...newInvitation,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newInvitation.email || !newInvitation.institutionName) {
      setError("Email and institution name are required");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/invitations",
        newInvitation,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset form
      setNewInvitation({
        email: "",
        institutionName: "",
      });

      // Update invitations list
      setInvitations([response.data, ...invitations]);
      setSuccess(`Invitation created with code: ${response.data.code}`);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error creating invitation");
      setLoading(false);
    }
  };

  const handleDeleteInvitation = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this invitation?")) {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/invitations/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Update invitations list
        setInvitations(invitations.filter((inv) => inv._id !== id));
        setSuccess("Invitation deleted successfully");
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || "Error deleting invitation");
        setLoading(false);
      }
    }
  };

  const handleAssignLoan = async () => {
    if (!selectedLoan || !selectedBank) {
      setError("Please select both a loan and a bank");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/loans/${selectedLoan}/assign`,
        { bankId: selectedBank },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh loans list
      fetchLoans();
      setSuccess("Loan assigned successfully");
      setSelectedLoan("");
      setSelectedBank("");
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error assigning loan");
      setLoading(false);
    }
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBank(e.target.value);
  };

  const handleLoanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLoan(e.target.value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Super Admin Dashboard</h1>
        <p>Manage banks, loans, and platform operations</p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="success-message">
          <p>{success}</p>
        </div>
      )}

      {/* Dashboard Stats */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Registered Banks</h3>
          <p className="stat-value">{banks.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Loans</h3>
          <p className="stat-value">{loans.length}</p>
        </div>
        <div className="stat-card">
          <h3>Unassigned Loans</h3>
          <p className="stat-value">{unassignedLoans.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Invitations</h3>
          <p className="stat-value">
            {invitations.filter((inv) => !inv.used).length}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tabs-container">
        <button
          className={`tab-button ${
            activeTab === "invitations" ? "active" : ""
          }`}
          onClick={() => setActiveTab("invitations")}
        >
          Bank Invitations
        </button>
        <button
          className={`tab-button ${activeTab === "banks" ? "active" : ""}`}
          onClick={() => setActiveTab("banks")}
        >
          Registered Banks
        </button>
        <button
          className={`tab-button ${activeTab === "loans" ? "active" : ""}`}
          onClick={() => setActiveTab("loans")}
        >
          Loan Management
        </button>
      </div>

      <div className="dashboard-content">
        {/* Invitations Tab */}
        {activeTab === "invitations" && (
          <>
            {/* Create New Invitation Form */}
            <div className="dashboard-card">
              <h2>Create New Bank Invitation</h2>
              <form onSubmit={handleCreateInvitation}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={newInvitation.email}
                    onChange={handleInputChange}
                    placeholder="bank-admin@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Institution Name</label>
                  <input
                    type="text"
                    name="institutionName"
                    value={newInvitation.institutionName}
                    onChange={handleInputChange}
                    placeholder="Example Bank & Trust"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Invitation"}
                </button>
              </form>
            </div>

            {/* Invitations List */}
            <div className="dashboard-card">
              <h2>Active Invitations</h2>
              {loading && <p>Loading...</p>}
              {!loading && invitations.length === 0 && (
                <p>No invitations created yet</p>
              )}
              {!loading && invitations.length > 0 && (
                <table className="invitations-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Email</th>
                      <th>Institution</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invitations.map((invitation) => (
                      <tr key={invitation._id}>
                        <td>
                          <code>{invitation.code}</code>
                        </td>
                        <td>{invitation.email}</td>
                        <td>{invitation.institutionName}</td>
                        <td>
                          <span
                            className={`status ${
                              invitation.used ? "used" : "active"
                            }`}
                          >
                            {invitation.used ? "Used" : "Active"}
                          </span>
                        </td>
                        <td>{formatDate(invitation.createdAt)}</td>
                        <td>
                          {!invitation.used && (
                            <button
                              onClick={() =>
                                handleDeleteInvitation(invitation._id)
                              }
                              className="btn-delete"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* Banks Tab */}
        {activeTab === "banks" && (
          <div className="dashboard-card">
            <h2>Registered Banks</h2>
            {loading && <p>Loading...</p>}
            {!loading && banks.length === 0 && <p>No banks registered yet</p>}
            {!loading && banks.length > 0 && (
              <table className="invitations-table">
                <thead>
                  <tr>
                    <th>Bank Name</th>
                    <th>Contact Person</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Position</th>
                    <th>Registered On</th>
                  </tr>
                </thead>
                <tbody>
                  {banks.map((bank) => (
                    <tr key={bank._id}>
                      <td>{bank.institution}</td>
                      <td>{bank.name}</td>
                      <td>{bank.email}</td>
                      <td>{bank.phoneNumber}</td>
                      <td>{bank.position}</td>
                      <td>{formatDate(bank.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Loans Tab */}
        {activeTab === "loans" && (
          <>
            {/* Loan Assignment Form */}
            <div className="dashboard-card">
              <h2>Assign Loan to Bank</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAssignLoan();
                }}
              >
                <div className="form-group">
                  <label>Select Loan</label>
                  <select
                    value={selectedLoan}
                    onChange={handleLoanChange}
                    required
                  >
                    <option value="">-- Select Loan --</option>
                    {unassignedLoans.map((loan) => (
                      <option key={loan._id} value={loan._id}>
                        {loan.farmer.name} - ${loan.amount} - {loan.purpose}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Assign to Bank</label>
                  <select
                    value={selectedBank}
                    onChange={handleBankChange}
                    required
                  >
                    <option value="">-- Select Bank --</option>
                    {banks.map((bank) => (
                      <option key={bank._id} value={bank._id}>
                        {bank.institution}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading || !selectedLoan || !selectedBank}
                >
                  {loading ? "Assigning..." : "Assign Loan"}
                </button>
              </form>
            </div>

            {/* All Loans List */}
            <div className="dashboard-card">
              <h2>All Loan Applications</h2>
              {loading && <p>Loading...</p>}
              {!loading && loans.length === 0 && (
                <p>No loan applications yet</p>
              )}
              {!loading && loans.length > 0 && (
                <table className="invitations-table">
                  <thead>
                    <tr>
                      <th>Farmer</th>
                      <th>Farm</th>
                      <th>Amount</th>
                      <th>Purpose</th>
                      <th>Status</th>
                      <th>Assigned To</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.map((loan) => (
                      <tr key={loan._id}>
                        <td>{loan.farmer.name}</td>
                        <td>{loan.farmer.farmName}</td>
                        <td>${loan.amount.toLocaleString()}</td>
                        <td>{loan.purpose}</td>
                        <td>
                          <span
                            className={`status ${
                              loan.status === "approved"
                                ? "active"
                                : loan.status === "rejected"
                                ? "rejected"
                                : ""
                            }`}
                          >
                            {loan.status.charAt(0).toUpperCase() +
                              loan.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          {loan.assignedTo
                            ? banks.find((bank) => bank._id === loan.assignedTo)
                                ?.institution || "Unknown Bank"
                            : "Unassigned"}
                        </td>
                        <td>
                          <Link to={`/loans/${loan._id}`} className="btn-view">
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
