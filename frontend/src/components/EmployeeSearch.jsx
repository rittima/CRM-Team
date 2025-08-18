import React, { useState } from "react";
import {
  Search,
  User,
  Mail,
  MapPin,
  Clock,
  Briefcase,
  X,
} from "lucide-react";
import axios from "../services/axios";

const EmployeeSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `/users/search?query=${encodeURIComponent(searchQuery)}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Search error:", error);
      alert("Error searching employees");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Employee Search</h2>
        <p className="text-gray-500">Find and view employee details</p>
      </div>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-3 mb-8 max-w-xl mx-auto"
      >
        <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm flex-1 px-3">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Employee ID or Name..."
            className="w-full py-2 outline-none text-gray-700"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-gray-800 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow-md transition flex items-center gap-2"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          ) : (
            <Search size={18} />
          )}
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Results */}
      {searchResults.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Search Results
            </h3>
            <span className="text-sm text-gray-500">
              {searchResults.length} employees found
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((employee) => (
              <div
                key={employee._id}
                className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition"
              >
                {/* Avatar + Basic Info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-indigo-500 text-white flex items-center justify-center text-lg font-semibold">
                    {employee.photo ? (
                      <img
                        src={employee.photo}
                        alt={employee.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      employee.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {employee.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      ID: {employee.employeeId || "Not set"}
                    </p>
                  </div>
                </div>

                {/* Quick Details */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    {employee.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-gray-400" />
                    {employee.designation || "Not set"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    {employee.domain || "Not set"}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEmployee(employee)}
                  className="mt-4 w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-2 rounded-lg transition"
                >
                  View Full Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {searchResults.length === 0 && searchQuery && !loading && (
        <div className="mt-10 text-center text-gray-500">
          <div className="text-4xl mb-2">🔍</div>
          <h3 className="text-lg font-semibold">No employees found</h3>
          <p>Try searching with a different Employee ID or Name</p>
        </div>
      )}

      {/* Employee Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full relative overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-900 to-gray-900 ">
              <h3 className="text-xl font-semibold text-white">Employee Profile</h3>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-white/80 hover:text-white"
              >
                <X size={22} />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-8">
              {/* Profile Header */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-indigo-500 text-white flex items-center justify-center text-3xl font-bold mb-3 shadow-md">
                  {selectedEmployee.photo ? (
                    <img
                      src={selectedEmployee.photo}
                      alt={selectedEmployee.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    selectedEmployee.name.charAt(0).toUpperCase()
                  )}
                </div>
                <h4 className="text-2xl font-bold text-gray-800">{selectedEmployee.name}</h4>
                <p className="text-gray-500 text-sm">
                  Employee ID: {selectedEmployee.employeeId || "Not set"}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-8">
                {/* Basic Info */}
                <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
                  <h5 className="font-semibold text-gray-700 flex items-center gap-2 mb-4 text-base">
                    <User size={18} className="text-indigo-600" /> Basic Information
                  </h5>
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium">{selectedEmployee.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Gender</p>
                      <p className="font-medium">
                        {selectedEmployee.gender || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Role</p>
                      <p className="font-medium">{selectedEmployee.role}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Profile Status</p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedEmployee.profileCompleted
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {selectedEmployee.profileCompleted ? "Complete" : "Incomplete"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Work Info */}
                <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
                  <h5 className="font-semibold text-gray-700 flex items-center gap-2 mb-4 text-base">
                    <Briefcase size={18} className="text-indigo-600" /> Work Information
                  </h5>
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-gray-500">Designation</p>
                      <p className="font-medium">{selectedEmployee.designation || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Domain</p>
                      <p className="font-medium">{selectedEmployee.domain || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Shift Timing</p>
                      <p className="font-medium">{selectedEmployee.shiftTiming || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Member Since</p>
                      <p className="font-medium">
                        {new Date(selectedEmployee.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                {selectedEmployee.address && (
                  <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
                    <h5 className="font-semibold text-gray-700 flex items-center gap-2 mb-4 text-base">
                      <MapPin size={18} className="text-indigo-600" /> Address Information
                    </h5>
                    <p className="text-sm font-medium text-gray-700">
                      {[
                        selectedEmployee.address.street,
                        selectedEmployee.address.city,
                        selectedEmployee.address.state,
                        selectedEmployee.address.zipCode,
                        selectedEmployee.address.country,
                      ]
                        .filter(Boolean)
                        .join(", ") || "No address provided"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default EmployeeSearch;
