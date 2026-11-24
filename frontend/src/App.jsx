import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CompanyProvider } from './context/CompanyContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import Training from './pages/Training';
import Mocks from './pages/Mocks';
import Marketing from './pages/Marketing';
import Vendors from './pages/Vendors';
import Submissions from './pages/Submissions';
import UserPage from './modules/UserManagement/pages/UserPage';
import PermissionPage from './modules/UserManagement/pages/PermissionPage';
import ForgotPassword from './pages/ForgotPassword';
import Employees from './pages/Employees';
import Payroll from './pages/Payroll';
import Attendance from './pages/Attendance';
import SystemLogs from './pages/SystemLogs';
import AccountPage from './pages/AccountPage';

import NotFound from './pages/NotFound';

const App = () => {
  return (
    <CompanyProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
  
            {/* Protected — Dashboard & Candidates */}
            <Route path="/" element={
              <ProtectedRoute permissions={['view_dashboard']}>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />
  
            <Route path="/candidates" element={
              <ProtectedRoute permissions={['view_candidates', 'manage_candidates']}>
                <Layout><Candidates /></Layout>
              </ProtectedRoute>
            } />
  
            {/* Training */}
            <Route path="/training" element={
              <ProtectedRoute permissions={['view_training', 'manage_training']}>
                <Layout><Training /></Layout>
              </ProtectedRoute>
            } />
  
            <Route path="/mocks" element={
              <ProtectedRoute permissions={['view_mocks', 'manage_mocks']}>
                <Layout><Mocks /></Layout>
              </ProtectedRoute>
            } />
  
            {/* Marketing */}
            <Route path="/marketing" element={
              <ProtectedRoute permissions={['view_marketing', 'manage_marketing']}>
                <Layout><Marketing /></Layout>
              </ProtectedRoute>
            } />
  
            <Route path="/vendors" element={
              <ProtectedRoute permissions={['view_vendors', 'manage_vendors']}>
                <Layout><Vendors /></Layout>
              </ProtectedRoute>
            } />
  
            <Route path="/submissions" element={
              <ProtectedRoute permissions={['view_submissions', 'manage_submissions']}>
                <Layout><Submissions /></Layout>
              </ProtectedRoute>
            } />

            {/* HR */}
            <Route path="/employees" element={
              <ProtectedRoute permissions={['view_hr', 'manage_hr']}>
                <Layout><Employees /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/payroll" element={
              <ProtectedRoute permissions={['view_hr', 'manage_hr']}>
                <Layout><Payroll /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/attendance" element={
              <ProtectedRoute permissions={['view_hr', 'manage_hr']}>
                <Layout><Attendance /></Layout>
              </ProtectedRoute>
            } />

            {/* Admin Team / Logs */}
            <Route path="/system-logs" element={
              <ProtectedRoute permissions={['view_logs']}>
                <Layout><SystemLogs /></Layout>
              </ProtectedRoute>
            } />

            {/* Account */}
            <Route path="/balance" element={
              <ProtectedRoute permissions={['view_finance', 'manage_finance']}>
                <Layout><AccountPage /></Layout>
              </ProtectedRoute>
            } />

            {/* User Management */}
            <Route path="/users" element={
              <ProtectedRoute permissions={['manage_users']}>
                <Layout><UserPage /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/permissions" element={
              <ProtectedRoute permissions={['manage_roles']}>
                <Layout><PermissionPage /></Layout>
              </ProtectedRoute>
            } />
  
            {/* Fallback to 404 */}
            <Route path="*" element={
              <ProtectedRoute>
                <Layout><NotFound /></Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
      </ThemeProvider>
    </CompanyProvider>
  );
};

export default App;
