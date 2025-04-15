import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Teachers.css';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';

const Teachers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleViewProfile = (teacherId) => {
    navigate(`/teachers/${teacherId}`);
  };

  // Sample teachers data
  const teachers = [
    {
      id: 1,
      name: 'Dr. Sarah Wilson',
      subject: 'Mathematics',
      email: 'sarah.wilson@school.com',
      phone: '+1 (555) 123-4567',
      status: 'active',
      joinDate: '2022-08-15',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      classes: ['Class 10-A', 'Class 11-B', 'Class 12-A'],
      education: 'Ph.D. in Mathematics',
    },
    {
      id: 2,
      name: 'Prof. Michael Brown',
      subject: 'Physics',
      email: 'michael.brown@school.com',
      phone: '+1 (555) 234-5678',
      status: 'active',
      joinDate: '2021-07-20',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      classes: ['Class 11-A', 'Class 12-B'],
      education: 'M.Sc. in Physics',
    },
    // Add more sample teachers...
  ];

  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'english', label: 'English' },
    { value: 'history', label: 'History' },
    { value: 'art', label: 'Art' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'on leave', label: 'On Leave' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || teacher.status === filterStatus;
    const matchesDepartment = selectedDepartment === 'all' || 
                            teacher.subject.toLowerCase() === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || 
                         teacher.status.toLowerCase() === selectedStatus;
    return matchesSearch && matchesFilter && matchesDepartment && matchesStatus;
  });

  const sortedTeachers = [...filteredTeachers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'subject':
        return a.subject.localeCompare(b.subject);
      case 'joinDate':
        return new Date(b.joinDate) - new Date(a.joinDate);
      default:
        return 0;
    }
  });

  return (
    <div className={`layout-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`teachers-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <div className="teachers-header">
          <h1>Teachers</h1>
          <button className="add-teacher-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Teacher
          </button>
        </div>

        <div className="teachers-toolbar">
          <div className="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="toolbar-actions">
            <CustomDropdown
              options={departments}
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              placeholder="Select Department"
            />
            <CustomDropdown
              options={statuses}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="Select Status"
            />
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="subject">Sort by Subject</option>
              <option value="joinDate">Sort by Join Date</option>
            </select>
          </div>
        </div>

        <div className="teachers-grid">
          {sortedTeachers.map(teacher => (
            <div key={teacher.id} className="teacher-card">
              <div className="teacher-card-header">
                <img src={teacher.avatar} alt={teacher.name} className="teacher-avatar" />
                <div className="teacher-status" data-status={teacher.status}>
                  {teacher.status}
                </div>
              </div>
              
              <div className="teacher-card-body">
                <h3 className="teacher-name">{teacher.name}</h3>
                <p className="teacher-subject">{teacher.subject}</p>
                
                <div className="teacher-info">
                  <div className="info-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span>{teacher.phone}</span>
                  </div>
                  <div className="info-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span>{teacher.email}</span>
                  </div>
                  <div className="info-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>{teacher.education}</span>
                  </div>
                </div>

                <div className="teacher-classes">
                  <h4>Classes</h4>
                  <div className="class-tags">
                    {teacher.classes.map((className, index) => (
                      <span key={index} className="class-tag">{className}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="teacher-card-footer">
                <button 
                  className="view-profile-btn"
                  onClick={() => handleViewProfile(teacher.id)}
                >
                  View Profile
                </button>
                <div className="quick-actions">
                  <button className="action-btn edit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                      <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                    </svg>
                  </button>
                  <button className="action-btn delete">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Teachers; 