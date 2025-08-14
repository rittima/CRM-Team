import './App.css';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Projects from './pages/Projects';
import Report from './pages/Report';
import HrRecord from './pages/HrRecord';
import TimesheetsAndLeaves from './pages/TimesheetsAndLeaves';
import StaffWorkload from './pages/StaffWorkload';
import Expenses from './pages/Expenses';
import PaySlips from './pages/PaySlips';
import TimerLogs from './pages/TimerLogs';
import BreakLogs from './pages/BreakLogs';
import { useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
    const [showTimerModal, setShowTimerModal] = useState(false);
  
    // Called when saving a task from the timer modal
    const handleSaveTask = (taskTitle, desc, time) => {
      const newTask = {
        title: taskTitle,
        description: desc,
        timeTaken: time,
      };
      setTasks(prev => [...prev, newTask]);
    };

  return (
    <>
      <div id="mobile-block" className='block md:hidden text-center text-red-600 text-xl p-6'>
        This CRM application is not available on mobile devices.
      </div>

      <div id="desktop-app" className="hidden md:flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Navbar 
            tasks={tasks}
            showTimerModal={showTimerModal}
            onOpenTimer={() => setShowTimerModal(true)}
            onCloseTimer={() => setShowTimerModal(false)}
            onSaveTask={handleSaveTask}
          />

          <main className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<ProtectedRoute><Dashboard 
                tasks={tasks}
                handleSaveTask={handleSaveTask}
                showTimerModal={showTimerModal}
                onOpenTimer={() => setShowTimerModal(true)}
                onCloseTimer={() => setShowTimerModal(false)}
              /></ProtectedRoute>} />
              <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
              <Route path="/support" element={<ProtectedRoute><Report /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
              <Route path='/hr' element={<ProtectedRoute><HrRecord/> </ProtectedRoute>} />
              <Route path='/timesheet' element={<ProtectedRoute><TimesheetsAndLeaves/> </ProtectedRoute>} />
              <Route path='/workload' element={<ProtectedRoute><StaffWorkload/> </ProtectedRoute>} />
              <Route path='/expenses' element={<ProtectedRoute><Expenses/> </ProtectedRoute>} />
              <Route path='/payslip' element={<ProtectedRoute><PaySlips/> </ProtectedRoute>} />              
              <Route path="/logs" element={<TimerLogs />} />
              <Route path="/break-logs" element={<BreakLogs />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
