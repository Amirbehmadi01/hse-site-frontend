// // // import { createBrowserRouter } from "react-router-dom";
// // // import Login from "./pages/Login.jsx";
// // // import Home from "./pages/Home.jsx";
// // // import ChecklistPage from "./pages/ChecklistPages.jsx";
// // // import PreviousChecklists from "./pages/PreviousChecklists.jsx";
// // // import ChecklistView from "./pages/ChecklistView.jsx";
// // // import NonConformitiesRegister from "./pages/NonConformitiesRegister.jsx";
// // // import NonConformitiesMonthly from "./pages/NonConformitiesMonthly.jsx";
// // // import AdminDashboard from "./pages/AdminDashboard.jsx";
// // // import UserDashboard from "./pages/UserDashboard.jsx";
// // // import AdminMonthlyNonConformances from "./pages/AdminMonthlyNonConformances.jsx";
// // // import AdminResponses from "./pages/AdminResponses.jsx";
// // // import UserManagement from "./pages/UserManagement.jsx";
// // // import UserNonConformances from "./pages/UserNonConformances.jsx";
// // // import ProtectedRoute from "./components/ProtectedRoute.jsx";

// // // const router = createBrowserRouter([
// // //   {
// // //     path: "/login",
// // //     element: <Login />,
// // //   },
// // //   {
// // //     path: "/",
// // //     element: (
// // //       <ProtectedRoute>
// // //         <Home />
// // //       </ProtectedRoute>
// // //     ),
// // //   },
// // //   {
// // //     path: "/checklist/:type",
// // //     element: <ChecklistPage />,
// // //   },
// // //   {
// // //     path: "/checklist/:type/previous",
// // //     element: <PreviousChecklists />,
// // //   },
// // //   {
// // //     path: "/checklist-view",
// // //     element: <ChecklistView />,
// // //   },
// // //   {
// // //     path: "/nonconformities/register",
// // //     element: (
// // //       <ProtectedRoute requiredRole="Admin">
// // //         <NonConformitiesRegister />
// // //       </ProtectedRoute>
// // //     ),
// // //   },
// // //   {
// // //     path: "/nonconformities/monthly/:unit?",
// // //     element: <NonConformitiesMonthly />,
// // //   },
// // //   // Admin routes
// // //   {
// // //     path: "/admin/dashboard",
// // //     element: (
// // //       <ProtectedRoute requiredRole="Admin">
// // //         <AdminDashboard />
// // //       </ProtectedRoute>
// // //     ),
// // //   },
// // //   {
// // //     path: "/admin/register",
// // //     element: (
// // //       <ProtectedRoute requiredRole="Admin">
// // //         <NonConformitiesRegister />
// // //       </ProtectedRoute>
// // //     ),
// // //   },
// // //   {
// // //     path: "/admin/monthly",
// // //     element: (
// // //       <ProtectedRoute requiredRole="Admin">
// // //         <AdminMonthlyNonConformances />
// // //       </ProtectedRoute>
// // //     ),
// // //   },
// // //   {
// // //     path: "/admin/responses",
// // //     element: (
// // //       <ProtectedRoute requiredRole="Admin">
// // //         <AdminResponses />
// // //       </ProtectedRoute>
// // //     ),
// // //   },
// // //   {
// // //     path: "/admin/users",
// // //     element: (
// // //       <ProtectedRoute requiredRole="Admin">
// // //         <UserManagement />
// // //       </ProtectedRoute>
// // //     ),
// // //   },
// // //   // User routes
// // //   {
// // //     path: "/user/dashboard",
// // //     element: (
// // //       <ProtectedRoute requiredRole="User">
// // //         <UserDashboard />
// // //       </ProtectedRoute>
// // //     ),
// // //   },
// // //   {
// // //     path: "/user/nonconformities",
// // //     element: (
// // //       <ProtectedRoute requiredRole="User">
// // //         <UserNonConformances />
// // //       </ProtectedRoute>
// // //     ),
// // //   },
// // // ]);

// // // export default router;


// // import { createBrowserRouter, Navigate } from "react-router-dom";
// // import Login from "./pages/Login.jsx";
// // import Home from "./pages/Home.jsx";
// // import ChecklistPage from "./pages/ChecklistPages.jsx";
// // import PreviousChecklists from "./pages/PreviousChecklists.jsx";
// // import ChecklistView from "./pages/ChecklistView.jsx";
// // import NonConformitiesRegister from "./pages/NonConformitiesRegister.jsx";
// // import NonConformitiesMonthly from "./pages/NonConformitiesMonthly.jsx";
// // import AdminDashboard from "./pages/AdminDashboard.jsx";
// // import UserDashboard from "./pages/UserDashboard.jsx";
// // import AdminMonthlyNonConformances from "./pages/AdminMonthlyNonConformances.jsx";
// // import AdminResponses from "./pages/AdminResponses.jsx";
// // import UserManagement from "./pages/UserManagement.jsx";
// // import UserNonConformances from "./pages/UserNonConformances.jsx";
// // import ProtectedRoute from "./components/ProtectedRoute.jsx";

