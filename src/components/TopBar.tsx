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
      <div className="flex-grow mr-4 rounded-md">
        <div className="bg-[#010F18] p-2 rounded-md flex justify-center ">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-2/4 bg-[#ffffff2e] text-white p-2 rounded-md h-8" 
          />
        </div>
      </div>

      <div className="bg-[#010F18] p-2 rounded-md flex justify-around items-center w-1/5">
        <div className="text-white cursor-pointer relative">
          <Bell className='h-8 w-auto' />
          <span className="absolute bottom-4 left-4 bg-[#D40A0A] rounded-full h-5 w-5" />
        </div>
        <div className="text-white cursor-pointer relative">
          <MessageCircleMore className='h-8 w-auto' />
          <span className="absolute bottom-4 left-4 bg-[#D40A0A] rounded-full h-5 w-5" />
        </div>
        <div className="text-white cursor-pointer relative" onClick={navigateToProfile}>
          <CircleUserRound className='h-8 w-auto' />
        </div>
      </div>
    </div>
  );
};

export default TopBar;