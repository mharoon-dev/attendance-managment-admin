import React from 'react';
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

const Profile = () => {
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const { user } = useSelector((state) => state.user);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
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
          <h1>My Profile</h1>
          <div className="profile-page-header-actions">
            <button className="profile-page-edit-btn">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="profile-page-content">
          <div className="profile-page-card">
            <div className="profile-page-image-section">
              <div className="profile-page-image-container">
                <img 
                  src={user?.teacher?.profileImage || 'https://via.placeholder.com/150'} 
                  alt="Profile" 
                  className="profile-page-image"
                />
                <div className="profile-page-image-overlay">
                  <button className="profile-page-image-edit-btn">
                    Change Photo
                  </button>
                </div>
              </div>
              <div className="profile-page-basic-info">
                <h2>{user?.teacher?.fullName || 'N/A'}</h2>
                <p className="profile-page-role-badge">
                  <WorkIcon className="profile-page-icon" />
                  {user?.role}
                </p>
                <p className="profile-page-teacher-id">
                  <BadgeIcon className="profile-page-icon" />
                  ID: {user?.teacherId}
                </p>
              </div>
            </div>

            <div className="profile-page-details">
              <div className="profile-page-details-section">
                <h3>
                  <PersonIcon className="profile-page-section-icon" />
                  Personal Information
                </h3>
                <div className="profile-page-details-grid">
                  <div className="profile-page-detail-item">
                    <CalendarMonthIcon className="profile-page-detail-icon" />
                    <div className="profile-page-detail-content">
                      <span className="profile-page-detail-label">Date of Birth</span>
                      <span className="profile-page-detail-value">{formatDate(user?.teacher?.dateOfBirth)}</span>
                    </div>
                  </div>
                  <div className="profile-page-detail-item">
                    <TransgenderIcon className="profile-page-detail-icon" />
                    <div className="profile-page-detail-content">
                      <span className="profile-page-detail-label">Gender</span>
                      <span className="profile-page-detail-value">{user?.teacher?.gender || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="profile-page-detail-item">
                    <BadgeIcon className="profile-page-detail-icon" />
                    <div className="profile-page-detail-content">
                      <span className="profile-page-detail-label">NIC</span>
                      <span className="profile-page-detail-value">{user?.teacher?.nic || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="profile-page-detail-item">
                    <FamilyRestroomIcon className="profile-page-detail-icon" />
                    <div className="profile-page-detail-content">
                      <span className="profile-page-detail-label">Marital Status</span>
                      <span className="profile-page-detail-value">{user?.teacher?.maritalStatus || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-page-details-section">
                <h3>
                  <PhoneIcon className="profile-page-section-icon" />
                  Contact Information
                </h3>
                <div className="profile-page-details-grid">
                  <div className="profile-page-detail-item">
                    <PhoneIcon className="profile-page-detail-icon" />
                    <div className="profile-page-detail-content">
                      <span className="profile-page-detail-label">Phone Number</span>
                      <span className="profile-page-detail-value">{user?.teacher?.phoneNumber || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="profile-page-detail-item">
                    <PhoneIcon className="profile-page-detail-icon" />
                    <div className="profile-page-detail-content">
                      <span className="profile-page-detail-label">Next of Kin Phone</span>
                      <span className="profile-page-detail-value">{user?.teacher?.nextOfKinPhoneNumber || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="profile-page-detail-item">
                    <EmailIcon className="profile-page-detail-icon" />
                    <div className="profile-page-detail-content">
                      <span className="profile-page-detail-label">Email</span>
                      <span className="profile-page-detail-value">{user?.teacher?.emailAddress || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="profile-page-detail-item">
                    <LocationOnIcon className="profile-page-detail-icon" />
                    <div className="profile-page-detail-content">
                      <span className="profile-page-detail-label">Address</span>
                      <span className="profile-page-detail-value">{user?.teacher?.fullAddress || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {user?.teacher?.jobDetails && (
                <div className="profile-page-details-section">
                  <h3>
                    <WorkIcon className="profile-page-section-icon" />
                    Job Details
                  </h3>
                  <div className="profile-page-details-grid">
                    <div className="profile-page-detail-item">
                      <WorkIcon className="profile-page-detail-icon" />
                      <div className="profile-page-detail-content">
                        <span className="profile-page-detail-label">Designation</span>
                        <span className="profile-page-detail-value">{user?.teacher?.jobDetails?.designation || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="profile-page-detail-item">
                      <CalendarMonthIcon className="profile-page-detail-icon" />
                      <div className="profile-page-detail-content">
                        <span className="profile-page-detail-label">Joining Date</span>
                        <span className="profile-page-detail-value">{formatDate(user?.teacher?.jobDetails?.joiningDate)}</span>
                      </div>
                    </div>
                    <div className="profile-page-detail-item">
                      <WorkIcon className="profile-page-detail-icon" />
                      <div className="profile-page-detail-content">
                        <span className="profile-page-detail-label">Working Hours</span>
                        <span className="profile-page-detail-value">{user?.teacher?.jobDetails?.workingHours || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="profile-page-detail-item">
                      <WorkIcon className="profile-page-detail-icon" />
                      <div className="profile-page-detail-content">
                        <span className="profile-page-detail-label">Salary</span>
                        <span className="profile-page-detail-value">${user?.teacher?.jobDetails?.salary || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="profile-page-details-section">
                <h3>
                  <SchoolIcon className="profile-page-section-icon" />
                  Education Details
                </h3>
                <div className="profile-page-details-grid">
                  <div className="profile-page-detail-item">
                    <SchoolIcon className="profile-page-detail-icon" />
                    <div className="profile-page-detail-content">
                      <span className="profile-page-detail-label">Degree Title</span>
                      <span className="profile-page-detail-value">{user?.teacher?.degreeTitle || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="profile-page-detail-item">
                    <SchoolIcon className="profile-page-detail-icon" />
                    <div className="profile-page-detail-content">
                      <span className="profile-page-detail-label">Board</span>
                      <span className="profile-page-detail-value">{user?.teacher?.board || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="profile-page-detail-item">
                    <SchoolIcon className="profile-page-detail-icon" />
                    <div className="profile-page-detail-content">
                      <span className="profile-page-detail-label">Grade</span>
                      <span className="profile-page-detail-value">{user?.teacher?.grade || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* NIC Image Section */}
              <div className="profile-page-details-section">
                <h3>
                  <DescriptionIcon className="profile-page-section-icon" />
                  NIC Document
                </h3>
                <div className="profile-page-document-container">
                  <img 
                    src={user?.teacher?.nicImage || 'https://via.placeholder.com/300x200'} 
                    alt="NIC Document" 
                    className="profile-page-document-image"
                  />
                  <div className="profile-page-document-overlay">
                    <button className="profile-page-document-view-btn">
                      View Document
                    </button>
                  </div>
                </div>
              </div>

              {/* Marksheet Images Section */}
              {user?.teacher?.marksheetImages && user?.teacher?.marksheetImages.length > 0 && (
                <div className="profile-page-details-section">
                  <h3>
                    <AssignmentIcon className="profile-page-section-icon" />
                    Marksheet Documents
                  </h3>
                  <div className="profile-page-marksheets-grid">
                    {user?.teacher?.marksheetImages.map((image, index) => (
                      <div key={index} className="profile-page-document-container">
                        <img 
                          src={image} 
                          alt={`Marksheet ${index + 1}`} 
                          className="profile-page-document-image"
                        />
                        <div className="profile-page-document-overlay">
                          <button className="profile-page-document-view-btn">
                            View Document
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 