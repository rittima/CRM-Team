import DashCard from '../timer/DashCard';
import Card from '../components/Card';
import LocationStatus from '../components/LocationStatus';
import { HrTaskForm } from '../components/HrTaskCard';
import { useState } from 'react';

const Dashboard = ({ tasks, handleSaveTask, showTimerModal, onOpenTimer, onCloseTimer }) => {
  
  return (
    <div>
      <div className='flex justify-between pt-5'>
        <div className="p-4 pl-7 text-gray-500 text-1xl font-bold">CRM Dashboard</div>
        <LocationStatus />
      </div>
      <Card />
      <DashCard
        tasks={tasks}
        showTimerModal={showTimerModal}
        onOpenTimer={onOpenTimer}
        onCloseTimer={onCloseTimer}
        onSaveTask={handleSaveTask}
      />
    </div>
  );
};

export default Dashboard;
