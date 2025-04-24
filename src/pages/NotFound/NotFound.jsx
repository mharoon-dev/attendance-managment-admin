import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-header">
          <h1 className="not-found-title">404</h1>
          <div className="not-found-subtitle">Lost in Space</div>
        </div>
        
        <div className="not-found-illustration">
          <div className="astronaut">
            <div className="helmet">
              <div className="visor"></div>
            </div>
            <div className="body">
              <div className="arm left"></div>
              <div className="arm right"></div>
              <div className="leg left"></div>
              <div className="leg right"></div>
            </div>
          </div>
          <div className="stars">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="star" style={{
                '--delay': `${Math.random() * 2}s`,
                '--size': `${Math.random() * 3 + 2}px`,
                '--left': `${Math.random() * 100}%`,
                '--top': `${Math.random() * 100}%`
              }}></div>
            ))}
          </div>
        </div>

        <div className="not-found-message">
            <br />
          <p>Houston, we have a problem!</p>
          <p>The page you're looking for is lost in space.</p>
        </div>

        <div className="not-found-actions">
          <button 
            className="not-found-button primary"
            onClick={() => navigate('/')}
          >
            <HomeIcon className="button-icon" />
            Return to Earth
          </button>
          <button 
            className="not-found-button secondary"
            onClick={() => window.history.back()}
          >
            <ArrowBackIcon className="button-icon" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 