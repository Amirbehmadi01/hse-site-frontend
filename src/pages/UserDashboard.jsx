import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../services/api.js";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({ reviewedItems: [], unseenCount: 0 });
  const [showAlerts, setShowAlerts] = useState(true);
  const [showPassModal, setShowPassModal] = useState(false);
  const [passForm, setPassForm] = useState({ current: "", next: "", confirm: "" });
  const [passError, setPassError] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    if (!user?.department) return;
    try {
      const response = await API.get("/nonconformities/notifications", {
        params: {
          department: user.department,
          currentMonth: "true",
        },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    setPassError("");
    if (passForm.next !== passForm.confirm) {
      setPassError("تکرار رمز با رمز جدید برابر نیست");
      return;
    }
    try {
      await API.post("/auth/change-password", {
        userId: user.id,
        currentPassword: passForm.current,
        newPassword: passForm.next,
      });
      alert("رمز عبور به‌روزرسانی شد");
      setShowPassModal(false);
      setPassForm({ current: "", next: "", confirm: "" });
    } catch (err) {
      setPassError(err.response?.data?.message || "خطا در تغییر رمز");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.card}>
          <header style={styles.header}>
            <div style={styles.headerLeft}>
              <div style={styles.unitLabel}>{user?.department}</div>
              <div style={styles.subUnit}>{user?.subunit}</div>
            </div>
            <div style={styles.headerRight}>
              <button onClick={() => setShowPassModal(true)} style={styles.actionBtn}>
                تغییر رمز
              </button>
              <button onClick={handleLogout} style={styles.logoutButton}>
                خروج
              </button>
            </div>
          </header>

          {/* Notifications Section */}
          {showAlerts && (notifications.unseenCount > 0 || notifications.reviewedItems.length > 0) && (
            <div style={styles.alertsContainer}>
              <button onClick={() => setShowAlerts(false)} style={styles.closeButton}>
                ×
              </button>
              
              {notifications.unseenCount > 0 && (
                <div style={styles.alertCard}>
                  <div style={styles.alertHeader}>
                    <span style={styles.alertBadge}>جدید</span>
                    <span style={styles.alertText}>
                      شما {notifications.unseenCount} عدم انطباق دیده‌نشده دارید.
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setShowAlerts(false);
                      navigate("/user/nonconformities");
                    }}
                    style={styles.alertButton}
                  >
                    مشاهده
                  </button>
                </div>
              )}

              {notifications.reviewedItems.length > 0 && (
                <div style={styles.reviewsCard}>
                  <div style={styles.reviewsTitle}>بررسی‌های اخیر:</div>
                  <div style={styles.reviewsList}>
                    {notifications.reviewedItems.slice(0, 5).map((item) => (
                      <div key={item._id} style={styles.reviewItem}>
                        <span style={item.status === "Fixed" ? styles.statusApproved : styles.statusRejected}>
                          {item.status === "Fixed" ? "✅ تایید" : "❌ رد / ناقص"}
                        </span>
                        <span style={styles.reviewDesc}>
                          {item.description?.substring(0, 40)}...
                        </span>
                        <span style={styles.reviewMeta}>
                          توسط {item.reviewedBy?.username || "Admin"} - {new Date(item.reviewedDate).toLocaleDateString("fa-IR")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <nav style={styles.nav}>
            <button
              onClick={() => navigate("/user/nonconformities")}
              style={styles.navButton}
            >
              عدم انطباق‌های من
              {notifications.unseenCount > 0 && <span style={styles.badge}>{notifications.unseenCount}</span>}
            </button>
          </nav>

          {/* Main content area */}
          <div style={styles.mainArea}>
            <h2 style={styles.welcomeTitle}>خوش آمدید</h2>
            <p style={styles.welcomeText}>
              برای مشاهده و مدیریت عدم انطباق‌های خود، روی دکمه «عدم انطباق‌های من» کلیک کنید.
            </p>
          </div>
        </div>
      </div>

      {showPassModal && (
        <div style={styles.modalOverlay} onClick={() => setShowPassModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>تغییر رمز عبور</h3>
            {passError && <div style={styles.error}>{passError}</div>}
            <form onSubmit={submitPassword} style={styles.form}>
              <input
                type="password"
                placeholder="رمز فعلی"
                value={passForm.current}
                onChange={(e) => setPassForm({ ...passForm, current: e.target.value })}
                style={styles.input}
              />
              <input
                type="password"
                placeholder="رمز جدید"
                value={passForm.next}
                onChange={(e) => setPassForm({ ...passForm, next: e.target.value })}
                style={styles.input}
              />
              <input
                type="password"
                placeholder="تکرار رمز جدید"
                value={passForm.confirm}
                onChange={(e) => setPassForm({ ...passForm, confirm: e.target.value })}
                style={styles.input}
              />
              <div style={styles.modalButtons}>
                <button type="submit" style={styles.saveBtn}>ثبت</button>
                <button type="button" style={styles.secondaryBtn} onClick={() => setShowPassModal(false)}>انصراف</button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  content: {
    width: "100%",
    minHeight: "100vh",
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#0284c7",
    color: "white",
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: { 
    display: "flex", 
    flexDirection: "column", 
    gap: 4 
  },
  unitLabel: { 
    fontWeight: 700, 
    fontSize: "1.2rem" 
  },
  subUnit: { 
    fontSize: "0.95rem", 
    opacity: 0.9 
  },
  headerRight: { 
    display: "flex", 
    gap: 12 
  },
  actionBtn: {
    padding: "10px 16px",
    backgroundColor: "rgba(255,255,255,0.15)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.35)",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 500,
  },
  logoutButton: {
    padding: "10px 16px",
    backgroundColor: "rgba(0,0,0,0.25)",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 500,
  },
  
  // Notifications
  alertsContainer: {
    margin: "16px 24px",
    padding: "16px",
    backgroundColor: "#f0f9ff",
    border: "1px solid #bae6fd",
    borderRadius: 12,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 8,
    left: 8,
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#64748b",
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  alertCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    border: "1px solid #bae6fd",
  },
  alertHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  alertBadge: {
    backgroundColor: "#ef4444",
    color: "white",
    padding: "4px 10px",
    borderRadius: 6,
    fontSize: "0.85rem",
    fontWeight: 600,
  },
  alertText: {
    color: "#0369a1",
    fontWeight: 500,
  },
  alertButton: {
    padding: "8px 16px",
    backgroundColor: "#0284c7",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 500,
  },
  reviewsCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    border: "1px solid #bae6fd",
  },
  reviewsTitle: {
    fontWeight: 600,
    color: "#0369a1",
    marginBottom: 12,
    fontSize: "1rem",
  },
  reviewsList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  reviewItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    backgroundColor: "#f0f9ff",
    borderRadius: 6,
    flexWrap: "wrap",
  },
  statusApproved: {
    color: "#22c55e",
    fontWeight: 600,
    fontSize: "0.9rem",
  },
  statusRejected: {
    color: "#ef4444",
    fontWeight: 600,
    fontSize: "0.9rem",
  },
  reviewDesc: {
    color: "#334155",
    flex: 1,
    fontSize: "0.9rem",
  },
  reviewMeta: {
    color: "#64748b",
    fontSize: "0.8rem",
  },
  
  nav: {
    display: "flex",
    gap: 16,
    padding: "16px 24px",
    backgroundColor: "white",
    borderBottom: "1px solid #e0f2fe",
  },
  navButton: {
    padding: "12px 24px",
    border: "2px solid #0284c7",
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: 600,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -8,
    left: -8,
    backgroundColor: "#ef4444",
    color: "white",
    borderRadius: "50%",
    width: 24,
    height: 24,
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
  },
  
  mainArea: {
    padding: "40px 24px",
    textAlign: "center",
  },
  welcomeTitle: {
    color: "#0369a1",
    fontSize: "1.5rem",
    marginBottom: 12,
  },
  welcomeText: {
    color: "#64748b",
    fontSize: "1rem",
  },
  
  // Modal
  modalOverlay: { 
    position: "fixed", 
    inset: 0, 
    background: "rgba(0,0,0,0.5)", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    padding: 16, 
    zIndex: 2000 
  },
  modal: { 
    background: "#fff", 
    padding: 24, 
    borderRadius: 12, 
    width: "90%", 
    maxWidth: 420,
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
  },
  modalTitle: {
    margin: "0 0 16px 0",
    color: "#0369a1",
    fontSize: "1.2rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  input: { 
    width: "100%", 
    padding: 12, 
    borderRadius: 8, 
    border: "1px solid #bae6fd",
    fontSize: "1rem",
  },
  modalButtons: {
    display: "flex",
    gap: 12,
    marginTop: 8,
  },
  saveBtn: { 
    flex: 1,
    padding: "12px 16px", 
    background: "#0284c7", 
    color: "#fff", 
    border: "none", 
    borderRadius: 8, 
    cursor: "pointer",
    fontWeight: 600,
  },
  secondaryBtn: { 
    flex: 1,
    padding: "12px 16px", 
    background: "#64748b", 
    color: "#fff", 
    border: "none", 
    borderRadius: 8, 
    cursor: "pointer",
    fontWeight: 600,
  },
  error: { 
    background: "#fee2e2", 
    color: "#dc2626", 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 12,
    fontSize: "0.9rem",
  },
};

export default UserDashboard;
