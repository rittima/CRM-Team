// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function TimerLogs() {
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchLogs = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/attendance/logs");
//       setLogs(res.data);
//       setLoading(false);
//     } catch {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLogs();
//     const interval = setInterval(fetchLogs, 500);
//     return () => clearInterval(interval);
//   }, []);

//   const getTotalTime = (checkIn, checkOut) => {
//     if (!checkIn || !checkOut) return "-";
//     const diffMs = new Date(checkOut) - new Date(checkIn);
//     const totalSeconds = Math.floor(diffMs / 1000);
//     const mins = Math.floor(diffMs / 60000);
//     const hrs = Math.floor(mins / 60);
//     const secs = totalSeconds % 60;
//     return `${hrs}h ${mins}m ${secs}s`;
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center py-10 text-gray-500">
//         Loading attendance logs...
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-8xl mx-auto p-6">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">
//         Attendance Logs
//       </h2>
//       <div className="overflow-x-auto bg-white shadow-md">
//         <table className="min-w-full text-sm text-gray-700">
//           <thead>
//             <tr className="bg-gray-800 text-left text-white uppercase text-xs tracking-wider">
//               <th className="px-6 py-3">User</th>
//               <th className="px-6 py-3">Check In</th>
//               <th className="px-6 py-3">Check Out</th>
//               <th className="px-6 py-3">Total Time</th>
//             </tr>
//           </thead>
//           <tbody>
//             {logs.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan="4"
//                   className="text-center py-6 text-gray-500 italic"
//                 >
//                   No attendance logs available
//                 </td>
//               </tr>
//             ) : (
//               logs.map((log) => (
//                 <tr
//                   key={log._id}
//                   className="border-b hover:bg-gray-50 transition"
//                 >
//                   <td className="px-6 py-3 font-medium">{log.userId}</td>
//                   <td className="px-6 py-3">
//                     {log.checkIn
//                       ? new Date(log.checkIn).toLocaleString("en-IN", {
//                           dateStyle: "medium",
//                           timeStyle: "medium",
//                         })
//                       : "-"}
//                   </td>
//                   <td className="px-6 py-3">
//                     {log.checkOut
//                       ? new Date(log.checkOut).toLocaleString("en-IN", {
//                           dateStyle: "medium",
//                           timeStyle: "medium",
//                         })
//                       : "-"}
//                   </td>
//                   <td className="px-6 py-3">
//                     {getTotalTime(log.checkIn, log.checkOut)}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default TimerLogs;
