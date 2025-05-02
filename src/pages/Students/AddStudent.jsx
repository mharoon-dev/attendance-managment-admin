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
import './AddStudent.css';
import { api } from '../../utils/url';
import { FiX } from 'react-icons/fi';
import { addStudentFailure, addStudentStart, addStudentSuccess } from '../../redux/slices/studentsSlice.jsx';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader/Loader';
import { Toaster, toast } from 'sonner';
import ImageViewer from '../../components/ImageViewer/ImageViewer';

const AddStudent = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState({
    profileImage: false,
    nicImage: false,
    parentDetails: {
      profileImage: false,
      nicImage: false
    },
    schoolDetails: {
      previousDegreeWithImage: false
    }
  });
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const studentId = Math.floor(Math.random() * 900000) + 100000; // Generates a 6-digit number
  const [formData, setFormData] = useState({
    fullName: '',
    profileImage: '',
    dateOfBirth: '',
    phoneNumber: '',
    fullAddress: '',
    gender: '',
    nicImage: '',
    parentDetails: {
      profileImage: '',
      fullName: '',
      dateOfBirth: '',
      gender: '',
      nic: '',
      nicImage: '',
      phoneNumber: '',
      education: '',
      profession: ''
    },
    schoolDetails: {
      joiningDate: '',
      rollNumber: studentId,
      previousInstitute: '',
      previousDegreeWithImage: ''
    },
    grade: ''
  });
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const { classes } = useSelector((state) => state.classes);

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
        if (fieldName.includes('.')) {
          const [parent, child] = fieldName.split('.');
          setImageLoading(prev => ({
            ...prev,
            [parent]: {
              ...prev[parent],
              [child]: true
            }
          }));
        } else {
          setImageLoading(prev => ({ ...prev, [fieldName]: true }));
        }

        const formData = new FormData();
        formData.append('image', file);
        const response = await api.post('uploads/img', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (fieldName.includes('.')) {
          const [parent, child] = fieldName.split('.');
          setFormData(prev => ({
            ...prev,
            [parent]: {
              ...prev[parent],
              [child]: response.data.data
            }
          }));
        } else {
          setFormData(prev => ({ ...prev, [fieldName]: response.data.data }));
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error('Error uploading file');
      } finally {
        if (fieldName.includes('.')) {
          const [parent, child] = fieldName.split('.');
          setImageLoading(prev => ({
            ...prev,
            [parent]: {
              ...prev[parent],
              [child]: false
            }
          }));
        } else {
          setImageLoading(prev => ({ ...prev, [fieldName]: false }));
        }
      }
    }
  };

  const handleRemoveImage = (fieldName) => {
    if (fieldName.includes('.')) {
      const [parent, child] = fieldName.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: ''
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      dispatch(addStudentStart(formData));
      const response = await api.post('students/create', formData);
      console.log('Student added successfully:', response.data);
      if (response.status === 201) {
        dispatch(addStudentSuccess(response.data.data));
        setError(null);
        toast.success('Student added successfully');
        setTimeout(() => {
          navigate('/students');
        }, 1000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error adding student:', error);
      dispatch(addStudentFailure(error.message));
      setError(error.message);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const genderOptions = [
    { value: 'Male', label: 'Male', icon: <PersonIcon /> },
    { value: 'Female', label: 'Female', icon: <PersonIcon /> },
    { value: 'Other', label: 'Other', icon: <PersonIcon /> }
  ];

  // Get unique grades from classes
  const uniqueGrades = [...new Set(classes.map(cls => cls.grade))].sort((a, b) => a - b);
  console.log(uniqueGrades);
  
  // Create grade options with class names
  const gradeOptions = uniqueGrades.map(grade => {
    // Find all classes with this grade
    const classesWithGrade = classes.filter(cls => cls.grade === grade);
    // Get the class names for this grade
    const classNames = classesWithGrade.map(cls => cls.className).join(', ');
    
    return {
      value: grade.toString(),
      label: `Grade ${grade} (${classNames})`,
      icon: <BookIcon />
    };
  });

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
      
      <div className={`add-student-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <div className="add-student-header">
          <h1>نیا طالب علم شامل کریں</h1>
          <button className="cancel-btn" onClick={() => navigate('/students')}>
            <CloseIcon /> منسوخ کریں
          </button>
        </div>

        <div className="add-student-content">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>بنیادی معلومات</h2>
              
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
                      placeholder="پورا نام درج کریں"
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
                    placeholder="جنس منتخب کریں"
                  />
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
                      placeholder="فون نمبر درج کریں"
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
                  placeholder="مکمل پتہ درج کریں"
                  rows="3"
                  required
                />
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
            </div>

            <div className="form-section">
              <h2>والدین کی معلومات</h2>
              
              <div className="form-group">
                <label>والدین کی پروفائل تصویر</label>
                <div className="avatar-upload">
                  <div className="image-preview-container">
                    {imageLoading.parentDetails.profileImage ? (
                      <div className="image-loader">
                        <div className="loading-spinner-small"></div>
                      </div>
                    ) : (
                      <>
                        <img
                          src={formData.parentDetails.profileImage || '/default-avatar.png'}
                          className="avatar-preview"
                          onClick={() => handleImageClick(formData.parentDetails.profileImage || '/default-avatar.png')}
                          style={{ cursor: 'pointer' }}
                        />
                        {formData.parentDetails.profileImage && (
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => handleRemoveImage('parentDetails.profileImage')}
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
                    onChange={(e) => handleFileUpload(e, 'parentDetails.profileImage')}
                    style={{ display: 'none' }}
                    id="parentProfileImage"
                  />
                  <label htmlFor="parentProfileImage" className="upload-btn">
                    <UploadIcon /> والدین کی تصویر اپ لوڈ کریں
                  </label>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="parentDetails.fullName">والدین کا نام</label>
                  <div className="input-with-icon">
                    <PersonIcon className="input-icon" />
                    <input
                      type="text"
                      id="parentDetails.fullName"
                      name="parentDetails.fullName"
                      value={formData.parentDetails.fullName}
                      onChange={handleInputChange}
                      placeholder="والدین کا نام درج کریں"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="parentDetails.dateOfBirth">والدین کی تاریخ پیدائش</label>
                  <div className="input-with-icon">
                    <CalendarTodayIcon className="input-icon" />
                    <input
                      type="date"
                      id="parentDetails.dateOfBirth"
                      name="parentDetails.dateOfBirth"
                      value={formData.parentDetails.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="parentDetails.gender">والدین کی جنس</label>
                  <CustomDropdown
                    options={genderOptions}
                    value={formData.parentDetails.gender}
                    onChange={(value) => handleInputChange({ target: { name: 'parentDetails.gender', value } })}
                    placeholder="والدین کی جنس منتخب کریں"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="parentDetails.phoneNumber">والدین کا فون نمبر</label>
                  <div className="input-with-icon">
                    <PhoneIcon className="input-icon" />
                    <input
                      type="tel"
                      id="parentDetails.phoneNumber"
                      name="parentDetails.phoneNumber"
                      value={formData.parentDetails.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="والدین کا فون نمبر درج کریں"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="parentDetails.nic">والدین کا شناختی کارڈ نمبر</label>
                  <div className="input-with-icon">
                    <BadgeIcon className="input-icon" />
                    <input
                      type="text"
                      id="parentDetails.nic"
                      name="parentDetails.nic"
                      value={formData.parentDetails.nic}
                      onChange={handleInputChange}
                      placeholder="والدین کا شناختی کارڈ نمبر درج کریں"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="parentDetails.education">والدین کی تعلیم</label>
                  <div className="input-with-icon">
                    <BookIcon className="input-icon" />
                    <input
                      type="text"
                      id="parentDetails.education"
                      name="parentDetails.education"
                      value={formData.parentDetails.education}
                      onChange={handleInputChange}
                      placeholder="والدین کی تعلیم درج کریں"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="parentDetails.profession">والدین کا پیشہ</label>
                <div className="input-with-icon">
                  <BusinessIcon className="input-icon" />
                  <input
                    type="text"
                    id="parentDetails.profession"
                    name="parentDetails.profession"
                    value={formData.parentDetails.profession}
                    onChange={handleInputChange}
                    placeholder="والدین کا پیشہ درج کریں"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>والدین کا شناختی کارڈ کی تصویر</label>
                <div className="avatar-upload">
                  <div className="image-preview-container">
                    {imageLoading.parentDetails.nicImage ? (
                      <div className="image-loader">
                        <div className="loading-spinner-small"></div>
                      </div>
                    ) : (
                      <>
                        <img
                          src={formData.parentDetails.nicImage || '/default-nic.png'}
                          className="avatar-preview"
                          onClick={() => handleImageClick(formData.parentDetails.nicImage || '/default-nic.png')}
                          style={{ cursor: 'pointer' }}
                        />
                        {formData.parentDetails.nicImage && (
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => handleRemoveImage('parentDetails.nicImage')}
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
                    onChange={(e) => handleFileUpload(e, 'parentDetails.nicImage')}
                    style={{ display: 'none' }}
                    id="parentNicImage"
                  />
                  <label htmlFor="parentNicImage" className="upload-btn">
                    <UploadIcon /> والدین کا شناختی کارڈ کی تصویر اپ لوڈ کریں
                  </label>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>اسکول کی تفصیلات</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="grade">گریڈ</label>
                  <CustomDropdown
                    options={gradeOptions}
                    value={formData.grade}
                    onChange={(value) => handleInputChange({ target: { name: 'grade', value } })}
                    placeholder="گریڈ منتخب کریں"
                    icon={<BookIcon />}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="schoolDetails.rollNumber">رول نمبر</label>
                  <div className="input-with-icon">
                    <BadgeIcon className="input-icon" />
                    <input
                      type="text"
                      id="schoolDetails.rollNumber"
                      name="schoolDetails.rollNumber"
                      value={formData.schoolDetails.rollNumber}
                      onChange={handleInputChange}
                      placeholder="رول نمبر درج کریں"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="schoolDetails.joiningDate">تاریخ داخلہ</label>
                  <div className="input-with-icon">
                    <CalendarTodayIcon className="input-icon" />
                    <input
                      type="date"
                      id="schoolDetails.joiningDate"
                      name="schoolDetails.joiningDate"
                      value={formData.schoolDetails.joiningDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="schoolDetails.previousInstitute">سابقہ ادارہ</label>
                  <div className="input-with-icon">
                    <BusinessIcon className="input-icon" />
                    <input
                      type="text"
                      id="schoolDetails.previousInstitute"
                      name="schoolDetails.previousInstitute"
                      value={formData.schoolDetails.previousInstitute}
                      onChange={handleInputChange}
                      placeholder="سابقہ ادارہ درج کریں"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>سابقہ ڈگری کی تصویر</label>
                <div className="avatar-upload">
                  <div className="image-preview-container">
                    {imageLoading.schoolDetails.previousDegreeWithImage ? (
                      <div className="image-loader">
                        <div className="loading-spinner-small"></div>
                      </div>
                    ) : (
                      <>
                        <img
                          src={formData.schoolDetails.previousDegreeWithImage || '/default-degree.png'}
                          className="avatar-preview"
                          onClick={() => handleImageClick(formData.schoolDetails.previousDegreeWithImage || '/default-degree.png')}
                          style={{ cursor: 'pointer' }}
                        />
                        {formData.schoolDetails.previousDegreeWithImage && (
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => handleRemoveImage('schoolDetails.previousDegreeWithImage')}
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
                    onChange={(e) => handleFileUpload(e, 'schoolDetails.previousDegreeWithImage')}
                    style={{ display: 'none' }}
                    id="previousDegreeImage"
                  />
                  <label htmlFor="previousDegreeImage" className="upload-btn">
                    <UploadIcon /> سابقہ ڈگری کی تصویر اپ لوڈ کریں
                  </label>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => navigate('/students')}>
                <CloseIcon /> منسوخ کریں
              </button>
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? (
                  <Loader />
                ) : (
                  <>
                    <SaveIcon /> طالب علم محفوظ کریں
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
    {showImageViewer && (
      <ImageViewer
        imageUrl={selectedImage}
        onClose={() => setShowImageViewer(false)}
      />
    )}
    </>
  );
};

export default AddStudent; 