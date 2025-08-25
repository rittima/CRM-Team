import { useAuth } from "../context/AuthContext";
import { CircleStop, ClipboardList, Pause, Play, TimerIcon } from "lucide-react";
import Timer from "./Timer";
import { useEffect, useState } from "react";
import axios from "../services/axios";

/* --------------------- Per Task Timer --------------------- */
let activeTimerId = null; // 🚀 Global tracker for currently running timer

const TaskTimer = ({ task }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [lastTimeTaken, setLastTimeTaken] = useState(task.taskCompletionTime || "");

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const safeSeconds = Number(seconds) || 0;
    const hours = String(Math.floor(safeSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((safeSeconds % 3600) / 60)).padStart(2, "0");
    const secs = String(safeSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${secs}`;
  };

  const handleStart = () => {
    if (activeTimerId && activeTimerId !== task._id) {
      alert("⏱️ Another task timer is already running. Please stop it first.");
      return;
    }
    activeTimerId = task._id;
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = async () => {
    setIsRunning(false);
    activeTimerId = null; // ✅ Free global timer lock

    const timeTaken = formatTime(secondsElapsed);
    setLastTimeTaken(timeTaken);
    setSecondsElapsed(0);

    try {
      await axios.put(`/hr-tasks/${task._id}/time`, { timeTaken });
      console.log("✅ Time saved to DB for task:", task.title);
    } catch (err) {
      console.error("❌ Error saving time:", err);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2 ml-6">
      {/* Date */}
      <span className="text-sm font-bold text-gray-400 mb-5">
        {new Date(task.createdAt).toLocaleDateString()}
      </span>

      {/* Timer */}
      <div className="flex items-center gap-5">
        <p className="text-sm font-medium text-blue-700 flex gap-2">
          <TimerIcon className="w-4 h-4" /> {lastTimeTaken || formatTime(secondsElapsed)}
        </p>

        <div className="flex gap-2">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="p-1 rounded-full bg-green-50 hover:bg-green-100 text-green-600 transition"
            >
              <Play className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="p-1 rounded-full bg-yellow-50 hover:bg-yellow-100 text-yellow-600 transition"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleStop}
            className="p-1 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition"
          >
            <CircleStop className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* --------------------- Main Dashboard Card --------------------- */
const DashCard = ({ tasks, onSaveTask, showTimerModal, onOpenTimer, onCloseTimer }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hrTasks, setHrTasks] = useState([]);

  // Fetch HR Assigned Tasks
  useEffect(() => {
    const fetchHrTasks = async () => {
      try {
        const res = await axios.get("/hr-tasks/my");
        if (res.data.success) setHrTasks(res.data.tasks);
      } catch (err) {
        console.error("Error fetching HR tasks:", err);
      }
    };
    if (user) fetchHrTasks();
  }, [user]);

  // Fetch My Projects
  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        const res = await axios.get("/projects/my-projects");
        
        if (res.data.success) setProjects(res.data.projects);
      } catch (err) {
        console.error("Error fetching my projects:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMyProjects();
  }, [user]);

  return (
    <div className="grid grid-cols-1 gap-6 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transition">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-xl shadow-sm">
              <ClipboardList className="w-6 h-6 text-blue-700" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Assigned Tasks</h3>
          </div>
        </div>

        {/* Project Info */}
        <div className="bg-gray-50 p-4 rounded-xl mb-6">
          <p className="text-gray-700 text-md">
            <span className="font-semibold text-gray-900">Project Working On:</span>{" "}
            {loading ? (
              <span className="text-gray-500">Loading...</span>
            ) : projects.length > 0 ? (
              <span className=" p-2 flex flex-wrap gap-2">
                {projects.map((p) => (
                  <span
                    key={p._id}
                    className="text-blue-700 font-medium border-2 border-blue-200 bg-white px-3 py-1 rounded-full shadow-sm hover:bg-blue-100 transition"
                  >
                    {p.title}
                  </span>
                ))}
              </span>
            ) : (
              <span className="text-red-500 ml-2">Not assigned</span>
            )}
          </p>
        </div>

        {/* Add Task with Timer */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-800 text-xl font-bold">Task Report</p>
          <button
            onClick={onOpenTimer}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 hover:scale-105 transition"
          >
            + Task with Timer
          </button>
        </div>

        {/* HR Assigned Tasks */}
        <div className="mb-8">
          <h4 className="font-semibold text-gray-700 mb-3">HR Assigned Tasks :</h4>
          {hrTasks.length === 0 ? (
            <div className="bg-yellow-100 rounded-lg ">
              <p className="text-base text-yellow-800 italic py-4 font-medium text-center">
                No HR tasks assigned.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {hrTasks.map((task) => (
                <li
                  key={task._id}
                  className="p-5 bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition flex justify-between items-center"
                >
                  {/* Left: Task Info */}
                  <div className="flex flex-col">
                    <p className="font-semibold text-gray-900 text-base">{task.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    <span
                      className={`inline-block mt-2 text-xs font-medium px-2 py-1 rounded-full w-fit
                        ${task.status === "Completed" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-yellow-100 text-yellow-700"}`}
                    >
                      {task.status}
                    </span>
                  </div>
                  {/* Right: Timer */}
                  <TaskTimer task={task} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Employee Self Tasks */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">My Own Tasks :</h4>
          {tasks.length === 0 ? (
            <div className="bg-yellow-100 rounded-lg ">
              <p className="text-base text-yellow-800 italic py-4 font-medium text-center">
                No self tasks added yet.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {tasks.map((task, index) => (
                <li
                  key={index}
                  className="p-5 bg-gray-50 border border-blue-100 rounded-xl hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-blue-700 rounded-full mr-3" />
                      <p className="font-semibold text-gray-900 text-lg">{task.title}</p>
                    </div>
                    {task.timeTaken && (
                      <p className="text-green-700 font-medium text-sm">
                        ⏱ {task.timeTaken}
                      </p>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm ml-6">{task.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Timer Modal */}
      <Timer
        isOpen={showTimerModal}
        onClose={onCloseTimer}
        onAddTask={(taskObj) =>
          onSaveTask(taskObj.name, taskObj.description, taskObj.timeTaken)
        }
      />
    </div>
  );
};

export default DashCard;
