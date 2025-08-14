import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../Styles/HrRecord.scss";

ChartJS.register(ArcElement, Tooltip, Legend);

const HrRecord = () => {
  const pieData = {
    labels: ["Completed", "In Progress", "On Hold"],
    datasets: [
      {
        data: [70, 20, 10],
        backgroundColor: ["#2291c5", "#15faae", "#e36262"],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="hr-record">
      {/* Top Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <h2>200</h2>
          <p>Total Employees</p>
        </div>
        <div className="card">
          <h2>8</h2>
          <p>Total Departments</p>
        </div>
        <div className="card">
          <h2>1</h2>
          <p>Total Branches</p>
        </div>
      </div>

      {/* Hiring Section */}
      <div className="hiring-section">
        <div className="hiring-card">
          <div className="hiring-text">
            <h3>Hi SHAWN!</h3>
            <p>You have 24 new applications</p>
            <a href="#">Review It!</a>
          </div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3048/3048122.png"
            alt="Hiring"
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="main-grid">
        {/* Task Statistics */}
        <div className="task-statistics">
          <h4>Task Statistics</h4>
          <div className="chart-container">
            <div className="pie-wrapper">
              <Pie data={pieData} options={pieOptions} />
            </div>
            <div className="legend">
              <span className="completed">● Completed</span>
              <span className="in-progress">● In Progress</span>
              <span className="on-hold">● On Hold</span>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="schedule">
          <h4>Schedule & Holidays</h4>
          <ul>
            <li><span>Event One (Meeting)</span><span>24/02/2023</span></li>
            <li><span>Event Two (Public Holiday)</span><span>27/02/2023</span></li>
            <li><span>Event Three (Meeting)</span><span>28/02/2023</span></li>
            <li><span>Event Four (Public Holiday)</span><span>02/03/2023</span></li>
          </ul>
        </div>

        {/* Pending Concerns */}
        <div className="pending-concerns">
          <h4>Pending Concerns</h4>
          <ul>
            {[
              { name: "John Doe", email: "johndoe@xyz.com" },
              { name: "Amelia", email: "amelia@abc.com" },
              { name: "Aidan Butler", email: "aidanbutler@xyz.com" },
              { name: "Eli Hughes", email: "elihughes@abc.com" },
              { name: "Paul Walker", email: "paulwalker@xyz.com" },
              { name: "Hector Bell", email: "hectorbell@abc.com" },
            ].map((user, index) => (
              <li key={index}>
                <img
                  src={`https://i.pravatar.cc/150?img=${index + 10}`}
                  alt={user.name}
                />
                <div>
                  <p>{user.name}</p>
                  <p>{user.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HrRecord;
