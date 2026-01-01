import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment-jalaali";
import AdminHeader from "../components/AdminHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../services/api.js";

moment.loadPersian({ dialect: "persian-modern", usePersianDigits: false });

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

const typeOptions = [
  { value: "new", label: "عدم انطباق جدید" },
  { value: "view", label: "مشاهده موارد قبلی" },
  { value: "scores", label: "نمایش نمرات سرپرستان" },
];

const statusOptions = [
  { value: "Fixed", label: "رفع شده" },
  { value: "Not Fixed", label: "رفع نشده" },
  { value: "Incomplete", label: "ناقص" },
];

const jalaliMonths = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

// Helper to make unique row ids
let ROW_ID_SEQ = 1;

const AdminDashboard = () => {
  const { isAdmin, user } = useAuth(); // expecting user.username available
  const navigate = useNavigate();

  // menu state (sidebar on right)
  const [activeMenu, setActiveMenu] = useState(null); // "nonconformities" | "checklists" | "responses" | "users"

  // selection state (top blue area)
  const [selectedType, setSelectedType] = useState(""); // typeOptions.value
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [subUnits, setSubUnits] = useState([]);
  const [selectedSubUnit, setSelectedSubUnit] = useState("");

  // date filtering (kept for view/scores)
  const [selectedJYear, setSelectedJYear] = useState(() => moment().format("jYYYY"));
  const [selectedJMonth, setSelectedJMonth] = useState(() => moment().format("jM")); // 1..12

  // data
  const [ncList, setNcList] = useState([]); // fetched nonconformities
  const [loadingList, setLoadingList] = useState(false);

  // supervisors + scores
  const [supervisors, setSupervisors] = useState([]);
  const [scoresData, setScoresData] = useState([]);

  // notifications count
  const [responsesNotifications, setResponsesNotifications] = useState(0);

  // ایتم‌های منوی چک‌لیست‌های ایمنی
  const safetyChecklists = [
    { id: "tablo", name: "تابلو برق" },
    { id: "balabar", name: "بالابر" },
    { id: "kapsol", name: "کپسول‌های اطفا حریق" },
    { id: "darbast", name: "داربست‌بندی" },
    { id: "firebox", name: "فایرباکس‌ها" },
    { id: "forklift", name: "لیفتراک" },
  ];

  // Rows for creating multiple NCs (the requested UI)
  const [ncRows, setNcRows] = useState([]); // each row: { id, s, description, beforeFiles: File[] }
  const [savingAll, setSavingAll] = useState(false);

  // ویرایش ردیف‌های مشاهده موارد قبلی
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({});
  const [editFiles, setEditFiles] = useState([]); // فایل‌های جدید برای ویرایش
  const [viewConfirmed, setViewConfirmed] = useState(false);

  // refs to file inputs per row if needed
  const fileInputsRef = useRef({});

  useEffect(() => {
    if (!isAdmin) {
      navigate("/user/dashboard");
      return;
    }
    fetchUsers();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isAdmin, navigate]);

  useEffect(() => {
    // update subUnits list when department changes
    if (selectedDepartment) {
      setSubUnits(unitsHierarchy[selectedDepartment] || []);
      setSelectedSubUnit("");
    } else {
      setSubUnits([]);
      setSelectedSubUnit("");
    }
    setViewConfirmed(false);
  }, [selectedDepartment]);

  useEffect(() => {
    setViewConfirmed(false);
  }, [selectedSubUnit]);

  // ---------- helpers ----------
  // تبدیل ماه جلالی انتخاب شده به بازه‌ی تاریخ میلادی برای فیلتر/اکسل
  const getMonthRangeGregorian = (jYear, jMonth) => {
    const jMonthStr = String(jMonth).padStart(2, "0");
    const jStart = moment(`${jYear}-${jMonthStr}-01`, "jYYYY-jMM-jDD");
    const gStart = jStart.toDate();
    const gEnd = jStart.clone().endOf("jMonth").toDate();
    const from = gStart.toISOString().split("T")[0];
    const to = gEnd.toISOString().split("T")[0];
    const exportMonth = gStart.toISOString().slice(0, 7);
    return { from, to, exportMonth };
  };

  // ---------- fetch / compute ----------
  const fetchNonConformities = useCallback(async () => {
    if (!selectedDepartment || !selectedSubUnit) {
      setNcList([]);
      return;
    }

    setLoadingList(true);
    try {
      const { from, to } = getMonthRangeGregorian(selectedJYear, selectedJMonth);
      const params = {
        unit: selectedDepartment,
        subunit: selectedSubUnit,
        from,
        to,
        mode: "flat", // پاسخ تخت برای جدول
      };
      const res = await API.get("/nonconformities", { params });
      setNcList(res.data || []);
    } catch (err) {
      console.error("Error loading nonconformities", err);
      setNcList([]);
    } finally {
      setLoadingList(false);
    }
  }, [selectedDepartment, selectedSubUnit, selectedJYear, selectedJMonth]);

  // بارگذاری لیست برای مشاهده/نمرات بر اساس فیلتر
  useEffect(() => {
    if (selectedType === "scores") {
      fetchNonConformities();
    }
    if (selectedType === "view" && viewConfirmed) {
      fetchNonConformities();
    }
  }, [selectedType, selectedDepartment, selectedSubUnit, selectedJYear, selectedJMonth, viewConfirmed, fetchNonConformities]);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      const sup = (res.data || []).filter((u) => u.role === "User");
      setSupervisors(sup);
    } catch (err) {
      console.error("Error loading users", err);
      setSupervisors([]);
    }
  };

  const computeSupervisorScores = useCallback(() => {
    const { from, to } = getMonthRangeGregorian(selectedJYear, selectedJMonth);
    const list = (ncList || []).filter((it) => {
      const d = new Date(it.date);
      return d >= new Date(from) && d <= new Date(to);
    });
    
    // فیلتر سرپرستان بر اساس واحد و زیرواحد انتخاب شده
    const filteredSupervisors = supervisors.filter((s) => {
      if (!selectedDepartment || !selectedSubUnit) return false;
      return s.department === selectedDepartment && s.subunit === selectedSubUnit;
    });
    
    const stats = filteredSupervisors.map((s) => {
      // مطابقت بر اساس unit/subunit با department/subunit سرپرست
      const items = list.filter((it) => {
        const matchUnit = (it.unit === s.department || it.department === s.department);
        const matchSubUnit = it.subunit === s.subunit;
        return matchUnit && matchSubUnit;
      });
      const total = items.length;
      const fixed = items.filter((i) => i.status === "Fixed").length;
      const notFixed = items.filter((i) => i.status === "Not Fixed").length;
      const incomplete = items.filter((i) => i.status === "Incomplete").length;
      // فرمول: (تعداد رفع شده / تعداد کل) * 100
      const score = total > 0 ? Math.round((fixed / total) * 100) : 0;
      return { supervisor: s, total, fixed, notFixed, incomplete, score, items };
    });
    setScoresData(stats);
  }, [ncList, supervisors, selectedJYear, selectedJMonth, selectedDepartment, selectedSubUnit]);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/nonconformities/responses");
      const payload = res.data || {};
      let totalNew = 0;
      Object.keys(payload).forEach((dept) => {
        const arr = payload[dept] || [];
        if (Array.isArray(arr)) {
          arr.forEach((item) => {
            totalNew += item.newResponses || 0;
          });
        }
      });
      setResponsesNotifications(totalNew);
    } catch (err) {
      console.error("Error fetching notifications", err);
      setResponsesNotifications(0);
    }
  };

  const startEdit = (row) => {
    setEditingId(row._id);
    setEditDraft({
      s: row.s || "",
      description: row.description || "",
      status: row.status || "Incomplete",
      progress: row.progress ?? 0,
      notes: row.notes || "",
    });
    setEditFiles([]);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft({});
    setEditFiles([]);
  };

  const saveEdit = async (id) => {
    if (!selectedDepartment || !selectedSubUnit) {
      alert("واحد و زیرواحد را انتخاب کنید.");
      return;
    }
    try {
      const fd = new FormData();
      fd.append("s", editDraft.s);
      fd.append("description", editDraft.description);
      fd.append("status", editDraft.status);
      fd.append("progress", editDraft.progress);
      fd.append("notes", editDraft.notes);
      fd.append("unit", selectedDepartment);
      fd.append("subunit", selectedSubUnit);
      
      // اضافه کردن فایل‌های جدید
      editFiles.forEach((f) => fd.append("beforeImages", f));

      await API.put(`/nonconformities/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchNonConformities();
      cancelEdit();
    } catch (err) {
      alert(err.response?.data?.message || "خطا در ذخیره ویرایش");
    }
  };

  const deleteRow = async (id) => {
    if (!window.confirm("آیا از حذف این مورد مطمئن هستید؟")) return;
    try {
      await API.delete(`/nonconformities/${id}`);
      await fetchNonConformities();
    } catch (err) {
      alert(err.response?.data?.message || "خطا در حذف");
    }
  };

  // ---------- NEW UI: rows handlers ----------
  const onAddRow = () => {
    if (selectedType !== "new") {
      alert("برای افزودن ردیف، نوع فعالیت را روی «عدم انطباق جدید» بگذارید.");
      return;
    }
    if (!selectedDepartment) {
      alert("برای ثبت عدم انطباق جدید، لطفاً بخش را انتخاب کنید.");
      return;
    }
    const newRow = { id: ROW_ID_SEQ++, s: "", description: "", beforeFiles: [] };
    setNcRows((r) => [...r, newRow]);
  };

  const onRemoveRow = (rowId) => {
    setNcRows((r) => r.filter((row) => row.id !== rowId));
    // cleanup file input ref
    delete fileInputsRef.current[rowId];
  };

  const onRowChange = (rowId, patch) => {
    setNcRows((rows) => rows.map((row) => (row.id === rowId ? { ...row, ...patch } : row)));
  };

  const onRowPickFiles = (rowId, files) => {
    const arr = Array.from(files || []);
    setNcRows((rows) =>
      rows.map((row) => {
        if (row.id !== rowId) return row;
        const combined = [...row.beforeFiles, ...arr].slice(0, 4);
        return { ...row, beforeFiles: combined };
      })
    );
  };

  const onRowRemoveFile = (rowId, fileIdx) => {
    setNcRows((rows) => rows.map((row) => {
      if (row.id !== rowId) return row;
      return { ...row, beforeFiles: row.beforeFiles.filter((_, i) => i !== fileIdx) };
    }));
  };

  const saveAllRows = async () => {
    if (selectedType !== "new") {
      alert("برای ذخیره، نوع فعالیت باید «عدم انطباق جدید» باشد.");
      return;
    }
    if (!selectedDepartment) {
      alert("بخش را انتخاب کنید.");
      return;
    }
    if (!selectedSubUnit) {
      alert("زیرواحد را انتخاب کنید.");
      return;
    }
    if (ncRows.length === 0) {
      alert("هیچ ردیفی برای ثبت وجود ندارد. ابتدا روی «جدید» کلیک کنید.");
      return;
    }
    for (const row of ncRows) {
      if (!row.s) {
        alert("برای همه ردیف‌ها مقدار S باید انتخاب شود.");
        return;
      }
      if (!row.description || !row.description.trim()) {
        alert("برای همه ردیف‌ها شرح (Description) باید تکمیل شود.");
        return;
      }
      if ((row.beforeFiles || []).length > 4) {
        alert("حداکثر 4 تصویر برای هر ردیف مجاز است.");
        return;
      }
    }

    setSavingAll(true);
    try {
      // prepare multiple uploads
      const promises = ncRows.map((row) => {
        const fd = new FormData();
        fd.append("unit", selectedDepartment);
        fd.append("department", selectedDepartment);
        fd.append("subunit", selectedSubUnit);
        fd.append("s", row.s);
        fd.append("description", row.description);
        fd.append("createdBy", user?.username || "admin");
        row.beforeFiles.forEach((f) => fd.append("beforeImages", f));
        return API.post("/nonconformities", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      });

      await Promise.all(promises);
      alert("همه موارد با موفقیت ثبت شدند.");
      // clear
      setNcRows([]);
      // refresh list if viewing
      if (selectedType === "view") fetchNonConformities();
    } catch (err) {
      console.error("Error saving rows", err);
      alert("خطا در ثبت: " + (err.response?.data?.message || err.message));
    } finally {
      setSavingAll(false);
    }
  };

  // re-compute scores when needed
  useEffect(() => {
    if (selectedType === "scores") computeSupervisorScores();
  }, [ncList, supervisors, selectedType, computeSupervisorScores]);

  const yearOptions = Array.from({ length: 6 }, (_, idx) => moment().jYear() - 3 + idx);
  
  // محاسبه نمره سرپرست با فرمول صحیح
  const viewScore =
    ncList.length > 0
      ? Math.round(
          (ncList.filter((i) => i.status === "Fixed").length / ncList.length) * 100
        )
      : 0;

  // محاسبه بالاترین و پایین‌ترین نمرات
  const getHighestLowestScores = () => {
    if (scoresData.length === 0) return { highest: [], lowest: [] };
    
    const maxScore = Math.max(...scoresData.map(s => s.score));
    const minScore = Math.min(...scoresData.map(s => s.score));
    
    const highest = scoresData.filter(s => s.score === maxScore);
    const lowest = scoresData.filter(s => s.score === minScore);
    
    return { highest, lowest, maxScore, minScore };
  };

  const { highest, lowest, maxScore, minScore } = getHighestLowestScores();

  // ---------- UI ----------
  return (
    <div style={styles.wrap}>
      <div style={styles.container}>
        <AdminHeader />

        <div style={styles.inner}>
          {/* MAIN CONTENT (left) */}
          <div style={styles.content}>
            {activeMenu === "nonconformities" && (
              <>
                <h2 style={styles.title}>مدیریت عدم انطباق</h2>

                {/* TOP blue area (activity type, department, subunit) */}
                <div style={styles.topBlue}>
                  <div style={styles.topRow}>
                    <div style={styles.topCol}>
                      <label style={styles.label}>نوع فعالیت (Activity Type)</label>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        style={styles.select}
                      >
                        <option value="">-- انتخاب --</option>
                        {typeOptions.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>

                    <div style={styles.topCol}>
                      <label style={styles.label}>بخش (Department)</label>
                      <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        style={styles.select}
                        disabled={!selectedType} // disabled until type chosen
                      >
                        <option value="">-- انتخاب بخش --</option>
                        {Object.keys(unitsHierarchy).map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div style={styles.topCol}>
  <label style={styles.label}>زیرواحد (SubUnit)</label>
  <select
    value={selectedSubUnit}
    onChange={(e) => setSelectedSubUnit(e.target.value)}
    style={styles.select}
    disabled={!selectedType || !selectedDepartment}
  >
    <option value="">-- انتخاب زیرواحد --</option>
    {subUnits.map((s) => <option key={s} value={s}>{s}</option>)}
  </select>
</div>

{selectedType === "new" && (
  <div style={styles.whiteArea}>
    <div style={styles.whiteTopControls}>
      <div style={{ display: "flex", gap: 8 }}>
        <button style={styles.primaryAction} onClick={onAddRow}>جدید</button>
        <button style={styles.saveBtn} onClick={saveAllRows} disabled={savingAll || ncRows.length === 0}>
          {savingAll ? "در حال ذخیره..." : "ذخیره"}
        </button>
      </div>
      <div style={{ color: "#666", fontSize: 12 }}>واحد و زیرواحد باید انتخاب شود.</div>
    </div>

    {/* Rows area */}
    <div style={{ marginTop: 12 }}>
      {ncRows.length === 0 ? (
        <div style={{ padding: 12, color: "#666" }}>برای ثبت چند مورد، روی «جدید» کلیک کنید.</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table} className="bordered-table">
            <thead>
              <tr>
                <th style={styles.cell}>ردیف</th>
                <th style={styles.cell}>S *</th>
                <th style={styles.cell}>شرح *</th>
                <th style={styles.cell}>تصاویر قبل (حداکثر ۴)</th>
                <th style={styles.cell}>اقدامات</th>
              </tr>
            </thead>
            <tbody>
              {ncRows.map((row, idx) => (
                <tr key={row.id}>
                  <td style={{ ...styles.cell, width: 60 }}>{idx + 1}</td>

                  <td style={{ ...styles.cell, minWidth: 140 }}>
                    <select value={row.s} onChange={(e) => onRowChange(row.id, { s: e.target.value })} style={styles.selectSmall}>
                      <option value="">-- انتخاب S --</option>
                      <option value="S1">S1</option>
                      <option value="S2">S2</option>
                      <option value="S3">S3</option>
                      <option value="S4">S4</option>
                      <option value="S5">S5</option>
                      <option value="Safety">Safety</option>
                    </select>
                  </td>

                  <td style={{ ...styles.cell, minWidth: 300 }}>
                    <input
                      value={row.description}
                      onChange={(e) => onRowChange(row.id, { description: e.target.value })}
                      placeholder="شرح را وارد کنید..."
                      style={styles.input}
                    />
                  </td>

                  <td style={{ ...styles.cell, minWidth: 260 }}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => onRowPickFiles(row.id, e.target.files)}
                      style={styles.fileInput}
                      ref={(el) => (fileInputsRef.current[row.id] = el)}
                    />
                    {row.beforeFiles && row.beforeFiles.length > 0 && (
                      <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {row.beforeFiles.map((f, fi) => (
                          <div key={fi} style={styles.previewBox}>
                            <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>{f.name}</span>
                            <button onClick={() => onRowRemoveFile(row.id, fi)} style={styles.removeFileBtn}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>

                  <td style={{ ...styles.cell, minWidth: 120 }}>
                    <button style={styles.removeRowBtn} onClick={() => onRemoveRow(row.id)}>حذف ردیف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
)}

{selectedType === "view" && (
  <div style={styles.whiteArea}>
    <div style={styles.filterRow}>
      <div>
        <label style={styles.label}>سال</label>
        <select value={selectedJYear} onChange={(e) => setSelectedJYear(e.target.value)} style={styles.select}>
          {yearOptions.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      <div>
        <label style={styles.label}>ماه</label>
        <select value={selectedJMonth} onChange={(e) => setSelectedJMonth(e.target.value)} style={styles.select}>
          {jalaliMonths.map((m, idx) => (
            <option key={m} value={idx + 1}>{m}</option>
          ))}
        </select>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        <button
          style={styles.actionBtn}
          onClick={() => {
            if (!selectedDepartment || !selectedSubUnit) {
              alert("واحد و زیرواحد را انتخاب کنید.");
              return;
            }
            setViewConfirmed(true);
            fetchNonConformities();
          }}
          disabled={!selectedDepartment || !selectedSubUnit}
        >
          تایید
        </button>
        <button
          style={styles.exportBtn}
          onClick={() => {
            if (!selectedDepartment || !selectedSubUnit) {
              alert("واحد و زیرواحد را انتخاب کنید.");
              return;
            }
            const { exportMonth } = getMonthRangeGregorian(selectedJYear, selectedJMonth);
            const url = `${API.defaults.baseURL}/nonconformities/export/${encodeURIComponent(selectedDepartment)}/${encodeURIComponent(selectedSubUnit)}/${encodeURIComponent(exportMonth)}`;
            window.open(url, "_blank");
          }}
        >
          دانلود با فرمت اکسل
        </button>
      </div>
    </div>

    <div style={styles.scoreStrip}>
      <div>نمره سرپرست: <strong>{viewScore}%</strong></div>
      <div>کل موارد: {ncList.length}</div>
      <div>رفع شده: {ncList.filter((i) => i.status === "Fixed").length}</div>
      <div>رفع نشده/ناقص: {ncList.filter((i) => i.status !== "Fixed").length}</div>
    </div>

    {loadingList ? (
      <div>در حال بارگذاری...</div>
    ) : !viewConfirmed ? (
      <div style={{ color: "#555" }}>برای مشاهده، ماه و زیرواحد را انتخاب و روی «تایید» بزنید.</div>
    ) : ncList.length === 0 ? (
      <div>موردی یافت نشد.</div>
    ) : (
      <div style={{ overflowX: "auto" }}>
        <table style={styles.table} className="bordered-table">
          <thead>
            <tr>
              <th style={styles.cell}>ردیف</th>
              <th style={styles.cell}>S</th>
              <th style={styles.cell}>شرح عدم انطباق</th>
              <th style={styles.cell}>تاریخ مشاهده</th>
              <th style={styles.cell}>وضعیت</th>
              <th style={styles.cell}>درصد پیشرفت</th>
              <th style={styles.cell}>تصویر قبل از اصلاح</th>
              <th style={styles.cell}>تصویر پس از اصلاح</th>
              <th style={styles.cell}>توضیحات</th>
              <th style={styles.cell}>ثبت کننده</th>
              <th style={styles.cell}>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {ncList.map((it, idx) => {
              const isEditing = editingId === it._id;
              const statusLabel =
                statusOptions.find((s) => s.value === it.status)?.label || it.status || "-";
              return (
                <tr key={it._id}>
                  <td style={styles.cell}>{idx + 1}</td>
                  <td style={styles.cell}>
                    {isEditing ? (
                      <select
                        value={editDraft.s}
                        onChange={(e) => setEditDraft({ ...editDraft, s: e.target.value })}
                        style={styles.selectSmall}
                      >
                        <option value="">انتخاب</option>
                        <option value="S1">S1</option>
                        <option value="S2">S2</option>
                        <option value="S3">S3</option>
                        <option value="S4">S4</option>
                        <option value="S5">S5</option>
                        <option value="Safety">Safety</option>
                      </select>
                    ) : (
                      it.s
                    )}
                  </td>
                  <td style={{ ...styles.cell, minWidth: 240 }}>
                    {isEditing ? (
                      <input
                        value={editDraft.description}
                        onChange={(e) => setEditDraft({ ...editDraft, description: e.target.value })}
                        style={styles.input}
                      />
                    ) : (
                      it.description
                    )}
                  </td>
                  <td style={styles.cell}>{it.viewDateJalali || moment(it.date).format("jYYYY/jMM/jDD")}</td>
                  <td style={styles.cell}>
                    {isEditing ? (
                      <select
                        value={editDraft.status}
                        onChange={(e) => setEditDraft({ ...editDraft, status: e.target.value })}
                        style={styles.selectSmall}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      statusLabel
                    )}
                  </td>
                  <td style={{ ...styles.cell, minWidth: 120 }}>
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={editDraft.progress}
                        onChange={(e) => setEditDraft({ ...editDraft, progress: e.target.value })}
                        style={styles.input}
                      />
                    ) : (
                      `${it.progress ?? 0}%`
                    )}
                  </td>
                  <td style={{ ...styles.cell, minWidth: 160 }}>
                    {isEditing ? (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => setEditFiles(Array.from(e.target.files || []))}
                          style={styles.fileInput}
                        />
                        {(it.beforeImages || []).map((src, i) => (
                          <a
                            key={i}
                            href={`${API.defaults.baseURL}${src}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ marginRight: 6, fontSize: 12 }}
                          >
                            تصویر {i + 1}
                          </a>
                        ))}
                      </div>
                    ) : (
                      (it.beforeImages || []).slice(0, 2).map((src, i) => (
                        <a key={i} href={`${API.defaults.baseURL}${src}`} target="_blank" rel="noreferrer" style={{ marginRight: 6 }}> نمایش </a>
                      ))
                    )}
                  </td>
                  <td style={{ ...styles.cell, minWidth: 160 }}>
                    {(it.afterImages || []).slice(0, 2).map((src, i) => (
                      <a key={i} href={`${API.defaults.baseURL}${src}`} target="_blank" rel="noreferrer" style={{ marginRight: 6 }} >
                        نمایش
                      </a>
                    ))}
                  </td>
                  <td style={{ ...styles.cell, minWidth: 200 }}>
                    {isEditing ? (
                      <textarea
                        value={editDraft.notes}
                        onChange={(e) => setEditDraft({ ...editDraft, notes: e.target.value })}
                        style={{ ...styles.input, minHeight: 50 }}
                      />
                    ) : (
                      it.notes || "-"
                    )}
                  </td>
                  <td style={styles.cell}>{it.createdBy || "-"}</td>
                  <td style={styles.cell}>
                    {isEditing ? (
                      <button style={styles.saveBtn} onClick={() => saveEdit(it._id)}>💾 ذخیره</button>
                    ) : (
                      <div style={{ display: "flex", gap: 6, flexDirection: "column" }}>
                        <button style={styles.primaryAction} onClick={() => startEdit(it)}>ویرایش</button>
                        <button style={styles.delBtn} onClick={() => deleteRow(it._id)}>حذف</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}

                    // ---------- styles ----------
const menuBtn = (active) => ({
  display: "block",
  width: "100%",
  padding: "0.8rem 1rem",
  marginBottom: 12,
  textAlign: "right",
  background: active ? "#0284c7" : "#f1f5f9",
  color: active ? "#fff" : "#333",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: active ? 600 : 400
});

const styles = {
  wrap: { minHeight: "100vh", width: "100%", position: "relative", direction: "rtl", background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)" },
  container: { minHeight: "100vh", width: "100%", background: "transparent" },
  inner: {
    display: "flex",
    gap: 24,
    padding: "24px",
    width: "100%",
    maxWidth: 1600,
    margin: "0 auto",
    alignItems: "flex-start",
  },
  menu: { width: 260, flexShrink: 0, display: "flex", flexDirection: "column", background: "#fff", padding: 16, borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
  badge: { display: "inline-block", background: "#ef4444", color: "#fff", borderRadius: 12, padding: "2px 8px", marginLeft: 8, fontSize: 12 },
  content: { flex: 1, background: "#fff", padding: 24, borderRadius: 12, minHeight: "calc(100vh - 150px)", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
  title: { marginTop: 0, marginBottom: 16, color: "#0369a1", fontSize: "1.5rem" },

  /* top blue area */
  topBlue: { background: "#e0f2fe", padding: 16, borderRadius: 10, border: "1px solid #bae6fd" },
  topRow: { display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" },
  topCol: { minWidth: 220 },

  label: { display: "block", marginBottom: 6, color: "#0369a1", fontWeight: 500 },
  select: { padding: "10px 12px", borderRadius: 8, border: "1px solid #bae6fd", minWidth: 180, background: "#fff" },
  selectSmall: { padding: "8px 10px", borderRadius: 8, border: "1px solid #bae6fd", minWidth: 120, background: "#fff" },

  /* white area with rows */
  whiteArea: { background: "#fff", marginTop: 16, padding: 16, borderRadius: 10, border: "1px solid #e0f2fe" },
  whiteTopControls: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  filterRow: { display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end", marginTop: 12 },
  scoreStrip: { display: "flex", gap: 16, flexWrap: "wrap", background: "#f0f9ff", padding: 16, borderRadius: 10, margin: "16px 0", border: "1px solid #bae6fd" },

  actionBtn: { background: "#e0f2fe", border: "1px solid #bae6fd", padding: "10px 16px", borderRadius: 8, cursor: "pointer", color: "#0369a1", fontWeight: 500 },
  primaryAction: { background: "#0284c7", color: "#fff", border: "none", padding: "10px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 500 },
  saveBtn: { background: "#22c55e", color: "#fff", border: "none", padding: "10px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 500 },
  delBtn: { background: "#ef4444", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 500 },

  table: { width: "100%", borderCollapse: "collapse", textAlign: "left", marginTop: 12 },
  cell: { border: "1px solid #bae6fd", padding: 10, textAlign: "center", verticalAlign: "middle", background: "#fff" },
  input: { width: "100%", padding: 10, marginBottom: 0, borderRadius: 8, border: "1px solid #bae6fd" },
  fileInput: { width: "100%", marginTop: 6 },

  previewBox: { background: "#f0f9ff", padding: 8, borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, position: "relative" },
  removeFileBtn: { background: "#ef4444", color: "#fff", border: "none", padding: "4px 8px", borderRadius: 6, cursor: "pointer", fontWeight: 700 },

  removeRowBtn: { background: "#ef4444", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 8, cursor: "pointer" },

  scoreSummaryCard: { padding: 16, background: "#f0f9ff", borderRadius: 10, minWidth: 180, maxWidth: 300, textAlign: "center", border: "1px solid #bae6fd" },
  scoreTitle: { fontSize: 13, color: "#0369a1", marginBottom: 8 },
  scoreNumber: { fontSize: 20, fontWeight: 700, marginTop: 4, color: "#0284c7" },

  exportBtn: { background: "#0284c7", color: "#fff", border: "none", padding: "10px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 500 },
};

export default AdminDashboard;
