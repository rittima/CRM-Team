
import { useState, useEffect } from "react";
import axios from "../services/axios";
import { Users, Briefcase, BarChart2, PieChart, CheckCircle, AlertCircle } from "lucide-react";
import { Bar, Line } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement,ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const StaffWorkload = () => {
  // State for dashboard data
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [attendanceRate, setAttendanceRate] = useState(0);
  const [projectProgress, setProjectProgress] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [topPerformer, setTopPerformer] = useState("");
  const [employeesList, setEmployeesList] = useState([]);
  // For employee attendance count per employee
  const [attendanceGraph, setAttendanceGraph] = useState([]);
  const [projectGraph, setProjectGraph] = useState(null);
  const [projectStatusSummary, setProjectStatusSummary] = useState({});
  const [projectStatusDetails, setProjectStatusDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const filteredEmployees = employeesList.filter(
    emp =>
      emp &&
      typeof emp.employeeId === 'string' &&
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp && typeof emp.name === 'string' && emp.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch employees for search (always global)
        const empRes = await axios.get("/employees/list");
        setEmployeesList(empRes.data);

        // If an employee is selected, fetch their dashboard data
        if (selectedEmployee) {
          const summaryRes = await axios.get(`/dashboard/summary/${selectedEmployee.employeeId}`);
          setTotalEmployees(1);
          setTotalProjects(summaryRes.data.totalProjects);
          setAttendanceRate(summaryRes.data.attendanceRate);
          setProjectProgress(summaryRes.data.projectProgress);
          setPendingTasks(summaryRes.data.pendingTasks);
          setTopPerformer(summaryRes.data.topPerformer);

          // Fetch attendance graph for this employee
          const attGraphRes = await axios.get(`/dashboard/attendance-count-graph/${selectedEmployee.employeeId}`);
          setAttendanceGraph(attGraphRes.data);

          // Fetch project graph for this employee
          const projGraphRes = await axios.get(`/dashboard/project-graph/${selectedEmployee.employeeId}`);
          setProjectGraph(projGraphRes.data);

          // Fetch project status summary for pie chart
          const statusRes = await axios.get(`/dashboard/project-status-summary/${selectedEmployee.employeeId}`);
          setProjectStatusSummary(statusRes.data);
          // Fetch project status details for pie chart hover
          const detailsRes = await axios.get(`/dashboard/project-status-details/${selectedEmployee.employeeId}`);
          setProjectStatusDetails(detailsRes.data);
        } else {
          // Fetch global dashboard data
          const summaryRes = await axios.get("/dashboard/summary");
          setTotalEmployees(summaryRes.data.totalEmployees);
          setTotalProjects(summaryRes.data.totalProjects);
          setAttendanceRate(summaryRes.data.attendanceRate);
          setProjectProgress(summaryRes.data.projectProgress);
          setPendingTasks(summaryRes.data.pendingTasks);
          setTopPerformer(summaryRes.data.topPerformer);

          // Fetch employee attendance count graph data
          const attGraphRes = await axios.get("/dashboard/attendance-count-graph");
          setAttendanceGraph(attGraphRes.data);

          // Fetch project progress graph data
          const projGraphRes = await axios.get("/dashboard/project-graph");
          setProjectGraph(projGraphRes.data);

          // Fetch project status summary for pie chart
          const statusRes = await axios.get("/dashboard/project-status-summary");
          setProjectStatusSummary(statusRes.data);
          // Fetch project status details for pie chart hover
          const detailsRes = await axios.get("/dashboard/project-status-details");
          setProjectStatusDetails(detailsRes.data);
        }
      } catch (err) {
        setError("Failed to fetch dashboard data.");
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedEmployee]);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <BarChart2 className="w-8 h-8 text-blue-600" /> Staff Workload Dashboard
      </h2>

      {loading ? (
        <div className="text-center py-20 text-lg text-gray-500">Loading dashboard...</div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : (
        <>
          {/* Employee Search Bar */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:gap-4">
            <input
              type="text"
              placeholder="Search employee by ID or name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border border-gray-300 px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded w-full md:w-96 shadow-sm"
            />
            {searchTerm && (
              <div className="mt-4 md:mt-0 bg-white rounded shadow p-4 w-full md:w-96">
                <h4 className="font-semibold mb-2">Search Results</h4>
                {filteredEmployees.length === 0 ? (
                  <div className="text-gray-500">No employee found.</div>
                ) : (
                  <ul className="divide-y">
                    {filteredEmployees.map(emp => (
                      <li key={emp.employeeId} className="py-2 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                          onClick={() => { setSelectedEmployee(emp); setSearchTerm(""); }}>
                        <span className="font-medium">{emp.name}</span>
                        <span className="text-gray-500 text-sm">{emp.employeeId}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <Users className="w-8 h-8 text-indigo-600 mb-2" />
              <div className="text-2xl font-bold">{selectedEmployee ? 1 : totalEmployees}</div>
              <div className="text-gray-500">Total Employees</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <Briefcase className="w-8 h-8 text-green-600 mb-2" />
              <div className="text-2xl font-bold">{totalProjects}</div>
              <div className="text-gray-500">Projects Allocated</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-blue-600 mb-2" />
              <div className="text-2xl font-bold">{attendanceRate}%</div>
              <div className="text-gray-500">Attendance Rate</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <PieChart className="w-8 h-8 text-yellow-600 mb-2" />
              <div className="text-2xl font-bold">{projectProgress}%</div>
              <div className="text-gray-500">Project Progress</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Employee Attendance Count Bar Chart */}
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center" style={{ minHeight: '320px' }}>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart2 className="w-6 h-10 text-blue-600" /> Employee Attendance
              </h3>
              <div className="w-full flex items-center justify-center" style={{ height: '240px' }}>
                {selectedEmployee ? (
                  attendanceGraph && attendanceGraph.length > 0 ? (
                    <Bar
                      data={{
                        labels: [attendanceGraph[0]?.name || selectedEmployee.name],
                        datasets: [
                          {
                            label: 'Attendance Count',
                            data: [attendanceGraph[0]?.count > 0 ? attendanceGraph[0].count : 0.1], // Show small bar for zero
                            backgroundColor: 'rgba(37, 99, 235, 0.7)',
                            minBarLength: 150, // Increase only bar length
                            barPercentage: 0.5, // Decrease only bar width
                            categoryPercentage: 0.2,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          title: { display: false },
                          tooltip: {
                            enabled: true,
                            callbacks: {
                              label: function(context) {
                                return `Attendance: ${attendanceGraph[0]?.count ?? 0}`;
                              }
                            }
                          },
                          datalabels: {
                            display: true,
                            color: '#222',
                            anchor: 'end',
                            align: 'top',
                            formatter: function() {
                              return attendanceGraph[0]?.count ?? 0;
                            }
                          }
                        },
                        scales: {
                          x: { grid: { display: false } },
                          y: {
                            beginAtZero: true,
                            grid: { display: false },
                            max: 1,
                          },
                        },
                      }}
                      height={220}
                    />
                  ) : (
                    <span className="text-gray-400">No graph data available.</span>
                  )
                ) : (
                  attendanceGraph && attendanceGraph.length > 0 ? (
                    <Bar
                      data={{
                        labels: attendanceGraph.map(d => d.name),
                        datasets: [
                          {
                            label: 'Attendance Count',
                            data: attendanceGraph.map(d => d.count),
                            backgroundColor: 'rgba(37, 99, 235, 0.7)',
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { display: false },
                          title: { display: false },
                        },
                        scales: {
                          x: { grid: { display: false } },
                          y: { beginAtZero: true, grid: { display: false } },
                        },
                      }}
                    />
                  ) : (
                    <span className="text-gray-400">No graph data available.</span>
                  )
                )}
              </div>
            </div>
            {/* Project Assessment Pie Chart by Status */}
            <div className="bg-white rounded-lg shadow p-6 mt-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <PieChart className="w-6 h-6 text-yellow-600" /> Project Records
              </h3>
              <div className="h-64 flex items-center justify-center">
                {projectStatusSummary && (projectStatusSummary['Ongoing'] > 0 || projectStatusSummary['Completed'] > 0) ? (
                  <Pie
                    data={{
                      labels: ['Ongoing', 'Completed'],
                      datasets: [
                        {
                          data: [projectStatusSummary['Ongoing'] || 0, projectStatusSummary['Completed'] || 0],
                          backgroundColor: [
                            'rgba(37, 99, 235, 0.7)',
                            'rgba(34, 197, 94, 0.7)'
                          ],
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: true },
                        title: { display: false },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `${context.label}: ${context.parsed}`;
                            }
                          }
                        }
                      },
                    }}
                  />
                ) : (
                  <span className="text-gray-400">No project status data available.</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            {/* Ongoing Projects Count */}
            <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-xl font-bold">{projectStatusSummary['Ongoing'] || 0}</div>
                <div className="text-gray-500">Ongoing Projects</div>
              </div>
            </div>
            {/* Top Performer */}
            <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-xl font-bold">{topPerformer}</div>
                <div className="text-gray-500">Top Performer</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StaffWorkload;
