import React, { useEffect, useState } from 'react';
import { PlusCircle, Camera, Video, Eye } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import CreateStoryModal from '@/components/modals/CreateStoryModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { Story } from '@/types/IStory';
import { storyApi } from '@/api/storyApi';
import StoryViewer from '@/components/home/StoryViewer';

const StoryArea:React.FC = () => {
  const { isDarkMode } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.user.user);

  // Group stories by user, keeping only the first story for each user
  const userStoriesMap = stories.reduce((acc, story) => {
    const userId = story.userId._id;
    if (!acc[userId]) {
      acc[userId] = story;
    }
    return acc;
  }, {} as Record<string, Story>);

  // Convert the map to an array of unique user stories
  const filteredUserStories = Object.values(userStoriesMap)
    .filter(story => story.userId._id !== user?._id);

  const userOwnStories = stories.filter(story => story.userId._id === user?._id);

  const handleCreateStory = () => {
    setIsModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleStartLive = () => {
    console.log('Start Live');
    setIsDropdownOpen(false);
  };

  const handleShowOwnStories = () => {
    if (userOwnStories.length > 0) {
      const ownStoriesIndex = stories.findIndex(story => story._id === userOwnStories[0]._id);
      setSelectedStoryIndex(ownStoriesIndex);
    }
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const storiesData = await storyApi.getStories();
      setStories(storiesData);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = (index: number) => {
    const actualStory = filteredUserStories[index];
    const originalIndex = stories.findIndex(story => story._id === actualStory._id);
    setSelectedStoryIndex(originalIndex);
  };

  const handleCloseStory = () => {
    setSelectedStoryIndex(-1);
  };

  const handleStoryView = async (storyId: string) => {
    try {
      const storyToView = stories.find(story => story._id === storyId);
      if (!storyToView || storyToView.userId._id === user?._id) return;

      const response = await storyApi.viewStory(storyId);
      
      setStories(prevStories => {
        return prevStories.map(story => {
          if (story._id === storyId) {
            return {
              ...story,
              viewedUsers: response.data.viewedUsers || story.viewedUsers
            };
          }
          return story;
        });
      });
    } catch (error) {
      console.error('Error marking story as viewed:', error);
    }
  };

  const hasViewedAllStories = (stories: Story[]) => {
    return stories.every(story => 
      story.viewedUsers?.some(viewedUser => viewedUser._id === user?._id) || false
    );
  };

  const handleDeleteStory = async (storyId: string) => {
    try {
      await storyApi.deleteStory(storyId);
      setStories(prevStories => prevStories.filter(story => story._id !== storyId));
      setSelectedStoryIndex(-1); // Close the story viewer if open
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  };
  
  const handleStoryCreated = async () => {
    await fetchStories();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <div className="flex flex-col items-center flex-shrink-0 cursor-pointer">
                  <div className="relative">
                    <div
                      className={cn(
                        "p-[2px] rounded-full",
                        userOwnStories.length > 0 
                          ? (hasViewedAllStories(userOwnStories) 
                              ? "bg-gray-400" 
                              : "bg-gradient-to-r from-[#1D9BF0] to-[#1D9BF0]")
                          : ""
                      )}
                    >
                      <img
                        src={user?.profile_picture}
                        alt="Your Story"
                        className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-800"
                      />
                    </div>
                    {userOwnStories.length === 0 && (
                      <PlusCircle
                        className="absolute bottom-0 right-0 text-[#1D9BF0] bg-white rounded-full w-5 h-5"
                      />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs mt-1 truncate w-16 text-center font-medium",
                      isDarkMode ? "text-[#838080]" : "text-[#838080]"
                    )}
                  >
                    Your Story
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className={cn(
                  "w-56 p-2",
                  isDarkMode
                    ? "bg-gray-900 border-gray-700 text-gray-200 font-medium"
                    : "bg-white border-gray-300 text-gray-800 font-medium"
                )}
              >
                <DropdownMenuItem
                  onClick={handleCreateStory}
                  className={cn(
                    "flex items-center cursor-pointer py-2 px-3 rounded-md",
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  )}
                >
                  <Camera className="mr-3 h-5 w-5" />
                  Create Story
                </DropdownMenuItem>

                {userOwnStories.length > 0 && (
                  <DropdownMenuItem
                    onClick={handleShowOwnStories}
                    className={cn(
                      "flex items-center cursor-pointer py-2 px-3 rounded-md",
                      isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    )}
                  >
                    <Eye className="mr-3 h-5 w-5" />
                    View Your Stories
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={handleStartLive}
                  className={cn(
                    "flex items-center cursor-pointer py-2 px-3 rounded-md",
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  )}
                >
                  <Video className="mr-3 h-5 w-5" />
                  Start Live
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Other Stories */}
            {filteredUserStories.map((story, index) => (
              <div
                key={story._id}
                className="flex flex-col items-center flex-shrink-0 cursor-pointer"
                onClick={() => handleStoryClick(index)}
              >
                <div className={cn(
                  "p-[2px] rounded-full",
                  hasViewedAllStories([story])
                    ? "bg-gray-400" 
                    : "bg-gradient-to-r from-[#1D9BF0] to-[#1D9BF0]"
                )}>
                  <img
                    src={story.userId.profile_picture}
                    alt={`${story.userId.username}'s Story`}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-800"
                  />
                </div>
                <span className="text-xs mt-1 truncate w-16 text-center font-medium text-gray-400 dark:text-gray-400">
                  {story.userId.username}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <CreateStoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onStoryCreated={handleStoryCreated}/>
      {selectedStoryIndex >= 0 && (
        <StoryViewer
          stories={stories}
          initialStoryIndex={selectedStoryIndex}
          onClose={handleCloseStory}
          onView={handleStoryView}
          onDelete={handleDeleteStory}
          
        />
      )}
    </div>
  );
};

export default StoryArea;