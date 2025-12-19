// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import API from "../services/api";
// import { commonStyles, theme } from "../styles";
// import { exportMonthFull, exportMonthNon } from "../utils/excelExport";
// import moment from "moment-jalaali";
// import PersianDatePicker from "../components/PersianDatePicker";

// const NonConformitiesMonthly = () => {
//   const [months, setMonths] = useState([]); // [{month, supervisorScore, items:[] }]
//   const [loading, setLoading] = useState(true);
//   const [exportRange, setExportRange] = useState({ open: false, from: "", to: "" });
//   const [activeExportMonth, setActiveExportMonth] = useState(null);
//   const navigate = useNavigate();
//   const { unit } = useParams();

//   const fetchData = async (params = {}) => {
//     setLoading(true);
//     try {
//       const { data } = await API.get("/nonconformities", { params });
//       const mapped = (data || [])
//         .map((block) => ({
//           ...block,
//           items: unit ? (block.items || []).filter((x) => x.unit === unit) : block.items,
//         }))
//         .filter((b) => (b.items || []).length > 0);
//       setMonths(mapped);
//     } catch {
//       setMonths([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [unit]);

//   const updateRow = async (id, patch) => {
//     const form = new FormData();
//     Object.entries(patch).forEach(([k, v]) => {
//       if (k === "nc_after" && Array.isArray(v)) v.forEach((f) => form.append("nc_after", f));
//       else form.append(k, v);
//     });
//     await API.put(`/nonconformities/${id}`, form, { headers: { "Content-Type": "multipart/form-data" } });
//     fetchData();
//   };

//   const deleteRow = async (id) => {
//     await API.delete(`/nonconformities/${id}`);
//     fetchData();
//   };

//   const openExport = (month) => setExportRange({ open: true, from: "", to: "" }) || setActiveExportMonth(month);
//   const closeExport = () => setExportRange({ open: false, from: "", to: "" }) || setActiveExportMonth(null);

//   const filterByDateRange = (items) => {
//     const { from, to } = exportRange;
//     const fromD = from ? new Date(from) : null;
//     const toD = to ? new Date(to) : null;
//     return (items || []).filter((it) => {
//       const d = new Date(it.date);
//       if (fromD && d < fromD) return false;
//       if (toD && d > toD) return false;
//       return true;
//     });
//   };

//   const doDownload = () => {
//     const m = activeExportMonth ? { ...activeExportMonth, items: filterByDateRange(activeExportMonth.items) } : null;
//     if (m) exportMonthFull(m);
//     closeExport();
//   };

