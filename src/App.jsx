import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TrustProvider } from './context/TrustContext';
import Navbar from './components/Layout/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ChatWidget from './components/TrustBot/ChatWidget';
import HowItWorks from './pages/Info/HowItWorks';
import About from './pages/Info/About';
import Simulator from './pages/Simulator';
import Profile from './pages/Profile';
import Settings from './pages/Info/Settings';
import BankDetails from './pages/Financial/BankDetails';
import Loans from './pages/Financial/Loans';
import Enquiries from './pages/Info/Enquiries';
import Analytics from './pages/Analytics';

import DashboardLayout from './components/Layout/DashboardLayout';
import ErrorBoundary from './components/ErrorBoundary';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;
  return children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <TrustProvider>
          <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative">
            <Routes>
              {/* Public Routes with Navbar */}
              <Route path="/" element={<><Navbar /><Landing /></>} />
              <Route path="/how-it-works" element={<><Navbar /><HowItWorks /></>} />
              <Route path="/about" element={<><Navbar /><About /></>} />



              {/* Protected Routes with Sidebar Layout */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><ErrorBoundary><Dashboard /></ErrorBoundary></DashboardLayout></ProtectedRoute>} />
              <Route path="/simulator" element={<ProtectedRoute><DashboardLayout><ErrorBoundary><Simulator /></ErrorBoundary></DashboardLayout></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><DashboardLayout><ErrorBoundary><Profile /></ErrorBoundary></DashboardLayout></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><DashboardLayout><ErrorBoundary><Settings /></ErrorBoundary></DashboardLayout></ProtectedRoute>} />
              <Route path="/bank-details" element={<ProtectedRoute><DashboardLayout><ErrorBoundary><BankDetails /></ErrorBoundary></DashboardLayout></ProtectedRoute>} />
              <Route path="/loans" element={<ProtectedRoute><DashboardLayout><ErrorBoundary><Loans /></ErrorBoundary></DashboardLayout></ProtectedRoute>} />
              <Route path="/enquiries" element={<ProtectedRoute><DashboardLayout><ErrorBoundary><Enquiries /></ErrorBoundary></DashboardLayout></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><DashboardLayout><ErrorBoundary><Analytics /></ErrorBoundary></DashboardLayout></ProtectedRoute>} />
            </Routes>
            <ChatWidget />
          </div>
        </TrustProvider>
      </AuthProvider>
    </Router >
  );
};

export default App;
