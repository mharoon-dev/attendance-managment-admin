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
import './SubjectProfile.css';
import Loader from '../../components/Loader/Loader';

const SubjectProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
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

  // Sample data for subject
  const subjectData = {
    id: 1,
    name: 'Mathematics',
    code: 'MATH101',
    grade: '10',
    teacher: 'Dr. Sarah Johnson',
    teacherEmail: 'sarah.johnson@school.com',
    teacherPhone: '+1 (555) 123-4567',
    description: 'Advanced mathematics covering algebra, calculus, and statistics. This course provides a comprehensive understanding of mathematical concepts and their applications in real-world scenarios.',
    status: 'active',
    credits: '5',
    schedule: 'Mon, Wed, Fri - 9:00 AM',
    room: 'Room 301',
    students: 32,
    attendance: 95,
    performance: 88,
    syllabus: [
      { week: 1, topic: 'Introduction to Algebra', description: 'Basic algebraic concepts and operations' },
      { week: 2, topic: 'Linear Equations', description: 'Solving linear equations and inequalities' },
      { week: 3, topic: 'Quadratic Functions', description: 'Understanding quadratic equations and their graphs' },
      { week: 4, topic: 'Polynomials', description: 'Working with polynomial functions and their properties' },
      { week: 5, topic: 'Exponential and Logarithmic Functions', description: 'Study of exponential and logarithmic relationships' },
      { week: 6, topic: 'Trigonometry', description: 'Introduction to trigonometric functions and identities' },
      { week: 7, topic: 'Introduction to Calculus', description: 'Limits, derivatives, and basic integration' },
      { week: 8, topic: 'Applications of Calculus', description: 'Real-world applications of calculus concepts' },
      { week: 9, topic: 'Statistics', description: 'Data analysis, probability, and statistical inference' },
      { week: 10, topic: 'Final Review', description: 'Comprehensive review of all topics covered' }
    ],
    assignments: [
      { id: 1, title: 'Algebraic Expressions', dueDate: '2023-10-15', status: 'completed' },
      { id: 2, title: 'Linear Equations Worksheet', dueDate: '2023-10-22', status: 'completed' },
      { id: 3, title: 'Quadratic Functions Project', dueDate: '2023-11-05', status: 'pending' },
      { id: 4, title: 'Polynomial Functions Quiz', dueDate: '2023-11-12', status: 'pending' },
      { id: 5, title: 'Exponential Functions Assignment', dueDate: '2023-11-19', status: 'pending' }
    ],
    studentsList: [
      { id: 1, name: 'John Smith', grade: 'A', attendance: '95%', performance: '92%' },
      { id: 2, name: 'Emily Johnson', grade: 'B+', attendance: '90%', performance: '85%' },
      { id: 3, name: 'Michael Brown', grade: 'A-', attendance: '100%', performance: '88%' },
      { id: 4, name: 'Sophia Davis', grade: 'B', attendance: '85%', performance: '82%' },
      { id: 5, name: 'William Wilson', grade: 'A', attendance: '95%', performance: '90%' },
      { id: 6, name: 'Olivia Taylor', grade: 'B+', attendance: '90%', performance: '87%' },
      { id: 7, name: 'James Anderson', grade: 'A-', attendance: '100%', performance: '89%' },
      { id: 8, name: 'Emma Martinez', grade: 'B', attendance: '85%', performance: '84%' },
      { id: 9, name: 'Daniel Thompson', grade: 'A', attendance: '95%', performance: '91%' },
      { id: 10, name: 'Isabella Garcia', grade: 'B+', attendance: '90%', performance: '86%' }
    ]
  };

  useEffect(() => {
    // Simulate API call to fetch subject data
    const fetchSubjectData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await api.get(`/subjects/${id}`);
        // setSubjectData(response.data);
        
        // Simulate loading delay
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching subject data:', error);
        setIsLoading(false);
      }
    };

    fetchSubjectData();
  }, [id]);

  const handleEditSubject = () => {
    setEditingSubject(subjectData);
    setFormData({
      name: subjectData.name,
      code: subjectData.code,
      grade: subjectData.grade,
      teacher: subjectData.teacher,
      description: subjectData.description,
      status: subjectData.status,
      credits: subjectData.credits,
      schedule: subjectData.schedule,
      room: subjectData.room
    });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingSubject(null);
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
    // In a real app, this would be an API call to update the subject
    console.log('Form submitted:', formData);
    handleCloseModal();
  };

  return (
    <div className={`layout-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`subject-profile-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        {isLoading ? (
   <Loader />
        ) : (
          <>
            <div className="subject-profile-header">
              <div className="back-button" onClick={() => navigate('/subjects')}>
                <ArrowBackIcon /> مضامین پر واپس جائیں
              </div>
              <div className="subject-profile-title">
                <h1>{subjectData.name}</h1>
                <div className="subject-status" data-status={subjectData.status}>
                  {subjectData.status === 'active' ? 'فعال' : 'غیر فعال'}
                </div>
              </div>
            </div>

            <div className="subject-profile-tabs">
              <button 
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                جائزہ
              </button>
              <button 
                className={`tab-btn ${activeTab === 'syllabus' ? 'active' : ''}`}
                onClick={() => setActiveTab('syllabus')}
              >
                نصاب
              </button>
              <button 
                className={`tab-btn ${activeTab === 'assignments' ? 'active' : ''}`}
                onClick={() => setActiveTab('assignments')}
              >
                اسائنمنٹس
              </button>
              <button 
                className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
                onClick={() => setActiveTab('students')}
              >
                طلباء
              </button>
            </div>

            <div className="subject-profile-content">
              {activeTab === 'overview' && (
                <div className="overview-section">
                  <div className="subject-info-card">
                    <div className="subject-icon-large">
                      <MenuBookIcon />
                    </div>
                    <div className="subject-details">
                      <h2>مضمون کی معلومات</h2>
                      <div className="info-grid">
                        <div className="info-item">
                          <MenuBookIcon className="info-icon" />
                          <div className="info-details">
                            <span className="info-label">مضمون کا نام</span>
                            <span className="info-value">{subjectData.name}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <BadgeIcon className="info-icon" />
                          <div className="info-details">
                            <span className="info-label">مضمون کا کوڈ</span>
                            <span className="info-value">{subjectData.code}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <BusinessIcon className="info-icon" />
                          <div className="info-details">
                            <span className="info-label">گریڈ</span>
                            <span className="info-value">{subjectData.grade}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <PersonIcon className="info-icon" />
                          <div className="info-details">
                            <span className="info-label">استاد</span>
                            <span className="info-value">{subjectData.teacher}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <EmailIcon className="info-icon" />
                          <div className="info-details">
                            <span className="info-label">استاد کا ای میل</span>
                            <span className="info-value">{subjectData.teacherEmail}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <PhoneIcon className="info-icon" />
                          <div className="info-details">
                            <span className="info-label">استاد کا فون</span>
                            <span className="info-value">{subjectData.teacherPhone}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <LocationOnIcon className="info-icon" />
                          <div className="info-details">
                            <span className="info-label">روم</span>
                            <span className="info-value">{subjectData.room}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <CalendarMonthIcon className="info-icon" />
                          <div className="info-details">
                            <span className="info-label">شیڈول</span>
                            <span className="info-value">{subjectData.schedule}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="subject-description-card">
                    <h2>تفصیل</h2>
                    <p>{subjectData.description}</p>
                  </div>

                  <div className="subject-stats-card">
                    <h2>مضمون کی شماریات</h2>
                    <div className="stats-grid">
                      <div className="stat-card">
                        <GroupIcon className="stat-icon" />
                        <div className="stat-info">
                          <span className="stat-value">{subjectData.students}</span>
                          <span className="stat-label">رجسٹرڈ طلباء</span>
                        </div>
                      </div>
                      <div className="stat-card">
                        <CalendarMonthIcon className="stat-icon" />
                        <div className="stat-info">
                          <span className="stat-value">{subjectData.attendance}%</span>
                          <span className="stat-label">اوسط حاضری</span>
                        </div>
                      </div>
                      <div className="stat-card">
                        <EmojiEventsIcon className="stat-icon" />
                        <div className="stat-info">
                          <span className="stat-value">{subjectData.performance}%</span>
                          <span className="stat-label">اوسط کارکردگی</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'syllabus' && (
                <div className="syllabus-section">
                  <div className="syllabus-card">
                    <h2>کورس کا نصاب</h2>
                    <div className="syllabus-timeline">
                      {subjectData.syllabus.map((week, index) => (
                        <div key={index} className="syllabus-item">
                          <div className="syllabus-week">ہفتہ {week.week}</div>
                          <div className="syllabus-content">
                            <h3>{week.topic}</h3>
                            <p>{week.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'assignments' && (
                <div className="assignments-section">
                  <div className="assignments-card">
                    <h2>اسائنمنٹس</h2>
                    <div className="assignments-table-container">
                      <table className="assignments-table">
                        <thead>
                          <tr>
                            <th>عنوان</th>
                            <th>آخری تاریخ</th>
                            <th>حالت</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subjectData.assignments.map(assignment => (
                            <tr key={assignment.id}>
                              <td>{assignment.title}</td>
                              <td>{assignment.dueDate}</td>
                              <td>
                                <span className={`status-badge ${assignment.status}`}>
                                  {assignment.status === 'completed' ? 'مکمل' : 'زیر التواء'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'students' && (
                <div className="students-section">
                  <div className="students-card">
                    <h2>رجسٹرڈ طلباء</h2>
                    <div className="students-table-container">
                      <table className="students-table">
                        <thead>
                          <tr>
                            <th>نام</th>
                            <th>گریڈ</th>
                            <th>حاضری</th>
                            <th>کارکردگی</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subjectData.studentsList.map(student => (
                            <tr key={student.id}>
                              <td>{student.name}</td>
                              <td>{student.grade}</td>
                              <td>{student.attendance}</td>
                              <td>{student.performance}</td>
                            </tr>
                          ))}
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

      {/* Edit Subject Modal */}
      {isEditModalOpen && editingSubject && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>مضمون میں ترمیم کریں</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">مضمون کا نام</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="مضمون کا نام درج کریں"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="code">مضمون کا کوڈ</label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="مضمون کا کوڈ درج کریں"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="grade">گریڈ</label>
                    <input
                      type="text"
                      id="grade"
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      placeholder="گریڈ درج کریں"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="teacher">استاد</label>
                    <input
                      type="text"
                      id="teacher"
                      name="teacher"
                      value={formData.teacher}
                      onChange={handleInputChange}
                      placeholder="استاد کا نام درج کریں"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="credits">کریڈٹس</label>
                    <input
                      type="text"
                      id="credits"
                      name="credits"
                      value={formData.credits}
                      onChange={handleInputChange}
                      placeholder="کریڈٹس درج کریں"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="room">روم</label>
                    <input
                      type="text"
                      id="room"
                      name="room"
                      value={formData.room}
                      onChange={handleInputChange}
                      placeholder="روم نمبر درج کریں"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="schedule">شیڈول</label>
                  <input
                    type="text"
                    id="schedule"
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleInputChange}
                    placeholder="شیڈول درج کریں"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">تفصیل</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="تفصیل درج کریں"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="status">حالت</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">فعال</option>
                    <option value="inactive">غیر فعال</option>
                  </select>
                </div>

                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                    منسوخ کریں
                  </button>
                  <button type="submit" className="save-btn">
                    <SaveIcon /> تبدیلیاں محفوظ کریں
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

export default SubjectProfile; 