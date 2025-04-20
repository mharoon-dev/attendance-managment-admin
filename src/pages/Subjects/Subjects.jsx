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
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import CustomDropdown from "../../components/CustomDropdown/CustomDropdown";
import useSidebar from "../../hooks/useSidebar";
import "./Subjects.css";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSubjectFailure,
  deleteSubjectStart,
  deleteSubjectSuccess,
  updateSubjectFailure,
  updateSubjectStart,
  updateSubjectSuccess,
} from "../../redux/slices/subjectSlice";
import { toast, Toaster } from "sonner";
import { api } from "../../utils/url";
import Loader from "../../components/Loader/Loader";

const Subjects = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const dispatch = useDispatch();
  const { subjects } = useSelector((state) => state.subjects);
  const { classes } = useSelector((state) => state.classes);
  const { teachers } = useSelector((state) => state.teachers);
  const [formData, setFormData] = useState({
    subjectName: "",
    className: "",
    teacherName: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log(editingSubject);
  }, [editingSubject]);
  // Sample data for dropdown options

  const statuses = [
    { value: "all", label: "All Status", icon: <PersonIcon /> },
    { value: "active", label: "Active", icon: <PersonIcon /> },
    { value: "inactive", label: "Inactive", icon: <PersonIcon /> },
  ];

  const sortOptions = [
    { value: "name", label: "Subject Name", icon: <ArrowUpwardIcon /> },
    { value: "code", label: "Subject Code", icon: <ArrowUpwardIcon /> },
    { value: "grade", label: "Grade", icon: <ArrowUpwardIcon /> },
    { value: "teacher", label: "Teacher", icon: <ArrowUpwardIcon /> },
  ];

  // Filter subjects based on search term and selected filters
  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch = subject.subjectName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGrade =
      selectedGrade === "all" || subject.className === selectedGrade;

    return matchesSearch && matchesGrade;
  });

  // Sort subjects based on selected sort option
  const sortedSubjects = [...filteredSubjects].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.subjectName.localeCompare(b.subjectName);
      case "teacher":
        return a.teacherName.localeCompare(b.teacherName);
      default:
        return 0;
    }
  });

  const handleViewSubject = (subjectId) => {
    navigate(`/subjects/${subjectId}`);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setFormData({
      subjectName: subject.subjectName,
      className: subject.className,
      teacherName: subject.teacherName,
    });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingSubject(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGradeChange = (value) => {
    setSelectedGrade(value);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      dispatch(updateSubjectStart());
      const response = await api.put(
        `subjects/subjects/${editingSubject?._id}`,
        formData
      );
      dispatch(updateSubjectSuccess(response?.data?.data));
      console.log("success");
      toast.success("Subject updated successfully");
      setIsLoading(false);  
      handleCloseModal();
    } catch (error) {
      dispatch(updateSubjectFailure(error.response.data.message));
      console.error("Error updating subject:", error);
      setIsLoading(false);
      toast.error("Error updating subject");
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    dispatch(deleteSubjectStart());
    try {
      const response = await api.delete(`subjects/subjects/${subjectId}`);
      dispatch(deleteSubjectSuccess(subjectId));
      toast.success("Subject deleted successfully");
      setIsLoading(false);
    } catch (error) {
      dispatch(deleteSubjectFailure(error.response.data.message));
      toast.error("Error deleting subject");
      setIsLoading(false);
    }
  };

  // Create class options for dropdown
  const classOptions = [
    { value: "all", label: "All Classes", icon: <BadgeIcon /> },
    ...classes.map((cls) => ({
      value: cls.className,
      label: cls.className,
      icon: <BadgeIcon />,
    })),
  ];

  // Create teacher options for dropdown
  const teacherOptions = [
    { value: "all", label: "All Teachers", icon: <PersonIcon /> },
    ...teachers.map((teacher) => ({
      value: teacher.fullName,
      label: teacher.fullName,
      icon: <PersonIcon />,
    })),
  ];

  return (
    <>
      {isLoading && <Loader />}
      <Toaster position="top-right" />
      <div className={`layout-container ${sidebarOpen ? "sidebar-open" : ""}`}>
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <div
          className={`subjects-container ${
            !sidebarOpen ? "sidebar-closed" : ""
          }`}
        >
          <div className="subjects-header">
            <h1>All Subjects</h1>
            <button
              className="add-subject-btn"
              onClick={() => navigate("/subjects/add")}
            >
              <AddIcon /> Add New Subject
            </button>
          </div>

          <div className="toolbar">
            <div className="toolbar-actions">
              <div className="search-box">
                <div className="search-input">
                  <SearchIcon className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search subjects..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              <div className="dropdown-container">
                <CustomDropdown
                  options={classOptions}
                  value={selectedGrade}
                  onChange={handleGradeChange}
                  placeholder="Class"
                  icon={<BadgeIcon />}
                />

               
              </div>
            </div>
          </div>

          <div className="subjects-grid">
            {sortedSubjects.map((subject) => (
              <div key={subject._id} className="subject-card">
                <div className="subject-card-header">
                  <div className="subject-icon">
                    <MenuBookIcon />
                  </div>
                  <div className="subject-status" data-status={subject.status}>
                    {subject.status}
                  </div>
                </div>

                <div className="subject-card-body">
                  <h3 className="subject-name">{subject.subjectName}</h3>
                  <p className="subject-code">{subject.className}</p>

                  <div className="subject-info">
                    <div className="info-item">
                      <PersonIcon className="info-icon" />
                      <span>{subject.teacherName}</span>
                    </div>
                  </div>
                </div>

                <div className="subject-card-footer">
                  <div className="quick-actions">
                    <button
                      className="action-btn edit"
                      onClick={() => handleEditSubject(subject)}
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDeleteSubject(subject._id)}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Subject Modal */}
        {isEditModalOpen && editingSubject && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2>Edit Subject</h2>
                <button className="close-btn" onClick={handleCloseModal}>
                  <CloseIcon />
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="subjectName">Subject Name</label>
                      <input
                        type="text"
                        id="subjectName"
                        name="subjectName"
                        value={formData.subjectName}
                        onChange={handleInputChange}
                        placeholder="Enter subject name"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="className">Class</label>
                      <CustomDropdown
                        options={classOptions.filter((c) => c.value !== "all")}
                        value={formData.className}
                        onChange={(value) =>
                          setFormData({ ...formData, className: value })
                        }
                        placeholder="Select class"
                        icon={<BadgeIcon />}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="teacherName">Teacher</label>
                      <CustomDropdown
                        options={teacherOptions.filter(
                          (t) => t.value !== "all"
                        )}
                        value={formData.teacherName}
                        onChange={(value) =>
                          setFormData({ ...formData, teacherName: value })
                        }
                        placeholder="Select teacher"
                        icon={<PersonIcon />}
                      />
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
                    <button
                      type="submit"
                      className="save-btn"
                      disabled={isLoading}
                    >
                      <SaveIcon /> Save Changes
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

export default Subjects;
