import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';
import useSidebar from '../../hooks/useSidebar';
import './Classes.css';

const Classes = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    grade: '',
    section: '',
    teacher: '',
    room: '',
    schedule: '',
    description: '',
    subjects: [''],
    capacity: 30,
    status: 'active'
  });

  // Sample data for classes
  const classes = [
    {
      id: 1,
      name: 'Class 10-A',
      grade: '10',
      section: 'A',
      teacher: 'Dr. Sarah Wilson',
      teacherId: 1,
      students: 32,
      schedule: 'Mon-Fri, 8:00 AM - 3:00 PM',
      room: 'Room 101',
      status: 'active',
      description: 'Advanced Mathematics and Science focused class'
    },
    {
      id: 2,
      name: 'Class 10-B',
      grade: '10',
      section: 'B',
      teacher: 'Prof. Michael Brown',
      teacherId: 2,
      students: 28,
      schedule: 'Mon-Fri, 8:00 AM - 3:00 PM',
      room: 'Room 102',
      status: 'active',
      description: 'Humanities and Social Sciences focused class'
    },
    {
      id: 3,
      name: 'Class 11-A',
      grade: '11',
      section: 'A',
      teacher: 'Dr. Emily Johnson',
      teacherId: 3,
      students: 30,
      schedule: 'Mon-Fri, 8:00 AM - 3:00 PM',
      room: 'Room 201',
      status: 'active',
      description: 'Science and Technology focused class'
    },
    {
      id: 4,
      name: 'Class 11-B',
      grade: '11',
      section: 'B',
      teacher: 'Dr. Robert Davis',
      teacherId: 4,
      students: 29,
      schedule: 'Mon-Fri, 8:00 AM - 3:00 PM',
      room: 'Room 202',
      status: 'active',
      description: 'Business and Economics focused class'
    },
    {
      id: 5,
      name: 'Class 12-A',
      grade: '12',
      section: 'A',
      teacher: 'Prof. Lisa Anderson',
      teacherId: 5,
      students: 31,
      schedule: 'Mon-Fri, 8:00 AM - 3:00 PM',
      room: 'Room 301',
      status: 'active',
      description: 'Pre-Engineering focused class'
    },
    {
      id: 6,
      name: 'Class 12-B',
      grade: '12',
      section: 'B',
      teacher: 'Dr. James Wilson',
      teacherId: 6,
      students: 27,
      schedule: 'Mon-Fri, 8:00 AM - 3:00 PM',
      room: 'Room 302',
      status: 'active',
      description: 'Pre-Medical focused class'
    }
  ];

  // Sample data for dropdown options
  const grades = [
    { value: 'all', label: 'All Grades', icon: <BusinessIcon /> },
    { value: '10', label: 'Grade 10', icon: <BusinessIcon /> },
    { value: '11', label: 'Grade 11', icon: <BusinessIcon /> },
    { value: '12', label: 'Grade 12', icon: <BusinessIcon /> }
  ];

  const sections = [
    { value: 'all', label: 'All Sections', icon: <GroupIcon /> },
    { value: 'A', label: 'Section A', icon: <GroupIcon /> },
    { value: 'B', label: 'Section B', icon: <GroupIcon /> },
    { value: 'C', label: 'Section C', icon: <GroupIcon /> }
  ];

  const teachers = [
    { value: 'all', label: 'All Teachers', icon: <BadgeIcon /> },
    { value: '1', label: 'Dr. Sarah Wilson', icon: <BadgeIcon /> },
    { value: '2', label: 'Prof. Michael Brown', icon: <BadgeIcon /> },
    { value: '3', label: 'Dr. Emily Johnson', icon: <BadgeIcon /> },
    { value: '4', label: 'Dr. Robert Davis', icon: <BadgeIcon /> },
    { value: '5', label: 'Prof. Lisa Anderson', icon: <BadgeIcon /> },
    { value: '6', label: 'Dr. James Wilson', icon: <BadgeIcon /> }
  ];

  const sortOptions = [
    { value: 'name', label: 'Class Name', icon: <BusinessIcon /> },
    { value: 'grade', label: 'Grade', icon: <BusinessIcon /> },
    { value: 'students', label: 'Students Count', icon: <BusinessIcon /> },
    { value: 'teacher', label: 'Teacher Name', icon: <BusinessIcon /> }
  ];

  // Filter classes based on search term and selected filters
  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || cls.grade === selectedGrade;
    const matchesSection = selectedSection === 'all' || cls.section === selectedSection;
    const matchesTeacher = selectedTeacher === 'all' || cls.teacherId.toString() === selectedTeacher;
    
    return matchesSearch && matchesGrade && matchesSection && matchesTeacher;
  });

  // Sort classes based on selected sort option
  const sortedClasses = [...filteredClasses].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'grade':
        return a.grade.localeCompare(b.grade) || a.section.localeCompare(b.section);
      case 'students':
        return b.students - a.students;
      case 'teacher':
        return a.teacher.localeCompare(b.teacher);
      default:
        return 0;
    }
  });

  const handleViewClass = (classId) => {
    navigate(`/classes/${classId}`);
  };

  const handleEditClass = (classItem) => {
    setEditingClass(classItem);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingClass(null);
  };

  return (
    <div className={`layout-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`classes-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <div className="classes-header">
          <h1>All Classes</h1>
          <button className="add-class-btn" onClick={() => navigate('/classes/add')}>
            <AddIcon /> Add New Class
          </button>
        </div>

        <div className="toolbar">
          <div className="toolbar-actions">
            <div className="search-box">
              <div className="search-input">
                <SearchIcon className="search-icon" />
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="dropdown-container">
              <CustomDropdown
                compact
                icon={<BusinessIcon />}
                label="Grade"
                value={selectedGrade}
                onChange={(value) => setSelectedGrade(value)}
                options={grades}
              />
              <CustomDropdown
                compact
                icon={<GroupIcon />}
                label="Section"
                value={selectedSection}
                onChange={(value) => setSelectedSection(value)}
                options={sections}
              />
              <CustomDropdown
                compact
                icon={<BadgeIcon />}
                label="Teacher"
                value={selectedTeacher}
                onChange={(value) => setSelectedTeacher(value)}
                options={teachers}
              />
              <CustomDropdown
                compact
                icon={<BusinessIcon />}
                label="Sort By"
                value={sortBy}
                onChange={(value) => setSortBy(value)}
                options={sortOptions}
              />
            </div>
          </div>
        </div>

        <div className="classes-grid">
          {sortedClasses.map(cls => (
            <div key={cls.id} className="class-card">
              <div className="class-card-header">
                <div className="class-name">{cls.name}</div>
                <div className="class-status" data-status={cls.status}>
                  {cls.status}
                </div>
              </div>
              
              <div className="class-card-body">
                <div className="class-info">
                  <div className="info-item">
                    <BusinessIcon className="info-icon" />
                    <span>{cls.grade}</span>
                  </div>
                  <div className="info-item">
                    <GroupIcon className="info-icon" />
                    <span>{cls.section}</span>
                  </div>
                  <div className="info-item">
                    <PersonIcon className="info-icon" />
                    <span>{cls.teacher}</span>
                  </div>
                  <div className="info-item">
                    <BadgeIcon className="info-icon" />
                    <span>{cls.room}</span>
                  </div>
                  <div className="info-item">
                    <CalendarMonthIcon className="info-icon" />
                    <span>{cls.schedule}</span>
                  </div>
                </div>

                <div className="class-description">
                  <p>{cls.description}</p>
                </div>
              </div>

              <div className="class-card-footer">
                <button 
                  className="view-class-btn"
                  onClick={() => handleViewClass(cls.id)}
                >
                  <VisibilityIcon /> View Details
                </button>
                <div className="quick-actions">
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEditClass(cls)}
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

      {/* Edit Class Modal */}
      {isEditModalOpen && editingClass && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Edit Class</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="grade">Grade</label>
                    <CustomDropdown
                      options={grades.filter(g => g.value !== 'all')}
                      value={editingClass.grade}
                      onChange={(value) => console.log('Grade changed:', value)}
                      placeholder="Select grade"
                      icon={<BusinessIcon />}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="section">Section</label>
                    <CustomDropdown
                      options={sections.filter(s => s.value !== 'all')}
                      value={editingClass.section}
                      onChange={(value) => console.log('Section changed:', value)}
                      placeholder="Select section"
                      icon={<GroupIcon />}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="teacher">Teacher</label>
                    <CustomDropdown
                      options={teachers.filter(t => t.value !== 'all')}
                      value={editingClass.teacherId.toString()}
                      onChange={(value) => console.log('Teacher changed:', value)}
                      placeholder="Select teacher"
                      icon={<BadgeIcon />}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="room">Room</label>
                    <input
                      type="text"
                      id="room"
                      name="room"
                      defaultValue={editingClass.room}
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
                    defaultValue={editingClass.schedule}
                    placeholder="Enter class schedule"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    defaultValue={editingClass.description}
                    placeholder="Enter class description"
                    rows="3"
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    {loading ? (
                      <span className="loading-spinner"></span>
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

export default Classes; 