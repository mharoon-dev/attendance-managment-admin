import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';
import useSidebar from '../../hooks/useSidebar';
import './Classes.css';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../../utils/url';
import { deleteClassFailure, deleteClassStart, deleteClassSuccess, updateClassFailure, updateClassStart, updateClassSuccess } from '../../redux/slices/classesSlice';
import { toast, Toaster } from 'sonner';
import Loader from '../../components/Loader/Loader';

const Classes = () => {
  const dispatch = useDispatch();
  const {classes} = useSelector((state) => state.classes);
  const { teachers } = useSelector((state) => state.teachers);
  const {user} = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newTeacherId, setNewTeacherId] = useState('');
  const [newTeacherYear, setNewTeacherYear] = useState(new Date().getFullYear());
  const [teachersList, setTeachersList] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, classId: null });
  const [formData, setFormData] = useState({
    className: '',
    grade: '',
    classTeachers: [],
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  // Get unique grades from classes and sort them
  const uniqueGrades = [...new Set(classes?.map(cls => cls.grade))].sort((a, b) => a - b);
  
  // Create grade options with proper formatting
  const gradeOptions = [
    { value: 'all', label: 'All Grades', icon: <BusinessIcon /> },
    ...uniqueGrades.map(grade => ({
      value: grade.toString(),
      label: `Grade ${grade}`,
      icon: <BusinessIcon />
    }))
  ];

  const teacherOptions = [
    { value: 'all', label: 'All Teachers', icon: <BadgeIcon /> },
    ...teachers.map(teacher => ({
      value: teacher.jobDetails.teacherId,
      label: `${teacher.fullName}`,
      icon: <BadgeIcon />,
      disabled: teachersList.some(t => t.teacherId === teacher.jobDetails.teacherId)
    }))
  ];

  const sortOptions = [
    { value: 'name', label: 'Class Name', icon: <BusinessIcon /> },
    { value: 'grade', label: 'Grade', icon: <BusinessIcon /> },
    { value: 'startDate', label: 'Start Date', icon: <CalendarMonthIcon /> }
  ];

  // Filter classes based on search term and selected filters
  const filteredClasses = classes?.filter(cls => {
    const matchesSearch = cls.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || cls.grade.toString() === selectedGrade;
    const matchesTeacher = selectedTeacher === 'all' || 
      cls.classTeachers.some(teacher => teacher.teacherId === selectedTeacher);
    
    return matchesSearch && matchesGrade && matchesTeacher;
  });

  // Sort classes based on selected sort option
  const sortedClasses = [...filteredClasses].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.className.localeCompare(b.className);
      case 'grade':
        return a.grade - b.grade;
      default:
        return 0;
    }
  });

  const handleViewClass = (classId) => {
    navigate(`/classes/${classId}`);
  };

  const handleEditClass = (classItem) => {
    setEditingClass(classItem);
    setFormData({
      ...classItem,
      classTeachers: [...classItem.classTeachers]
    });
    setTeachersList([...classItem.classTeachers]);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingClass(null);
    setFormData({
      className: '',
      grade: '',
      classTeachers: [],
      startDate: '',
      endDate: ''
    });
    setTeachersList([]);
  };

  const handleAddTeacher = () => {
    if (newTeacherId && newTeacherYear) {
      // Check if teacher already exists for the given year
      const teacherExistsForYear = teachersList.some(
        teacher => teacher.year === parseInt(newTeacherYear)
      );

      if (teacherExistsForYear) {
        alert('A teacher is already assigned for this year');
        return;
      }

      const newTeacher = {
        teacherId: newTeacherId,
        year: parseInt(newTeacherYear)
      };
      
      setTeachersList([...teachersList, newTeacher]);
      setFormData(prev => ({
        ...prev,
        classTeachers: [...prev.classTeachers, newTeacher]
      }));

      // Reset input fields
      setNewTeacherId('');
      setNewTeacherYear(new Date().getFullYear());
    }
  };

  const handleRemoveTeacher = (index) => {
    setTeachersList(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      classTeachers: prev.classTeachers.filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      setLoading(true);
      dispatch(updateClassStart());
      const response = await api.put(`classes/update/${editingClass._id}`, formData);
      dispatch(updateClassSuccess(response.data.data));
      console.log(response);
      if (response.status === 200) {
        toast.success('Class updated successfully');
        setLoading(false);
        handleCloseModal();
      }
    } catch (error) {
      dispatch(updateClassFailure(error));
      console.error('Error updating class:', error);
      toast.error('Error updating class');
      setLoading(false);
    }
  };

  const handleDeleteClick = (classId) => {
    setDeleteConfirmation({ show: true, classId });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ show: false, classId: null });
  };

  const handleDeleteClass = async (classId) => {
    try {
      setLoading(true);
      dispatch(deleteClassStart());
      const response = await api.delete(`classes/delete/${classId}`);
      dispatch(deleteClassSuccess(classId));
      if (response.status === 200) {
        toast.success('Class deleted successfully');
        setDeleteConfirmation({ show: false, classId: null });
      }
    } catch (error) {
      dispatch(deleteClassFailure(error));
      console.error('Error deleting class:', error);
      toast.error('Error deleting class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {
      loading && <Loader />
    }
    <Toaster position="top-right" />
    <div className={`layout-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`classes-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <div className="classes-header">
          <h1>تمام کلاسیں</h1>
          {
            (user.role === "admin" || user.role === "superAdmin") && (
              <button className="add-class-btn" onClick={() => navigate('/classes/add')}>
                <AddIcon /> نئی کلاس شامل کریں
              </button>
            )
          }
        </div>

        <div className="toolbar">
          <div className="toolbar-actions">
            <div className="search-box">
              <div className="search-input">
                <SearchIcon className="search-icon" />
                <input
                  type="text"
                  placeholder="کلاسیں تلاش کریں..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="dropdown-container">
              <CustomDropdown
                compact
                icon={<BusinessIcon />}
                label="گریڈ"
                value={selectedGrade}
                onChange={(value) => setSelectedGrade(value)}
                options={gradeOptions}
              />
            </div>
          </div>
        </div>

        <div className="classes-grid">
          {sortedClasses.map(cls => (
            <div key={cls._id} className="class-card">
              <div className="class-card-header">
                <div className="class-name">{cls.className}</div>
              </div>
              
              <div className="class-card-body">
                <div className="class-info">
                  <div className="classes-info-item">
                    <BusinessIcon className="classes-info-icon" />
                    <span>گریڈ {cls.grade}</span>
                  </div>
                  <div className="classes-info-item">
                    <CalendarMonthIcon className="classes-info-icon" />
                    <span>شروع: {new Date(cls.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="classes-info-item">
                    <CalendarMonthIcon className="classes-info-icon" />
                    <span>اختتام: {new Date(cls.endDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="class-teachers">
                  <h4>کلاس کے اساتذہ:</h4>
                  <br />
                  {cls.classTeachers.map((teacher, index) => (
                    <div key={index} className="classes-info-item">
                      <BadgeIcon className="classes-info-icon" />
                      {teachers.find(t => t.jobDetails.teacherId === teacher?.teacherId)?.fullName}
                      <span>{teacher?.teacherId} ({teacher?.year})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="class-card-footer">
                <button 
                  className="view-class-btn"
                  onClick={() => handleViewClass(cls._id)}
                >
                  <VisibilityIcon /> تفصیلات دیکھیں
                </button>
                {
                  (user.role === "admin" || user.role === "superAdmin") && (
                    <div className="quick-actions">
                      <button 
                        className="action-btn edit"
                        onClick={() => handleEditClass(cls)}
                      >
                        <EditIcon />
                      </button>
                      <button 
                        className="action-btn delete" 
                        onClick={() => handleDeleteClick(cls._id)}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  )
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="modal-overlay">
          <div className="delete-confirmation-modal">
            <div className="modal-header">
              <h2>حذف کرنے کی تصدیق</h2>
              <button className="modal-close-btn" onClick={handleCancelDelete}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <p>کیا آپ واقعی اس کلاس کو حذف کرنا چاہتے ہیں؟ یہ عمل واپس نہیں کیا جا سکتا۔</p>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCancelDelete}>
                منسوخ کریں
              </button>
              <button 
                className="delete-btn" 
                onClick={() => handleDeleteClass(deleteConfirmation.classId)}
              >
                حذف کریں
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Class Modal */}
      {isEditModalOpen && editingClass && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>کلاس میں ترمیم کریں</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="className">کلاس کا نام</label>
                  <input
                    type="text"
                    id="className"
                    name="className"
                    value={formData.className}
                    onChange={handleInputChange}
                    placeholder="کلاس کا نام درج کریں"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="grade">گریڈ</label>
                  <input
                    type="number"
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    placeholder="گریڈ درج کریں"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="startDate">شروع کی تاریخ</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate.split('T')[0]}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">اختتام کی تاریخ</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate.split('T')[0]}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>کلاس کے اساتذہ</label>
                  <div className="teacher-input-group">
                    <CustomDropdown
                      value={newTeacherId}
                      onChange={(value) => setNewTeacherId(value)}
                      options={teacherOptions.filter(t => t.value !== 'all')}
                      placeholder="استاد منتخب کریں"
                      icon={<BadgeIcon />}
                    />
                    <br />
                    <input
                      type="number"
                      value={newTeacherYear}
                      onChange={(e) => setNewTeacherYear(e.target.value)}
                      placeholder="سال"
                    />
                  </div>
                  
                  <button
                    type="button"
                    className="add-teacher-btn"
                    onClick={handleAddTeacher}
                  >
                    <AddIcon /> استاد شامل کریں
                  </button>

                  <div className="classes-teachers-list">
                    {teachersList.map((teacher, index) => (
                      <div key={index} className="classes-teacher-item">
                        <span>{teacher.teacherId} ({teacher.year})</span>
                        <button
                          type="button"
                          className="classes-remove-teacher-btn"
                          onClick={() => handleRemoveTeacher(index)}
                        >
                          <CloseIcon />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                    منسوخ کریں
                  </button>
                  <button type="submit" className="save-btn">
                    {loading ? (
                      <span className="loading-spinner"></span>
                    ) : (
                      <>
                        <SaveIcon /> تبدیلیاں محفوظ کریں
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

export default Classes;