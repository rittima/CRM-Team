import React, { useState, useEffect } from "react";
import Clock from "react-clock";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import "react-clock/dist/Clock.css";

const BreakTimerModal = ({ isOpen, onClose }) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(new Date(0, 0, 0, 0, 0, 0));
  const { user } = useAuth();

  // Fetch current break status on mount
  useEffect(() => {
    if (!user?._id) return;
    axios
      .get(`http://localhost:5000/api/break/status/${user._id}`)
      .then((res) => {
        if (res.data.isOnBreak) {
          setIsRunning(true);
          setSecondsElapsed(res.data.elapsedSeconds);
        }
      })
      .catch((err) => console.error(err));
  }, [user]);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    const newTime = new Date(0, 0, 0, 0, 0, secondsElapsed);
    setStartTime(newTime);
  }, [secondsElapsed]);

  const formatTime = () => {
    const minutes = String(Math.floor(secondsElapsed / 60)).padStart(2, "0");
    const seconds = String(secondsElapsed % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleStartBreak = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/break/start",
        { userId: user._id }
      );
      console.log("Break started:", res.data);
      setSecondsElapsed(0);
      setIsRunning(true);
    } catch (err) {
      console.error("Start Break Error:", err.message);
    }
  };

  const handleStopBreak = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/break/stop",
        { userId: user._id }
      );
      console.log("Break stopped:", res.data);
      setSecondsElapsed(res.data.totalBreakSeconds);
      setIsRunning(false);
    } catch (err) {
      console.error("Stop Break Error:", err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[300px] text-center">
        <h2 className="text-xl font-bold mb-4">Break Stopwatch</h2>

        <div className="flex justify-center mb-4">
          <Clock value={startTime} size={180} />
        </div>

        <p className="text-lg mb-4">
          Time: <strong>{formatTime()}</strong>
        </p>

        <div className="flex justify-center gap-3 mb-4">
          {!isRunning ? (
            <button
              onClick={handleStartBreak}
              className="bg-green-500 px-4 py-2 text-white rounded"
            >
              Start Break
            </button>
          ) : (
            <button
              onClick={handleStopBreak}
              className="bg-red-500 px-4 py-2 text-white rounded"
            >
              End Break
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BreakTimerModal;
