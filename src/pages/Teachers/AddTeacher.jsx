import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadIcon from '@mui/icons-material/Upload';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import BadgeIcon from '@mui/icons-material/Badge';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BookIcon from '@mui/icons-material/Book';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';
import useSidebar from '../../hooks/useSidebar';
import './AddTeacher.css';

const AddTeacher = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    email: '',
    phone: '',
    education: '',
    joinDate: '',
    status: 'active',
    classes: [''],
    bio: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: ''
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

  const handleClassChange = (index, value) => {
    const updatedClasses = [...formData.classes];
    updatedClasses[index] = value;
    setFormData(prev => ({
      ...prev,
      classes: updatedClasses
    }));
  };

  const addClass = () => {
    setFormData(prev => ({
      ...prev,
      classes: [...prev.classes, '']
    }));
  };

  const removeClass = (index) => {
    if (formData.classes.length > 1) {
      const updatedClasses = formData.classes.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        classes: updatedClasses
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Teacher data to be submitted:', formData);
      setLoading(false);
      navigate('/teachers');
    }, 1500);
  };

  const departments = [
    { value: 'mathematics', label: 'Mathematics', icon: <BusinessIcon /> },
    { value: 'science', label: 'Science', icon: <BusinessIcon /> },
    { value: 'english', label: 'English', icon: <BusinessIcon /> },
    { value: 'history', label: 'History', icon: <BusinessIcon /> },
    { value: 'art', label: 'Art', icon: <BusinessIcon /> },
    { value: 'physical_education', label: 'Physical Education', icon: <BusinessIcon /> },
    { value: 'computer_science', label: 'Computer Science', icon: <BusinessIcon /> },
    { value: 'foreign_language', label: 'Foreign Language', icon: <BusinessIcon /> }
  ];

  const statuses = [
    { value: 'active', label: 'Active', icon: <BadgeIcon /> },
    { value: 'inactive', label: 'Inactive', icon: <BadgeIcon /> },
    { value: 'on_leave', label: 'On Leave', icon: <BadgeIcon /> }
  ];

  return (
    <div className={`layout-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`add-teacher-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <div className="add-teacher-header">
          <h1>Add New Teacher</h1>
          <button className="cancel-btn" onClick={() => navigate('/teachers')}>
            <CloseIcon /> Cancel
          </button>
        </div>

        <div className="add-teacher-content">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Basic Information</h2>
              <div className="avatar-upload">
                <div className="avatar-preview-container">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar preview" className="avatar-preview" />
                  ) : (
                    <div className="avatar-placeholder">
                      <PersonIcon />
                    </div>
                  )}
                </div>
                <div className="upload-controls">
                  <label htmlFor="avatar" className="upload-btn">
                    <UploadIcon /> Upload Photo
                  </label>
                  <input 
                    type="file" 
                    id="avatar" 
                    accept="image/*" 
                    onChange={handleAvatarChange}
                    className="hidden-input"
                  />
                  <p className="upload-hint">JPG, PNG or GIF (max. 2MB)</p>
                </div>
              </div>

              <div className="form-row">
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
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Department</label>
                  <CustomDropdown
                    options={departments}
                    value={formData.subject}
                    onChange={(value) => handleDropdownChange('subject', value)}
                    placeholder="Select department"
                    icon={<BusinessIcon />}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
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
                  <label htmlFor="phone">Phone Number</label>
                  <div className="input-with-icon">
                    <PhoneIcon className="input-icon" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="education">Education</label>
                  <div className="input-with-icon">
                    <BookIcon className="input-icon" />
                    <input
                      type="text"
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      placeholder="Enter education details"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="joinDate">Join Date</label>
                  <div className="input-with-icon">
                    <CalendarTodayIcon className="input-icon" />
                    <input
                      type="date"
                      id="joinDate"
                      name="joinDate"
                      value={formData.joinDate}
                      onChange={handleInputChange}
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
                  icon={<BadgeIcon />}
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Additional Information</h2>
              <div className="form-group">
                <label htmlFor="bio">Biography</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Enter teacher's biography"
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter address"
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="emergencyContact">Emergency Contact</label>
                  <div className="input-with-icon">
                    <PersonIcon className="input-icon" />
                    <input
                      type="text"
                      id="emergencyContact"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      placeholder="Emergency contact name"
                    />
                  </div>
                  <div className="input-with-icon mt-2">
                    <PhoneIcon className="input-icon" />
                    <input
                      type="tel"
                      id="emergencyPhone"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleInputChange}
                      placeholder="Emergency contact phone"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => navigate('/teachers')}>
                <CloseIcon /> Cancel
              </button>
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? (
                  <div className="loading-spinner-small"></div>
                ) : (
                  <>
                    <SaveIcon /> Save Teacher
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

export default AddTeacher; 