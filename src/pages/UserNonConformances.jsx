// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext.jsx";
// import API from "../services/api.js";

// const UserNonConformances = () => {
//   const { user, isUser } = useAuth();
//   const navigate = useNavigate();
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingItem, setEditingItem] = useState(null);
//   const [afterImages, setAfterImages] = useState([]);
//   const [notes, setNotes] = useState("");

//   useEffect(() => {
//     if (!isUser) {
//       navigate("/admin/dashboard");
//       return;
//     }
//     fetchData();
//   }, [isUser, navigate, user]);

//   const fetchData = async () => {
//     if (!user?.department) return;
//     try {
//       setLoading(true);
//       const response = await API.get("/nonconformities", {
//         params: {
//           role: "User",
//           department: user.department,
//           currentMonth: "true",
//         },
//       });
//       // Get current month's items
//       const currentMonth = response.data[0]?.items || [];
//       setData(currentMonth);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       alert("Error loading data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (item) => {
//     setEditingItem(item._id);
//     setAfterImages([]);
//     setNotes(item.notes || "");
//   };

//   const handleCancelEdit = () => {
//     setEditingItem(null);
//     setAfterImages([]);
//     setNotes("");
//   };

//   const handleFileChange = (e) => {
//     setAfterImages(Array.from(e.target.files));
//   };

//   const handleSubmitResponse = async (id) => {
//     try {
//       const formData = new FormData();
//       formData.append("submitResponse", "true");
//       if (notes) {
//         formData.append("notes", notes);
//       }
//       afterImages.forEach((file) => {
//         formData.append("afterImages", file);
//       });

//       await API.put(`/nonconformities/${id}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert("Response submitted successfully!");
//       handleCancelEdit();
//       fetchData();
//     } catch (error) {
//       alert("Error submitting response: " + (error.response?.data?.message || error.message));
//     }
//   };

//   if (loading) {
//     return <div style={styles.container}>Loading...</div>;
//   }

//   return (
//     <div style={styles.container}>
//       <div style={styles.content}>
//         <h2 style={styles.title}>My Non-Conformances - {user?.department}</h2>
//         <button onClick={() => navigate("/user/dashboard")} style={styles.backButton}>
//           ← Back to Dashboard
//         </button>

