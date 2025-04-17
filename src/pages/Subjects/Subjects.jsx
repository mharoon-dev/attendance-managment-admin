import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';
import useSidebar from '../../hooks/useSidebar';
import './Subjects.css';

const Subjects = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    grade: '',
    teacher: '',
    description: '',
    status: 'active',
    credits: '',
    schedule: '',
    room: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sample data for subjects
  const subjects = [
    {
      id: 1,
      name: 'Mathematics',
      code: 'MATH101',
      grade: '10',
      teacher: 'Dr. Sarah Johnson',
      description: 'Advanced mathematics covering algebra, calculus, and statistics.',
      status: 'active',
      credits: '5',
      schedule: 'Mon, Wed, Fri - 9:00 AM',
      room: 'Room 301',
      students: 32,
      attendance: 95,
      performance: 88
    },
    {
      id: 2,
      name: 'Physics',
      code: 'PHYS101',
      grade: '10',
      teacher: 'Prof. Michael Brown',
      description: 'Introduction to physics principles, mechanics, and thermodynamics.',
      status: 'active',
      credits: '4',
      schedule: 'Tue, Thu - 10:30 AM',
      room: 'Room 302',
      students: 28,
      attendance: 92,
      performance: 85
    },
    {
      id: 3,
      name: 'Chemistry',
      code: 'CHEM101',
      grade: '10',
      teacher: 'Dr. Emily Davis',
      description: 'Study of chemical reactions, elements, and compounds.',
      status: 'active',
      credits: '4',
      schedule: 'Mon, Wed - 1:00 PM',
      room: 'Room 303',
      students: 30,
      attendance: 94,
      performance: 82
    },
    {
      id: 4,
      name: 'Biology',
      code: 'BIO101',
      grade: '10',
      teacher: 'Prof. Robert Wilson',
      description: 'Study of living organisms, cells, and ecosystems.',
      status: 'active',
      credits: '4',
      schedule: 'Tue, Thu - 2:30 PM',
      room: 'Room 304',
      students: 29,
      attendance: 93,
      performance: 87
    },
    {
      id: 5,
      name: 'English Literature',
      code: 'ENG101',
      grade: '10',
      teacher: 'Ms. Jennifer Taylor',
      description: 'Analysis of literary works, poetry, and prose.',
      status: 'active',
      credits: '3',
      schedule: 'Mon, Wed, Fri - 11:00 AM',
      room: 'Room 305',
      students: 35,
      attendance: 96,
      performance: 90
    },
    {
      id: 6,
      name: 'History',
      code: 'HIST101',
      grade: '10',
      teacher: 'Mr. David Anderson',
      description: 'Study of world history, major events, and civilizations.',
      status: 'inactive',
      credits: '3',
      schedule: 'Tue, Thu - 9:00 AM',
      room: 'Room 306',
      students: 31,
      attendance: 91,
      performance: 84
    },
    {
      id: 7,
      name: 'Computer Science',
      code: 'CS101',
      grade: '11',
      teacher: 'Prof. James Miller',
      description: 'Introduction to programming, algorithms, and data structures.',
      status: 'active',
      credits: '5',
      schedule: 'Mon, Wed, Fri - 1:00 PM',
      room: 'Room 307',
      students: 25,
      attendance: 97,
      performance: 92
    },
    {
      id: 8,
      name: 'Art',
      code: 'ART101',
      grade: '11',
      teacher: 'Ms. Lisa Garcia',
      description: 'Exploration of various art forms, techniques, and art history.',
      status: 'active',
      credits: '3',
      schedule: 'Tue, Thu - 2:30 PM',
      room: 'Room 308',
      students: 22,
      attendance: 94,
      performance: 89
    }
  ];

  // Sample data for dropdown options
  const grades = [
    { value: 'all', label: 'All Grades', icon: <BadgeIcon /> },
    { value: '10', label: 'Grade 10', icon: <BadgeIcon /> },
    { value: '11', label: 'Grade 11', icon: <BadgeIcon /> },
    { value: '12', label: 'Grade 12', icon: <BadgeIcon /> }
  ];

  const statuses = [
    { value: 'all', label: 'All Status', icon: <PersonIcon /> },
    { value: 'active', label: 'Active', icon: <PersonIcon /> },
    { value: 'inactive', label: 'Inactive', icon: <PersonIcon /> }
  ];

  const sortOptions = [
    { value: 'name', label: 'Subject Name', icon: <ArrowUpwardIcon /> },
    { value: 'code', label: 'Subject Code', icon: <ArrowUpwardIcon /> },
    { value: 'grade', label: 'Grade', icon: <ArrowUpwardIcon /> },
    { value: 'teacher', label: 'Teacher', icon: <ArrowUpwardIcon /> }
  ];

  // Filter subjects based on search term and selected filters
  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || subject.grade === selectedGrade;
    const matchesStatus = selectedStatus === 'all' || subject.status === selectedStatus;
    
    return matchesSearch && matchesGrade && matchesStatus;
  });

  // Sort subjects based on selected sort option
  const sortedSubjects = [...filteredSubjects].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'code':
        return a.code.localeCompare(b.code);
      case 'grade':
        return a.grade.localeCompare(b.grade);
      case 'teacher':
        return a.teacher.localeCompare(b.teacher);
      default:
        return 0;
    }
  });

  const handleViewSubject = (subjectId) => {
    navigate(`/subjects/${subjectId}`);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      grade: subject.grade,
      teacher: subject.teacher,
      description: subject.description,
      status: subject.status,
      credits: subject.credits,
      schedule: subject.schedule,
      room: subject.room
    });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingSubject(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGradeChange = (value) => {
    setSelectedGrade(value);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to update the subject
      // await api.put(`/subjects/${editingSubject.id}`, formData);
      
      // Simulate API call delay
      setTimeout(() => {
        setIsLoading(false);
        handleCloseModal();
      }, 1000);
    } catch (error) {
      console.error('Error updating subject:', error);
      setIsLoading(false);
    }
  };

  const handleDeleteSubject = (subjectId) => {
    // Implement delete functionality
    console.log('Delete subject:', subjectId);
  };

  return (
    <div className={`layout-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`subjects-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <div className="subjects-header">
          <h1>All Subjects</h1>
          <button className="add-subject-btn" onClick={() => navigate('/subjects/add')}>
            <AddIcon /> Add New Subject
          </button>
        </div>

        <div className="toolbar">
          <div className="toolbar-actions">
            <div className="search-box">
              <div className="search-input">
                <SearchIcon className="search-icon" />
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="dropdown-container">
              <CustomDropdown
                options={grades}
                value={selectedGrade}
                onChange={handleGradeChange}
                placeholder="Grade"
                icon={<BadgeIcon />}
              />
              <CustomDropdown
                options={statuses}
                value={selectedStatus}
                onChange={handleStatusChange}
                placeholder="Status"
                icon={<PersonIcon />}
              />
              <CustomDropdown
                options={sortOptions}
                value={sortBy}
                onChange={handleSortChange}
                placeholder="Sort By"
                icon={<ArrowUpwardIcon />}
              />
            </div>
          </div>
        </div>

        <div className="subjects-grid">
          {sortedSubjects.map(subject => (
            <div key={subject.id} className="subject-card">
              <div className="subject-card-header">
                <div className="subject-icon">
                  <MenuBookIcon />
                </div>
                <div className="subject-status" data-status={subject.status}>
                  {subject.status}
                </div>
              </div>
              
              <div className="subject-card-body">
                <h3 className="subject-name">{subject.name}</h3>
                <p className="subject-code">{subject.code} • Grade {subject.grade}</p>
                
                <div className="subject-info">
                  <div className="info-item">
                    <PersonIcon className="info-icon" />
                    <span>{subject.teacher}</span>
                  </div>
                  <div className="info-item">
                    <GroupIcon className="info-icon" />
                    <span>{subject.students} Students</span>
                  </div>
                  <div className="info-item">
                    <CalendarMonthIcon className="info-icon" />
                    <span>{subject.schedule}</span>
                  </div>
                </div>

                <div className="subject-stats">
                  <div className="stat-item">
                    <span className="stat-value">{subject.attendance}%</span>
                    <span className="stat-label">Attendance</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{subject.performance}%</span>
                    <span className="stat-label">Performance</span>
                  </div>
                </div>
              </div>

              <div className="subject-card-footer">
                <button 
                  className="view-subject-btn"
                  onClick={() => handleViewSubject(subject.id)}
                >
                  <VisibilityIcon /> View Details
                </button>
                <div className="quick-actions">
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEditSubject(subject)}
                  >
                    <EditIcon />
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDeleteSubject(subject.id)}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Subject Modal */}
      {isEditModalOpen && editingSubject && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Edit Subject</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Subject Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter subject name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="code">Subject Code</label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="Enter subject code"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="grade">Grade</label>
                    <CustomDropdown
                      options={grades.filter(g => g.value !== 'all')}
                      value={formData.grade}
                      onChange={(value) => setFormData({...formData, grade: value})}
                      placeholder="Select grade"
                      icon={<BadgeIcon />}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="teacher">Teacher</label>
                    <input
                      type="text"
                      id="teacher"
                      name="teacher"
                      value={formData.teacher}
                      onChange={handleInputChange}
                      placeholder="Enter teacher name"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="credits">Credits</label>
                    <input
                      type="text"
                      id="credits"
                      name="credits"
                      value={formData.credits}
                      onChange={handleInputChange}
                      placeholder="Enter credits"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="room">Room</label>
                    <input
                      type="text"
                      id="room"
                      name="room"
                      value={formData.room}
                      onChange={handleInputChange}
                      placeholder="Enter room number"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="schedule">Schedule</label>
                  <input
                    type="text"
                    id="schedule"
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleInputChange}
                    placeholder="Enter schedule"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter description"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <CustomDropdown
                    options={statuses.filter(s => s.value !== 'all')}
                    value={formData.status}
                    onChange={(value) => setFormData({...formData, status: value})}
                    placeholder="Select status"
                    icon={<PersonIcon />}
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn" disabled={isLoading}>
                    {isLoading ? (
                      <div className="loading-spinner" />
                    ) : (
                      <>
                        <SaveIcon /> Save Changes
                      </>
                    )}
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

export default Subjects; 