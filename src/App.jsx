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

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
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
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
