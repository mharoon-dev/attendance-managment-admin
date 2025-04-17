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
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "./redux/slices/userSlice.jsx";
import { api } from "./utils/url.js";
import Loader from "./components/Loader/Loader.jsx";
function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));

    const isAuthenticated = async () => {
      const response = await api.get("auth/isuserloggedin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);

      if (isAuthenticated) {
        dispatch(loginSuccess(response?.data?.data));
      }
      setLoading(false);
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
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/"
            element={!user ? <Navigate to="/login" /> : <Dashboard />}
          />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/teachers/add" element={<AddTeacher />} />
          <Route path="/teachers/:id" element={<TeacherProfile />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/classes/add" element={<AddClass />} />
          <Route path="/classes/:id" element={<ClassProfile />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<StudentProfile />} />
          <Route path="/students/add" element={<AddStudent />} />
          <Route path="/library" element={<Library />} />
          <Route path="/library/add" element={<AddBook />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/subjects/:id" element={<SubjectProfile />} />
          <Route path="/subjects/add" element={<AddSubject />} />
          <Route path="/attendance/mark" element={<MarkAttendance />} />
            <Route path="/attendance" element={<ViewAttendance />} />
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
