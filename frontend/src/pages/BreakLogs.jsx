import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

function BreakLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    axios.get(`http://localhost:5000/api/break/logs/${user._id}`)
      .then(res => {
        setLogs(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="break-logs-title">Break Logs</h2>
      <table className="break-logs-table">
        <thead>
          <tr>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Duration (seconds)</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log._id}>
              <td>{log.startTime ? new Date(log.startTime).toLocaleString() : "-"}</td>
              <td>{log.endTime ? new Date(log.endTime).toLocaleString() : "-"}</td>
              <td>{log.durationInSeconds ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BreakLogs;