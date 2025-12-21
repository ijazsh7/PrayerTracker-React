import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPray } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  


  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await fetch("https://localhost:7281/api/Auth/usersession", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Session not found");
        }

        const data = await response.json();
        if (data.userId && data.userId > 0) {
          setUserId(data.userId);
          setUserName(data.userName);
          setUserRole(data.userRole);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchUserSession();
  }, []);

  
  const handleLogout = async () => {
    try {
      const response = await fetch("https://localhost:7281/api/Auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include" // Important for session cookies!
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Clear user state
        setIsLoggedIn(false);
        setUserId(0);
        setUserName(null);
        setUserRole(null); // If this is a typo, ensure it's `setUserRole`
  
        // Navigate to login
        navigate("/login");
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  


  return (
    <nav
      className="navbar"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
      }}
    >
      {/* Left Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span
          style={{
            fontSize: '26px',
            fontWeight: 'bold',
            color: '#006e4d',
            cursor: 'pointer',
          }}
        >
          Prayer Tracker
        </span>
        <FontAwesomeIcon icon={faPray} size="2x" color="#006e4d" cursor="pointer" />
        {isLoggedIn && userId && (
          <span style={{ color: '#006e4d', fontWeight: 'bold', marginLeft: '15px' }}>
            Welcome, {userName} (Role: {userRole})
          </span>
        )}
      </div>

      {/* Right Section */}
      <div className="menu" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <Link to="/">Home</Link>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button
              onClick={handleLogout}
              style={{
                padding: '2px 10px',
                backgroundColor: '#006e4d',
                border: 'none',
                borderRadius: '5px',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link> 

            {userRole === "Admin" && <Link to="/adminlog">AdminLog</Link>}

          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


