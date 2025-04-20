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
    nicImage: "",
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
          setFormData(prev => ({ ...prev, nicImage: response.data.data }));
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
    } else if (fieldName === 'nicImage') {
      setFormData(prev => ({ ...prev, nicImage: '' }));
    } else if (fieldName === 'marksheetImages' && index !== null) {
      setFormData(prev => ({
        ...prev,
        marksheetImages: prev.marksheetImages.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async(e) => {
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
        const deleteUser = await api.delete(`users/delete/${teacherJobId}`);
        dispatch(deleteTeacherSuccess(id));
        toast.success('Teacher deleted successfully');
      } else {
        dispatch(deleteTeacherFailure(res.data.message));
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      dispatch(deleteTeacherFailure(error.response.data.message));
    }
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
          <h1>Teachers</h1>
          <button
            className="add-teacher-btn"
            onClick={() => navigate("/teachers/add")}
          >
            <AddIcon />
            Add New Teacher
          </button>
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
              <CustomDropdown
                compact
                icon={<FilterListIcon />}
                label="Department"
                value={selectedDepartment}
                onChange={(value) => setSelectedDepartment(value)}
                options={departments}
              />
              <CustomDropdown
                compact
                icon={<FilterListIcon />}
                label="Status"
                value={selectedStatus}
                onChange={(value) => setSelectedStatus(value)}
                options={statuses}
              />
              <CustomDropdown
                compact
                icon={<ArrowUpwardIcon />}
                label="Sort By"
                value={sortBy}
                onChange={(value) => setSortBy(value)}
                options={[
                  { value: "name", label: "Name" },
                  { value: "designation", label: "Designation" },
                  { value: "joinDate", label: "Join Date" },
                ]}
              />
            </div>
          </div>
        </div>

       {sortedTeachers?.length > 0 ?  <div className="teachers-grid">
          {sortedTeachers?.map((teacher) => (
            <div key={teacher.id} className="teacher-card">
              <div className="teacher-card-header">
                <img
                  src={teacher.profileImage || "/assets/profile-avatar.jpg"}
                  alt={teacher.fullName}
                  className="teacher-avatar"
                />
                <div className="teacher-status" data-status={teacher.status}>
                  {teacher.status}
                </div>
              </div>

              <div className="teacher-card-body">
                <h3 className="teacher-name">{teacher.fullName}</h3>
                <p className="teacher-subject">
                  {teacher.jobDetails.designation}
                </p>

                <div className="teacher-info">
                  <div className="info-item">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <PhoneIcon />
                      <span>{teacher.phoneNumber}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div  
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <EmailIcon />
                      <span>{teacher.emailAddress}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <SchoolIcon />
                      <span>{teacher.degreeTitle}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <BadgeIcon />
                      <span>{teacher?.jobDetails?.teacherId}</span>
                    </div>
                  </div>
                </div>

              {/*    <div className="teacher-classes">
                  <h4>Classes</h4>
                  <div className="class-tags">
                   {teacher?.classes.map((className, index) => (
                            <span key={index} className="class-tag">
                              {className}
                            </span>
                          ))}
                  </div>
                </div>
                          */}
              </div>

              <div className="teacher-card-footer">
                <button
                  className="view-profile-btn"
                  onClick={() => handleViewProfile(teacher._id)}
                >
                  View Profile
                </button>
                <div className="quick-actions">
                  <button
                    className="action-btn edit"
                    onClick={() => handleEditClick(teacher)}
                  >
                    <EditIcon />
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(teacher._id, teacher.jobDetails.teacherId)}>
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            </div>
          )) }
        </div> 
          : 
          <div className="no-teachers">
              <h1 className="no-teachers-text">There is no teacher</h1>
            </div>
          }



        {isEditModalOpen && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2>Edit Teacher</h2>
                <button className="modal-close-btn" onClick={handleCloseModal}>
                  <FiX />
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fullName">Full Name</label>
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
                      <label htmlFor="jobDetails.designation">Designation</label>
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
                      <label htmlFor="emailAddress">Email</label>
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
                      <label htmlFor="phoneNumber">Phone</label>
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
                      <label htmlFor="nextOfKinPhoneNumber">Next of Kin Phone</label>
                      <input
                        type="tel"
                        id="nextOfKinPhoneNumber"
                        name="nextOfKinPhoneNumber"
                        value={formData.nextOfKinPhoneNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    {/* <div className="form-group">
                      <label htmlFor="jobDetails.teacherId">Teacher ID</label>
                      <input
                        type="text"
                        id="jobDetails.teacherId"
                        name="jobDetails.teacherId"
                        value={formData.jobDetails.teacherId}
                        onChange={handleInputChange}
                        required
                      />
                    </div> */}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="degreeTitle">Education</label>
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
                      <label htmlFor="board">Board</label>
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
                        value={formData.dateOfBirth?.split('T')[0]}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="jobDetails.joiningDate">Joining Date</label>
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
                      <label htmlFor="maritalStatus">Marital Status</label>
                      <select
                        id="maritalStatus"
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="jobDetails.workingHours">Working Hours</label>
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
                      <label htmlFor="nic">NIC Number</label>
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
                      <label htmlFor="jobDetails.salary">Salary</label>
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
                    <label htmlFor="fatherName">Father's Name</label>
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
                    <label htmlFor="fullAddress">Full Address</label>
                    <textarea
                      id="fullAddress"
                      name="fullAddress"
                      value={formData.fullAddress}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Profile Image</label>
                    <div className="avatar-upload">
                      <div className="image-preview-container">
                        <img
                          src={formData.profileImage || '/default-avatar.png'}
                          alt={formData.fullName}
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
                      />
                      <label htmlFor="profileImage" className="upload-btn">
                        <FiUpload /> Change Image
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>NIC Image</label>
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
                      />
                      <label htmlFor="nicImage" className="upload-btn">
                        <FiUpload /> Change NIC Image
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
                        <FiUpload /> Add Marksheet
                      </label>
                      <div className="marksheet-preview">
                        {formData.marksheetImages.map((url, index) => (
                          <div key={index} className="marksheet-image-container">
                            <img
                              style={{
                                objectFit: 'cover',
                                width: '100%',
                                height: '100%',
                              }}
                              src={url}
                              alt={`Marksheet ${index + 1}`}
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
                      Cancel
                    </button>
                    <button type="submit" className="save-btn">
                      <FiSave /> Save Changes
                    </button>
                  </div>
                </form>
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
