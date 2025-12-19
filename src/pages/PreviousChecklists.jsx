import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import DownloadDropdown from "../components/DownloadDropdown";

const PreviousChecklists = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [checklists, setChecklists] = useState([]);
  const [editingChecklist, setEditingChecklist] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        // فیلتر بر اساس نوع چک‌لیست - backend خودش فیلتر می‌کند
        const { data } = await API.get(`/checklists`, { params: { type } });
        setChecklists(data || []);
        setError("");
      } catch (err) {
        console.error("Error fetching checklists:", err);
        setError("خطا در دریافت چک‌لیست‌ها");
        setChecklists([]);
      }
    };

    if (type) fetchChecklists();
  }, [type]);

  const startEdit = (checklist) => {
    setEditingChecklist({
      ...checklist,
      items: checklist.items.map(item => ({...item}))
    });
  };

  const cancelEdit = () => {
    setEditingChecklist(null);
  };

  const updateEditItem = (idx, field, value) => {
    setEditingChecklist(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === idx ? { ...item, [field]: value } : item
      )
    }));
  };

  const saveEdit = async () => {
    if (!editingChecklist) return;
    setSaving(true);
    try {
      const { data } = await API.put(`/checklists/${editingChecklist._id}`, {
        title: editingChecklist.title,
        items: editingChecklist.items,
      });
      setChecklists(prev => prev.map(c => c._id === editingChecklist._id ? data.checklist : c));
      setEditingChecklist(null);
    } catch (e) {
      alert(e?.response?.data?.message || "به‌روزرسانی ناموفق بود");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h2 style={styles.title}>چک‌لیست‌های قبلی ({getTypeName(type)})</h2>
        
        <div style={styles.buttonRow}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            🔙 بازگشت
          </button>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        {/* حالت ویرایش */}
        {editingChecklist && (
          <div style={styles.editModal}>
            <div style={styles.editCard}>
              <div style={styles.editHeader}>
                <h3 style={styles.editTitle}>ویرایش چک‌لیست</h3>
                <div style={styles.editActions}>
                  <button onClick={saveEdit} disabled={saving} style={styles.saveBtn}>
                    {saving ? "در حال ذخیره..." : "💾 ذخیره تغییرات"}
                  </button>
                  <button onClick={cancelEdit} style={styles.cancelBtn}>انصراف</button>
                </div>
              </div>
              
              <div style={styles.editTitleRow}>
                <label style={styles.label}>عنوان:</label>
                <input
                  value={editingChecklist.title}
                  onChange={(e) => setEditingChecklist({...editingChecklist, title: e.target.value})}
                  style={styles.input}
                />
              </div>

              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>مغایرت</th>
                      <th style={styles.th}>وضعیت</th>
                      <th style={styles.th}>توضیحات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editingChecklist.items.map((item, idx) => (
                      <tr key={idx} style={{ background: idx % 2 === 0 ? "#f0f9ff" : "#fff" }}>
                        <td style={styles.td}>{item.question}</td>
                        <td style={styles.td}>
                          <select
                            value={item.answer}
                            onChange={(e) => updateEditItem(idx, "answer", e.target.value)}
                            style={styles.selectSmall}
                          >
                            <option value="">انتخاب</option>
                            <option value="دارد">دارد</option>
                            <option value="ندارد">ندارد</option>
                            <option value="عدم کاربرد">عدم کاربرد</option>
                          </select>
                        </td>
                        <td style={styles.td}>
                          <input
                            value={item.comment || ""}
                            onChange={(e) => updateEditItem(idx, "comment", e.target.value)}
                            style={styles.inputSmall}
                            placeholder="توضیحات..."
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* لیست چک‌لیست‌ها */}
        {checklists.length === 0 && !error ? (
          <div style={styles.emptyState}>
            چک‌لیستی برای این نوع ثبت نشده است.
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>عنوان</th>
                  <th style={styles.th}>تاریخ تکمیل</th>
                  <th style={styles.th}>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {checklists.map((c, idx) => (
                  <tr key={c._id} style={{ background: idx % 2 === 0 ? "#f0f9ff" : "#fff" }}>
                    <td style={styles.td}>
                      <strong>{c.title}</strong>
                    </td>
                    <td style={styles.td}>
                      {new Date(c.createdAt).toLocaleDateString("fa-IR")}
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionBtns}>
                        <button
                          onClick={() => navigate("/checklist-view", { state: { checklist: c } })}
                          style={styles.primaryBtn}
                        >
                          مشاهده چک‌لیست
                        </button>
                        <DownloadDropdown checklist={c} />
                        <button
                          onClick={() => startEdit(c)}
                          style={styles.editBtn}
                        >
                          ویرایش
                        </button>
                      </div>
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

// تبدیل نوع به نام فارسی
const getTypeName = (type) => {
  const names = {
    tablo: "تابلو برق",
    balabar: "بالابر",
    kapsol: "کپسول‌های اطفا حریق",
    darbast: "داربست‌بندی",
    firebox: "فایرباکس‌ها",
    forklift: "لیفتراک",
  };
  return names[type] || type;
};

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)",
    direction: "rtl",
    padding: "24px",
  },
  content: {
    width: "100%",
    maxWidth: 1400,
    margin: "0 auto",
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    minHeight: "calc(100vh - 48px)",
  },
  title: {
    margin: "0 0 20px 0",
    color: "#0369a1",
    fontSize: "1.5rem",
    textAlign: "center",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 20,
  },
  backBtn: {
    padding: "10px 20px",
    background: "#e0f2fe",
    color: "#0369a1",
    border: "1px solid #bae6fd",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 500,
  },
  errorBox: {
    color: "#dc2626",
    textAlign: "center",
    padding: 16,
    background: "#fee2e2",
    borderRadius: 8,
    border: "1px solid #fca5a5",
    marginBottom: 20,
  },
  emptyState: {
    textAlign: "center",
    color: "#64748b",
    padding: 40,
    background: "#f0f9ff",
    borderRadius: 10,
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    background: "#0284c7",
    color: "#fff",
    padding: "14px 12px",
    border: "1px solid #bae6fd",
    textAlign: "center",
    fontWeight: 600,
  },
  td: {
    padding: "12px",
    border: "1px solid #bae6fd",
    textAlign: "center",
    verticalAlign: "middle",
  },
  actionBtns: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  primaryBtn: {
    padding: "8px 14px",
    background: "#0284c7",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "0.85rem",
  },
  editBtn: {
    padding: "8px 14px",
    background: "#e0f2fe",
    color: "#0369a1",
    border: "1px solid #bae6fd",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "0.85rem",
  },
  
  // Edit Modal
  editModal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    zIndex: 1000,
  },
  editCard: {
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    maxWidth: 900,
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
  },
  editHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 12,
  },
  editTitle: {
    margin: 0,
    color: "#0369a1",
    fontSize: "1.3rem",
  },
  editActions: {
    display: "flex",
    gap: 10,
  },
  saveBtn: {
    padding: "10px 20px",
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.95rem",
  },
  cancelBtn: {
    padding: "10px 20px",
    background: "#64748b",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 500,
  },
  editTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  label: {
    fontWeight: 600,
    color: "#0369a1",
  },
  input: {
    flex: 1,
    padding: 10,
    border: "1px solid #bae6fd",
    borderRadius: 8,
    fontSize: "1rem",
  },
  inputSmall: {
    width: "100%",
    padding: 8,
    border: "1px solid #bae6fd",
    borderRadius: 6,
    fontSize: "0.9rem",
  },
  selectSmall: {
    padding: 8,
    border: "1px solid #bae6fd",
    borderRadius: 6,
    fontSize: "0.9rem",
    minWidth: 100,
  },
};

export default PreviousChecklists;
