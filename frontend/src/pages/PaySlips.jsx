import { salaryBreakdown, payslips, salary, monthBreadown } from "../data";
import { useState } from "react";
import { Calendar,  Eye, Receipt, Download, ReceiptIndianRupee } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupee } from "@fortawesome/free-solid-svg-icons";

const PaySlips = () => {
  const [selectedYear, setSelectedYear] = useState("2024");

  return (
    <div className="p-5 space-y-8  pl-7">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-gray-500 text-1xl font-bold mb-4 uppercase">Payslips & Salary</h1>
        <select
          className="w-36 px-3 py-2 text-sm bg-white shadow-sm border border-gray-100 cursor-pointer"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </select>
      </div>

      {/* Salary Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4  ">
        {salary.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 bg-gray-100 hover:shadow-lg transition`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full bg-${item.color}-100`}>
                {item.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <h3 className={`text-xl font-bold text-${item.color}-700`}>
                 <FontAwesomeIcon icon={faIndianRupee} />{item.value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payslips History */}
      <div className="bg-gray-100 rounded-lg shadow-sm p-6 space-y-4">
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
              <span className="font-semibold text-gray-700"><FontAwesomeIcon icon={faIndianRupee} />{p.amount}</span>
              <button className="text-sm px-3 py-1  hover:bg-blue-50 flex items-center gap-1">
                <Eye className="h-4 w-4 hover:h-6 hover:w-6 transition-all duration-300 cursor-pointer" /> 
              </button>
              <button className="text-sm px-3 py-1 hover:bg-blue-50 flex items-center gap-1">
                <Download className="h-4 w-4 hover:h-6 hover:w-6 transition-all duration-300 cursor-pointer" /> 
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-gray-100 rounded-lg shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
          <ReceiptIndianRupee className="h-5 w-5" />
          Current Month Breakdown
        </h2>
        {monthBreadown.map((item, i) => (
          <div key={i} className="flex justify-between text-sm text-gray-700">
            <span>{item.label}</span>
            <span className={item.type === 'positive' ? 'text-green-600' : 'text-red-600'}>
              {item.type === 'positive' ? '+' : '-'}<FontAwesomeIcon icon={faIndianRupee} />{Math.abs(item.amount)}
            </span>
          </div>
        ))}
        <div className="border-t pt-3 mt-3 flex justify-between items-center font-semibold text-gray-800">
          <span>Net Salary</span>
          <span className="text-lg text-primary"><FontAwesomeIcon icon={faIndianRupee} />{salaryBreakdown.netSalary}</span>
        </div>
      </div>
    </div>
  );
};

export default PaySlips;
