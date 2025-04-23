import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BusinessIcon from "@mui/icons-material/Business";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DescriptionIcon from "@mui/icons-material/Description";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import useSidebar from "../../hooks/useSidebar";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import "./ClassProfile.css";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader/Loader";

const ClassProfile = () => {
  const { classes } = useSelector((state) => state.classes);
  const { id } = useParams();
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [isLoading, setIsLoading] = useState(true);
  const [classData, setClassData] = useState({});

  useEffect(() => {
    const classData = classes.find((cls) => cls._id === id);
    if (classData) {
      setClassData(classData);
    }
  }, [classes, id]);

  useEffect(() => {
    // Simulate API call to fetch class data
    const fetchClassData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await api.get(`/classes/${id}`);
        // setClassData(response.data);

        // Simulate loading delay
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching class data:", error);
        setIsLoading(false);
      }
    };

    fetchClassData();
  }, [id]);

  const handleEditClass = () => {
    // This function is just a placeholder
    console.log("Edit class clicked");
  };

  const handleDeleteClass = () => {
    // This function is just a placeholder
    console.log("Delete class clicked");
  };

  // Format date to a readable string
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className={`layout-container ${sidebarOpen ? "sidebar-open" : ""}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`class-profile-container ${
          !sidebarOpen ? "sidebar-closed" : ""
        }`}
      >
        {isLoading ? (
        <Loader />
        ) : (
          <>
            <div className="class-profile-header">
            <div className="class-profile-title">
                <h1>{classData.className}</h1>
                <div className="class-status" data-status="active">
                  Active
                </div>
              </div>
              <div className="back-button" onClick={() => navigate("/classes")}>
                <ArrowBackIcon /> Back to Classes
              </div>
              
             
            </div>

            <div className="">
              <div className="overview-section">
                <div className="class-info-card">
                  <h2>Class Information</h2>
                  <div className="class-info">
                    <div className="info-item">
                      <BusinessIcon className="info-icon" />
                      <span>Grade: {classData.grade}</span>
                    </div>
                    <div className="info-item">
                      <CalendarMonthIcon className="info-icon" />
                      <span>Start Date: {formatDate(classData.startDate)}</span>
                    </div>
                    <div className="info-item">
                      <CalendarMonthIcon className="info-icon" />
                      <span>End Date: {formatDate(classData.endDate)}</span>
                    </div>
                    <div className="info-item">
                      <DescriptionIcon className="info-icon" />
                      <span>Created: {formatDate(classData.createdAt)}</span>
                    </div>
                    <div className="info-item">
                      <DescriptionIcon className="info-icon" />
                      <span>Last Updated: {formatDate(classData.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="class-description-card">
                  <h2>Class Teachers</h2>
                  <div className="description">
                    {classData.classTeachers && classData.classTeachers.length > 0 ? (
                      <div className="teachers-list">
                        {classData.classTeachers.map((teacher, index) => (
                          <div key={index} className="teacher-item">
                            <PersonIcon className="teacher-icon" />
                            <div className="teacher-details">
                              <span className="teacher-id">Teacher ID: {teacher.teacherId}</span>
                              <span className="teacher-year">Year: {teacher.year}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No teachers assigned to this class.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClassProfile;
