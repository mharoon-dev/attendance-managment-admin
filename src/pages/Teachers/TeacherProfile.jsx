import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import './TeacherProfile.css';

const TeacherProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Sample teacher data (replace with actual data from your API)
  const teacher = {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@school.com',
    phone: '+1 234 567 8900',
    department: 'Mathematics',
    joiningDate: '2020-01-15',
    qualification: 'Ph.D. in Mathematics',
    experience: '8 years',
    subjects: ['Calculus', 'Algebra', 'Statistics'],
    address: '123 Education St, Learning City, ST 12345',
    bio: 'Experienced mathematics teacher with a passion for making complex concepts accessible to students. Specializes in advanced calculus and statistics.',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    performance: {
      attendance: 98,
      studentFeedback: 4.8,
      classesTaught: 24,
      studentsTaught: 480
    },
    schedule: [
      { day: 'Monday', classes: ['Calculus 101', 'Statistics 201'] },
      { day: 'Tuesday', classes: ['Algebra 202', 'Calculus 101'] },
      { day: 'Wednesday', classes: ['Statistics 201', 'Algebra 202'] },
      { day: 'Thursday', classes: ['Calculus 101', 'Statistics 201'] },
      { day: 'Friday', classes: ['Algebra 202', 'Calculus 101'] }
    ]
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="profile-section">
            <div className="profile-header">
              <img src={teacher.avatar} alt={teacher.name} className="profile-avatar" />
              <div className="profile-info">
                <h2>{teacher.name}</h2>
                <p className="department">{teacher.department}</p>
                <div className="contact-info">
                  <span><i className="fas fa-envelope"></i> {teacher.email}</span>
                  <span><i className="fas fa-phone"></i> {teacher.phone}</span>
                </div>
              </div>
            </div>
            <div className="profile-details">
              <div className="detail-item">
                <label>Qualification</label>
                <p>{teacher.qualification}</p>
              </div>
              <div className="detail-item">
                <label>Experience</label>
                <p>{teacher.experience}</p>
              </div>
              <div className="detail-item">
                <label>Joining Date</label>
                <p>{new Date(teacher.joiningDate).toLocaleDateString()}</p>
              </div>
              <div className="detail-item">
                <label>Address</label>
                <p>{teacher.address}</p>
              </div>
              <div className="detail-item full-width">
                <label>Bio</label>
                <p>{teacher.bio}</p>
              </div>
            </div>
          </div>
        );
      case 'performance':
        return (
          <div className="profile-section">
            <div className="performance-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <div className="stat-info">
                  <h3>{teacher.performance.attendance}%</h3>
                  <p>Attendance</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-star"></i>
                </div>
                <div className="stat-info">
                  <h3>{teacher.performance.studentFeedback}</h3>
                  <p>Student Feedback</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-chalkboard-teacher"></i>
                </div>
                <div className="stat-info">
                  <h3>{teacher.performance.classesTaught}</h3>
                  <p>Classes Taught</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-info">
                  <h3>{teacher.performance.studentsTaught}</h3>
                  <p>Students Taught</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'schedule':
        return (
          <div className="profile-section">
            <div className="schedule-grid">
              {teacher.schedule.map((day, index) => (
                <div key={index} className="schedule-day">
                  <h3>{day.day}</h3>
                  <ul>
                    {day.classes.map((className, classIndex) => (
                      <li key={classIndex}>{className}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`layout-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="teacher-profile-container">
        <div className="profile-header-actions">
          <button 
            className="back-button"
            onClick={() => navigate('/teachers')}
          >
            <i className="fas fa-arrow-left"></i> Back to Teachers
          </button>
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            Personal Info
          </button>
          <button 
            className={`tab-button ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            Performance
          </button>
          <button 
            className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            Schedule
          </button>
        </div>

        <div className="profile-content">
          {getTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile; 