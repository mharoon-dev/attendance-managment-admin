import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Teachers from './pages/Teachers/Teachers';
import TeacherProfile from './pages/Teachers/TeacherProfile';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/teachers/:id" element={<TeacherProfile />} />
        </Routes>
      </Router>
  );
}

export default App;
