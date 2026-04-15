import React from 'react';
import { Link } from 'react-router-dom';
import { MdErrorOutline, MdArrowBack } from 'react-icons/md';

const NotFound = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh', textAlign: 'center' }}>
      <MdErrorOutline size={80} color="var(--text-secondary)" className="mb-3 opacity-50" />
      <h2 className="fw-bold" style={{ color: 'var(--text-primary)' }}>404 - Page Not Found</h2>
      <p className="text-muted-crm mb-4">The page you are looking for does not exist or has been moved.</p>
      
      <Link to="/" className="btn-primary-crm text-decoration-none d-inline-flex align-items-center gap-2 px-4 py-2">
        <MdArrowBack /> Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
