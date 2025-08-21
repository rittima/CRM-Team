import { useEffect, useState } from "react";
import axios from "../services/axios";
import { PlusCircle, Trash2, CheckCircle, X, Search, FileEdit } from "lucide-react";

const Salary = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    userEmail: "",
    basicPay: 0,
    allowances: 0,
    deductions: 0,
    month: "",
    netPay: 0,
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = Add, otherwise Edit

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

  const filteredSalaries = salaries.filter(
    (s) =>
      s.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.month.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-calculate Net Pay
  useEffect(() => {
    const basic = Number(formData.basicPay) || 0;
    const allow = Number(formData.allowances) || 0;
    const deduct = Number(formData.deductions) || 0;
    setFormData((prev) => ({ ...prev, netPay: basic + allow - deduct }));
  }, [formData.basicPay, formData.allowances, formData.deductions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/salary/${editingId}`, formData);
      } else {
        await axios.post("/salary", formData);
      }

      setFormData({
        userId: "",
        userName: "",
        userEmail: "",
        basicPay: 0,
        allowances: 0,
        deductions: 0,
        month: "",
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
      userId: salary.userId,
      userName: salary.userName,
      userEmail: salary.userEmail,
      basicPay: salary.basicPay,
      allowances: salary.allowances,
      deductions: salary.deductions,
      month: salary.month,
      netPay: salary.netPay,
    });
    setEditingId(salary._id);
    setShowForm(true);
  };

return (
  <div className="p-6 md:p-10 min-h-screen bg-gray-50">
    {/* Header */}
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
              userId: "",
              userName: "",
              userEmail: "",
              basicPay: 0,
              allowances: 0,
              deductions: 0,
              month: "",
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

    {/* Salary Cards */}
    {loading ? (
      <p className="text-center text-gray-600">Loading...</p>
    ) : filteredSalaries.length === 0 ? (
      <p className="text-center text-gray-500 py-10">No salary records found.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSalaries.map((sal) => (
          <div
            key={sal._id}
            className="bg-white rounded-2xl shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">{sal.userId} : {sal.userName}</h2>
                <button
                  onClick={() => handleEdit(sal)}
                  className="text-blue-600 hover:scale-110 transition"
                  title="Edit"
                >
                  <FileEdit />
                </button>
              </div><hr className="border border-gray-300 font-semibold text-lg border-blue-200 mb-3" />
              <p className="text-gray-500 text-sm">{sal.userEmail}</p>
              <p className="mt-1 text-gray-600 text-sm font-medium">EMP Month : {sal.month}</p>

              <div className="mt-4 text-gray-700 space-y-1 text-sm">
                <p>Basic: <span className="font-medium">₹{sal.basicPay}</span></p>
                <p>Allowances: <span className="font-medium">₹{sal.allowances}</span></p>
                <p>Deductions: <span className="font-medium">₹{sal.deductions}</span></p>
                <p className="font-semibold text-gray-900">Net Pay: ₹{sal.netPay}</p>
              </div>

              <span
                className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                  sal.status === "Paid"
                    ? "bg-green-100 text-green-700"
                    : sal.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {sal.status}
              </span>
            </div>

            <div className="mt-4 flex gap-3 justify-end">
              <button
                onClick={() => handleStatus(sal._id, "Paid")}
                className="text-green-600 hover:scale-110 transition"
                title="Mark as Paid"
              >
                <CheckCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleStatus(sal._id, "Failed")}
                className="text-red-600 hover:scale-110 transition"
                title="Mark as Failed"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(sal._id)}
                className="text-gray-600 hover:text-red-600 hover:scale-110 transition"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
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
              {[ 
                { type: "text", name: "userId", placeholder: "Employee ID" },
                { type: "text", name: "userName", placeholder: "Employee Name" },
                { type: "email", name: "userEmail", placeholder: "Email" },
                { type: "text", name: "month", placeholder: "Month (MM-YYYY)" },
              ].map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label className="text-gray-700 text-sm font-medium mb-1">
                    {field.placeholder}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={formData[field.name]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.name]: e.target.value })
                    }
                    required
                  />
                </div>
              ))}
            </div>

            {/* Salary Details */}
            <h3 className="text-gray-800 font-semibold text-lg border-b-2 border-blue-200 pb-2 mb-5">
              Salary Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[ 
                { type: "number", name: "basicPay", placeholder: "Basic Pay" },
                { type: "number", name: "allowances", placeholder: "Allowances" },
                { type: "number", name: "deductions", placeholder: "Deductions" },
              ].map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label className="text-gray-700 text-sm font-medium mb-1">{field.placeholder}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={formData[field.name]}
                      onChange={(e) =>
                        setFormData({ ...formData, [field.name]: e.target.value })
                      }
                      required
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
