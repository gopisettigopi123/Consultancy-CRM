import React from 'react';

const Button = ({ 
  label, 
  onClick, 
  variant = 'primary', 
  type = 'button', 
  disabled = false, 
  loading = false, 
  icon = null,
  className = '',
  title = '',
  style = {}
}) => {
  
  const getBtnClass = () => {
    switch (variant) {
      case 'primary': return 'btn-primary-crm';
      case 'icon': return 'btn-icon';
      case 'icon-danger': return 'btn-icon danger';
      default: return 'btn-primary-crm'; // fallback
    }
  };

  return (
    <button 
      type={type}
      className={`${getBtnClass()} ${className}`} 
      onClick={onClick} 
      disabled={disabled || loading}
      title={title}
      style={style}
    >
      {loading ? (
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      ) : icon && !label ? (
        icon
      ) : icon ? (
        <span className="d-flex align-items-center gap-2">
          {icon} {label}
        </span>
      ) : (
        label
      )}
    </button>
  );
};

export default Button;
