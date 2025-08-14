import { useState } from "react";

const TaskCard = ({ onClose, onSave, taskName, taskDesc, timeTaken }) => {
  const [title, setTitle] = useState(taskName || "");
  const [description, setDescription] = useState(taskDesc || "");

  const handleSaveClick = () => {
    onSave(title, description, timeTaken);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">Add New Task</h2>

        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded w-full p-2 mb-4"
        />

        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded w-full p-2 mb-4"
        />

        {timeTaken && (
          <div className="mb-4 text-green-700 font-semibold">
            Time Taken: {timeTaken}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;