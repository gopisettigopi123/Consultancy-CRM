import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { hasAccess } from '../../utils/accessControl';
import Layout from '../layout/Layout';
import AccessDenied from './AccessDenied';

const ProtectedRoute = ({ children, roles, permission, permissions, withLayout = true }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading-screen" role="status" aria-live="polite">
        <div className="auth-loading-card">
          <div className="spinner-border auth-loading-spinner" aria-hidden="true" />
          <p className="auth-loading-text">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const isAuthorized = hasAccess(user, { roles, permission, permissions });

  if (!isAuthorized) {
    return withLayout ? (
      <Layout>
        <AccessDenied />
      </Layout>
    ) : (
      <AccessDenied />
    );
  }

  return children;
};

export default ProtectedRoute;
