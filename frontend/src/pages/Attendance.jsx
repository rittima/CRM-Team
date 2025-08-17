import React, { useEffect, useState } from "react";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { useLocationTracker } from "../hooks/useLocationTracker";
import api from "../services/axios";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  timer: 3000,
  timerProgressBar: true,
  background: "#333",
  color: "#fff",
  customClass: { popup: "long-toast" }
});

function Attendance({ onClose }) {
  const { user } = useAuth();
  const { startTracking, stopTracking } = useLocationTracker(user);
  const [currentTime, setCurrentTime] = useState("");
  const [date, setDate] = useState(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState({
    hasCheckedIn: false,
    hasCheckedOut: false,
    attendance: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setDate(now);
      setCurrentTime(
        now.toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata" })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user?._id) {
      fetchTodayStatus();
    }
  }, [user]);

  const fetchTodayStatus = async () => {
    try {
      const response = await api.get(`/attendance/status/${user._id}`);
      setAttendanceStatus(response.data);
    } catch (error) {
      console.error("Error fetching attendance status:", error);
    }
  };

  const handleCheckIn = async () => {
    if (attendanceStatus.hasCheckedIn) {
      Toast.fire({ icon: "warning", title: "You have already checked in today." });
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/attendance/checkin", { userId: user._id });

      if (response.data.locationTrackingActivated) {
        startTracking();
        Toast.fire({ 
          icon: "success", 
          title: `${response.data.message} - Location tracking started` 
        });
      } else {
        Toast.fire({ icon: "success", title: response.data.message });
      }

      window.dispatchEvent(new CustomEvent("attendanceUpdate", { 
        detail: { type: "checkin", userId: user._id } 
      }));
      localStorage.setItem("attendanceEvent", Date.now().toString());

      fetchTodayStatus();
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error.response?.data?.message || "Check-In Failed. Try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!attendanceStatus.hasCheckedIn) {
      Toast.fire({ icon: "error", title: "You must check in before checking out." });
      return;
    }
    if (attendanceStatus.hasCheckedOut) {
      Toast.fire({ icon: "warning", title: "You have already checked out today." });
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/attendance/checkout", { userId: user._id });

      if (response.data.locationTrackingDeactivated) {
        stopTracking();
        Toast.fire({
          icon: "success",
          title: `${response.data.message} - Working Hours: ${response.data.workingHours}h - Location tracking stopped`
        });
      } else {
        Toast.fire({
          icon: "success",
          title: `${response.data.message} - Working Hours: ${response.data.workingHours}h`
        });
      }

      window.dispatchEvent(new CustomEvent("attendanceUpdate", { 
        detail: { type: "checkout", userId: user._id } 
      }));
      localStorage.setItem("attendanceEvent", Date.now().toString());

      fetchTodayStatus();
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error.response?.data?.message || "Check-Out Failed. Try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-50">
      <div className="relative w-[380px] rounded-2xl bg-white p-8 text-center shadow-xl animate-fadeIn">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-2 text-xl text-gray-500 transition hover:text-red-500"
        >
          ✖
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="mb-1 text-2xl font-bold text-gray-900">Attendance System</h2>
          <p className="text-sm text-gray-500">Welcome, {user?.name}</p>
        </div>

        {/* Time */}
        <div className="mb-6">
          <div className="mb-1 text-base">
            <strong>Current Time: </strong>
            <span className="font-bold text-blue-600">{currentTime}</span>
          </div>
          <div className="text-sm text-gray-600">{formatDate(new Date())}</div>
        </div>

        {/* Clock */}
        <div className="relative mb-6 inline-block">
          <Clock value={date} size={200} />
          <div className="absolute inset-0 flex items-center justify-center text-gray-700 font-bold">
            {/* Clock Numbers */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2">12</div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2">3</div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">6</div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2">9</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-3">
          <button
            onClick={handleCheckIn}
            disabled={loading || attendanceStatus.hasCheckedIn}
            className={`rounded-lg px-5 py-2 font-semibold text-white transition 
              ${attendanceStatus.hasCheckedIn || loading 
                ? "cursor-not-allowed bg-green-500 opacity-60" 
                : "bg-green-500 hover:bg-green-600"}`}
          >
            {loading ? "Processing..." : "Check In"}
          </button>
          <button
            onClick={handleCheckOut}
            disabled={loading || !attendanceStatus.hasCheckedIn || attendanceStatus.hasCheckedOut}
            className={`rounded-lg px-5 py-2 font-semibold text-white transition 
              ${!attendanceStatus.hasCheckedIn || attendanceStatus.hasCheckedOut || loading
                ? "cursor-not-allowed bg-red-500 opacity-60" 
                : "bg-red-500 hover:bg-red-600"}`}
          >
            {loading ? "Processing..." : "Check Out"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Attendance;
