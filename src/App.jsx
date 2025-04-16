import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Teachers from './pages/Teachers/Teachers.jsx';
import TeacherProfile from './pages/Teachers/TeacherProfile.jsx';
import AddTeacher from './pages/Teachers/AddTeacher.jsx';
import Login from './pages/Login/Login.jsx';
import Classes from './pages/Classes/Classes.jsx';
import AddClass from './pages/Classes/AddClass.jsx';
import ClassProfile from './pages/Classes/ClassProfile.jsx';
import Students from './pages/Students/Students.jsx';
import StudentProfile from './pages/Students/StudentProfile.jsx';
import AddStudent from './pages/Students/AddStudent.jsx';
import Library from './pages/Library/Library.jsx';
import AddBook from './pages/Library/AddBook.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
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


      </Routes>
    </Router>
  );
}

export default App;
