import { useAuth } from "../context/AuthContext";
import { ClipboardList } from "lucide-react";
import Timer from "./Timer"; // <-- use this as TaskTimer

const DashCard = ({ tasks, onSaveTask, showTimerModal, onOpenTimer, onCloseTimer }) => {
  const { user } = useAuth();

  return (
    <div className="grid grid-cols-1 gap-6 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <ClipboardList className="w-6 h-6 text-blue-700" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Assigned Tasks</h3>
          </div>
        </div>

        {/* Project Info */}
        <p className="text-gray-700 text-lg mb-6">
          <span className="font-semibold text-gray-900">Project Working On:</span>{" "}
          {user?.project || "Not assigned"}
        </p>

        {/* Assigned Tasks Section */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-800 text-lg font-semibold">
            Assigned Task Report
          </p>
          <button
            onClick={onOpenTimer}
            className="px-4 py-2 bg-blue-600 text-white shadow hover:bg-blue-700 transition"
          >
            + Task with Timer
          </button>
        </div>

        {/* Task List */}
        {tasks.length === 0 ? (
          <div className=" bg-yellow-100 rounded-lg"> 
            <p className="text-base text-gray-500 italic py-6 font-medium text-center">
              No tasks added yet.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task, index) => (
              <li
                key={index}
                className="p-4 bg-blue-50 border border-gray-100 rounded-xl hover:shadow-md transition flex flex-col"
              >
                {/* Header with colored dot and title */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-blue-700 rounded-full mr-3" />
                    <p className="font-semibold text-gray-900 text-lg">{task.title}</p>
                  </div>

                  {/* Time Taken */}
                  {task.timeTaken && (
                    <p className="text-green-700 font-medium text-sm">
                      ⏱ Time Taken: {task.timeTaken}
                    </p>
                  )}
                </div>
              
                {/* Description */}
                <p className="text-gray-600 text-sm mb-1 ml-6">{task.description}</p>
              </li>
            ))}
          </ul>

        )}
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
