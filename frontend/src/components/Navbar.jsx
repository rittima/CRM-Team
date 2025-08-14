
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import Modal from "./Modal.jsx";
import Attendance from "../pages/Attendance.jsx";
import { UserCheck,  LogOut, TimerIcon } from "lucide-react";
import "../Styles/Navbar.scss";

const Navbar = ({ onOpenTimer }) => {
  const { user, logout } = useAuth();
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="text-lg font-semibold text-gray-800">
          Welcome to XYZ Pvt Ltd
        </div>

        {user ? (
          <div className="navbar-buttons">
            <button
              onClick={() => setShowAttendanceModal(true)}
              className="navbar-btn attendance-btn"
            >
              <UserCheck className="icon" />
              Attendance
            </button>

            <button
              onClick={onOpenTimer}
              className="navbar-btn timer-btn"
            >
              <TimerIcon className="icon" />
              Timer
            </button>

            <button onClick={logout} className="navbar-btn logout-btn">
              <LogOut className="icon" />
              Logout
            </button>
          </div>
        ) : (
          <span className="not-logged-in">You are not Sign-in</span>
        )}
      </div>

      {/* Attendance Modal */}
      <Modal
        show={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
      >
        <Attendance />
      </Modal>

    </nav>
  );
};

export default Navbar;