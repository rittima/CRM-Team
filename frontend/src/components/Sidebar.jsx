// import { NavLink } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import {
//   LayoutDashboard, Users, ReceiptText, FolderOpen,
//   Users2, CalendarCheck2, BarChart,
//   IndianRupeeIcon, User2Icon,
//   FolderCheck
// } from "lucide-react";

// const Sidebar = () => {
//   const { user } = useAuth();
//   const userProfileImage = user?.photo || null;
//   const userName = user?.name || "User";

//   const linkClasses = ({ isActive }) =>
//     `flex items-center gap-2 px-3 py-2 rounded-md text-md font-medium transition 
//      ${isActive
//         ? "bg-gray-200 text-gray-900 font-semibold"
//         : "text-gray-300 hover:bg-gray-700 hover:text-white"
//      }`;

//   return (
//     <div>
//       {user ? (
//         <aside className="w-72 bg-gray-800 text-white h-full p-5 flex flex-col">
//           <ul className="space-y-1">
//             {/* User Info */}
//             <li className="flex items-center gap-3 mb-5 bg-gray-200 p-3 rounded-lg">
//               {userProfileImage ? (
//                 <img
//                   src={userProfileImage}
//                   alt={userName}
//                   className="w-11 h-11 rounded-full object-cover bg-white"
//                 />
//               ) : (
//                 <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-gray-700 flex items-center justify-center text-white font-semibold text-lg ">
//                   {userName.charAt(0).toUpperCase()}
//                 </div>
//               )}
//               <span className="text-gray-800 font-bold text-base">
//                 Hi, {user.name || "User"}
//               </span>
//             </li>

//             {/* Menu Links */}
//             <li><NavLink to="/" className={linkClasses}><LayoutDashboard size={18} /> Dashboard</NavLink></li>
//             <li><NavLink to="/profile" className={linkClasses}><User2Icon size={18} /> Profile</NavLink></li>
//             <li><NavLink to="/hr" className={linkClasses}><Users size={18} /> HR Records</NavLink></li>
//             <li><NavLink to="/hrproject" className={linkClasses}><FolderCheck size={18} /> HR Project</NavLink></li>
//             <li><NavLink to="/projects" className={linkClasses}><FolderOpen size={18} /> Projects</NavLink></li>
//             <li><NavLink to="/timesheet" className={linkClasses}><CalendarCheck2 size={18} />Leave Management</NavLink></li>
//             <li><NavLink to="/expenses" className={linkClasses}><ReceiptText size={18} /> Expense</NavLink></li>
//             <li><NavLink to="/workload" className={linkClasses}><Users2 size={18} /> Staff Workload</NavLink></li>
//             <li><NavLink to="/payslip" className={linkClasses}><IndianRupeeIcon size={18} /> Payslips & Salary</NavLink></li>
//             <li><NavLink to="/support" className={linkClasses}><BarChart size={18} /> Support</NavLink></li>
//           </ul>
//         </aside>
//       ) : null}
//     </div>
//   );
// };

// export default Sidebar;



import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Users, ReceiptText, FolderOpen,
  Users2, CalendarCheck2, BarChart,
  IndianRupeeIcon, User2Icon, FolderCheck
} from "lucide-react";

const Sidebar = () => {
  const { user } = useAuth();
  const userProfileImage = user?.photo || null;
  const userName = user?.name || "User";

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-md font-medium transition 
     ${isActive
        ? "bg-gray-200 text-gray-900 font-semibold"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
     }`;

  // Sidebar menus based on role
  const adminLinks = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/profile", label: "Profile", icon: User2Icon },
    { to: "/hr", label: "HR Records", icon: Users },
    { to: "/hrproject", label: "HR Project", icon: FolderCheck },
    { to: "/expenses", label: "Expense", icon: ReceiptText },
    { to: "/workload", label: "Staff Workload", icon: Users2 },
    { to: "/support", label: "Support", icon: BarChart },
  ];

  const employeeLinks = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/profile", label: "Profile", icon: User2Icon },
    { to: "/projects", label: "Projects", icon: FolderOpen },
    { to: "/timesheet", label: "Leave Management", icon: CalendarCheck2 },
    { to: "/payslip", label: "Payslips & Salary", icon: IndianRupeeIcon },
    { to: "/support", label: "Support", icon: BarChart },
  ];

  const links = user?.role === "admin" ? adminLinks : employeeLinks;

  return (
    <div>
      {user ? (
        <aside className="w-72 bg-gray-800 text-white h-full p-5 flex flex-col">
          <ul className="space-y-1">
            {/* User Info */}
            <li className="flex items-center gap-3 mb-5 bg-gray-200 p-3 rounded-lg">
              {userProfileImage ? (
                <img
                  src={userProfileImage}
                  alt={userName}
                  className="w-11 h-11 rounded-full object-cover bg-white"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-gray-700 flex items-center justify-center text-white font-semibold text-lg ">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-gray-800 font-bold text-base">
                Hi, {user.name || "User"}
              </span>
            </li>

            {/* Menu Links */}
            {links.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink to={to} className={linkClasses}>
                  <Icon size={18} /> {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </div>
  );
};

export default Sidebar;
