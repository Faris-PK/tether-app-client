import React from 'react';
import { PlusCircle } from 'lucide-react';
import ProfilePicture from '../assets/profile-picture.jpg';
import { RootState } from '@/redux/store/store';
import { useSelector } from 'react-redux';

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
    { id: 9, name: 'User 9' },
    { id: 10, name: 'User 10' },
    { id: 11, name: 'User 11' },
  ];
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <div className="bg-[#010F18] p-2 sm:p-4 rounded-xl mb-4 shadow-[4px_4px_10px_rgba(0,0,0,0.5)]">
      <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-3 ml-2 sm:ml-6"
      style={{
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // Internet Explorer and Edge
        overflow: "-moz-scrollbars-none", // Older versions of Firefox
      }}
      >
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="relative">
            <img src={user.profile_picture} alt="Your Story" className="w-12 h-12 sm:w-14 sm:h-14 rounded-full" />
            <PlusCircle className="absolute bottom-0 right-0 text-blue-500 bg-white rounded-full w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-white text-xs mt-1 truncate w-14 sm:w-16 text-center">Your Story</span>
        </div>

        {otherUsers.map((user) => (
          <div key={user.id} className="flex flex-col items-center flex-shrink-0">
            <img 
              src={ProfilePicture} 
              alt={`${user.name}'s Story`}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#1D9BF0] border-[3.2px]"
            />
            <span className="text-white text-xs mt-1 truncate w-14 sm:w-16 text-center">{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryArea;