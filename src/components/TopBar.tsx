import React from 'react';
import { Bell, MessageCircleMore, CircleUserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/userApi';
const TopBar: React.FC = () => {
  const navigate = useNavigate();

  const navigateToProfile = async () => {
    try {
      navigate('/user/profile');
      const response = await api.getUserProfile();
      console.log('Profile details from frontend', response);
      
    } catch (error) {
      
    }
  };

  return (
    <div className="flex items-center justify-between p-3 ">
      <div className="flex-grow mr-4 rounded-md ">
        <div className="bg-[#010F18] p-2 rounded-xl flex justify-center shadow-[4px_4px_10px_rgba(0,0,0,0.5)]">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-2/4 bg-[#ffffff2e] text-white p-2 rounded-md h-8" 
          />
        </div>
      </div>

      <div className="bg-[#010F18] p-2 rounded-xl flex justify-around items-center w-1/5 h-12 shadow-[4px_4px_10px_rgba(0,0,0,0.5)]">
        <div className="text-white cursor-pointer relative transition-transform duration-300 ease-in-out hover:scale-110 hover:drop-shadow-lg">
          <Bell className='w-auto' />
          <span className="absolute bottom-4 left-4 bg-[#D40A0A] rounded-full h-3 w-3" />
        </div>
        <div className="text-white cursor-pointer relative transition-transform duration-300 ease-in-out hover:scale-110 hover:drop-shadow-lg">
          <MessageCircleMore className='w-auto' />
          <span className="absolute bottom-4 left-4 bg-[#D40A0A] rounded-full h-3 w-3" />
        </div>
        <div className="text-white cursor-pointer relative transition-transform duration-300 ease-in-out hover:scale-110 hover:drop-shadow-lg" onClick={navigateToProfile}>
          <CircleUserRound className='w-auto' />
        </div>
      </div>
    </div>
  );
};

export default TopBar;