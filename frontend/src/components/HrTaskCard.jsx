import React, { useState } from "react";
import axios from "../services/axios";
import { useAuth } from "../context/AuthContext";

export const HrTaskForm = ({onClose}) => {
  const { user } = useAuth(); 
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskCompletionTime, setTaskCompletionTime] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "/hr-tasks/",
        { title, description, taskCompletionTime, assignedTo },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      if (response.data.success) {
        setMessage("✅ Task assigned successfully!");
        setTitle("");
        setDescription("");
        setTaskCompletionTime("");
        setAssignedTo("");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-5">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 animate-[modalAppear_0.3s_ease-out]">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Assign New Task</h2>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg text-center font-medium ${
              message.includes("successfully")
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Assign To (Employee ID)"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            disabled={loading}
            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg text-base resize-y min-h-[100px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 sm:flex-row flex-col">
            <button
              type="reset"
              disabled={loading}
              className="px-6 py-3 text-red-500 border-2 border-red-500 text-sm font-semibold hover:bg-red-500 hover:text-white hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gray-800 text-white  text-sm font-semibold hover:bg-blue-600 hover:border-blue-600 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60 disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed active:translate-y-0 transition-all"
            >
              {loading ? "Assigning..." : "Assign Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