// // const router = createBrowserRouter([
// //   {
// //     path: "/",
// //     element: <Navigate to="/login" replace />,
// //   },
// //   {
// //     path: "/login",
// //     element: <Login />,
// //   },
// //   {
// //     path: "/home",
// //     element: (
// //       <ProtectedRoute>
// //         <Home />
// //       </ProtectedRoute>
// //     ),
// //   },
// //   {
// //     path: "/checklist/:type",
// //     element: <ChecklistPage />,
// //   },
// //   {
// //     path: "/checklist/:type/previous",
// //     element: <PreviousChecklists />,
// //   },
// //   {
// //     path: "/checklist-view",
// //     element: <ChecklistView />,
// //   },
// //   {
// //     path: "/nonconformities/register",
// //     element: (
// //       <ProtectedRoute requiredRole="Admin">
// //         <NonConformitiesRegister />
// //       </ProtectedRoute>
// //     ),
// //   },
// //   {
// //     path: "/nonconformities/monthly/:unit?",
// //     element: <NonConformitiesMonthly />,
// //   },
// //   {
// //     path: "/admin/dashboard",
// //     element: (
// //       <ProtectedRoute requiredRole="Admin">
// //         <AdminDashboard />
// //       </ProtectedRoute>
// //     ),
// //   },
// //   {
// //     path: "/admin/register",
// //     element: (
// //       <ProtectedRoute requiredRole="Admin">
// //         <NonConformitiesRegister />
// //       </ProtectedRoute>
// //     ),
// //   },
// //   {
// //     path: "/admin/monthly",
// //     element: (
// //       <ProtectedRoute requiredRole="Admin">
// //         <AdminMonthlyNonConformances />
// //       </ProtectedRoute>
// //     ),
// //   },
// //   {
// //     path: "/admin/responses",
// //     element: (
// //       <ProtectedRoute requiredRole="Admin">
// //         <AdminResponses />
// //       </ProtectedRoute>
// //     ),
// //   },
// //   {
// //     path: "/admin/users",
// //     element: (
// //       <ProtectedRoute requiredRole="Admin">
// //         <UserManagement />
// //       </ProtectedRoute>
// //     ),
// //   },
// //   {
// //     path: "/user/dashboard",
// //     element: (
// //       <ProtectedRoute requiredRole="User">
// //         <UserDashboard />
// //       </ProtectedRoute>
// //     ),
// //   },
// //   {
// //     path: "/user/nonconformities",
// //     element: (
// //       <ProtectedRoute requiredRole="User">
// //         <UserNonConformances />
// //       </ProtectedRoute>
// //     ),
// //   },
// // ]);

// // export default router;



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

//   // ❗ همیشه از وضعیت logout شروع می‌کند
//   useEffect(() => {
//     setUser(null);     // هیچ کاربری در شروع وجود ندارد
//     setLoading(false); // برنامه آماده است
//   }, []);

//   const login = async (username, password) => {
//     try {
//       const response = await API.post("/auth/login", { username, password });
//       const userData = response.data.user;

//       setUser(userData);

//       // ❌ هیچ ذخیره‌سازی در localStorage وجود ندارد
//       // localStorage.setItem("user", JSON.stringify(userData));

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

//     // ❌ حذف هرگونه ذخیره محلی
//     localStorage.removeItem("user");
//   };

//   const value = {
//     user,
//     login,
//     logout,
//     loading,
//     isAdmin: user?.role === "Admin",
//     isUser: user?.role === "User",
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };



// import { createBrowserRouter } from "react-router-dom";

// import Login from "./pages/Login.jsx";
// import Home from "./pages/Home.jsx";
// import ChecklistPage from "./pages/ChecklistPages.jsx";
// import PreviousChecklists from "./pages/PreviousChecklists.jsx";
// import ChecklistView from "./pages/ChecklistView.jsx";
// import NonConformitiesRegister from "./pages/NonConformitiesRegister.jsx";
// import NonConformitiesMonthly from "./pages/NonConformitiesMonthly.jsx";

// import AdminDashboard from "./pages/AdminDashboard.jsx";
// import UserDashboard from "./pages/UserDashboard.jsx";
// import AdminMonthlyNonConformances from "./pages/AdminMonthlyNonConformances.jsx";
// import AdminResponses from "./pages/AdminResponses.jsx";
// import UserManagement from "./pages/UserManagement.jsx";
// import UserNonConformances from "./pages/UserNonConformances.jsx";

