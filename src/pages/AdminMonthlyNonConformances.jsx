import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../services/api.js";
import AdminHeader from "../components/AdminHeader.jsx";

const AdminMonthlyNonConformances = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/user/dashboard");
      return;
    }
    fetchData();
  }, [isAdmin, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await API.get("/nonconformities", {
        params: { role: "Admin" },
      });
      setData(response.data);
      if (response.data.length > 0 && !selectedMonth) {
        setSelectedMonth(response.data[0].month);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/nonconformities/${id}`, { status: newStatus });
      fetchData();
    } catch (error) {
      alert("Error updating status");
    }
  };

  const handleProgressChange = async (id, progress) => {
    try {
      await API.put(`/nonconformities/${id}`, { progress: Number(progress) });
      fetchData();
    } catch (error) {
      alert("Error updating progress");
    }
  };

  const handleNotesChange = async (id, notes) => {
    try {
      await API.put(`/nonconformities/${id}`, { notes });
      fetchData();
    } catch (error) {
      alert("Error updating notes");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this non-conformance?")) return;
    try {
      await API.delete(`/nonconformities/${id}`);
      fetchData();
    } catch (error) {
      alert("Error deleting");
    }
  };

  const currentMonthData = data.find((d) => d.month === selectedMonth) || { items: [], supervisorScore: 0 };

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <AdminHeader />
      <div style={styles.content}>
        <h2 style={styles.title}>Monthly Non-Conformances</h2>
        <button onClick={() => navigate("/admin/dashboard")} style={styles.backButton}>
          ← Back to Dashboard
        </button>

        {data.length > 0 && (
          <div style={styles.monthSelector}>
            <label>Select Month: </label>
            <select
              value={selectedMonth || ""}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={styles.select}
            >
              {data.map((d) => (
                <option key={d.month} value={d.month}>
                  {d.month} (Score: {d.supervisorScore}%)
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedMonth && (
          <>
            <div style={styles.scoreSection}>
              <h3>Supervisor Score: {currentMonthData.supervisorScore}%</h3>
              <p>
                (Fixed: {currentMonthData.items.filter((i) => i.status === "Fixed").length} / Total:{" "}
                {currentMonthData.items.length})
              </p>
            </div>

            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>S</th>
                    <th style={styles.th}>Description</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Progress (%)</th>
                    <th style={styles.th}>Before Images</th>
                    <th style={styles.th}>After Images</th>
                    <th style={styles.th}>Notes</th>
                    <th style={styles.th}>Reviewed By</th>
                    <th style={styles.th}>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMonthData.items.map((item) => (
                    <tr key={item._id}>
                      <td style={styles.td}>{item.s}</td>
                      <td style={styles.td}>{item.description}</td>
                      <td style={styles.td}>
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td style={styles.td}>
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item._id, e.target.value)}
                          style={styles.select}
                        >
                          <option value="Fixed">Fixed</option>
                          <option value="Not Fixed">Not Fixed</option>
                          <option value="Incomplete">Incomplete</option>
                          <option value="Awaiting Review">Awaiting Review</option>
                        </select>
                      </td>
                      <td style={styles.td}>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.progress}
                          onChange={(e) => handleProgressChange(item._id, e.target.value)}
                          style={styles.numberInput}
                        />
                      </td>
                      <td style={styles.td}>
                        <div style={styles.imageContainer}>
                          {item.beforeImages?.map((img, idx) => (
                            <img
                              key={idx}
                              src={`http://localhost:5000${img}`}
                              alt={`Before ${idx + 1}`}
                              style={styles.image}
                            />
                          ))}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.imageContainer}>
                          {item.afterImages?.map((img, idx) => (
                            <img
                              key={idx}
                              src={`http://localhost:5000${img}`}
                              alt={`After ${idx + 1}`}
                              style={styles.image}
                            />
                          ))}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <textarea
                          value={item.notes || ""}
                          onChange={(e) => handleNotesChange(item._id, e.target.value)}
                          style={styles.textarea}
                          rows="2"
                        />
                      </td>
                      <td style={styles.td}>
                        {item.reviewedBy ? (
                          <div>
                            <div>{item.reviewedBy.username}</div>
                            <div style={styles.dateSmall}>
                              {new Date(item.reviewedDate).toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td style={styles.td}>
                        <button
                          onClick={() => handleDelete(item._id)}
                          style={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {data.length === 0 && !loading && (
          <div style={styles.empty}>No non-conformances found</div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "2rem",
  },
  content: {
    maxWidth: "1400px",
    margin: "0 auto",
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: "1rem",
    color: "#333",
  },
  backButton: {
    marginBottom: "2rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  monthSelector: {
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  select: {
    padding: "0.5rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  scoreSection: {
    marginBottom: "2rem",
    padding: "1rem",
    backgroundColor: "#e7f3ff",
    borderRadius: "4px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "0.75rem",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
    backgroundColor: "#f8f9fa",
    fontWeight: "600",
    fontSize: "0.875rem",
  },
  td: {
    padding: "0.75rem",
    borderBottom: "1px solid #ddd",
    fontSize: "0.875rem",
  },
  numberInput: {
    width: "60px",
    padding: "0.25rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  textarea: {
    width: "100%",
    padding: "0.25rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "0.875rem",
  },
  imageContainer: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
  },
  image: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "0.25rem 0.5rem",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.875rem",
  },
  dateSmall: {
    fontSize: "0.75rem",
    color: "#666",
  },
  empty: {
    textAlign: "center",
    padding: "2rem",
    color: "#666",
  },
};

export default AdminMonthlyNonConformances;

