import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import PrayerSummaryTable from './PrayerSummaryTable';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const [prayers, setPrayers] = useState([
        { name: "Fajr", status: "Pending" },
        { name: "Dhuhr", status: "Pending" },
        { name: "Asr", status: "Pending" },
        { name: "Maghrib", status: "Pending" },
        { name: "Isha", status: "Pending" }
    ]);

    const [userId, setUserId] = useState(null);

    // Function that fetches session info from the API
    const fetchUserSession = (setUserId) => {
        fetch(`${API_BASE_URL}/api/Auth/usersession`, {
            credentials: "include" // Important: this sends cookies to identify the session
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch user session");
                }
                return response.json();
            })
            .then(data => {
                // The API should return userId if session exists
                setUserId(data.userId);
            })
            .catch(error => {
                console.log("Error fetching user session:", error);
            });
    };

    // Call the session checker when component mounts
    useEffect(() => {

        fetchUserSession(setUserId);
    
        if (!userId) return;
    
        const defaultPrayers = [
            { name: "Fajr", status: "Pending" },
            { name: "Dhuhr", status: "Pending" },
            { name: "Asr", status: "Pending" },
            { name: "Maghrib", status: "Pending" },
            { name: "Isha", status: "Pending" }
        ];
    
        fetch(`${API_BASE_URL}/api/PrayerRecords/daily/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch prayer status");
                }
                return response.json();
            })
            .then(data => {
                const fetched = data.map(item => ({
                    name: item.prayerName,
                    status: item.status === "Prayed" ? "Completed" : item.status === "Missed" ? "Missed" : "Pending"
                }));
    
                // Merge with defaults if any prayers are missing
                const merged = defaultPrayers.map(p => {
                    const match = fetched.find(fp => fp.name === p.name);
                    return match || p;
                });
    
                setPrayers(merged);
            })
            .catch(error => {
                console.error("Error loading prayer statuses:", error);
                // fallback to local defaults
                setPrayers(defaultPrayers);
            });
    }, [userId]);


    const markPrayer = (prayerName, status) => {
        if (!userId || userId === 0) {
            console.log("User ID is not defined. Cannot mark prayer.");
            alert("You must be logged in to mark a prayer.");
            return;
        }
    
        const prayerIdMap = {
            Fajr: 1,
            Dhuhr: 2,
            Asr: 3,
            Maghrib: 4,
            Isha: 5,
        };
    
        const prayerId = prayerIdMap[prayerName];
    
        fetch(`${API_BASE_URL}/api/PrayerRecords/markprayer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: userId,
                prayerId: prayerId,
                status: status === "Completed" ? "Prayed" : "Missed"
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to mark prayer");
                }
                return response.json();
            })
            .then(() => {
                setPrayers(prevPrayers =>
                    prevPrayers.map(prayer =>
                        prayer.name === prayerName ? { ...prayer, status } : prayer
                    )
                );
            })
            .catch(error => {
                console.log("Error marking prayer:", error);
                alert("An error occurred while marking the prayer. Please try again.");
            });
    };
    

    const completedCount = prayers.filter(p => p.status === "Completed").length;
    const missedCount = prayers.filter(p => p.status === "Missed").length;

    const progressData = {
        labels: ["Completed", "Missed"],
        datasets: [
            {
                data: [completedCount, missedCount],
                backgroundColor: ["#4CAF50", "#FF5252"],
            },
        ],
    };

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>           

            <h3>Daily Prayers Status - {new Date().toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
                })}
            </h3>

            <div className="prayer-table-container">
                <table className="prayer-table">
                    <thead>
                        <tr>
                            <th>Prayer</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prayers.map((prayer) => (
                            <tr key={prayer.name}>
                                <td>{prayer.name}</td>
                                <td
                                    style={{
                                        color: prayer.status === "Completed" ? "green" : prayer.status === "Missed" ? "red" : "black",
                                        fontWeight: "bold"
                                    }}
                                >
                                    {prayer.status}
                                </td>
                                <td>
                                    <button className="btn-complete" onClick={() => markPrayer(prayer.name, "Completed")}>✅ Completed</button>
                                    <button className="btn-missed" onClick={() => markPrayer(prayer.name, "Missed")}>❌ Missed</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h2>Your Daily Progress</h2>
            <div className="chart-container">
                <Doughnut data={progressData} />
            </div>

            {/* prayer summary component called here */}
            {userId && <PrayerSummaryTable userId={userId} />}

        </div>
    );


};

export default Dashboard;
