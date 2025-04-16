import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { BsBuilding, BsPeople, BsPersonBadge, BsBookHalf } from 'react-icons/bs';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import useSidebar from '../../hooks/useSidebar';
import './ClassProfile.css';

const ClassProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [isLoading, setIsLoading] = useState(true);
  const [classData, setClassData] = useState({
    id: 1,
    name: 'Class 10-A',
    grade: '10',
    section: 'A',
    teacher: 'John Smith',
    teacherId: 1,
    room: 'Room 101',
    schedule: 'Mon-Fri, 8:00 AM - 3:00 PM',
    description: 'This is a standard class for 10th grade students focusing on core subjects.',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History'],
    capacity: 30,
    status: 'active',
    createdAt: '2023-01-15',
    updatedAt: '2023-06-20'
  });

  useEffect(() => {
    // Simulate API call to fetch class data
    const fetchClassData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await api.get(`/classes/${id}`);
        // setClassData(response.data);
        
        // Simulate loading delay
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching class data:', error);
        setIsLoading(false);
      }
    };

    fetchClassData();
  }, [id]);

  const handleEditClass = () => {
    // This function is just a placeholder
    console.log('Edit class clicked');
  };

  const handleDeleteClass = () => {
    // This function is just a placeholder
    console.log('Delete class clicked');
  };

  return (
    <div className={`layout-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`class-profile-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading class data...</p>
          </div>
        ) : (
          <>
            <div className="class-profile-header">
              <div className="back-button" onClick={() => navigate('/classes')}>
                <FiArrowLeft /> Back to Classes
              </div>
              <div className="class-profile-title">
                <h1>{classData.name}</h1>
                <div className="class-status" data-status={classData.status}>
                  {classData.status}
                </div>
              </div>
              <div className="class-profile-actions">
                <button className="action-btn edit" onClick={handleEditClass}>
                  <FiEdit2 /> Edit Class
                </button>
                <button className="action-btn delete" onClick={handleDeleteClass}>
                  <FiTrash2 /> Delete Class
                </button>
              </div>
            </div>

            <div className="class-profile-content">
              <div className="overview-section">
                <div className="class-info-card">
                  <h2>Class Information</h2>
                  <div className="info-grid">
                    <div className="info-item">
                      <BsBuilding className="info-icon" />
                      <div className="info-details">
                        <span className="info-label">Grade</span>
                        <span className="info-value">{classData.grade}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <BsPeople className="info-icon" />
                      <div className="info-details">
                        <span className="info-label">Section</span>
                        <span className="info-value">{classData.section}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <BsPersonBadge className="info-icon" />
                      <div className="info-details">
                        <span className="info-label">Teacher</span>
                        <span className="info-value">{classData.teacher}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <BsBuilding className="info-icon" />
                      <div className="info-details">
                        <span className="info-label">Room</span>
                        <span className="info-value">{classData.room}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <BsPeople className="info-icon" />
                      <div className="info-details">
                        <span className="info-label">Capacity</span>
                        <span className="info-value">{classData.capacity} students</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="class-description-card">
                  <h2>Description</h2>
                  <p>{classData.description}</p>
                </div>

                <div className="class-subjects-card">
                  <h2>Subjects</h2>
                  <div className="subjects-grid">
                    {classData.subjects.map((subject, index) => (
                      <div key={index} className="subject-card">
                        <BsBookHalf className="subject-icon" />
                        <span className="subject-name">{subject}</span>
                      </div>
                    ))}
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

export default ClassProfile; 