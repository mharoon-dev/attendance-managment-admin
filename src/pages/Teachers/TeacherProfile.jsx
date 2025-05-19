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
  

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return 'N/A';
    const cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.replace(/^(\d{4})(\d+)/, '$1-$2');
  };

  const formatNIC = (nic) => {
    if (!nic) return 'N/A';
    let newNic;
    const part1 = nic.slice(0,5);
    const part2 = nic.slice(5,11);
    const part3 = nic.slice(11);
    newNic = part1 + '-' + part2 + '-' + part3;
    return newNic;
  };



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
              <span><PhoneIcon /> {formatPhoneNumber(teacher?.phoneNumber)}</span>
            </div>
            
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-section">
            <h3><PersonIcon /> ذاتی معلومات</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>تاریخ پیدائش</label>
                <p><CalendarTodayIcon /> {new Date(teacher?.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div className="detail-item">
                <label>جنس</label>
                <p><PersonIcon /> {teacher?.gender}</p>
              </div>
              <div className="detail-item">
                <label>شناختی کارڈ نمبر</label>
                <p><BadgeIcon /> {formatNIC(teacher?.nic)}</p>
              </div>
              <div className="detail-item">
                <label>والد کا نام</label>
                <p><FamilyRestroomIcon /> {teacher?.fatherName}</p>
              </div>
              <div className="detail-item">
                <label>شادی شدہ حیثیت</label>
                <p><FamilyRestroomIcon /> {teacher?.maritalStatus}</p>
              </div>
              <div className="detail-item">
                <label>پتہ</label>
                <p><LocationOnIcon /> {teacher?.fullAddress}</p>
              </div>
              <div className="detail-item">
                <label>قریبی رشتہ دار کا رابطہ</label>
                <p><PhoneIcon /> {formatPhoneNumber(teacher?.nextOfKinPhoneNumber)}</p>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3><SchoolIcon /> تعلیمی معلومات</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>ڈگری کا عنوان</label>
                <p><BookIcon /> {teacher?.degreeTitle}</p>
              </div>
              <div className="detail-item">
                <label>بورڈ</label>
                <p><AccountBalanceIcon /> {teacher?.board}</p>
              </div>
              <div className="detail-item">
                <label>گریڈ</label>
                <p><SchoolIcon /> {teacher?.grade}</p>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3><WorkIcon /> ملازمت کی تفصیلات</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>عہدہ</label>
                <p><WorkIcon /> {teacher?.jobDetails?.designation}</p>
              </div>
              <div className="detail-item">
                <label>تاریخ تقرری</label>
                <p><CalendarTodayIcon /> {new Date(teacher?.jobDetails?.joiningDate).toLocaleDateString()}</p>
              </div>
              <div className="detail-item">
                <label>کام کے اوقات</label>
                <p><WorkIcon /> {teacher?.jobDetails?.workingHours}</p>
              </div>
              <div className="detail-item">
                <label>استاد کی شناخت</label>
                <p><BadgeIcon /> {teacher?.jobDetails?.teacherId}</p>
              </div>
              {(user.role === "admin" || user.role === "superAdmin") && (
                <div className="detail-item">
                  <label>تنخواہ</label>
                  <p><WorkIcon /> روپے {teacher?.jobDetails?.salary?.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          {teacher?.nicImage && teacher.nicImage.length > 0 && (
            <div className="detail-section">
              <h3><DescriptionIcon /> شناختی کارڈ کا دستاویز</h3>
              <div className="marksheet-grid">
                {teacher.nicImage.map((image, index) => (
                  <div 
                    key={index} 
                    className="marksheet-item"
                    onClick={() => handleImageClick(image)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={image} alt={`NIC Document ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {teacher?.marksheetImages?.length > 0 && (
            <div className="detail-section">
              <h3><BookIcon /> مارک شیٹس</h3>
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
            <ArrowBackIcon /> اساتذہ کی طرف واپس جائیں
          </button>
        </div>

        <div className="profile-content">
          {loading ? (
            <div className="loading-spinner">لوڈ ہو رہا ہے...</div>
          ) : teacher ? (
            getTabContent()
          ) : (
            <div className="not-found">استاد نہیں ملا</div>
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