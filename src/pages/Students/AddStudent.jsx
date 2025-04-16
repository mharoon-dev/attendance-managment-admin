import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiMapPin, FiPlus, FiX, FiSave } from 'react-icons/fi';
import { BsPersonBadge, BsPeople, BsBuilding, BsBookHalf } from 'react-icons/bs';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';
import useSidebar from '../../hooks/useSidebar';
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
            <FiArrowLeft /> Back to Students
          </div>
          <h1>Add New Student</h1>
        </div>

        <div className="add-student-content">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Basic Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <div className="input-with-icon">
                    <FiUser className="input-icon" />
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
                    icon={<BsBuilding />}
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
                    icon={<BsPeople />}
                    name="class"
                    label="Class"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rollNumber">Roll Number</label>
                  <div className="input-with-icon">
                    <BsPersonBadge className="input-icon" />
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
                    <FiMail className="input-icon" />
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
                    <FiPhone className="input-icon" />
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
                    <FiMapPin className="input-icon" />
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
              <h2>Parent Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="parentName">Parent Name</label>
                  <div className="input-with-icon">
                    <FiUser className="input-icon" />
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
                    <FiMail className="input-icon" />
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
                    <FiPhone className="input-icon" />
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
              <h2>Subjects</h2>
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
                          icon={<BsBookHalf />}
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
                      <FiX />
                    </button>
                  </div>
                ))}
                {formData.subjects.length < 8 && (
                  <button
                    type="button"
                    className="add-subject-btn"
                    onClick={handleAddSubject}
                  >
                    <FiPlus /> Add Subject
                  </button>
                )}
              </div>
            </div>

            <div className="form-section">
              <h2>Additional Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <CustomDropdown
                    options={statuses}
                    value={formData.status}
                    onChange={handleInputChange}
                    placeholder="Select Status"
                    icon={<FiUser />}
                    name="status"
                    label="Status"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate('/students')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="save-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  <>
                    <FiSave /> Save Student
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