//         {data.length === 0 ? (
//           <div style={styles.empty}>No non-conformances for this month</div>
//         ) : (
//           <div style={styles.tableWrapper}>
//             <table style={styles.table}>
//               <thead>
//                 <tr>
//                   <th style={styles.th}>S</th>
//                   <th style={styles.th}>Description</th>
//                   <th style={styles.th}>Status</th>
//                   <th style={styles.th}>Before Images</th>
//                   <th style={styles.th}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.map((item) => (
//                   <tr key={item._id}>
//                     <td style={styles.td}>{item.s}</td>
//                     <td style={styles.td}>{item.description}</td>
//                     <td style={styles.td}>
//                       <span
//                         style={{
//                           ...styles.statusBadge,
//                           ...(item.status === "Fixed"
//                             ? styles.statusFixed
//                             : item.status === "Awaiting Review"
//                             ? styles.statusPending
//                             : styles.statusIncomplete),
//                         }}
//                       >
//                         {item.status}
//                       </span>
//                     </td>
//                     <td style={styles.td}>
//                       <div style={styles.imageContainer}>
//                         {item.beforeImages?.map((img, idx) => (
//                           <img
//                             key={idx}
//                             src={`http://localhost:5000${img}`}
//                             alt={`Before ${idx + 1}`}
//                             style={styles.image}
//                             onClick={() => window.open(`http://localhost:5000${img}`, "_blank")}
//                           />
//                         ))}
//                       </div>
//                     </td>
//                     <td style={styles.td}>
//                       {editingItem === item._id ? (
//                         <div style={styles.editForm}>
//                           <div style={styles.formGroup}>
//                             <label>After Repair Images:</label>
//                             <input
//                               type="file"
//                               accept="image/*"
//                               multiple
//                               onChange={handleFileChange}
//                               style={styles.fileInput}
//                             />
//                             {afterImages.length > 0 && (
//                               <div style={styles.fileCount}>
//                                 {afterImages.length} file(s) selected
//                               </div>
//                             )}
//                           </div>
//                           <div style={styles.formGroup}>
//                             <label>Notes:</label>
//                             <textarea
//                               value={notes}
//                               onChange={(e) => setNotes(e.target.value)}
//                               style={styles.textarea}
//                               rows="3"
//                               placeholder="Enter repair notes..."
//                             />
//                           </div>
//                           <div style={styles.formActions}>
//                             <button
//                               onClick={() => handleSubmitResponse(item._id)}
//                               style={styles.submitButton}
//                             >
//                               Submit Response
//                             </button>
//                             <button
//                               onClick={handleCancelEdit}
//                               style={styles.cancelButton}
//                             >
//                               Cancel
//                             </button>
//                           </div>
//                         </div>
//                       ) : (
//                         <button
//                           onClick={() => handleEdit(item)}
//                           style={styles.editButton}
//                           disabled={item.status === "Fixed"}
//                         >
//                           {item.status === "Awaiting Review"
//                             ? "Update Response"
//                             : item.status === "Fixed"
//                             ? "Completed"
//                             : "Add Response"}
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     minHeight: "100vh",
//     backgroundColor: "#f5f5f5",
//     padding: "2rem",
//   },
//   content: {
//     maxWidth: "1200px",
//     margin: "0 auto",
//     backgroundColor: "white",
//     padding: "2rem",
//     borderRadius: "8px",
//     boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//   },
//   title: {
//     marginBottom: "1rem",
//     color: "#333",
//   },
//   backButton: {
//     marginBottom: "2rem",
//     padding: "0.5rem 1rem",
//     backgroundColor: "#6c757d",
//     color: "white",
//     border: "none",
//     borderRadius: "4px",
//     cursor: "pointer",
//   },
//   tableWrapper: {
//     overflowX: "auto",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//   },
//   th: {
//     padding: "0.75rem",
//     textAlign: "left",
//     borderBottom: "2px solid #ddd",
//     backgroundColor: "#f8f9fa",
//     fontWeight: "600",
//   },
//   td: {
//     padding: "0.75rem",
//     borderBottom: "1px solid #ddd",
//   },
//   statusBadge: {
//     padding: "0.25rem 0.75rem",
//     borderRadius: "12px",
//     fontSize: "0.875rem",
//     fontWeight: "500",
//   },
//   statusFixed: {
//     backgroundColor: "#d4edda",
//     color: "#155724",
//   },
//   statusPending: {
//     backgroundColor: "#fff3cd",
//     color: "#856404",
//   },
//   statusIncomplete: {
//     backgroundColor: "#f8d7da",
//     color: "#721c24",
//   },
//   imageContainer: {
//     display: "flex",
//     gap: "0.5rem",
//     flexWrap: "wrap",
//   },
//   image: {
//     width: "80px",
//     height: "80px",
//     objectFit: "cover",
//     borderRadius: "4px",
//     cursor: "pointer",
//     border: "1px solid #ddd",
//   },
//   editButton: {
//     padding: "0.5rem 1rem",
//     backgroundColor: "#007bff",
//     color: "white",
//     border: "none",
//     borderRadius: "4px",
//     cursor: "pointer",
//   },
//   editForm: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "1rem",
//     padding: "1rem",
//     backgroundColor: "#f9f9f9",
//     borderRadius: "4px",
//     minWidth: "300px",
//   },
//   formGroup: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "0.5rem",
//   },
//   fileInput: {
//     padding: "0.5rem",
//   },
//   fileCount: {
//     fontSize: "0.875rem",
//     color: "#666",
//   },
//   textarea: {
//     padding: "0.5rem",
//     border: "1px solid #ddd",
//     borderRadius: "4px",
//     resize: "vertical",
//   },
//   formActions: {
//     display: "flex",
//     gap: "0.5rem",
//   },
//   submitButton: {
//     padding: "0.5rem 1rem",
//     backgroundColor: "#28a745",
//     color: "white",
//     border: "none",
//     borderRadius: "4px",
//     cursor: "pointer",
//   },
//   cancelButton: {
//     padding: "0.5rem 1rem",
//     backgroundColor: "#6c757d",
//     color: "white",
//     border: "none",
//     borderRadius: "4px",
//     cursor: "pointer",
//   },
//   empty: {
//     textAlign: "center",
//     padding: "2rem",
//     color: "#666",
//   },
// };

