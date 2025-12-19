import { useState, useRef, useEffect } from "react";
import { exportFullChecklist, exportNonCompliancesOnly } from "../utils/excelExport";
import { commonStyles, theme } from "../styles";

const DownloadDropdown = ({ checklist }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const containerStyle = {
    position: "relative",
    display: "inline-block",
  };

  const buttonStyle = {
    ...commonStyles.button,
    fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
    padding: "6px 12px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const dropdownStyle = {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: "8px",
    backgroundColor: theme.colors.background,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    minWidth: "220px",
    zIndex: 1000,
    overflow: "hidden",
  };

  const dropdownItemStyle = {
    padding: "12px 16px",
    cursor: "pointer",
    fontFamily: theme.font.family,
    fontSize: "0.9rem",
    borderBottom: `1px solid ${theme.colors.border}`,
    transition: "background-color 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const handleFullExport = () => {
    exportFullChecklist(checklist);
    setIsOpen(false);
  };

  const handleNonComplianceExport = () => {
    exportNonCompliancesOnly(checklist);
    setIsOpen(false);
  };

  return (
    <div style={containerStyle} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = theme.colors.primaryHover;
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = theme.colors.primary;
        }}
      >
        📥 دانلود
        <span style={{ fontSize: "0.7rem" }}>{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div style={dropdownStyle}>
          <div
            style={dropdownItemStyle}
            onClick={handleFullExport}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(112, 130, 56, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            📄 دانلود چک‌لیست کامل
          </div>
          <div
            style={{
              ...dropdownItemStyle,
              borderBottom: "none",
            }}
            onClick={handleNonComplianceExport}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(112, 130, 56, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            ⚠️ دانلود فقط مغایرت‌ها
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadDropdown;

