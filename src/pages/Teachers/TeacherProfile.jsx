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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import WorkIcon from '@mui/icons-material/Work';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DescriptionIcon from '@mui/icons-material/Description';
import './TeacherProfile.css';
import { useDispatch, useSelector } from 'react-redux';
import ImageViewer from '../../components/ImageViewer/ImageViewer';

const TeacherProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { teachers } = useSelector((state) => state.teachers);
  const { user } = useSelector((state) => state.user);
  const [teacher, setTeacher] = useState(null);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  
  useEffect(() => {
    const teacher = teachers.find((teacher) => teacher._id === id);
    setTeacher(teacher);
  }, [id, teachers]);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageViewer(true);
  };

  const getTabContent = () => {
    return (
      <div className="profile-section">
        <div className="profile-header">
          <div className="avatar-container">
            <img 
              src={teacher?.profileImage || '/default-avatar.png'} 
              className="profile-avatar" 
              alt={teacher?.fullName}
              onClick={() => handleImageClick(teacher?.profileImage || '/default-avatar.png')}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div className="profile-info">
            <h2>{teacher?.fullName}</h2>
            <div className="contact-info">
              <span><EmailIcon /> {teacher?.emailAddress}</span>
              <span><PhoneIcon /> {teacher?.phoneNumber}</span>
            </div>
            
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-section">
            <h3><PersonIcon /> Personal Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Date of Birth</label>
                <p><CalendarTodayIcon /> {new Date(teacher?.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div className="detail-item">
                <label>Gender</label>
                <p><PersonIcon /> {teacher?.gender}</p>
              </div>
              <div className="detail-item">
                <label>NIC</label>
                <p><BadgeIcon /> {teacher?.nic}</p>
              </div>
              <div className="detail-item">
                <label>Father's Name</label>
                <p><FamilyRestroomIcon /> {teacher?.fatherName}</p>
              </div>
              <div className="detail-item">
                <label>Marital Status</label>
                <p><FamilyRestroomIcon /> {teacher?.maritalStatus}</p>
              </div>
              <div className="detail-item">
                <label>Address</label>
                <p><LocationOnIcon /> {teacher?.fullAddress}</p>
              </div>
              <div className="detail-item">
                <label>Next of Kin Contact</label>
                <p><PhoneIcon /> {teacher?.nextOfKinPhoneNumber}</p>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3><SchoolIcon /> Educational Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Degree Title</label>
                <p><BookIcon /> {teacher?.degreeTitle}</p>
              </div>
              <div className="detail-item">
                <label>Board</label>
                <p><AccountBalanceIcon /> {teacher?.board}</p>
              </div>
              <div className="detail-item">
                <label>Grade</label>
                <p><SchoolIcon /> {teacher?.grade}</p>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3><WorkIcon /> Job Details</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Designation</label>
                <p><WorkIcon /> {teacher?.jobDetails?.designation}</p>
              </div>
              <div className="detail-item">
                <label>Joining Date</label>
                <p><CalendarTodayIcon /> {new Date(teacher?.jobDetails?.joiningDate).toLocaleDateString()}</p>
              </div>
              <div className="detail-item">
                <label>Working Hours</label>
                <p><WorkIcon /> {teacher?.jobDetails?.workingHours}</p>
              </div>
              <div className="detail-item">
                <label>Teacher ID</label>
                <p><BadgeIcon /> {teacher?.jobDetails?.teacherId}</p>
              </div>
              {(user.role === "admin" || user.role === "superAdmin") && (
                <div className="detail-item">
                  <label>Salary</label>
                  <p><WorkIcon /> Rs. {teacher?.jobDetails?.salary?.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          {teacher?.nicImage && (
            <div className="detail-section">
              <h3><DescriptionIcon /> NIC Document</h3>
              <div className="document-container">
                <img 
                  src={teacher.nicImage} 
                  alt="NIC Document" 
                  className="document-image"
                  onClick={() => handleImageClick(teacher.nicImage)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>
          )}

          {teacher?.marksheetImages?.length > 0 && (
            <div className="detail-section">
              <h3><BookIcon /> Marksheets</h3>
              <div className="marksheet-grid">
                {teacher.marksheetImages.map((image, index) => (
                  <div 
                    key={index} 
                    className="marksheet-item"
                    onClick={() => handleImageClick(image)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={image} alt={`Marksheet ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
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
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : teacher ? (
            getTabContent()
          ) : (
            <div className="not-found">Teacher not found</div>
          )}
        </div>

        {showImageViewer && (
          <ImageViewer
            imageUrl={selectedImage}
            onClose={() => setShowImageViewer(false)}
          />
        )}
      </div>
    </div>
  );
};

export default TeacherProfile; 