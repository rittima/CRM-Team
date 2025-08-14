import React, { useState } from "react";
import "../Styles/StaffWorkload.scss";

const StaffWorkload = () => {
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const workloadData = [
    { name: "Alice", department: "Development", tasks: 8, hours: 32 },
    { name: "Bob", department: "Design", tasks: 5, hours: 20 },
    { name: "Charlie", department: "QA", tasks: 7, hours: 35 },
    { name: "David", department: "Development", tasks: 10, hours: 40 },
    { name: "Eve", department: "Design", tasks: 6, hours: 28 },
    { name: "Frank", department: "QA", tasks: 4, hours: 16 },
    { name: "Grace", department: "Development", tasks: 9, hours: 38 },
  ];

  const filteredData = workloadData.filter(
    (staff) =>
      (filterDepartment === "All" || staff.department === filterDepartment) &&
      staff.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //download
  const handleDownloadCSV = () => {
    const headers = ["Name", "Department", "Tasks", "Hours"];
    const rows = filteredData.map(({ name, department, tasks, hours }) =>
      [name, department, tasks, hours].join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "staff_workload.csv";
    a.click();
  };

  return (
    <div className="staff-workload-page">
      <h2 className="page-title">Staff Workload Overview</h2>

      <div className="filter-bar">
        <div>
          <label>Department: </label>
          <select
            value={filterDepartment}
            onChange={(e) => {
              setCurrentPage(1);
              setFilterDepartment(e.target.value);
            }}>
            <option value="All">All</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="QA">QA</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => {
            setCurrentPage(1);
            setSearchTerm(e.target.value);
          }}
        />

        <button className="download-btn" onClick={handleDownloadCSV}>
          ⬇ Download CSV
        </button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Tasks</th>
              <th>Workload</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((staff, idx) => (
                <tr key={idx}>
                  <td>{staff.name}</td>
                  <td>{staff.department}</td>
                  <td>{staff.tasks}</td>
                  <td>
                    <div className="progress-bar">
                      <div
                        className="fill"
                        style={{ width: `${(staff.hours / 40) * 100}%` }}
                      ></div>
                    </div>
                    <span>{staff.hours} hrs</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                className={currentPage === idx + 1 ? "active" : ""}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffWorkload;
