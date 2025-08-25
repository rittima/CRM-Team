import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { UserCheck, LogOut, TimerIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Attendance from "../pages/Attendance.jsx";

const Navbar = ({ onOpenTimer }) => {
  const { user, logout } = useAuth();
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  
  const navigate = useNavigate();
  const [showTimerModal, setShowTimerModal] = useState(false);

  return (
    <nav className="w-full bg-white shadow-md border-b border-gray-200 p-2 shadow-lg">
      <div className="max-w-8xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="text-xl font-bold text-gray-800 tracking-wide">
          Welcome to <span className="text-gray-00">XYZ Pvt Ltd</span>
        </div>

        {/* Right side */}
        {user ? (
          <div className="flex items-center gap-4">
            {/* Attendance */}
            <button
              onClick={() => setShowAttendanceModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
            >
              <UserCheck className="w-5 h-5" />
              <span className="hidden sm:inline">Attendance</span>
            </button>

            {/* Timer */}
            <button
              onClick={onOpenTimer}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition"
            >
              <TimerIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Timer</span>
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/register-employee')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
            >
              <span className="hidden sm:inline">Register Employee</span>
            </button>
            <span className="text-sm text-gray-500 italic">You are not signed in</span>
          </div>
        )}
      </div>
      {/* Attendance Fullscreen */}
      {showAttendanceModal && (
        <Attendance onClose={() => setShowAttendanceModal(false)} />
      )}
      {/* Timer Modal
      <TimerModal
        isOpen={showTimerModal}
        onClose={() => setShowTimerModal(false)}
      /> */}
    </nav>
  );
};

export default Navbar;
