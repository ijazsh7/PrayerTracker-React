import React, { useEffect, useState } from "react";

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PrayerSummaryTable = ({ userId }) => {
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        fetch(`${API_BASE_URL}/api/PrayerRecords/userprayerssummary/${userId}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch prayer summary");
                return res.json();
            })
            .then(data => {
                const grouped = groupByPrayer(data);
                setSummary(grouped);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [userId]);

    const groupByPrayer = (data) => {
        const grouped = {};
        data.forEach(({ prayerId, prayerName, status, count }) => {
            if (!grouped[prayerId]) {
                grouped[prayerId] = { prayerName, Prayed: 0, Missed: 0 };
            }
            grouped[prayerId][status] = count;
        });
        return Object.values(grouped);
    };

    if (loading) return <p>Loading prayer summary...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="summary-container">
            <h2>Overall Prayer Summary</h2>
            <table className="summary-table">
                <thead>
                    <tr>
                        <th>Prayer</th>
                        <th>Prayed</th>
                        <th>Missed</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {summary.map((item, index) => (
                        <tr key={index}>
                            <td>{item.prayerName}</td>
                            <td style={{ color: "green" }}>{item.Prayed || 0}</td>
                            <td style={{ color: "red" }}>{item.Missed || 0}</td>
                            <td><strong>{(item.Prayed || 0) + (item.Missed || 0)}</strong></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <style>{`
                .summary-container {
                    max-width: 600px;
                    margin: 30px auto;
                    background: #f9f9f9;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                .summary-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .summary-table th, .summary-table td {
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: center;
                }
                .summary-table th {
                    background-color: #f1f1f1;
                }
            `}</style>
        </div>
    );
};

export default PrayerSummaryTable;
