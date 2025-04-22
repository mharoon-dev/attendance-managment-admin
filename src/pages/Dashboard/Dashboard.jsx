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
import {
  getClassesFailure,
  getClassesStart,
  getClassesSuccess,
} from "../../redux/slices/classesSlice.jsx";
import {
  getBooksFailure,
  getBooksStart,
  getBooksSuccess,
} from "../../redux/slices/librarySlice.jsx";
import {
  getSubjectsFailure,
  getSubjectsStart,
  getSubjectsSuccess,
} from "../../redux/slices/subjectSlice.jsx";
import {
  getDailyAttendanceStart,
  getDailyAttendanceSuccess,
  getDailyAttendanceFailure,
} from "../../redux/slices/dailyAttendanceSlice.jsx";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';

const Dashboard = () => {
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { students } = useSelector((state) => state.students);
  const { teachers } = useSelector((state) => state.teachers);
  const { classes } = useSelector((state) => state.classes);
  const { books } = useSelector((state) => state.library);
  const { dailyAttendance } = useSelector((state) => state.dailyAttendance);
  const { user } = useSelector((state) => state.user);
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Set current month and year
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    setCurrentMonth(month);
    setCurrentYear(year);

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

    const fetchBooks = async () => {
      dispatch(getBooksStart());
      try {
        const response = await api.get("library/books");
        dispatch(getBooksSuccess(response.data.data));
      } catch (error) {
        dispatch(getBooksFailure(error.response.data.message));
      }
    };

    const fetchSubjects = async () => {
      dispatch(getSubjectsStart());
      try {
        const response = await api.get("subjects/subjects");
        dispatch(getSubjectsSuccess(response.data.data));
      } catch (error) {
        dispatch(getSubjectsFailure(error.response.data.message));
      }
    };

    const fetchMonthlyAttendance = async () => {
      dispatch(getDailyAttendanceStart());
      try {
        const response = await api.get(`attendance/students/get/month?month=${month}&year=${year}`);
        dispatch(getDailyAttendanceSuccess(response.data.data));
      } catch (error) {
        dispatch(getDailyAttendanceFailure(error.response.data.message));
      }
    };

    fetchStudents();
    fetchTeachers();
    fetchClasses();
    fetchBooks();
    fetchSubjects();
    fetchMonthlyAttendance();
  }, []);

  // Calculate attendance statistics
  const attendanceStats = {
    total: dailyAttendance?.length || 0,
    present: dailyAttendance?.filter(record => record.status === 'present').length || 0,
    absent: dailyAttendance?.filter(record => record.status === 'absent').length || 0,
    late: dailyAttendance?.filter(record => record.status === 'late').length || 0
  };

  // Group attendance by day
  const getAttendanceByDay = () => {
    if (!dailyAttendance) return [];
    
    // Create an object to store attendance by day
    const attendanceByDay = {};
    
    dailyAttendance.forEach(record => {
      const date = new Date(record.date);
      const day = date.getDate();
      
      if (!attendanceByDay[day]) {
        attendanceByDay[day] = {
          present: 0,
          absent: 0,
          late: 0,
          total: 0
        };
      }
      
      attendanceByDay[day][record.status]++;
      attendanceByDay[day].total++;
    });

    // Convert to array and sort by day
    return Object.entries(attendanceByDay)
      .map(([day, stats]) => ({
        day: parseInt(day),
        ...stats
      }))
      .sort((a, b) => a.day - b.day);
  };

  const attendanceByDay = getAttendanceByDay();

  // Get days in current month
  const getDaysInMonth = () => {
    const year = parseInt(currentYear);
    const month = parseInt(currentMonth);
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth();

  // Format month name
  const getMonthName = (month) => {
    const date = new Date();
    date.setMonth(month - 1);
    return date.toLocaleString('default', { month: 'long' });
  };

  // Calculate totals for the circular progress
  const calculateTotalPercentage = (value, total) => {
    return Math.round((value / total) * 100);
  };

  const totalItems = students?.length + teachers?.length + classes?.length + books?.length;
  const studentPercentage = calculateTotalPercentage(students?.length || 0, totalItems);
  const teacherPercentage = calculateTotalPercentage(teachers?.length || 0, totalItems);
  const classPercentage = calculateTotalPercentage(classes?.length || 0, totalItems);
  const bookPercentage = calculateTotalPercentage(books?.length || 0, totalItems);

  // Prepare data for pie chart
  const pieChartData = [
    { name: 'Students', value: students?.length || 0, color: '#3A86FF' },
    { name: 'Teachers', value: teachers?.length || 0, color: '#FF006E' },
    { name: 'Classes', value: classes?.length || 0, color: '#8338EC' },
    { name: 'Books', value: books?.length || 0, color: '#38B000' }
  ];

  // Sample data for dashboard
  const stats = [
    {
      id: 1,
      title: "Total Students",
      value: students?.length,
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
      title: "Total Books",
      value: books?.length,
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
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
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

  // Custom active shape renderer
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill={fill} style={{ fontSize: '16px', fontWeight: 'bold' }}>
          {payload.name}
        </text>
        <text x={cx} y={cy} dy={0} textAnchor="middle" fill={fill} style={{ fontSize: '14px' }}>
          {`${value} items`}
        </text>
        <text x={cx} y={cy} dy={20} textAnchor="middle" fill={fill} style={{ fontSize: '14px' }}>
          {`(${(percent * 100).toFixed(1)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: `2px solid ${payload[0].payload.color}`
        }}>
          <p style={{ margin: '0', color: payload[0].payload.color, fontWeight: 'bold' }}>
            {payload[0].name}
          </p>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            Count: {payload[0].value}
          </p>
       
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-container">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className={`main-content ${sidebarOpen ? "" : "sidebar-closed"}`}>
        {loading ? (
          <Loader variant="ripple" color="#3A86FF" text="Loading dashboard..." />
        ) : (
          <>
            <div className="dashboard-header">
              <h1>Dashboard</h1>
              <div className="date-display">
                <span className="month-year">
                  {getMonthName(currentMonth)} {currentYear}
                </span>
              </div>
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
                  <h2 id="chart-title">Student Attendance - {getMonthName(currentMonth)} {currentYear}</h2>
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
                  <div className="chart-placeholder">
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                      const dayData = attendanceByDay.find(d => d.day === day) || { present: 0, absent: 0, late: 0, total: 0 };
                      const maxHeight = Math.max(dayData.present, dayData.absent, dayData.late, 1);
                      
                      return (
                        <div key={day} className="chart-day">
                          <div className="chart-bars">
                            {dayData.present > 0 && (
                              <div 
                                className="chart-bar present" 
                                style={{ 
                                  height: `${(dayData.present / maxHeight) * 200}px`
                                }}
                              />
                            )}
                            {dayData.absent > 0 && (
                              <div 
                                className="chart-bar absent" 
                                style={{ 
                                  height: `${(dayData.absent / maxHeight) * 200}px`
                                }}
                              />
                            )}
                            {dayData.late > 0 && (
                              <div 
                                className="chart-bar late" 
                                style={{ 
                                  height: `${(dayData.late / maxHeight) * 200}px`
                                }}
                              />
                            )}
                          </div>
                          <span className="chart-day-label">{day}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="chart-legend">
                  
               
                  </div>
                </div>
              </div>

              <div className="dashboard-card activity-card">
                <div className="card-header">
                  <h2>Distribution Overview</h2>
                </div>
                <div className="pie-chart-container">
                  <ResponsiveContainer width="100%" height={290}>
                    <PieChart>
                      <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                        animationBegin={0}
                        animationDuration={1000}
                        animationEasing="ease-out"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        layout="vertical" 
                        align="right" 
                        verticalAlign="middle"
                        wrapperStyle={{
                          paddingLeft: '20px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
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
