import { useLocation, useNavigate } from "react-router-dom";
import { getChecklistTypeName } from "../data/checklistQuestions";

const ChecklistView = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const checklist = state?.checklist;

  if (!checklist) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <p style={{ color: "#dc2626", fontSize: "1.2rem", textAlign: "center" }}>❌ چک‌لیست یافت نشد.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.card}>
          <h2 style={styles.title}>
            📋 {checklist.title} - {getChecklistTypeName(checklist.type)}
          </h2>

          <div style={styles.dateInfo}>
            <div>تاریخ تکمیل: {new Date(checklist.createdAt).toLocaleDateString("fa-IR")}</div>
          </div>

          <div style={{ overflowX: "auto", width: "100%" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>مغایرت</th>
                  <th style={styles.th}>دارد</th>
                  <th style={styles.th}>ندارد</th>
                  <th style={styles.th}>عدم کاربرد</th>
                  <th style={styles.th}>توضیحات</th>
                </tr>
              </thead>
              <tbody>
                {checklist.items.map((item, idx) => {
                  return (
                    <tr
                      key={idx}
                      style={{
                        background: idx % 2 === 0 ? "#f0f9ff" : "#fff",
                      }}
                    >
                      <td style={{ ...styles.td, width: "40%", textAlign: "right" }}>{item.question}</td>
                      <td style={styles.td}>
                        {item.answer === "دارد" ? "✓" : ""}
                      </td>
                      <td style={styles.td}>
                        {item.answer === "ندارد" ? (
                          <span style={{ color: "#dc2626", fontWeight: "bold" }}>✗</span>
                        ) : (
                          ""
                        )}
                      </td>
                      <td style={styles.td}>
                        {item.answer === "عدم کاربرد" ? "—" : ""}
                      </td>
                      <td style={styles.td}>{item.comment || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* نمایش تصویر به صورت فایل قابل کلیک */}
          {checklist.image && (
            <div style={styles.imageSection}>
              <label style={styles.imageLabel}>
                📸 عکس ضمیمه:
              </label>
              <a
                href={`http://localhost:5000${checklist.image}`}
                target="_blank"
                rel="noreferrer"
                style={styles.imageLink}
              >
                <div style={styles.fileBox}>
                  <span style={styles.fileIcon}>🖼️</span>
                  <span>مشاهده تصویر</span>
                </div>
              </a>
            </div>
          )}

          {checklist.supervisorSignature && (
            <div style={styles.signatureSection}>
              <label style={styles.signatureLabel}>
                ✍️ امضای نظارت‌کننده:
              </label>
              <div style={styles.signatureBox}>
                <img
                  src={checklist.supervisorSignature}
                  alt="امضای نظارت‌کننده"
                  style={styles.signatureImg}
                />
              </div>
            </div>
          )}

          <div style={styles.buttonRow}>
            <button
              onClick={() => navigate(-1)}
              style={styles.backBtn}
            >
              🔙 بازگشت
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)",
    direction: "rtl",
    padding: "24px",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  content: {
    width: "100%",
    maxWidth: 1100,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    border: "1px solid #bae6fd",
  },
  title: {
    textAlign: "center",
    color: "#0369a1",
    marginBottom: 16,
    fontSize: "1.5rem",
    fontWeight: 600,
  },
  dateInfo: {
    marginBottom: 20,
    textAlign: "center",
    color: "#64748b",
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
  imageSection: {
    marginTop: 24,
    textAlign: "center",
  },
  imageLabel: {
    display: "block",
    marginBottom: 12,
    fontWeight: 600,
    color: "#0369a1",
  },
  imageLink: {
    display: "inline-block",
    textDecoration: "none",
  },
  fileBox: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 24px",
    background: "#e0f2fe",
    border: "2px solid #0284c7",
    borderRadius: 10,
    color: "#0369a1",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  fileIcon: {
    fontSize: "1.5rem",
  },
  signatureSection: {
    marginTop: 24,
  },
  signatureLabel: {
    display: "block",
    marginBottom: 12,
    fontWeight: 600,
    textAlign: "center",
    color: "#0369a1",
  },
  signatureBox: {
    width: "100%",
    maxWidth: 500,
    margin: "0 auto",
    padding: 16,
    background: "#f0f9ff",
    border: "2px solid #0284c7",
    borderRadius: 12,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  signatureImg: {
    maxWidth: "100%",
    maxHeight: 150,
    borderRadius: 8,
  },
  buttonRow: {
    display: "flex",
    justifyContent: "center",
    marginTop: 24,
  },
  backBtn: {
    padding: "12px 24px",
    background: "#e0f2fe",
    color: "#0369a1",
    border: "1px solid #bae6fd",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "1rem",
  },
};

export default ChecklistView;
