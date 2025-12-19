// import { useLocation, useNavigate } from "react-router-dom";

// function BackButton() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // دکمه فقط در صفحۀ اصلی نمایش داده نشود
//   if (location.pathname === "/") return null;

//   return (
//     <button
//       onClick={() => navigate(-1)}
//       style={{
//         position: "fixed",
//         top: "15px",
//         left: "15px",
//         backgroundColor: "transparent",
//         border: "none",
//         fontSize: "24px",
//         cursor: "pointer",
//         color: "#333",
//       }}
//       title="بازگشت"
//     >
//       ✖
//     </button>
//   );
// }

// export default BackButton;

//12/9
// src/components/BackButton.jsx
import { useLocation, useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  if (pathname === "/") return null;

  return (
    <button
      onClick={() => navigate(-1)}
      style={{
        position: "fixed",
        top: 15,
        left: 15,
        background: "transparent",
        border: "none",
        fontSize: 22,
        cursor: "pointer",
      }}
      title="بازگشت"
    >
      ✖
    </button>
  );
}

export default BackButton;
