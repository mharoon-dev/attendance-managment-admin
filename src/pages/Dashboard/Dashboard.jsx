import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Loader from "../../components/Loader/Loader";
import useSidebar from "../../hooks/useSidebar";
import "./Dashboard.css";
import { api } from "../../utils/url.js";
import { useDispatch, useSelector } from "react-redux";
import {
  getStudentsStart,
  getStudentsSuccess,
  getStudentsFailure,
} from "../../redux/slices/studentsSlice.jsx";
import {
  getTeachersStart,
  getTeachersSuccess,
  getTeachersFailure,
} from "../../redux/slices/teacherSlice.jsx";
import { getClassesFailure, getClassesStart, getClassesSuccess } from "../../redux/slices/classesSlice.jsx";
const Dashboard = () => {
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { students } = useSelector((state) => state.students);
  const { teachers } = useSelector((state) => state.teachers);
  const { classes } = useSelector((state) => state.classes);

  useEffect(() => {
    const fetchStudents = async () => {
      dispatch(getStudentsStart());
      try {
        const response = await api.get("students/get-all-students");
        console.log(response);
        dispatch(getStudentsSuccess(response.data.data));
      } catch (error) {
        dispatch(getStudentsFailure(error.response.data.message));
      }
    };

    const fetchTeachers = async () => {
      dispatch(getTeachersStart());
      try {
        const response = await api.get("teachers/get-all-teachers");
        dispatch(getTeachersSuccess(response.data.data));
      } catch (error) {
        dispatch(getTeachersFailure(error.response.data.message));
      }
    };

    const fetchClasses = async () => {
      dispatch(getClassesStart());
      try {
        const response = await api.get("classes/get-all-classes");
        dispatch(getClassesSuccess(response.data.data));
      } catch (error) {
        dispatch(getClassesFailure(error.response.data.message));
      }
    };



    fetchStudents();
    fetchTeachers();
    fetchClasses();
  }, []);

  // Sample data for dashboard
  const stats = [
    {
      id: 1,
      title: "Total Students",
      value: students?.length,
      // change: '+12%',
      // trend: 'up',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      color: "#3A86FF",
    },
    {
      id: 2,
      title: "Total Teachers",
      value: teachers?.length,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      color: "#FF006E",
    },
    {
      id: 3,
      title: "Total Classes",
      value: classes?.length,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      ),
      color: "#8338EC",
    },
    {
      id: 4,
      title: "Revenue",
      value: "$52,450",
      change: "-2%",
      trend: "down",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
      color: "#38B000",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      user: "John Doe",
      action: "registered as a new student",
      time: "5 minutes ago",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      user: "Sarah Smith",
      action: "submitted an assignment",
      time: "1 hour ago",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      user: "Michael Johnson",
      action: "updated their profile",
      time: "2 hours ago",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    },
    {
      id: 4,
      user: "Emily Davis",
      action: "joined Class 10-A",
      time: "3 hours ago",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    },
    {
      id: 5,
      user: "Robert Wilson",
      action: "paid tuition fees",
      time: "5 hours ago",
      avatar: "https://randomuser.me/api/portraits/men/89.jpg",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Annual Sports Day",
      date: "May 15, 2023",
      time: "9:00 AM",
      type: "event",
    },
    {
      id: 2,
      title: "Parent-Teacher Meeting",
      date: "May 18, 2023",
      time: "2:00 PM",
      type: "meeting",
    },
    {
      id: 3,
      title: "Science Exhibition",
      date: "May 22, 2023",
      time: "10:00 AM",
      type: "event",
    },
    {
      id: 4,
      title: "Mid-term Exams",
      date: "May 25, 2023",
      time: "9:00 AM",
      type: "exam",
    },
  ];

  return (
    <div className="dashboard-container">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className={`main-content ${sidebarOpen ? "" : "sidebar-closed"}`}>
        {loading ? (
          <Loader
            variant="ripple"
            color="#3A86FF"
            text="Loading dashboard..."
          />
        ) : (
          <>
            <div className="dashboard-header">
              <h1>Dashboard</h1>
              {/* <div className="date-filter">
                <button className="date-filter-button active">Today</button>
                <button className="date-filter-button">This Week</button>
                <button className="date-filter-button">This Month</button>
                <button className="date-filter-button">This Year</button>
              </div> */}
            </div>

            <div className="stats-grid">
              {stats.map((stat) => (
                <div key={stat.id} className="stat-card">
                  <div
                    className="stat-icon"
                    style={{
                      backgroundColor: `${stat.color}15`,
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-title">{stat.title}</h3>
                    <div className="stat-value-container">
                      <p className="stat-value">{stat.value}</p>
                      {/* <span className={`stat-change ${stat.trend}`}>
                        {stat.change}
                        {stat.trend === "up" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="12" y1="19" x2="12" y2="5"></line>
                            <polyline points="5 12 12 5 19 12"></polyline>
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <polyline points="19 12 12 19 5 12"></polyline>
                          </svg>
                        )}
                      </span> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card chart-card">
                <div className="card-header">
                  <h2>Student Enrollment</h2>
                  <div className="card-actions">
                    <button className="card-action-button">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="chart-container">
                  {/* Chart would go here - using placeholder for now */}
                  <div className="chart-placeholder">
                    <div className="chart-bar" style={{ height: "60%" }}></div>
                    <div className="chart-bar" style={{ height: "80%" }}></div>
                    <div className="chart-bar" style={{ height: "40%" }}></div>
                    <div className="chart-bar" style={{ height: "70%" }}></div>
                    <div className="chart-bar" style={{ height: "90%" }}></div>
                    <div className="chart-bar" style={{ height: "50%" }}></div>
                    <div className="chart-bar" style={{ height: "75%" }}></div>
                    <div className="chart-bar" style={{ height: "65%" }}></div>
                    <div className="chart-bar" style={{ height: "85%" }}></div>
                    <div className="chart-bar" style={{ height: "55%" }}></div>
                    <div className="chart-bar" style={{ height: "70%" }}></div>
                    <div className="chart-bar" style={{ height: "45%" }}></div>
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <span
                        className="legend-color"
                        style={{ backgroundColor: "#3A86FF" }}
                      ></span>
                      <span className="legend-label">2022</span>
                    </div>
                    <div className="legend-item">
                      <span
                        className="legend-color"
                        style={{ backgroundColor: "#FF006E" }}
                      ></span>
                      <span className="legend-label">2023</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dashboard-card activity-card">
                <div className="card-header">
                  <h2>Recent Activity</h2>
                  <button className="view-all-button">View All</button>
                </div>
                <div className="activity-list">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <img
                        src={activity.avatar}
                        alt={activity.user}
                        className="activity-avatar"
                      />
                      <div className="activity-content">
                        <p className="activity-text">
                          <span className="activity-user">{activity.user}</span>{" "}
                          {activity.action}
                        </p>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-card events-card">
                <div className="card-header">
                  <h2>Upcoming Events</h2>
                  <button className="view-all-button">View All</button>
                </div>
                <div className="events-list">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="event-item">
                      <div
                        className="event-icon"
                        style={{
                          backgroundColor:
                            event.type === "event"
                              ? "#3A86FF15"
                              : event.type === "meeting"
                              ? "#FF006E15"
                              : event.type === "exam"
                              ? "#8338EC15"
                              : "#38B00015",
                          color:
                            event.type === "event"
                              ? "#3A86FF"
                              : event.type === "meeting"
                              ? "#FF006E"
                              : event.type === "exam"
                              ? "#8338EC"
                              : "#38B000",
                        }}
                      >
                        {event.type === "event" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            ></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                        ) : event.type === "meeting" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                          </svg>
                        )}
                      </div>
                      <div className="event-content">
                        <h3 className="event-title">{event.title}</h3>
                        <div className="event-details">
                          <span className="event-date">{event.date}</span>
                          <span className="event-time">{event.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
