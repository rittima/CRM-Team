// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext'; // Adjust if different
// import { ListTodo, Search } from 'lucide-react';

// const TaskPage = () => {
//   const { user, employeeData } = useAuth();
//   const [tasks, setTasks] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   const currentEmployee = user
//     ? employeeData.find((emp) => emp.id === user.token)
//     : null;

//   useEffect(() => {
//     // Dummy data (replace with API call)
//     const dummyTasks = [
//       {
//         id: 'T001',
//         name: 'Fix Login Bug',
//         description: 'Resolve login validation issue.',
//         createdDate: '2025-07-20',
//         completedDate: '',
//         status: 'Pending',
//         employeeId: currentEmployee?.id,
//       },
//       {
//         id: 'T002',
//         name: 'Implement Dashboard',
//         description: 'Create dashboard with charts.',
//         createdDate: '2025-07-15',
//         completedDate: '2025-07-22',
//         status: 'Completed',
//         employeeId: currentEmployee?.id,
//       },
//       {
//         id: 'T003',
//         name: 'API Integration',
//         description: 'Integrate backend APIs with frontend.',
//         createdDate: '2025-07-18',
//         completedDate: '',
//         status: 'Pending',
//         employeeId: currentEmployee?.id,
//       },
//     ];

//     const filtered = dummyTasks.filter(task => task.employeeId === currentEmployee?.id);
//     setTasks(filtered);
//   }, [currentEmployee]);

//   const filteredTasks = tasks.filter((task) =>
//     `${task.id} ${task.name} ${task.description}`
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-700">
//         <ListTodo /> Your Assigned Tasks
//       </h1>

//       {/* Search Bar */}
//       <div className="mb-6 relative max-w-md">
//         <input
//           type="text"
//           placeholder="Search by Task ID, Name, or Description..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full px-10 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-400"
//         />
//         <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
//       </div>

//       <div className="overflow-x-auto shadow rounded-lg">
//         <table className="min-w-full bg-white border border-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="py-3 px-4 text-left">Task ID</th>
//               <th className="py-3 px-4 text-left">Task Name</th>
//               <th className="py-3 px-4 text-left">Description</th>
//               <th className="py-3 px-4 text-left">Created Date</th>
//               <th className="py-3 px-4 text-left">Completed Date</th>
//               <th className="py-3 px-4 text-left">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredTasks.map((task) => (
//               <tr key={task.id} className="border-t hover:bg-gray-50">
//                 <td className="py-2 px-4 text-sm">{task.id}</td>
//                 <td className="py-2 px-4 text-sm">{task.name}</td>
//                 <td className="py-2 px-4 text-sm">{task.description}</td>
//                 <td className="py-2 px-4 text-sm">{task.createdDate}</td>
//                 <td className="py-2 px-4 text-sm">
//                   {task.completedDate || <span className="text-gray-400">N/A</span>}
//                 </td>
//                 <td className="py-2 px-4 text-sm">
//                   <span
//                     className={`px-2 py-1 text-xs font-semibold rounded-full
//                     ${task.status === 'Completed'
//                       ? 'bg-green-100 text-green-700'
//                       : 'bg-yellow-100 text-yellow-700'}`}
//                   >
//                     {task.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//             {filteredTasks.length === 0 && (
//               <tr>
//                 <td colSpan="6" className="text-center py-6 text-gray-500">
//                   No matching tasks found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default TaskPage;
