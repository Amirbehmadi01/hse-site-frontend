// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext.jsx";
// import API from "../services/api.js";
// import AdminHeader from "../components/AdminHeader.jsx";

// const departments = ["Production 1", "Plastic Injection", "Maintenance", "Warehouse"];

// const UserManagement = () => {
//   const { isAdmin } = useAuth();
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     role: "User",
//     department: "",
//   });

//   useEffect(() => {
//     if (!isAdmin) {
//       navigate("/user/dashboard");
//       return;
//     }
//     fetchUsers();
//   }, [isAdmin, navigate]);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const response = await API.get("/users");
//       setUsers(response.data);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       alert("Error loading users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await API.post("/users", formData);
//       alert("User created successfully!");
//       setFormData({ username: "", password: "", role: "User", department: "" });
//       setShowForm(false);
//       fetchUsers();
//     } catch (error) {
//       alert("Error creating user: " + (error.response?.data?.message || error.message));
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this user?")) return;
//     try {
//       await API.delete(`/users/${id}`);
//       alert("User deleted successfully!");
//       fetchUsers();
//     } catch (error) {
//       alert("Error deleting user");
//     }
//   };

//   if (loading) {
//     return <div style={styles.container}>Loading...</div>;
//   }

//   return (
//     <div style={styles.container}>
//       <AdminHeader />
//       <div style={styles.content}>
//         <h2 style={styles.title}>User Management</h2>
//         <button onClick={() => navigate("/admin/dashboard")} style={styles.backButton}>
//           ← Back to Dashboard
//         </button>

//         <button onClick={() => setShowForm(!showForm)} style={styles.addButton}>
//           {showForm ? "Cancel" : "+ Add New User"}
//         </button>

//         {showForm && (
//           <form onSubmit={handleSubmit} style={styles.form}>
//             <div style={styles.formGroup}>
//               <label>Username:</label>
//               <input
//                 type="text"
//                 value={formData.username}
//                 onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//                 required
//                 style={styles.input}
//               />
//             </div>
//             <div style={styles.formGroup}>
//               <label>Password:</label>
//               <input
//                 type="password"
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                 required
//                 style={styles.input}
//               />
//             </div>
//             <div style={styles.formGroup}>
//               <label>Role:</label>
//               <select
//                 value={formData.role}
//                 onChange={(e) => setFormData({ ...formData, role: e.target.value, department: e.target.value === "Admin" ? "" : formData.department })}
//                 style={styles.select}
//               >
//                 <option value="User">User</option>
//                 <option value="Admin">Admin</option>
//               </select>
//             </div>
//             {formData.role === "User" && (
//               <div style={styles.formGroup}>
//                 <label>Department:</label>
//                 <select
//                   value={formData.department}
//                   onChange={(e) => setFormData({ ...formData, department: e.target.value })}
//                   required
//                   style={styles.select}
//                 >
//                   <option value="">Select...</option>
//                   {departments.map((dept) => (
//                     <option key={dept} value={dept}>
//                       {dept}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}
//             <button type="submit" style={styles.submitButton}>
//               Create User
//             </button>
//           </form>
//         )}

