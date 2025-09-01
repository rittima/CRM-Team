import { Trash2Icon } from "lucide-react";
import axios from "../../services/axios";

const TasksTable = ({ tasks, loading, setTasks}) => {
  //loading
  if (loading)
    return (
      <div className="text-center py-10 text-gray-500 font-medium">
        Loading tasks...
      </div>
    );

    // checking if there are no tasks
  if (!tasks.length)
    return (
      <div className="text-center py-10 text-gray-500 font-medium">
        No tasks found for this employee.
      </div>
    );

    // Sort tasks by createdAt descending (newest first)
    const sortedTasks = [...tasks].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Delete task
    const handleDeleteTask = async (taskId) => {
      const task = tasks.find((t) => t._id === taskId);
      if (!task) return;

      if (!confirm(`Are you sure you want to delete task "${task.title}" assigned by ${task.assignedByName}?`)) return;

      try {
        await axios.delete(`/hr-tasks/${taskId}`);
        //update state immediately
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
        alert("✅ Task deleted successfully!");
      } catch (error) {
        console.error("Error deleting task:", error.response?.data || error.message);
        alert("❌ Failed to delete task. Please try again.");
      }
    };

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Task Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created By
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created Date
            </th><th></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedTasks.map((task) => (
            <tr key={task._id} className="hover:bg-gray-50 transition">
              {/* Title */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {task.title}
              </td>

              {/* Description */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {task.description || "No description"}
              </td>

              {/* Created By: HR vs Employee */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {task.assignedBy
                  ? "HR" 
                  : task.createdByName || "System"} 
              </td>

              {/* Created Date */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {task.createdAt
                  ? new Date(task.createdAt).toLocaleString()
                  : "-"}
                  
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {task.assignedBy && (
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2Icon className="w-4 h-4" />
                  </button>
                )}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TasksTable;
