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
import ImageViewer from '../../components/ImageViewer/ImageViewer';

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
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

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

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageViewer(true);
  };

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
          <button className="cancel-btn" onClick={() => navigate('/teachers')}>
            <CloseIcon /> Cancel
          </button>
          <h1>نیااستاد شامل کریں
          </h1>
        </div>

        <div className="add-teacher-content">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>بنیادی کی معلومات</h2>
              
              <div className="form-group">
                <label>پروفائل تصویر</label>
                <div className="avatar-upload">
                  <div className="image-preview-container">
                    {imageLoading.profileImage ? (
                      <div className="image-loader">
                        <div className="loading-spinner-small"></div>
                      </div>
                    ) : (
                      <>
                        <img
                          src={formData.profileImage || '/default-avatar.png'}
                          className="avatar-preview"
                          onClick={() => handleImageClick(formData.profileImage || '/default-avatar.png')}
                          style={{ cursor: 'pointer' }}
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
                    <UploadIcon /> پروفائل تصویر اپ لوڈ کریں
                  </label>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">پورا نام</label>
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
                  <label htmlFor="dateOfBirth">تاریخ پیدائش</label>
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
                  <label htmlFor="gender">جنس</label>
                  <CustomDropdown
                    options={genderOptions}
                    value={formData.gender}
                    onChange={(value) => handleInputChange({ target: { name: 'gender', value } })}
                    placeholder="Select gender"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="maritalStatus">شادی شدہ حیثیت</label>
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
                  <label htmlFor="nic">شناختی کارڈ نمبر</label>
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
                  <label htmlFor="phoneNumber">فون نمبر</label>
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
                  <label htmlFor="nextOfKinPhoneNumber">قریبی رشتہ دار کا فون نمبر</label>
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
                  <label htmlFor="emailAddress">ای میل ایڈریس</label>
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
                <label htmlFor="fullAddress">مکمل پتہ</label>
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
                <label htmlFor="password">پاس ورڈ</label>
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
              <h2>ملازمت کی تفصیلات
              </h2>
              
              <div className="form-row">
            
                <div className="form-group">
                  <label htmlFor="jobDetails.designation">عہدہ</label>
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
                  <label htmlFor="jobDetails.joiningDate">تاریخ تقرری</label>
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
                  <label htmlFor="jobDetails.workingHours">کام کے اوقات</label>
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
                <label htmlFor="jobDetails.salary">تنخواہ</label>
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
              <h2>تعلیم کی تفصیلات
              </h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="degreeTitle">ڈگری کا عنوان</label>
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
                  <label htmlFor="board">بورڈ</label>
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
                  <label htmlFor="grade">گریڈ</label>
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
                  <label htmlFor="fatherName">والد کا نام</label>
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
                <label>شناختی کارڈ کی تصویر</label>
                <div className="avatar-upload">
                  <div className="image-preview-container">
                    {imageLoading.nicImage ? (
                      <div className="image-loader">
                        <div className="loading-spinner-small"></div>
                      </div>
                    ) : (
                      <>
                        <img
                          src={formData.nicImage || '/default-nic.png'}
                          className="avatar-preview"
                          onClick={() => handleImageClick(formData.nicImage || '/default-nic.png')}
                          style={{ cursor: 'pointer' }}
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
                    <UploadIcon /> شناختی کارڈ کی تصویر اپ لوڈ کریں
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>مارک شیٹ کی تصاویر</label>
                <div className="marksheet-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'marksheetImages')}
                    style={{ display: 'none' }}
                    id="marksheetImages"
                  />
                  <label htmlFor="marksheetImages" className="upload-btn">
                    <UploadIcon /> مارک شیٹ شامل کریں
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
                              onClick={() => handleImageClick(url)}
                              style={{ cursor: 'pointer' }}
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
                <CloseIcon /> منسوخ کریں
              </button>
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? (
                  <div className="loading-spinner-small"></div>
                ) : (
                  <>
                    <SaveIcon /> استاد محفوظ کریں
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showImageViewer && (
        <ImageViewer
          imageUrl={selectedImage}
          onClose={() => setShowImageViewer(false)}
        />
      )}
    </div>
    </>
    )
    }
    </>

  );
};

export default AddTeacher; 