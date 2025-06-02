import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GarageListing from './pages/GarageListing';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookinPage';
import UserProfile from './pages/UserProfile';
import Register from './pages/Register';
import GarageDetail from './pages/GarageDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/garages" element={<GarageListing />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/UserProfile" element={<UserProfile />} />
        <Route path="/GarageDetail" element={<GarageDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
