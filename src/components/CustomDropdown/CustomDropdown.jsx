import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';
import './CustomDropdown.css';

const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  icon,
  name,
  required = false,
  disabled = false,
  className = '',
  error = '',
  label = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find(option => option.value === value) || null
  );
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    setSelectedOption(options.find(option => option.value === value) || null);
  }, [value, options]);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange({ target: { name, value: option.value } });
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`custom-dropdown-container ${className}`}>
      {label && (
        <label className="custom-dropdown-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}
      <div 
        className={`custom-dropdown ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''} ${error ? 'error' : ''}`}
        ref={dropdownRef}
      >
        <div className="custom-dropdown-header" onClick={toggleDropdown}>
          {icon && <span className="dropdown-icon">{icon}</span>}
          <span className="selected-text">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <FiChevronDown className={`dropdown-arrow ${isOpen ? 'open' : ''}`} />
        </div>
        
        {isOpen && (
          <div className="custom-dropdown-options">
            {options.map((option) => (
              <div
                key={option.value}
                className={`dropdown-option ${selectedOption?.value === option.value ? 'selected' : ''}`}
                onClick={() => handleSelect(option)}
              >
                <span className="option-label">{option.label}</span>
                {selectedOption?.value === option.value && (
                  <FiCheck className="check-icon" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <div className="dropdown-error">{error}</div>}
    </div>
  );
};

export default CustomDropdown; 