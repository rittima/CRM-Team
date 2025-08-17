import React from "react";

const AttendanceTable = ({ data, loading, pagination, filters, setFilters }) => {
  if (loading) return <div className="loading">Loading attendance records...</div>;

  return (
    <div className="table-section">
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Working Hours</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record) => (
            <tr key={record._id}>
              <td>{record.userName}</td>
              <td>{new Date(record.checkInTime).toLocaleDateString()}</td>
              <td>{new Date(record.checkInTime).toLocaleTimeString()}</td>
              <td>{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : "N/A"}</td>
              <td>{record.workingHours}h</td>
              <td>{record.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
            disabled={filters.page === 1}
          >Previous</button>
          <span>Page {filters.page} of {pagination.totalPages}</span>
          <button 
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
            disabled={filters.page === pagination.totalPages}
          >Next</button>
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;
