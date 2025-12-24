// // import { createContext, useContext, useState, useEffect } from "react";
// // import API from "../services/api.js";

// // const AuthContext = createContext();

// // export const useAuth = () => {
// //   const context = useContext(AuthContext);
// //   if (!context) {
// //     throw new Error("useAuth must be used within an AuthProvider");
// //   }
// //   return context;
// // };

// // export const AuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     // Check if user is stored in localStorage
// //     const storedUser = localStorage.getItem("user");
// //     if (storedUser) {
// //       setUser(JSON.parse(storedUser));
// //     }
// //     setLoading(false);
// //   }, []);

// //   const login = async (username, password) => {
// //     try {
// //       const response = await API.post("/auth/login", { username, password });
// //       const userData = response.data.user;
// //       setUser(userData);
// //       localStorage.setItem("user", JSON.stringify(userData));
// //       return { success: true, user: userData };
// //     } catch (error) {
// //       return { 
// //         success: false, 
// //         message: error.response?.data?.message || "Login failed" 
// //       };
// //     }
// //   };

// //   const logout = () => {
// //     setUser(null);
// //     localStorage.removeItem("user");
// //   };

// //   const value = {
// //     user,
// //     login,
// //     logout,
// //     loading,
// //     isAdmin: user?.role === "Admin",
// //     isUser: user?.role === "User",
// //   };

// //   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// // };

// import { createContext, useContext, useState, useEffect } from "react";
// import API from "../services/api.js";

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     setLoading(false);
//   }, []);

//   const login = async (username, password) => {
//     try {
//       const response = await API.post("/auth/login", { username, password });
//       const userData = response.data.user;
//       setUser(userData);
//       localStorage.setItem("user", JSON.stringify(userData));
//       return { success: true, user: userData };
//     } catch (error) {
//       return { 
//         success: false, 
//         message: error.response?.data?.message || "Login failed" 
//       };
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   const value = {
//     user,
//     login,
//     logout,
//     loading,
//     isAdmin: user?.role === "Admin",
//     isUser: user?.role === "User",
//     // Added for tracking which departments the admin can access
//     accessibleUnits: user?.accessibleUnits || [],
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };


// import { createContext, useContext, useState, useEffect } from "react";
// import API from "../services/api.js";

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // همیشه از حالت خروج شروع می‌کند
//   useEffect(() => {
//     setUser(null);
//     localStorage.removeItem("user");
//     setLoading(false);
//   }, []);

//   const login = async (username, password) => {
//     try {
//       const response = await API.post("/auth/login", { username, password });
//       const userData = response.data.user;

//       setUser(userData);

//       // 🚫 ذخیره در localStorage ممنوع
//       return { success: true, user: userData };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.message || "Login failed",
//       };
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         login,
//         logout,
//         loading,
//         isAdmin: user?.role === "Admin",
//         isUser: user?.role === "User",
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// 12/9



//ورژن مشکل دار لاگین
// // src/context/AuthContext.jsx
// import { createContext, useContext, useState, useEffect } from "react";
// import API from "../services/api.js";

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // همیشه استارت در حالت logout باشد (هیچ چیز ذخیره نشود)
//   useEffect(() => {
//     setUser(null);
//     localStorage.removeItem("user");
//     setLoading(false);
//   }, []);

//   const login = async (username, password) => {
//     try {
//       // const res = await API.post("/auth/login", { username, password });

//       const res = await API.post("/api/auth/login", { username, password });

// /////////////


//       const userData = res.data.user;
//       setUser(userData);
//       return { success: true, user: userData };
//     } catch (err) {
//       return { success: false, message: err.response?.data?.message || "خطا در ورود" };
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         login,
//         logout,
//         loading,
//         isAdmin: user?.role === "Admin",
//         isUser: user?.role === "User",
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };



import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api.js";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(null);
    localStorage.removeItem("user");
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await API.post("/auth/login", { username, password }); // ⚡ مسیر درست شد
      const userData = res.data.user;
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "خطا در ورود" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAdmin: user?.role === "Admin",
        isUser: user?.role === "User",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
