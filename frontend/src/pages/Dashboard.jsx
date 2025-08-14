import { useState } from 'react';
import DashCard from '../timer/DashCard';
import Card from '../components/Card';

const Dashboard = ({ tasks, handleSaveTask, showTimerModal, onOpenTimer, onCloseTimer }) => {
  return (
    <div>
      <div className="p-4 pl-7 text-gray-500 text-1xl font-bold">CRM Dashboard</div>
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
