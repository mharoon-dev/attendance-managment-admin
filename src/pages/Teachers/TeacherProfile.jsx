import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import useSidebar from '../../hooks/useSidebar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ClassIcon from '@mui/icons-material/Class';
import BookIcon from '@mui/icons-material/Book';
import BadgeIcon from '@mui/icons-material/Badge';
import BusinessIcon from '@mui/icons-material/Business';
import './TeacherProfile.css';
import { useDispatch, useSelector } from 'react-redux';

const TeacherProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { teachers } = useSelector((state) => state.teachers);
  console.log(teachers);
  const [teacher, setTeacher] = useState(null);
  console.log(teacher);
  console.log(id);
  
  useEffect(() => {
    const teacher = teachers.find((teacher) => teacher._id === id);
    setTeacher(teacher);
    console.log(teacher);
  }, [id]);

  const getTabContent = () => {
        return (
          <div className="profile-section">
            <div className="profile-header">
              <img src={teacher?.profileImage} className="profile-avatar" alt={teacher?.fullName} />
              <div className="profile-info">
                <h2>{teacher?.fullName}</h2>
                <div className="contact-info">
                  <span><EmailIcon /> {teacher?.emailAddress}</span>
                  <span><PhoneIcon /> {teacher?.phoneNumber}</span>
                </div>
              </div>
            </div>
            <div className="profile-details">
              <div className="detail-item">
                <label>Date of Birth</label>
                <p>{new Date(teacher?.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div className="detail-item">
                <label>Gender</label>
                <p>{teacher?.gender}</p>
              </div>
              <div className="detail-item">
                <label>NIC</label>
                <p>{teacher?.nic}</p>
              </div>
              <div className="detail-item">
                <label>Father's Name</label>
                <p>{teacher?.fatherName}</p>
              </div>
              <div className="detail-item">
                <label>Marital Status</label>
                <p>{teacher?.maritalStatus}</p>
              </div>
              <div className="detail-item">
                <label>Degree Title</label>
                <p>{teacher?.degreeTitle}</p>
              </div>
              <div className="detail-item">
                <label>Board</label>
                <p>{teacher?.board}</p>
              </div>
              <div className="detail-item">
                <label>Grade</label>
                <p>{teacher?.grade}</p>
              </div>
              <div className="detail-item">
                <label>Next of Kin</label>
                <p>{teacher?.nextOfKinPhoneNumber}</p>
              </div>
              <div className="detail-item">
                <label>Address</label>
                <p>{teacher?.fullAddress}</p>
              </div>

            
              </div>

              <br />
              <h3 className="">Job Details</h3>
              <br />
              <div className="profile-details">

                <div className="detail-item"> 
                  <label>Designation</label>
                  <p>{teacher?.jobDetails?.designation}</p>
                </div>
                <div className="detail-item">
                  <label>Joining Date</label>
                  <p>{new Date(teacher?.jobDetails?.joiningDate).toLocaleDateString()}</p>
                </div>
                <div className="detail-item">
                  <label>Working Hours</label>
                  <p>{teacher?.jobDetails?.workingHours}</p>
                </div>
                <div className="detail-item">
                  <label>Salary</label>
                  <p>Rs. {teacher?.jobDetails?.salary}</p>
                </div>
                <div className="detail-item">
                  <label>Teacher ID</label>
                  <p>{teacher?.jobDetails?.teacherId}</p>
                </div>
              </div>
                </div>
        );
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
            <ArrowBackIcon /> Back to Teachers
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