import React, { useState, useEffect } from "react";
import api from "../../services/axios";
import LocationFilters from "./LocationFilters";

const LocationTab = () => {
  const [employeeLocations, setEmployeeLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [locationFilters, setLocationFilters] = useState({
    searchTerm: '',
    sortBy: 'lastUpdated',
    sortOrder: 'desc'
  });
  const [showLocationHistory, setShowLocationHistory] = useState({});
  const [locationHistoryData, setLocationHistoryData] = useState({});
  const [historyLoading, setHistoryLoading] = useState({});
  const [autoRefreshOnEvents, setAutoRefreshOnEvents] = useState(true);

  // Fetch all employee locations
  const fetchEmployeeLocations = async () => {
    try {
      setLocationsLoading(true);
      const response = await api.get("/location/all-employees");
      if (response.data.success) setEmployeeLocations(response.data.employees);
    } catch (error) {
      console.error("Error fetching employee locations:", error);
    } finally {
      setLocationsLoading(false);
    }
  };

  // Filter and sort employees
  const getFilteredLocations = () => {
    let filtered = employeeLocations.filter(emp => {
      const term = locationFilters.searchTerm.toLowerCase();
      return (
        emp.name.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        emp.employeeId.toLowerCase().includes(term)
      );
    });

    const { sortBy, sortOrder } = locationFilters;
    filtered.sort((a, b) => {
      let aVal, bVal;
      if (sortBy === "name") {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      } else {
        aVal = new Date(a.currentLocation?.lastUpdated || 0);
        bVal = new Date(b.currentLocation?.lastUpdated || 0);
      }

      if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    return filtered;
  };

  // Fetch location history for one employee
  const fetchEmployeeLocationHistory = async (userId) => {
    try {
      setHistoryLoading(prev => ({ ...prev, [userId]: true }));
      const response = await api.get(`/location/history?userId=${userId}&limit=10`);
      if (response.data.success) {
        setLocationHistoryData(prev => ({ ...prev, [userId]: response.data.locations }));
      } else {
        setLocationHistoryData(prev => ({ ...prev, [userId]: [] }));
      }
    } catch (error) {
      console.error("Error fetching location history:", error);
      setLocationHistoryData(prev => ({ ...prev, [userId]: [] }));
      alert(`Failed to fetch history for employee ${userId}. You may not have permission.`);
    } finally {
      setHistoryLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  // Toggle history dropdown
  const toggleLocationHistory = async (userId) => {
    const isOpen = showLocationHistory[userId];
    setShowLocationHistory(prev => ({ ...prev, [userId]: !isOpen }));

    if (!isOpen && !locationHistoryData[userId]) {
      await fetchEmployeeLocationHistory(userId);
    }
  };

  // Refresh all locations
  const refreshLocations = () => fetchEmployeeLocations();

  // Clear all location history
  const clearAllLocationHistory = async () => {
    if (!window.confirm("Are you sure you want to clear all location history?")) return;
    try {
      setLocationsLoading(true);
      const response = await api.delete("/location/clear-all");
      if (response.status === 200) {
        setEmployeeLocations([]);
        setLocationHistoryData({});
        setShowLocationHistory({});
        alert("All location history cleared!");
        fetchEmployeeLocations();
      }
    } catch (error) {
      console.error("Error clearing location history:", error);
      alert("Failed to clear location history.");
    } finally {
      setLocationsLoading(false);
    }
  };

  // Auto-refresh every 30s
  useEffect(() => {
    fetchEmployeeLocations();
    const interval = setInterval(() => fetchEmployeeLocations(), 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-refresh on events
  useEffect(() => {
    if (!autoRefreshOnEvents) return;
    const handleEvent = () => fetchEmployeeLocations();
    window.addEventListener("attendanceUpdate", handleEvent);
    window.addEventListener("storage", (e) => e.key === "attendanceEvent" && handleEvent());
    return () => {
      window.removeEventListener("attendanceUpdate", handleEvent);
      window.removeEventListener("storage", handleEvent);
    };
  }, [autoRefreshOnEvents]);

  // Stats
  const totalEmployees = employeeLocations.length;
  const activeLocations = employeeLocations.filter(emp => emp.currentLocation).length;
  const inactiveLocations = totalEmployees - activeLocations;

  return (
    <div className="locations-tab space-y-6 p-4">

      {/* Header */}
      <div className="tab-header flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">📍 Employee Locations</h2>
        <div className="header-actions flex flex-wrap gap-2">
          <button
            onClick={refreshLocations}
            disabled={locationsLoading}
            className="px-4 py-2 rounded bg-blue-100 text-blue-800 font-medium hover:bg-blue-200 transition disabled:opacity-50"
          >
            {locationsLoading ? "🔄 Refreshing..." : "🔄 Refresh"}
          </button>
          <button
            onClick={clearAllLocationHistory}
            disabled={locationsLoading}
            className="px-4 py-2 rounded bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition disabled:opacity-50"
          >
            🗑️ Clear All
          </button>
        </div>
      </div>

      {/* Filters */}
      <LocationFilters filters={locationFilters} setFilters={setLocationFilters} />

      {/* Stats */}
      <div className="location-stats grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="stat-card bg-gray-50 shadow rounded-lg p-4 flex flex-col items-center">
          <h4 className="text-gray-500 text-sm font-medium">Total Employees</h4>
          <span className="text-2xl font-semibold">{totalEmployees}</span>
        </div>
        <div className="stat-card bg-gray-50 shadow rounded-lg p-4 flex flex-col items-center">
          <h4 className="text-gray-500 text-sm font-medium">Active Locations</h4>
          <span className="text-2xl font-semibold text-green-600">{activeLocations}</span>
        </div>
        <div className="stat-card bg-gray-50 shadow rounded-lg p-4 flex flex-col items-center">
          <h4 className="text-gray-500 text-sm font-medium">Inactive Locations</h4>
          <span className="text-2xl font-semibold text-red-600">{inactiveLocations}</span>
        </div>
      </div>

      {/* Employee Table */}
      {locationsLoading ? (
        <div className="loading-state flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg font-medium">Loading employee locations...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {getFilteredLocations().length > 0 ? (
            <table className="w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-600 text-sm font-medium">Employee</th>
                  <th className="px-4 py-3 text-left text-gray-600 text-sm font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-gray-600 text-sm font-medium">Employee ID</th>
                  <th className="px-4 py-3 text-left text-gray-600 text-sm font-medium">Last Location</th>
                  <th className="px-4 py-3 text-left text-gray-600 text-sm font-medium">Last Updated</th>
                  <th className="px-4 py-3 text-left text-gray-600 text-sm font-medium">History</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredLocations().map(emp => (
                  <tr key={emp._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-700">{emp.name}</td>
                    <td className="px-4 py-3 text-gray-500">{emp.email}</td>
                    <td className="px-4 py-3 text-gray-500">{emp.employeeId}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {emp.currentLocation
                        ? `${emp.currentLocation.latitude.toFixed(4)}, ${emp.currentLocation.longitude.toFixed(4)}`
                        : "No location"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {emp.currentLocation
                        ? new Date(emp.currentLocation.lastUpdated).toLocaleString()
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleLocationHistory(emp._id)}
                        className="px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                      >
                        {showLocationHistory[emp._id] ? "Hide History" : "Show History"}
                      </button>

                      {showLocationHistory[emp._id] && (
                        <div className="mt-2 text-sm text-gray-600">
                          {historyLoading[emp._id] ? (
                            <p>Loading history...</p>
                          ) : locationHistoryData[emp._id]?.length > 0 ? (
                            <ul className="space-y-1">
                              {locationHistoryData[emp._id].map((loc, index) => (
                                <li key={index}>
                                  {new Date(loc.timestamp).toLocaleString()} - {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No history available</p>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data text-center py-16 text-gray-500">
              <p className="text-lg font-semibold">No employee location data found</p>
              <small className="text-gray-400">Employees need to log in and enable location tracking</small>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default LocationTab;
