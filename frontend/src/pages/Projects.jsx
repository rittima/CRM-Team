import { useState } from "react";
import { projects } from "../data";
import { Search } from "lucide-react";
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
    <div className="p-6">
      <div className="mb-6 relative w-full md:w-1/3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by title, description, or manager..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-400"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-900 text-white">
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
                <tr key={project.projectId} className="hover:bg-gray-50">
                  <td className="py-3 px-6 text-sm text-gray-700">
                    {project.projectId}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-700">
                    {project.title}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-700">
                    {project.description}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-700">
                    {project.manager}
                  </td>
                  <td className="py-3 px-6 text-sm">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
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
                  <td className="py-3 px-6 text-sm text-gray-700">
                    <button
                    onClick={() => handleView(project)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1 px-3 shadow-sm transition duration-200">
                      View
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
      {showModal && (
        <PrjModle
          project={selectedProject}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Projects;
