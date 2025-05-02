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
import { api } from '../../utils/url.js';
import { toast, Toaster } from 'sonner';

const MarkAttendance = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [isLoading, setIsLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const { user } = useSelector((state) => state.user);
  const [teacherId, setTeacherId] = useState('');

  useEffect(() => {
    setTeacherId(user?.teacher?.jobDetails?.teacherId);
    if (user?.teacher?.jobDetails?.teacherId) {
      fetchStudents();
    }
  }, [user]);

  const fetchStudents = async () => {
    try {
      const response = await api.get(`teachers/get-teacher-students/${user.teacher.jobDetails.teacherId}`);
      setStudents(response.data.data);
      // Initialize attendance data for each student
      const initialAttendanceData = {};
      response.data.forEach(student => {
        initialAttendanceData[student.rollNumber] = {
          status: 'present',
          time: ''
        };
      });
      setAttendanceData(initialAttendanceData);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error(error.response.data.message);
    }
  };

  const handleTimeChange = (rollNumber, time) => {
    setAttendanceData(prev => ({
      ...prev,
      [rollNumber]: {
        ...prev[rollNumber],
        time
      }
    }));
  };

  const handleStatusChange = (rollNumber, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [rollNumber]: {
        ...prev[rollNumber],
        status,
        time: status === 'absent' ? '' : prev[rollNumber]?.time
      }
    }));
  };

  const handleMarkAllAttendance = async () => {
    setIsLoading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const [rollNumber, data] of Object.entries(attendanceData)) {
      try {
        if (data.status !== 'absent' && !data.time) {
          toast.error(`Please enter time for student ${rollNumber}`);
          continue;
        }

        const response = await api.post('attendance/student/mark', {
          id: rollNumber,
          status: data.status,
          date: currentDate,
          time: data.status === 'absent' ? null : data.time,
          teacherId,
        });

        if (response.data.message === 'Attendance marked successfully' || 
            response.data.message === 'Attendance updated successfully') {
          successCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error(`Error marking attendance for ${rollNumber}:`, error);
        errorCount++;
      }
    }

    setIsLoading(false);
    if (successCount > 0) {
      toast.success(`Successfully marked attendance for ${successCount} students`);
    }
    if (errorCount > 0) {
      toast.error(`Failed to mark attendance for ${errorCount} students`);
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
      {isLoading && <Loader />}
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

            <div className="attendance-table-container">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Roll Number</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students?.map((student) => (
                    <tr key={student?.schoolDetails?.rollNumber}>
                      <td>{student?.fullName}</td>
                      <td>{student?.schoolDetails?.rollNumber}</td>
                      <td>
                        <input
                          type="time"
                          value={attendanceData[student?.schoolDetails?.rollNumber]?.time || ''}
                          onChange={(e) => handleTimeChange(student?.schoolDetails?.rollNumber, e.target.value)}
                          disabled={attendanceData[student?.schoolDetails?.rollNumber]?.status === 'absent'}
                          className="time-input"
                        />
                      </td>
                      <td>
                        <div className="status-buttons">
                          <button
                            type="button"
                            className={`status-btn present ${attendanceData[student?.schoolDetails?.rollNumber]?.status === 'present' ? 'active' : ''}`}
                            onClick={() => handleStatusChange(student?.schoolDetails?.rollNumber, 'present')}
                          >
                            <CheckCircleIcon /> Present
                          </button>
                          <button
                            type="button"
                            className={`status-btn absent ${attendanceData[student?.schoolDetails?.rollNumber]?.status === 'absent' ? 'active' : ''}`}
                            onClick={() => handleStatusChange(student?.schoolDetails?.rollNumber, 'absent')}
                          >
                            <CancelIcon /> Absent
                          </button>
                          <button
                            type="button"
                            className={`status-btn late ${attendanceData[student?.schoolDetails?.rollNumber]?.status === 'late' ? 'active' : ''}`}
                            onClick={() => handleStatusChange(student?.schoolDetails?.rollNumber, 'late')}
                          >
                            <HelpOutlineIcon /> Late
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="save-btn"
                onClick={handleMarkAllAttendance}
                disabled={isLoading || students.length === 0}
              >
                <SaveIcon /> Mark All Attendance
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarkAttendance;