// src/pages/AdminResponses.jsx
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

const AdminResponses = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedUnit, setExpandedUnit] = useState(null);
  const [expandedSubUnit, setExpandedSubUnit] = useState(null);
  const [seenItems, setSeenItems] = useState(new Set());
  const [reviewNotes, setReviewNotes] = useState({}); // { itemId: "نظر..." }

  useEffect(() => {
    if (!isAdmin) {
      navigate("/user/dashboard");
      return;
    }
    fetchData();
    const t = setInterval(fetchData, 30000);
    return () => clearInterval(t);
  }, [isAdmin, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await API.get("/nonconformities/responses");
      setResponses(res.data || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const note = reviewNotes[id] || "";
      await API.post(`/nonconformities/${id}/approve`, { 
        adminId: user?.id,
        reviewNote: note 
      });
      markAsSeen(id);
      setReviewNotes(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      fetchData();
    } catch (error) {
      alert("خطا در تایید پاسخ");
    }
  };

  const handleReject = async (id) => {
    try {
      const note = reviewNotes[id] || "";
      await API.post(`/nonconformities/${id}/reject`, { 
        adminId: user?.id,
        reviewNote: note 
      });
      markAsSeen(id);
      setReviewNotes(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      fetchData();
    } catch (error) {
      alert("خطا در رد پاسخ");
    }
  };

  const markAsSeen = (id) => {
    setSeenItems(prev => new Set([...prev, id]));
  };

  // محاسبه تعداد پاسخ‌های مشاهده نشده برای هر واحد و زیرواحد
  const getUnseenCountForUnit = (unit) => {
    let count = 0;
    const subUnits = unitsHierarchy[unit] || [];
    subUnits.forEach(subUnit => {
      const items = responses[subUnit] || [];
      items.forEach(item => {
        if (!seenItems.has(item._id)) count++;
      });
    });
    return count;
  };

  const getUnseenCountForSubUnit = (subUnit) => {
    const items = responses[subUnit] || [];
    return items.filter(item => !seenItems.has(item._id)).length;
  };

  // دریافت آیتم‌های یک زیرواحد خاص
  const getSubUnitItems = (subUnit) => {
    return responses[subUnit] || [];
  };

  if (loading) return (
    <div style={styles.container}>
      <AdminHeader />
      <div style={styles.loadingBox}>در حال بارگذاری...</div>
    </div>
  );

  const departments = Object.keys(unitsHierarchy);

  return (
    <div style={styles.container}>
      <AdminHeader />
      <div style={styles.content}>
        <div style={styles.header}>
          <h2 style={styles.title}>پاسخ‌های دریافتی</h2>
          <button
            onClick={() => navigate("/admin/dashboard")}
            style={styles.backBtn}
          >
            ← بازگشت به داشبورد
          </button>
        </div>

        <div style={styles.layout}>
          {/* منوی سمت چپ - واحدها و زیرواحدها */}
          <div style={styles.sidebar}>
            <h3 style={styles.sidebarTitle}>واحدها</h3>
            {departments.map((unit) => {
              const unitUnseenCount = getUnseenCountForUnit(unit);
              const isExpanded = expandedUnit === unit;
              const subUnits = unitsHierarchy[unit] || [];
              
              return (
                <div key={unit} style={styles.unitBlock}>
                  <button
                    onClick={() => {
                      setExpandedUnit(isExpanded ? null : unit);
                      setExpandedSubUnit(null);
                    }}
                    style={{
                      ...styles.unitBtn,
                      background: isExpanded ? "#0284c7" : "#f0f9ff",
                      color: isExpanded ? "#fff" : "#0369a1",
                    }}
                  >
                    <span>{unit}</span>
                    {unitUnseenCount > 0 && (
                      <span style={styles.badge}>{unitUnseenCount}</span>
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div style={styles.subUnitList}>
                      {subUnits.map((subUnit) => {
                        const subUnseenCount = getUnseenCountForSubUnit(subUnit);
                        const isSubExpanded = expandedSubUnit === subUnit;
                        
                        return (
                          <button
                            key={subUnit}
                            onClick={() => setExpandedSubUnit(isSubExpanded ? null : subUnit)}
                            style={{
                              ...styles.subUnitBtn,
                              background: isSubExpanded ? "#e0f2fe" : "#fff",
                              borderColor: isSubExpanded ? "#0284c7" : "#bae6fd",
                            }}
                          >
                            <span>{subUnit}</span>
                            {subUnseenCount > 0 && (
                              <span style={styles.badgeSmall}>{subUnseenCount}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* محتوای اصلی - نمایش پاسخ‌ها */}
          <div style={styles.mainContent}>
            {!expandedUnit ? (
              <div style={styles.placeholder}>
                یک واحد را از منوی سمت چپ انتخاب کنید
              </div>
            ) : !expandedSubUnit ? (
              <div style={styles.placeholder}>
                یک زیرواحد را انتخاب کنید
              </div>
            ) : (
              <div>
                <h3 style={styles.sectionTitle}>
                  پاسخ‌های {expandedUnit} - {expandedSubUnit}
                </h3>
                
                {getSubUnitItems(expandedSubUnit).length === 0 ? (
                  <div style={styles.emptyState}>پاسخی برای بررسی وجود ندارد</div>
                ) : (
                  getSubUnitItems(expandedSubUnit).map((item) => (
                    <div
                      key={item._id}
                      style={{
                        ...styles.responseCard,
                        borderColor: seenItems.has(item._id) ? "#bae6fd" : "#0284c7",
                        background: seenItems.has(item._id) ? "#fff" : "#f0f9ff",
                      }}
                      onClick={() => markAsSeen(item._id)}
                    >
                      <div style={styles.cardHeader}>
                        <div>
                          <strong style={{ color: "#0369a1" }}>S: {item.s}</strong>
                          {!seenItems.has(item._id) && (
                            <span style={styles.newBadge}>جدید</span>
                          )}
                        </div>
                        <span style={styles.date}>
                          {new Date(item.date).toLocaleDateString("fa-IR")}
                        </span>
                      </div>
                      
                      <div style={styles.description}>{item.description}</div>
                      
                      {/* تصاویر قبل */}
                      {item.beforeImages && item.beforeImages.length > 0 && (
                        <div style={styles.imagesSection}>
                          <strong>تصاویر قبل:</strong>
                          <div style={styles.imageGrid}>
                            {item.beforeImages.map((img, idx) => (
                              <a
                                key={idx}
                                href={`http://localhost:5000${img}`}
                                target="_blank"
                                rel="noreferrer"
                                style={styles.imageLink}
                              >
                                <img
                                  src={`${import.meta.env.VITE_API_URL}${img}`}
                                  alt={`Before ${idx + 1}`}
                                  style={styles.thumbnail}
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* تصاویر بعد */}
                      {item.afterImages && item.afterImages.length > 0 && (
                        <div style={styles.imagesSection}>
                          <strong style={{ color: "#22c55e" }}>تصاویر پس از اصلاح:</strong>
                          <div style={styles.imageGrid}>
                            {item.afterImages.map((img, idx) => (
                              <a
                                key={idx}
                                href={`http://localhost:5000${img}`}
                                target="_blank"
                                rel="noreferrer"
                                style={styles.imageLink}
                              >
                                <img
                                  src={`${import.meta.env.VITE_API_URL}${img}`}
                                  alt={`After ${idx + 1}`}
                                  style={styles.thumbnail}
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* یادداشت‌های سرپرست */}
                      {item.notes && (
                        <div style={styles.notes}>
                          <strong>توضیحات سرپرست:</strong> {item.notes}
                        </div>
                      )}
                      
                      {/* فیلد نظر ادمین */}
                      <div style={styles.reviewNoteSection}>
                        <label style={styles.reviewNoteLabel}>نظر ادمین:</label>
                        <textarea
                          value={reviewNotes[item._id] || ""}
                          onChange={(e) => setReviewNotes(prev => ({ ...prev, [item._id]: e.target.value }))}
                          placeholder="دلیل تایید یا رد این پاسخ را وارد کنید..."
                          style={styles.reviewNoteInput}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      
                      {/* دکمه‌های عملیات */}
                      <div style={styles.actions}>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleApprove(item._id); }}
                          style={styles.approveBtn}
                        >
                          ✓ تایید (رفع شده)
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleReject(item._id); }}
                          style={styles.rejectBtn}
                        >
                          ✗ رد (ناقص)
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)",
    direction: "rtl",
  },
  loadingBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "50vh",
    fontSize: "1.2rem",
    color: "#0369a1",
  },
  content: {
    width: "100%",
    maxWidth: 1400,
    margin: "0 auto",
    padding: "24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    background: "#fff",
    padding: "16px 24px",
    borderRadius: 12,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  title: {
    margin: 0,
    color: "#0369a1",
    fontSize: "1.5rem",
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
  layout: {
    display: "flex",
    gap: 24,
    width: "100%",
    flexDirection: "row-reverse", // برای RTL - منو سمت چپ
  },
  sidebar: {
    width: 280,
    flexShrink: 0,
    background: "#fff",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    maxHeight: "calc(100vh - 200px)",
    overflowY: "auto",
  },
  sidebarTitle: {
    margin: "0 0 16px 0",
    color: "#0369a1",
    fontSize: "1.1rem",
    borderBottom: "2px solid #e0f2fe",
    paddingBottom: 8,
  },
  unitBlock: {
    marginBottom: 8,
  },
  unitBtn: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #bae6fd",
    borderRadius: 8,
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: 500,
    fontSize: "0.95rem",
    transition: "all 0.2s",
  },
  subUnitList: {
    marginTop: 8,
    marginRight: 16,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  subUnitBtn: {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #bae6fd",
    borderRadius: 6,
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.85rem",
    transition: "all 0.2s",
  },
  badge: {
    background: "#ef4444",
    color: "#fff",
    borderRadius: 10,
    padding: "2px 8px",
    fontSize: 12,
    fontWeight: 600,
  },
  badgeSmall: {
    background: "#0284c7",
    color: "#fff",
    borderRadius: 8,
    padding: "1px 6px",
    fontSize: 11,
    fontWeight: 600,
  },
  mainContent: {
    flex: 1,
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    minHeight: "calc(100vh - 200px)",
  },
  placeholder: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    color: "#64748b",
    fontSize: "1.1rem",
  },
  sectionTitle: {
    margin: "0 0 20px 0",
    color: "#0369a1",
    fontSize: "1.2rem",
    borderBottom: "2px solid #e0f2fe",
    paddingBottom: 12,
  },
  emptyState: {
    textAlign: "center",
    padding: 40,
    color: "#64748b",
    background: "#f0f9ff",
    borderRadius: 10,
  },
  responseCard: {
    border: "2px solid #bae6fd",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  newBadge: {
    background: "#22c55e",
    color: "#fff",
    padding: "2px 8px",
    borderRadius: 6,
    fontSize: 11,
    marginRight: 8,
  },
  date: {
    color: "#64748b",
    fontSize: "0.85rem",
  },
  description: {
    color: "#334155",
    marginBottom: 16,
    lineHeight: 1.6,
  },
  imagesSection: {
    marginBottom: 16,
  },
  imageGrid: {
    display: "flex",
    gap: 12,
    marginTop: 8,
    flexWrap: "wrap",
  },
  imageLink: {
    display: "block",
  },
  thumbnail: {
    width: 100,
    height: 100,
    objectFit: "cover",
    borderRadius: 8,
    border: "1px solid #bae6fd",
    transition: "transform 0.2s",
  },
  notes: {
    background: "#f0f9ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    color: "#334155",
  },
  reviewNoteSection: {
    marginBottom: 16,
  },
  reviewNoteLabel: {
    display: "block",
    marginBottom: 8,
    fontWeight: 600,
    color: "#0369a1",
  },
  reviewNoteInput: {
    width: "100%",
    padding: 12,
    border: "1px solid #bae6fd",
    borderRadius: 8,
    minHeight: 80,
    fontSize: "0.95rem",
    fontFamily: "inherit",
    resize: "vertical",
  },
  actions: {
    display: "flex",
    gap: 12,
  },
  approveBtn: {
    flex: 1,
    padding: "12px 20px",
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.95rem",
  },
  rejectBtn: {
    flex: 1,
    padding: "12px 20px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.95rem",
  },
};

export default AdminResponses;
