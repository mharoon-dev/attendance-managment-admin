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
import RefreshIcon from '@mui/icons-material/Refresh';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import useSidebar from '../../hooks/useSidebar';
import { api } from '../../utils/url';
import './ViewAttendance.css';
import Loader from '../../components/Loader/Loader';
import { useSelector } from 'react-redux';

const ViewAttendance = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0],
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
  const {user} = useSelector((state) => state.user);
  console.log(user);

  // Sample data for dropdowns


  const statuses = [
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' }
  ];

  useEffect(() => {
    if (filters.date) {
      fetchAttendanceData();
    }
  }, [filters.date]);

  useEffect(() => {
    applyFilters();
  }, [filters, attendanceData]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`attendance/students/get?teacherId=${user.teacher.jobDetails.teacherId}&date=${filters.date}`);
      if (response.data.status) {
        setAttendanceData(response.data.data);
      }
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
    // Create Excel XML Header with column width specifications
    const excelHeader = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:x="urn:schemas-microsoft-com:office:excel"
xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
xmlns:html="http://www.w3.org/TR/REC-html40">
<Worksheet ss:Name="Sheet1">
<Table>
<Column ss:Width="120"/>
<Column ss:Width="120"/>
<Column ss:Width="120"/>
<Column ss:Width="120"/>
`;

    const headers = ['Roll No', 'Status', 'Date', 'Time'];
    const csvData = filteredData.map(item => {
      const formattedStatus = item.status.charAt(0).toUpperCase() + item.status.slice(1);
      const dateParts = item.date.split('-');
      const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      const formattedRollNo = `'${item.id}`;
      const formattedTime = item.time || '';
      
      return [
        formattedRollNo,
        formattedStatus,
        formattedDate,
        formattedTime
      ];
    });

    // Convert data to Excel XML format
    let xmlContent = excelHeader;
    
    // Add headers row
    xmlContent += '<Row>';
    headers.forEach(header => {
      xmlContent += `<Cell><Data ss:Type="String">${header}</Data></Cell>`;
    });
    xmlContent += '</Row>';

    // Add data rows
    csvData.forEach(row => {
      xmlContent += '<Row>';
      row.forEach(cell => {
        xmlContent += `<Cell><Data ss:Type="String">${cell}</Data></Cell>`;
      });
      xmlContent += '</Row>';
    });

    // Close XML tags
    xmlContent += '</Table></Worksheet></Workbook>';

    const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.xls`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`layout-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`view-attendance-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <div className="view-attendance-header">
          <h1>حاضری دیکھیں</h1>
          <button className="refresh-button" onClick={fetchAttendanceData}>
            <RefreshIcon /> ڈیٹا ریفریش کریں
          </button>
        </div>

        <div className="view-attendance-content">
          <div className="attendance-filters">
            <div className="filter-header">
              <h2>فلٹرز</h2>
              <button className="filter-toggle-btn" onClick={toggleFilters}>
                <FilterListIcon /> {showFilters ? 'فلٹرز چھپائیں' : 'فلٹرز دکھائیں'}
              </button>
            </div>
            
            {showFilters && (
              <div className="filter-row">
                <div className="filter-group">
                  <label>تاریخ</label>
                  <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                  />
                </div>
                
                <CustomDropdown
                  label="حالت"
                  options={statuses}
                  value={filters.status}
                  onChange={(value) => handleFilterChange('status', value)}
                  placeholder="حالت منتخب کریں"
                />
              </div>
            )}
            
            <div className="filter-actions">
              <button className="reset-button" onClick={resetFilters}>
                فلٹرز ری سیٹ کریں
              </button>
              <button className="export-button" onClick={exportToCSV}>
                <DownloadIcon />
                CSV میں ایکسپورٹ کریں
              </button>
            </div>
          </div>
          
          <div className="attendance-stats">
            <div className="stat-card total">
              <h3>کل</h3>
              <p>{stats.total}</p>
            </div>
            <div className="stat-card present">
              <CheckCircleIcon />
              <div>
                <h3>حاضر</h3>
                <p>{stats.present}</p>
              </div>
            </div>
            <div className="stat-card absent">
              <CancelIcon />
              <div>
                <h3>غیر حاضر</h3>
                <p>{stats.absent}</p>
              </div>
            </div>
            <div className="stat-card late">
              <HelpOutlineIcon />
              <div>
                <h3>لیٹ</h3>
                <p>{stats.late}</p>
              </div>
            </div>
          </div>
          
          <div className="attendance-table-container">
            {loading ? (
              <Loader />
            ) : filteredData.length > 0 ? (
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>رول نمبر</th>
                    <th>حالت</th>
                    <th>تاریخ</th>
                    <th>وقت</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((record) => (
                    <tr key={record?.id}>
                      <td>{record?.id}</td>
                      <td>
                        <span className={`status-badge ${record?.status}`}>
                          {record?.status === 'present' ? 'حاضر' : 
                           record?.status === 'absent' ? 'غیر حاضر' : 
                           'لیٹ'}
                        </span>
                      </td>
                      <td>{record?.date}</td>
                      <td>{record?.time || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-records">
                <p>کوئی حاضری کا ریکارڈ نہیں ملا</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAttendance; 