import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPray, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [prayerGuidanceList, setPrayerGuidanceList] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userRole, setUserRole] = useState(null);

    const navigate = useNavigate();

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
                setIsLoggedIn(true);
            }
        } catch (error) {
            console.error("Error fetching session:", error);
        }
    };

    const fetchPrayerGuidance = async () => {
        try {
            const response = await fetch("https://localhost:7281/api/PrayerGuidances", {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch prayer guidance");
            }

            const data = await response.json();
            console.log("Fetched Prayer Guidance:", data);  // Debugging log to check the structure of data
            setPrayerGuidanceList(data);
        } catch (error) {
            console.error("Error fetching prayer guidance:", error);
        }
    };

    useEffect(() => {
        fetchUserSession();
        fetchPrayerGuidance();
    }, []);

    const handleNavigation = (destination) => {
        if (!isLoggedIn) {
            navigate('/login'); // Redirect to login if not logged in
        } else {
            navigate(destination); // Redirect based on the destination
        }
    };

    return (
        <div className="interface">
            {/* Interface section */}
            <section className="interface">
                <h1>Welcome to Prayer Tracker</h1>
                <p>Track your daily prayers and manage missed (Qaza) prayers effortlessly.</p>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works">
                <h2>Features</h2>
                <div className="steps-container">
                    {/* Create an Account Step */}
                    <Link to="/register" className="step">
                        <div>
                            <FontAwesomeIcon icon={faUser} size="3x" color="#006e4d" />
                            <h3>1. Create an Account</h3>
                            <p>Sign up to start tracking your daily and missed prayers.</p>
                        </div>
                    </Link>

                    {/* Mark Prayers Step */}
                    <div className="step" onClick={() => handleNavigation('/dashboard')}>
                        <FontAwesomeIcon icon={faPray} size="3x" color="#006e4d" />
                        <h3>2. Mark Prayers</h3>
                        <p>Mark prayers as completed or missed, and track your progress.</p>
                    </div>

                    {/* View Reports Step */}
                    <div className="step" onClick={() => handleNavigation('/dashboard')}>
                        <FontAwesomeIcon icon={faChartBar} size="3x" color="#006e4d" />
                        <h3>3. View Reports</h3>
                        <p>Get daily reports and a summary of missed (Qaza) prayers.</p>
                    </div>

                    {/* Admin Panel Step */}
                    {userRole === "Admin" && (
                        <div className="step" onClick={() => handleNavigation('/adminlog')}>
                            <FontAwesomeIcon icon={faChartBar} size="3x" color="#006e4d" />
                            <h3>4. Admin Reports</h3>
                            <p>Admins can manage users and track overall app activity.</p>
                        </div>
                    )}
                </div>
            </section>

            <section
                className="prayer-guidance"
                style={{
                    maxWidth: '800px', // Reduce width for better readability
                    margin: '0 auto', // Center the section horizontally
                    padding: '30px',
                    background: 'linear-gradient(135deg, #e0f7fa 0%, #006e4d 100%)', // Gradient background
                    borderRadius: '12px', // Rounded corners
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    marginTop: '40px', // Add space on top
                }}
            >
                <h1 style={{ textAlign: 'center', color: '#fff', marginBottom: '20px', fontSize: '24px', fontWeight: '600' }}>
                    Prayer Guidance
                </h1>
                <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
                    {prayerGuidanceList.map((item, index) => (
                        <li
                            key={index}
                            style={{
                                marginBottom: '20px',
                                paddingBottom: '15px',
                                borderBottom: '1px solid #ddd',
                                color: '#fff', // Set text color to white
                            }}
                        >
                            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                {item.title}
                            </div>
                            <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
                                {item.content}
                            </p>
                            {item.videoUrl && ( // Changed to videoUrl
                                <div style={{ marginTop: '10px' }}>
                                    <a
                                        href={item.videoUrl} // Changed to videoUrl
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            textDecoration: 'none',
                                            fontSize: '16px',
                                            borderBottom: '2px solid #fff',
                                            paddingBottom: '2px',
                                            transition: 'color 0.3s ease, border-color 0.3s ease',
                                        }}
                                        onMouseOver={(e) => e.target.style.color = '#004d40'}
                                        onMouseOut={(e) => e.target.style.color = '#fff'}
                                    >
                                        Watch Video
                                    </a>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </section>


            {/* Footer Section */}
            <section>
                <footer>
                    <p>&copy; 2025 Prayer Tracker. All rights reserved.</p>
                </footer>
            </section>
        </div>
    );
};

export default Home;
