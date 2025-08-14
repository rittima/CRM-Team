import React, { useState } from "react";
import "../Styles/Expenses.scss";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Expenses = () => {
  const [expenses, setExpenses] = useState([
    { date: "2025-07-29", category: "Travel", amount: 1200 },
    { date: "2025-07-30", category: "Office Supplies", amount: 800 },
    { date: "2025-07-30", category: "Travel", amount: 700 },
    { date: "2025-08-02", category: "Food", amount: 400 },
  ]);

  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [newExpense, setNewExpense] = useState({
    date: "",
    category: "",
    amount: "",
  });

  const handleAddExpense = () => {
    if (!newExpense.date || !newExpense.category || !newExpense.amount) return;
    setExpenses([
      ...expenses,
      { ...newExpense, amount: parseFloat(newExpense.amount) },
    ]);
    setShowModal(false);
    setNewExpense({ date: "", category: "", amount: "" });
  };

  const filteredExpenses = expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    const month = expDate.toLocaleString("default", { month: "short" });
    const year = expDate.getFullYear().toString();
    return (
      (!filterMonth || filterMonth === month) &&
      (!filterYear || filterYear === year)
    );
  });

  // Pie Chart Data (Category Distribution)
  const categoryData = filteredExpenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#4bc0c0",
          "#ffcd56",
          "#9966ff",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Grouped Bar Chart Data (category expenses grouped by month)
  const categoryMonthData = {};

  expenses.forEach((exp) => {
    const month = new Date(exp.date).toLocaleString("default", {
      month: "short",
    });
    if (!categoryMonthData[exp.category]) {
      categoryMonthData[exp.category] = {};
    }
    categoryMonthData[exp.category][month] =
      (categoryMonthData[exp.category][month] || 0) + exp.amount;
  });

  const allMonths = [
    ...new Set(
      expenses.map((e) =>
        new Date(e.date).toLocaleString("default", { month: "short" })
      )
    ),
  ];

  const groupedBarData = {
    labels: allMonths,
    datasets: Object.keys(categoryMonthData).map((category, index) => ({
      label: category,
      data: allMonths.map((month) => categoryMonthData[category][month] || 0),
      backgroundColor: ["#ff6384", "#36a2eb", "#4bc0c0", "#ffcd56", "#9966ff"][
        index % 5
      ],
    })),
  };

  const groupedBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Grouped Expense Chart" },
    },
    scales: {
      x: {
        stacked: false,
        ticks: { autoSkip: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 200, // Adjust this based on your amount scale
        },
      },
    },
    barThickness: 40, // Increases individual bar thickness
    categoryPercentage: 0.6, // Adjusts spacing within group
    barPercentage: 0.8, // Makes bars wider within their group
  };

  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="expense-page">
      <h2>Expense Overview</h2>

      <div className="filters">
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        >
          <option value="">All Months</option>
          {[
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ].map((month, idx) => (
            <option key={idx} value={month}>
              {month}
            </option>
          ))}
        </select>

        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
        >
          <option value="">All Years</option>
          {[2024, 2025, 2026].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="actions">
        <button onClick={() => setShowModal(true)}>+ Add Expense</button>
      </div>

      <div className="chart-section">
        <div className="chart-box">
          <h4>Expenses by Category</h4>
          <div className="chart-wrapper">
            <Pie data={pieData} />
          </div>
        </div>

        <div className="chart-box">
          <h4>Category-wise Monthly Comparison</h4>
          <div className="chart-wrapper">
            <Bar data={groupedBarData} options={groupedBarOptions} />
          </div>
        </div>
      </div>

      <div className="table-container">
        <h3>Expense Table</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((exp, idx) => (
              <tr key={idx}>
                <td>{exp.date}</td>
                <td>{exp.category}</td>
                <td>
                  ₹{" "}
                  {exp.amount >= 1000
                    ? exp.amount
                    : exp.amount}
                </td>
              </tr>
            ))}
            <tr>
              <td
                colSpan="2"
                style={{ textAlign: "right", fontWeight: "bold" }}
              >
                Total:
              </td>
              <td style={{ fontWeight: "bold" }}>
                ₹{" "}
                {totalAmount >= 1000
                  ? totalAmount
                  : totalAmount}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Expense</h3>
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) =>
                setNewExpense({ ...newExpense, date: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Category"
              value={newExpense.category}
              onChange={(e) =>
                setNewExpense({ ...newExpense, category: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: e.target.value })
              }
            />
            <div className="modal-actions">
              <button onClick={handleAddExpense}>Submit</button>
              <button className="cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
