import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import BusinessIcon from "@mui/icons-material/Business";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import CustomDropdown from "../../components/CustomDropdown/CustomDropdown";
import useSidebar from "../../hooks/useSidebar";
import "./Students.css";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../../utils/url";
import { toast, Toaster } from "sonner";
import Loader from "../../components/Loader/Loader";
import { FiSave, FiUpload, FiX } from "react-icons/fi";
import {
  deleteStudentStart,
  deleteStudentSuccess,
  updateStudentFailure,
  updateStudentStart,
  updateStudentSuccess,
} from "../../redux/slices/studentsSlice";

const Students = () => {
  const dispatch = useDispatch();
  const { students } = useSelector((state) => state.students);
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const { user } = useSelector((state) => state.user);
  const [sortBy, setSortBy] = useState("name");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    profileImage: "",
    dateOfBirth: "",
    phoneNumber: "",
    fullAddress: "",
    gender: "",
    nicImage: [],
    parentDetails: {
      fullName: "",
      nic: "",
      nicImage: [],
      phoneNumber: "",
      motherPhoneNumber: "",
      education: "",
      profession: "",
    },
    schoolDetails: {
      joiningDate: "",
      rollNumber: "",
      previousInstitute: "",
      previousDegreeWithImage: "",
    },
    grade: "",
  });
  const { classes } = useSelector((state) => state.classes);

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    studentId: null,
  });

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const genderOptions = [
    { value: "all", label: "تمام جنس", icon: <PersonIcon /> },
    { value: "Male", label: "مرد", icon: <PersonIcon /> },
    { value: "Female", label: "عورت", icon: <PersonIcon /> },
  ];

  const sortOptions = [
    { value: "name", label: "Student Name", icon: <ArrowUpwardIcon /> },
    { value: "grade", label: "Grade", icon: <ArrowUpwardIcon /> },
    { value: "rollNumber", label: "Roll Number", icon: <ArrowUpwardIcon /> },
  ];

  // Filter students based on search term and selected filters
  const filteredStudents = students?.filter((student) => {
    const matchesSearch =
      student.parentDetails.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parentDetails.nic
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.parentDetails.phoneNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.schoolDetails.rollNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesGrade =
      selectedGrade === "all" || student.grade == selectedGrade;
    const matchesGender =
      selectedGender === "all" || student.gender === selectedGender;

    return matchesSearch && matchesGrade && matchesGender;
  });

  // Sort students based on selected sort option
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.parentDetails.fullName.localeCompare(b.parentDetails.fullName);
      case "grade":
        return a.grade - b.grade;
      case "rollNumber":
        return a.schoolDetails.rollNumber.localeCompare(
          b.schoolDetails.rollNumber
        );
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
      fullName: student.fullName || "",
      profileImage: student.profileImage || "",
      dateOfBirth: student.dateOfBirth?.split("T")[0] || "",
      phoneNumber: student.phoneNumber || "",
      fullAddress: student.fullAddress || "",
      gender: student.gender || "",
      nicImage: student.nicImage || [],
      parentDetails: {
        fullName: student.parentDetails?.fullName || "",
        nic: student.parentDetails?.nic || "",
        nicImage: student.parentDetails?.nicImage || [],
        phoneNumber: student.parentDetails?.phoneNumber || "",
        motherPhoneNumber: student.parentDetails?.motherPhoneNumber || "",
        education: student.parentDetails?.education || "",
        profession: student.parentDetails?.profession || "",
      },
      schoolDetails: {
        joiningDate: student.schoolDetails?.joiningDate?.split("T")[0] || "",
        rollNumber: student.schoolDetails?.rollNumber || "",
        previousInstitute: student.schoolDetails?.previousInstitute || "",
        previousDegreeWithImage:
          student.schoolDetails?.previousDegreeWithImage || "",
      },
      grade: student.grade || "",
    });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingStudent(null);
    setFormData({
      fullName: "",
      profileImage: "",
      dateOfBirth: "",
      phoneNumber: "",
      fullAddress: "",
      gender: "",
      nicImage: [],
      parentDetails: {
        fullName: "",
        nic: "",
        nicImage: [],
        phoneNumber: "",
        motherPhoneNumber: "",
        education: "",
        profession: "",
      },
      schoolDetails: {
        joiningDate: "",
        rollNumber: "",
        previousInstitute: "",
        previousDegreeWithImage: "",
      },
      grade: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      dispatch(updateStudentStart());
      const response = await api.put(
        `students/update/${editingStudent._id}`,
        formData
      );
      console.log(response.data.data);
      if (response.status === 200) {
        toast.success("Student updated successfully");
        setLoading(false);
        dispatch(updateStudentSuccess(response.data.data));
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error updating student:", error);
      dispatch(updateStudentFailure());
      toast.error("Error updating student");
      setLoading(false);
    }
  };

  const handleDeleteClick = (studentId) => {
    setDeleteConfirmation({ show: true, studentId });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ show: false, studentId: null });
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      setLoading(true);
      dispatch(deleteStudentStart());
      const response = await api.delete(`students/delete/${studentId}`);
      if (response.status === 200) {
        dispatch(deleteStudentSuccess(studentId));
        toast.success("Student deleted successfully");
        setDeleteConfirmation({ show: false, studentId: null });
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      dispatch(deleteStudentFailure(error));
      toast.error("Error deleting student");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("image", file);
        const response = await api.post("uploads/img", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (fieldName === "profileImage") {
          setFormData((prev) => ({
            ...prev,
            profileImage: response.data.data,
          }));
        } else if (fieldName === "nicImage") {
          setFormData((prev) => ({
            ...prev,
            nicImage: [...(prev.nicImage || []), response.data.data],
          }));
        } else if (fieldName === "parentDetails.nicImage") {
          setFormData((prev) => ({
            ...prev,
            parentDetails: {
              ...prev.parentDetails,
              nicImage: [
                ...(prev.parentDetails.nicImage || []),
                response.data.data,
              ],
            },
          }));
        } else if (fieldName === "schoolDetails.previousDegreeWithImage") {
          setFormData((prev) => ({
            ...prev,
            schoolDetails: {
              ...prev.schoolDetails,
              previousDegreeWithImage: response.data.data,
            },
          }));
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Error uploading file");
      }
    }
  };

  const handleRemoveImage = (fieldName, index) => {
    if (fieldName === "nicImage" || fieldName === "parentDetails.nicImage") {
      if (fieldName.includes(".")) {
        const [parent, child] = fieldName.split(".");
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: prev[parent][child].filter((_, i) => i !== index),
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: prev[fieldName].filter((_, i) => i !== index),
        }));
      }
    } else {
      if (fieldName.includes(".")) {
        const [parent, child] = fieldName.split(".");
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: "",
          },
        }));
      } else {
        setFormData((prev) => ({ ...prev, [fieldName]: "" }));
      }
    }
  };

  const handleImageClick = (imageUrl) => {
    window.open(imageUrl, "_blank");
  };

  return (
    <>
      {loading && <Loader />}
      <Toaster position="top-right" />
      <div className={`layout-container ${sidebarOpen ? "sidebar-open" : ""}`}>
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <div
          className={`students-container ${
            !sidebarOpen ? "sidebar-closed" : ""
          }`}
        >
          <div className="students-header">
            {(user.role === "admin" || user.role === "superAdmin") && (
              <button
                className="add-student-btn"
                onClick={() => navigate("/students/add")}
              >
                <AddIcon /> نیا طالب علم شامل کریں
              </button>
            )}
            <h1>تمام طلباء</h1>
          </div>

          <div className="toolbar">
            <div className="toolbar-actions">
              <div className="search-box">
                <div className="search-input">
                  <SearchIcon className="search-icon" />
                  <input
                    type="text"
                    placeholder="طلباء تلاش کریں..."
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
                  options={[
                    { value: "all", label: "تمام گریڈ", icon: <BusinessIcon /> },
                    ...classes.map((cls) => ({
                      value: cls.grade,
                      label: cls.className + " " + "(" + cls.grade + ")",
                      icon: <BusinessIcon />,
                    }))
                  ]}
                />
                <CustomDropdown
                  compact
                  icon={<PersonIcon />}
                  label="جنس"
                  value={selectedGender}
                  onChange={(value) => setSelectedGender(value)}
                  options={genderOptions}
                />
              </div>
            </div>
          </div>

          {sortedStudents?.length > 0 ? (
            <div className="students-table-container">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>کارروائی</th>
                    <th>شناختی کارڈ نمبر</th>
                    <th>رابطہ نمبر</th>
                    <th>رول نمبر</th>
                    <th>والد کا نام</th>
                    <th>نام</th>
                    <th>گریڈ</th>
                    <th>سیریل نمبر</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStudents?.map((student, index) => (
                    <tr key={student._id}>
                      <td>
                        <div className="table-actions">
                          <button
                            className="view-profile-btn"
                            onClick={() => handleViewStudent(student._id)}
                          >
                            پروفائل دیکھیں
                          </button>
                          {(user.role === "admin" ||
                            user.role === "superAdmin") && (
                            <div className="table-actions-buttons">
                              <button
                                className="action-btn edit"
                                onClick={() => handleEditStudent(student)}
                              >
                                <EditIcon />
                              </button>
                              <button
                                className="action-btn delete"
                                onClick={() => handleDeleteClick(student._id)}
                              >
                                <DeleteIcon />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>{student.parentDetails?.nic}</td>
                      <td>{student.phoneNumber}</td>
                      <td>{student.schoolDetails?.rollNumber}</td>
                      <td>{student.parentDetails?.fullName}</td>
                      <td>{student.fullName}</td>
                      <td>
                        {student.grade +
                          " " +
                          classes.find((cls) => cls.grade === student.grade)
                            ?.className}
                      </td>
                      <td>{index + 1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-students">
              <h1 className="no-students-text">کوئی طالب علم نہیں ہے</h1>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteConfirmation.show && (
            <div className="modal-overlay">
              <div className="delete-confirmation-modal">
                <div className="modal-header">
                  <h2>حذف کرنے کی تصدیق</h2>
                  <button
                    className="modal-close-btn"
                    onClick={handleCancelDelete}
                  >
                    <FiX />
                  </button>
                </div>
                <div className="modal-body">
                  <p>
                    کیا آپ واقعی اس طالب علم کو حذف کرنا چاہتے ہیں؟ یہ عمل واپس
                    نہیں کیا جا سکتا۔
                  </p>
                </div>
                <div className="modal-footer">
                  <button className="cancel-btn" onClick={handleCancelDelete}>
                    منسوخ کریں
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDeleteStudent(deleteConfirmation.studentId)
                    }
                  >
                    حذف کریں
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Student Modal */}
          {isEditModalOpen && editingStudent && (
            <div className="modal-overlay">
              <div className="modal-container">
                <div className="modal-header">
                  <h2>طالب علم میں ترمیم کریں</h2>
                  <button className="close-btn" onClick={handleCloseModal}>
                    <CloseIcon />
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    {/* Student Personal Information Section */}
                    <div className="form-section">
                      <h3 className="section-title">ذاتی معلومات</h3>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="fullName">پورا نام</label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData?.fullName}
                            onChange={handleInputChange}
                            required
                            placeholder="طالب علم کا پورا نام درج کریں"
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
                            value={formData.dateOfBirth}
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

                      <div className="form-group">
                        <label htmlFor="fullAddress">مکمل پتہ</label>
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
                      <h3 className="section-title">دستاویزات</h3>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="profileImage">پروفائل تصویر</label>
                          <div className="avatar-upload">
                            <div className="image-preview-container">
                              <img
                                src={
                                  formData.profileImage || "/default-avatar.png"
                                }
                                alt="پروفائل"
                                className="avatar-preview"
                                onClick={() =>
                                  formData.profileImage &&
                                  handleImageClick(formData.profileImage)
                                }
                                style={{
                                  cursor: formData.profileImage
                                    ? "pointer"
                                    : "default",
                                }}
                              />
                              {formData.profileImage && (
                                <button
                                  type="button"
                                  className="remove-image-btn"
                                  onClick={() =>
                                    handleRemoveImage("profileImage")
                                  }
                                >
                                  <FiX />
                                </button>
                              )}
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleFileUpload(e, "profileImage")
                              }
                              style={{ display: "none" }}
                              id="profileImage"
                              name="profileImage"
                            />
                            <label
                              htmlFor="profileImage"
                              className="upload-btn"
                            >
                              <FiUpload /> تصویر تبدیل کریں
                            </label>
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="nicImage">
                            شناختی کارڈ کی تصاویر
                          </label>
                          <div className="avatar-upload">
                            <div className="multiple-images-main-container">
                              <div className="multiple-images-container">
                                {formData.nicImage.map((image, index) => (
                                  <div key={index} className="image-wrapper">
                                    <img
                                      src={image}
                                      alt={`NIC Image ${index + 1}`}
                                      onClick={() => handleImageClick(image)}
                                      style={{ cursor: "pointer" }}
                                    />
                                    <button
                                      type="button"
                                      className="remove-image-btn"
                                      onClick={() =>
                                        handleRemoveImage("nicImage", index)
                                      }
                                    >
                                      <FiX />
                                    </button>
                                  </div>
                                ))}
                                {formData.nicImage.length === 0 && (
                                  <div className="empty-state">
                                    <img
                                      src="/default-nic.png"
                                      alt="Default NIC"
                                      style={{ opacity: 0.5 }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, "nicImage")}
                              style={{ display: "none" }}
                              id="nicImage"
                              name="nicImage"
                            />
                            <label htmlFor="nicImage" className="upload-btn">
                              <FiUpload /> شناختی کارڈ کی تصویر اپ لوڈ کریں
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Parent Information Section */}
                    <div className="form-section">
                      <h3 className="section-title">والدین کی معلومات</h3>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="parentDetails.fullName">
                            والدین کا پورا نام
                          </label>
                          <input
                            type="text"
                            id="parentDetails.fullName"
                            name="parentDetails.fullName"
                            value={formData.parentDetails.fullName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="parentDetails.phoneNumber">
                            والد کا فون نمبر
                          </label>
                          <input
                            type="tel"
                            id="parentDetails.phoneNumber"
                            name="parentDetails.phoneNumber"
                            value={formData.parentDetails.phoneNumber}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="parentDetails.motherPhoneNumber">
                            والدہ کا فون نمبر
                          </label>
                          <input
                            type="tel"
                            id="parentDetails.motherPhoneNumber"
                            name="parentDetails.motherPhoneNumber"
                            value={formData.parentDetails.motherPhoneNumber}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="parentDetails.nic">
                            والدین کا شناختی کارڈ نمبر
                          </label>
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
                          <label htmlFor="parentDetails.education">
                            والدین کی تعلیم
                          </label>
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
                        <label htmlFor="parentDetails.profession">
                          والدین کا پیشہ
                        </label>
                        <input
                          type="text"
                          id="parentDetails.profession"
                          name="parentDetails.profession"
                          value={formData.parentDetails.profession}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>والدین کا شناختی کارڈ کی تصاویر</label>
                        <div className="avatar-upload">
                          <div className="multiple-images-main-container">
                            <div className="multiple-images-container">
                              {formData.parentDetails.nicImage.map(
                                (image, index) => (
                                  <div key={index} className="image-wrapper">
                                    <img
                                      src={image}
                                      alt={`Parent NIC Image ${index + 1}`}
                                      onClick={() => handleImageClick(image)}
                                      style={{ cursor: "pointer" }}
                                    />
                                    <button
                                      type="button"
                                      className="remove-image-btn"
                                      onClick={() =>
                                        handleRemoveImage(
                                          "parentDetails.nicImage",
                                          index
                                        )
                                      }
                                    >
                                      <FiX />
                                    </button>
                                  </div>
                                )
                              )}
                              {formData.parentDetails.nicImage.length === 0 && (
                                <div className="empty-state">
                                  <img
                                    src="/default-nic.png"
                                    alt="Default Parent NIC"
                                    style={{ opacity: 0.5 }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileUpload(e, "parentDetails.nicImage")
                            }
                            style={{ display: "none" }}
                            id="parentDetails.nicImage"
                            name="parentDetails.nicImage"
                          />
                          <label
                            htmlFor="parentDetails.nicImage"
                            className="upload-btn"
                          >
                            <FiUpload /> والدین کا شناختی کارڈ کی تصویر اپ لوڈ
                            کریں
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* School Information Section */}
                    <div className="form-section">
                      <h3 className="section-title">اسکول کی معلومات</h3>
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
                          <label htmlFor="schoolDetails.rollNumber">
                            رول نمبر
                          </label>
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
                          <label htmlFor="schoolDetails.joiningDate">
                            تاریخ داخلہ
                          </label>
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
                          <label htmlFor="schoolDetails.previousInstitute">
                            سابقہ ادارہ
                          </label>
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
                        <label htmlFor="schoolDetails.previousDegreeWithImage">
                          سابقہ ڈگری کی تصویر
                        </label>
                        <div className="avatar-upload">
                          <div className="image-preview-container">
                            <img
                              src={
                                formData.schoolDetails
                                  .previousDegreeWithImage ||
                                "/default-degree.png"
                              }
                              alt="سابقہ ڈگری"
                              className="avatar-preview"
                              onClick={() =>
                                formData.schoolDetails
                                  .previousDegreeWithImage &&
                                handleImageClick(
                                  formData.schoolDetails.previousDegreeWithImage
                                )
                              }
                              style={{
                                cursor: formData.schoolDetails
                                  .previousDegreeWithImage
                                  ? "pointer"
                                  : "default",
                              }}
                            />
                            {formData.schoolDetails.previousDegreeWithImage && (
                              <button
                                type="button"
                                className="remove-image-btn"
                                onClick={() =>
                                  handleRemoveImage(
                                    "schoolDetails.previousDegreeWithImage"
                                  )
                                }
                              >
                                <FiX />
                              </button>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileUpload(
                                e,
                                "schoolDetails.previousDegreeWithImage"
                              )
                            }
                            style={{ display: "none" }}
                            id="schoolDetails.previousDegreeWithImage"
                            name="schoolDetails.previousDegreeWithImage"
                          />
                          <label
                            htmlFor="schoolDetails.previousDegreeWithImage"
                            className="upload-btn"
                          >
                            <FiUpload /> ڈگری کی تصویر تبدیل کریں
                          </label>
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
                        {loading ? (
                          <span className="loading-spinner"></span>
                        ) : (
                          <>
                            <FiSave /> تبدیلیاں محفوظ کریں
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
      </div>
    </>
  );
};

export default Students;
