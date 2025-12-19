import { useState, useEffect } from "react";
import moment from "moment-jalaali";
import { commonStyles, theme } from "../styles";

const PersianDatePicker = ({ value, onChange, placeholder = "تاریخ را انتخاب کنید" }) => {
  const [displayValue, setDisplayValue] = useState(
    value ? moment(value).format("jYYYY/jMM/jDD") : ""
  );
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (value) {
      setDisplayValue(moment(value).format("jYYYY/jMM/jDD"));
    } else {
      setDisplayValue("");
    }
  }, [value]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);
    
    // Try to parse Persian date
    const parts = inputValue.split("/");
    if (parts.length === 3) {
      const jYear = parseInt(parts[0]);
      const jMonth = parseInt(parts[1]) - 1;
      const jDay = parseInt(parts[2]);
      
      if (jYear && jMonth >= 0 && jDay) {
        const m = moment(`${jYear}/${jMonth + 1}/${jDay}`, "jYYYY/jMM/jDD");
        if (m.isValid()) {
          onChange(m.toDate());
        }
      }
    }
  };

  const handleDateSelect = (year, month, day) => {
    const m = moment(`${year}/${month + 1}/${day}`, "jYYYY/jMM/jDD");
    const dateStr = m.format("jYYYY/jMM/jDD");
    setDisplayValue(dateStr);
    onChange(m.toDate());
    setShowCalendar(false);
  };

  const currentJDate = moment();
  const [calendarYear, setCalendarYear] = useState(currentJDate.jYear());
  const [calendarMonth, setCalendarMonth] = useState(currentJDate.jMonth());

  const daysInMonth = moment.jDaysInMonth(calendarYear, calendarMonth);
  const firstDayOfMonth = moment(`${calendarYear}/${calendarMonth + 1}/1`, "jYYYY/jMM/jDD").day();
  
  const days = [];
  const dayNames = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

  // Empty cells for days before the first day of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const monthNames = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
  ];

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onFocus={() => setShowCalendar(true)}
        placeholder={placeholder}
        style={commonStyles.input}
      />
      {showCalendar && (
        <>
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999,
            }}
            onClick={() => setShowCalendar(false)}
          />
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "#fff",
              border: `2px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.md,
              padding: theme.spacing.md,
              marginTop: theme.spacing.xs,
              zIndex: 1000,
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: theme.spacing.sm }}>
              <button
                type="button"
                onClick={() => {
                  if (calendarMonth === 0) {
                    setCalendarYear(calendarYear - 1);
                    setCalendarMonth(11);
                  } else {
                    setCalendarMonth(calendarMonth - 1);
                  }
                }}
                style={{
                  ...commonStyles.button,
                  padding: "4px 12px",
                  fontSize: "0.9rem",
                }}
              >
                ‹
              </button>
              <div style={{ fontWeight: 600, color: theme.colors.primary }}>
                {monthNames[calendarMonth]} {calendarYear}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (calendarMonth === 11) {
                    setCalendarYear(calendarYear + 1);
                    setCalendarMonth(0);
                  } else {
                    setCalendarMonth(calendarMonth + 1);
                  }
                }}
                style={{
                  ...commonStyles.button,
                  padding: "4px 12px",
                  fontSize: "0.9rem",
                }}
              >
                ›
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: theme.spacing.sm }}>
              {dayNames.map((day) => (
                <div
                  key={day}
                  style={{
                    textAlign: "center",
                    fontWeight: 600,
                    color: theme.colors.primary,
                    padding: theme.spacing.xs,
                  }}
                >
                  {day}
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
              {days.map((day, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => day && handleDateSelect(calendarYear, calendarMonth, day)}
                  disabled={!day}
                  style={{
                    ...commonStyles.button,
                    padding: "8px 4px",
                    fontSize: "0.85rem",
                    opacity: day ? 1 : 0,
                    cursor: day ? "pointer" : "default",
                    backgroundColor: day ? theme.colors.primary : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (day) e.target.style.backgroundColor = theme.colors.primaryHover;
                  }}
                  onMouseLeave={(e) => {
                    if (day) e.target.style.backgroundColor = theme.colors.primary;
                  }}
                >
                  {day || ""}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PersianDatePicker;

