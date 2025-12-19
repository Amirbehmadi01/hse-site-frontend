// const ChecklistItem = ({ question, index, formData, handleAnswerChange }) => {
//     return (
//       <div style={{ marginBottom: "15px" }}>
//         <p>{question}</p>
//         <div>
//           {["دارد", "ندارد", "عدم کاربرد"].map((option) => (
//             <label key={option} style={{ marginLeft: "10px" }}>
//               <input
//                 type="radio"
//                 name={`q${index}`}
//                 value={option}
//                 checked={formData[index]?.answer === option}
//                 onChange={(e) => handleAnswerChange(index, "answer", e.target.value)}
//               />
//               {option}
//             </label>
//           ))}
//         </div>
//         <textarea
//           placeholder="توضیحات..."
//           value={formData[index]?.comment || ""}
//           onChange={(e) => handleAnswerChange(index, "comment", e.target.value)}
//           style={{ width: "100%", marginTop: "5px", borderRadius: "8px", padding: "8px" }}
//         />
//       </div>
//     );
//   };
  
//   export default ChecklistItem;

const ChecklistItem = ({ question, index, answer, comment }) => {
  return (
    <div style={{ marginBottom: "15px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
      <p style={{ fontWeight: "bold" }}>{question}</p>
      <div style={{ display: "flex", gap: "15px", marginBottom: "5px" }}>
        <label style={{ color: answer === "دارد" ? "green" : "gray" }}>✅ دارد</label>
        <label style={{ color: answer === "ندارد" ? "red" : "gray" }}>❌ ندارد</label>
        <label style={{ color: answer === "عدم کاربرد" ? "orange" : "gray" }}>⭕ عدم کاربرد</label>
      </div>
      <textarea
        placeholder="توضیحات..."
        value={comment || ""}
        readOnly
        style={{
          width: "100%",
          marginTop: "5px",
          borderRadius: "8px",
          padding: "8px",
          backgroundColor: "#f9f9f9",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
};

export default ChecklistItem;