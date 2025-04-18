import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (key) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const navItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
      path: '/'
    },
    {
      key: 'teachers',
      label: 'Teachers',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      subItems: [
        { label: 'All Teachers', path: '/teachers' },
        { label: 'Add Teacher', path: '/teachers/add' }
      ]
    },
    {
      key: 'classes',
      label: 'Classes',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z"></path>
          <line x1="8" y1="7" x2="16" y2="7"></line>
          <line x1="8" y1="11" x2="16" y2="11"></line>
          <line x1="8" y1="15" x2="12" y2="15"></line>
        </svg>
      ),
      subItems: [
        { label: 'All Classes', path: '/classes' },
        { label: 'Add Class', path: '/classes/add' }
      ]
    },
    {
      key: 'students',
      label: 'Students',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
        </svg>
      ),
      subItems: [
        { label: 'All Students', path: '/students' },
        { label: 'Add Student', path: '/students/add' }
      ]
    },
    {
      key: 'library',
      label: 'Library',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z"></path>
          <line x1="8" y1="7" x2="16" y2="7"></line>
          <line x1="8" y1="11" x2="16" y2="11"></line>
          <line x1="8" y1="15" x2="12" y2="15"></line>
        </svg>
      ),
      subItems: [
        { label: 'All Books', path: '/library' },
        { label: 'Add Book', path: '/library/add' }
      ]
    },
    {
      key: 'subjects',
      label: 'Subjects',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      ),
      subItems: [
        { label: 'All Subjects', path: '/subjects' },
        { label: 'Add Subject', path: '/subjects/add' }
      ]
    },
    {
      key: 'attendance',
      label: 'Attendance',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          <path d="M9 14l2 2 4-4"></path>
        </svg>
      ),
      subItems: [
        { label: 'Mark Attendance', path: '/attendance/mark' },
        { label: 'View Attendance', path: '/attendance' }
      ]
    }
  ];

  return (
    <>
      <div className={`sidebar ${!isOpen ? 'closed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Link to="/">
            <span className="logo-text">School</span>
            <span className="logo-highlight">Manager</span>
            </Link>
          </div>
          <button className="close-sidebar" onClick={toggleSidebar}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="sidebar-content">
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <div key={item.key} className="nav-section">
                {item.subItems ? (
                  <>
                    <button
                      className={`nav-item ${expandedItems[item.key] ? 'expanded' : ''}`}
                      onClick={() => toggleExpand(item.key)}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-label">{item.label}</span>
                      <svg
                        className="expand-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                    <div className={`sub-items ${expandedItems[item.key] ? 'expanded' : ''}`}>
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className="sub-item"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link to={item.path} className="nav-item">
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
      {
        window.innerWidth <= 768 && (
          <div className="sidebar-overlay" onClick={toggleSidebar}></div>
        )
      }
      
    </>
  );
};

export default Sidebar; 