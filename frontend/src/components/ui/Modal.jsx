import React, { useEffect } from 'react';

const Modal = ({ show, title, onClose, children, size = 'lg' }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (show) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }} onClick={onClose}>
      <div className={`modal-dialog modal-${size} modal-dialog-centered`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 shadow-lg" style={{ background: 'var(--bg-card)' }}>
          <div className="modal-header border-bottom border-secondary-subtle">
            <h5 className="modal-title fw-bold">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose} style={{ filter: 'var(--icon-filter)' }}></button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export const ModalBody = ({ children }) => <div className="modal-body">{children}</div>;
export const ModalFooter = ({ children }) => <div className="modal-footer d-flex justify-content-end gap-2">{children}</div>;

export default Modal;
