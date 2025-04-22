import React, { useEffect, useState } from 'react';
import './Navbar.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/userSlice';
import { useDispatch } from 'react-redux';
const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const user = useSelector((state) => state.user.user);
  // console.log(user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    navigate('/login');
  };
  
  // Sample notifications data
  const notifications = [
    { id: 1, message: 'New student registration', time: '5 minutes ago', read: false },
    { id: 2, message: 'Assignment submitted by John', time: '1 hour ago', read: false },
    { id: 3, message: 'Parent meeting scheduled', time: '2 hours ago', read: true },
    { id: 4, message: 'School event reminder', time: '1 day ago', read: true },
  ];
  
  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  return (
    <nav className={`navbar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className="navbar-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div className="logo">
          <Link to="/">
          <span className="logo-text">School</span>
          <span className="logo-highlight">Manager</span>
          </Link>
        </div>
      </div>
      
      <div className="navbar-right">
        
        <div className="navbar-actions">
          <div className="notification-container">
      
            
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Notifications</h3>
                  <button className="mark-all-read">Mark all as read</button>
                </div>
                <div className="notification-list">
                  {notifications.map(notification => (
                    <div key={notification.id} className={`notification-item ${!notification.read ? 'unread' : ''}`}>
                      <div className="notification-content">
                        <p>{notification.message}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                      {!notification.read && <div className="unread-indicator"></div>}
                    </div>
                  ))}
                </div>
                <div className="notification-footer">
                  <button className="view-all">View all notifications</button>
                </div>
              </div>
            )}
          </div>
          
          <div className="profile-container">
            <button 
              className="profile-button" 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <img 
                src={user?.teacher?.profileImage || "/assets/profile-avatar.jpg"} 
                alt="Profile" 
                className="profile-image" 
              />
              <span className="profile-name">{user?.teacher?.fullName || user?.role}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="navbar-profile-header">
                  <img 
                    src={user?.teacher?.profileImage || "/assets/profile-avatar.jpg"} 
                    alt="Profile" 
                    className="profile-image-large" 
                  />
                  <div className="profile-info">
                    <h3>{user?.teacher?.fullName || user?.role}</h3>
                    <p>{user?.teacher?.emailAddress}</p>
                  </div>
                </div>
                <div className="profile-menu">
                  <button className="profile-menu-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    My Profile
                  </button>
                 
                  <button className="profile-menu-item" onClick={handleLogout}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 