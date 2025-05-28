import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
import DebugInfo from './pages/DebugInfo';
import SuperAdminAccess from './pages/SuperAdminAccess';
import FarmerDashboard from './pages/FarmerDashboard';
import LoanApplication from './pages/LoanApplication';
import LoanDetail from './pages/LoanDetail';
import Debug from './pages/Debug'; // Import our new enhanced Debug page
import FixPendingLoans from './pages/FixPendingLoans'; // Import the loan review component

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary'; // Import ErrorBoundary component

// Context
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ThemeProvider>
            <div className="app-container">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/register-admin" element={<AdminRegister />} />
                  
                  {/* Protected Routes */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/farmer-dashboard" element={<ErrorBoundary><FarmerDashboard /></ErrorBoundary>} />
                    <Route path="/admin-dashboard" element={<ErrorBoundary><AdminDashboard /></ErrorBoundary>} />
                    <Route path="/super-admin-dashboard" element={<ErrorBoundary><FixPendingLoans /></ErrorBoundary>} />
                    <Route path="/pending-loans" element={<ErrorBoundary><FixPendingLoans /></ErrorBoundary>} />
                    <Route path="/loan-application" element={<ErrorBoundary><LoanApplication /></ErrorBoundary>} />
                    <Route path="/loans/:loanId" element={<ErrorBoundary><LoanDetail /></ErrorBoundary>} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/settings" element={<Settings />} />
                  </Route>
                  
                  {/* Debug & Utility Routes */}
                  <Route path="/debug" element={<Debug />} />
                  <Route path="/debug-old" element={<DebugInfo />} />
                  <Route path="/super-admin-access" element={<SuperAdminAccess />} />
                  
                  {/* 404 Page */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
