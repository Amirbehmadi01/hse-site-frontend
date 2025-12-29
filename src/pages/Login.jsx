import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === "Admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      // Redirect based on role
      if (result.user.role === "Admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } else {
      setError(result.message);
    }
  };

  if (authLoading) {
    return <div style={styles.container}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Login</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter username"
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter password"
            />
          </div>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    textAlign: "center",
    marginBottom: "2rem",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontWeight: "500",
    color: "#555",
  },
  input: {
    padding: "0.75rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  button: {
    padding: "0.75rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "1rem",
  },
  error: {
    padding: "0.75rem",
    backgroundColor: "#fee",
    color: "#c33",
    borderRadius: "4px",
    textAlign: "center",
  },
};

export default Login;


// //fadelogo
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext.jsx";
// import cleverLogo from "../assets/cleverLogo.jpg";

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [showSplash, setShowSplash] = useState(true);
//   const [logoVisible, setLogoVisible] = useState(false);
//   const [showLogin, setShowLogin] = useState(false);

//   const { login, user, loading: authLoading } = useAuth();
//   const navigate = useNavigate();

//   // Splash & animation sequence
//   useEffect(() => {
//     // fade in logo (1s)
//     setLogoVisible(true);

//     // fade out logo after showing
//     const fadeOutTimer = setTimeout(() => {
//       setLogoVisible(false);
//     }, 1500);

//     // hide splash & show login
//     const showLoginTimer = setTimeout(() => {
//       setShowSplash(false);
//       setShowLogin(true);
//     }, 3000);

//     return () => {
//       clearTimeout(fadeOutTimer);
//       clearTimeout(showLoginTimer);
//     };
//   }, []);

//   // Redirect if already logged in
//   useEffect(() => {
//     if (!authLoading && user) {
//       if (user.role === "Admin") {
//         navigate("/admin/dashboard");
//       } else {
//         navigate("/user/dashboard");
//       }
//     }
//   }, [user, authLoading, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     const result = await login(username, password);
//     setLoading(false);

//     if (result.success) {
//       if (result.user.role === "Admin") {
//         navigate("/admin/dashboard");
//       } else {
//         navigate("/user/dashboard");
//       }
//     } else {
//       setError(result.message);
//     }
//   };

//   if (authLoading) {
//     return <div style={styles.container}>Loading...</div>;
//   }

//   if (showSplash) {
//     return (
//       <div style={styles.splash}>
//         <img
//           src={cleverLogo}
//           alt="Clever Logo"
//           style={{
//             ...styles.logo,
//             opacity: logoVisible ? 1 : 0,
//           }}
//         />
//       </div>
//     );
//   }

//   return (
//     <div style={styles.container}>
//       <div
//         style={{
//           ...styles.card,
//           opacity: showLogin ? 1 : 0,
//         }}
//       >
//         <h1 style={styles.title}>Login</h1>
//         <form onSubmit={handleSubmit} style={styles.form}>
//           {error && <div style={styles.error}>{error}</div>}
//           <div style={styles.inputGroup}>
//             <label style={styles.label}>Username</label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//               style={styles.input}
//               placeholder="Enter username"
//             />
//           </div>
//           <div style={styles.inputGroup}>
//             <label style={styles.label}>Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               style={styles.input}
//               placeholder="Enter password"
//             />
//           </div>
//           <button type="submit" disabled={loading} style={styles.button}>
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   splash: {
//     width: "100vw",
//     height: "100vh",
//     backgroundColor: "#000",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   logo: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//     transition: "opacity 1.5s ease",
//   },
//   container: {
//     minHeight: "100vh",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f5f5f5",
//   },
//   card: {
//     backgroundColor: "white",
//     padding: "2rem",
//     borderRadius: "8px",
//     boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//     width: "100%",
//     maxWidth: "400px",
//     transition: "opacity 0.5s ease",
//   },
//   title: {
//     textAlign: "center",
//     marginBottom: "2rem",
//     color: "#333",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "1rem",
//   },
//   inputGroup: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "0.5rem",
//   },
//   label: {
//     fontWeight: "500",
//     color: "#555",
//   },
//   input: {
//     padding: "0.75rem",
//     border: "1px solid #ddd",
//     borderRadius: "4px",
//     fontSize: "1rem",
//   },
//   button: {
//     padding: "0.75rem",
//     backgroundColor: "#007bff",
//     color: "white",
//     border: "none",
//     borderRadius: "4px",
//     fontSize: "1rem",
//     cursor: "pointer",
//     marginTop: "1rem",
//   },
//   error: {
//     padding: "0.75rem",
//     backgroundColor: "#fee",
//     color: "#c33",
//     borderRadius: "4px",
//     textAlign: "center",
//   },
// };

// export default Login;
