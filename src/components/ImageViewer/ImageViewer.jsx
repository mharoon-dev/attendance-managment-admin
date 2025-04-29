import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { IoAdd, IoRemove } from 'react-icons/io5';
import './ImageViewer.css';

const ImageViewer = ({ imageUrl, onClose }) => {
  const [scale, setScale] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setIsLoading(false);
      setError(null);
    };
    img.onerror = () => {
      setIsLoading(false);
      setError('Failed to load image');
    };
  }, [imageUrl]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="image-viewer-overlay" onClick={onClose}>
      <div className="image-viewer-container" onClick={e => e.stopPropagation()}>
        <button className="image-viewer-close-btn" onClick={onClose}>
          <IoClose size={24} />
        </button>

        <div className="image-viewer-controls">
          <button
            className="image-viewer-control-btn"
            onClick={handleZoomIn}
            disabled={scale >= 3}
          >
            <IoAdd size={20} />
          </button>
          <button
            className="image-viewer-control-btn"
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
          >
            <IoRemove size={20} />
          </button>
        </div>

        {isLoading ? (
          <div className="image-viewer-loading" />
        ) : error ? (
          <div className="image-viewer-error">
            {error}
          </div>
        ) : (
          <img
            src={imageUrl}
            alt="Full view"
            className="image-viewer-image"
            style={{ transform: `scale(${scale})` }}
          />
        )}

        <div className="image-viewer-zoom-controls">
          <span style={{ color: 'white' }}>{Math.round(scale * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer; 