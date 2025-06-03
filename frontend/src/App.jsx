import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GarageListing from './pages/GarageListing';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import UserProfile from './pages/UserProfile';
import Register from './pages/Register';
import GarageDetail from './pages/GarageDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/garages" element={<GarageListing />} />
          <Route path="/booking/:garageId" element={<BookingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<UserProfile />} />
          <Route path="/garage-detail/:garageId" element={<GarageDetail />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;