//         <div style={styles.tableWrapper}>
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>Username</th>
//                 <th style={styles.th}>Role</th>
//                 <th style={styles.th}>Department</th>
//                 <th style={styles.th}>Created</th>
//                 <th style={styles.th}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user) => (
//                 <tr key={user._id}>
//                   <td style={styles.td}>{user.username}</td>
//                   <td style={styles.td}>{user.role}</td>
//                   <td style={styles.td}>{user.department || "-"}</td>
//                   <td style={styles.td}>
//                     {new Date(user.createdAt).toLocaleDateString()}
//                   </td>
//                   <td style={styles.td}>
//                     <button
//                       onClick={() => handleDelete(user._id)}
//                       style={styles.deleteButton}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     minHeight: "100vh",
//     backgroundColor: "#f5f5f5",
//     padding: "2rem",
//   },
//   content: {
//     maxWidth: "1000px",
//     margin: "0 auto",
//     backgroundColor: "white",
//     padding: "2rem",
//     borderRadius: "8px",
//     boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//   },
//   title: {
//     marginBottom: "1rem",
//     color: "#333",
//   },
//   backButton: {
//     marginBottom: "2rem",
//     padding: "0.5rem 1rem",
//     backgroundColor: "#6c757d",
//     color: "white",
//     border: "none",
//     borderRadius: "4px",
//     cursor: "pointer",
//   },
//   addButton: {
//     marginBottom: "2rem",
//     padding: "0.75rem 1.5rem",
//     backgroundColor: "#007bff",
//     color: "white",
//     border: "none",
//     borderRadius: "4px",
//     cursor: "pointer",
//     fontSize: "1rem",
//   },
//   form: {
//     marginBottom: "2rem",
//     padding: "1.5rem",
//     backgroundColor: "#f9f9f9",
//     borderRadius: "8px",
//     display: "flex",
//     flexDirection: "column",
//     gap: "1rem",
//   },
//   formGroup: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "0.5rem",
//   },
//   input: {
//     padding: "0.5rem",
//     border: "1px solid #ddd",
//     borderRadius: "4px",
//   },
//   select: {
//     padding: "0.5rem",
//     border: "1px solid #ddd",
//     borderRadius: "4px",
//   },
//   submitButton: {
//     padding: "0.75rem 1.5rem",
//     backgroundColor: "#28a745",
//     color: "white",
//     border: "none",
//     borderRadius: "4px",
//     cursor: "pointer",
//     fontSize: "1rem",
//   },
//   tableWrapper: {
//     overflowX: "auto",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//   },
//   th: {
//     padding: "0.75rem",
//     textAlign: "left",
//     borderBottom: "2px solid #ddd",
//     backgroundColor: "#f8f9fa",
//     fontWeight: "600",
//   },
//   td: {
//     padding: "0.75rem",
//     borderBottom: "1px solid #ddd",
//   },
//   deleteButton: {
//     padding: "0.25rem 0.5rem",
//     backgroundColor: "#dc3545",
//     color: "white",
//     border: "none",
//     borderRadius: "4px",
//     cursor: "pointer",
//     fontSize: "0.875rem",
//   },
// };

// export default UserManagement;

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext.jsx";
// import API from "../services/api.js";
// import AdminHeader from "../components/AdminHeader.jsx";

// const departments = ["Production 1", "Plastic Injection", "Maintenance", "Warehouse"];

// const UserManagement = () => {
//   const { isAdmin } = useAuth();
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     role: "User",
//     department: "",
//   });

//   useEffect(() => {
//     if (!isAdmin) {
//       navigate("/user/dashboard");
//       return;
//     }
//     fetchUsers();
//   }, [isAdmin, navigate]);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const response = await API.get("/users");
//       setUsers(response.data);
//     } catch (error) {
//       alert("Error loading users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await API.post("/users", formData);
//       setFormData({ username: "", password: "", role: "User", department: "" });
//       setShowForm(false);
//       fetchUsers();
//     } catch (error) {
//       alert(error.response?.data?.message || error.message);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this user?")) return;
//     try {
//       await API.delete(`/users/${id}`);
//       fetchUsers();
//     } catch {
//       alert("Error deleting user");
//     }
//   };

//   if (loading) return <div style={styles.container}>Loading...</div>;

//   return (
//     <div style={styles.container}>
//       <AdminHeader />
//       <div style={styles.content}>
//         <h2 style={styles.title}>User Management</h2>
//         <button onClick={() => navigate("/admin/dashboard")} style={styles.backButton}>← Back to Dashboard</button>
//         <button onClick={() => setShowForm(!showForm)} style={styles.addButton}>
//           {showForm ? "Cancel" : "+ Add New User"}
//         </button>

//         {showForm && (
//           <form onSubmit={handleSubmit} style={styles.form}>
//             <div style={styles.formGroup}>
//               <label>Username:</label>
//               <input
//                 type="text"
//                 value={formData.username}
//                 onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//                 required
//                 style={styles.input}
//               />
//             </div>
//             <div style={styles.formGroup}>
//               <label>Password:</label>
//               <input
//                 type="password"
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                 required
//                 style={styles.input}
//               />
//             </div>
//             <div style={styles.formGroup}>
//               <label>Role:</label>
//               <select
//                 value={formData.role}
//                 onChange={(e) => setFormData({ ...formData, role: e.target.value, department: e.target.value === "Admin" ? "" : formData.department })}
//                 style={styles.select}
//               >
//                 <option value="User">User</option>
//                 <option value="Admin">Admin</option>
//               </select>
//             </div>
//             {formData.role === "User" && (
//               <div style={styles.formGroup}>
//                 <label>Department:</label>
//                 <select
//                   value={formData.department}
//                   onChange={(e) => setFormData({ ...formData, department: e.target.value })}
//                   required
//                   style={styles.select}
//                 >
//                   <option value="">Select...</option>
//                   {departments.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
//                 </select>
//               </div>
//             )}
//             <button type="submit" style={styles.submitButton}>Create User</button>
//           </form>
//         )}

