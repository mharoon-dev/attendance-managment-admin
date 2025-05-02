import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Teachers from "./pages/Teachers/Teachers.jsx";
import TeacherProfile from "./pages/Teachers/TeacherProfile.jsx";
import AddTeacher from "./pages/Teachers/AddTeacher.jsx";
import Login from "./pages/Login/Login.jsx";
import Classes from "./pages/Classes/Classes.jsx";
import AddClass from "./pages/Classes/AddClass.jsx";
import ClassProfile from "./pages/Classes/ClassProfile.jsx";
import Students from "./pages/Students/Students.jsx";
import StudentProfile from "./pages/Students/StudentProfile.jsx";
import AddStudent from "./pages/Students/AddStudent.jsx";
import Library from "./pages/Library/Library.jsx";
import AddBook from "./pages/Library/AddBook.jsx";
import Subjects from "./pages/Subjects/Subjects.jsx";
import SubjectProfile from "./pages/Subjects/SubjectProfile.jsx";
import AddSubject from "./pages/Subjects/AddSubject.jsx";
import MarkAttendance from "./pages/Attendance/MarkAttendance.jsx";
import ViewAttendance from "./pages/Attendance/ViewAttendance.jsx";
import MarkTeacherAttendance from "./pages/Attendance/MarkTeacherAttendance.jsx";
import ViewTeacherAttendance from "./pages/Attendance/ViewTeacherAttendance.jsx";
import ViewStudentAttendance from "./pages/Attendance/ViewStudentAttendance.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import { useDispatch, useSelector } from "react-redux";
import { loginFailure, loginSuccess } from "./redux/slices/userSlice.jsx";
import { api } from "./utils/url.js";
import Loader from "./components/Loader/Loader.jsx";
import Finance from "./pages/Finance/Finance.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import {
  getStudentsStart,
  getStudentsSuccess,
  getStudentsFailure,
} from "./redux/slices/studentsSlice.jsx";
import {
  getTeachersStart,
  getTeachersSuccess,
  getTeachersFailure,
} from "./redux/slices/teacherSlice.jsx";
import {
  getClassesFailure,
  getClassesStart,
  getClassesSuccess,
} from "./redux/slices/classesSlice.jsx";
import {
  getBooksFailure,
  getBooksStart,
  getBooksSuccess,
} from "./redux/slices/librarySlice.jsx";
import useSidebar from "./hooks/useSidebar";
import {
  getDailyAttendanceStart,
  getDailyAttendanceSuccess,
  getDailyAttendanceFailure,
} from "./redux/slices/dailyAttendanceSlice.jsx";
import { getTodosFailure, getTodosStart, getTodosSuccess } from "./redux/slices/todoSlice.jsx";
import { getSubjectsFailure, getSubjectsStart, getSubjectsSuccess } from "./redux/slices/subjectSlice.jsx";
function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));

    const isAuthenticated = async () => {
      try {
        const response = await api.get("auth/isuserloggedin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);

        if (isAuthenticated) {
          dispatch(loginSuccess(response?.data?.data));
          setLoading(false);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        dispatch(loginFailure(error?.response?.data?.message));
        setLoading(false);
      }
    };
    isAuthenticated();
  }, []);


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
        console.log('Attendance API Response:', response.data);
        
        if (response.data && response.data.data) {
          // Ensure the data is in the correct format
          const formattedData = response.data.data.map(record => ({
            ...record,
            date: record.date || new Date().toISOString().split('T')[0],
            status: record.status || 'absent'
          }));
          
          dispatch(getDailyAttendanceSuccess(formattedData));
        } else {
          console.error('Invalid attendance data format:', response.data);
          dispatch(getDailyAttendanceFailure('Invalid attendance data format'));
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
        dispatch(getDailyAttendanceFailure(error.response?.data?.message || 'Failed to fetch attendance data'));
      }
    };

    const fetchTodos = async () => {
      dispatch(getTodosStart());
      try {
        const response = await api.get("todos");
        dispatch(getTodosSuccess(response.data.data));
      } catch (error) {
        dispatch(getTodosFailure(error.response.data.message));
      }
    };

    fetchStudents();
    fetchTeachers();
    fetchClasses();
    fetchBooks();
    fetchSubjects();
    fetchMonthlyAttendance();
    fetchTodos();
  }, []);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={user !== null ? <Dashboard /> : <Navigate to="/login" />}
            />
            
            {/* Teachers Routes */}
            <Route path="/teachers" element={<Teachers />} />
            {(user?.role === "admin" || user?.role === "superAdmin") && (
              <Route path="/teachers/add" element={<AddTeacher />} />
            )}
            <Route path="/teachers/:id" element={<TeacherProfile />} />
            
            {/* Classes Routes */}
            <Route path="/classes" element={<Classes />} />
            {(user?.role === "admin" || user?.role === "superAdmin") && (
              <Route path="/classes/add" element={<AddClass />} />
            )}
            <Route path="/classes/:id" element={<ClassProfile />} />
            
            {/* Students Routes */}
            <Route path="/students" element={<Students />} />
            {(user?.role === "admin" || user?.role === "superAdmin") && (
              <Route path="/students/add" element={<AddStudent />} />
            )}
            <Route path="/students/:id" element={<StudentProfile />} />
            
            {/* Library Routes */}
            <Route path="/library" element={<Library />} />
            {(user?.role === "admin" || user?.role === "superAdmin") && (
              <Route path="/library/add" element={<AddBook />} />
            )}
            
            {/* Subjects Routes */}
            <Route path="/subjects" element={<Subjects />} />
            {(user?.role === "admin" || user?.role === "superAdmin") && (
              <Route path="/subjects/add" element={<AddSubject />} />
            )}
            <Route path="/subjects/:id" element={<SubjectProfile />} />
            
            {/* Attendance Routes */}
            {user?.role === "teacher" && (
              <Route path="/attendance/mark" element={<MarkAttendance />} />
            )}
            {user?.role === "teacher" && (
              <Route path="/attendance" element={<ViewAttendance />} />
            )}
            {(user?.role === "admin" || user?.role === "superAdmin") && (
              <Route
                path="/attendance/teacher/mark"
                element={<MarkTeacherAttendance />}
              />
            )}
            {(user?.role === "admin" || user?.role === "superAdmin") && (
              <Route
                path="/attendance/teacher/view"
                element={<ViewTeacherAttendance />}
              />
            )}
            <Route path="/attendance/student/view" element={<ViewStudentAttendance />} />
            
            {/* Finance Route */}
            {user?.role === "superAdmin" && (
              <Route path="/finance" element={<Finance />} />
            )}
{
  user?.role === "teacher" && (
    <Route path="/profile" element={<Profile />} />
  )
}
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
