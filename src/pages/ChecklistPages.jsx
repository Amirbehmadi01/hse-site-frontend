import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { checklistQuestions, getChecklistTypeName } from "../data/checklistQuestions";
import SupervisorSignature from "../components/SupervisorSignature.jsx";
import { exportFullChecklist } from "../utils/excelExport";
import API from "../services/api.js";

const ChecklistPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(""); // ✅ عنوان چک‌لیست
  const [signature, setSignature] = useState(null);

  const questions = checklistQuestions[type] || [];
  const typeName = getChecklistTypeName(type);
  const previewData = questions.map((q, idx) => ({
    question: q,
    answer: formData[idx]?.answer || "",
    comment: formData[idx]?.comment || "",
  }));

  const handleAnswerChange = (index, field, value) => {
    const updated = [...formData];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("لطفاً عنوان چک‌لیست را وارد کنید");
      return;
    }
    setLoading(true);

    const cleanedData = questions.map((q, idx) => ({
      question: q,
      answer: formData[idx]?.answer || "",
      comment: formData[idx]?.comment || "",
    }));

    try {
      const data = new FormData();
      data.append("title", title);
      data.append("type", type);
      data.append("items", JSON.stringify(cleanedData));
      if (image) data.append("image", image);
      if (signature) data.append("supervisorSignature", signature);

      // await axios.post("http://localhost:5000/api/checklists", data);
      await API.post("/checklists", data);


      alert("✅ چک‌لیست با موفقیت ذخیره شد");
      setFormData([]);
      setImage(null);
      setTitle("");
      navigate(-1); // بازگشت به صفحه قبل
    } catch (error) {
      console.error("Error creating checklist:", error);
      alert("❌ خطا در ذخیره چک‌لیست");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", direction: "rtl", fontFamily: "sans-serif", marginTop: "50px" }}>
      <form onSubmit={handleSubmit} style={{ width: "90%", maxWidth: "900px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          📝 چک‌لیست {typeName}
        </h2>

        {/* ✅ عنوان چک‌لیست */}
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <label>📌 عنوان چک‌لیست (کد یا محل): </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="محل یا شناسه تجهیز را وارد کنید"
            style={{ padding: "5px", width: "50%" }}
            required
          />
        </div>

        <table style={{ width: "100%", margin: "0 auto", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={thStyle}>مغایرت</th>
              <th style={thStyle}>دارد</th>
              <th style={thStyle}>ندارد</th>
              <th style={thStyle}>عدم کاربرد</th>
              <th style={thStyle}>توضیحات</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, index) => (
              <tr key={index}>
                <td style={{ ...tdStyle, width: "40%" }}>{q}</td>
                {["دارد", "ندارد", "عدم کاربرد"].map((option) => (
                  <td key={option} style={tdStyle}>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={formData[index]?.answer === option}
                      onChange={(e) => handleAnswerChange(index, "answer", e.target.value)}
                      style={{ accentColor: "#007bff", width: "25px", height: "18px", cursor: "pointer" }}
                    />
                  </td>
                ))}
                <td style={tdStyle}>
                  <textarea
                    value={formData[index]?.comment || ""}
                    onChange={(e) => handleAnswerChange(index, "comment", e.target.value)}
                    style={{ width: "80%", height: "35px", borderRadius: "6px", border: "1px solid #ccc", padding: "5px", resize: "none" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: "20px" }}>
          <label>📸 آپلود عکس:</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </div>

        <div style={{ marginTop: "20px" }}>
          <SupervisorSignature onSignatureSave={setSignature} />
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: "10px" }}>
          <button
            type="button"
            onClick={() =>
              exportFullChecklist({
                title,
                type,
                items: previewData,
                createdAt: new Date(),
                supervisorSignature: signature,
              })
            }
            style={{ backgroundColor: "#17a2b8", color: "white", padding: "10px 20px", border: "none", borderRadius: "8px", cursor: "pointer" }}
          >
            دانلود اکسل
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ backgroundColor: "#007bff", color: "white", padding: "10px 25px", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "20px" }}
        >
          {loading ? "در حال ذخیره..." : "ذخیره چک‌لیست"}
        </button>
      </form>
    </div>
  );
};

const thStyle = { border: "1px solid #ccc", padding: "10px", fontWeight: "bold", background: "#e9e9e9" };
const tdStyle = { border: "1px solid #ccc", padding: "8px", verticalAlign: "middle" };

export default ChecklistPage;
