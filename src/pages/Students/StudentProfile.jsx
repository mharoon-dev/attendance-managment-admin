import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import BadgeIcon from '@mui/icons-material/Badge';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import useSidebar from '../../hooks/useSidebar';
import './StudentProfile.css';
import { FiArrowLeft, FiEdit2, FiTrash2, FiMail, FiPhone, FiMapPin, 
  FiCalendar, FiBook, FiAward, FiUser } from 'react-icons/fi';
  import { BsPersonBadge, BsPeople, BsBuilding, BsBookHalf, BsGraphUp } from 
  'react-icons/bs';

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
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
    parentEmail: '',
    parentPhone: '',
    status: 'active',
    subjects: []
  });

  // Sample data for student
  const studentData = {
    id: 1,
    name: 'John Smith',
    grade: '10',
    class: 'A',
    rollNumber: '1001',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, USA',
    parentName: 'Michael Smith',
    parentEmail: 'michael.smith@example.com',
    parentPhone: '+1 (555) 987-6543',
    status: 'active',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    subjects: [
      { name: 'Mathematics', grade: 'A', score: 92 },
      { name: 'Physics', grade: 'B+', score: 88 },
      { name: 'Chemistry', grade: 'A-', score: 90 },
      { name: 'Biology', grade: 'A', score: 95 },
      { name: 'English', grade: 'B', score: 85 },
      { name: 'History', grade: 'A-', score: 91 }
    ],
    attendance: {
      present: 85,
      absent: 10,
      late: 5,
      total: 100
    },
    performance: {
      averageScore: 90,
      rank: 5,
      totalStudents: 32
    }
  };

  useEffect(() => {
    // Simulate API call to fetch student data
    const fetchStudentData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await api.get(`/students/${id}`);
        // setStudentData(response.data);
        
        // Simulate loading delay
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching student data:', error);
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  const handleEditStudent = () => {
    setEditingStudent(studentData);
    setIsEditModalOpen(true);
  };

  const handleDeleteStudent = () => {
    // This function is just a placeholder
    console.log('Delete student clicked');
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingStudent(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would be an API call to update the student
    console.log('Form submitted:', formData);
    handleCloseModal();
  };

  return (
    <div className={`layout-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`student-profile-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading student data...</p>
          </div>
        ) : (
          <>
            <div className="student-profile-header">
              <div className="back-button" onClick={() => navigate('/students')}>
                <ArrowBackIcon /> Back to Students
              </div>
              <div className="student-profile-title">
                <h1>{studentData.name}</h1>
                <div className="student-status" data-status={studentData.status}>
                  {studentData.status}
                </div>
              </div>
            </div>

            <div className="student-profile-tabs">
              <button 
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`tab-btn ${activeTab === 'academic' ? 'active' : ''}`}
                onClick={() => setActiveTab('academic')}
              >
                Academic
              </button>
              <button 
                className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
                onClick={() => setActiveTab('attendance')}
              >
                Attendance
              </button>
            </div>

            <div className="student-profile-content">
              {activeTab === 'overview' && (
                <div className="overview-section">
                  <div className="student-info-card">
                    <div className="student-avatar">
                      <img src={studentData.profileImage} alt={studentData.name} />
                    </div>
                    <div className="student-details">
                      <h2>Student Information</h2>
                      <div className="info-grid">
                        <div className="info-item">
                          <PersonIcon className="info-icon" />
                          <div className="info-details">
                            <span className="info-label">Name</span>
                            <span className="info-value">{studentData.name}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <BusinessIcon className="info-icon" />
                          <div className="info-details">
                            <span className="info-label">Grade</span>
                            <span className="info-value">{studentData.grade}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <GroupIcon className="info-icon" />
                          <div className="info-details">
                            <span className="info-label">Class</span>
                            <span className="info-value">{studentData.class}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <BadgeIcon className="info-icon" />
                          <div className="info-details">
                            <span className="info-label">Roll Number</span>
                            <span className="info-value">{studentData.rollNumber}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <EmailIcon className="info-icon" />
                          <div className="info-details">
                            <span className="info-label">Email</span>
                            <span className="info-value">{studentData.email}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <PhoneIcon className="info-icon" />
                          <div className="info-details">
                            <span className="info-label">Phone</span>
                            <span className="info-value">{studentData.phone}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <LocationOnIcon className="info-icon" />
                          <div className="info-details">
                            <span className="info-label">Address</span>
                            <span className="info-value">{studentData.address}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="parent-info-card">
                    <h2>Parent Information</h2>
                    <div className="info-grid">
                      <div className="info-item">
                        <PersonIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">Parent Name</span>
                          <span className="info-value">{studentData.parentName}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <EmailIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">Parent Email</span>
                          <span className="info-value">{studentData.parentEmail}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <PhoneIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">Parent Phone</span>
                          <span className="info-value">{studentData.parentPhone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="performance-summary-card">
                    <h2>Performance Summary</h2>
                    <div className="performance-stats">
                      <div className="performance-stat">
                        <MenuBookIcon className="stat-icon" />
                        <span className="stat-value">{studentData.performance.averageScore}%</span>
                        <span className="stat-label">Average Score</span>
                      </div>
                      <div className="performance-stat">
                        <EmojiEventsIcon className="stat-icon" />
                        <span className="stat-value">{studentData.performance.rank}/{studentData.performance.totalStudents}</span>
                        <span className="stat-label">Class Rank</span>
                      </div>
                      <div className="performance-stat">
                        <CalendarMonthIcon className="stat-icon" />
                        <span className="stat-value">{studentData.attendance.present}%</span>
                        <span className="stat-label">Attendance</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'academic' && (
                <div className="academic-section">
                  <div className="subjects-card">
                    <h2>Subjects & Grades</h2>
                    <div className="subjects-table-container">
                      <table className="subjects-table">
                        <thead>
                          <tr>
                            <th>Subject</th>
                            <th>Grade</th>
                            <th>Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentData.subjects.map((subject, index) => (
                            <tr key={index}>
                              <td>{subject.name}</td>
                              <td>{subject.grade}</td>
                              <td>{subject.score}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="performance-chart-card">
                    <h2>Performance Trends</h2>
                    <div className="student-chart-placeholder">
                      <p>Performance chart would be displayed here</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'attendance' && (
                <div className="attendance-section">
                  <div className="attendance-summary-card">
                    <h2>Attendance Summary</h2>
                    <div className="attendance-stats">
                      <div className="attendance-stat present">
                        <span className="stat-value">{studentData.attendance.present}%</span>
                        <span className="stat-label">Present</span>
                      </div>
                      <div className="attendance-stat absent">
                        <span className="stat-value">{studentData.attendance.absent}%</span>
                        <span className="stat-label">Absent</span>
                      </div>
                      <div className="attendance-stat late">
                        <span className="stat-value">{studentData.attendance.late}%</span>
                        <span className="stat-label">Late</span>
                      </div>
                    </div>
                    <div className="student-attendance-chart-placeholder">
                      <p>Attendance chart would be displayed here</p>
                    </div>
                  </div>

                  <div className="attendance-history-card">
                    <h2>Attendance History</h2>
                    <div className="attendance-table-container">
                      <table className="attendance-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>2023-10-01</td>
                            <td><span className="status-badge present">Present</span></td>
                            <td>-</td>
                          </tr>
                          <tr>
                            <td>2023-10-02</td>
                            <td><span className="status-badge present">Present</span></td>
                            <td>-</td>
                          </tr>
                          <tr>
                            <td>2023-10-03</td>
                            <td><span className="status-badge absent">Absent</span></td>
                            <td>Sick</td>
                          </tr>
                          <tr>
                            <td>2023-10-04</td>
                            <td><span className="status-badge late">Late</span></td>
                            <td>Traffic</td>
                          </tr>
                          <tr>
                            <td>2023-10-05</td>
                            <td><span className="status-badge present">Present</span></td>
                            <td>-</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
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
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      defaultValue={editingStudent.name}
                      onChange={handleInputChange}
                      placeholder="Enter student's full name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="rollNumber">Roll Number</label>
                    <input
                      type="text"
                      id="rollNumber"
                      name="rollNumber"
                      defaultValue={editingStudent.rollNumber}
                      onChange={handleInputChange}
                      placeholder="Enter roll number"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="grade">Grade</label>
                    <input
                      type="text"
                      id="grade"
                      name="grade"
                      defaultValue={editingStudent.grade}
                      onChange={handleInputChange}
                      placeholder="Enter grade"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="class">Class</label>
                    <input
                      type="text"
                      id="class"
                      name="class"
                      defaultValue={editingStudent.class}
                      onChange={handleInputChange}
                      placeholder="Enter class"
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
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      defaultValue={editingStudent.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <textarea
                    id="address"
                    name="address"
                    defaultValue={editingStudent.address}
                    onChange={handleInputChange}
                    placeholder="Enter address"
                    rows="2"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="parentName">Parent Name</label>
                    <input
                      type="text"
                      id="parentName"
                      name="parentName"
                      defaultValue={editingStudent.parentName}
                      onChange={handleInputChange}
                      placeholder="Enter parent's name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="parentPhone">Parent Phone</label>
                    <input
                      type="text"
                      id="parentPhone"
                      name="parentPhone"
                      defaultValue={editingStudent.parentPhone}
                      onChange={handleInputChange}
                      placeholder="Enter parent's phone"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="parentEmail">Parent Email</label>
                  <input
                    type="email"
                    id="parentEmail"
                    name="parentEmail"
                    defaultValue={editingStudent.parentEmail}
                    onChange={handleInputChange}
                    placeholder="Enter parent's email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={editingStudent.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
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

export default StudentProfile; 