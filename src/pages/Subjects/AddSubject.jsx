import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import useSidebar from '../../hooks/useSidebar';
import './AddSubject.css';

const AddSubject = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    grade: '',
    teacher: '',
    credits: '',
    room: '',
    schedule: '',
    description: '',
    status: 'active'
  });

  // Sample data for dropdowns
  const grades = [
    { value: '9', label: 'Grade 9' },
    { value: '10', label: 'Grade 10' },
    { value: '11', label: 'Grade 11' },
    { value: '12', label: 'Grade 12' }
  ];

  const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to create the subject
      // await api.post('/subjects', formData);
      
      // Simulate API call delay
      setTimeout(() => {
        setIsLoading(false);
        navigate('/subjects');
      }, 1000);
    } catch (error) {
      console.error('Error creating subject:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className={`layout-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`add-subject-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <div className="add-subject-header">
          <button className="back-button" onClick={() => navigate('/subjects')}>
            <ArrowBackIcon /> Back to Subjects
          </button>
          <h1>Add New Subject</h1>
        </div>

        <div className="add-subject-content">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Basic Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    <MenuBookIcon className="form-icon" /> Subject Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter subject name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="code">
                    <LibraryBooksIcon className="form-icon" /> Subject Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="Enter subject code"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="grade">
                    <BusinessIcon className="form-icon" /> Grade
                  </label>
                  <select
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select grade</option>
                    {grades.map(grade => (
                      <option key={grade.value} value={grade.value}>
                        {grade.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="teacher">
                    <PersonIcon className="form-icon" /> Teacher
                  </label>
                  <input
                    type="text"
                    id="teacher"
                    name="teacher"
                    value={formData.teacher}
                    onChange={handleInputChange}
                    placeholder="Enter teacher name"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Additional Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="credits">
                    <LibraryBooksIcon className="form-icon" /> Credits
                  </label>
                  <input
                    type="number"
                    id="credits"
                    name="credits"
                    value={formData.credits}
                    onChange={handleInputChange}
                    placeholder="Enter credits"
                    min="1"
                    max="10"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="room">
                    <LocationOnIcon className="form-icon" /> Room
                  </label>
                  <input
                    type="text"
                    id="room"
                    name="room"
                    value={formData.room}
                    onChange={handleInputChange}
                    placeholder="Enter room number"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="schedule">
                  <CalendarMonthIcon className="form-icon" /> Schedule
                </label>
                <input
                  type="text"
                  id="schedule"
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleInputChange}
                  placeholder="Enter schedule (e.g., Mon, Wed, Fri - 9:00 AM)"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  <DescriptionIcon className="form-icon" /> Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter subject description"
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">
                  <BusinessIcon className="form-icon" /> Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => navigate('/subjects')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="save-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loading-spinner" />
                ) : (
                  <>
                    <SaveIcon /> Save Subject
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSubject; 