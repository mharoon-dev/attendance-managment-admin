import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import useSidebar from '../../hooks/useSidebar';
import './Profile.css';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import BadgeIcon from '@mui/icons-material/Badge';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TransgenderIcon from '@mui/icons-material/Transgender';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ImageViewer from '../../components/ImageViewer/ImageViewer';

const Profile = () => {
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const { user } = useSelector((state) => state.user);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageViewer(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('ur-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`layout-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`profile-page-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <div className="profile-page-header">
          <h1>میری پروفائل</h1>
        </div>

        <div className="profile-page-content">
          <div className="profile-page-card">
            <div className="profile-page-image-section">
              <div className="profile-page-image-container">
                <img 
                  src={user?.teacher?.profileImage || 'https://via.placeholder.com/150'} 
                  alt="پروفائل" 
                  className="profile-page-image"
                  onClick={() => handleImageClick(user?.teacher?.profileImage || 'https://via.placeholder.com/150')}
                  style={{ cursor: 'pointer' }}
                />
              </div>
              <div className="profile-page-basic-info">
                <h2>{user?.teacher?.fullName || 'N/A'}</h2>
                <p className="profile-page-role-badge">
                  <WorkIcon className="profile-page-icon" />
                  {user?.role}
                </p>
                <p className="profile-page-teacher-id">
                  <BadgeIcon className="profile-page-icon" />
                  شناختی کارڈ: {user?.teacherId}
                </p>
              </div>
            </div>

            <div className="profile-page-details">
              <div className="profile-page-details-section">
                <h3 style={{display: 'flex', justifyContent: 'end', width: '100%'}}>
                  <PersonIcon className="profile-page-section-icon" />
                  ذاتی معلومات
                </h3>
                <div className="profile-page-details-grid">
                  <div className="profile-page-detail-item">
                    <CalendarMonthIcon className="profile-page-detail-icon" />
                    <div className="profile-page-detail-content">
                      <span className="profile-page-detail-label">تاریخ پیدائش</span>
                      <span className="profile-page-detail-value">{formatDate(user?.teacher?.dateOfBirth)}</span>
                    </div>
                  </div>
                  <div className="profile-page-detail-item">
                    <TransgenderIcon className="profile-page-detail-icon" />
                    <div className="profile-page-detail-content">
                      <span className="profile-page-detail-label">جنس</span>
                      <span className="profile-page-detail-value">{user?.teacher?.gender || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="profile-page-detail-item">
                    <BadgeIcon className="profile-page-detail-icon" />
                    <div className="profile-page-detail-content">
                      <span className="profile-page-detail-label">قومی شناختی کارڈ</span>
                      <span className="profile-page-detail-value">{user?.teacher?.nic || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="profile-page-detail-item">
                    <FamilyRestroomIcon className="profile-page-detail-icon" />
                    <div className="profile-page-detail-content">
                      <span className="profile-page-detail-label">شادی شدہ</span>
                      <span className="profile-page-detail-value">{user?.teacher?.maritalStatus || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-page-details-section">
                <h3>
                  <PhoneIcon className="profile-page-section-icon" />
                  رابطے کی معلومات
                </h3>
                <div className="profile-page-details-grid">
                  <div className="profile-page-detail-item">
                    <PhoneIcon className="profile-page-detail-icon" />
                    <div className="profile-page-detail-content">
                      <span className="profile-page-detail-label">فون نمبر</span>
                      <span className="profile-page-detail-value">{user?.teacher?.phoneNumber || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="profile-page-detail-item">
                    <PhoneIcon className="profile-page-detail-icon" />
                    <div className="profile-page-detail-content">
                      <span className="profile-page-detail-label">قریبی رشتہ دار کا فون</span>
                      <span className="profile-page-detail-value">{user?.teacher?.nextOfKinPhoneNumber || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="profile-page-detail-item">
                    <EmailIcon className="profile-page-detail-icon" />
                    <div className="profile-page-detail-content">
                      <span className="profile-page-detail-label">ای میل</span>
                      <span className="profile-page-detail-value">{user?.teacher?.emailAddress || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="profile-page-detail-item">
                    <LocationOnIcon className="profile-page-detail-icon" />
                    <div className="profile-page-detail-content">
                      <span className="profile-page-detail-label">پتہ</span>
                      <span className="profile-page-detail-value">{user?.teacher?.fullAddress || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {user?.teacher?.jobDetails && (
                <div className="profile-page-details-section">
                  <h3>
                    <WorkIcon className="profile-page-section-icon" />
                    ملازمت کی تفصیلات
                  </h3>
                  <div className="profile-page-details-grid">
                    <div className="profile-page-detail-item">
                      <WorkIcon className="profile-page-detail-icon" />
                      <div className="profile-page-detail-content">
                        <span className="profile-page-detail-label">عہدہ</span>
                        <span className="profile-page-detail-value">{user?.teacher?.jobDetails?.designation || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="profile-page-detail-item">
                      <CalendarMonthIcon className="profile-page-detail-icon" />
                      <div className="profile-page-detail-content">
                        <span className="profile-page-detail-label">شمولیت کی تاریخ</span>
                        <span className="profile-page-detail-value">{formatDate(user?.teacher?.jobDetails?.joiningDate)}</span>
                      </div>
                    </div>
                    <div className="profile-page-detail-item">
                      <WorkIcon className="profile-page-detail-icon" />
                      <div className="profile-page-detail-content">
                        <span className="profile-page-detail-label">کام کے اوقات</span>
                        <span className="profile-page-detail-value">{user?.teacher?.jobDetails?.workingHours || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="profile-page-detail-item">
                      <WorkIcon className="profile-page-detail-icon" />
                      <div className="profile-page-detail-content">
                        <span className="profile-page-detail-label">تنخواہ</span>
                        <span className="profile-page-detail-value">${user?.teacher?.jobDetails?.salary || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="profile-page-details-section">
                <h3>
                  <SchoolIcon className="profile-page-section-icon" />
                  تعلیمی تفصیلات
                </h3>
                <div className="profile-page-details-grid">
                  <div className="profile-page-detail-item">
                    <SchoolIcon className="profile-page-detail-icon" />
                    <div className="profile-page-detail-content">
                      <span className="profile-page-detail-label">ڈگری کا عنوان</span>
                      <span className="profile-page-detail-value">{user?.teacher?.degreeTitle || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="profile-page-detail-item">
                    <SchoolIcon className="profile-page-detail-icon" />
                    <div className="profile-page-detail-content">
                      <span className="profile-page-detail-label">بورڈ</span>
                      <span className="profile-page-detail-value">{user?.teacher?.board || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="profile-page-detail-item">
                    <SchoolIcon className="profile-page-detail-icon" />
                    <div className="profile-page-detail-content">
                      <span className="profile-page-detail-label">گریڈ</span>
                      <span className="profile-page-detail-value">{user?.teacher?.grade || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-page-details-section">
                <h3>
                  <DescriptionIcon className="profile-page-section-icon" />
                  قومی شناختی کارڈ کی دستاویز
                </h3>
                <div className="profile-page-document-container">
                  {user?.teacher?.nicImage.map((image, index) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`قومی شناختی کارڈ ${index + 1}`} 
                      className="profile-page-document-image"
                      onClick={() => handleImageClick(image)}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                </div>
              </div>

              {user?.teacher?.marksheetImages && user?.teacher?.marksheetImages.length > 0 && (
                <div className="profile-page-details-section">
                  <h3>
                    <AssignmentIcon className="profile-page-section-icon" />
                    مارک شیٹ کی دستاویزات
                  </h3>
                  <div className="profile-page-marksheets-grid">
                    {user?.teacher?.marksheetImages.map((image, index) => (
                      <div key={index} className="profile-page-document-container">
                        <img 
                          src={image} 
                          alt={`مارک شیٹ ${index + 1}`} 
                          className="profile-page-document-image"
                          onClick={() => handleImageClick(image)}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showImageViewer && (
        <ImageViewer
          imageUrl={selectedImage}
          onClose={() => setShowImageViewer(false)}
        />
      )}
    </div>
  );
};

export default Profile; 