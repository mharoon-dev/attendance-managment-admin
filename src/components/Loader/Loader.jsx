import React from 'react';
import './Loader.css';

const Loader = ({ 
  size = 'medium', 
  variant = 'spinner', 
  color = '#3A86FF',
  text = '',
  fullScreen = false,
  centered = true
}) => {
  // Size mapping
  const sizeMap = {
    small: { width: '24px', height: '24px', fontSize: '14px' },
    medium: { width: '40px', height: '40px', fontSize: '16px' },
    large: { width: '60px', height: '60px', fontSize: '18px' }
  };
  
  const currentSize = sizeMap[size];
  
  // Render different loader variants
  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div 
            className="loader-spinner" 
            style={{ 
              width: currentSize.width, 
              height: currentSize.height,
              borderColor: `${color} transparent transparent transparent`
            }}
          />
        );
      
      case 'dots':
        return (
          <div className="loader-dots" style={{ width: currentSize.width }}>
            <div className="dot" style={{ backgroundColor: color }}></div>
            <div className="dot" style={{ backgroundColor: color }}></div>
            <div className="dot" style={{ backgroundColor: color }}></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div 
            className="loader-pulse" 
            style={{ 
              width: currentSize.width, 
              height: currentSize.height,
              backgroundColor: color 
            }}
          />
        );
      
      case 'bounce':
        return (
          <div className="loader-bounce" style={{ width: currentSize.width }}>
            <div className="bounce-item" style={{ backgroundColor: color }}></div>
            <div className="bounce-item" style={{ backgroundColor: color }}></div>
            <div className="bounce-item" style={{ backgroundColor: color }}></div>
          </div>
        );
      
      case 'ripple':
        return (
          <div className="loader-ripple" style={{ width: currentSize.width }}>
            <div className="ripple-circle" style={{ borderColor: color }}></div>
            <div className="ripple-circle" style={{ borderColor: color }}></div>
          </div>
        );
      
      case 'wave':
        return (
          <div className="loader-wave" style={{ width: currentSize.width }}>
            <div className="wave-bar" style={{ backgroundColor: color }}></div>
            <div className="wave-bar" style={{ backgroundColor: color }}></div>
            <div className="wave-bar" style={{ backgroundColor: color }}></div>
            <div className="wave-bar" style={{ backgroundColor: color }}></div>
            <div className="wave-bar" style={{ backgroundColor: color }}></div>
          </div>
        );
      
      default:
        return (
          <div 
            className="loader-spinner" 
            style={{ 
              width: currentSize.width, 
              height: currentSize.height,
              borderColor: `${color} transparent transparent transparent`
            }}
          />
        );
    }
  };
  
  const loaderContent = (
    <div className="loader-container">
      {renderLoader()}
      {text && (
        <div 
          className="loader-text" 
          style={{ 
            color: '#4B5563',
            fontSize: currentSize.fontSize,
            marginTop: '8px'
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
  
  if (fullScreen) {
    return (
      <div 
        className="loader-fullscreen" 
        style={{ 
          backgroundColor: 'rgba(249, 250, 251, 0.8)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}
      >
        {loaderContent}
      </div>
    );
  }
  
  if (centered) {
    return (
      <div 
        className="loader-centered" 
        style={{ 
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999
        }}
      >
        {loaderContent}
      </div>
    );
  }
  
  return loaderContent;
};

export default Loader; 