// export default UserNonConformances;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment-jalaali";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../services/api.js";

const jalaliMonths = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];

const UserNonConformances = () => {
  const { user, isUser } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [afterImages, setAfterImages] = useState([]);
  const [notes, setNotes] = useState("");
  const [selectedJYear, setSelectedJYear] = useState(() => moment().format("jYYYY"));
  const [selectedJMonth, setSelectedJMonth] = useState(() => moment().format("jM"));

  useEffect(() => {
    if (!isUser) {
      navigate("/admin/dashboard");
      return;
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUser, navigate]);

  const getMonthRangeGregorian = (jYear, jMonth) => {
    const jMonthStr = String(jMonth).padStart(2, "0");
    const jStart = moment(`${jYear}-${jMonthStr}-01`, "jYYYY-jMM-jDD");
    const gStart = jStart.toDate();
    const gEnd = jStart.clone().endOf("jMonth").toDate();
    return {
      from: gStart.toISOString().split("T")[0],
      to: gEnd.toISOString().split("T")[0],
    };
  };

  const fetchData = async () => {
    if (!user?.department) return;
    try {
      setLoading(true);
      const { from, to } = getMonthRangeGregorian(selectedJYear, selectedJMonth);
      const response = await API.get("/nonconformities", {
        params: {
          role: "User",
          unit: user.department,
          subunit: user.subunit,
          userId: user.id,
          mode: "flat",
          from,
          to,
        },
      });
      const flat = Array.isArray(response.data) ? response.data : [];
      setData(flat);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item._id);
    setAfterImages([]);
    setNotes(item.notes || "");
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setAfterImages([]);
    setNotes("");
  };

  const handleFileChange = (e) => {
    setAfterImages(Array.from(e.target.files));
  };

  const handleSubmitResponse = async (id) => {
    try {
      const formData = new FormData();
      formData.append("submitResponse", "true");
      if (notes) formData.append("notes", notes);
      afterImages.forEach((file) => formData.append("afterImages", file));

      await API.put(`/nonconformities/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Response submitted successfully!");
      handleCancelEdit();
      fetchData();
    } catch (error) {
      alert("Error submitting response: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div style={styles.container}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h2 style={styles.title}>عدم انطباق‌های زیرواحد شما</h2>
        <div style={styles.actionsRow}>
          <button onClick={() => navigate("/user/dashboard")} style={styles.backButton}>
            ← بازگشت
          </button>
          <div style={styles.filters}>
            <div>
              <label style={styles.filterLabel}>سال (جلالی)</label>
              <select value={selectedJYear} onChange={(e) => setSelectedJYear(e.target.value)} style={styles.filterInput}>
                {Array.from({ length: 6 }, (_, idx) => moment().jYear() - 3 + idx).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={styles.filterLabel}>ماه</label>
              <select value={selectedJMonth} onChange={(e) => setSelectedJMonth(e.target.value)} style={styles.filterInput}>
                {jalaliMonths.map((m, idx) => (
                  <option key={m} value={idx + 1}>{m}</option>
                ))}
              </select>
            </div>
            <button onClick={fetchData} style={styles.confirmBtn}>تایید</button>
          </div>
        </div>

        {data.length === 0 ? (
          <div style={styles.empty}>موردی برای این بازه یافت نشد</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>S</th>
                  <th style={styles.th}>شرح</th>
                  <th style={styles.th}>وضعیت</th>
                  <th style={styles.th}>توضیح ادمین</th>
                  <th style={styles.th}>تصاویر قبل</th>
                  <th style={styles.th}>اقدام</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={item._id || idx}>
                    <td style={styles.td}>{item.s}</td>
                    <td style={styles.td}>{item.description}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          ...(item.status === "Fixed"
                            ? styles.statusFixed
                            : item.status === "Awaiting Review"
                            ? styles.statusPending
                            : styles.statusIncomplete),
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={styles.td}>{item.notes || "-"}</td>
                    <td style={styles.td}>
                      <div style={styles.imageContainer}>
                        {item.beforeImages?.map((img, idx2) => (
                          <img
                            key={idx2}
                            src={`http://localhost:5000${img}`}
                            alt={`Before ${idx2 + 1}`}
                            style={styles.image}
                            onClick={() => window.open(`http://localhost:5000${img}`, "_blank")}
                          />
                        ))}
                      </div>
                    </td>
                    <td style={styles.td}>
                      {editingItem === item._id ? (
                        <div style={styles.editForm}>
                          <div style={styles.formGroup}>
                            <label>تصاویر بعد از اقدام</label>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleFileChange}
                              style={styles.fileInput}
                            />
                            {afterImages.length > 0 && (
                              <div style={styles.fileCount}>{afterImages.length} فایل انتخاب شد</div>
                            )}
                          </div>
                          <div style={styles.formGroup}>
                            <label>توضیحات</label>
                            <textarea
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              style={styles.textarea}
                              rows="3"
                              placeholder="اقدامات انجام‌شده را وارد کنید"
                            />
                          </div>
                          <div style={styles.formActions}>
                            <button onClick={() => handleSubmitResponse(item._id)} style={styles.submitButton}>
                              ثبت پاسخ
                            </button>
                            <button onClick={handleCancelEdit} style={styles.cancelButton}>
                              انصراف
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(item)}
                          style={styles.editButton}
                          disabled={item.status === "Fixed"}
                        >
                          {item.status === "Awaiting Review"
                            ? "به‌روزرسانی پاسخ"
                            : item.status === "Fixed"
                            ? "تکمیل شده"
                            : "افزودن پاسخ"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const baseBorder = "1px solid #d0d7de";

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#f5f5f5", padding: "2rem" },
  content: { maxWidth: "1200px", margin: "0 auto", backgroundColor: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" },
  title: { marginBottom: "1rem", color: "#0f172a", textAlign: "center" },
  actionsRow: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "16px" },
  backButton: { padding: "0.6rem 1rem", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" },
  filters: { display: "flex", gap: "12px", alignItems: "flex-end", flexWrap: "wrap" },
  filterLabel: { display: "block", marginBottom: 4, color: "#334155", fontWeight: 600 },
  filterInput: { padding: "0.45rem 0.6rem", borderRadius: 6, border: baseBorder, minWidth: 120 },
  confirmBtn: { padding: "0.6rem 1.1rem", backgroundColor: "#0ea5e9", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", border: baseBorder },
  th: { padding: "0.75rem", textAlign: "center", border: baseBorder, backgroundColor: "#e9f3ff", fontWeight: "700" },
  td: { padding: "0.75rem", border: baseBorder, verticalAlign: "top", textAlign: "center" },
  statusBadge: { padding: "0.25rem 0.75rem", borderRadius: "12px", fontSize: "0.875rem", fontWeight: "600", display: "inline-block" },
  statusFixed: { backgroundColor: "#d4edda", color: "#155724" },
  statusPending: { backgroundColor: "#fff3cd", color: "#856404" },
  statusIncomplete: { backgroundColor: "#ffe4e6", color: "#9f1239" },
  imageContainer: { display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" },
  image: { width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px", cursor: "pointer", border: baseBorder },
  editButton: { padding: "0.5rem 1rem", backgroundColor: "#0ea5e9", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
  editForm: { display: "flex", flexDirection: "column", gap: "0.75rem", padding: "0.75rem", backgroundColor: "#f8fafc", borderRadius: "8px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "0.35rem", textAlign: "right" },
  fileInput: { padding: "0.5rem", border: baseBorder, borderRadius: 6 },
  fileCount: { fontSize: "0.875rem", color: "#475569" },
  textarea: { padding: "0.5rem", border: baseBorder, borderRadius: "6px", resize: "vertical", minHeight: "60px" },
  formActions: { display: "flex", gap: "0.5rem", justifyContent: "flex-end", flexWrap: "wrap" },
  submitButton: { padding: "0.5rem 1rem", backgroundColor: "#22c55e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
  cancelButton: { padding: "0.5rem 1rem", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
  empty: { textAlign: "center", padding: "2rem", color: "#475569" },
};

export default UserNonConformances;