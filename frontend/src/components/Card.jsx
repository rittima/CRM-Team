import { User2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Card = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        Employee data not found.
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 p-6">
        {/* Employee Info */}
        <div className="bg-blue-50 shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
          <div className="flex items-center gap-2 flex-wrap mb-6">
            <User2 className="w-6 h-6 text-gray-800" />
            <h3 className="text-2xl font-bold text-gray-800">{user?.name}</h3>
          </div>
          <div className="grid grid-cols-2 p-3">
            <p className="text-gray-600 text-xl mb-3"><b>Emp ID :</b> {user?.id}</p>
            <p className="text-gray-600 text-xl mb-3"><b>Starting day :</b> {user?.joiningDate}</p>
            <p className="text-gray-600 text-xl mb-3"><b>Designation :</b> {user?.designation}</p>
            <p className="text-gray-600 text-xl mb-3"><b>Department :</b> {user?.department}</p>
          </div>
        </div>
    </div>
    </div>
  );
};

export default Card;
