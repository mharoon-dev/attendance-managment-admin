import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import useSidebar from '../../hooks/useSidebar';
import './MarkAttendance.css';

const MarkAttendance = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [isLoading, setIsLoading] = useState(false);
  const [rollNumber, setRollNumber] = useState('');
  const [status, setStatus] = useState('present');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentTime, setCurrentTime] = useState('');
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Sample teacher ID (in a real app, this would come from authentication)
  const teacherId = 'teacher123';

  useEffect(() => {
    // Set current time
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}`);

    // Fetch today's attendance
    fetchTodayAttendance();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      // In a real app, this would be an API call to fetch today's attendance
      // const response = await fetch(`/api/attendance/today?date=${currentDate}`);
      // const data = await response.json();
      
      // For demo purposes, using sample data
      const sampleData = [
        { id: '101', status: 'present', date: currentDate, time: '09:15' },
        { id: '102', status: 'absent', date: currentDate, time: '09:20' },
        { id: '103', status: 'late', date: currentDate, time: '09:30' }
      ];
      
      setTodayAttendance(sampleData);
    } catch (error) {
      console.error('Error fetching today\'s attendance:', error);
      setError('Failed to fetch today\'s attendance');
    }
  };

  const handleRollNumberChange = (e) => {
    setRollNumber(e.target.value);
    setMessage('');
    setError('');
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
    
    setIsLoading(true);
    setMessage('');
    setError('');
    
    try {
      // In a real app, this would be an API call to mark attendance
      // const response = await fetch('/api/attendance/mark', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     id: rollNumber,
      //     status,
      //     date: currentDate,
      //     time: currentTime,
      //     teacherId
      //   }),
      // });
      
      // const data = await response.json();
      
      // Simulate API call delay
      setTimeout(() => {
        // Simulate successful response
        setMessage('Attendance marked successfully');
        setRollNumber('');
        
        // Add the new attendance to today's list
        setTodayAttendance([
          ...todayAttendance,
          { id: rollNumber, status, date: currentDate, time: currentTime }
        ]);
        
        setIsLoading(false);
      }, 1000);
      
      // If there was an error from the API:
      // if (!response.ok) {
      //   setError(data.message || 'Failed to mark attendance');
      //   setIsLoading(false);
      // }
    } catch (error) {
      console.error('Error marking attendance:', error);
      setError('Failed to mark attendance');
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

  return (
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
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
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
                  disabled={isLoading || !rollNumber.trim()}
                >
                  {isLoading ? (
                    <div className="loading-spinner" />
                  ) : (
                    <>
                      <SaveIcon /> Mark Attendance
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          <div className="form-section">
            <h2>Today's Attendance</h2>
            
            {todayAttendance.length > 0 ? (
              <div className="attendance-table-container">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Roll No.</th>
                      <th>Status</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayAttendance.map((attendance, index) => (
                      <tr key={index}>
                        <td>{attendance.id}</td>
                        <td className="status-cell">
                          {getStatusIcon(attendance.status)}
                          <span className="status-text">
                            {getStatusText(attendance.status)}
                          </span>
                        </td>
                        <td>{attendance.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-attendance">
                <p>No attendance marked yet for today</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance; 