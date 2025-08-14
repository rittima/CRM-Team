import { useAuth } from '../context/AuthContext';
import { Clipboard } from 'lucide-react';
import Timer from './Timer';

const DashCard = ({ tasks, onSaveTask, showTimerModal, onOpenTimer, onCloseTimer }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        Employee data not found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-6">
      <div className="bg-blue-50 shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Clipboard className="w-6 h-6 text-gray-800" />
            <h3 className="text-2xl font-bold text-gray-800">Assigned Task</h3>
          </div>
          <span
            className={`px-4 py-2 text-sm font-semibold rounded-full ${
              user?.status === "Completed"
                ? "bg-green-100 text-green-700"
                : user?.status === "In Progress"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {user?.status}
          </span>
        </div>

        <p className="text-gray-600 text-lg mb-4">
          <b>Project Working on :</b> {user?.project}
        </p>
        <div className='flex justify-between'>
          <p className="text-gray-600 text-lg mb-3 font-semibold">
            Assigned Task Report:
          </p>
          <button
            onClick={onOpenTimer}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + Task with Timer
          </button>
        </div>

        {tasks.length === 0 ? (
          <p className="text-base text-gray-500 italic py-4">No tasks added yet.</p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task, index) => (
              <li key={index} className="p-4 bg-gray-100 rounded shadow">
                <p className="font-bold">{task.title}</p>
                <p className="text-sm text-gray-600">{task.description}</p>
                {task.timeTaken && (
                  <p className="text-green-700 font-semibold">
                    Time Taken: {task.timeTaken}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* <button
        onClick={onOpenTimer}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Task with Timer
      </button> */}

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
