import React from 'react';

/**
 * Returns the corresponding class name based on the status string.
 */
export const statusClass = (status) => {
  if (!status) return 'badge-training';
  const s = status.toLowerCase();
  if (s.includes('training')) return 'badge-training';
  if (s.includes('mock')) return 'badge-mock';
  if (s.includes('marketing')) return 'badge-marketing';
  if (s.includes('select') || s.includes('clear') || s.includes('success')) return 'badge-selected';
  if (s.includes('reject') || s.includes('fail')) return 'badge-rejected';
  if (s.includes('submit')) return 'badge-submitted';
  if (s.includes('interview')) return 'badge-interview';
  return 'badge-training'; // fallback
};

const Badge = ({ status, label, children, className = '', style = {} }) => {
  return (
    <span className={`status-badge ${statusClass(status)} ${className}`} style={style}>
      {label || children || status || 'Unknown'}
    </span>
  );
};

export default Badge;
