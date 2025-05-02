import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/url";
import { Toaster, toast } from "sonner";
import Loader from "../../components/Loader/Loader";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import useSidebar from "../../hooks/useSidebar";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import "./MarkTeacherAttendance.css";

const MarkTeacherAttendance = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [currentTime, setCurrentTime] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [status, setStatus] = useState('present');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await api.get("teachers");
      setTeachers(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch teachers");
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherIdChange = (e) => {
    setTeacherId(e.target.value);
    setMessage('');
    setError('');
  };

  const handleTimeChange = (e) => {
    setCurrentTime(e.target.value);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    if (newStatus === 'absent') {
      setCurrentTime('');
    }
  };

  const handleSubmit = async () => {
    if (!teacherId.trim()) {
      setError('Please enter a teacher ID');
      toast.error('Please enter a teacher ID');
      return;
    }

    if (status !== 'absent' && !currentTime) {
      setError('Please enter a time');
      toast.error('Please enter a time');
      return;
    }

    try {
      setLoading(true);
      const attendanceData = {
        id: teacherId,
        status: status,
        date: selectedDate,
        time: status === 'absent' ? null : currentTime
      };

      const res = await api.post("attendance/teacher/mark", attendanceData);
      toast.success(res.data.message);
      setMessage(res.data.message);
      setTeacherId('');
      setCurrentTime('');
      setStatus('present');
    } catch (error) {
      toast.error("Failed to mark attendance");
      setError(error.response?.data?.message || "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={`layout-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Toaster position="top-right" />
      
      <div className={`mark-teacher-attendance ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <div className="attendance-header">
          <h1>استاد کی حاضری درج کریں</h1>
        </div>

        <div className="attendance-content">
          <div className="current-date">
            <CalendarMonthIcon className="date-icon" />
            <span>{formatDate(selectedDate)}</span>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="attendance-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="teacherId">
                  <PersonIcon className="form-icon" /> استاد کا آئی ڈی
                </label>
                <input
                  type="text"
                  id="teacherId"
                  value={teacherId}
                  onChange={handleTeacherIdChange}
                  placeholder="استاد کا آئی ڈی درج کریں"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">
                  <AccessTimeIcon className="form-icon" /> وقت
                </label>
                <input
                  type="time"
                  id="time"
                  value={currentTime}
                  onChange={handleTimeChange}
                  disabled={status === 'absent'}
                  required={status !== 'absent'}
                />
              </div>
            </div>

            <div className="status-selection">
              <h3>حالت منتخب کریں</h3>
              <div className="status-buttons">
                <button
                  type="button"
                  className={`status-btn present ${status === 'present' ? 'active' : ''}`}
                  onClick={() => handleStatusChange('present')}
                >
                  <CheckCircleIcon /> حاضر
                </button>
                <button
                  type="button"
                  className={`status-btn absent ${status === 'absent' ? 'active' : ''}`}
                  onClick={() => handleStatusChange('absent')}
                >
                  <CancelIcon /> غیر حاضر
                </button>
                <button
                  type="button"
                  className={`status-btn late ${status === 'late' ? 'active' : ''}`}
                  onClick={() => handleStatusChange('late')}
                >
                  <HelpOutlineIcon /> لیٹ
                </button>
              </div>
            </div>

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <div className="attendance-actions">
              <button 
                type="submit"
                className="submit-btn"
                disabled={!teacherId.trim() || (status !== 'absent' && !currentTime)}
              >
                <SaveIcon /> حاضری جمع کریں
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MarkTeacherAttendance;