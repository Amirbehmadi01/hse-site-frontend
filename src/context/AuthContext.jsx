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



// const login = async (username, password) => {
//   try {
//     // مسیر صحیح بدون اضافه کردن دوباره "api"
//     const res = await API.post("/auth/login", { username, password });

//     const userData = res.data.user;
//     setUser(userData);
//     return { success: true, user: userData };
//   } catch (err) {
//     return { 
//       success: false, 
//       message: err.response?.data?.message || "خطا در ورود" 
//     };
//   }
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
      const res = await API.post("/auth/login", { username, password });
      const userData = res.data.user;
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "خطا در ورود",
      };
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
