import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadIcon from '@mui/icons-material/Upload';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import BadgeIcon from '@mui/icons-material/Badge';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BookIcon from '@mui/icons-material/Book';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';
import useSidebar from '../../hooks/useSidebar';
import './AddTeacher.css';
import { api } from '../../utils/url';
import { FiX } from 'react-icons/fi';
import { addTeacherFailure, addTeacherStart, addTeacherSuccess } from '../../redux/slices/teacherSlice';
import { useDispatch } from 'react-redux';
import Loader from '../../components/Loader/Loader';
import { Toaster, toast } from 'sonner';

const AddTeacher = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState({
    profileImage: false,
    nicImage: false,
    marksheetImages: false
  });
  const [password, setPassword] = useState('');
  const teacherId = Math.floor(Math.random() * 900000) + 100000; // Generates a 6-digit number
  const [formData, setFormData] = useState({
    jobDetails: {
      joiningDate: '',
      designation: '',
      workingHours: '',
      salary: '',
      teacherId: teacherId
    },
    profileImage: '',
    fullName: '',
    dateOfBirth: '',
    gender: '',
    nic: '',
    nicImage: '',
    phoneNumber: '',
    nextOfKinPhoneNumber: '',
    emailAddress: '',
    fullAddress: '',
    maritalStatus: '',
    degreeTitle: '',
    board: '',
    grade: '',
    marksheetImages: [],
    fatherName: ''
  });
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setImageLoading(prev => ({ ...prev, [fieldName]: true }));
        const formData = new FormData();
        formData.append('image', file);
        const response = await api.post('uploads/img', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (fieldName === 'profileImage') {
          setFormData(prev => ({ ...prev, profileImage: response.data.data }));
        } else if (fieldName === 'nicImage') {
          setFormData(prev => ({ ...prev, nicImage: response.data.data }));
        } else if (fieldName === 'marksheetImages') {
          setFormData(prev => ({
            ...prev,
            marksheetImages: [...prev.marksheetImages, response.data.data]
          }));
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setImageLoading(prev => ({ ...prev, [fieldName]: false }));
      }
    }
  };

  const handleRemoveImage = (fieldName, index = null) => {
    if (fieldName === 'profileImage') {
      setFormData(prev => ({ ...prev, profileImage: '' }));
    } else if (fieldName === 'nicImage') {
      setFormData(prev => ({ ...prev, nicImage: '' }));
    } else if (fieldName === 'marksheetImages' && index !== null) {
      setFormData(prev => ({
        ...prev,
        marksheetImages: prev.marksheetImages.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      dispatch(addTeacherStart(formData));
      const response = await api.post('teachers/create', formData);
      console.log('Teacher added successfully:', response.data);
      if (response.status === 201) {
        dispatch(addTeacherSuccess(response.data.data));
      setError(null);

      const addUser = await api.post('auth/register', {
        password: password,
        role: 'teacher',
        teacherId: formData.jobDetails.teacherId
      });
      console.log('User added successfully:', addUser.data);
      toast.success('Teacher added successfully');

      setTimeout(() => {
        navigate('/teachers');
      }, 1000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error adding teacher:', error);
      dispatch(addTeacherFailure(error.message));
      setError(error.message);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const genderOptions = [
    { value: 'Male', label: 'Male', icon: <PersonIcon /> },
    { value: 'Female', label: 'Female', icon: <PersonIcon /> }
  ];

  const maritalStatusOptions = [
    { value: 'Single', label: 'Single', icon: <PersonIcon /> },
    { value: 'Married', label: 'Married', icon: <PersonIcon /> },
    { value: 'Divorced', label: 'Divorced', icon: <PersonIcon /> },
    { value: 'Widowed', label: 'Widowed', icon: <PersonIcon /> }
  ];

  return (
    <>
    <Toaster position="top-right" />
    {
      loading ?
      <Loader />
      :
   (<> 
   {error && <div className="error-message">{error}</div>}
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
              
              <div className="form-group">
                <label>Profile Image</label>
                <div className="avatar-upload">
                  <div className="image-preview-container">
                    {imageLoading.profileImage ? (
                      <div className="image-loader">
                        <div className="loading-spinner-small"></div>
                      </div>
                    ) : (
                      <>
                        <img
                          src={formData.profileImage }
                          className="avatar-preview"
                        />
                        {formData.profileImage && (
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => handleRemoveImage('profileImage')}
                          >
                            <FiX />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'profileImage')}
                    style={{ display: 'none' }}
                    id="profileImage"
                  />
                  <label htmlFor="profileImage" className="upload-btn">
                    <UploadIcon /> Upload Profile Photo
                  </label>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <div className="input-with-icon">
                    <PersonIcon className="input-icon" />
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <div className="input-with-icon">
                    <CalendarTodayIcon className="input-icon" />
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <CustomDropdown
                    options={genderOptions}
                    value={formData.gender}
                    onChange={(value) => handleInputChange({ target: { name: 'gender', value } })}
                    placeholder="Select gender"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="maritalStatus">Marital Status</label>
                  <CustomDropdown
                    options={maritalStatusOptions}
                    value={formData.maritalStatus}
                    onChange={(value) => handleInputChange({ target: { name: 'maritalStatus', value } })}
                    placeholder="Select marital status"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nic">NIC Number</label>
                  <div className="input-with-icon">
                    <BadgeIcon className="input-icon" />
                    <input
                      type="text"
                      id="nic"
                      name="nic"
                      value={formData.nic}
                      onChange={handleInputChange}
                      placeholder="Enter NIC number"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <div className="input-with-icon">
                    <PhoneIcon className="input-icon" />
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nextOfKinPhoneNumber">Next of Kin Phone</label>
                  <div className="input-with-icon">
                    <PhoneIcon className="input-icon" />
                    <input
                      type="tel"
                      id="nextOfKinPhoneNumber"
                      name="nextOfKinPhoneNumber"
                      value={formData.nextOfKinPhoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter next of kin phone"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="emailAddress">Email Address</label>
                  <div className="input-with-icon">
                    <EmailIcon className="input-icon" />
                    <input
                      type="email"
                      id="emailAddress"
                      name="emailAddress"
                      value={formData.emailAddress}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="fullAddress">Full Address</label>
                <textarea
                  id="fullAddress"
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleInputChange}
                  placeholder="Enter full address"
                  rows="3"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  rows="3"
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Job Details</h2>
              
              <div className="form-row">
            
                <div className="form-group">
                  <label htmlFor="jobDetails.designation">Designation</label>
                  <div className="input-with-icon">
                    <BusinessIcon className="input-icon" />
                    <input
                      type="text"
                      id="jobDetails.designation"
                      name="jobDetails.designation"
                      value={formData.jobDetails.designation}
                      onChange={handleInputChange}
                      placeholder="Enter designation"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="jobDetails.joiningDate">Joining Date</label>
                  <div className="input-with-icon">
                    <CalendarTodayIcon className="input-icon" />
                    <input
                      type="date"
                      id="jobDetails.joiningDate"
                      name="jobDetails.joiningDate"
                      value={formData.jobDetails.joiningDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="jobDetails.workingHours">Working Hours</label>
                  <div className="input-with-icon">
                    <BusinessIcon className="input-icon" />
                    <input
                      type="number"
                      id="jobDetails.workingHours"
                      name="jobDetails.workingHours"
                      value={formData.jobDetails.workingHours}
                      onChange={handleInputChange}
                      placeholder="Enter working hours"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="jobDetails.salary">Salary</label>
                <div className="input-with-icon">
                  <BusinessIcon className="input-icon" />
                  <input
                    type="number"
                    id="jobDetails.salary"
                    name="jobDetails.salary"
                    value={formData.jobDetails.salary}
                    onChange={handleInputChange}
                    placeholder="Enter salary"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Education Details</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="degreeTitle">Degree Title</label>
                  <div className="input-with-icon">
                    <BookIcon className="input-icon" />
                    <input
                      type="text"
                      id="degreeTitle"
                      name="degreeTitle"
                      value={formData.degreeTitle}
                      onChange={handleInputChange}
                      placeholder="Enter degree title"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="board">Board</label>
                  <div className="input-with-icon">
                    <BusinessIcon className="input-icon" />
                    <input
                      type="text"
                      id="board"
                      name="board"
                      value={formData.board}
                      onChange={handleInputChange}
                      placeholder="Enter board"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="grade">Grade</label>
                  <div className="input-with-icon">
                    <BookIcon className="input-icon" />
                    <input
                      type="text"
                      id="grade"
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      placeholder="Enter grade"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="fatherName">Father's Name</label>
                  <div className="input-with-icon">
                    <PersonIcon className="input-icon" />
                    <input
                      type="text"
                      id="fatherName"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleInputChange}
                      placeholder="Enter father's name"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>NIC Image</label>
                <div className="avatar-upload">
                  <div className="image-preview-container">
                    {imageLoading.nicImage ? (
                      <div className="image-loader">
                        <div className="loading-spinner-small"></div>
                      </div>
                    ) : (
                      <>
                        <img
                          src={formData.nicImage }
                          className="avatar-preview"
                        />
                        {formData.nicImage && (
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => handleRemoveImage('nicImage')}
                          >
                            <FiX />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'nicImage')}
                    style={{ display: 'none' }}
                    id="nicImage"
                  />
                  <label htmlFor="nicImage" className="upload-btn">
                    <UploadIcon /> Upload NIC Image
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Marksheet Images</label>
                <div className="marksheet-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'marksheetImages')}
                    style={{ display: 'none' }}
                    id="marksheetImages"
                  />
                  <label htmlFor="marksheetImages" className="upload-btn">
                    <UploadIcon /> Add Marksheet
                  </label>
                  <div className="marksheet-preview">
                    {formData.marksheetImages.map((url, index) => (
                      <div key={index} className="marksheet-image-container">
                        {imageLoading.marksheetImages ? (
                          <div className="image-loader">
                            <div className="loading-spinner-small"></div>
                          </div>
                        ) : (
                          <>
                            <img
                              src={url}
                              className="marksheet-preview-image"
                            />
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={() => handleRemoveImage('marksheetImages', index)}
                            >
                              <FiX />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
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
    </>
    )
    }
    </>

  );
};

export default AddTeacher; 