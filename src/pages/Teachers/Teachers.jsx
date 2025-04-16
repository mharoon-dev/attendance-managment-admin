import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Teachers.css';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';
import useSidebar from '../../hooks/useSidebar';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload';
import BusinessIcon from '@mui/icons-material/Business';
import BadgeIcon from '@mui/icons-material/Badge';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ClassIcon from '@mui/icons-material/Class';
import BookIcon from '@mui/icons-material/Book';
import { FiSave, FiUpload, FiX } from 'react-icons/fi';

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
            <AddIcon />
            Add New Teacher
          </button>
        </div>

        <div className="toolbar">
          <div className="toolbar-actions">
            <div className="search-box">
              <SearchIcon className="search-icon" />
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
              icon={<FilterListIcon />}
              label="Department"
              value={selectedDepartment}
              onChange={(value) => setSelectedDepartment(value)}
              options={[
                { value: 'all', label: 'All Departments', icon: <BusinessIcon /> },
                { value: 'science', label: 'Science', icon: <BusinessIcon /> },
                { value: 'math', label: 'Mathematics', icon: <BusinessIcon /> },
                { value: 'english', label: 'English', icon: <BusinessIcon /> },
                { value: 'history', label: 'History', icon: <BusinessIcon /> },
              ]}
            />
            <CustomDropdown
              compact
              icon={<FilterListIcon />}
              label="Status"
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value)}
              options={[
                { value: 'all', label: 'All Status', icon: <BadgeIcon /> },
                { value: 'active', label: 'Active', icon: <BadgeIcon /> },
                { value: 'inactive', label: 'Inactive', icon: <BadgeIcon /> },
              ]}
            />
            <CustomDropdown
              compact
              icon={<ArrowUpwardIcon />}
              label="Sort By"
              value={sortBy}
              onChange={(value) => setSortBy(value)}
              options={[
                { value: 'name', label: 'Name', icon: <ArrowUpwardIcon /> },
                { value: 'department', label: 'Department', icon: <ArrowUpwardIcon /> },
                { value: 'status', label: 'Status', icon: <ArrowUpwardIcon /> },
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
                    <PhoneIcon />
                    <span>{teacher.phone}</span>
                  </div>
                  <div className="info-item">
                    <EmailIcon />
                    <span>{teacher.email}</span>
                  </div>
                  <div className="info-item">
                    <SchoolIcon />
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
                    <EditIcon />
                  </button>
                  <button className="action-btn delete">
                    <DeleteIcon />
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