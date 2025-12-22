import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Register = () => {
    // State to manage form data and error messages
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Validate form
    const validateForm = () => {
        let isValid = true;
        const errors = {};

        if (!formData.username) {
            isValid = false;
            errors.username = 'Username is required';
        }
        if (!formData.email.includes('@')) {
            isValid = false;
            errors.email = 'Invalid email format';
        }
        if (formData.password.length < 6) {
            isValid = false;
            errors.password = 'Password must be at least 8 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            isValid = false;
            errors.confirmPassword = 'Passwords do not match';
        }

        setErrors(errors);
        return isValid;
    };

    // Handle form submission
    const handleSubmit = async (e) => {    
        e.preventDefault();

        if (validateForm()) {

            // Simulate registration (you can integrate backend API here)
            /*
            localStorage.setItem('user', JSON.stringify({ username: formData.username }));
            alert('Registration successful!');

            // Automatically log the user in and redirect to the dashboard
            navigate('/dashboard');
            */

            // call .net web api to register after validation is successful
            try {
                const response = await fetch(`${API_BASE_URL}/api/Auth/register`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                  }),
                });
          
                const data = await response.json();
          
                if (response.ok) {
                  setMessage("Registration successful!");
                  setTimeout(() => {
                    navigate('/login'); // Redirect to Dashboard Page after 0.5 seconds
                  }, 500);

                } else {
                  setMessage(data.message || "Registration failed!");
                }
              } catch (error) {
                setMessage("An error occurred. Please try again.");
              }
        }
    };

    return (
        <div className="interface" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
            <h1>Register</h1>
            <form style={{ width: '300px', textAlign: 'center' }} onSubmit={handleSubmit}>
                {/* Username Field */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                    {errors.username && <p style={{ color: 'red', fontSize: '14px' }}>{errors.username}</p>}
                </div>

                {/* Email Field */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                    {errors.email && <p style={{ color: 'red', fontSize: '14px' }}>{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                    <input
                        type="text"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                    {errors.password && <p style={{ color: 'red', fontSize: '14px' }}>{errors.password}</p>}
                </div>

                {/* Confirm Password Field */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Confirm Password:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                    {errors.confirmPassword && <p style={{ color: 'red', fontSize: '14px' }}>{errors.confirmPassword}</p>}
                </div>

                <button className="btn" type="submit" style={{ width: '40%' }}>Register</button>                
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;
