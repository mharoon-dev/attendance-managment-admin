import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DownloadIcon from '@mui/icons-material/Download';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import useSidebar from '../../hooks/useSidebar';
import './ViewAttendance.css';

const ViewAttendance = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    date: '',
    grade: '',
    class: '',
    status: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0
  });

  // Sample data for dropdowns
  const grades = [
    { value: '1', label: 'Grade 1' },
    { value: '2', label: 'Grade 2' },
    { value: '3', label: 'Grade 3' },
    { value: '4', label: 'Grade 4' },
    { value: '5', label: 'Grade 5' }
  ];

  const classes = [
    { value: 'A', label: 'Class A' },
    { value: 'B', label: 'Class B' },
    { value: 'C', label: 'Class C' }
  ];

  const statuses = [
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' }
  ];

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, attendanceData]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      const sampleData = [
        {
          id: 1,
          name: 'John Doe',
          rollNo: '2024001',
          grade: '1',
          class: 'A',
          status: 'present',
          date: '2024-03-15',
          time: '09:00 AM'
        },
        // Add more sample data as needed
      ];
      setAttendanceData(sampleData);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...attendanceData];

    if (filters.date) {
      filtered = filtered.filter(item => item.date === filters.date);
    }
    if (filters.grade) {
      filtered = filtered.filter(item => item.grade === filters.grade);
    }
    if (filters.class) {
      filtered = filtered.filter(item => item.class === filters.class);
    }
    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.rollNo.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredData(filtered);
    updateStats(filtered);
  };

  const updateStats = (data) => {
    setStats({
      total: data.length,
      present: data.filter(item => item.status === 'present').length,
      absent: data.filter(item => item.status === 'absent').length,
      late: data.filter(item => item.status === 'late').length
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const resetFilters = () => {
    setFilters({
      date: '',
      grade: '',
      class: '',
      status: '',
      search: ''
    });
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Roll No', 'Grade', 'Class', 'Status', 'Date', 'Time'];
    const csvData = filteredData.map(item => [
      item.name,
      item.rollNo,
      item.grade,
      item.class,
      item.status,
      item.date,
      item.time
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`layout-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`view-attendance-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <div className="view-attendance-header">
     
          <h1>View Attendance</h1>
        </div>

        <div className="view-attendance-content">
          <div className="attendance-filters">
            <div className="filter-header">
              <h2>Filters</h2>
              <button className="filter-toggle-btn" onClick={toggleFilters}>
                <FilterListIcon /> {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
            
            {showFilters && (
              <div className="filter-row">
                <div className="filter-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                  />
                </div>
                
                <CustomDropdown
                  label="Grade"
                  options={grades}
                  value={filters.grade}
                  onChange={(value) => handleFilterChange('grade', value)}
                  placeholder="Select Grade"
                />
                
                <CustomDropdown
                  label="Class"
                  options={classes}
                  value={filters.class}
                  onChange={(value) => handleFilterChange('class', value)}
                  placeholder="Select Class"
                />
                
                <CustomDropdown
                  label="Status"
                  options={statuses}
                  value={filters.status}
                  onChange={(value) => handleFilterChange('status', value)}
                  placeholder="Select Status"
                />
                
                <div className="filter-group">
                  <label>Search</label>
                  <div className="search-input">
                    <SearchIcon />
                    <input
                      type="text"
                      placeholder="Search by name or roll number"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="filter-actions">
              <button className="reset-button" onClick={resetFilters}>
                Reset Filters
              </button>
              <button className="export-button" onClick={exportToCSV}>
                <DownloadIcon />
                Export to CSV
              </button>
            </div>
          </div>
          
          <div className="attendance-stats">
            <div className="stat-card total">
              <h3>Total</h3>
              <p>{stats.total}</p>
            </div>
            <div className="stat-card present">
              <CheckCircleIcon />
              <div>
                <h3>Present</h3>
                <p>{stats.present}</p>
              </div>
            </div>
            <div className="stat-card absent">
              <CancelIcon />
              <div>
                <h3>Absent</h3>
                <p>{stats.absent}</p>
              </div>
            </div>
            <div className="stat-card late">
              <HelpOutlineIcon />
              <div>
                <h3>Late</h3>
                <p>{stats.late}</p>
              </div>
            </div>
          </div>
          
          <div className="attendance-table-container">
            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : filteredData.length > 0 ? (
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Roll No</th>
                    <th>Grade</th>
                    <th>Class</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((record) => (
                    <tr key={record.id}>
                      <td>{record.name}</td>
                      <td>{record.rollNo}</td>
                      <td>Grade {record.grade}</td>
                      <td>Class {record.class}</td>
                      <td>
                        <span className={`status-badge ${record.status}`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td>{record.date}</td>
                      <td>{record.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-records">
                <p>No attendance records found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAttendance; 