import React, { useState } from "react";
import { Eye, Search } from "lucide-react";
import PrjModle from "../components/PrjModle";
import { hrData, projects } from "../data";
import AddProject from "./AddProject";

const HrProject = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [showProjectAdd, setShowProjectAdd] = useState(false);

  // Helper: get project details by projectId
  const getProjectDetails = (projectId) => {
    return projects.find((p) => p.projectId === projectId) || {};
  };

  // Filter employees based on search
  const filteredData = hrData.filter((emp) => {
    const project = getProjectDetails(emp.projectId);
    return (
      emp.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.empEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.manager || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleView = (emp) => {
    const project = getProjectDetails(emp.projectId);
    setSelectedEmp({ ...emp, ...project });
    setShowModal(true);
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
            <button onClick={() => setShowProjectAdd(true)} className="bg-gray-800 cursor-pointer text-white px-5 py-2 hover:shadow-lg transition">
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
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold">Emp ID</th>
                <th className="py-3 px-6 text-left text-sm font-semibold">Employee Email</th>
                <th className="py-3 px-6 text-left text-sm font-semibold">Project ID</th>
                <th className="py-3 px-6 text-left text-sm font-semibold">Project Manager</th>
                <th className="py-3 px-6 text-left text-sm font-semibold">Status</th>
                <th className="py-3 px-6 text-left text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((emp) => {
                  const project = getProjectDetails(emp.projectId);
                  return (
                    <tr key={emp.empId} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-6 text-sm text-gray-700 font-medium">{emp.empId}</td>
                      <td className="py-3 px-6 text-sm text-gray-700">{emp.empEmail}</td>
                      <td className="py-3 px-6 text-sm text-gray-700">{emp.projectId}</td>
                      <td className="py-3 px-6 text-sm text-gray-700">{project.manager || "-"}</td>
                      <td className="py-3 px-6 text-sm">
                        <span
                          className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                            project.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : project.status === "Ongoing"
                              ? "bg-blue-100 text-blue-800"
                              : project.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {project.status || "-"}
                        </span>
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
                  );
                })
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
