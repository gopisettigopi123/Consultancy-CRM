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
  
            {/* Protected — All Roles */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />
  
            <Route path="/candidates" element={
              <ProtectedRoute>
                <Layout><Candidates /></Layout>
              </ProtectedRoute>
            } />
  
            {/* Training Team + Admin */}
            <Route path="/training" element={
              <ProtectedRoute roles={['Admin', 'Training Team']}>
                <Layout><Training /></Layout>
              </ProtectedRoute>
            } />
  
            <Route path="/mocks" element={
              <ProtectedRoute roles={['Admin', 'Training Team']}>
                <Layout><Mocks /></Layout>
              </ProtectedRoute>
            } />
  
            {/* Marketing Team + Admin */}
            <Route path="/marketing" element={
              <ProtectedRoute roles={['Admin', 'Marketing Team']}>
                <Layout><Marketing /></Layout>
              </ProtectedRoute>
            } />
  
            <Route path="/vendors" element={
              <ProtectedRoute roles={['Admin', 'Marketing Team']}>
                <Layout><Vendors /></Layout>
              </ProtectedRoute>
            } />
  
            <Route path="/submissions" element={
              <ProtectedRoute roles={['Admin', 'Marketing Team']}>
                <Layout><Submissions /></Layout>
              </ProtectedRoute>
            } />

            {/* HR Team */}
            <Route path="/employees" element={
              <ProtectedRoute roles={['Admin', 'HR Team']}>
                <Layout><Employees /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/payroll" element={
              <ProtectedRoute roles={['Admin', 'HR Team']}>
                <Layout><Payroll /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/attendance" element={
              <ProtectedRoute roles={['Admin', 'HR Team']}>
                <Layout><Attendance /></Layout>
              </ProtectedRoute>
            } />

            {/* Admin Team */}
            <Route path="/system-logs" element={
              <ProtectedRoute roles={['Admin', 'Admin Team']}>
                <Layout><SystemLogs /></Layout>
              </ProtectedRoute>
            } />

            {/* Account */}
            <Route path="/balance" element={
              <ProtectedRoute roles={['Admin', 'Account']}>
                <Layout><AccountPage /></Layout>
              </ProtectedRoute>
            } />

            {/* User Management — Admin Only */}
            <Route path="/users" element={
              <ProtectedRoute roles={['Admin']}>
                <Layout><UserPage /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/permissions" element={
              <ProtectedRoute roles={['Admin']}>
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
