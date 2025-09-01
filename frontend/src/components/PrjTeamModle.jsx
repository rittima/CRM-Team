const PrjTeamModle = ({ teamMembers = [], onClose }) => {
  if (!teamMembers.length) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-6 shadow-2xl w-full max-w-md relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition text-2xl"
        >
          &times;
        </button>

        <h1 className="text-2xl text-center font-bold mb-6 text-gray-800 border-b pb-3">
          Team Members
        </h1>

        <div className="overflow-y-auto max-h-96">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="py-2 px-4 text-left text-sm font-semibold">Emp ID</th>
                <th className="py-2 px-4 text-left text-sm font-semibold">Employee Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teamMembers.map((member) => (
                <tr key={member.empId} className="hover:bg-gray-50 transition">
                  <td className="py-2 px-4 text-sm text-gray-700">{member.empId}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">{member.empEmail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-red-600 text-white hover:bg-red-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrjTeamModle;
