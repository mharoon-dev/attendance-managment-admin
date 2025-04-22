import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import useSidebar from '../../hooks/useSidebar';
import './MarkAttendance.css';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader/Loader.jsx';
import {api} from '../../utils/url.js';
import { toast, Toaster } from 'sonner';

const MarkAttendance = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [isLoading, setIsLoading] = useState(false);
  const [rollNumber, setRollNumber] = useState('');
  const [status, setStatus] = useState('present');
  const [currentDate, setCurrentDate] = useState(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [currentTime, setCurrentTime] = useState('');
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const {user} = useSelector((state) => state.user);
  const [teacherId, setTeacherId] = useState('');
  console.log(user);

  useEffect(() => {
    setTeacherId(user?.teacher?.jobDetails?.teacherId);
  }, [user]);

  // useEffect(() => {
  //   // Set default time to current time
  //   const now = new Date();
  //   const hours = now.getHours().toString().padStart(2, '0');
  //   const minutes = now.getMinutes().toString().padStart(2, '0');
  //   setCurrentTime(`${hours}:${minutes}`);

  //   // Fetch today's attendance
  //   fetchTodayAttendance();
  // }, []);

  // const fetchTodayAttendance = async () => {
  //   try {
  //     const response = await fetch(`/api/attendance?date=${currentDate.toISOString().split('T')[0]}`);
  //     const data = await response.json();
  //     setTodayAttendance(data);
  //   } catch (error) {
  //     console.error('Error fetching today\'s attendance:', error);
  //     setError('Failed to fetch today\'s attendance');
  //   }
  // };

  const handleRollNumberChange = (e) => {
    setRollNumber(e.target.value);
    setMessage('');
    setError('');
  };

  const handleTimeChange = (e) => {
    setCurrentTime(e.target.value);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rollNumber.trim()) {
      setError('Please enter a roll number');
      return;
    }

    if (!currentTime) {
      setError('Please enter a time');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    setError('');
    
    try {
      const response = await api.post('attendance/student/mark', {
          id: rollNumber,
          status,
          date: currentDate,
          time: currentTime,
          teacherId,
        });
      
      
      if (response.data.message === 'Attendance marked successfully') {
        setMessage('Attendance marked successfully');
        toast.success(response.data.message);
        setRollNumber('');
        setCurrentTime('');
        setStatus('present');
        setIsLoading(false);
      } else {
        setError(response.data.message);
        console.log(response.data.message);
        setIsLoading(false);
        toast.error(response.data.message);
        return;
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      setError(error.response.data.message || 'Failed to mark attendance');
      toast.error(error.response.data.message || 'Failed to mark attendance');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircleIcon className="status-icon present" />;
      case 'absent':
        return <CancelIcon className="status-icon absent" />;
      case 'late':
        return <HelpOutlineIcon className="status-icon late" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
    <Toaster position="top-right" />
    {isLoading && <Loader/>}
    <div className={`layout-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`mark-attendance-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <div className="mark-attendance-header">
          <button className="back-button" onClick={() => navigate('/attendance')}>
            <ArrowBackIcon /> Back to Attendance
          </button>
          <h1>Mark Attendance</h1>
        </div>

        <div className="mark-attendance-content">
          <div className="current-date">
            <CalendarMonthIcon className="date-icon" />
            <span>{formatDate(currentDate)}</span>
          </div>

          <form onSubmit={handleSubmit} className="mark-attendance-form">
            <div className="form-section">
              <h2>Mark Student Attendance</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rollNumber">
                    <PersonIcon className="form-icon" /> Roll Number
                  </label>
                  <input
                    type="text"
                    id="rollNumber"
                    value={rollNumber}
                    onChange={handleRollNumberChange}
                    placeholder="Enter student roll number"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="time">
                    <AccessTimeIcon className="form-icon" /> Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    value={currentTime}
                    onChange={handleTimeChange}
                    required
                  />
                </div>
              </div>

              <div className="status-selection">
                <h3>Select Status</h3>
                <div className="status-buttons">
                  <button
                    type="button"
                    className={`status-btn present ${status === 'present' ? 'active' : ''}`}
                    onClick={() => handleStatusChange('present')}
                  >
                    <CheckCircleIcon /> Present
                  </button>
                  <button
                    type="button"
                    className={`status-btn absent ${status === 'absent' ? 'active' : ''}`}
                    onClick={() => handleStatusChange('absent')}
                  >
                    <CancelIcon /> Absent
                  </button>
                  <button
                    type="button"
                    className={`status-btn late ${status === 'late' ? 'active' : ''}`}
                    onClick={() => handleStatusChange('late')}
                  >
                    <HelpOutlineIcon /> Late
                  </button>
                </div>
              </div>

              {message && <div className="success-message">{message}</div>}
              {error && <div className="error-message">{error}</div>}

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={isLoading || !rollNumber.trim() || !currentTime}
                >
                    <>
                      <SaveIcon /> Mark Attendance
                    </>
                </button>
              </div>
                <br />
            </div>
          </form>

   
        </div>
      </div>
    </div></>
  );
};

export default MarkAttendance;