import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../services/axios";
import { PlusCircle, Trash2, CheckCircle, X, Search, FileEdit } from "lucide-react";

const Salary = () => {
  const { user } = useAuth();
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); 
  const [formData, setFormData] = useState({
    userId: user?.employeeId || "",
    userName: user?.name || "",
    userEmail: user?.email || "",
    basicPay: 0,
    allowances: {
      housing: 0,
      transport: 0,
      medical: 0,
      performanceBonus: 0,
      otherAllowance: 0,
      other: 0,
    },
    deductions: {
      incomeTax: 0,
      socialSecurity: 0,
      otherSecurity: 0,
      healthInsurance: 0,
      providentFund: 0,
      other: 0,
    },
    month: "",
    year: new Date().getFullYear().toString(),
    netPay: 0,
  });

  // Track paid months/years for selected employee
  const [paidMonthYears, setPaidMonthYears] = useState([]);

  // Fetch paid months/years for selected employee when form opens or userId changes
  useEffect(() => {
    async function fetchPaidMonthYears() {
      if (formData.userId) {
        try {
          const res = await axios.get("/salary?userId=" + formData.userId);
          // res.data is array of salary records
          const combos = res.data.map(s => `${s.month}-${s.year}`);
          setPaidMonthYears(combos);
        } catch {
          setPaidMonthYears([]);
        }
      } else {
        setPaidMonthYears([]);
      }
    }
    if (showForm) fetchPaidMonthYears();
  }, [formData.userId, showForm]);
  // null = Add, otherwise Edit

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/salary");
      setSalaries(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  // Auto-fill user info when modal opens (for Add)
  useEffect(() => {
    if (showForm && !editingId && user) {
      setFormData((prev) => ({
        ...prev,
        userId: user.employeeId || "",
        userName: user.name || "",
        userEmail: user.email || "",
      }));
    }
  }, [showForm, editingId, user]);

  const filteredSalaries = salaries.filter(
    (s) =>
      s.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-calculate Net Pay
  useEffect(() => {
    if (!showForm) return;
    const basic = Number(formData.basicPay) || 0;
    const hra = +(basic * 0.5).toFixed(2); // 50%
    const ma = +(basic * 0.0625).toFixed(2); // 6.25%
    const pa = +(basic * 0.1).toFixed(2); // 10%
    const pf = +(basic * 0.12).toFixed(2); // 12%
    const esi = +(basic * 0.0075).toFixed(2); // 0.75%
    const incomeTax = +(basic * 0.05).toFixed(2); // 5%

    const allow = hra + ma + pa +
      Number(formData.allowances.transport) +
      Number(formData.allowances.otherAllowance) +
      Number(formData.allowances.other);
    const deduct = pf + esi + incomeTax +
      Number(formData.deductions.socialSecurity) +
      Number(formData.deductions.otherSecurity) +
      Number(formData.deductions.other);
    const netPay = basic + allow - deduct;

    setFormData((prev) => ({
      ...prev,
      allowances: {
        ...prev.allowances,
        housing: hra,
        medical: ma,
        performanceBonus: pa,
      },
      deductions: {
        ...prev.deductions,
        providentFund: pf,
        healthInsurance: esi,
        incomeTax: incomeTax,
      },
      netPay: netPay,
    }));
  }, [formData.basicPay, formData.allowances.transport, formData.allowances.otherAllowance, formData.allowances.other, formData.deductions.socialSecurity, formData.deductions.otherSecurity, formData.deductions.other]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userId || formData.userId.trim() === "") {
      alert("Employee ID is missing. Please ensure you are logged in and try again.");
      return;
    }
    try {
      // Include month and year in salary submission
      const submitData = {
        userId: formData.userId,
        userName: formData.userName,
        userEmail: formData.userEmail,
        basicPay: formData.basicPay,
        allowances: formData.allowances,
        deductions: formData.deductions,
        netPay: formData.netPay,
        month: formData.month,
        year: formData.year
      };

      if (editingId) {
        await axios.put(`/salary/${editingId}`, submitData);
      } else {
        await axios.post("/salary", submitData);
      }

      setFormData({
        userId: user?.employeeId || "",
        userName: user?.name || "",
        userEmail: user?.email || "",
        basicPay: 0,
        allowances: {
          housing: 0,
          transport: 0,
          medical: 0,
          performanceBonus: 0,
          otherAllowance: 0,
          other: 0,
        },
        deductions: {
          incomeTax: 0,
          socialSecurity: 0,
          otherSecurity: 0,
          healthInsurance: 0,
          providentFund: 0,
          other: 0,
        },
        month: "",
        year: new Date().getFullYear().toString(),
        netPay: 0,
      });
      setEditingId(null);
      setShowForm(false);
      fetchSalaries();
    } catch (err) {
      alert(err.response?.data?.error || "Error saving salary");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`/salary/${id}`);
      fetchSalaries();
    } catch (err) {
      alert(err.response?.data?.error || "Error deleting salary");
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await axios.patch(`/salary/${id}/status`, { status });
      fetchSalaries();
    } catch (err) {
      alert(err.response?.data?.error || "Error updating status");
    }
  };

  const handleEdit = (salary) => {
    setFormData({
      userId: salary.userId || "",
      userName: salary.userName || "",
      userEmail: salary.userEmail || "",
      basicPay: Number(salary.basicPay) || 0,
      allowances: {
        housing: Number(salary.allowances?.housing) || 0,
        transport: Number(salary.allowances?.transport) || 0,
        medical: Number(salary.allowances?.medical) || 0,
        performanceBonus: Number(salary.allowances?.performanceBonus) || 0,
        otherAllowance: Number(salary.allowances?.otherAllowance) || 0,
        other: Number(salary.allowances?.other) || 0,
      },
      deductions: {
        incomeTax: Number(salary.deductions?.incomeTax) || 0,
        socialSecurity: Number(salary.deductions?.socialSecurity) || 0,
        otherSecurity: Number(salary.deductions?.otherSecurity) || 0,
        healthInsurance: Number(salary.deductions?.healthInsurance) || 0,
        providentFund: Number(salary.deductions?.providentFund) || 0,
        other: Number(salary.deductions?.other) || 0,
      },
      month: salary.month || "",
      year: salary.year || new Date().getFullYear().toString(),
      netPay: Number(salary.netPay) || 0,
    });
    setEditingId(salary._id);
    setShowForm(true);
  };


  return (
    <div className="p-6 md:p-10 min-h-screen bg-gray-50">
      {/* Header with Add Salary button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Salary Management</h1>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name, email, or month..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
          <button
            className="flex items-center gap-2 bg-gray-800 text-white px-5 py-2.5 shadow-md hover:bg-blue-700 transition"
            onClick={() => {
              setFormData({
                userId: user?.employeeId || "",
                userName: user?.name || "",
                userEmail: user?.email || "",
                basicPay: 0,
                allowances: {
                  housing: 0,
                  transport: 0,
                  medical: 0,
                  performanceBonus: 0,
                  otherAllowance: 0,
                  other: 0,
                },
                deductions: {
                  incomeTax: 0,
                  socialSecurity: 0,
                  otherSecurity: 0,
                  healthInsurance: 0,
                  providentFund: 0,
                  other: 0,
                },
                month: "",
                year: new Date().getFullYear().toString(),
                netPay: 0,
              });
              setEditingId(null);
              setShowForm(true);
            }}
          >
            <PlusCircle className="w-5 h-5" /> Add Salary
          </button>
        </div>
      </div>

      {/* Salary Table */}
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : filteredSalaries.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No salary records found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Employee ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Month</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Year</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-green-700 border-b">Allowances</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-red-700 border-b">Deductions</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Net Pay</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Status</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSalaries.map((sal) => {
                const totalAllowances = Object.values(sal.allowances || {}).reduce((acc, v) => acc + Number(v || 0), 0);
                const totalDeductions = Object.values(sal.deductions || {}).reduce((acc, v) => acc + Number(v || 0), 0);

                return (
                  <tr key={sal._id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-4 py-3 text-sm text-gray-800 ">{sal.userId}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800 ">{sal.userName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 ">{sal.userEmail}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 ">{sal.month}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 ">{sal.year}</td>
                    <td className="px-4 py-3 text-sm text-green-700 font-semibold ">{`₹${totalAllowances}`}</td>
                    <td className="px-4 py-3 text-sm text-red-700 font-semibold ">{`₹${totalDeductions}`}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 ">{`₹${sal.netPay}`}</td>
                    <td className="px-4 py-3 ">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          sal.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : sal.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {sal.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex items-center justify-center gap-3">
                      <button onClick={() => handleEdit(sal)} className="text-blue-600 hover:scale-110 transition" title="Edit">
                        <FileEdit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleStatus(sal._id, "Paid")} className="text-green-600 hover:scale-110 transition" title="Mark as Paid">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleStatus(sal._id, "Failed")} className="text-red-600 hover:scale-110 transition" title="Mark as Failed">
                        <X className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(sal._id)} className="text-gray-600 hover:text-red-600 hover:scale-110 transition" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      )}

      {/* Add/Edit Salary Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white shadow-2xl w-full max-w-lg relative p-6 md:p-8 rounded-2xl">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-center text-gray-800 font-semibold text-lg border-b-2 border-blue-200 pb-2 mb-5">
              {editingId ? "Edit Employee Salary" : "Add Employee Salary"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Employee Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-gray-700 text-sm font-medium mb-1">Employee ID</label>
                  <input
                    type="text"
                    value={formData.userId}
                    onChange={async (e) => {
                      const empId = e.target.value;
                      setFormData((prev) => ({ ...prev, userId: empId }));
                      // Auto-fetch employee details if ID is valid length
                      if (empId.length >= 4) {
                        try {
                          const res = await axios.get(`/user/by-employee-id/${empId}`);
                          const emp = res.data;
                          setFormData((prev) => ({
                            ...prev,
                            userName: emp.name || "",
                            userEmail: emp.email || "",
                          }));
                        } catch {
                          setFormData((prev) => ({ ...prev, userName: "", userEmail: "" }));
                        }
                      } else {
                        setFormData((prev) => ({ ...prev, userName: "", userEmail: "" }));
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 text-sm font-medium mb-1">Employee Name</label>
                  <input
                    type="text"
                    value={formData.userName}
                    disabled
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.userEmail}
                    disabled
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-gray-700 text-sm font-medium mb-1">Month</label>
                      <select
                        value={formData.month}
                        onChange={e => setFormData({ ...formData, month: e.target.value })}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition mb-2"
                      >
                        <option value="">Select Month</option>
                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((monthName, i) => {
                          const monthNum = (i + 1).toString().padStart(2, '0');
                          const combo = `${monthName}-${formData.year}`;
                          const disabled = paidMonthYears.includes(combo);
                          return (
                            <option key={monthNum} value={monthName} disabled={disabled}>
                              {monthName} {disabled ? "(Paid)" : ""}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="text-gray-700 text-sm font-medium mb-1">Year</label>
                      <select
                        value={formData.year}
                        onChange={e => setFormData({ ...formData, year: e.target.value })}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      >
                        {Array.from({ length: 100 }).map((_, i) => {
                          const year = (2025 + i).toString();
                          // If all months for this year are paid, disable year
                          const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                          const allPaid = months.every(m => paidMonthYears.includes(`${m}-${year}`));
                          return (
                            <option key={year} value={year} disabled={allPaid}>
                              {year} {allPaid ? "(All Paid)" : ""}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary Details */}
              <h3 className="text-gray-800 font-semibold text-lg border-b-2 border-blue-200 pb-2 mb-5">
                Salary Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="text-gray-700 text-sm font-medium mb-1">Basic Pay</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                    <input
                      type="number"
                      placeholder="Basic Pay"
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={formData.basicPay}
                      onChange={(e) => setFormData({ ...formData, basicPay: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Allowances */}
              <h4 className="text-gray-700 font-semibold mt-6 mb-2">Allowances</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: "housing", label: "Housing Rent Allowance (HRA)" },
                  { name: "medical", label: "Medical Allowance" },
                  { name: "performanceBonus", label: "Performance Bonus" },
                ].map((field) => (
                  <div key={field.name} className="flex flex-col">
                    <label className="text-gray-700 text-sm font-medium mb-1">{field.label}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                      <input
                        type="number"
                        placeholder={field.label}
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={formData.allowances[field.name]}
                        disabled
                        min={0}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Deductions */}
              <h4 className="text-gray-700 font-semibold mt-6 mb-2">Deductions</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: "providentFund", label: "Provident Fund (PF)" },
                  { name: "incomeTax", label: "Income Tax" },
                  { name: "healthInsurance", label: "Employee State Insurance (ESI)" },
                ].map((field) => (
                  <div key={field.name} className="flex flex-col">
                    <label className="text-gray-700 text-sm font-medium mb-1">{field.label}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                      <input
                        type="number"
                        placeholder={field.label}
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={formData.deductions[field.name]}
                        disabled
                        min={0}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Net Pay */}
              <p className="mt-2 text-gray-800 font-semibold text-right">
                Net Pay: ₹{formData.netPay}
              </p>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
 );
}
export default Salary;
