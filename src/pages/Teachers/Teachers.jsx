import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Teachers.css";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import CustomDropdown from "../../components/CustomDropdown/CustomDropdown";
import useSidebar from "../../hooks/useSidebar";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import SchoolIcon from "@mui/icons-material/School";
import { FiSave, FiUpload, FiX } from "react-icons/fi";
import BadgeIcon from "@mui/icons-material/Badge";
import { useDispatch } from "react-redux";
import BusinessIcon from "@mui/icons-material/Business";
import { useSelector } from "react-redux";
import { api } from "../../utils/url.js";
import { deleteTeacherFailure, deleteTeacherStart, deleteTeacherSuccess, updateTeacherFailure, updateTeacherStart, updateTeacherSuccess } from "../../redux/slices/teacherSlice";
import Loader from "../../components/Loader/Loader.jsx";
import { toast, Toaster } from "sonner";
import ImageViewer from "../../components/ImageViewer/ImageViewer";

const Teachers = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, teacherId: null, teacherJobId: null });
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    jobDetails: {
      joiningDate: "",
      designation: "",
      workingHours: "",
      salary: "",
      teacherId: "",
    },
    profileImage: "",
    fullName: "",
    dateOfBirth: "",
    gender: "",
    nic: "",
    nicImage: [],
    phoneNumber: "",
    nextOfKinPhoneNumber: "",
    emailAddress: "",
    fullAddress: "",
    maritalStatus: "",
    degreeTitle: "",
    board: "",
    grade: "",
    marksheetImages: [],
    fatherName: "",
  });

  const { teachers: teachersData } = useSelector((state) => state.teachers);

  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleViewProfile = (teacherId) => {
    navigate(`/teachers/${teacherId}`);
  };

  const handleEditClick = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      jobDetails: {
        joiningDate: teacher.jobDetails.joiningDate,
        designation: teacher.jobDetails.designation,
        workingHours: teacher.jobDetails.workingHours,
        salary: teacher.jobDetails.salary,
        teacherId: teacher.jobDetails.teacherId,
      },
      profileImage: teacher.profileImage,
      fullName: teacher.fullName,
      dateOfBirth: teacher.dateOfBirth,
      gender: teacher.gender,
      nic: teacher.nic,
      nicImage: teacher.nicImage,
      phoneNumber: teacher.phoneNumber,
      nextOfKinPhoneNumber: teacher.nextOfKinPhoneNumber,
      emailAddress: teacher.emailAddress,
      fullAddress: teacher.fullAddress,
      maritalStatus: teacher.maritalStatus,
      degreeTitle: teacher.degreeTitle,
      board: teacher.board,
      grade: teacher.grade,
      marksheetImages: teacher.marksheetImages,
      fatherName: teacher.fatherName,
    });
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingTeacher(null);
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
          setFormData(prev => ({
            ...prev,
            nicImage: [...(prev.nicImage || []), response.data.data]
          }));
        } else if (fieldName === 'marksheetImages') {
          setFormData(prev => ({
            ...prev,
            marksheetImages: [...prev.marksheetImages, response.data.data]
          }));
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleRemoveImage = (fieldName, index = null) => {
    if (fieldName === 'profileImage') {
      setFormData(prev => ({ ...prev, profileImage: '' }));
    } else if (fieldName === 'nicImage' && index !== null) {
      setFormData(prev => ({
        ...prev,
        nicImage: prev.nicImage.filter((_, i) => i !== index)
      }));
    } else if (fieldName === 'marksheetImages' && index !== null) {
      setFormData(prev => ({
        ...prev,
        marksheetImages: prev.marksheetImages.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      dispatch(updateTeacherStart(formData));
      console.log("Updated teacher data:", formData);

      const res = await api.put(`teachers/update/${editingTeacher._id}`, formData);
      console.log(res);
      dispatch(updateTeacherSuccess(res.data.data));
      handleCloseModal();
      setLoading(false);
    } catch (error) {
      console.log(error);
      dispatch(updateTeacherFailure(error.response.data.message));
      setLoading(false);
    }
  };

  const handleDelete = async (id, teacherJobId) => {
    try {
      dispatch(deleteTeacherStart());
      const res = await api.delete(`teachers/delete/${id}`);
      console.log(res);
      if (res.status === 200) {
        const deleteUser = await api.delete(`users/${teacherJobId}`);
        dispatch(deleteTeacherSuccess(id));
        toast.success('Teacher deleted successfully');
        setDeleteConfirmation({ show: false, teacherId: null, teacherJobId: null });
      } else {
        dispatch(deleteTeacherFailure(res.data.message));
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      dispatch(deleteTeacherFailure(error.response.data.message));
    }
  };

  

  const handleDeleteClick = (id, teacherJobId) => {
    setDeleteConfirmation({ show: true, teacherId: id, teacherJobId });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ show: false, teacherId: null, teacherJobId: null });
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageViewer(true);
  };

  // Sample teachers data based on the provided structure
  const departments = [
    { value: "all", label: "All Departments" },
    { value: "mathematics", label: "Mathematics" },
    { value: "science", label: "Science" },
    { value: "english", label: "English" },
    { value: "history", label: "History" },
    { value: "art", label: "Art" },
  ];

  const statuses = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "on leave", label: "On Leave" },
    { value: "inactive", label: "Inactive" },
  ];

  const filteredTeachers = teachersData.filter((teacher) => {
    const matchesSearch =
      teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.jobDetails.designation
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      teacher.emailAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "all" ||
      teacher.jobDetails.designation.toLowerCase() === selectedDepartment;
    const matchesStatus =
      selectedStatus === "all" ||
      teacher.status.toLowerCase() === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const sortedTeachers = [...filteredTeachers].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.fullName.localeCompare(b.fullName);
      case "designation":
        return a.jobDetails.designation.localeCompare(b.jobDetails.designation);
      case "joinDate":
        return (
          new Date(b.jobDetails.joiningDate) -
          new Date(a.jobDetails.joiningDate)
        );
      default:
        return 0;
    }
  });

  return (
    <>
      <Toaster position="top-right" />
      {loading ? (
        <Loader />
      ) : (
        <div className={`layout-container ${sidebarOpen ? "sidebar-open" : ""}`}>
          <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

          <div
            className={`teachers-container ${!sidebarOpen ? "sidebar-closed" : ""}`}
          >
            <div className="teachers-header">
              {(user?.role === "admin" || user?.role === "superAdmin") && (
                <button
                className="add-teacher-btn"
                onClick={() => navigate("/teachers/add")}
                >
                  <AddIcon />
                  نیااستاد شامل کریں

                </button>
              )}
              <h1 className="">تمام استاد</h1>
            </div>

            <div className="toolbar">
              <div className="toolbar-actions">
                <div className="search-box">
                  <SearchIcon className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search teachers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="dropdown-container">

                </div>
              </div>
            </div>

            {sortedTeachers?.length > 0 ? (
              <div className="teachers-table-container">
                <table className="teachers-table">
                  <thead>
                    <tr>
                      <th>کارروائیاں</th>
                      <th>استاد کی شناخت</th>
                      <th>عہدہ</th>
                      <th>فون نمبر</th>
                      <th>والد کا نام</th>
                      <th>پورا نام</th>
                      <th>سیریل نمبر</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTeachers?.map((teacher, index) => (
                      <tr key={teacher._id}>
                        <td>
                          <div className="table-actions">
                            <button
                              className="view-profile-btn"
                              onClick={() => handleViewProfile(teacher._id)}
                            >
                              View Profile
                            </button>
                            {(user.role === "admin" || user.role === "superAdmin") && (
                              <>
                                <div className="table-actions-buttons">
                                  <button
                                    className="action-btn edit"
                                    onClick={() => handleEditClick(teacher)}
                                  >
                                    <EditIcon />
                                  </button>
                                  <button
                                    className="action-btn delete"
                                    onClick={() => handleDeleteClick(teacher._id, teacher.jobDetails.teacherId)}
                                  >
                                    <DeleteIcon />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                        <td>{teacher.jobDetails?.teacherId}</td>
                        <td>{teacher.jobDetails?.designation}</td>
                        <td>{teacher.phoneNumber}</td>
                        <td>{teacher.fatherName}</td>
                        <td>{teacher.fullName}</td>
                        <td>{index + 1}</td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-teachers">
                <h1 className="no-teachers-text">کوئی استاد نہیں ہے</h1>
              </div>
            )}

            {isEditModalOpen && (
              <div className="modal-overlay">
                <div className="modal-container">
                  <div className="modal-header">
                    <h2>استاد کی معلومات کو تبدیل کریں</h2>
                    <button className="modal-close-btn" onClick={handleCloseModal}>
                      <FiX />
                    </button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="fullName">پورا نام</label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="jobDetails.designation">عہدہ</label>
                          <input
                            type="text"
                            id="jobDetails.designation"
                            name="jobDetails.designation"
                            value={formData.jobDetails.designation}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="emailAddress">ای میل</label>
                          <input
                            type="email"
                            id="emailAddress"
                            name="emailAddress"
                            value={formData.emailAddress}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="phoneNumber">فون نمبر</label>
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

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="nextOfKinPhoneNumber">قریبی رشتہ دار کا فون نمبر</label>
                          <input
                            type="tel"
                            id="nextOfKinPhoneNumber"
                            name="nextOfKinPhoneNumber"
                            value={formData.nextOfKinPhoneNumber}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="degreeTitle">تعلیم</label>
                          <input
                            type="text"
                            id="degreeTitle"
                            name="degreeTitle"
                            value={formData.degreeTitle}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="board">بورڈ</label>
                          <input
                            type="text"
                            id="board"
                            name="board"
                            value={formData.board}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="grade">گریڈ</label>
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
                          <label htmlFor="gender">جنس</label>
                          <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">جنس منتخب کریں</option>
                            <option value="Male">مرد</option>
                            <option value="Female">عورت</option>
                            <option value="Other">دیگر</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="dateOfBirth">تاریخ پیدائش</label>
                          <input
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={formData.dateOfBirth?.split('T')[0]}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="jobDetails.joiningDate">تاریخ تقرری</label>
                          <input
                            type="date"
                            id="jobDetails.joiningDate"
                            name="jobDetails.joiningDate"
                            value={formData.jobDetails.joiningDate?.split('T')[0]}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="maritalStatus">شادی شدہ حیثیت</label>
                          <select
                            id="maritalStatus"
                            name="maritalStatus"
                            value={formData.maritalStatus}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">حیثیت منتخب کریں</option>
                            <option value="Single">غیر شادی شدہ</option>
                            <option value="Married">شادی شدہ</option>
                            <option value="Divorced">طلاق یافتہ</option>
                            <option value="Widowed">بیوہ</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="jobDetails.workingHours">کام کے اوقات</label>
                          <input
                            type="number"
                            id="jobDetails.workingHours"
                            name="jobDetails.workingHours"
                            value={formData.jobDetails.workingHours}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="nic">شناختی کارڈ نمبر</label>
                          <input
                            type="text"
                            id="nic"
                            name="nic"
                            value={formData.nic}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="jobDetails.salary">تنخواہ</label>
                          <input
                            type="number"
                            id="jobDetails.salary"
                            name="jobDetails.salary"
                            value={formData.jobDetails.salary}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="fatherName">والد کا نام</label>
                        <input
                          type="text"
                          id="fatherName"
                          name="fatherName"
                          value={formData.fatherName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="fullAddress">مکمل پتہ</label>
                        <textarea
                          id="fullAddress"
                          name="fullAddress"
                          value={formData.fullAddress}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>پروفائل تصویر</label>
                        <div className="avatar-upload">
                          <div className="image-preview-container">
                            <img
                              src={formData.profileImage || '/default-avatar.png'}
                              alt={formData.fullName}
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
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'profileImage')}
                            style={{ display: 'none' }}
                            id="profileImage"
                          />
                          <label htmlFor="profileImage" className="upload-btn">
                            <FiUpload /> تصویر تبدیل کریں
                          </label>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>شناختی کارڈ کی تصاویر</label>
                        <div className="marksheet-upload">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'nicImage')}
                            style={{ display: 'none' }}
                            id="nicImage"
                          />
                          <label htmlFor="nicImage" className="upload-btn">
                            <FiUpload /> شناختی کارڈ کی تصویر اپ لوڈ کریں
                          </label>
                          <div className="marksheet-preview">
                            {formData.nicImage.map((url, index) => (
                              <div key={index} className="marksheet-image-container">
                                <img
                                  src={url}
                                  className="marksheet-preview-image"
                                  onClick={() => handleImageClick(url)}
                                  style={{ cursor: 'pointer' }}
                                />
                                <button
                                  type="button"
                                  className="remove-image-btn"
                                  onClick={() => handleRemoveImage('nicImage', index)}
                                >
                                  <FiX />
                                </button>
                              </div>
                            ))}
                          </div>
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
                            <FiUpload /> مارک شیٹ شامل کریں
                          </label>
                          <div className="marksheet-preview">
                            {formData.marksheetImages.map((url, index) => (
                              <div key={index} className="marksheet-image-container">
                                <img
                                  style={{
                                    objectFit: 'cover',
                                    width: '100%',
                                    height: '100%',
                                    cursor: 'pointer'
                                  }}
                                  src={url}
                                  alt={`Marksheet ${index + 1}`}
                                  onClick={() => handleImageClick(url)}
                                />
                                <button
                                  type="button"
                                  className="remove-image-btn"
                                  onClick={() => handleRemoveImage('marksheetImages', index)}
                                >
                                  <FiX />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="modal-footer">
                        <button
                          type="button"
                          className="cancel-btn"
                          onClick={handleCloseModal}
                        >
                          منسوخ کریں
                        </button>
                        <button type="submit" className="save-btn">
                          <FiSave /> تبدیلیاں محفوظ کریں
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {showImageViewer && (
              <ImageViewer
                imageUrl={selectedImage}
                onClose={() => setShowImageViewer(false)}
              />
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmation.show && (
              <div className="modal-overlay">
                <div className="delete-confirmation-modal">
                  <div className="modal-header">
                    <h2>حذف کرنے کی تصدیق</h2>
                    <button className="modal-close-btn" onClick={handleCancelDelete}>
                      <FiX />
                    </button>
                  </div>
                  <div className="modal-body">
                    <p>کیا آپ واقعی اس استاد کو حذف کرنا چاہتے ہیں؟ یہ عمل واپس نہیں کیا جا سکتا۔</p>
                  </div>
                  <div className="modal-footer">
                    <button className="cancel-btn" onClick={handleCancelDelete}>
                      منسوخ کریں
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(deleteConfirmation.teacherId, deleteConfirmation.teacherJobId)}
                    >
                      حذف کریں
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Teachers;
