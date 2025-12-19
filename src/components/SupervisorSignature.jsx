import { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";

const SupervisorSignature = ({ onSignatureSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [savedSignature, setSavedSignature] = useState(null);
  const [canvasWidth, setCanvasWidth] = useState(650);
  const signaturePadRef = useRef(null);

  useEffect(() => {
    const updateCanvasWidth = () => {
      setCanvasWidth(window.innerWidth < 768 ? Math.max(window.innerWidth - 100, 300) : 650);
    };
    
    updateCanvasWidth();
    window.addEventListener("resize", updateCanvasWidth);
    return () => window.removeEventListener("resize", updateCanvasWidth);
  }, []);

  const theme = {
    primary: "#708238", // olive green
    white: "#ffffff",
    lightGray: "#f2f2f2",
    darkGray: "#6b7280",
    border: "#e5e7eb",
  };

  const containerStyle = {
    width: "100%",
    maxWidth: "600px",
    margin: "20px auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  };

  const signatureBoxStyle = {
    width: "100%",
    minHeight: "150px",
    backgroundColor: theme.white,
    border: `2px dashed ${theme.primary}`,
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: savedSignature ? "default" : "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(112, 130, 56, 0.15)",
    padding: savedSignature ? "10px" : "20px",
    position: "relative",
  };

  const signatureBoxHoverStyle = {
    ...signatureBoxStyle,
    borderColor: "#5f6f30",
    boxShadow: "0 4px 12px rgba(112, 130, 56, 0.25)",
  };

  const placeholderStyle = {
    color: theme.darkGray,
    fontSize: "1rem",
    textAlign: "center",
    fontFamily: "system-ui, sans-serif",
  };

  const signatureImageStyle = {
    maxWidth: "100%",
    maxHeight: "130px",
    borderRadius: "8px",
    border: `1px solid ${theme.border}`,
  };

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  };

  const modalContentStyle = {
    backgroundColor: theme.white,
    borderRadius: "16px",
    padding: "24px",
    width: "100%",
    maxWidth: "700px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

  const modalTitleStyle = {
    color: theme.primary,
    fontSize: "1.5rem",
    fontWeight: "600",
    textAlign: "center",
    margin: 0,
    fontFamily: "system-ui, sans-serif",
  };

  const signaturePadContainerStyle = {
    width: "100%",
    height: "300px",
    border: `2px solid ${theme.primary}`,
    borderRadius: "12px",
    backgroundColor: theme.white,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  };

  const signatureCanvasStyle = {
    width: "100%",
    height: "100%",
    cursor: "crosshair",
    touchAction: "none", // Prevent scrolling on touch devices
  };

  const buttonRowStyle = {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
  };

  const buttonStyle = {
    backgroundColor: theme.primary,
    color: theme.white,
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    fontFamily: "system-ui, sans-serif",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(112, 130, 56, 0.2)",
  };

  const buttonSecondaryStyle = {
    ...buttonStyle,
    backgroundColor: theme.darkGray,
  };

  const editButtonStyle = {
    ...buttonStyle,
    backgroundColor: theme.lightGray,
    color: theme.primary,
    fontSize: "0.875rem",
    padding: "8px 16px",
    marginTop: "8px",
  };

  const handleOpenPad = () => {
    setIsOpen(true);
  };

  const handleClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  };

  const handleSave = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      const dataURL = signaturePadRef.current.toDataURL();
      setSavedSignature(dataURL);
      setIsOpen(false);
      
      // Call parent callback if provided
      if (onSignatureSave) {
        onSignatureSave(dataURL);
      }
    } else {
      alert("لطفاً ابتدا امضا کنید");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Clear the pad when closing without saving
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  };

  const handleEdit = () => {
    setIsOpen(true);
    // Clear the pad when editing - user can redraw
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  };

  return (
    <div style={containerStyle}>
      <div
        style={savedSignature ? signatureBoxStyle : signatureBoxStyle}
        onClick={!savedSignature ? handleOpenPad : undefined}
        onMouseEnter={(e) => {
          if (!savedSignature) {
            Object.assign(e.currentTarget.style, signatureBoxHoverStyle);
          }
        }}
        onMouseLeave={(e) => {
          if (!savedSignature) {
            Object.assign(e.currentTarget.style, signatureBoxStyle);
          }
        }}
      >
        {savedSignature ? (
          <>
            <img
              src={savedSignature}
              alt="امضای نظارت کننده"
              style={signatureImageStyle}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
              style={editButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = theme.primary;
                e.target.style.color = theme.white;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = theme.lightGray;
                e.target.style.color = theme.primary;
              }}
            >
              ویرایش امضا
            </button>
          </>
        ) : (
          <div style={placeholderStyle}>
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>✍️</div>
            <div>برای افزودن امضای نظارت‌کننده کلیک کنید</div>
          </div>
        )}
      </div>

      {isOpen && (
        <div style={modalOverlayStyle} onClick={handleClose}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={modalTitleStyle}>امضای نظارت‌کننده</h3>
            
            <div style={signaturePadContainerStyle}>
              <SignatureCanvas
                ref={signaturePadRef}
                canvasProps={{
                  width: canvasWidth,
                  height: 280,
                  className: "signature-canvas",
                }}
                style={signatureCanvasStyle}
                backgroundColor={theme.white}
                penColor={theme.primary}
              />
            </div>

            <div style={buttonRowStyle}>
              <button
                onClick={handleClear}
                style={buttonSecondaryStyle}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#4b5563";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = theme.darkGray;
                  e.target.style.transform = "translateY(0)";
                }}
              >
                پاک کردن
              </button>
              <button
                onClick={handleClose}
                style={buttonSecondaryStyle}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#4b5563";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = theme.darkGray;
                  e.target.style.transform = "translateY(0)";
                }}
              >
                انصراف
              </button>
              <button
                onClick={handleSave}
                style={buttonStyle}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#5f6f30";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = theme.primary;
                  e.target.style.transform = "translateY(0)";
                }}
              >
                ذخیره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorSignature;

