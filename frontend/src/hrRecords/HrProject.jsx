import React, { useState, useEffect } from "react";
import { Eye, Search } from "lucide-react";
import PrjModle from "../components/PrjModle";
import AddProject from "./AddProject";
import axios from "../services/axios";

const HrProject = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [showProjectAdd, setShowProjectAdd] = useState(false);
  const [hrData, setHrData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch HR project data from backend
  // Refetch logic
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/hr-projects");
      setHrData(res.data);
    } catch (err) {
      setError("Failed to load HR projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Group by projectId to avoid duplicate rows
  const uniqueProjectsMap = {};
  hrData.forEach((emp) => {
    if (!uniqueProjectsMap[emp.projectId]) {
      uniqueProjectsMap[emp.projectId] = emp;
    }
  });
  const uniqueProjects = Object.values(uniqueProjectsMap);

  // Filter projects based on search
  const filteredData = uniqueProjects.filter((emp) => {    
    return (
      (emp.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.manager || "").toLowerCase().includes(searchTerm.toLowerCase())||
      (emp.status || "").toLowerCase().includes(searchTerm.toLowerCase())
  )})

  // Fetch full project details when viewing
  const handleView = async (emp) => {
    try {
      setLoading(true);
      const res = await axios.get(`/hr-projects/${emp.projectId}`);
      setSelectedEmp(res.data);
      setShowModal(true);
    } catch (err) {
      setError("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Header + Search + Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900">
            HR Employee Projects
          </h1>

          {/* Search + Button Wrapper */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by empId, projectId or manager..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Add Project Button */}
            <button onClick={() => setShowProjectAdd(true)} className="bg-gray-700 cursor-pointer text-white px-5 py-2 hover:shadow-lg transition">
              + Project
            </button>
            {showProjectAdd && (
              <AddProject
                onClose={() => setShowProjectAdd(false)}
              />
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto shadow">
          <table className="min-w-full border-gray-200 overflow-hidden">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold">Project ID</th>
                <th className="py-3 px-6 text-left text-sm font-semibold">Title</th>
                <th className="py-3 px-6 text-left text-sm font-semibold">Description</th>
                <th className="py-3 px-6 text-left text-sm font-semibold">Project Manager</th>
                <th className="py-3 px-6 text-left text-sm font-semibold">Status</th>
                <th className="py-3 px-6 text-left text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500 text-sm">Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-red-500 text-sm">{error}</td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((emp) => (
                  <tr key={emp.empId + emp.projectId} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-6 text-sm text-gray-700">{emp.projectId}</td>
                    <td className="py-3 px-6 text-sm text-gray-700 font-medium">{emp.title}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">{emp.description}</td>                    
                    <td className="py-3 px-6 text-sm text-gray-700">{emp.manager || "-"}</td>
                    <td className="py-3 px-6 text-sm">
                      <select
                        value={emp.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            console.log('PUT /projects/', emp.projectId, 'status:', newStatus);
                            const res = await axios.put(`/projects/${emp.projectId}`, {
                              status: newStatus,
                            });
                            console.log('Update response:', res);
                            // Refetch data after update to reflect changes
                            fetchData();
                          } catch (err) {
                            console.error('Status update error:', err);
                            alert("Failed to update status");
                          }
                        }}
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          emp.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : emp.status === "Ongoing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                        style={{ minWidth: 100 }}
                      >
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="py-3 px-6 text-sm">
                      <button
                        onClick={() => handleView(emp)}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer transition transform hover:scale-110 p-2 rounded-full"
                        title="View Employee"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500 text-sm">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <PrjModle
            project={selectedEmp}
            onClose={() => setShowModal(false)}
            isHrView={true}
          />
        )}
      </div>
    </div>
  );
};

export default HrProject;
