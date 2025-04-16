import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Teachers.css';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';
import useSidebar from '../../hooks/useSidebar';
import { FiFilter, FiArrowUp, FiSearch, FiPlus, FiX, FiSave, FiUpload } from 'react-icons/fi';
import { BsBuilding, BsPersonBadge } from 'react-icons/bs';

const Teachers = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    email: '',
    phone: '',
    status: '',
    education: '',
    classes: []
  });

  const handleViewProfile = (teacherId) => {
    navigate(`/teachers/${teacherId}`);
  };

  const handleEditClick = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      subject: teacher.subject,
      email: teacher.email,
      phone: teacher.phone,
      status: teacher.status,
      education: teacher.education,
      classes: [...teacher.classes]
    });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingTeacher(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClassChange = (index, value) => {
    const updatedClasses = [...formData.classes];
    updatedClasses[index] = value;
    setFormData(prev => ({
      ...prev,
      classes: updatedClasses
    }));
  };

  const addClass = () => {
    setFormData(prev => ({
      ...prev,
      classes: [...prev.classes, '']
    }));
  };

  const removeClass = (index) => {
    const updatedClasses = formData.classes.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      classes: updatedClasses
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically update the teacher data in your backend
    console.log('Updated teacher data:', formData);
    // For now, we'll just close the modal
    handleCloseModal();
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
          <button className="add-teacher-btn" onClick={() => navigate('/teachers/add')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Teacher
          </button>
        </div>

        <div className="toolbar">
          <div className="toolbar-actions">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="dropdown-container">
            <CustomDropdown
              compact
              icon={<FiFilter />}
              label="Department"
              value={selectedDepartment}
              onChange={(value) => setSelectedDepartment(value)}
              options={[
                { value: 'all', label: 'All Departments', icon: <BsBuilding /> },
                { value: 'science', label: 'Science', icon: <BsBuilding /> },
                { value: 'math', label: 'Mathematics', icon: <BsBuilding /> },
                { value: 'english', label: 'English', icon: <BsBuilding /> },
                { value: 'history', label: 'History', icon: <BsBuilding /> },
              ]}
            />
            <CustomDropdown
              compact
              icon={<FiFilter />}
              label="Status"
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value)}
              options={[
                { value: 'all', label: 'All Status', icon: <BsPersonBadge /> },
                { value: 'active', label: 'Active', icon: <BsPersonBadge /> },
                { value: 'inactive', label: 'Inactive', icon: <BsPersonBadge /> },
              ]}
            />
            <CustomDropdown
              compact
              icon={<FiArrowUp />}
              label="Sort By"
              value={sortBy}
              onChange={(value) => setSortBy(value)}
              options={[
                { value: 'name', label: 'Name', icon: <FiArrowUp /> },
                { value: 'department', label: 'Department', icon: <FiArrowUp /> },
                { value: 'status', label: 'Status', icon: <FiArrowUp /> },
              ]}
            />
            </div>
         

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
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEditClick(teacher)}
                  >
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

      {/* Edit Teacher Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Edit Teacher</h2>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="education">Education</label>
                    <input
                      type="text"
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="on-leave">On Leave</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Classes</label>
                  <div className="classes-section-container">
                    {formData.classes.map((className, index) => (
                      <div key={index} className="class-input-group">
                        <input
                          type="text"
                          value={className}
                          onChange={(e) => handleClassChange(index, e.target.value)}
                          placeholder="Class name"
                        />
                        <button 
                          type="button" 
                          className="remove-class-btn"
                          onClick={() => removeClass(index)}
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      className="add-class-btn"
                      onClick={addClass}
                    >
                      Add Class
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Profile Image</label>
                  <div className="avatar-upload">
                    <img 
                      src={editingTeacher.avatar} 
                      alt={editingTeacher.name} 
                      className="avatar-preview" 
                    />
                    <button type="button" className="upload-btn">
                      <FiUpload /> Change Image
                    </button>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    <FiSave /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers; 