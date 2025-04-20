import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import BadgeIcon from '@mui/icons-material/Badge';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import EmailIcon from '@mui/icons-material/Email';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import useSidebar from '../../hooks/useSidebar';
import './StudentProfile.css';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader/Loader';

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { students } = useSelector((state) => state.students);
  const student = students.find((student) => student._id === id);
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (student) {
      setIsLoading(false);
    }
  }, [student]);

  return (
    <div className={`layout-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`student-profile-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="student-profile-header">
              <div className="back-button" onClick={() => navigate('/students')}>
                <ArrowBackIcon /> Back to Students
              </div>
              <div className="student-profile-title">
                <h1>{student.fullName}</h1>
                <div className="student-status">
                  <BadgeIcon className="status-icon" />
                  <span>Grade {student.grade}</span>
                </div>
              </div>
            </div>

            <div className="student-profile-content">
              <div className="profile-grid">
                {/* Student Information Card */}
                <div className="profile-card student-info-card">
                  <div className="card-header">
                    <div className="card-header-icon">
                      <PersonIcon />
                    </div>
                    <h2>Student Information</h2>
                  </div>
                  <div className="card-content">
                    <div className="student-avatar">
                      <img src={student.profileImage} alt={student.fullName} />
                    </div>
                    <div className="info-grid">
                      <div className="info-item">
                        <PersonIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">Full Name</span>
                          <span className="info-value">{student.fullName}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <CalendarMonthIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">Date of Birth</span>
                          <span className="info-value">{new Date(student.dateOfBirth).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <PersonIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">Gender</span>
                          <span className="info-value">{student.gender}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <PhoneIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">Phone Number</span>
                          <span className="info-value">{student.phoneNumber}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <LocationOnIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">Address</span>
                          <span className="info-value">{student.fullAddress}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parent Information Card */}
                <div className="profile-card parent-info-card">
                  <div className="card-header">
                    <div className="card-header-icon">
                      <GroupIcon />
                    </div>
                    <h2>Parent Information</h2>
                  </div>
                  <div className="card-content">
                    <div className="student-avatar">
                      <img src={student.parentDetails.profileImage || 'https://via.placeholder.com/150'} alt={student.parentDetails.fullName} />
                    </div>
                    <div className="info-grid">
                      <div className="info-item">
                        <PersonIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">Full Name</span>
                          <span className="info-value">{student.parentDetails.fullName}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <CalendarMonthIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">Date of Birth</span>
                          <span className="info-value">{new Date(student.parentDetails.dateOfBirth).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <PersonIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">Gender</span>
                          <span className="info-value">{student.parentDetails.gender}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <PhoneIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">Phone Number</span>
                          <span className="info-value">{student.parentDetails.phoneNumber}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <MenuBookIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">Education</span>
                          <span className="info-value">{student.parentDetails.education}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <WorkIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">Profession</span>
                          <span className="info-value">{student.parentDetails.profession}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* School Information Card */}
                <div className="profile-card school-info-card">
                  <div className="card-header">
                    <div className="card-header-icon">
                      <SchoolIcon />
                    </div>
                    <h2>School Information</h2>
                  </div>
                  <div className="card-content">
                  
                    <div className="info-grid">
                      <div className="info-item">
                        <BadgeIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">Roll Number</span>
                          <span className="info-value">{student.schoolDetails.rollNumber}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <CalendarMonthIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">Joining Date</span>
                          <span className="info-value">{new Date(student.schoolDetails.joiningDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <MenuBookIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">Previous Institute</span>
                          <span className="info-value">{student.schoolDetails.previousInstitute}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <BadgeIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">Grade</span>
                          <span className="info-value">{student.grade}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents Card */}
                <div className="profile-card documents-card">
                  <div className="card-header">
                    <div className="card-header-icon">
                      <MenuBookIcon />
                    </div>
                    <h2>Documents</h2>
                  </div>
                  <div className="card-content">
                    <div className="documents-grid">
                      {student.nicImage && (
                        <div className="document-item">
                          <div className="document-icon">
                            <BadgeIcon />
                          </div>
                          <h3>Student NIC</h3>
                          <div className="document-image-container">
                            <img src={student.nicImage} alt="Student NIC" />
                          </div>
                        </div>
                      )}
                      {student.parentDetails.nicImage && (
                        <div className="document-item">
                          <div className="document-icon">
                            <BadgeIcon />
                          </div>
                          <h3>Parent NIC</h3>
                          <div className="document-image-container">
                            <img src={student.parentDetails.nicImage} alt="Parent NIC" />
                          </div>
                        </div>
                      )}
                      {student.schoolDetails.previousDegreeWithImage && (
                        <div className="document-item">
                          <div className="document-icon">
                            <MenuBookIcon />
                          </div>
                          <h3>Previous Degree</h3>
                          <div className="document-image-container">
                            <img 
                              src={student.schoolDetails.previousDegreeWithImage} 
                              alt="Previous Degree" 
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentProfile; 