import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { api } from "../../utils/url";
import { Toaster, toast } from "sonner";
import Loader from "../../components/Loader/Loader";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import useSidebar from "../../hooks/useSidebar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PersonIcon from "@mui/icons-material/Person";
import DownloadIcon from "@mui/icons-material/Download";
import "./ViewStudentAttendance.css";

const ViewStudentAttendance = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
  const [allAttendanceData, setAllAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(() => {
    return new Date().getFullYear();
  });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return String(new Date().getMonth() + 1).padStart(2, "0");
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [studentId, setStudentId] = useState("");
  const [isDateDisabled, setIsDateDisabled] = useState(false);
  const [isStudentIdDisabled, setIsStudentIdDisabled] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const { students } = useSelector((state) => state.students);

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    generateDateOptions();
  }, [selectedMonth, selectedYear, allAttendanceData]);

  useEffect(() => {
    if (!studentId.trim()) {
      setIsDateDisabled(false);
    }
  }, [studentId]);

  useEffect(() => {
    if (!selectedDate) {
      setIsStudentIdDisabled(false);
    }
  }, [selectedDate]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `attendance/students/get/month?month=${selectedMonth}&year=${selectedYear}`
      );
      let data = response.data.data || [];

      // Apply role-based filtering immediately after fetching
      if (user.role === "teacher") {
        data = data.filter(
          (record) => record.teacherId === user?.teacher?.jobDetails?.teacherId
        );
      }

      setAllAttendanceData(data);
      setFilteredData(data);
    } catch (error) {
      toast.error("Failed to fetch attendance data");
      setAllAttendanceData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const generateDateOptions = () => {
    const year = parseInt(selectedYear);
    const month = parseInt(selectedMonth);
    const daysInMonth = new Date(year, month, 0).getDate();
    const dates = Array.from({ length: daysInMonth }, (_, i) => {
      const day = String(i + 1).padStart(2, "0");
      return `${year}-${selectedMonth}-${day}`;
    });
    setAvailableDates(dates);
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
    setSelectedDate("");
    setStudentId("");
    setIsDateDisabled(false);
    setIsStudentIdDisabled(false);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setSelectedDate("");
    setStudentId("");
    setIsDateDisabled(false);
    setIsStudentIdDisabled(false);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setIsStudentIdDisabled(true);
    filterData(date, studentId);
  };

  const handleStudentIdChange = (e) => {
    const id = e.target.value;
    setStudentId(id);
    setIsDateDisabled(true);
    filterData(selectedDate, id);
  };

  const filterData = (date, id) => {
    let filtered = [...allAttendanceData];

    // Role-based filtering
    if (user.role === "teacher") {
      filtered = filtered.filter(
        (record) => record.teacherId === user?.teacher?.jobDetails?.teacherId
      );
    }

    if (date) {
      filtered = filtered.filter((record) => record.date === date);
    }

    if (id) {
      filtered = filtered.filter((record) => record.id === id);
    }

    setFilteredData(filtered);
  };

  const handleExport = () => {
    // Custom padding for each column type with increased width
    const padCells = {
      studentId: (value) => `${value}\t\t\t\t\t\t\t\t\t\t\t\t\t`,
      status: (value) => `${value}\t\t\t\t\t\t\t\t\t\t\t\t\t`,
      date: (value) => `${value}\t\t\t\t\t\t\t\t\t\t\t\t\t`,
      time: (value) => `${value}\t\t\t\t\t\t\t\t\t\t\t\t\t`,
      teacherId: (value) => `${value}\t\t\t\t\t\t\t\t\t\t\t\t\t`,
    };

    // Create CSV content with proper cell widths
    const headers = [
      padCells.studentId("Student ID"),
      padCells.status("Status"),
      padCells.date("Date"),
      padCells.time("Time"),
      padCells.teacherId("Teacher ID"),
    ];

    const csvContent = [
      headers.join(","),
      ...filteredData.map((record) => {
        // Format the date properly
        const formattedDate = record.date
          ? new Date(record.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
          : "N/A";

        return [
          padCells.studentId(record.id),
          padCells.status(record.status),
          padCells.date(formattedDate),
          padCells.time(record.time || "N/A"),
          padCells.teacherId(record.teacherId || "N/A"),
        ].join(",");
      }),
    ].join("\n");

    // Add BOM for Excel to properly recognize UTF-8
    const BOM = "\uFEFF";
    // Add style information for Excel
    const styleInfo = "sep=,\n";
    const blob = new Blob([BOM + styleInfo + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `student_attendance_${selectedYear}_${selectedMonth}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return <CheckCircleIcon className="status-icon present" />;
      case "absent":
        return <CancelIcon className="status-icon absent" />;
      case "late":
        return <HelpOutlineIcon className="status-icon late" />;
      default:
        return null;
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={`layout-container ${sidebarOpen ? "sidebar-open" : ""}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Toaster position="top-right" />

      <div
        className={`view-student-attendance ${
          !sidebarOpen ? "sidebar-closed" : ""
        }`}
      >
        <div className="attendance-header">
          <h1 style={{
            textAlign: "end",
            width: "100%",
          }}>طلباء کی حاضری دیکھیں</h1>
        </div>

        <div className="attendance-content">
          <div className="filters-container">
            <div className="filter-group">
              <label htmlFor="year">
                <CalendarMonthIcon className="filter-icon" /> سال منتخب کریں
              </label>
              <select
                id="year"
                value={selectedYear}
                onChange={handleYearChange}
                className="filter-input"
              >
                {Array.from({ length: 1 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="month">
                <CalendarMonthIcon className="filter-icon" /> مہینہ منتخب کریں
              </label>
              <select
                id="month"
                value={selectedMonth}
                onChange={handleMonthChange}
                className="filter-input"
              >
                <option value="01">جنوری</option>
                <option value="02">فروری</option>
                <option value="03">مارچ</option>
                <option value="04">اپریل</option>
                <option value="05">مئی</option>
                <option value="06">جون</option>
                <option value="07">جولائی</option>
                <option value="08">اگست</option>
                <option value="09">ستمبر</option>
                <option value="10">اکتوبر</option>
                <option value="11">نومبر</option>
                <option value="12">دسمبر</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="date">
                <CalendarMonthIcon className="filter-icon" /> تاریخ منتخب کریں
              </label>
              <select
                id="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="filter-input"
                disabled={isDateDisabled}
              >
                <option value="">تاریخ منتخب کریں</option>
                {availableDates.map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="studentId">
                <PersonIcon className="filter-icon" /> طالب علم کا آئی ڈی
              </label>
              <input
                type="text"
                id="studentId"
                value={studentId}
                onChange={handleStudentIdChange}
                className="filter-input"
                placeholder="طالب علم کا آئی ڈی درج کریں"
                disabled={isStudentIdDisabled}
              />
            </div>

            <button className="export-btn" onClick={handleExport}>
              <DownloadIcon /> ایکسل میں ایکسپورٹ کریں
            </button>
          </div>

          <div className="attendance-table-container">
            {filteredData.length > 0 ? (
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>استاد کا آئی ڈی</th>
                    <th>تاریخ</th>
                    <th>وقت</th>
                    <th>حالت</th>
                    <th> آئی ڈی</th>
                    <th> نام</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((record) => (
                    <tr key={record._id}>
                      <td>{record?.teacherId || "N/A"}</td>
                      <td>{record?.date || "N/A"}</td>
                      <td>{record?.time || "N/A"}</td>
                      <td>
                        <div className="status-cell">
                          {getStatusIcon(record.status)}
                          <span className={`status-text ${record.status}`}>
                            {record.status === "present"
                              ? "حاضر"
                              : record.status === "absent"
                              ? "غیر حاضر"
                              : "لیٹ"}
                          </span>
                        </div>
                      </td>
                      <td>{record.id}</td>
                      <td>
                        {
                          students.find(
                            (student) =>
                              student?.schoolDetails?.rollNumber === record?.id
                          )?.fullName
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data-message">
                کوئی حاضری کا ریکارڈ نہیں ملا
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStudentAttendance;
