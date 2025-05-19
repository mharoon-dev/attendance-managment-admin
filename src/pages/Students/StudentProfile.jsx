import React, { useState, useEffect, useRef } from 'react';
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
import html2pdf from 'html2pdf.js';
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
  const pdfRef = useRef(null);

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
    const element = document.createElement('div');
    element.style.direction = 'rtl';
    element.style.fontFamily = 'Noto Nastaliq Urdu';
    element.style.padding = '10px';
    element.style.backgroundColor = 'white';

    // Create the PDF content with enhanced visual design
    element.innerHTML = `
      <div style="background: linear-gradient(135deg, #1a5f1a, #2e8b2e); padding: 20px; border-radius: 12px; margin-bottom: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="width: 120px; height: 120px; background: white; padding: 8px; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.15);">
            <img src="/assets/logo.png" style="width: 100%; height: 100%; object-fit: contain;" />
          </div>
          <div style="text-align: center; flex-grow: 1; margin: 0 20px;">
            <h1 style="color: white; font-size: 16px; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); font-weight: bold;">جامعہ فاطمة الزھراء رضی اللّٰہ عنھا للبنین والبنات
</h1>
            <p style="color: rgba(255,255,255,0.95); font-size: 14px; margin: 4px 0;">رجسٹریشن نمبر: 9879349493</p>
            <p style="color: rgba(255,255,255,0.95); font-size: 14px; margin: 4px 0;">پتہ: محلہ سالو خیل جالجنوبی، پپلاں میانوالی پنجاب
</p>
          </div>
          <div style="width: 120px; height: 120px; background: white; padding: 4px; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
            <img src="${student?.profileImage || '/assets/default-profile.png'}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />
          </div>
        </div>
      </div>

      <div style="background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); padding: 15px; margin-bottom: 15px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <th colspan="4" style="background: linear-gradient(135deg, #1a5f1a, #2e8b2e); color: white; padding: 12px; text-align: right; font-size: 16px; border-radius: 8px 8px 0 0;">ذاتی معلومات</th>
          </tr>
          <tr>
            <td style="padding: 10px; background-color: rgba(26,95,26,0.08); border: 1px solid #e0e0e0; width: 25%; font-weight: bold; color: #1a5f1a;">پورا نام</td>
            <td style="padding: 10px; border: 1px solid #e0e0e0; width: 25%;">${student?.fullName || 'N/A'}</td>
            <td style="padding: 10px; background-color: rgba(26,95,26,0.08); border: 1px solid #e0e0e0; width: 25%; font-weight: bold; color: #1a5f1a;">تاریخ پیدائش</td>
            <td style="padding: 10px; border: 1px solid #e0e0e0; width: 25%;">${student?.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background-color: rgba(26,95,26,0.08); border: 1px solid #e0e0e0; font-weight: bold; color: #1a5f1a;">جنس</td>
            <td style="padding: 10px; border: 1px solid #e0e0e0;">${student?.gender || 'N/A'}</td>
            <td style="padding: 10px; background-color: rgba(26,95,26,0.08); border: 1px solid #e0e0e0; font-weight: bold; color: #1a5f1a;">فون نمبر</td>
            <td style="padding: 10px; border: 1px solid #e0e0e0;">${student?.phoneNumber || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background-color: rgba(26,95,26,0.08); border: 1px solid #e0e0e0; font-weight: bold; color: #1a5f1a;">پتہ</td>
            <td colspan="3" style="padding: 10px; border: 1px solid #e0e0e0;">${student?.fullAddress || 'N/A'}</td>
          </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 15px;">
          <tr>
            <th colspan="4" style="background: linear-gradient(135deg, #1a5f1a, #2e8b2e); color: white; padding: 12px; text-align: right; font-size: 16px; border-radius: 8px 8px 0 0;">والدین کی معلومات</th>
          </tr>
          <tr>
            <td style="padding: 10px; background-color: rgba(26,95,26,0.08); border: 1px solid #e0e0e0; width: 25%; font-weight: bold; color: #1a5f1a;">والدین کا نام</td>
            <td style="padding: 10px; border: 1px solid #e0e0e0; width: 25%;">${student?.parentDetails?.fullName || 'N/A'}</td>
           
         
        
         
            <td style="padding: 10px; background-color: rgba(26,95,26,0.08); border: 1px solid #e0e0e0; font-weight: bold; color: #1a5f1a;">فون نمبر</td>
            <td style="padding: 10px; border: 1px solid #e0e0e0;">${student?.parentDetails?.phoneNumber || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background-color: rgba(26,95,26,0.08); border: 1px solid #e0e0e0; font-weight: bold; color: #1a5f1a;">تعلیم</td>
            <td style="padding: 10px; border: 1px solid #e0e0e0;">${student?.parentDetails?.education || 'N/A'}</td>
            <td style="padding: 10px; background-color: rgba(26,95,26,0.08); border: 1px solid #e0e0e0; font-weight: bold; color: #1a5f1a;">پیشہ</td>
            <td style="padding: 10px; border: 1px solid #e0e0e0;">${student?.parentDetails?.profession || 'N/A'}</td>
          </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 15px;">
          <tr>
            <th colspan="4" style="background: linear-gradient(135deg, #1a5f1a, #2e8b2e); color: white; padding: 12px; text-align: right; font-size: 16px; border-radius: 8px 8px 0 0;">تعلیمی معلومات</th>
          </tr>
          <tr>
            <td style="padding: 10px; background-color: rgba(26,95,26,0.08); border: 1px solid #e0e0e0; width: 25%; font-weight: bold; color: #1a5f1a;">رول نمبر</td>
            <td style="padding: 10px; border: 1px solid #e0e0e0; width: 25%;">${student?.schoolDetails?.rollNumber || 'N/A'}</td>
            <td style="padding: 10px; background-color: rgba(26,95,26,0.08); border: 1px solid #e0e0e0; width: 25%; font-weight: bold; color: #1a5f1a;">گریڈ</td>
            <td style="padding: 10px; border: 1px solid #e0e0e0; width: 25%;">${student?.grade || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background-color: rgba(26,95,26,0.08); border: 1px solid #e0e0e0; font-weight: bold; color: #1a5f1a;">تاریخ داخلہ</td>
            <td style="padding: 10px; border: 1px solid #e0e0e0;">${student?.schoolDetails?.joiningDate ? new Date(student.schoolDetails.joiningDate).toLocaleDateString() : 'N/A'}</td>
            <td style="padding: 10px; background-color: rgba(26,95,26,0.08); border: 1px solid #e0e0e0; font-weight: bold; color: #1a5f1a;">سابقہ ادارہ</td>
            <td style="padding: 10px; border: 1px solid #e0e0e0;">${student?.schoolDetails?.previousInstitute || 'N/A'}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin-top: 10px; padding: 6px; background: linear-gradient(135deg, #1a5f1a, #2e8b2e); border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <p style="color: white; font-size: 11px; margin: 2px 0; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">تاریخ: ${new Date().toLocaleDateString()}</p>
      </div>
    `;

    // Configure html2pdf options
    const opt = {
      margin: 0.3,
      filename: 'student_profile.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: true
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'portrait'
      }
    };

    // Generate PDF
    try {
      await html2pdf().set(opt).from(element).save();
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
                        <div className="multiple-images-container">
                          {student.nicImage && student.nicImage.length > 0 ? (
                            student.nicImage.map((image, index) => (
                              <div key={index} className="image-container">
                                <img
                                  src={image}
                                  alt={`طالب علم کا شناختی کارڈ ${index + 1}`}
                                  onClick={() => handleImageClick(image)}
                                  style={{ cursor: 'pointer' }}
                                />
                              </div>
                            ))
                          ) : (
                            <div className="image-container">
                              <img
                                src="/default-nic.png"
                                alt="طالب علم کا شناختی کارڈ"
                                onClick={() => handleImageClick('/default-nic.png')}
                                style={{ cursor: 'pointer' }}
                              />
                            </div>
                          )}
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
                      <div className="parent-nic-section">
                        <div className="image-label">شناختی کارڈ کی دستاویز</div>
                        <div className="multiple-images-container">
                          {student.parentDetails.nicImage && student.parentDetails.nicImage.length > 0 ? (
                            student.parentDetails.nicImage.map((image, index) => (
                              <div key={index} className="image-container">
                                <img
                                  src={image}
                                  alt={`والدین کا شناختی کارڈ ${index + 1}`}
                                  onClick={() => handleImageClick(image)}
                                  style={{ cursor: 'pointer' }}
                                />
                              </div>
                            ))
                          ) : (
                            <div className="image-container">
                              <img
                                src="/default-nic.png"
                                alt="والدین کا شناختی کارڈ"
                                onClick={() => handleImageClick('/default-nic.png')}
                                style={{ cursor: 'pointer' }}
                              />
                            </div>
                          )}
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
                        <PhoneIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">والد کا فون نمبر</span>
                          <span className="info-value">{student.parentDetails.phoneNumber}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <PhoneIcon className="info-icon" />
                        <div className="info-details">
                          <span className="info-label">والدہ کا فون نمبر</span>
                          <span className="info-value">{student.parentDetails.motherPhoneNumber}</span>
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
                              style={{ cursor: 'pointer', }}
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