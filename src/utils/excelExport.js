import * as XLSX from "xlsx";
import { getChecklistTypeName } from "../data/checklistQuestions";

export const exportFullChecklist = (checklist) => {
  const workbook = XLSX.utils.book_new();

  // Create main data sheet
  const mainData = [
    ["چک‌لیست ایمنی - گزارش کامل"],
    ["عنوان:", checklist.title],
    ["نوع:", getChecklistTypeName(checklist.type)],
    ["تاریخ تکمیل:", new Date(checklist.createdAt).toLocaleDateString("fa-IR")],
    [""],
    ["مغایرت", "دارد", "ندارد", "عدم کاربرد", "توضیحات"],
  ];

  checklist.items.forEach((item) => {
    const row = [
      item.question,
      item.answer === "دارد" ? "✓" : "",
      item.answer === "ندارد" ? "✗" : "",
      item.answer === "عدم کاربرد" ? "—" : "",
      item.comment || "-",
    ];
    mainData.push(row);
  });

  if (checklist.image) {
    mainData.push([""], ["عکس ضمیمه:", `http://localhost:5000${checklist.image}`]);
  }

  if (checklist.supervisorSignature) {
    mainData.push(["امضای نظارت‌کننده:", "پیوست شده"]);
  }

  const mainSheet = XLSX.utils.aoa_to_sheet(mainData);
  XLSX.utils.book_append_sheet(workbook, mainSheet, "گزارش کامل");

  // Download
  const fileName = `چک‌لیست_${checklist.title}_${new Date().getTime()}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const exportNonCompliancesOnly = (checklist) => {
  const workbook = XLSX.utils.book_new();

  // Filter non-compliances
  const nonCompliances = checklist.items.filter(
    (item) => item.answer === "ندارد" || (item.answer === "ندارد" && item.comment)
  );

  if (nonCompliances.length === 0) {
    alert("هیچ مغایرتی یافت نشد. تمام موارد مطابق با استاندارد هستند.");
    return;
  }

  const data = [
    ["گزارش مغایرت‌های ایمنی"],
    ["عنوان چک‌لیست:", checklist.title],
    ["نوع:", getChecklistTypeName(checklist.type)],
    ["تاریخ تکمیل:", new Date(checklist.createdAt).toLocaleDateString("fa-IR")],
    ["تعداد مغایرت‌ها:", nonCompliances.length],
    [""],
    ["مغایرت", "توضیحات"],
  ];

  nonCompliances.forEach((item) => {
    data.push([item.question, item.comment || "بدون توضیحات"]);
  });

  const sheet = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, sheet, "مغایرت‌ها");

  // Download
  const fileName = `مغایرت‌ها_${checklist.title}_${new Date().getTime()}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

// Export a whole month set into a single workbook
export const exportMonthFull = (monthBlock) => {
  const wb = XLSX.utils.book_new();
  const header = [
    ["گزارش عدم انطباق - ", monthBlock.month],
    ["امتیاز سرپرست:", `${monthBlock.supervisorScore}%`],
    [""],
    ["S", "شرح", "تاریخ", "وضعیت", "پیشرفت %", "تصاویر قبل", "تصاویر بعد", "یادداشت"],
  ];
  const sheet = XLSX.utils.aoa_to_sheet(header);
  (monthBlock.items || []).forEach((it) => {
    const row = [
      it.s || "-",
      it.description || "-",
      new Date(it.date).toLocaleDateString("fa-IR"),
      it.status || "",
      typeof it.progress === "number" ? it.progress : "",
      (it.beforeImages || []).map((p) => `http://localhost:5000${p}`).join(" | "),
      (it.afterImages || []).map((p) => `http://localhost:5000${p}`).join(" | "),
      it.notes || "",
    ];
    XLSX.utils.sheet_add_aoa(sheet, [row], { origin: -1 });
  });
  XLSX.utils.book_append_sheet(wb, sheet, "ماه");
  const file = `عدم_انطباق_${monthBlock.month}_${Date.now()}.xlsx`;
  XLSX.writeFile(wb, file);
};

export const exportMonthNon = (monthBlock) => {
  const wb = XLSX.utils.book_new();
  const header = [
    ["گزارش مغایرت‌های عدم انطباق - ", monthBlock.month],
    [""],
    ["S", "شرح", "تاریخ", "وضعیت", "یادداشت"],
  ];
  const sheet = XLSX.utils.aoa_to_sheet(header);
  (monthBlock.items || [])
    .filter((it) => it.status === "Unfixed" || it.status === "Incomplete")
    .forEach((it) => {
      const row = [
        it.s || "-",
        it.description || "-",
        new Date(it.date).toLocaleDateString("fa-IR"),
        it.status,
        it.notes || "",
      ];
      XLSX.utils.sheet_add_aoa(sheet, [row], { origin: -1 });
    });
  XLSX.utils.book_append_sheet(wb, sheet, "مغایرت‌ها");
  const file = `مغایرت‌ها_${monthBlock.month}_${Date.now()}.xlsx`;
  XLSX.writeFile(wb, file);
};

