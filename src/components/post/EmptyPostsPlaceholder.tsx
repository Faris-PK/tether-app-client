import React from 'react';
import { Camera } from 'lucide-react';

interface EmptyPostsPlaceholderProps {
  isDarkMode: boolean;
}

const EmptyPostsPlaceholder: React.FC<EmptyPostsPlaceholderProps> = ({ isDarkMode }) => {
  return (
    <div className={`flex flex-col items-center justify-center h-96 p-6 rounded-md shadow-black drop-shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 mb-4">
        <Camera size={32} className="text-gray-100" />
      </div>
      <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        No Posts Available
      </h2>
      <p className="text-gray-400">There are no posts to display right now. Check back later or follow more users!</p>
    </div>
  );
};

export default EmptyPostsPlaceholder;