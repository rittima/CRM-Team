import { useState } from "react";
import { projects } from "../data";
import { Eye, Search, View } from "lucide-react";
import PrjModle from "../components/PrjModle";

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = projects.filter(
    (project) =>
      project.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [showModal, setShowModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null);

  const handleView = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

 return (
  <div className="bg-gray-50 p-6 min-h-screen">
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
          Projects
        </h1>

        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by title, description, or manager..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300  shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow">
        <table className="min-w-full border-gray-200 overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-6 text-left text-sm font-semibold">
                Project ID
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold">
                Title
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold">
                Description
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold">
                Project Manager
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold">
                Status
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <tr
                  key={project.projectId}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-6 text-sm text-gray-700 font-medium">
                    {project.projectId}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-700">
                    {project.title}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-600">
                    {project.description}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-700">
                    {project.manager}
                  </td>
                  <td className="py-3 px-6 text-sm">
                    <span
                      className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full
                      ${
                        project.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : project.status === "Ongoing"
                          ? "bg-blue-100 text-blue-800"
                          : project.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-sm">
                    <button
                      onClick={() => handleView(project)}
                      className="text-blue-600 hover:text-blue-800 cursor-pointer transition transform hover:scale-110 p-2 rounded-full"
                      title="View Project"
                    >
                      <Eye className="w-5 h-5" />
                    </button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="py-6 text-center text-gray-500 text-sm"
                >
                  No matching projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <PrjModle
          project={selectedProject}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  </div>
);
};

export default Projects;
