import React from "react";

const TasksTable = ({ tasks, loading}) => {
  if (loading)
    return (
      <div className="text-center py-10 text-gray-500 font-medium">
        Loading tasks...
      </div>
    );

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
            </th>
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
                  ? "HR" // ✅ Task created by HR
                  : task.createdByName || "System"} {/* ✅ Employee/auto */}
              </td>

              {/* Created Date */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {task.createdAt
                  ? new Date(task.createdAt).toLocaleString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TasksTable;
