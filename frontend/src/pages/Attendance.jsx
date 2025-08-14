import React, { useEffect, useState } from "react";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";
import axios from "axios";
import Swal from "sweetalert2";
import "../Styles/toast.scss"; // ✅ We'll create this file for toast styling

// ✅ Reusable Toast configuration
const Toast = Swal.mixin({
  toast: true,
  position: "top-end", 
  timer: 3000, 
  timerProgressBar: true,
  background: "#333", 
  color: "#fff", 
  customClass: {
    popup: "long-toast" 
  }
});

function Attendance() {
  const [currentTime, setCurrentTime] = useState("");
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setDate(now);
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Check In
  const handleCheckIn = async () => {
    if (checkInTime && !checkOutTime) {
      Toast.fire({
        icon: "warning",
        title: "You have already checked in. Please check out first."
      });
      return;
    }

    const time = new Date().toLocaleTimeString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    setCheckInTime(time);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/timer/start",
        {
          time,
          date: new Date().toLocaleDateString("en-CA"),
          userId: "1234",
        }
      );
      console.log("Check-In Response:", response.data);

      Toast.fire({
        icon: "success",
        title: `Checked In at ${time}`
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Check-In Failed. Try again."
      });
      console.error("Check-In Error:", error);
    }
  };

  // ✅ Check Out
  const handleCheckOut = async () => {
    if (!checkInTime) {
      Toast.fire({
        icon: "error",
        title: "You must check in before checking out."
      });
      return;
    }

    if (checkOutTime) {
      Toast.fire({
        icon: "warning",
        title: "You have already checked out today."
      });
      return;
    }

    const time = new Date().toLocaleTimeString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    setCheckOutTime(time);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/timer/stop",
        {
          time,
          date: new Date().toLocaleDateString("en-CA"),
          userId: "1234",
        }
      );
      console.log("Check-Out Response:", response.data);

      Toast.fire({
        icon: "success",
        title: `Checked Out at ${time}`
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Check-Out Failed. Try again."
      });
      console.error("Check-Out Error:", error);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Attendance System</h2>

      <div className="text-xl mb-4">
        <strong>Current Time: </strong>
        {currentTime}
      </div>

      <div className="relative w-[200px] h-[200px] mx-auto mb-6">
        <Clock value={date} size={200} />
        <div className="absolute top-[11px] left-1/2 transform -translate-x-1/2 text-sm font-bold">
          12
        </div>
        <div className="absolute bottom-[12px] left-1/2 transform -translate-x-1/2 text-sm font-bold">
          6
        </div>
        <div className="absolute top-1/2 left-[13px] transform -translate-y-1/2 text-sm font-bold">
          9
        </div>
        <div className="absolute top-1/2 right-[13px] transform -translate-y-1/2 text-sm font-bold">
          3
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={handleCheckIn}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Check In
        </button>
        <button
          onClick={handleCheckOut}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Check Out
        </button>
      </div>

      {checkInTime && (
        <p>
          <strong>Checked In At:</strong> {checkInTime}
        </p>
      )}
      {checkOutTime && (
        <p>
          <strong>Checked Out At:</strong> {checkOutTime}
        </p>
      )}
    </div>
  );
}

export default Attendance;
