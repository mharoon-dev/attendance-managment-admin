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
      console.log('Student School Details:', {
        fullSchoolDetails: student.schoolDetails,
        joiningDate: student.schoolDetails?.joiningDate,
        previousInstitute: student.schoolDetails?.previousInstitute
      });
    }
  }, [student]);

  const generatePDF = () => {
    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Define constants
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let yPos = 15;

    // Define colors - Green theme
    const primaryColor = [44, 139, 59]; // RGB for #2c8b3b
    const secondaryColor = [102, 102, 102];
    
    // Add logo on the left
    try {
      doc.addImage('/assets/logo.png', 'PNG', margin, 8, 25, 25, undefined, 'FAST');
    } catch (error) {
      console.error('Error adding logo:', error);
      // Fallback: Create colored rectangle if image fails to load
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(margin, 8, 25, 25, 'F');
    }

    // Add profile image on the right
    if (student.profileImage) {
      try {
        // Position the profile image on the right side
        const profileImageSize = 25; // Same size as logo
        const profileImageX = pageWidth - margin - profileImageSize; // Right aligned
        
        doc.addImage(
          student.profileImage,
          'PNG',
          profileImageX, // X position from right
          8, // Same Y position as logo
          profileImageSize, // Width
          profileImageSize, // Height
          undefined,
          'FAST'
        );
      } catch (error) {
        console.error('Error adding profile image:', error);
      }
    }

    // Add school name and address (centered between logo and profile image)
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Jamia Fatima tul zahra', margin + 35, 15);
    
    // Add registration number and address
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text([
      'Reg No: 9879349493',
      'Address: piplaan miyanwale'
    ], margin + 35, 23);

    // Add horizontal line
    yPos = 40;
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    // Helper function to create table
    const createTable = (headers, data, startY) => {
      const cellPadding = 2;
      const lineHeight = 7;
      const colWidth = (pageWidth - 2 * margin) / headers.length;
      
      // Draw headers with green color
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(margin, startY, pageWidth - 2 * margin, lineHeight, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      
      headers.forEach((header, i) => {
        doc.text(header, margin + (i * colWidth) + cellPadding, startY + lineHeight - 2);
      });

      // Draw data
      let currentY = startY + lineHeight;
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      
      data.forEach((row, rowIndex) => {
        if (rowIndex % 2 === 1) {
          // Light green for alternate rows
          doc.setFillColor(240, 247, 241);
          doc.rect(margin, currentY, pageWidth - 2 * margin, lineHeight, 'F');
        }
        
        row.forEach((cell, i) => {
          const cellText = cell ? cell.toString() : 'N/A';
          doc.text(cellText, margin + (i * colWidth) + cellPadding, currentY + lineHeight - 2);
        });
        currentY += lineHeight;
      });

      return currentY + 3;
    };

    // Add title
    yPos += 8;
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('STUDENT PROFILE', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    // Personal Information Table
    doc.setFontSize(12);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Personal Information', margin, yPos);
    yPos += 7;
    
    const personalHeaders = ['Field', 'Details'];
    const personalData = [
      ['Full Name', student.fullName || 'N/A'],
      ['Date of Birth', student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'],
      ['Gender', student.gender || 'N/A'],
      ['Phone Number', student.phoneNumber || 'N/A'],
      ['Address', student.fullAddress || 'N/A']
    ];
    yPos = createTable(personalHeaders, personalData, yPos);

    // Parent Information Table
    yPos += 7;
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(12);
    doc.text('Parent Information', margin, yPos);
    yPos += 7;

    const parentHeaders = ['Field', 'Details'];
    const parentData = [
      ['Parent Name', student.parentDetails?.fullName || 'N/A'],
      ['Date of Birth', student.parentDetails?.dateOfBirth ? new Date(student.parentDetails.dateOfBirth).toLocaleDateString() : 'N/A'],
      ['Gender', student.parentDetails?.gender || 'N/A'],
      ['Phone Number', student.parentDetails?.phoneNumber || 'N/A'],
      ['Education', student.parentDetails?.education || 'N/A'],
      ['Profession', student.parentDetails?.profession || 'N/A']
    ];
    yPos = createTable(parentHeaders, parentData, yPos);

    // Academic Information Table
    yPos += 7;
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(12);
    doc.text('Academic Information', margin, yPos);
    yPos += 7;

    const academicHeaders = ['Field', 'Details'];
    const academicData = [
      ['Roll Number', student.schoolDetails?.rollNumber || 'N/A'],
      ['Grade', student.grade || 'N/A'],
      ['Joining Date', student.schoolDetails?.joiningDate ? 
          new Date(student.schoolDetails.joiningDate).toLocaleDateString() : 'N/A'],
      ['Previous Institute', student.schoolDetails?.previousInstitute || 'N/A']
    ];
    yPos = createTable(academicHeaders, academicData, yPos);

    // Add footer
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );

    // Save the PDF
    doc.save(`${student.fullName}_profile.pdf`);
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
                <ArrowBackIcon /> Back to Students
              </div>
              <div className="student-profile-title">
                <div className="student-status">
                  <BadgeIcon className="status-icon" />
                  <span>Grade {student.grade}</span>
                </div>
              </div>
              <button className="download-pdf-btn" onClick={generatePDF}>
                <DownloadIcon /> Download PDF
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
                    <h2>Student Information</h2>
                  </div>
                  <div className="card-content">
                    <div className="student-avatar">
                      <img src={student.profileImage} alt={student.fullName} />
                    </div>
                    <br />
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
                <div className="profile-card ">
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
                    <br />
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
                <div className="profile-card ">
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
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentProfile; 