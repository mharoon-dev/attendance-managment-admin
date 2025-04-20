import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';
import useSidebar from '../../hooks/useSidebar';
import './Students.css';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../../utils/url';
import { toast, Toaster } from 'sonner';
import Loader from '../../components/Loader/Loader';
import { FiSave, FiUpload, FiX } from 'react-icons/fi';
import { deleteStudentStart, deleteStudentSuccess, updateStudentFailure, updateStudentStart, updateStudentSuccess } from '../../redux/slices/studentsSlice';

const Students = () => {
  const dispatch = useDispatch();
  const { students } = useSelector((state) => state.students);
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(false);
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
      rollNumber: '',
      previousInstitute: '',
      previousDegreeWithImage: ''
    },
    grade: ''
  });

  const {classes} = useSelector((state) => state.classes);
  

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const grades = [
    { value: 'all', label: 'All Grades', icon: <BusinessIcon /> },
    { value: '10', label: 'Grade 10', icon: <BusinessIcon /> },
    { value: '11', label: 'Grade 11', icon: <BusinessIcon /> },
    { value: '12', label: 'Grade 12', icon: <BusinessIcon /> }
  ];

  const genderOptions = [
    { value: 'all', label: 'All Genders', icon: <PersonIcon /> },
    { value: 'Male', label: 'Male', icon: <PersonIcon /> },
    { value: 'Female', label: 'Female', icon: <PersonIcon /> },
    { value: 'Other', label: 'Other', icon: <PersonIcon /> }
  ];

  const sortOptions = [
    { value: 'name', label: 'Student Name', icon: <ArrowUpwardIcon /> },
    { value: 'grade', label: 'Grade', icon: <ArrowUpwardIcon /> },
    { value: 'rollNumber', label: 'Roll Number', icon: <ArrowUpwardIcon /> }
  ];

  // Filter students based on search term and selected filters
  const filteredStudents = students?.filter(student => {
    const matchesSearch = student.parentDetails.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.schoolDetails.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || student.grade.toString() === selectedGrade;
    const matchesGender = selectedGender === 'all' || student.gender === selectedGender;
    
    return matchesSearch && matchesGrade && matchesGender;
  });

  // Sort students based on selected sort option
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.parentDetails.fullName.localeCompare(b.parentDetails.fullName);
      case 'grade':
        return a.grade - b.grade;
      case 'rollNumber':
        return a.schoolDetails.rollNumber.localeCompare(b.schoolDetails.rollNumber);
      default:
        return 0;
    }
  });

  const handleViewStudent = (studentId) => {
    navigate(`/students/${studentId}`);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setFormData({
      fullName: student.fullName || '',
      profileImage: student.profileImage || '',
      dateOfBirth: student.dateOfBirth?.split('T')[0] || '', // Split the date to remove time
      phoneNumber: student.phoneNumber || '',
      fullAddress: student.fullAddress || '',
      gender: student.gender || '',
      nicImage: student.nicImage || '',
      parentDetails: {
        profileImage: student.parentDetails?.profileImage || '',
        fullName: student.parentDetails?.fullName || '',
        dateOfBirth: student.parentDetails?.dateOfBirth?.split('T')[0] || '', // Split the date to remove time
        gender: student.parentDetails?.gender || '',
        nic: student.parentDetails?.nic || '',
        nicImage: student.parentDetails?.nicImage || '',
        phoneNumber: student.parentDetails?.phoneNumber || '',
        education: student.parentDetails?.education || '',
        profession: student.parentDetails?.profession || ''
      },
      schoolDetails: {
        joiningDate: student.schoolDetails?.joiningDate?.split('T')[0] || '', // Split the date to remove time
        rollNumber: student.schoolDetails?.rollNumber || '',
        previousInstitute: student.schoolDetails?.previousInstitute || '',
        previousDegreeWithImage: student.schoolDetails?.previousDegreeWithImage || ''
      },
      grade: student.grade || ''
    });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingStudent(null);
    setFormData({
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
        rollNumber: '',
        previousInstitute: '',
        previousDegreeWithImage: ''
      },
      grade: ''
    });

  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      dispatch(updateStudentStart());
      const response = await api.put(`students/update/${editingStudent._id}`, formData);
      console.log(response.data.data)
      if (response.status === 200) {
        toast.success('Student updated successfully');
        setLoading(false);
        dispatch(updateStudentSuccess(response.data.data));
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error updating student:', error);
      dispatch(updateStudentFailure());
      toast.error('Error updating student');
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      setLoading(true);
      dispatch(deleteStudentStart());
      const response = await api.delete(`students/delete/${studentId}`);
      if (response.status === 200) {
        dispatch(deleteStudentSuccess(studentId));
        toast.success('Student deleted successfully');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      dispatch(deleteStudentFailure(error));
      toast.error('Error deleting student');
      setLoading(false);
    }
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      try {
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
        } else if (fieldName === 'parentDetails.profileImage') {
          setFormData(prev => ({
            ...prev,
            parentDetails: {
              ...prev.parentDetails,
              profileImage: response.data.data
            }
          }));
        } else if (fieldName === 'parentDetails.nicImage') {
          setFormData(prev => ({
            ...prev,
            parentDetails: {
              ...prev.parentDetails,
              nicImage: response.data.data
            }
          }));
        } else if (fieldName === 'schoolDetails.previousDegreeWithImage') {
          setFormData(prev => ({
            ...prev,
            schoolDetails: {
              ...prev.schoolDetails,
              previousDegreeWithImage: response.data.data
            }
          }));
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error('Error uploading file');
      }
    }
  };

  const handleRemoveImage = (fieldName) => {
    if (fieldName === 'profileImage') {
      setFormData(prev => ({ ...prev, profileImage: '' }));
    } else if (fieldName === 'nicImage') {
      setFormData(prev => ({ ...prev, nicImage: '' }));
    } else if (fieldName === 'parentDetails.profileImage') {
      setFormData(prev => ({
        ...prev,
        parentDetails: {
          ...prev.parentDetails,
          profileImage: ''
        }
      }));
    } else if (fieldName === 'parentDetails.nicImage') {
      setFormData(prev => ({
        ...prev,
        parentDetails: {
          ...prev.parentDetails,
          nicImage: ''
        }
      }));
    } else if (fieldName === 'schoolDetails.previousDegreeWithImage') {
      setFormData(prev => ({
        ...prev,
        schoolDetails: {
          ...prev.schoolDetails,
          previousDegreeWithImage: ''
        }
      }));
    }
  };

  return (
    <>
      {loading && <Loader />}
      <Toaster position="top-right" />
      <div className={`layout-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <div className={`students-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
          <div className="students-header">
            <h1>All Students</h1>
            <button className="add-student-btn" onClick={() => navigate('/students/add')}>
              <AddIcon /> Add New Student
            </button>
          </div>

          <div className="toolbar">
            <div className="toolbar-actions">
              <div className="search-box">
                <div className="search-input">
                  <SearchIcon className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="dropdown-container">
                <CustomDropdown
                  compact
                  icon={<BusinessIcon />}
                  label="Grade"
                  value={selectedGrade}
                  onChange={(value) => setSelectedGrade(value)}
                  options={classes.map(cls => ({
                    value: cls.className,
                    label: cls.className,
                    icon: <BusinessIcon />
                  }))}
                />
                <CustomDropdown
                  compact
                  icon={<PersonIcon />}
                  label="Gender"
                  value={selectedGender}
                  onChange={(value) => setSelectedGender(value)}
                  options={genderOptions}
                />
          
              </div>
            </div>
          </div>

          <div className="students-grid">
            {sortedStudents?.map(student => (
              <div key={student._id} className="student-card">
                <div className="student-card-header">
                  <img src={student.profileImage || 'https://via.placeholder.com/150'} alt={student.parentDetails.fullName} className="student-avatar" />
                </div>
                
                <div className="student-card-body">
                  <h3 className="student-name">{student?.fullName}</h3>
                  <p className="student-class">Grade {student?.grade} • Roll No: {student?.schoolDetails?.rollNumber}</p>
                  
                  <div className="student-info">
                    <div className="info-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      <span>{student.phoneNumber}</span>
                    </div>
                    <div className="info-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span>{student.gender}</span>
                    </div>
                    <div className="info-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span>{student.parentDetails.fullName}</span>
                    </div>
                  </div>
                </div>

                <div className="student-card-footer">
                  <button 
                    className="view-student-btn"
                    onClick={() => handleViewStudent(student._id)}
                  >
                    <VisibilityIcon /> View Profile
                  </button>
                  <div className="quick-actions">
                    <button 
                      className="action-btn edit"
                      onClick={() => handleEditStudent(student)}
                    >
                      <EditIcon />
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDeleteStudent(student._id)}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Student Modal */}
        {isEditModalOpen && editingStudent && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2>Edit Student</h2>
                <button className="close-btn" onClick={handleCloseModal}>
                  <CloseIcon />
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  {/* Student Personal Information Section */}
                  <div className="form-section">
                    <h3 className="section-title">Personal Information</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData?.fullName}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter student's full name"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="dateOfBirth">Date of Birth</label>
                        <input
                          type="date"
                          id="dateOfBirth"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="fullAddress">Full Address</label>
                      <textarea
                        id="fullAddress"
                        name="fullAddress"
                        value={formData.fullAddress}
                        onChange={handleInputChange}
                        rows="3"
                        required
                      />
                    </div>
                  </div>

                  {/* Student Documents Section */}
                  <div className="form-section">
                    <h3 className="section-title">Documents</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="profileImage">Profile Image</label>
                        <div className="avatar-upload">
                          <div className="image-preview-container">
                            <img
                              src={formData.profileImage || '/default-avatar.png'}
                              alt="Profile"
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
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'profileImage')}
                            style={{ display: 'none' }}
                            id="profileImage"
                            name="profileImage"
                          />
                          <label htmlFor="profileImage" className="upload-btn">
                            <FiUpload /> Change Image
                          </label>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="nicImage">NIC Image</label>
                        <div className="avatar-upload">
                          <div className="image-preview-container">
                            <img
                              src={formData.nicImage || '/default-nic.png'}
                              alt="NIC"
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
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'nicImage')}
                            style={{ display: 'none' }}
                            id="nicImage"
                            name="nicImage"
                          />
                          <label htmlFor="nicImage" className="upload-btn">
                            <FiUpload /> Change NIC Image
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Parent Information Section */}
                  <div className="form-section">
                    <h3 className="section-title">Parent Information</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="parentDetails.fullName">Parent Full Name</label>
                        <input
                          type="text"
                          id="parentDetails.fullName"
                          name="parentDetails.fullName"
                          value={formData.parentDetails.fullName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="parentDetails.gender">Parent Gender</label>
                        <select
                          id="parentDetails.gender"
                          name="parentDetails.gender"
                          value={formData.parentDetails.gender}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="parentDetails.dateOfBirth">Parent Date of Birth</label>
                        <input
                          type="date"
                          id="parentDetails.dateOfBirth"
                          name="parentDetails.dateOfBirth"
                          value={formData.parentDetails.dateOfBirth}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="parentDetails.phoneNumber">Parent Phone Number</label>
                        <input
                          type="tel"
                          id="parentDetails.phoneNumber"
                          name="parentDetails.phoneNumber"
                          value={formData.parentDetails.phoneNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="parentDetails.nic">Parent NIC</label>
                        <input
                          type="text"
                          id="parentDetails.nic"
                          name="parentDetails.nic"
                          value={formData.parentDetails.nic}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="parentDetails.education">Parent Education</label>
                        <input
                          type="text"
                          id="parentDetails.education"
                          name="parentDetails.education"
                          value={formData.parentDetails.education}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="parentDetails.profession">Parent Profession</label>
                      <input
                        type="text"
                        id="parentDetails.profession"
                        name="parentDetails.profession"
                        value={formData.parentDetails.profession}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="parentDetails.profileImage">Parent Profile Image</label>
                        <div className="avatar-upload">
                          <div className="image-preview-container">
                            <img
                              src={formData.parentDetails.profileImage || '/default-avatar.png'}
                              alt="Parent Profile"
                              className="avatar-preview"
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
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'parentDetails.profileImage')}
                            style={{ display: 'none' }}
                            id="parentDetails.profileImage"
                            name="parentDetails.profileImage"
                          />
                          <label htmlFor="parentDetails.profileImage" className="upload-btn">
                            <FiUpload /> Change Parent Image
                          </label>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="parentDetails.nicImage">Parent NIC Image</label>
                        <div className="avatar-upload">
                          <div className="image-preview-container">
                            <img
                              src={formData.parentDetails.nicImage || '/default-nic.png'}
                              alt="Parent NIC"
                              className="avatar-preview"
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
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'parentDetails.nicImage')}
                            style={{ display: 'none' }}
                            id="parentDetails.nicImage"
                            name="parentDetails.nicImage"
                          />
                          <label htmlFor="parentDetails.nicImage" className="upload-btn">
                            <FiUpload /> Change Parent NIC Image
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* School Information Section */}
                  <div className="form-section">
                    <h3 className="section-title">School Information</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="grade">Grade</label>
                        <input
                          type="text"
                          id="grade"
                          name="grade"
                          value={formData.grade}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="schoolDetails.rollNumber">Roll Number</label>
                        <input
                          type="text"
                          id="schoolDetails.rollNumber"
                          name="schoolDetails.rollNumber"
                          value={formData.schoolDetails.rollNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="schoolDetails.joiningDate">Joining Date</label>
                        <input
                          type="date"
                          id="schoolDetails.joiningDate"
                          name="schoolDetails.joiningDate"
                          value={formData.schoolDetails.joiningDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="schoolDetails.previousInstitute">Previous Institute</label>
                        <input
                          type="text"
                          id="schoolDetails.previousInstitute"
                          name="schoolDetails.previousInstitute"
                          value={formData.schoolDetails.previousInstitute}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="schoolDetails.previousDegreeWithImage">Previous Degree Image</label>
                      <div className="avatar-upload">
                        <div className="image-preview-container">
                          <img
                            src={formData.schoolDetails.previousDegreeWithImage || '/default-degree.png'}
                            alt="Previous Degree"
                            className="avatar-preview"
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
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'schoolDetails.previousDegreeWithImage')}
                          style={{ display: 'none' }}
                          id="schoolDetails.previousDegreeWithImage"
                          name="schoolDetails.previousDegreeWithImage"
                        />
                        <label htmlFor="schoolDetails.previousDegreeWithImage" className="upload-btn">
                          <FiUpload /> Change Degree Image
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                      Cancel
                    </button>
                    <button type="submit" className="save-btn">
                      {loading ? (
                        <span className="loading-spinner"></span>
                      ) : (
                        <>
                          <FiSave /> Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Students; 