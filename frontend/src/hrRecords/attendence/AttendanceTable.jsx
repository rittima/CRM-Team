// import React from "react";

// const AttendanceTable = ({ data, loading, pagination, filters, setFilters }) => {
//   if (loading) return <div className="loading">Loading attendance records...</div>;

//   return (
//     <div className="table-section">
//       <table className="attendance-table">
//         <thead>
//           <tr>
//             <th>Employee</th>
//             <th>Date</th>
//             <th>Check In</th>
//             <th>Check Out</th>
//             <th>Working Hours</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((record) => (
//             <tr key={record._id}>
//               <td>{record.userName}</td>
//               <td>{new Date(record.checkInTime).toLocaleDateString()}</td>
//               <td>{new Date(record.checkInTime).toLocaleTimeString()}</td>
//               <td>{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : "N/A"}</td>
//               <td>{record.workingHours}h</td>
//               <td>{record.status}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       {pagination.totalPages > 1 && (
//         <div className="pagination">
//           <button 
//             onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
//             disabled={filters.page === 1}
//           >Previous</button>
//           <span>Page {filters.page} of {pagination.totalPages}</span>
//           <button 
//             onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
//             disabled={filters.page === pagination.totalPages}
//           >Next</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AttendanceTable;


import React from "react";

const AttendanceTable = ({ data, loading }) => {
  if (loading)
    return (
      <div className="text-center py-10 text-gray-500 font-medium">
        Loading attendance records...
      </div>
    );

  if (!data.length)
    return (
      <div className="text-center py-10 text-gray-500 font-medium">
        No attendance records found.
      </div>
    );

  return (
    <div className="overflow-x-auto bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr className="shadow-md">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Check In
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Check Out
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Working Hours
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((record) => (
            <tr key={record._id} className="hover:bg-gray-50 transition shadow-sm">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.userName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(record.checkInTime).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(record.checkInTime).toLocaleTimeString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {record.checkOutTime ? (
                  <span className="text-gray-500">
                    {new Date(record.checkOutTime).toLocaleTimeString()}
                  </span>
                ) : (
                  <span className="text-yellow-600 font-medium">N/A</span>
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                <span className={`${record.workingHours > 8 ? "text-red-600" : "text-green-600"}`}>
                  {Math.floor(record.workingHours)} hrs {Math.round((record.workingHours % 1) * 60)} mins
                </span>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 rounded-full text-sm font-semibold ${
                    record.status === "checked-in"
                      ? "bg-green-100 text-green-700"
                      : record.status === "checked-out"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {record.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
