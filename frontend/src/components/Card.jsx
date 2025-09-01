import React from "react";
import { useAuth } from "../context/AuthContext";

const Card = () => {
  const { user } = useAuth();

  const currentEmployee = {
    name: user?.name || "Employee",
    id: user?.employeeId || "Not Set",
    joiningDate: user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString()
      : "Not Available",
    designation: user?.designation || "Not Set",
    department: user?.domain || "Not Set",
    shiftTiming: user?.shiftTiming || "Not Set",
    status: user?.profileCompleted ? "Profile Completed" : "Profile Incomplete",
  };

  return (
    <div className="p-6 grid gap-6">
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
        <div className="flex flex-col gap-3">
          {/* Employee Name */}
          <h2 className="text-xl font-bold text-gray-800">
            {currentEmployee.name}
          </h2>

          {/* Employee Details in Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
            <p>
              <span className="font-semibold text-blue-900">Employee ID:</span>{" "}
              {currentEmployee.id}
            </p>
            <p>
              <span className="font-semibold text-blue-900">Designation:</span>{" "}
              {currentEmployee.designation}
            </p>
            <p>
              <span className="font-semibold text-blue-900">Domain:</span>{" "}
              {currentEmployee.department}
            </p>
            <p>
              <span className="font-semibold text-blue-900">Member Since:</span>{" "}
              {currentEmployee.joiningDate}
            </p>
            <p>
              <span className="font-semibold text-blue-900">Shift Timing:</span>{" "}
              {currentEmployee.shiftTiming}
            </p>
            <p>
              <span className="font-semibold text-blue-900">Status:</span>{" "}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentEmployee.status === "Profile Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {currentEmployee.status}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
