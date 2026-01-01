//15/9
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
                      <label style={styles.label}>نوع فعالیت (Activity Type)</
