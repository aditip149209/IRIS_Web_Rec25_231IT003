import './App.css';
import React from 'react';
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProtectedRoute from './pages/Protected';
import StudentDashboard from './pages/student/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Facility from './pages/admin/Facility';
import Equipment from './pages/admin/Equipment';
import Booking from './pages/admin/Booking';
import BookFacility from './pages/student/BookFacility';
import BookEquipment from './pages/student/BookEquipment';
import BookingHistory from './pages/student/BookingHistory';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />}  />
        <Route path="/studentdashboard" element={<ProtectedRoute element={<StudentDashboard />} allowedRoles={["Student", "Admin"]}/>} />
        <Route path="/studentdashboard/bookingfacility" element={<ProtectedRoute element={<BookFacility />} allowedRoles={["Student", "Admin"]} />} />
        <Route path="/studentdashboard/bookingequipment" element={<ProtectedRoute element={<BookEquipment />} allowedRoles={["Student", "Admin"]} />} />
        <Route path="/studentdashboard/bookinghistory" element={<ProtectedRoute element={<BookingHistory />} allowedRoles={["Student", "Admin"]} />} />        
        <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={["Admin"]} />} />
        <Route path="/admin/facility" element={<ProtectedRoute element={<Facility />} allowedRoles={["Admin"]} />} />
        <Route path="/admin/equipment" element={<ProtectedRoute element={<Equipment />} allowedRoles={["Admin"]} />} />
        <Route path="/admin/booking" element={<ProtectedRoute element={<Booking />} allowedRoles={["Admin"]} />} />
      </Routes>
    </Router>

  )  
}


const LandingPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = () => {
    setIsLogin(prev => !prev);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      console.log(response.data.token);

      if (response.data.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/studentdashboard');
      }
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  };

  const handleNewUser = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', { username, email, password });
      console.log(response);
      navigate("/");
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center bg-gray-900">
      <div className="max-w-4xl h-[70vh] flex rounded-lg overflow-hidden shadow-2xl bg-gray-800">
        
        {/* Left Side - Welcome Section */}
        <div className="w-1/2 flex flex-col justify-center items-center p-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h1 className="text-4xl font-bold text-center">Welcome to SportsHub</h1>
          <p className="mt-4 text-2xl text-center">Your all-in-one platform for booking sports facilities & equipment at NITK.</p>
        </div>

        {/* Right Side - Login/Register Section */}
        <div className="w-1/2 flex flex-col justify-center items-center p-10 bg-gray-700">
          <h2 className="text-2xl font-bold text-white">{isLogin ? "Sign In" : "Register"}</h2>

          <form onSubmit={isLogin ? handleSignIn : handleNewUser} className="w-full">
            {!isLogin && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 mt-4 rounded bg-gray-600 text-white border border-gray-500 focus:outline-none"
                required
              />
            )}
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-4 rounded bg-gray-600 text-white border border-gray-500 focus:outline-none"
              required
            />
            
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-4 rounded bg-gray-600 text-white border border-gray-500 focus:outline-none"
              required
            />

            {!isLogin && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 mt-4 rounded bg-gray-600 text-white border border-gray-500 focus:outline-none"
                required
              />
            )}

            {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

            <button type="submit" className="w-full p-3 mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded">
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          <p className="text-md text-gray-400 mt-6">
            {isLogin ? "New Here?" : "Already have an account?"} 
            <span onClick={handleRegister} className="text-purple-400 hover:underline cursor-pointer"> {isLogin ? "Register" : "Login"}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