//         <div style={styles.tableWrapper}>
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>Username</th>
//                 <th style={styles.th}>Role</th>
//                 <th style={styles.th}>Department</th>
//                 <th style={styles.th}>Created</th>
//                 <th style={styles.th}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user) => (
//                 <tr key={user._id}>
//                   <td style={styles.td}>{user.username}</td>
//                   <td style={styles.td}>{user.role}</td>
//                   <td style={styles.td}>{user.department || "-"}</td>
//                   <td style={styles.td}>{new Date(user.createdAt).toLocaleDateString()}</td>
//                   <td style={styles.td}>
//                     <button onClick={() => handleDelete(user._id)} style={styles.deleteButton}>Delete</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: { minHeight: "100vh", backgroundColor: "#f5f5f5", padding: "2rem" },
//   content: { maxWidth: "1000px", margin: "0 auto", backgroundColor: "white", padding: "2rem", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" },
//   title: { marginBottom: "1rem", color: "#333" },
//   backButton: { marginBottom: "2rem", padding: "0.5rem 1rem", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
//   addButton: { marginBottom: "2rem", padding: "0.75rem 1.5rem", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem" },
//   form: { marginBottom: "2rem", padding: "1.5rem", backgroundColor: "#f9f9f9", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "1rem" },
//   formGroup: { display: "flex", flexDirection: "column", gap: "0.5rem" },
//   input: { padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" },
//   select: { padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" },
//   submitButton: { padding: "0.75rem 1.5rem", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem" },
//   tableWrapper: { overflowX: "auto" },
//   table: { width: "100%", borderCollapse: "collapse" },
//   th: { padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #ddd", backgroundColor: "#f8f9fa", fontWeight: "600" },
//   td: { padding: "0.75rem", borderBottom: "1px solid #ddd" },
//   deleteButton: { padding: "0.25rem 0.5rem", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.875rem" },
// };

// export default UserManagement;

//12/9
// src/pages/UserManagement.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment-jalaali";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../services/api.js";
import AdminHeader from "../components/AdminHeader.jsx";

const unitsHierarchy = {
  "سالن تولید ۱": [
    "ورق کاری بدنه",
    "ورق کاری درب",
    "وکیوم لاینر",
    "وکیوم وان",
    "تست",
    "پیش مونتاژ",
    "مونتاژ اولیه",
    "مونتاژ ثانویه",
    "تزریق فوم در",
    "تزریق فوم کابین",
    "بسته بندی",
    "کانتین",
  ],
  "سالن تزریق پلاستیک": ["تزریق"],
  "انبار ها": [
    "مردان",
    "مرکزی",
    "تزریق پلاستیک",
    "محصول",
    "تغذیه",
    "ضایعات",
    "خدمات پس از فروش",
    "فرامهر",
    "نت",
    "مصرفی",
  ],
  "توسعه عمران": ["ابنیه", "جوشکاری"],
  "تاسیسات": ["تاسیسات سالن تولید ۱", "تاسیسات تزریق پلاستیک"],
};

