import React from 'react';
import { PlusCircle } from 'lucide-react';
import ProfilePicture from '../assets/profile-picture.jpg';

const StoryArea: React.FC = () => {
  const otherUsers = [
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' },
    { id: 3, name: 'User 3' },
    { id: 4, name: 'User 4' },
    { id: 5, name: 'User 5' },
    { id: 6, name: 'User 6' },
    { id: 7, name: 'User 7' },
    { id: 8, name: 'User 8' },
  ];

  return (
    <div className="bg-[#010F18] p-4 rounded-md mb-4 ">
      <div className="flex space-x-4 overflow-x-auto pb-3 ml-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img src={ProfilePicture} alt="Your Story" className="w-20 h-20 rounded-full border-2 border-gray-300" />
            <PlusCircle className="absolute bottom-0 right-0 text-blue-500 bg-white rounded-full" />
          </div>
          <span className="text-white text-xs mt-1">Your Story</span>
        </div>

        {otherUsers.map((user) => (
          <div key={user.id} className="flex flex-col items-center">
            <img 
              src={ProfilePicture} 
              alt={`${user.name}'s Story`}
              className="w-20 h-20 rounded-full border-2 border-[#1D9BF0] border-[3.2px]"
            />
            <span className="text-white text-xs mt-1">{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryArea