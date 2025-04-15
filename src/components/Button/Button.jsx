import React from 'react';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  icon,
  iconPosition = 'left',
}) => {
  const buttonClasses = `
    btn
    btn-${variant}
    btn-${size}
    ${fullWidth ? 'btn-full-width' : ''}
    ${className}
  `;

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && iconPosition === 'left' && <span className="btn-icon btn-icon-left">{icon}</span>}
      <span className="btn-text">{children}</span>
      {icon && iconPosition === 'right' && <span className="btn-icon btn-icon-right">{icon}</span>}
    </button>
  );
};

export default Button;