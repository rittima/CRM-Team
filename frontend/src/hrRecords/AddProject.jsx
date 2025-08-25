import { useState } from "react";
import api from "../services/axios"; 

import { 
  Plus, Trash2, X, Loader2, User, Mail, 
  FolderPlus, FileText, Briefcase, Wrench, ClipboardList 
} from "lucide-react";

const AddProject = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    projectId: "",
    title: "",
    description: "",
    manager: "",
    email: "",
    Skill: "",
    tool: "",
    status: "Ongoing",
    teamMembers: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleTeamMemberChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.teamMembers];
      updated[index][field] = value;
      return { ...prev, teamMembers: updated };
    });
  };

  const handleAddTeamMember = () => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { empId: "", empEmail: "" }],
    }));
  };

  const handleRemoveTeamMember = (index) => {
    setFormData((prev) => {
      const updated = [...prev.teamMembers];
      updated.splice(index, 1);
      return { ...prev, teamMembers: updated };
    });
  };

  const handleSaveClick = async () => {
    // Enhanced validation
    if (!formData.title || !formData.manager || !formData.email) {
      setError("Title, Manager name, and Manager email are required.");
      return;
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid manager email address.");
      return;
    }

    // Validate team members
    if (formData.teamMembers.length > 4) {
      setError("Maximum 4 team members are allowed.");
      return;
    }

    // Validate team member emails
    for (const member of formData.teamMembers) {
      if (member.empId && !member.empEmail) {
        setError("All team members must have both Employee ID and Email.");
        return;
      }
      if (member.empEmail && !emailRegex.test(member.empEmail)) {
        setError("Please enter valid email addresses for all team members.");
        return;
      }
    }

    setIsLoading(true);
    setError("");

    // Send skills and tools as comma-separated strings, not arrays
    const payload = {
      ...formData,
      skills: formData.Skill || "",
      tools: formData.tool || ""
    };
    delete payload.Skill;
    delete payload.tool;

    try {
      const response = await api.post("/projects", payload);
      if (response.data.success) {
        // Show success message
        alert(`Project "${formData.title}" created successfully!`);
        
        if (typeof onSave === "function") onSave(response.data.project);
        setFormData({
          projectId: "",
          title: "",
          description: "",
          manager: "",
          email: "",
          Skill: "",
          tool: "",
          status: "Ongoing",
          teamMembers: [],
        });
        onClose();
      }
    } catch (err) {
      console.error("Error creating project:", err);
      
      // Handle different types of errors
      if (err.response?.data?.errors) {
        // Multiple validation errors
        setError(err.response.data.errors.join(", "));
      } else if (err.response?.data?.message) {
        // Single error message from backend
        setError(err.response.data.message);
      } else {
        // Generic error
        setError("Failed to save project. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed overflow-y-auto inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 pt-20 ">
        <div className="bg-white/95 rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative animate-fadeIn border border-gray-200 mt-50">

            {/* Close Button */}
            <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
            >
            <X size={22} />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3 border-b pb-3">
            <FolderPlus size={28} className="text-blue-600" />
            Add New Project
            </h2>

            {/* Project Details */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Project ID (auto-generated, read-only) */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <ClipboardList size={18} />
                </span>
                <input
                  type="text"
                  value="Auto-generated"
                  readOnly
                  disabled
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
            {[
                { name: "title", placeholder: "Project Title", icon: <FileText size={18} /> },
                { name: "manager", placeholder: "Manager Name", icon: <User size={18} /> },
                { name: "email", placeholder: "Manager Email", icon: <Mail size={18} />, type: "email" },
                { name: "Skill", placeholder: "Skills (comma separated)", icon: <Briefcase size={18} /> },
                { name: "tool", placeholder: "Tools (comma separated)", icon: <Wrench size={18} /> },
            ].map(({ name, placeholder, icon, type = "text" }) => (
                <div key={name} className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
                <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={formData[name]}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 hover:bg-white"
                />
                </div>
            ))}

            {/* Status is always Ongoing on creation, no select shown */}
            </div>

            {/* Description */}
            <textarea
            name="description"
            placeholder="Project Description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            disabled={isLoading}
            className="border border-gray-300 rounded-lg w-full p-3 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition resize-none bg-gray-50 hover:bg-white"
            />

            {/* Error Message */}
            {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg font-medium text-sm text-center mt-4">
                {error}
            </div>
            )}

            {/* Team Members */}
            <div className="mt-8">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 mb-3">
                <User size={20} className="text-green-600" /> Team Members <span className="text-sm text-gray-500">(maximum 4 team members are allowed)</span>
            </h3>
            <div className="flex flex-col gap-3">
                {formData.teamMembers.map((member, index) => (
                <div key={index} className="flex items-center gap-2">
                    <input
                    type="text"
                    placeholder="EMPID"
                    value={member.empId}
                    onChange={(e) => handleTeamMemberChange(index, "empId", e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 flex-1 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50 hover:bg-white"
                    />
                    <input
                    type="email"
                    placeholder="EMPEMAIL"
                    value={member.empEmail}
                    onChange={(e) => handleTeamMemberChange(index, "empEmail", e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 flex-1 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50 hover:bg-white"
                    />
                    <button
                    onClick={() => handleRemoveTeamMember(index)}
                    className="text-red-500 hover:text-red-700 transition"
                    >
                    <Trash2 size={18} />
                    </button>
                </div>
                ))}
            </div>
            <button
                onClick={handleAddTeamMember}
                className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
            >
                <Plus size={16} /> Add Team Member
            </button>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-10">
            <button
                onClick={onClose}
                disabled={isLoading}
                className="px-5 py-2.5 bg-red-500 text-white border border-gray-300  font-semibold hover:bg-gray-200 disabled:opacity-60 flex items-center gap-2 transition"
            >
                 Cancel
            </button>
            <button
                onClick={handleSaveClick}
                disabled={isLoading}
                className="px-5 py-2.5 bg-blue-600 text-white border border-blue-600 font-semibold hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2 shadow-lg transition"
            >
                {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
                ) : (
                <Plus size={16} />
                )}
                {isLoading ? "Saving..." : "Save Project"}
            </button>
            </div>
        </div>
        </div>
  );
};

export default AddProject;

