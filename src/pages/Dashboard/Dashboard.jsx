import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Loader from "../../components/Loader/Loader";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useSidebar from "../../hooks/useSidebar";
import "./Dashboard.css";
import { api } from "../../utils/url.js";
import { useDispatch, useSelector } from "react-redux";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';
import { Plus, Edit2, Trash2, Check, X } from 'react-feather';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend as ChartLegend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { addTodoSuccess, deleteTodoSuccess, getTodosFailure, getTodosStart, getTodosSuccess, updateTodoSuccess, } from "../../redux/slices/todoSlice.jsx";
import { FiX } from 'react-icons/fi';
import { toast, Toaster } from "sonner";


// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  ChartLegend
);

const Dashboard = () => {
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { students } = useSelector((state) => state.students);
  const { teachers } = useSelector((state) => state.teachers);
  const { classes } = useSelector((state) => state.classes);
  const { books } = useSelector((state) => state.library);
  const { dailyAttendance } = useSelector((state) => state.dailyAttendance);
  const { todos } = useSelector((state) => state.todos);
  const { user } = useSelector((state) => state.user);
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [editingTodo, setEditingTodo] = useState(null);
  const [attendanceByDay, setAttendanceByDay] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, todoId: null });

  // Set current month and year when component mounts
  useEffect(() => {
    const today = new Date();
    setCurrentMonth(today.getMonth() + 1); // getMonth() returns 0-11
    setCurrentYear(today.getFullYear());
  }, []);

  // Fetch attendance data when month or year changes
  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!currentMonth || !currentYear) return;

      try {
        setLoading(true);
        const response = await api.get(`attendance/students/get/month?month=${currentMonth}&year=${currentYear}`);
        dispatch({ type: 'SET_DAILY_ATTENDANCE', payload: response.data.data });
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [currentMonth, currentYear, dispatch]);

  // Calculate attendance statistics
  const attendanceStats = {
    total: dailyAttendance?.length || 0,
    present: dailyAttendance?.filter(record => record.status === 'present').length || 0,
    absent: dailyAttendance?.filter(record => record.status === 'absent').length || 0,
    late: dailyAttendance?.filter(record => record.status === 'late').length || 0
  };

  // Group attendance by day
  const getAttendanceByDay = () => {
    if (!dailyAttendance || !Array.isArray(dailyAttendance)) return [];

    // Create an object to store attendance by day
    const attendanceByDay = {};

    dailyAttendance.forEach(record => {
      if (!record || !record.date) return;

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

      if (record.status) {
        attendanceByDay[day][record.status]++;
        attendanceByDay[day].total++;
      }
    });

    // Convert to array and sort by day
    return Object.entries(attendanceByDay)
      .map(([day, stats]) => ({
        day: parseInt(day),
        ...stats
      }))
      .sort((a, b) => a.day - b.day);
  };

  useEffect(() => {
    const attendanceData = getAttendanceByDay();
    setAttendanceByDay(attendanceData);
    console.log("Raw Attendance Data:", dailyAttendance);
    console.log("Processed Attendance Data:", attendanceData);
    console.log("Current Month:", currentMonth);
    console.log("Current Year:", currentYear);
  }, [dailyAttendance, currentMonth, currentYear]);

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

  // Prepare data for Chart.js
  const chartData = {
    labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
    datasets: [
      {
        label: 'Present',
        data: Array.from({ length: daysInMonth }, (_, i) => {
          const dayData = attendanceByDay.find(d => d.day === i + 1);
          return dayData ? dayData.present : 0;
        }),
        backgroundColor: 'rgba(76, 175, 80, 0.8)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 1,
        stack: 'Stack 0',
      },
      {
        label: 'Absent',
        data: Array.from({ length: daysInMonth }, (_, i) => {
          const dayData = attendanceByDay.find(d => d.day === i + 1);
          return dayData ? dayData.absent : 0;
        }),
        backgroundColor: 'rgba(244, 67, 54, 0.8)',
        borderColor: 'rgba(244, 67, 54, 1)',
        borderWidth: 1,
        stack: 'Stack 0',
      },
      {
        label: 'Late',
        data: Array.from({ length: daysInMonth }, (_, i) => {
          const dayData = attendanceByDay.find(d => d.day === i + 1);
          return dayData ? dayData.late : 0;
        }),
        backgroundColor: 'rgba(255, 193, 7, 0.8)',
        borderColor: 'rgba(255, 193, 7, 1)',
        borderWidth: 1,
        stack: 'Stack 0',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: `طلباء کی حاضری - ${getMonthName(currentMonth)} ${currentYear}`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'مہینے کا دن',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'طلباء کی تعداد',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
    },
  };

  // Debug data
  useEffect(() => {
    console.log('Chart Data:', chartData);
    console.log('Attendance By Day:', attendanceByDay);
    console.log('Days in Month:', daysInMonth);
  }, [attendanceByDay, daysInMonth]);

  // Sample data for dashboard
  const stats = [
    {
      id: 1,
      title: "کل طلباء",
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
      title: "کل اساتذہ",
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
      title: "کل کلاسیں",
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
      title: "کل کتب",
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

  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("todos/add", newTodo);
      dispatch(addTodoSuccess(response.data.data));
      setNewTodo({ title: '', description: '' });
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleUpdateTodo = async (id, updatedData) => {
    try {
      const response = await api.put(`todos/update/${id}`, updatedData);
      dispatch(updateTodoSuccess(response.data.data));
      setEditingTodo(null);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmation({ show: true, todoId: id });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ show: false, todoId: null });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`todos/delete/${id}`);
      dispatch(deleteTodoSuccess(id));
      setDeleteConfirmation({ show: false, todoId: null });
      toast.success('Todo deleted successfully');
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error('Failed to delete todo');
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="dashboard">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
        <div className="dashboard-container">
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <div className={`main-content ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
            {loading ? (
              <Loader variant="ripple" color="#3A86FF" text="ڈیش بورڈ لوڈ ہو رہا ہے..." />
            ) : (
              <>
                <div className="dashboard-header">
                  <div className="date-display">
                    <span className="month-year">
                      {getMonthName(currentMonth)} {currentYear}
                    </span>
                  </div>
                  <h1>ڈیش بورڈ</h1>
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="dashboard-grid">
                  <div className="dashboard-card chart-card">
                    <div className="card-header">
                      <h2>طلباء کی حاضری - {getMonthName(currentMonth)} {currentYear}</h2>
                    </div>
                    <div className="chart-container">
                      <Bar data={chartData} options={chartOptions} />
                    </div>
                  </div>

                  <div className="dashboard-card activity-card">
                    <div className="card-header">
                      <h2>تقسیم کا جائزہ</h2>
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
                          {window.innerWidth > 768 && (
                            <Legend
                              layout="vertical"
                              align="right"
                              verticalAlign="middle"
                              wrapperStyle={{
                                paddingLeft: '20px'
                              }}
                            />
                          )}
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="todo-section">
                  <div className="todo-header">
                    <div className="todo-stats">
                      <span className="total-todos">کل: {todos?.length || 0}</span>
                      <span className="completed-todos">
                        مکمل: {todos?.filter(todo => todo.completed).length || 0}
                      </span>
                      <span className="pending-todos">
                        باقی: {todos?.filter(todo => !todo.completed).length || 0}
                      </span>
                    </div>
                    <h2>نوٹس فہرست</h2>
                  
                  </div>

                  <form onSubmit={handleAddTodo} className="todo-form">
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="نوٹس کا عنوان درج کریں"
                        value={newTodo.title}
                        onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="نوٹس کی تفصیل درج کریں"
                        value={newTodo.description}
                        onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                        required
                      />
                    </div>
                    <button type="submit" className="add-todo-button">
                      <Plus size={16} />
                      نوٹس شامل کریں
                    </button>
                  </form>

                  <div className="todo-list">
                    {todos?.map((todo) => (
                      <div key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                        {editingTodo?._id === todo._id ? (
                          <div className="edit-todo">
                            <div className="form-group">
                              <input
                                type="text"
                                value={editingTodo.title}
                                onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                                placeholder="عنوان میں ترمیم کریں"
                              />
                              <input
                                type="text"
                                value={editingTodo.description}
                                onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
                                placeholder="تفصیل میں ترمیم کریں"
                              />
                            </div>
                            <div className="button-group">
                              <button onClick={() => handleUpdateTodo(todo._id, editingTodo)} className="save-button">
                                <Check size={14} />
                                محفوظ کریں
                              </button>
                              <button onClick={() => setEditingTodo(null)} className="cancel-button">
                                <X size={14} />
                                منسوخ کریں
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="todo-content">
                              <div className="todo-info">
                                <h3>{todo.title}</h3>
                                <p>{todo.description}</p>
                              </div>
                              <div className="todo-actions">
                                <button
                                  onClick={() => setEditingTodo(todo)}
                                  className="edit-button"
                                  title="ترمیم"
                                >
                                  <EditIcon />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(todo._id)}
                                  className="delete-button"
                                  title="حذف کریں"
                                >
                                  <DeleteIcon />
                                </button>
                                <button
                                  onClick={() => handleUpdateTodo(todo._id, { ...todo, completed: !todo.completed })}
                                  className={`complete-button ${todo.completed ? 'completed' : ''}`}
                                  title={todo.completed ? 'نامکمل کریں' : 'مکمل کریں'}
                                >
                                  <Check size={14} />
                                </button>
                              </div>
                            </div>
                            <div className="todo-status">
                              <span className={`status-badge ${todo.completed ? 'completed' : 'pending'}`}>
                                {todo.completed ? 'مکمل' : 'باقی'}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Add Delete Confirmation Modal */}
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
                <p>کیا آپ واقعی اس نوٹس کو حذف کرنا چاہتے ہیں؟ یہ عمل واپس نہیں کیا جا سکتا۔</p>
              </div>
              <div className="modal-footer">
                <button className="cancel-btn" onClick={handleCancelDelete}>
                  منسوخ کریں
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(deleteConfirmation.todoId)}
                >
                  حذف کریں
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
