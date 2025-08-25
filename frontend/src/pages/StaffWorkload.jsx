

import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Dummy data for demonstration
const tasks = [
  { name: "Task 1", status: 80 },
  { name: "Task 2", status: 50 },
  { name: "Task 3", status: 100 },
];

const projects = [
  { name: "Project Alpha", status: 60 },
  { name: "Project Beta", status: 90 },
];

const employees = [
  { name: "John Doe", efficiency: 85 },
  { name: "Jane Smith", efficiency: 92 },
  { name: "Sam Wilson", efficiency: 78 },
];

const StaffWorkload = () => {
  // Chart Data
  const taskBarData = {
    labels: tasks.map(t => t.name),
    datasets: [
      {
        label: "Task Progress (%)",
        data: tasks.map(t => t.status),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const projectDoughnutData = {
    labels: projects.map(p => p.name),
    datasets: [
      {
        label: "Project Progress",
        data: projects.map(p => p.status),
        backgroundColor: ["#10b981", "#f59e42"],
      },
    ],
  };

  const employeeLineData = {
    labels: employees.map(e => e.name),
    datasets: [
      {
        label: "Efficiency (%)",
        data: employees.map(e => e.efficiency),
        borderColor: "#6366f1",
        backgroundColor: "#a5b4fc",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Staff Workload & Efficiency Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Tasks Progress Chart */}
        <div className="shadow p-4 rounded bg-white">
          <h3 className="text-lg font-semibold mb-4">Tasks Progress</h3>
          <Bar data={taskBarData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        {/* Projects Progress Chart */}
        <div className="shadow p-4 rounded bg-white">
          <h3 className="text-lg font-semibold mb-4">Projects Progress</h3>
          <Doughnut data={projectDoughnutData} options={{ responsive: true }} />
        </div>
        {/* Employee Efficiency Chart */}
        <div className="shadow p-4 rounded bg-white">
          <h3 className="text-lg font-semibold mb-4">Employee Efficiency</h3>
          <Line data={employeeLineData} options={{ responsive: true }} />
        </div>
      </div>
      {/* Add more important metrics here as needed */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Key Metrics</h3>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Total Tasks: {tasks.length}</li>
          <li>Total Projects: {projects.length}</li>
          <li>Average Employee Efficiency: {(
            employees.reduce((acc, emp) => acc + emp.efficiency, 0) / employees.length
          ).toFixed(1)}%</li>
        </ul>
      </div>
    </div>
  );
};

export default StaffWorkload;
