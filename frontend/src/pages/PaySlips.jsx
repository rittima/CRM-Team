import { useState, useEffect } from "react";
import { Calendar, Eye, Receipt, Download, ReceiptIndianRupee } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupee } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import { payslips } from "../data";
import { useAuth } from "../context/AuthContext";

const PaySlips = () => {
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const loggedInUserId = user.employeeId;

  const fetchSalary = async () => {
    if (!loggedInUserId) {
      setError("No employeeId found. Please log in again.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/salary/user/${loggedInUserId}`);
      setSalary(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching salary data");
    }
    setLoading(false);
  };
    const allowance = salary ? salary.basicPay : 0;
    const Tax = salary ? salary.deductions : 0;
    const housingAllowance = (allowance * 40) / 100;
    const transportAllowance = (allowance * 20) / 100;
    const medicalAllowance = (allowance * 30) / 100;
    const performanceBonus = (allowance * 10) / 100;
    const incomeTax = (Tax * 30) / 100;
    const socialSecurity = (Tax * 40) / 100;
    const healthInsurance = (Tax * 50) / 100;

  useEffect(() => {
    fetchSalary();
  }, []);

  return (
  <div className="p-5 bg-gray-50 space-y-8 pl-7">
    {/* Header */}
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <h1 className="text-gray-500 text-1xl font-bold mb-4 uppercase">
        Payslips & Salary
      </h1>
    </div>

    {/* Salary Overview */}
    {loading ? (
      <p className="text-center text-gray-600">Loading...</p>
    ) : error ? (
      <p className="text-center text-red-500">{error}</p>
    ) : !salary ? (
      <p className="text-center text-gray-500 py-10">
        No salary record found.
      </p>
    ) : (
      <>
        {/* Quick Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white shadow-md hover:shadow-lg transition rounded-lg">
            <p className="text-sm text-gray-500">Basic Pay</p>
            <h3 className="text-xl font-bold text-green-700">
              <FontAwesomeIcon icon={faIndianRupee} /> {salary.basicPay}
            </h3>
          </div>
          <div className="p-4 bg-white shadow-md hover:shadow-lg transition rounded-lg">
            <p className="text-sm text-gray-500">Allowances</p>
            <h3 className="text-xl font-bold text-blue-700">
              <FontAwesomeIcon icon={faIndianRupee} /> {salary.allowances}
            </h3>
          </div>
          <div className="p-4 bg-white shadow-md hover:shadow-lg transition rounded-lg">
            <p className="text-sm text-gray-500">Deductions</p>
            <h3 className="text-xl font-bold text-red-700">
              <FontAwesomeIcon icon={faIndianRupee} /> {salary.deductions}
            </h3>
          </div>
          <div className="p-4 bg-white shadow-md hover:shadow-lg transition rounded-lg">
            <p className="text-sm text-gray-500">Net Salary</p>
            <h3 className="text-xl font-bold text-purple-700">
              <FontAwesomeIcon icon={faIndianRupee} /> {salary.netPay}
            </h3>
          </div>
        </div>

        {/* Payslips History */}
       <div className="bg-white shadow-md rounded-lg shadow-sm p-6 space-y-4">
         <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
           <Calendar className="h-5 w-5" />
           Payslips History
         </h2>
         {payslips.map((p, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center border border-gray-300 rounded-md p-4 hover:border-blue-300 hover:shadow-sm transition duration-200"

          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-md">
                <Receipt className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">{p.month}</p>
                <p className="text-sm text-gray-500">Generated on {p.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                  salary.status === "Paid"
                    ? "bg-green-100 text-green-700"
                    : salary.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {salary.status}
              </span>
              <button className="text-sm px-3 py-1 hover:bg-blue-50 flex items-center gap-1">
                <Download className="h-4 w-4 hover:h-6 hover:w-6 transition-all duration-300 cursor-pointer" /> 
              </button>
            </div>
          </div>
        ))}
      </div>


        {/* Monthly Breakdown */}
        <div className="bg-white shadow-md rounded-lg shadow-sm p-6 space-y-4 mt-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <ReceiptIndianRupee className="h-5 w-5" />
            Current Month Breakdown
          </h2>

          {[
            { label: "Base Salary", amount: salary.basicPay, type: "positive" },
            { label: "Housing Allowance", amount: housingAllowance, type: "positive" },
            { label: "Transport Allowance", amount: transportAllowance, type: "positive" },
            { label: "Medical Allowance", amount: medicalAllowance, type: "positive" },
            { label: "Performance Bonus", amount: performanceBonus, type: "positive" },
            { label: "Income Tax", amount: incomeTax, type: "negative" },
            { label: "Social Security", amount: socialSecurity, type: "negative" },
            { label: "Health Insurance", amount: healthInsurance, type: "negative" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between text-sm text-gray-700">
              <span>{item.label}</span>
              <span
                className={
                  item.type === "positive" ? "text-green-600" : "text-red-600"
                }
              >
                {item.type === "positive" ? "+" : "-"}
                <FontAwesomeIcon icon={faIndianRupee} />{" "}
                {Math.abs(item.amount || 0)}
              </span>
            </div>
          ))}

          {/* Net Salary */}
          <div className="border-t pt-3 mt-3 flex justify-between items-center text-purple-600 font-semibold text-gray-800">
            <span>Net Salary</span>
            <span className="text-lg text-primary">
              <FontAwesomeIcon icon={faIndianRupee} /> {salary.netPay}
            </span>
          </div>
        </div>
      </>
    )}
  </div>
);

};

export default PaySlips;
