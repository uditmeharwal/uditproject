import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import AdminPanel from './components/AdminPanel';
import UserPanel from './components/UserPanel';

function App() {
  const isLoggedIn = localStorage.getItem('token');

  return (
    <Router>
      <div className="App">
        <div className="container">
            <Routes>
              <Route path="/" element={isLoggedIn ? <Navigate to="/admin" /> : <Navigate to="/login" />} />
              <Route path="/register" element={<RegisterForm/>} />
              <Route path="/login" element={<LoginForm/>} />
              <Route path="/admin" element={<AdminPanel/>} />
              <Route path="/user" element={<UserPanel/>} />
            </Routes>
          </div>
        </div>
    </Router>
  );
}

export default App;
