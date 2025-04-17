import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import BadgeIcon from '@mui/icons-material/Badge';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';
import useSidebar from '../../hooks/useSidebar';
import { FiArrowLeft, FiEdit2, FiTrash2, FiMail, FiPhone, FiMapPin, 
  FiCalendar, FiBook, FiAward, FiUser } from 'react-icons/fi';
  import { BsPersonBadge, BsPeople, BsBuilding, BsBookHalf, BsGraphUp } from 
  'react-icons/bs';
import './AddStudent.css';

const AddStudent = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    class: '',
    rollNumber: '',
    email: '',
    phone: '',
    address: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    status: 'active',
    subjects: []
  });

  // Sample data for dropdowns
  const grades = [
    { value: '9', label: 'Grade 9' },
    { value: '10', label: 'Grade 10' },
    { value: '11', label: 'Grade 11' },
    { value: '12', label: 'Grade 12' }
  ];

  const classes = [
    { value: 'A', label: 'Class A' },
    { value: 'B', label: 'Class B' },
    { value: 'C', label: 'Class C' },
    { value: 'D', label: 'Class D' }
  ];

  const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const availableSubjects = [
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
    { value: 'english', label: 'English' },
    { value: 'history', label: 'History' },
    { value: 'geography', label: 'Geography' },
    { value: 'computer_science', label: 'Computer Science' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddSubject = () => {
    if (formData.subjects.length < 8) {
      setFormData({
        ...formData,
        subjects: [...formData.subjects, { name: '', grade: '' }]
      });
    }
  };

  const handleRemoveSubject = (index) => {
    const updatedSubjects = [...formData.subjects];
    updatedSubjects.splice(index, 1);
    setFormData({
      ...formData,
      subjects: updatedSubjects
    });
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...formData.subjects];
    updatedSubjects[index][field] = value;
    setFormData({
      ...formData,
      subjects: updatedSubjects
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to create the student
      // await api.post('/students', formData);
      
      // Simulate API call delay
      setTimeout(() => {
        setIsLoading(false);
        navigate('/students');
      }, 1500);
    } catch (error) {
      console.error('Error adding student:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className={`layout-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`add-student-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <div className="add-student-header">
          <div className="back-button" onClick={() => navigate('/students')}>
            <ArrowBackIcon /> Back to Students
          </div>
          <h1>Add New Student</h1>
        </div>

        <div className="add-student-content">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="section-header">
                <PersonIcon className="section-icon" />
                <h3>Basic Information</h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <div className="input-with-icon">
                    <PersonIcon className="input-icon" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter student's full name"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <CustomDropdown
                    options={grades}
                    value={formData.grade}
                    onChange={handleInputChange}
                    placeholder="Select Grade"
                    icon={<BusinessIcon />}
                    name="grade"
                    label="Grade"
                    required
                  />
                </div>

                <div className="form-group">
                  <CustomDropdown
                    options={classes}
                    value={formData.class}
                    onChange={handleInputChange}
                    placeholder="Select Class"
                    icon={<GroupIcon />}
                    name="class"
                    label="Class"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rollNumber">Roll Number</label>
                  <div className="input-with-icon">
                    <BadgeIcon className="input-icon" />
                    <input
                      type="text"
                      id="rollNumber"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleInputChange}
                      placeholder="Enter roll number"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <div className="input-with-icon">
                    <EmailIcon className="input-icon" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <div className="input-with-icon">
                    <PhoneIcon className="input-icon" />
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="address">Address</label>
                  <div className="input-with-icon">
                    <LocationOnIcon className="input-icon" />
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter address"
                      rows="2"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <GroupIcon className="section-icon" />
                <h3>Parent Information</h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="parentName">Parent Name</label>
                  <div className="input-with-icon">
                    <PersonIcon className="input-icon" />
                    <input
                      type="text"
                      id="parentName"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleInputChange}
                      placeholder="Enter parent's name"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="parentEmail">Parent Email</label>
                  <div className="input-with-icon">
                    <EmailIcon className="input-icon" />
                    <input
                      type="email"
                      id="parentEmail"
                      name="parentEmail"
                      value={formData.parentEmail}
                      onChange={handleInputChange}
                      placeholder="Enter parent's email"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="parentPhone">Parent Phone</label>
                  <div className="input-with-icon">
                    <PhoneIcon className="input-icon" />
                    <input
                      type="text"
                      id="parentPhone"
                      name="parentPhone"
                      value={formData.parentPhone}
                      onChange={handleInputChange}
                      placeholder="Enter parent's phone"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <MenuBookIcon className="section-icon" />
                <h3>Subjects</h3>
              </div>
              <div className="subjects-container">
                {formData.subjects.map((subject, index) => (
                  <div key={index} className="subject-item">
                    <div className="subject-inputs">
                      <div className="form-group">
                        <CustomDropdown
                          options={availableSubjects}
                          value={subject.name}
                          onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                          placeholder="Select Subject"
                          icon={<MenuBookIcon />}
                          name={`subject-name-${index}`}
                          label="Subject"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`subject-grade-${index}`}>Grade</label>
                        <input
                          type="text"
                          id={`subject-grade-${index}`}
                          value={subject.grade}
                          onChange={(e) => handleSubjectChange(index, 'grade', e.target.value)}
                          placeholder="Grade"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="remove-subject-btn"
                      onClick={() => handleRemoveSubject(index)}
                    >
                      <RemoveIcon />
                    </button>
                  </div>
                ))}
                {formData.subjects.length < 8 && (
                  <button
                    type="button"
                    className="add-subject-btn"
                    onClick={handleAddSubject}
                  >
                    <AddIcon /> Add Subject
                  </button>
                )}
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <BusinessIcon className="section-icon" />
                <h3>Additional Information</h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <CustomDropdown
                    options={statuses}
                    value={formData.status}
                    onChange={handleInputChange}
                    placeholder="Select Status"
                    icon={<PersonIcon />}
                    name="status"
                    label="Status"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-buttons">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate('/students')}
              >
                <CloseIcon /> Cancel
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
                    <SaveIcon /> Save Student
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

export default AddStudent; 