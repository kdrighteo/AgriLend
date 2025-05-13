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

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

// Context
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
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
                <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
                <Route path="/loan-application" element={<LoanApplication />} />
                <Route path="/loans/:loanId" element={<LoanDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              
              {/* 404 Page */}
              <Route path="/debug" element={<DebugInfo />} />
              <Route path="/super-admin-access" element={<SuperAdminAccess />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