//   return (
//     <div style={commonStyles.pageContainer}>
//       <div style={commonStyles.contentWrapper}>
//         <div style={commonStyles.card}>
//           <h2 style={commonStyles.title}>عدم انطباق ماهانه {unit ? `- ${unit}` : ""}</h2>
//           <div style={commonStyles.buttonRow}>
//             <button
//               onClick={() => navigate(-1)}
//               style={commonStyles.buttonSecondary}
//               onMouseEnter={(e) => (e.target.style.backgroundColor = theme.colors.secondaryHover)}
//               onMouseLeave={(e) => (e.target.style.backgroundColor = theme.colors.secondary)}
//             >
//               🔙 بازگشت
//             </button>
//           </div>
//           {loading ? (
//             <div style={{ textAlign: "center" }}>در حال بارگذاری...</div>
//           ) : (
//             months.map((m) => (
//               <div key={m.month} style={{ marginBottom: theme.spacing.lg }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: theme.spacing.sm }}>
//                   <h3 style={{ margin: 0, color: theme.colors.primary }}>{m.month}</h3>
//                   <div style={{ color: theme.colors.textMuted }}>امتیاز سرپرست: {m.supervisorScore}%</div>
//                 </div>
//                 <div style={{ overflowX: "auto" }}>
//                   <table style={commonStyles.table}>
//                     <thead>
//                       <tr>
//                         <th style={commonStyles.tableHeader}>S</th>
//                         <th style={commonStyles.tableHeader}>شرح</th>
//                         <th style={commonStyles.tableHeader}>تاریخ</th>
//                         <th style={commonStyles.tableHeader}>وضعیت</th>
//                         <th style={commonStyles.tableHeader}>پیشرفت %</th>
//                         <th style={commonStyles.tableHeader}>تصویر قبل</th>
//                         <th style={commonStyles.tableHeader}>تصویر بعد</th>
//                         <th style={commonStyles.tableHeader}>یادداشت</th>
//                         <th style={commonStyles.tableHeader}>حذف</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {m.items.map((it) => (
//                         <tr key={it._id}>
//                           <td style={commonStyles.tableCell}>{it.s || "-"}</td>
//                           <td style={commonStyles.tableCell}>{it.description}</td>
//                           <td style={commonStyles.tableCell}>{moment(it.date).format("jYYYY/jMM/jDD")}</td>
//                           <td style={commonStyles.tableCell}>
//                             <select
//                               defaultValue={it.status}
//                               onChange={(e) => updateRow(it._id, { status: e.target.value })}
//                               style={commonStyles.select}
//                             >
//                               <option>Fixed</option>
//                               <option>Unfixed</option>
//                               <option>Incomplete</option>
//                             </select>
//                           </td>
//                           <td style={commonStyles.tableCell}>
//                             <input
//                               type="number"
//                               defaultValue={it.progress || 0}
//                               min={0}
//                               max={100}
//                               onBlur={(e) => updateRow(it._id, { progress: e.target.value })}
//                               style={commonStyles.input}
//                             />
//                           </td>
//                           <td style={commonStyles.tableCell}>
//                             {(it.beforeImages || []).slice(0,2).map((src) => (
//                               <a key={src} href={`http://localhost:5000${src}`} target="_blank" rel="noreferrer" style={{ display: "inline-block", margin: 4 }}>
//                                 <img src={`http://localhost:5000${src}`} alt="before" style={{ maxHeight: 60, border: `1px solid ${theme.colors.border}`, borderRadius: 6 }} />
//                               </a>
//                             ))}
//                           </td>
//                           <td style={commonStyles.tableCell}>
//                             <input type="file" accept="image/*,.zip" multiple capture="environment" onChange={(e) => updateRow(it._id, { nc_after: Array.from(e.target.files||[]) })} style={commonStyles.input} />
//                             {(it.afterImages || []).slice(0,2).map((src) => (
//                               <img key={src} src={`http://localhost:5000${src}`} alt="after" style={{ maxHeight: 60, margin: 4, border: `1px solid ${theme.colors.border}`, borderRadius: 6 }} />
//                             ))}
//                           </td>
//                           <td style={commonStyles.tableCell}>
//                             <input defaultValue={it.notes || ""} onBlur={(e) => updateRow(it._id, { notes: e.target.value })} style={commonStyles.input} />
//                           </td>
//                           <td style={commonStyles.tableCell}>
//                             <button onClick={() => deleteRow(it._id)} style={commonStyles.buttonSecondary}>حذف</button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 <div style={commonStyles.buttonRow}>
//                   <button style={commonStyles.button} onClick={() => openExport(m)}>دانلود</button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {exportRange.open && (
//           <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 1000 }}>
//             <div style={{ background: "#fff", borderRadius: 12, padding: 24, width: 340, maxWidth: "90vw", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
//               <h4 style={{ marginTop: 0, marginBottom: theme.spacing.md, color: theme.colors.primary, textAlign: "center" }}>انتخاب بازه زمانی (هجری شمسی)</h4>
//               <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.md }}>
//                 <div>
//                   <label style={{ display: "block", marginBottom: theme.spacing.xs, color: theme.colors.text, fontWeight: 500 }}>از تاریخ:</label>
//                   <PersianDatePicker
//                     value={exportRange.from ? new Date(exportRange.from) : null}
//                     onChange={(date) => setExportRange({ ...exportRange, from: date ? date.toISOString().split('T')[0] : "" })}
//                     placeholder="از تاریخ را انتخاب کنید"
//                   />
//                 </div>
//                 <div>
//                   <label style={{ display: "block", marginBottom: theme.spacing.xs, color: theme.colors.text, fontWeight: 500 }}>تا تاریخ:</label>
//                   <PersianDatePicker
//                     value={exportRange.to ? new Date(exportRange.to) : null}
//                     onChange={(date) => setExportRange({ ...exportRange, to: date ? date.toISOString().split('T')[0] : "" })}
//                     placeholder="تا تاریخ را انتخاب کنید"
//                   />
//                 </div>
//               </div>
//               <div style={{ ...commonStyles.buttonRow, marginTop: theme.spacing.lg }}>
//                 <button style={commonStyles.button} onClick={doDownload}>دانلود</button>
//                 <button style={commonStyles.buttonSecondary} onClick={closeExport}>انصراف</button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NonConformitiesMonthly;

//12/9
// src/pages/NonConformitiesMonthly.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api.js";
import moment from "moment-jalaali";

const NonConformitiesMonthly = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { unit } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [unit]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await API.get("/nonconformities", { params: unit ? { unit } : {} });
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteRow = async (id) => {
    if (!confirm("آیا از حذف مطمئنید؟")) return;
    await API.delete(`/nonconformities/${id}`);
    fetchData();
  };

  if (loading) return <div style={{ padding: 20 }}>در حال بارگذاری...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <div style={{ maxWidth: 1200, margin: "2rem auto", padding: 20, background: "#fff", borderRadius: 8 }}>
        <h2>گزارش عدم انطباق {unit ? `- ${decodeURIComponent(unit)}` : ""}</h2>
        <div style={{ marginBottom: 12 }}>
          <button onClick={() => navigate(-1)}>← بازگشت</button>
        </div>

        {items.length === 0 ? (
          <div>رکوردی وجود ندارد.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8f9fa" }}>
                  <th>ردیف</th>
                  <th>شرح</th>
                  <th>تاریخ</th>
                  <th>وضعیت</th>
                  <th>پیشرفت %</th>
                  <th>تصاویر قبل</th>
                  <th>تصاویر بعد</th>
                  <th>یادداشت</th>
                  <th>حذف</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={it._id}>
                    <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{idx + 1}</td>
                    <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{it.description}</td>
                    <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{moment(it.date).format("jYYYY/jMM/jDD")}</td>
                    <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{it.status}</td>
                    <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{it.progress || 0}</td>
                    <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                      {(it.beforeImages || []).map((src, i) => <a key={i} href={`http://localhost:5000${src}`} target="_blank" rel="noreferrer" style={{ marginRight: 6 }}>نمایش</a>)}
                    </td>
                    <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                      {(it.afterImages || []).map((src, i) => <a key={i} href={`http://localhost:5000${src}`} target="_blank" rel="noreferrer" style={{ marginRight: 6 }}>نمایش</a>)}
                    </td>
                    <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{it.notes}</td>
                    <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                      <button onClick={() => deleteRow(it._id)} style={{ background: "#dc3545", color: "#fff", border: "none", padding: "0.4rem 0.6rem", borderRadius: 6 }}>حذف</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default NonConformitiesMonthly;
