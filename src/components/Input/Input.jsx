import React, { useState } from 'react';
import './Input.css';

const Input = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  required,
  icon,
  name,
  id,
  autoComplete,
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="input-container">
      {label && (
        <label className="input-label" htmlFor={id || name}>
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      <div 
        className={`input-wrapper ${isFocused ? 'focused' : ''} ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
      >
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={inputType}
          id={id || name}
          name={name}
          className="input-field"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
        />
        {type === 'password' && (
          <button 
            type="button" 
            className="password-toggle"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9ZM12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM3.18 12C4.83 8.01 8.24 5.5 12 5.5C15.76 5.5 19.17 8.01 20.82 12C19.17 15.99 15.76 18.5 12 18.5C8.24 18.5 4.83 15.99 3.18 12Z" fill="currentColor"/>
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Input; 