import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { BsBuilding, BsPeople, BsCalendar, BsPersonBadge, BsBook } from 'react-icons/bs';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';
import useSidebar from '../../hooks/useSidebar';
import './AddClass.css';

const AddClass = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    grade: '',
    section: '',
    teacher: '',
    room: '',
    schedule: '',
    description: '',
    subjects: [''],
    capacity: 30,
    status: 'active'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDropdownChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubjectChange = (index, value) => {
    const updatedSubjects = [...formData.subjects];
    updatedSubjects[index] = value;
    setFormData(prev => ({
      ...prev,
      subjects: updatedSubjects
    }));
  };

  const addSubject = () => {
    setFormData(prev => ({
      ...prev,
      subjects: [...prev.subjects, '']
    }));
  };

  const removeSubject = (index) => {
    if (formData.subjects.length > 1) {
      const updatedSubjects = formData.subjects.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        subjects: updatedSubjects
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Class data to be submitted:', formData);
      setLoading(false);
      navigate('/classes');
    }, 1500);
  };

  // Sample data for dropdown options
  const grades = [
    { value: '10', label: 'Grade 10', icon: <BsBuilding /> },
    { value: '11', label: 'Grade 11', icon: <BsBuilding /> },
    { value: '12', label: 'Grade 12', icon: <BsBuilding /> }
  ];

  const sections = [
    { value: 'A', label: 'Section A', icon: <BsPeople /> },
    { value: 'B', label: 'Section B', icon: <BsPeople /> },
    { value: 'C', label: 'Section C', icon: <BsPeople /> }
  ];

  const teachers = [
    { value: '1', label: 'Dr. Sarah Wilson', icon: <BsPersonBadge /> },
    { value: '2', label: 'Prof. Michael Brown', icon: <BsPersonBadge /> },
    { value: '3', label: 'Dr. Emily Johnson', icon: <BsPersonBadge /> },
    { value: '4', label: 'Dr. Robert Davis', icon: <BsPersonBadge /> },
    { value: '5', label: 'Prof. Lisa Anderson', icon: <BsPersonBadge /> },
    { value: '6', label: 'Dr. James Wilson', icon: <BsPersonBadge /> }
  ];

  const statuses = [
    { value: 'active', label: 'Active', icon: <BsPeople /> },
    { value: 'inactive', label: 'Inactive', icon: <BsPeople /> }
  ];

  return (
    <div className={`layout-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`add-class-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <div className="add-class-header">
          <h1>Add New Class</h1>
          <button className="cancel-btn" onClick={() => navigate('/classes')}>
            <FiX /> Cancel
          </button>
        </div>

        <div className="add-class-content">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Basic Information</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="grade">Grade</label>
                  <CustomDropdown
                    options={grades}
                    value={formData.grade}
                    onChange={(value) => handleDropdownChange('grade', value)}
                    placeholder="Select grade"
                    icon={<BsBuilding />}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="section">Section</label>
                  <CustomDropdown
                    options={sections}
                    value={formData.section}
                    onChange={(value) => handleDropdownChange('section', value)}
                    placeholder="Select section"
                    icon={<BsPeople />}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="teacher">Class Teacher</label>
                  <CustomDropdown
                    options={teachers}
                    value={formData.teacher}
                    onChange={(value) => handleDropdownChange('teacher', value)}
                    placeholder="Select teacher"
                    icon={<BsPersonBadge />}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="room">Room</label>
                  <div className="input-with-icon">
                    <BsBuilding className="input-icon" />
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
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="schedule">Schedule</label>
                  <div className="input-with-icon">
                    <BsCalendar className="input-icon" />
                    <input
                      type="text"
                      id="schedule"
                      name="schedule"
                      value={formData.schedule}
                      onChange={handleInputChange}
                      placeholder="Enter class schedule"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="capacity">Capacity</label>
                  <div className="input-with-icon">
                    <BsPeople className="input-icon" />
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      placeholder="Enter class capacity"
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <CustomDropdown
                  options={statuses}
                  value={formData.status}
                  onChange={(value) => handleDropdownChange('status', value)}
                  placeholder="Select status"
                  icon={<BsPeople />}
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Subjects</h2>
              <div className="subjects-container">
                {formData.subjects.map((subject, index) => (
                  <div key={index} className="subject-input-group">
                    <div className="input-with-icon">
                      <BsBook className="input-icon" />
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => handleSubjectChange(index, e.target.value)}
                        placeholder="Enter subject name"
                      />
                    </div>
                    <button 
                      type="button" 
                      className="remove-subject-btn"
                      onClick={() => removeSubject(index)}
                      disabled={formData.subjects.length === 1}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  className="add-subject-btn"
                  onClick={addSubject}
                >
                  <FiPlus /> Add Subject
                </button>
              </div>
            </div>

            <div className="form-section">
              <h2>Additional Information</h2>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter class description"
                  rows="4"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => navigate('/classes')}>
                <FiX /> Cancel
              </button>
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  <>
                    <FiSave /> Save Class
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

export default AddClass; 