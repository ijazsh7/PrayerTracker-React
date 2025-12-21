import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';


import Navbar from './components/Navbar'; // Import Navbar
import Login from './components/Login';   // Import Login
import Register from './components/Register'; // Import Register
import Home from './components/Home'; // Import Home
import Dashboard from './components/Dashboard'; // Import Dashboard
import AdminLog from "./components/AdminLog";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if the user is already logged in when the app loads
        if (localStorage.getItem('user')) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <div>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/adminlog" element={<AdminLog />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </div>
    );
}

export default App;
