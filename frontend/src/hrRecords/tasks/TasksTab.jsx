import React, { useState } from "react";
import EmployeeSearchBox from "./EmployeeSearchBox";
import TasksTable from "./TasksTable";
import api from "../../services/axios";

const TasksTab = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async (employeeId) => {
    try {
      setLoading(true);
      const res = await api.get(`/tasks/user/${employeeId}`);
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <EmployeeSearchBox
        onSelectEmployee={(empId) => {
          setSelectedEmployee(empId);
          fetchTasks(empId);
        }}
      />

      {selectedEmployee ? (
        <TasksTable tasks={tasks} loading={loading} />
      ) : (
        <div className="flex justify-center items-center h-32 text-gray-500 text-lg font-medium border border-dashed border-gray-300 rounded-lg">
          👤 Please select an employee
        </div>
      )}
    </div>
  );
};

export default TasksTab;
