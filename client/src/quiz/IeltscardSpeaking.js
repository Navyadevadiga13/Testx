import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMicrophone } from "react-icons/fa";
import DatePicker from "react-datepicker";
import axios from "axios";
import getApiBaseUrl from "../utils/api";
import "react-datepicker/dist/react-datepicker.css";

function SpeakingTestReady() {

  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (date) => {
    setSelectedDate(date);
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
          date: selectedDate.toISOString().split("T")[0]
        }
      );

      console.log("API RESPONSE:", res.data);

      alert(
`✅ Your speaking test appointment for ${selectedDate.toDateString()} has been submitted.

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
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "120px",
        fontFamily: "Segoe UI, sans-serif"
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          background: "#ffffff",
          borderRadius: "18px",
          border: "1px solid #e5e7eb",
          padding: "40px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
        }}
      >

        <h1
          style={{
            color: "#166534",
            fontSize: "2.2rem",
            fontWeight: "800",
            textAlign: "center",
            marginBottom: "10px"
          }}
        >
          <FaMicrophone style={{ marginRight: "10px" }} />
          Speaking Test
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginBottom: "30px"
          }}
        >
          Prepare for your IELTS Speaking assessment
        </p>

        {/* Instructions */}

        <div
          style={{
            background: "#f9fafb",
            padding: "22px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            lineHeight: "1.7",
            color: "#374151"
          }}
        >

          <p>• Candidates must visit the test centre location to take the test.</p>

          <p>
            • Test Centre Address: <br />
            1st Floor, Takshila Building, MG Rd, near Janatha Delux Hotel,
            Ballalbagh, Kodailbail, Mangaluru, Karnataka 575003.
          </p>

          <p>• It consists of three parts and lasts 11–14 minutes.</p>

          <p>• Please arrive at least 15 minutes early and bring valid identification.</p>

          <p>• Weekend bookings are not available.</p>

        </div>

        {/* Inputs */}

        <div style={{ marginTop: "25px" }}>

          <input
            type="text"
            placeholder="Enter your full name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#111827"
            }}
          />

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#111827"
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
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#111827"
            }}
          />

        </div>

        {/* Date Picker */}

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "30px"
          }}
        >

          <DatePicker
            selected={selectedDate}
            onChange={handleChange}
            filterDate={isWeekday}
            minDate={new Date()}
            dateFormat="MMMM d, yyyy"
            popperPlacement="bottom"
            placeholderText="📅 Select Speaking Test Date"
            customInput={
              <input
                style={{
                  width: "260px",
                  padding: "14px",
                  borderRadius: "10px",
                  border: `2px solid ${borderColor}`,
                  background: "#ffffff",
                  color: "#111827",
                  fontSize: "15px",
                  textAlign: "center",
                  cursor: "pointer",
                  outline: "none",
                  boxShadow: "0 4px 10px rgba(25,253,145,0.15)"
                }}
              />
            }
          />

        </div>

        {/* Request Button */}

        {fullname && email && contact && selectedDate && (

          <div style={{ display: "flex", justifyContent: "center", marginTop: "35px" }}>

            <button
              onClick={handleBooking}
              disabled={loading}
              style={{
                minWidth: "260px",
                background: "#19fd91",
                color: "#000",
                border: "none",
                padding: "12px 28px",
                borderRadius: "10px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(25,253,145,0.25)",
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "Sending..." : "Request Appointment"}
            </button>

          </div>

        )}

        {/* Exit Button */}

        <div style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>

          <button
            onClick={() => navigate("/")}
            style={{
              background: "#ffffff",
              color: "#374151",
              border: "1px solid #d1d5db",
              padding: "12px 28px",
              borderRadius: "10px",
              cursor: "pointer"
            }}
          >
            Exit Module
          </button>

        </div>

      </div>

    </div>

  );
}

export default SpeakingTestReady;