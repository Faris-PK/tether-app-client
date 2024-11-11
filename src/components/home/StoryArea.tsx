import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import profile_picture from '../../assets/Myphoto.jpg';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from "@/lib/utils";
import CreateStoryModal from '../modals/CreateStoryModal';
import StoryViewModal from '../modals/StoryViewModal';

const StoryArea = () => {
  const { isDarkMode } = useTheme();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  const users = [
    { 
      id: 1, 
      name: 'John Doe',
      stories: [
        {
          id: '1',
          username: 'John Doe',
          media: profile_picture,
          timestamp: new Date().toISOString(),
          likes: 42,
          comments: [],
          duration: 5000 // 5 seconds
        }
      ]
    },
    { 
      id: 2, 
      name: 'fouzan',
      stories: [
        {
          id: '2',
          username: 'fouzan',
          media: profile_picture,
          timestamp: new Date().toISOString(),
          likes: 42,
          comments: [],
          duration: 5000 // 5 seconds
        }
      ]
    },
    
  ];

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
    setIsViewModalOpen(true);
  };

  // Flatten all stories for the StoryViewModal
  const allStories = users.flatMap(user => user.stories);

  return (
    <div className="flex justify-center px-4 sm:px-6">
      <div className="w-full max-w-2xl">
        <div className={cn(
          "rounded-xl p-2 mb-4 shadow-black drop-shadow-md",
          isDarkMode ? "bg-gray-800" : "bg-white"
        )}>
          <div 
            className="flex space-x-4 overflow-x-auto pb-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              overflow: "-moz-scrollbars-none",
            }}
          >
            {/* Your Story */}
            <div 
              className="flex flex-col items-center flex-shrink-0 cursor-pointer"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <div className="relative">
                <img 
                  src={profile_picture} 
                  alt="Your Story" 
                  className="w-14 h-14 rounded-full object-cover"
                />
                <PlusCircle 
                  className="absolute bottom-0 right-0 text-[#1D9BF0] bg-white rounded-full w-5 h-5" 
                />
              </div>
              <span className={cn(
                "text-xs mt-1 truncate w-16 text-center font-medium",
                isDarkMode ? "text-[#838080]" : "text-[#838080]"
              )}>
                Your Story
              </span>
            </div>

            {/* Other Stories */}
            {users.map((user, index) => (
              <div 
                key={user.id} 
                className="flex flex-col items-center flex-shrink-0 cursor-pointer"
                onClick={() => handleStoryClick(index)}
              >
                <div className="p-[2px] rounded-full bg-gradient-to-r from-[#1D9BF0] to-[#1D9BF0]">
                  <img 
                    src={profile_picture}
                    alt={`${user.name}'s Story`}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-800"
                  />
                </div>
                <span className={cn(
                  "text-xs mt-1 truncate w-16 text-center font-medium",
                  isDarkMode ? "text-gray-400" : "text-[#838080]"
                )}>
                  {user.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <CreateStoryModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      
      <StoryViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        stories={allStories}
        initialStoryIndex={selectedStoryIndex}
      />
    </div>
  );
};

export default StoryArea;