const UserManagement = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    role: "User",
    department: "",
    subunit: "",
  });
  const [subUnits, setSubUnits] = useState([]);

  useEffect(() => {
    if (!isAdmin) navigate("/user/dashboard");
    fetchUsers();
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (formData.department) {
      setSubUnits(unitsHierarchy[formData.department] || []);
      if (!unitsHierarchy[formData.department]?.includes(formData.subunit)) {
        setFormData((prev) => ({ ...prev, subunit: "" }));
      }
    } else {
      setSubUnits([]);
      setFormData((prev) => ({ ...prev, subunit: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.department]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch {
      alert("خطا در بارگذاری کاربران");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormData({ name: "", username: "", password: "", role: "User", department: "", subunit: "" });
    setShowForm(true);
  };

  const openEdit = (u) => {
    setEditing(u);
    setFormData({
      name: u.name || "",
      username: u.username,
      password: "",
      role: u.role,
      department: u.department || "",
      subunit: u.subunit || "",
    });
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const payload = {
          name: formData.name,
          username: formData.username,
          role: formData.role,
          department: formData.role === "User" ? formData.department : "",
          subunit: formData.role === "User" ? formData.subunit : "",
        };
        if (formData.password) payload.password = formData.password;
        await API.put(`/users/${editing._id}`, payload);
        alert("کاربر بروزرسانی شد");
      } else {
        await API.post("/users", {
          name: formData.name,
          username: formData.username,
          password: formData.password,
          role: formData.role,
          department: formData.department,
          subunit: formData.subunit,
          createdBy: user?.username || "admin",
        });
        alert("کاربر ایجاد شد");
      }
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "خطا");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("آیا از حذف مطمئنید؟")) return;
    try {
      await API.delete(`/users/${id}`);
      fetchUsers();
    } catch {
      alert("خطا در حذف");
    }
  };

  if (loading) return <div style={styles.container}>در حال بارگذاری...</div>;

  return (
    <div style={styles.container}>
      <AdminHeader />
      <div style={styles.content}>
        <h2>مدیریت کاربران</h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button onClick={() => navigate("/admin/dashboard")} style={styles.backBtn}>بازگشت</button>
          <button onClick={openCreate} style={styles.createBtn}>ایجاد کاربر جدید</button>
        </div>

        {showForm && (
          <form onSubmit={submit} style={styles.form}>
            <div style={styles.row}>
              <label>نام</label>
              <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required style={styles.input} />
            </div>
            <div style={styles.row}>
              <label>نام کاربری</label>
              <input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required style={styles.input} />
            </div>
            <div style={styles.row}>
              <label>رمز عبور {editing ? "(فقط هنگام تغییر)" : ""}</label>
              <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={styles.input} required={!editing} />
            </div>
            <div style={styles.row}>
              <label>نقش</label>
              <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value, department: e.target.value === "Admin" ? "" : formData.department })} style={styles.input}>
                <option value="User">سرپرست</option>
                <option value="Admin">ادمین</option>
              </select>
            </div>
            {formData.role === "User" && (
              <div style={styles.row}>
                <label>واحد</label>
                <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} style={styles.input} required>
                  <option value="">انتخاب...</option>
                  {Object.keys(unitsHierarchy).map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            )}
            {formData.role === "User" && (
              <div style={styles.row}>
                <label>زیر واحد</label>
                <select value={formData.subunit} onChange={(e) => setFormData({ ...formData, subunit: e.target.value })} style={styles.input} required>
                  <option value="">انتخاب...</option>
                  {subUnits.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" style={styles.saveBtn}>{editing ? "بروزرسانی" : "ایجاد"}</button>
              <button type="button" onClick={() => setShowForm(false)} style={styles.cancelBtn}>انصراف</button>
            </div>
          </form>
        )}

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>نام</th>
                <th>نقش</th>
                <th>نام کاربری</th>
                <th>پسورد</th>
                <th>واحد</th>
                <th>زیرواحد</th>
                <th>تاریخ ایجاد (جلالی)</th>
                <th>ایجاد کننده</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.role === "Admin" ? "ادمین" : "سرپرست"}</td>
                  <td>{u.username}</td>
                  <td>{u.role === "User" ? u.password : "-"}</td>
                  <td>{u.department || "-"}</td>
                  <td>{u.subunit || "-"}</td>
                  <td>{u.createdAt ? moment(u.createdAt).format("jYYYY/jMM/jDD HH:mm") : "-"}</td>
                  <td>{u.createdBy || "-"}</td>
                  <td>
                    <button onClick={() => openEdit(u)} style={styles.editBtn}>ویرایش</button>
                    <button onClick={() => handleDelete(u._id)} style={styles.delBtn}>حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: "100vh", background: "#f5f5f5" },
  content: { maxWidth: 1100, margin: "2rem auto", background: "#fff", padding: 20, borderRadius: 8 },
  backBtn: { background: "#6c757d", color: "#fff", border: "none", padding: "0.5rem 1rem", borderRadius: 6 },
  createBtn: { background: "#007bff", color: "#fff", border: "none", padding: "0.5rem 1rem", borderRadius: 6 },
  form: { marginBottom: 16, padding: 12, background: "#f8f9fa", borderRadius: 6 },
  row: { marginBottom: 8, display: "flex", flexDirection: "column" },
  input: { padding: 8, borderRadius: 6, border: "1px solid #ddd" },
  saveBtn: { background: "#28a745", color: "#fff", border: "none", padding: "0.5rem 1rem", borderRadius: 6 },
  cancelBtn: { background: "#6c757d", color: "#fff", border: "none", padding: "0.5rem 1rem", borderRadius: 6 },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  editBtn: { marginRight: 8, background: "#ffc107", border: "none", padding: "0.25rem 0.5rem", borderRadius: 6 },
  delBtn: { background: "#dc3545", border: "none", color: "#fff", padding: "0.25rem 0.5rem", borderRadius: 6 },
};

export default UserManagement;
