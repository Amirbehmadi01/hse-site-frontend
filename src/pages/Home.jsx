import { useState } from "react";
import { Link } from "react-router-dom";
import { commonStyles, theme } from "../styles";

const Home = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [openNC, setOpenNC] = useState(false);
  const [selectedNCUnit, setSelectedNCUnit] = useState(null);

  const units = ["تولید ۱", "تزریق پلاستیک", "نت (نگهداری و تعمیرات)", "انبارها"];

  const checklists = [
    { id: 1, name: "چک‌لیست تابلو برق", type: "tablo" },
    { id: 2, name: "چک‌لیست بالابر", type: "balabar" },
    { id: 3, name: "چک‌لیست داربست‌بندی و کار در ارتفاع", type: "darbast" },
    { id: 4, name: "چک‌لیست 5S سازماندهی محیط کار", type: "5s" },
    { id: 5, name: "چک‌لیست کپسول‌های اطفا حریق", type: "kapsol" },
    { id: 6, name: "چک‌لیست فایرباکس‌ها", type: "firebox" },
  ];

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={commonStyles.pageContainer}>
      <div style={commonStyles.contentWrapper}>
        <h1 style={commonStyles.title}>✅ لیست چک‌لیست‌ها</h1>

        {/* Non-Conformities stand-alone section */}
        <div style={{ width: "100%", maxWidth: 600 }}>
          <button
            onClick={() => {
              setOpenNC(!openNC);
              if (openNC) setSelectedNCUnit(null);
            }}
            style={{
              width: "100%",
              textAlign: "right",
              padding: theme.spacing.md,
              fontSize: "1.1rem",
              fontWeight: "600",
              borderRadius: theme.borderRadius.md,
              border: "2px solid " + theme.colors.primary,
              backgroundColor: theme.colors.background,
              color: theme.colors.primary,
              cursor: "pointer",
              fontFamily: theme.font.family,
              transition: "all 0.2s ease",
              marginBottom: theme.spacing.md,
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = theme.colors.primary;
              e.target.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = theme.colors.background;
              e.target.style.color = theme.colors.primary;
            }}
          >
            ثبت عدم انطباق
          </button>

          {openNC && !selectedNCUnit && (
            <div
              style={{
                padding: theme.spacing.md,
                backgroundColor: theme.colors.background,
                border: "1px solid " + theme.colors.border,
                borderRadius: theme.borderRadius.md,
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing.sm,
              }}
            >
              {units.map((u) => (
                <button
                  key={u}
                  onClick={() => setSelectedNCUnit(u)}
                  style={{
                    width: "100%",
                    textAlign: "right",
                    padding: theme.spacing.md,
                    fontSize: "1rem",
                    fontWeight: "600",
                    borderRadius: theme.borderRadius.md,
                    border: "2px solid " + theme.colors.primary,
                    backgroundColor: theme.colors.background,
                    color: theme.colors.primary,
                    cursor: "pointer",
                    fontFamily: theme.font.family,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = theme.colors.primary;
                    e.target.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = theme.colors.background;
                    e.target.style.color = theme.colors.primary;
                  }}
                >
                  {u}
                </button>
              ))}
            </div>
          )}

          {openNC && selectedNCUnit && (
            <div
              style={{
                padding: theme.spacing.md,
                backgroundColor: theme.colors.background,
                border: "1px solid " + theme.colors.border,
                borderRadius: theme.borderRadius.md,
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing.sm,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: theme.spacing.sm }}>
                <button
                  onClick={() => setSelectedNCUnit(null)}
                  style={{
                    ...commonStyles.buttonSecondary,
                    padding: "6px 12px",
                    fontSize: "0.9rem",
                  }}
                >
                  ← بازگشت
                </button>
                <div style={{ fontWeight: 600, color: theme.colors.primary }}>{selectedNCUnit}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.sm }}>
                <Link to="/nonconformities/register" state={{ unit: selectedNCUnit }} style={{ textDecoration: "none", width: "100%" }}>
                  <button
                    style={{
                      ...commonStyles.button,
                      width: "100%",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = theme.colors.primaryHover)}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = theme.colors.primary)}
                  >
                    ثبت عدم انطباق جدید
                  </button>
                </Link>
                <Link to={`/nonconformities/monthly/${selectedNCUnit}`} style={{ textDecoration: "none", width: "100%" }}>
                  <button
                    style={{
                      ...commonStyles.buttonSecondary,
                      width: "100%",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = theme.colors.secondaryHover)}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = theme.colors.secondary)}
                  >
                    مشاهده عدم انطباق‌های ماهانه
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: "600px",
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing.md,
          }}
        >
          {checklists.map((item, index) => (
            <div key={item.id} style={{ width: "100%" }}>
              <button
                onClick={() => toggleOpen(index)}
                style={{
                  width: "100%",
                  textAlign: "right",
                  padding: theme.spacing.md,
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  borderRadius: theme.borderRadius.md,
                  border: "2px solid " + theme.colors.primary,
                  backgroundColor: theme.colors.background,
                  color: theme.colors.primary,
                  cursor: "pointer",
                  fontFamily: theme.font.family,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = theme.colors.primary;
                  e.target.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = theme.colors.background;
                  e.target.style.color = theme.colors.primary;
                }}
              >
                {item.name}
              </button>

              {openIndex === index && (
                <div
                  style={{
                    marginTop: theme.spacing.sm,
                    padding: theme.spacing.md,
                    backgroundColor: theme.colors.background,
                    border: "1px solid " + theme.colors.border,
                    borderRadius: theme.borderRadius.md,
                    display: "flex",
                    flexDirection: "column",
                    gap: theme.spacing.sm,
                    alignItems: "center",
                  }}
                >
                  <Link
                    to={`/checklist/${item.type}/previous`}
                    style={{ textDecoration: "none", width: "100%", maxWidth: "400px" }}
                  >
                    <button
                      style={{
                        ...commonStyles.button,
                        width: "100%",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = theme.colors.primaryHover;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = theme.colors.primary;
                      }}
                    >
                      مشاهده چک‌لیست‌های قبلی
                    </button>
                  </Link>
                  <Link
                    to={`/checklist/${item.type}`}
                    style={{ textDecoration: "none", width: "100%", maxWidth: "400px" }}
                  >
                    <button
                      style={{
                        ...commonStyles.buttonSecondary,
                        width: "100%",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = theme.colors.secondaryHover;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = theme.colors.secondary;
                      }}
                    >
                      تکمیل چک‌لیست جدید
                    </button>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
