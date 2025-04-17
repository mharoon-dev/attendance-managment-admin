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
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';
import useSidebar from '../../hooks/useSidebar';
import './Students.css';

const Students = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    class: '',
    rollNumber: '',
    email: '',
    phone: '',
    address: '',
    parentName: '',
    parentPhone: '',
    status: 'active',
    subjects: []
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sample data for students
  const students = [
    {
      id: 1,
      name: 'John Smith',
      grade: '10',
      class: '10-A',
      rollNumber: '1001',
      email: 'john.smith@school.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, City',
      parentName: 'Michael Smith',
      parentPhone: '+1 (555) 987-6543',
      status: 'active',
      joinDate: '2022-08-15',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'English']
    },
    {
      id: 2,
      name: 'Emily Johnson',
      grade: '10',
      class: '10-B',
      rollNumber: '1002',
      email: 'emily.johnson@school.com',
      phone: '+1 (555) 234-5678',
      address: '456 Oak Ave, City',
      parentName: 'Sarah Johnson',
      parentPhone: '+1 (555) 876-5432',
      status: 'active',
      joinDate: '2022-08-15',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      subjects: ['Mathematics', 'Biology', 'Chemistry', 'English']
    },
    {
      id: 3,
      name: 'Michael Brown',
      grade: '11',
      class: '11-A',
      rollNumber: '1101',
      email: 'michael.brown@school.com',
      phone: '+1 (555) 345-6789',
      address: '789 Pine St, City',
      parentName: 'Robert Brown',
      parentPhone: '+1 (555) 765-4321',
      status: 'active',
      joinDate: '2021-07-20',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      subjects: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science']
    },
    {
      id: 4,
      name: 'Sophia Davis',
      grade: '11',
      class: '11-B',
      rollNumber: '1102',
      email: 'sophia.davis@school.com',
      phone: '+1 (555) 456-7890',
      address: '321 Elm St, City',
      parentName: 'Jennifer Davis',
      parentPhone: '+1 (555) 654-3210',
      status: 'inactive',
      joinDate: '2021-07-20',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      subjects: ['Biology', 'Chemistry', 'Physics', 'English']
    },
    {
      id: 5,
      name: 'William Wilson',
      grade: '12',
      class: '12-A',
      rollNumber: '1201',
      email: 'william.wilson@school.com',
      phone: '+1 (555) 567-8901',
      address: '654 Maple Ave, City',
      parentName: 'David Wilson',
      parentPhone: '+1 (555) 543-2109',
      status: 'active',
      joinDate: '2020-08-10',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Computer Science']
    },
    {
      id: 6,
      name: 'Olivia Taylor',
      grade: '12',
      class: '12-B',
      rollNumber: '1202',
      email: 'olivia.taylor@school.com',
      phone: '+1 (555) 678-9012',
      address: '987 Cedar St, City',
      parentName: 'Lisa Taylor',
      parentPhone: '+1 (555) 432-1098',
      status: 'active',
      joinDate: '2020-08-10',
      avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
      subjects: ['Biology', 'Chemistry', 'Physics', 'Mathematics']
    }
  ];

  // Sample data for dropdown options
  const grades = [
    { value: 'all', label: 'All Grades', icon: <BusinessIcon /> },
    { value: '10', label: 'Grade 10', icon: <BusinessIcon /> },
    { value: '11', label: 'Grade 11', icon: <BusinessIcon /> },
    { value: '12', label: 'Grade 12', icon: <BusinessIcon /> }
  ];

  const classes = [
    { value: 'all', label: 'All Classes', icon: <GroupIcon /> },
    { value: '10-A', label: 'Class 10-A', icon: <GroupIcon /> },
    { value: '10-B', label: 'Class 10-B', icon: <GroupIcon /> },
    { value: '11-A', label: 'Class 11-A', icon: <GroupIcon /> },
    { value: '11-B', label: 'Class 11-B', icon: <GroupIcon /> },
    { value: '12-A', label: 'Class 12-A', icon: <GroupIcon /> },
    { value: '12-B', label: 'Class 12-B', icon: <GroupIcon /> }
  ];

  const statuses = [
    { value: 'all', label: 'All Status', icon: <PersonIcon /> },
    { value: 'active', label: 'Active', icon: <PersonIcon /> },
    { value: 'inactive', label: 'Inactive', icon: <PersonIcon /> }
  ];

  const sortOptions = [
    { value: 'name', label: 'Student Name', icon: <ArrowUpwardIcon /> },
    { value: 'grade', label: 'Grade', icon: <ArrowUpwardIcon /> },
    { value: 'class', label: 'Class', icon: <ArrowUpwardIcon /> },
    { value: 'rollNumber', label: 'Roll Number', icon: <ArrowUpwardIcon /> }
  ];

  // Filter students based on search term and selected filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    
    return matchesSearch && matchesGrade && matchesClass && matchesStatus;
  });

  // Sort students based on selected sort option
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'grade':
        return a.grade.localeCompare(b.grade) || a.class.localeCompare(b.class);
      case 'class':
        return a.class.localeCompare(b.class);
      case 'rollNumber':
        return a.rollNumber.localeCompare(b.rollNumber);
      default:
        return 0;
    }
  });

  const handleViewStudent = (studentId) => {
    navigate(`/students/${studentId}`);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingStudent(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGradeChange = (value) => {
    setSelectedGrade(value);
  };

  const handleClassChange = (value) => {
    setSelectedClass(value);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleDeleteStudent = (studentId) => {
    // Implement delete functionality
  };

  return (
    <div className={`layout-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`students-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <div className="students-header">
          <h1>All Students</h1>
          <button className="add-student-btn" onClick={() => navigate('/students/add')}>
            <AddIcon /> Add New Student
          </button>
        </div>

        <div className="toolbar">
          <div className="toolbar-actions">
            <div className="search-box">
              <div className="search-input">
                <SearchIcon className="search-icon" />
                <input
                  type="text"
                  placeholder="Search students..."
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
                icon={<BusinessIcon />}
              />
              <CustomDropdown
                options={classes}
                value={selectedClass}
                onChange={handleClassChange}
                placeholder="Class"
                icon={<GroupIcon />}
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

        <div className="students-grid">
          {sortedStudents.map(student => (
            <div key={student.id} className="student-card">
              <div className="student-card-header">
                <img src={student.avatar} alt={student.name} className="student-avatar" />
                <div className="student-status" data-status={student.status}>
                  {student.status}
                </div>
              </div>
              
              <div className="student-card-body">
                <h3 className="student-name">{student.name}</h3>
                <p className="student-class">{student.class} • Roll No: {student.rollNumber}</p>
                
                <div className="student-info">
                  <div className="info-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span>{student.phone}</span>
                  </div>
                  <div className="info-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span>{student.email}</span>
                  </div>
                  <div className="info-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>{student.parentName}</span>
                  </div>
                </div>

                <div className="student-subjects">
                  <h4>Subjects</h4>
                  <div className="subject-tags">
                    {student.subjects.map((subject, index) => (
                      <span key={index} className="subject-tag">{subject}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="student-card-footer">
                <button 
                  className="view-student-btn"
                  onClick={() => handleViewStudent(student.id)}
                >
                  <VisibilityIcon /> View Profile
                </button>
                <div className="quick-actions">
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEditStudent(student)}
                  >
                    <EditIcon />
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDeleteStudent(student.id)}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Student Modal */}
      {isEditModalOpen && editingStudent && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Edit Student</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      defaultValue={editingStudent.name}
                      placeholder="Enter student name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="rollNumber">Roll Number</label>
                    <input
                      type="text"
                      id="rollNumber"
                      name="rollNumber"
                      defaultValue={editingStudent.rollNumber}
                      placeholder="Enter roll number"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="grade">Grade</label>
                    <CustomDropdown
                      options={grades.filter(g => g.value !== 'all')}
                      value={editingStudent.grade}
                      onChange={(value) => console.log('Grade changed:', value)}
                      placeholder="Select grade"
                      icon={<BusinessIcon />}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="class">Class</label>
                    <CustomDropdown
                      options={classes.filter(c => c.value !== 'all')}
                      value={editingStudent.class}
                      onChange={(value) => console.log('Class changed:', value)}
                      placeholder="Select class"
                      icon={<GroupIcon />}
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
                      defaultValue={editingStudent.email}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      defaultValue={editingStudent.phone}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="parentName">Parent Name</label>
                    <input
                      type="text"
                      id="parentName"
                      name="parentName"
                      defaultValue={editingStudent.parentName}
                      placeholder="Enter parent name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="parentPhone">Parent Phone</label>
                    <input
                      type="tel"
                      id="parentPhone"
                      name="parentPhone"
                      defaultValue={editingStudent.parentPhone}
                      placeholder="Enter parent phone"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <textarea
                    id="address"
                    name="address"
                    defaultValue={editingStudent.address}
                    placeholder="Enter address"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <CustomDropdown
                    options={statuses.filter(s => s.value !== 'all')}
                    value={editingStudent.status}
                    onChange={(value) => console.log('Status changed:', value)}
                    placeholder="Select status"
                    icon={<BadgeIcon />}
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

export default Students; 