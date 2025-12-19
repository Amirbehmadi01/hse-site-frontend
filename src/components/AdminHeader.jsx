// 
//12/9

// src/components/AdminHeader.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../services/api.js";

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showPassModal, setShowPassModal] = useState(false);
  const [passForm, setPassForm] = useState({ current: "", newPass: "", confirm: "" });
  const [error, setError] = useState("");

  const departments = ["Production 1", "Plastic Injection", "Maintenance", "Warehouse"];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChangePass = async (e) => {
    e.preventDefault();
    setError("");
    if (passForm.newPass !== passForm.confirm) return setError("تکرار رمز هماهنگ نیست");
    try {
      await API.post("/auth/change-password", {
        userId: user.id,
        currentPassword: passForm.current,
        newPassword: passForm.newPass,
      });
      alert("رمز با موفقیت تغییر کرد");
      setShowPassModal(false);
      setPassForm({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      setError(err.response?.data?.message || "خطا در تغییر رمز");
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <h1 style={{ margin: 0 }}>پنل مدیریت</h1>
      </div>

      <div style={styles.right}>
        <span style={styles.userText}>{user?.username}</span>

        <button style={styles.btn} onClick={() => setShowPassModal(true)}>تغییر رمز</button>

        <button style={styles.logout} onClick={handleLogout}>خروج</button>
      </div>

      {/* Password Modal */}
      {showPassModal && (
        <div style={styles.modalOverlay} onClick={() => setShowPassModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>تغییر رمز</h3>
            {error && <div style={styles.error}>{error}</div>}
            <form onSubmit={handleChangePass}>
              <input placeholder="رمز فعلی" type="password" value={passForm.current} onChange={(e) => setPassForm({ ...passForm, current: e.target.value })} style={styles.input} />
              <input placeholder="رمز جدید" type="password" value={passForm.newPass} onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })} style={styles.input} />
              <input placeholder="تکرار رمز جدید" type="password" value={passForm.confirm} onChange={(e) => setPassForm({ ...passForm, confirm: e.target.value })} style={styles.input} />
              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" style={styles.primary}>ثبت</button>
                <button type="button" style={styles.secondary} onClick={() => setShowPassModal(false)}>انصراف</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

const styles = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", background: "#007bff", color: "#fff", direction: "rtl" },
  left: {},
  right: { display: "flex", gap: 12, alignItems: "center" },
  userText: { fontWeight: 600 },
  btn: { background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "0.4rem 0.8rem", borderRadius: 6, cursor: "pointer" },
  logout: { background: "rgba(0,0,0,0.12)", color: "#fff", padding: "0.4rem 0.8rem", borderRadius: 6, border: "none", cursor: "pointer" },
  dropdown: { position: "absolute", top: "110%", right: 0, background: "#fff", color: "#333", borderRadius: 6, boxShadow: "0 6px 18px rgba(0,0,0,0.12)" },
  dropItem: { display: "block", padding: "0.6rem 1rem", cursor: "pointer", border: "none", background: "transparent", width: "100%", textAlign: "right" },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000 },
  modal: { background: "#fff", padding: 20, borderRadius: 8, width: "90%", maxWidth: 420, direction: "rtl" },
  input: { width: "100%", padding: 8, marginBottom: 8, borderRadius: 6, border: "1px solid #ddd" },
  primary: { background: "#007bff", color: "#fff", padding: "0.6rem 1rem", border: "none", borderRadius: 6, cursor: "pointer" },
  secondary: { background: "#6c757d", color: "#fff", padding: "0.6rem 1rem", border: "none", borderRadius: 6, cursor: "pointer" },
  error: { background: "#fee", color: "#900", padding: 8, borderRadius: 6, marginBottom: 8 },
};

export default AdminHeader;

