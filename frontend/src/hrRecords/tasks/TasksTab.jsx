import React, { useState } from "react";
import EmployeeSearchBox from "./EmployeeSearchBox";
import TasksTable from "./TasksTable";
import api from "../../services/axios";
import { HrTaskForm } from "../../components/HrTaskCard";


const TasksTab = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async (employeeId) => {
    try {
      setLoading(true);
      const emp = await api.get(`/tasks/user/${employeeId}`);
      setTasks(emp.data.tasks || []);
      const hr = await api.get(`/hr-tasks/assigned-by-me`);
      setTasks((prevTasks) => [...prevTasks, ...(hr.data.tasks || [])]);
      
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">

      <div className="flex items-center justify-between pb-7 gap-4">
        {/* Employee Search */}
        <EmployeeSearchBox
          onSelectEmployee={(empId) => {
            setSelectedEmployee(empId);
            fetchTasks(empId);
          }}
        />

        {/* Toggle Task Form */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gray-800 text-white px-5 py-2 rounded-md font-medium
                    hover:bg-blue-700 transition-all duration-200"
        >
          {showForm ? "− Close Task Form" : "+ Assign New Task"}
        </button>
      </div>


      {/* Task Form */}
      {showForm && (
        <div className="mt-6">
          <HrTaskForm 
            onTaskAssigned={() => {
              if (selectedEmployee) fetchTasks(selectedEmployee); // ✅ refresh only if employee selected
            }}
            onClose={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Task Table */}
      {selectedEmployee ? (
        <TasksTable tasks={tasks} loading={loading} setTasks={setTasks} />
      ) : (
        <div className="flex justify-center items-center h-32 text-gray-500 bg-gray-50 text-lg font-medium border border-dashed border-gray-300 rounded-lg">
          👤 Please select an employee
        </div>
      )}
    </div>
  );
};

export default TasksTab;

