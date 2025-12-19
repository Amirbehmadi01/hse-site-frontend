import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../services/api.js";
import AdminHeader from "../components/AdminHeader.jsx";

const unitsHierarchy = {
  "سالن تولید ۱": [
    "ورق کاری بدنه",
    "ورق کاری درب",
    "وکیوم لاینر",
    "وکیوم وان",
    "تست",
    "پیش مونتاژ",
    "مونتاژ اولیه",
    "مونتاژ ثانویه",
    "تزریق فوم در",
    "تزریق فوم کابین",
    "بسته بندی",
    "کانتین",
  ],
  "سالن تزریق پلاستیک": ["تزریق"],
  "انبار ها": [
    "مردان",
    "مرکزی",
    "تزریق پلاستیک",
    "محصول",
    "تغذیه",
    "ضایعات",
    "خدمات پس از فروش",
    "فرامهر",
    "نت",
    "مصرفی",
  ],
  "توسعه عمران": ["ابنیه", "جوشکاری"],
  "تاسیسات": ["تاسیسات سالن تولید ۱", "تاسیسات تزریق پلاستیک"],
};
const sOptions = ["S1", "S2", "S3", "S4", "S5", "Safety"];

const NonConformitiesRegister = () => {
  const { isAdmin } = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [subUnits, setSubUnits] = useState([]);
  const [selectedSubUnit, setSelectedSubUnit] = useState("");
  const [rows, setRows] = useState([
    { s: "", description: "", beforeImages: [] },
  ]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedDepartment) {
      setSubUnits(unitsHierarchy[selectedDepartment] || []);
      setSelectedSubUnit("");
    } else {
      setSubUnits([]);
      setSelectedSubUnit("");
    }
  }, [selectedDepartment]);

  if (!isAdmin) {
    navigate("/user/dashboard");
    return null;
  }

  const addRow = () => {
    setRows([...rows, { s: "", description: "", beforeImages: [] }]);
  };

  const updateRow = (idx, key, value) => {
    const next = [...rows];
    next[idx] = { ...next[idx], [key]: value };
    setRows(next);
  };

  const onPickImages = (idx, files) => {
    const list = Array.from(files || []);
    const next = [...rows];
    next[idx].beforeImages = list;
    setRows(next);
  };

  const saveRow = async (idx) => {
    if (!selectedDepartment) {
      alert("Please select a department");
      return;
    }
    if (!selectedSubUnit) {
      alert("لطفاً زیرواحد را انتخاب کنید");
      return;
    }
    const row = rows[idx];
    if (!row.s) {
      alert("Please select S");
      return;
    }
    if (!row.description.trim()) {
      alert("Description is required");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("department", selectedDepartment);
      formData.append("unit", selectedDepartment);
      formData.append("subunit", selectedSubUnit);
      formData.append("s", row.s);
      formData.append("description", row.description);
      row.beforeImages.forEach((file) => {
        formData.append("beforeImages", file);
      });

      await API.post("/nonconformities", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Saved successfully!");
      // Reset this row
      const next = [...rows];
      next[idx] = { s: "", description: "", beforeImages: [] };
      setRows(next);
    } catch (error) {
      alert("Error saving: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <AdminHeader />
      <div style={styles.content}>
        <h2 style={styles.title}>Non-Conformance Registration</h2>
        <button onClick={() => navigate("/admin/dashboard")} style={styles.backButton}>
          ← Back to Dashboard
        </button>

        <div style={styles.departmentSection}>
          <label style={styles.label}>Select Department:</label>
          <div style={styles.departmentButtons}>
            {Object.keys(unitsHierarchy).map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                style={{
                  ...styles.departmentButton,
                  ...(selectedDepartment === dept ? styles.departmentButtonActive : {}),
                }}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {selectedDepartment && (
          <div style={{ marginBottom: "1rem" }}>
            <label style={styles.label}>زیرواحد:</label>
            <select
              value={selectedSubUnit}
              onChange={(e) => setSelectedSubUnit(e.target.value)}
              style={styles.select}
            >
              <option value="">انتخاب...</option>
              {subUnits.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        {selectedDepartment && selectedSubUnit && (
          <div style={styles.tableSection}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>S</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Before Repair Images</th>
                  <th style={styles.th}>Save</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx}>
                    <td style={styles.td}>
                      <select
                        value={row.s}
                        onChange={(e) => updateRow(idx, "s", e.target.value)}
                        style={styles.select}
                      >
                        <option value="">Select...</option>
                        {sOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={styles.td}>
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) => updateRow(idx, "description", e.target.value)}
                        style={styles.input}
                        placeholder="Enter description..."
                      />
                    </td>
                    <td style={styles.td}>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => onPickImages(idx, e.target.files)}
                        style={styles.fileInput}
                      />
                      {row.beforeImages.length > 0 && (
                        <div style={styles.fileCount}>
                          {row.beforeImages.length} file(s) selected
                        </div>
                      )}
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => saveRow(idx)}
                        disabled={loading}
                        style={styles.saveButton}
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={addRow} style={styles.addButton}>
              + Add New Row
            </button>
          </div>
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
    maxWidth: "1200px",
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
  departmentSection: {
    marginBottom: "2rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "500",
    color: "#555",
  },
  departmentButtons: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  },
  departmentButton: {
    padding: "0.75rem 1.5rem",
    border: "2px solid #007bff",
    backgroundColor: "white",
    color: "#007bff",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  departmentButtonActive: {
    backgroundColor: "#007bff",
    color: "white",
  },
  tableSection: {
    marginTop: "2rem",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "1rem",
  },
  th: {
    padding: "0.75rem",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
    backgroundColor: "#f8f9fa",
    fontWeight: "600",
  },
  td: {
    padding: "0.75rem",
    borderBottom: "1px solid #ddd",
  },
  select: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  fileInput: {
    width: "100%",
    padding: "0.5rem",
  },
  fileCount: {
    fontSize: "0.875rem",
    color: "#666",
    marginTop: "0.25rem",
  },
  saveButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  addButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    marginTop: "1rem",
  },
};

export default NonConformitiesRegister;
