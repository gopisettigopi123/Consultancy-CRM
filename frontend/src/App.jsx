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

const App = () => {
  return (
    <CompanyProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
  
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
  
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
      </ThemeProvider>
    </CompanyProvider>
  );
};

export default App;
