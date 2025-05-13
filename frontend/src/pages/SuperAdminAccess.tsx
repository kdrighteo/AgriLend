import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Dashboard.css';

const SuperAdminAccess: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">Super Admin Dashboard Access</h1>
        
        <div className="mb-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <h2 className="text-xl font-semibold mb-3">Current Status</h2>
          <p className="mb-2"><strong>Logged in as:</strong> {user?.name || 'Unknown'}</p>
          <p className="mb-2"><strong>Email:</strong> {user?.email || 'Unknown'}</p>
          <p className="mb-4"><strong>Role:</strong> <span className="bg-indigo-600 text-white px-2 py-1 rounded-full text-sm">{user?.role || 'Unknown'}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold mb-3">Bank Management</h3>
            <p className="text-gray-600 mb-4">View all registered banks, manage their status, and see their activity on the platform.</p>
            <Link to="/super-admin-dashboard" className="inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
              Go to Bank Management
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold mb-3">Loan Assignments</h3>
            <p className="text-gray-600 mb-4">Assign loan applications to approved banks and monitor their progress.</p>
            <Link to="/super-admin-dashboard" className="inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
              Manage Loan Assignments
            </Link>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow mb-8">
          <h3 className="text-lg font-bold mb-3">Bank Invitations</h3>
          <p className="text-gray-600 mb-4">Create and manage invitations for new banks to join the platform.</p>
          <Link to="/super-admin-dashboard" className="inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
            Manage Invitations
          </Link>
        </div>

        <div className="text-center">
          <Link 
            to="/debug" 
            className="text-indigo-600 hover:underline block mb-2"
          >
            Debug Interface
          </Link>
          <p className="text-sm text-gray-500 mt-4">If you're experiencing issues with the dashboard, please contact technical support.</p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminAccess;
