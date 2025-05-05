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
import DownloadIcon from '@mui/icons-material/Download';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import useSidebar from '../../hooks/useSidebar';
import './StudentProfile.css';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader/Loader';
import { jsPDF } from 'jspdf';
import ImageViewer from '../../components/ImageViewer/ImageViewer';

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { students } = useSelector((state) => state.students);
  const student = students.find((student) => student._id === id);
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [isLoading, setIsLoading] = useState(true);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    if (student) {
      setIsLoading(false);
      console.log('Student School Details:', {
        fullSchoolDetails: student.schoolDetails,
        joiningDate: student.schoolDetails?.joiningDate,
        previousInstitute: student.schoolDetails?.previousInstitute
      });
    }
  }, [student]);

  const generatePDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    try {
      // --- HEADER ---
      // Logo
      const logoUrl = '/assets/logo.png';
      const logoResponse = await fetch(logoUrl);
      const logoBlob = await logoResponse.blob();
      const logoDataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(logoBlob);
      });
      doc.addImage(logoDataUrl, 'PNG', 20, y, 30, 30);

      // Add student profile image on the right
      if (student?.profileImage) {
        try {
          const profileResponse = await fetch(student.profileImage);
          const profileBlob = await profileResponse.blob();
          const profileDataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(profileBlob);
          });
          doc.addImage(profileDataUrl, 'JPEG', pageWidth - 50, y, 30, 30);
        } catch (error) {
          console.error('Error loading profile image:', error);
        }
      }

      // School Name and Info
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(34, 139, 34); // green
      doc.text('Jamia Fatima tul zahra', 60, y + 10);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text('Reg No: 9879349493', 60, y + 18);
      doc.text('Address: piplaan miyanwale', 60, y + 25);

      // Green horizontal line
      y += 38;
      doc.setDrawColor(34, 139, 34);
      doc.setLineWidth(1.2);
      doc.line(20, y, pageWidth - 20, y);

      // --- TITLE ---
      y += 15;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(34, 139, 34);
      doc.text('STUDENT PROFILE', pageWidth / 2, y, { align: 'center' });

      // --- SECTION: Personal Information ---
      y += 15;
      doc.setFontSize(13);
      doc.setTextColor(34, 139, 34);
      doc.text('Personal Information', 20, y);
      y += 5;
      // Table header
      doc.setFillColor(34, 139, 34);
      doc.setTextColor(255, 255, 255);
      doc.rect(20, y, pageWidth - 40, 9, 'F');
      doc.setFontSize(12);
      doc.text('Field', 25, y + 6);
      doc.text('Details', 80, y + 6);
      y += 9;
      // Table rows
      const personalInfo = [
        ['Full Name', String(student?.fullName || 'N/A')],
        ['Date of Birth', student?.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'],
        ['Gender', String(student?.gender || 'N/A')],
        ['Phone Number', String(student?.phoneNumber || 'N/A')],
        ['Address', String(student?.fullAddress || 'N/A')]
      ];
      personalInfo.forEach(([field, value], idx) => {
        doc.setFillColor(idx % 2 === 0 ? 255 : 240, 255, 240); // alternate row color
        doc.rect(20, y, pageWidth - 40, 9, 'F');
        doc.setTextColor(0, 0, 0);
        doc.text(field, 25, y + 6);
        doc.text(String(value), 80, y + 6);
        y += 9;
      });

      // --- SECTION: Parent Information ---
      y += 7;
      doc.setFontSize(13);
      doc.setTextColor(34, 139, 34);
      doc.text('Parent Information', 20, y);
      y += 5;
      // Table header
      doc.setFillColor(34, 139, 34);
      doc.setTextColor(255, 255, 255);
      doc.rect(20, y, pageWidth - 40, 9, 'F');
      doc.setFontSize(12);
      doc.text('Field', 25, y + 6);
      doc.text('Details', 80, y + 6);
      y += 9;
      // Table rows
      const parentInfo = [
        ['Parent Name', String(student?.parentDetails?.fullName || 'N/A')],
        ['Date of Birth', student?.parentDetails?.dateOfBirth ? new Date(student.parentDetails.dateOfBirth).toLocaleDateString() : 'N/A'],
        ['Gender', String(student?.parentDetails?.gender || 'N/A')],
        ['Phone Number', String(student?.parentDetails?.phoneNumber || 'N/A')],
        ['Education', String(student?.parentDetails?.education || 'N/A')],
        ['Profession', String(student?.parentDetails?.profession || 'N/A')]
      ];
      parentInfo.forEach(([field, value], idx) => {
        doc.setFillColor(idx % 2 === 0 ? 255 : 240, 255, 240); // alternate row color
        doc.rect(20, y, pageWidth - 40, 9, 'F');
        doc.setTextColor(0, 0, 0);
        doc.text(field, 25, y + 6);
        doc.text(String(value), 80, y + 6);
        y += 9;
      });

      // --- SECTION: Academic Information ---
      y += 7;
      doc.setFontSize(13);
      doc.setTextColor(34, 139, 34);
      doc.text('Academic Information', 20, y);
      y += 5;
      // Table header
      doc.setFillColor(34, 139, 34);
      doc.setTextColor(255, 255, 255);
      doc.rect(20, y, pageWidth - 40, 9, 'F');
      doc.setFontSize(12);
      doc.text('Field', 25, y + 6);
      doc.text('Details', 80, y + 6);
      y += 9;
      // Table rows
      const schoolInfo = [
        ['Roll Number', String(student?.schoolDetails?.rollNumber || 'N/A')],
        ['Grade', String(student?.grade || 'N/A')],
        ['Joining Date', student?.schoolDetails?.joiningDate ? new Date(student.schoolDetails.joiningDate).toLocaleDateString() : 'N/A'],
        ['Previous Institute', String(student?.schoolDetails?.previousInstitute || 'N/A')]
      ];
      schoolInfo.forEach(([field, value], idx) => {
        doc.setFillColor(idx % 2 === 0 ? 255 : 240, 255, 240); // alternate row color
        doc.rect(20, y, pageWidth - 40, 9, 'F');
        doc.setTextColor(0, 0, 0);
        doc.text(field, 25, y + 6);
        doc.text(String(value), 80, y + 6);
        y += 9;
      });

      // Save the PDF
      doc.save('student_profile.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageViewer(true);
  };

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
                <ArrowBackIcon /> طلباء کی فہرست پر واپس جائیں
              </div>
              <div className="student-profile-title">
                <div className="student-status">
                  <BadgeIcon className="status-icon" />
                  <span>گریڈ {student.grade}</span>
                </div>
              </div>
              <button className="download-pdf-btn" onClick={generatePDF}>
                <DownloadIcon /> پی ڈی ایف ڈاؤن لوڈ کریں
              </button>
            </div>

            <div className="student-profile-content">
              <div className="profile-grid">
                {/* Student Information Card */}
                <div className="profile-card ">
                  <div className="card-header">
                    <div className="card-header-icon">
                      <PersonIcon />
                    </div>
                    <h2>طالب علم کی معلومات</h2>
                  </div>
                  <div className="card-content">
                    <div className="student-images-container">
                      <div className="student-profile-section">
                        <div className="image-label">پروفائل تصویر</div>
                        <div className="image-container">
                          <img 
                            src={student.profileImage} 
                            alt={student.fullName}
                            onClick={() => handleImageClick(student.profileImage)}
                            style={{ cursor: 'pointer' }}
                          />
                        </div>
                      </div>
                      <div className="student-nic-section">
                        <div className="image-label">شناختی کارڈ کی دستاویز</div>
                        <div className="image-container">
                          <img 
                            src={student.nicImage || 'https://via.placeholder.com/150'} 
                            alt="طالب علم کا شناختی کارڈ"
                            onClick={() => handleImageClick(student.nicImage)}
                            style={{ cursor: 'pointer' }}
                          />
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="info-grid">
                      <div className="info-item">
                        <PersonIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">پورا نام</span>
                          <span className="info-value">{student.fullName}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <CalendarMonthIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">تاریخ پیدائش</span>
                          <span className="info-value">{new Date(student.dateOfBirth).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <PersonIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">جنس</span>
                          <span className="info-value">{student.gender}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <PhoneIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">فون نمبر</span>
                          <span className="info-value">{student.phoneNumber}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <LocationOnIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">پتہ</span>
                          <span className="info-value">{student.fullAddress}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parent Information Card */}
                <div className="profile-card ">
                  <div className="card-header">
                    <div className="card-header-icon">
                      <GroupIcon />
                    </div>
                    <h2>والدین کی معلومات</h2>
                  </div>
                  <div className="card-content">
                    <div className="parent-images-container">
                      <div className="parent-profile-section">
                        <div className="image-label">پروفائل تصویر</div>
                        <div className="image-container">
                          <img 
                            src={student.parentDetails.profileImage || 'https://via.placeholder.com/150'} 
                            alt={student.parentDetails.fullName}
                            onClick={() => handleImageClick(student.parentDetails.profileImage)}
                            style={{ cursor: 'pointer' }}
                          />
                        </div>
                      </div>
                      <div className="parent-nic-section">
                        <div className="image-label">شناختی کارڈ کی دستاویز</div>
                        <div className="image-container">
                          <img 
                            src={student.parentDetails.nicImage || 'https://via.placeholder.com/150'} 
                            alt="والدین کا شناختی کارڈ"
                            onClick={() => handleImageClick(student.parentDetails.nicImage)}
                            style={{ cursor: 'pointer' }}
                          />
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="info-grid">
                      <div className="info-item">
                        <PersonIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">پورا نام</span>
                          <span className="info-value">{student.parentDetails.fullName}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <CalendarMonthIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">تاریخ پیدائش</span>
                          <span className="info-value">{new Date(student.parentDetails.dateOfBirth).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <PersonIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">جنس</span>
                          <span className="info-value">{student.parentDetails.gender}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <PhoneIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">فون نمبر</span>
                          <span className="info-value">{student.parentDetails.phoneNumber}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <MenuBookIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">تعلیم</span>
                          <span className="info-value">{student.parentDetails.education}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <WorkIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">پیشہ</span>
                          <span className="info-value">{student.parentDetails.profession}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* School Information Card */}
                <div className="profile-card ">
                  <div className="card-header">
                    <div className="card-header-icon">
                      <SchoolIcon />
                    </div>
                    <h2>اسکول کی معلومات</h2>
                  </div>
                  <div className="card-content">
                    <div className="info-grid">
                      <div className="info-item">
                        <BadgeIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">رول نمبر</span>
                          <span className="info-value">{student.schoolDetails.rollNumber}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <CalendarMonthIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">تاریخ داخلہ</span>
                          <span className="info-value">{new Date(student.schoolDetails.joiningDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <MenuBookIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">سابقہ ادارہ</span>
                          <span className="info-value">{student.schoolDetails.previousInstitute}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <BadgeIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">گریڈ</span>
                          <span className="info-value">{student.grade}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <MenuBookIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">سابقہ ڈگری</span>
                          <div className="image-container">
                            <img 
                              src={student.schoolDetails.previousDegreeWithImage || 'https://via.placeholder.com/150'} 
                              alt="سابقہ ڈگری"
                              onClick={() => handleImageClick(student.schoolDetails.previousDegreeWithImage)}
                              style={{ cursor: 'pointer',}}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

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

export default StudentProfile; 