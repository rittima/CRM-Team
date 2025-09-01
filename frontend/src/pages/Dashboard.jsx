import { useState } from 'react';
import DashCard from '../components/DashCard';
import Card from '../components/Card';
import LocationStatus from '../components/LocationStatus';

const Dashboard = ({ handleSaveTask, showTimerModal, onOpenTimer, onCloseTimer }) => {
  return (
    <div>
      <div className='flex justify-between pt-5'>
        <div className="p-4 pl-7 text-gray-500 text-1xl font-bold">CRM Dashboard</div>
        <LocationStatus />
      </div>
      <Card />
      
      <DashCard
        showTimerModal={showTimerModal}
        onOpenTimer={onOpenTimer}
        onCloseTimer={onCloseTimer}
        onSaveTask={handleSaveTask}
      />
    </div>
  );
};

export default Dashboard;
