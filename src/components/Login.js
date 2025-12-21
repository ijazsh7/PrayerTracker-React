import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();


  // Check if the user is already logged in.
  useEffect(() => {
    const checkUserSession = () => {
      fetch("https://localhost:7281/api/Auth/usersession", {
        method: "GET",
        credentials: "include"
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Session expired or not logged in");
          }
          return response.json();
        })
        .then((data) => {
          // The API should return userId if session exists
          setUserId(data.userId);
          if (data.userId && data.userId > 0) {
            setIsLoggedIn(true);
            navigate("/"); // Redirect to dashboard if session is active
          }
          else {
            console.log("Failed to verify session user Id:", data.userId);
            setIsLoggedIn(false);
          }          
        })
        .catch((err) => {
          console.log("Failed to verify session:", err);
          setIsLoggedIn(false);
        });
    };

    checkUserSession(); // Call session check on mount
  },
  []); // ✅ Only once on mount 
  //[setIsLoggedIn, navigate]); // Dependencies to avoid unnecessary re-runs

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation for empty fields
    if (!username || !password) {
      setError('Please fill out all fields.');
      return;
    }

    // Call .NET web API to log in after validation
    fetch("https://localhost:7281/api/Auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // IMPORTANT: sends cookies
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || "Login failed!");
          });
        }
        return response.json();
      })
      .then(() => {
        setTimeout(() => {
          navigate('/'); // Redirect to Dashboard Page after 0.5 seconds
          setError('');
          setIsLoggedIn(true); // Update the logged-in state
        }, 500);
      })
      .catch((error) => {
        setIsLoggedIn(false); // Update the logged-in state
        setError(error.message || "An error occurred. Please try again.");
      });
  };

  return (
    <div
      className="interface"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '70vh',
      }}
    >
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form style={{ width: '300px', textAlign: 'center' }} onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          />
        </div>
        <button type="submit" className="btn" style={{ width: '40%' }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
