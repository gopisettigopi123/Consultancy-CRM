import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdDashboard, MdHome, MdLockOutline, MdSecurity } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { getFirstAccessibleRoute } from '../../utils/accessControl';

const AccessDenied = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const homeTarget = getFirstAccessibleRoute(user);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(homeTarget.path, { replace: true });
    }
  };

  const handleGoHome = () => {
    navigate(homeTarget.path, { replace: true });
  };

  return (
    <div className="access-denied-wrapper">
      <section className="access-denied-card" aria-labelledby="access-denied-title" role="alert">
        <div className="access-denied-icon-wrap" aria-hidden="true">
          <MdSecurity className="access-denied-icon" />
        </div>

        <span className="access-denied-code">Error 403</span>
        <h1 id="access-denied-title" className="access-denied-title">
          Access Denied
        </h1>

        <p className="access-denied-description">
          You do not have permission to view this page. Your current role permissions restrict access to this section.
        </p>

        <div className="access-denied-info">
          <MdLockOutline className="access-denied-info-icon" aria-hidden="true" />
          <span>
            Restricted area: only authorized team members with the required module permissions can open this resource.
          </span>
        </div>

        <div className="access-denied-actions">
          <button
            type="button"
            className="access-denied-btn access-denied-btn-secondary"
            onClick={handleGoBack}
          >
            <MdArrowBack size={18} aria-hidden="true" />
            <span>Go Back</span>
          </button>

          <button
            type="button"
            className="access-denied-btn access-denied-btn-primary"
            onClick={handleGoHome}
          >
            {homeTarget.isDashboard ? (
              <MdDashboard size={18} aria-hidden="true" />
            ) : (
              <MdHome size={18} aria-hidden="true" />
            )}
            <span>{homeTarget.isDashboard ? 'Go to Dashboard' : `Go to ${homeTarget.label}`}</span>
          </button>
        </div>

        <p className="access-denied-footer">
          Need access? Contact your system administrator to request additional permissions.
        </p>
      </section>
    </div>
  );
};

export default AccessDenied;
