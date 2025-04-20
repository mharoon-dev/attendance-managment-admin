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
import { useDispatch, useSelector } from 'react-redux';
import { addSubjectStart, addSubjectSuccess, addSubjectFailure } from '../../redux/slices/subjectSlice';
import { toast, Toaster } from 'sonner';
import { api } from '../../utils/url';
import Loader from '../../components/Loader/Loader';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';

const AddSubject = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { classes } = useSelector((state) => state.classes);
  const { teachers } = useSelector((state) => state.teachers);
  
  const [formData, setFormData] = useState({
    subjectName: '',
    className: '',
    teacherName: ''
  });

  // Create class options for dropdown
  const classOptions = classes.map(cls => ({
    value: cls.className,
    label: cls.className,
    icon: <BusinessIcon />
  }));

  // Create teacher options for dropdown
  const teacherOptions = teachers.map(teacher => ({
    value: teacher.fullName,
    label: teacher.fullName,
    icon: <PersonIcon />
  }));

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
      dispatch(addSubjectStart());
      const response = await api.post('subjects/subjects', formData);
      dispatch(addSubjectSuccess(response.data.data));
      toast.success('Subject added successfully');
      setIsLoading(false);
      setTimeout(() => {
        navigate('/subjects');
      }, 1000);
    } catch (error) {
      dispatch(addSubjectFailure(error.response.data.message));
      console.error('Error creating subject:', error);
      setIsLoading(false);
      toast.error('Error creating subject');
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <Toaster position="top-right" />
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
                <h2>Subject Information</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="subjectName">
                      <MenuBookIcon className="form-icon" /> Subject Name
                    </label>
                    <input
                      type="text"
                      id="subjectName"
                      name="subjectName"
                      value={formData.subjectName}
                      onChange={handleInputChange}
                      placeholder="Enter subject name"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="className">
                      <BusinessIcon className="form-icon" /> Class
                    </label>
                    <CustomDropdown
                      options={classOptions}
                      value={formData.className}
                      onChange={(value) => setFormData({...formData, className: value})}
                      placeholder="Select class"
                      icon={<BusinessIcon />}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="teacherName">
                      <PersonIcon className="form-icon" /> Teacher
                    </label>
                    <CustomDropdown
                      options={teacherOptions}
                      value={formData.teacherName}
                      onChange={(value) => setFormData({...formData, teacherName: value})}
                      placeholder="Select teacher"
                      icon={<PersonIcon />}
                    />
                  </div>
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
    </>
  );
};

export default AddSubject; 