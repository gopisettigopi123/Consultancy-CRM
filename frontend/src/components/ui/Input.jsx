import React from 'react';
import { Form, Col } from 'react-bootstrap';

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder = '', 
  options = [], 
  multiple = false,
  required = false,
  isFormGroup = true,
  colMd = null
}) => {
  const renderControl = () => {
    if (type === 'select') {
      return (
        <Form.Select 
          value={value} 
          onChange={onChange} 
          multiple={multiple} 
          required={required}
        >
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Form.Select>
      );
    }
    
    if (type === 'file') {
      return (
        <Form.Control 
          type="file" 
          onChange={onChange}
          required={required}
        />
      );
    }

    if (type === 'checkbox' || type === 'switch') {
      return (
        <Form.Check 
          type={type} 
          id={`input-${label.replace(/\s+/g, '-').toLowerCase()}`}
          label={label}
          checked={value} 
          onChange={onChange} 
          required={required}
          style={{ color: 'var(--text-secondary)' }}
        />
      );
    }

    return (
      <Form.Control 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        required={required}
      />
    );
  };

  const content = (
    <>
      {type !== 'checkbox' && type !== 'switch' && (
        <Form.Label>{label} {required && <span className="text-danger">*</span>}</Form.Label>
      )}
      {renderControl()}
    </>
  );

  if (colMd) {
    return (
      <Col md={colMd}>
        <Form.Group>{content}</Form.Group>
      </Col>
    );
  }

  if (isFormGroup) {
    return <Form.Group>{content}</Form.Group>;
  }

  return content;
};

export default Input;
