import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserCheck, FaUserTimes } from "react-icons/fa";

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function AdminLog() {    
    const [users, setUsers] = useState([]);
    // added these to update State to Manage Modal and History @Nida
    const [selectedUser, setSelectedUser] = useState(null);
    const [prayerHistory, setPrayerHistory] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [prayerError, setPrayerError] = useState("");

    const [prayerGuidanceList, setPrayerGuidanceList] = useState([]);

   
    // Dyamic css styles for this component @Nida
    const headerStyle = {
        textAlign: 'left',
        padding: '10px',
        fontWeight: 'bold',
        color: '#333',
      };
      
      const cellStyle = {
        padding: '10px',
        verticalAlign: 'top',
        color: '#555',
      };
      
      const buttonStyleEdit = {
        marginRight: '10px',
        padding: '5px 10px',
        backgroundColor: '#f0ad4e',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      };
      
      const buttonStyleDelete = {
        padding: '5px 10px',
        backgroundColor: '#d9534f',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      };

      

    const fetchUsers = async () => {
        fetch(`${API_BASE_URL}/api/Users`) 
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error("Error fetching users:", error));
    };  

    const fetchPrayerGuidance = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/PrayerGuidances`, {
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

     // Fetch users and prayerguidance to admin panel from backend
     useEffect(() => {
        fetchUsers();
        fetchPrayerGuidance();
    }, []);
    

    const viewPrayerHistory = (userId) => { 
        fetch(`${API_BASE_URL}/api/PrayerRecords/user/${userId}`)
            .then(response => {
                if (!response.ok) {
                    // Handle error status with optional message
                    setPrayerHistory([]);
                    setPrayerError("Failed to fetch prayer history.");
                    const user = users.find(u => u.userId === userId);
                    setSelectedUser(user);
                    setShowModal(true);
                    return;
                }
                else {
                    return response.json();
                }                
            })
            .then(data => {               

                if (Array.isArray(data)) {
                    setPrayerHistory(data);
                    const user = users.find(u => u.userId === userId);
                    setSelectedUser(user);
                    setShowModal(true);
                } 
                else if (data.message) {
                    setPrayerHistory([]); // Clear history
                    setPrayerError(data.message); // Show returned message
                } 
                else {
                    console.warn("Prayer history is not an array:", data);
                    /*
                    setPrayerHistory(data);
                    const user = users.find(u => u.userId === userId);
                    setSelectedUser(user);
                    setShowModal(true);
                    */

                    setPrayerHistory([]);
                    setPrayerError("Unexpected response from the server.");
                }

            })
            .catch(error => console.error("Error fetching prayer history:", error));
    };
    

    const activateUser = (userId) => {
        fetch(`${API_BASE_URL}/api/User/activate/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        })
        .then(response => {
            if (!response.ok) throw new Error("Request failed");
            return response.status !== 204 ? response.json() : null;
        })
        .then(() => {
            // Reload the full user list after activation
            fetchUsers();
        })
        .catch(error => console.error("Error updating user status:", error));
    };

    const deactivateUser = (userId) => {
        fetch(`${API_BASE_URL}/api/User/deactivate/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to deactivate user (status: ${response.status})`);
            }
            return response.status !== 204 ? response.json() : null;
        })
        .then(() => {
            // Always reload the full list after update
            fetchUsers();
        })
        .catch(error => console.error("Error updating user status:", error));
    };
      
    
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this prayer guidance?")) {
          try {
            const response = await fetch(`${API_BASE_URL}/api/PrayerGuidances/${id}`, {
              method: 'DELETE',
            });
      
            if (response.ok) {
              // Re-fetch the updated list
              fetchPrayerGuidance(); // Ensure this function exists in the component
            } else {
              throw new Error("Failed to delete");
            }
          } catch (err) {
            console.error(err);
            alert("Delete failed.");
          }
        }
      };
      
    
    const [showAddForm, setShowAddForm] = useState(false);
    const [newGuidance, setNewGuidance] = useState({
    title: '',
    content: '',
    videoUrl: '',
    });

    const handleAddGuidance = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`${API_BASE_URL}/api/PrayerGuidances`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGuidance),
        });
        if (response.ok) {
        fetchPrayerGuidance(); // Refresh list
        setNewGuidance({ title: '', content: '', videoUrl: '' });
        setShowAddForm(false);
        } else {
        alert("Failed to add guidance.");
        }
    } catch (err) {
        console.error(err);
        alert("Add failed.");
    }
    };

    



    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Admin Panel</h1>

            {/* User Management Section */}
            <div className="card shadow p-3">
                <h2 className="text-center">Manage Users</h2>
                <table className="table table-striped table-bordered mt-3">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th  className="text-center">Admin Actions</th>                            
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.userId}>
                                <td>{user.userId}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`badge ${user.isActive ? "bg-success" : "bg-danger"}`}>
                                        {user.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td>
                                    {user.isActive ? (
                                    <button
                                        className="btn btn-danger btn-sm me-2 fixed-width-btn"
                                        onClick={() => deactivateUser(user.userId)}
                                    >
                                        <FaUserTimes /> Deactivate
                                    </button>
                                    ) : (
                                    <button
                                        className="btn btn-success btn-sm me-2 fixed-width-btn"
                                        onClick={() => activateUser(user.userId)}
                                    >
                                        <FaUserCheck /> Activate
                                    </button>
                                    )}

                                    <button className="btn btn-info btn-sm me-2" onClick={() => viewPrayerHistory(user.userId)}>
                                        View Prayer_History
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {showModal && (
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Prayer History - {selectedUser?.username}</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>

                                <div className="modal-body">
                                    {prayerHistory.length === 0 ? (
                                        <p>No prayer history found.</p>
                                    ) : (
                                        <table className="table table-striped table-bordered">
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Date</th>
                                                    <th>Prayer</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {prayerHistory.map((entry, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{new Date(entry.recordedAt).toLocaleDateString()}</td>
                                                        <td>{entry.prayerName}</td>                                                        
                                                        <td className={`fw-bold ${entry.status?.toLowerCase() === 'prayed' ? 'text-success' : 'text-danger'}`}>
                                                        {entry.status}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>


                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


            </div>


            
            {/* Prayer Guidance Management Section */}
            <section
            style={{
                maxWidth: '1000px',
                margin: '40px auto',
                padding: '20px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
            >
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
                Prayer Guidance
            </h2>

            <div style={{ textAlign: 'left', marginBottom: '10px' }}>
                <button
                onClick={() => setShowAddForm(true)}
                style={{
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
                >
                Add Guidance
                </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ backgroundColor: '#f4f4f4' }}>
                    <th style={headerStyle}>#</th>
                    <th style={headerStyle}>Title</th>
                    <th style={headerStyle}>Content</th>
                    <th style={headerStyle}>Video</th>
                    <th style={headerStyle}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {prayerGuidanceList.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={cellStyle}>{index + 1}</td>
                    <td style={cellStyle}>{item.title}</td>
                    <td style={cellStyle}>{item.content}</td>
                    <td style={cellStyle}>
                        {item.videoUrl ? (
                        <a
                            href={item.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#006e4d', textDecoration: 'underline' }}
                        >
                            Watch
                        </a>
                        ) : (
                        'N/A'
                        )}
                    </td>
                    <td style={cellStyle}>
                        <button
                        onClick={() => handleDelete(item.guidanceId)}
                        style={buttonStyleDelete}
                        >
                        Delete
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Add Guidance Form (Shown When Triggered) */}
            {showAddForm && (
                <div style={{ marginTop: '30px' }}>
                <h3 style={{ color: '#333' }}>Add New Prayer Guidance</h3>
                <form onSubmit={handleAddGuidance}>
                    <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={newGuidance.title}
                        onChange={(e) =>
                        setNewGuidance({ ...newGuidance, title: e.target.value })
                        }
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                    <textarea
                        placeholder="Content"
                        value={newGuidance.content}
                        onChange={(e) =>
                        setNewGuidance({ ...newGuidance, content: e.target.value })
                        }
                        required
                        style={{ width: '100%', padding: '8px', height: '100px' }}
                    />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                    <input
                        type="url"
                        placeholder="Video URL (optional)"
                        value={newGuidance.videoUrl}
                        onChange={(e) =>
                        setNewGuidance({ ...newGuidance, videoUrl: e.target.value })
                        }
                        style={{ width: '100%', padding: '8px' }}
                    />
                    </div>
                    <button
                    type="submit"
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '10px',
                    }}
                    >
                    Submit
                    </button>
                    <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#6c757d',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                    >
                    Cancel
                    </button>
                </form>
                </div>
            )}
            </section>


        </div>
    );
}

export default AdminLog;

