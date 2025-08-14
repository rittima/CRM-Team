import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Users,  ReceiptText, FolderOpen,
  Users2, CalendarCheck2,  Rocket,
  BookText, Settings, BarChart,
  IndianRupeeIcon,
  LogsIcon,
  Timer
} from "lucide-react";
import "../Styles/Sidebar.scss";

const Sidebar = () => {
  const { user } = useAuth();
  const linkClasses = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <div >
      {user ? (
        <aside className="sidebar">
          <ul>
            <li className="user-info">
              <img
                src={user.image}
                alt="User"
                className="user-pic"
              />
              <span className="user-name">
                Hi, {user.name || "User"}
              </span>
            </li>

            <li><NavLink to="/" className={linkClasses}><LayoutDashboard size={18} /> Dashboard</NavLink></li>
            <li><NavLink to="/hr" className={linkClasses}><Users size={18} /> HR Records</NavLink></li>
            <li><NavLink to="/expenses" className={linkClasses}><ReceiptText size={18} /> Expense</NavLink></li>
            <li><NavLink to="/projects" className={linkClasses}><FolderOpen size={18} /> Projects</NavLink></li>
            <li><NavLink to="/workload" className={linkClasses}><Users2 size={18} /> Staff Workload</NavLink></li>
            <li><NavLink to="/payslip" className={linkClasses}><IndianRupeeIcon size={18} /> Payslips & Salary</NavLink></li>
            <li><NavLink to="/timesheet" className={linkClasses}><CalendarCheck2 size={18} /> Timesheets & Leave</NavLink></li>
            <li><NavLink to="/logs" className={linkClasses}><Timer size={18} /> Timer Logs</NavLink></li>
            <li><NavLink to="/break-logs" className={linkClasses}><LogsIcon size={18} /> Break Logs</NavLink></li>
            <li><NavLink to="/leads" className={linkClasses}><Rocket size={18} /> Leads</NavLink></li>
            <li><NavLink to="/knowledge-base" className={linkClasses}><BookText size={18} /> Knowledge Base</NavLink></li>
            <li><NavLink to="/utilities" className={linkClasses}><Settings size={18} /> Utilities</NavLink></li>
            <li><NavLink to="/support" className={linkClasses}><BarChart size={18} /> Reports</NavLink></li>
          </ul>
        </aside>
      ) : null}
    </div>
  );
};

export default Sidebar;
