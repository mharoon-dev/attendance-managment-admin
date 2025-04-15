import React, { useState, useRef, useEffect } from 'react';
import './CustomDropdown.css';

const CustomDropdown = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select an option",
  label,
  error,
  required
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="custom-dropdown-container">
      {label && (
        <label className="dropdown-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      <div 
        className={`custom-dropdown ${isOpen ? 'open' : ''} ${error ? 'error' : ''}`}
        ref={dropdownRef}
      >
        <div 
          className="dropdown-header" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="dropdown-value">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
        {isOpen && (
          <ul className="dropdown-options">
            {options.map((option) => (
              <li 
                key={option.value} 
                className={`dropdown-option ${option.value === value ? 'selected' : ''}`}
                onClick={() => handleOptionClick(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default CustomDropdown; 