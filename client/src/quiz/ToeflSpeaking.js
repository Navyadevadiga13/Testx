import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import getApiBaseUrl from "../utils/api";
import "react-datepicker/dist/react-datepicker.css";

// Formats a Date using its local calendar fields (not UTC), so the date sent
// to the backend always matches the day the user actually picked/sees in the
// confirmation alert — toISOString() would shift it back a day for any
// positive-UTC-offset timezone (e.g. India, where WiZdom Center is located).
function toLocalDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

function ToeflSpeaking({ initialDate, onDateChange }) {

  const [selectedDate, setSelectedDate] = useState(initialDate || null);
  const [loading, setLoading] = useState(false);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");

  const width = useWindowWidth();
  const isMobile = width < 768;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (date) => {
    setSelectedDate(date);
    if (onDateChange) onDateChange(date);
  };

  const handleBooking = async () => {

    if (!fullname || !email || !contact) {
      alert("❌ Please enter name, email and contact number.");
      return;
    }

    if (contact.length !== 10) {
      alert("❌ Contact number must be 10 digits.");
      return;
    }

    if (!selectedDate) {
      alert("❌ Please select a date first.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${getApiBaseUrl()}/appointment/request`,
        {
          fullname,
          email,
          contact,
          date: toLocalDateString(selectedDate)
        }
      );

      alert(
`✅ Your appointment request for ${selectedDate.toDateString()} has been submitted.

Please wait for a confirmation call from the Wizdom Center team.
Your test slot will be confirmed during the call.`
      );

      setSelectedDate(null);
      setFullname("");
      setEmail("");
      setContact("");

    } catch (error) {
      console.error("API ERROR:", error.response?.data || error.message);
      alert("❌ Failed to send appointment request.");
    } finally {
      setLoading(false);
    }
  };

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const borderColor = "#19fd91";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: isMobile ? "110px" : "170px",
        paddingLeft: isMobile ? "12px" : 0,
        paddingRight: isMobile ? "12px" : 0,
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        fontFamily: "Segoe UI, sans-serif",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          padding: isMobile ? "22px" : "35px",
          borderRadius: "14px",
          border: "1px solid #e5e5e5",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#f9f9f9",
          gap: "20px",
          width: isMobile ? "100%" : undefined,
          minWidth: isMobile ? "0" : "340px",
          maxWidth: "420px",
          boxSizing: "border-box"
        }}
      >

        <h2
          style={{
            color: "#111",
            fontSize: "1.8rem",
            fontWeight: "700",
            margin: 0,
            textAlign: "center"
          }}
        >
          TOEFL Speaking Test Appointment
        </h2>

        {/* Instructions */}
        <div
          style={{
            background: "#ffffff",
            padding: "15px",
            borderRadius: "8px",
            borderLeft: `4px solid ${borderColor}`,
            color: "#444",
            fontSize: "14px",
            lineHeight: "1.6",
            border: "1px solid #eee"
          }}
        >
          <strong style={{ color: borderColor }}>Instructions:</strong>
          <br />
          • To take the TOEFL Speaking Test, you must visit the <b>WiZdom Center</b>.
          <br />
          • Select a preferred date using the calendar below.
          <br />
          • Weekend bookings are not available.
          <br />
          • After submitting your appointment request, wait for confirmation call.
          <br />
          • Your speaking test slot will be finalized during the call.
        </div>

        {/* Inputs */}
        <input
          type="text"
          placeholder="Enter your full name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            backgroundColor: "#ffffff",
            color: "#111"
          }}
        />

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            backgroundColor: "#ffffff",
            color: "#111"
          }}
        />

        <input
          type="tel"
          placeholder="Enter contact number"
          value={contact}
          maxLength={10}
          onChange={(e) =>
            setContact(e.target.value.replace(/\D/g, ""))
          }
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            backgroundColor: "#ffffff",
            color: "#111"
          }}
        />

        {/* Date Picker */}
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <DatePicker
            selected={selectedDate}
            onChange={handleChange}
            filterDate={isWeekday}
            minDate={new Date()}
            dateFormat="MMMM d, yyyy"
            popperPlacement="bottom"
            placeholderText="📅 Select a date"
            customInput={
              <input
                style={{
                  width: isMobile ? "100%" : "260px",
                  maxWidth: "260px",
                  padding: "14px",
                  borderRadius: "10px",
                  border: "2px solid #19fd91",
                  background: "#ffffff",
                  color: "#111",
                  fontSize: "15px",
                  textAlign: "center",
                  cursor: "pointer",
                  outline: "none",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                  boxSizing: "border-box"
                }}
              />
            }
          />
        </div>

        {/* Button */}
        {fullname && email && contact && selectedDate && (
          <button
            onClick={handleBooking}
            disabled={loading}
            style={{
              padding: "12px 24px",
              backgroundColor: borderColor,
              color: "#000",
              border: "none",
              borderRadius: "8px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              alignSelf: "center",
              marginTop: "10px",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Sending..." : "Request Appointment"}
          </button>
        )}

      </div>
    </div>
  );
}

export default ToeflSpeaking;