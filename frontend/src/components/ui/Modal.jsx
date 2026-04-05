import React from 'react';

const Modal = ({ show, title, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-between align-items-center">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
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