// import ProtectedRoute from "./components/ProtectedRoute.jsx";

// const router = createBrowserRouter([
//   {
//     path: "/login",
//     element: <Login />,
//   },

//   {
//     path: "/",
//     element: (
//       <ProtectedRoute>
//         <Home />
//       </ProtectedRoute>
//     ),
//   },

//   {
//     path: "/checklist/:type",
//     element: <ChecklistPage />,
//   },

//   {
//     path: "/checklist/:type/previous",
//     element: <PreviousChecklists />,
//   },

//   {
//     path: "/checklist-view",
//     element: <ChecklistView />,
//   },

//   {
//     path: "/nonconformities/register",
//     element: (
//       <ProtectedRoute requiredRole="Admin">
//         <NonConformitiesRegister />
//       </ProtectedRoute>
//     ),
//   },

//   {
//     path: "/nonconformities/monthly/:unit?",
//     element: <NonConformitiesMonthly />,
//   },

//   // -------------------- Admin --------------------
//   {
//     path: "/admin/dashboard",
//     element: (
//       <ProtectedRoute requiredRole="Admin">
//         <AdminDashboard />
//       </ProtectedRoute>
//     ),
//   },

//   {
//     path: "/admin/register",
//     element: (
//       <ProtectedRoute requiredRole="Admin">
//         <NonConformitiesRegister />
//       </ProtectedRoute>
//     ),
//   },

//   {
//     path: "/admin/monthly",
//     element: (
//       <ProtectedRoute requiredRole="Admin">
//         <AdminMonthlyNonConformances />
//       </ProtectedRoute>
//     ),
//   },

//   {
//     path: "/admin/responses",
//     element: (
//       <ProtectedRoute requiredRole="Admin">
//         <AdminResponses />
//       </ProtectedRoute>
//     ),
//   },

//   {
//     path: "/admin/users",
//     element: (
//       <ProtectedRoute requiredRole="Admin">
//         <UserManagement />
//       </ProtectedRoute>
//     ),
//   },

//   // -------------------- User --------------------
//   {
//     path: "/user/dashboard",
//     element: (
//       <ProtectedRoute requiredRole="User">
//         <UserDashboard />
//       </ProtectedRoute>
//     ),
//   },

//   {
//     path: "/user/nonconformities",
//     element: (
//       <ProtectedRoute requiredRole="User">
//         <UserNonConformances />
//       </ProtectedRoute>
//     ),
//   },
// ]);

// export default router;

//12/9

// src/router.jsx

import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import ChecklistPage from "./pages/ChecklistPages.jsx";
import PreviousChecklists from "./pages/PreviousChecklists.jsx";
import ChecklistView from "./pages/ChecklistView.jsx";
import NonConformitiesRegister from "./pages/NonConformitiesRegister.jsx";
import NonConformitiesMonthly from "./pages/NonConformitiesMonthly.jsx";

import AdminDashboard from "./pages/AdminDashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import AdminMonthlyNonConformances from "./pages/AdminMonthlyNonConformances.jsx";
import AdminResponses from "./pages/AdminResponses.jsx";
import UserManagement from "./pages/UserManagement.jsx";
import UserNonConformances from "./pages/UserNonConformances.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <Login /> },

  { path: "/home", element: <ProtectedRoute><Home /></ProtectedRoute> },

  { path: "/checklist/:type", element: <ChecklistPage /> },
  { path: "/checklist/:type/previous", element: <PreviousChecklists /> },
  { path: "/checklist-view", element: <ChecklistView /> },

  { path: "/nonconformities/register", element: <ProtectedRoute requiredRole="Admin"><NonConformitiesRegister /></ProtectedRoute> },
  { path: "/nonconformities/monthly/:unit?", element: <NonConformitiesMonthly /> },

  { path: "/admin/dashboard", element: <ProtectedRoute requiredRole="Admin"><AdminDashboard /></ProtectedRoute> },
  { path: "/admin/register", element: <ProtectedRoute requiredRole="Admin"><NonConformitiesRegister /></ProtectedRoute> },
  { path: "/admin/monthly", element: <ProtectedRoute requiredRole="Admin"><AdminMonthlyNonConformances /></ProtectedRoute> },
  { path: "/admin/responses", element: <ProtectedRoute requiredRole="Admin"><AdminResponses /></ProtectedRoute> },
  { path: "/admin/users", element: <ProtectedRoute requiredRole="Admin"><UserManagement /></ProtectedRoute> },

  { path: "/user/dashboard", element: <ProtectedRoute requiredRole="User"><UserDashboard /></ProtectedRoute> },
  { path: "/user/nonconformities", element: <ProtectedRoute requiredRole="User"><UserNonConformances /></ProtectedRoute> },
]);

export default router;
