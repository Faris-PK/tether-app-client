import { useState, useEffect, useRef } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX, Music, MoreVertical, Trash2 } from 'lucide-react';
import { Story } from '@/types/IStory';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import UsersListModal from "@/components/modals/UserListModal";
import { storyApi } from '@/api/storyApi';
import Fab from '@mui/material/Fab';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';

interface StoryViewerProps {
  stories: Story[];
  initialStoryIndex: number;
  onClose: () => void;
  onView: (storyId: string) => void;
  onDelete: (storyId: string) => void;

}

const StoryViewer = ({ stories, initialStoryIndex, onClose, onView, onDelete }: StoryViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [userListType, setUserListType] = useState<'views' | 'likes'>('views');
  const [isMounted, setIsMounted] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);


  const audioRef = useRef<HTMLAudioElement | null>(null);
  const user = useSelector((state: RootState) => state.user.user);

  const currentStory = stories[currentIndex];

  // Function to format the timestamp
  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const storyDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - storyDate.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${diffInDays}d`;
  };

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!currentStory) return;

    onView(currentStory._id);

    if (currentStory.musicPreviewUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(currentStory.musicPreviewUrl);
        audioRef.current.loop = true;
      } else {
        audioRef.current.src = currentStory.musicPreviewUrl;
      }
      if (!isMuted) audioRef.current.play().catch(console.error);
    }

    setProgress(0);
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + (100 / 15000) * 50;
      });
    }, 50);

    return () => {
      clearInterval(timer);
      if (audioRef.current) audioRef.current.pause();
    };
  }, [currentIndex]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) audioRef.current.muted = !isMuted;
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
    setProgress(0);
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handleLikeToggle = async () => {
    try {
      const story = stories[currentIndex];
      await storyApi.toggleLike(story._id);

      const updatedStories = [...stories];
      const storyIndex = updatedStories.findIndex((s) => s._id === story._id);
      if (storyIndex !== -1) {
        const hasLiked = story.likedUsers.some((u) => u._id === user?._id);
        if (hasLiked) {
          updatedStories[storyIndex].likedUsers = story.likedUsers.filter((u) => u._id !== user?._id);
        } else {
          updatedStories[storyIndex].likedUsers.push({
            _id: user?._id ?? '',
            username: user?.username ?? '',
            profile_picture: user?.profile_picture ?? '',
          });
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const showUsers = (type: 'views' | 'likes') => {
    setUserListType(type);
    setShowUserList(true);
  };
  const handleDeleteClick = () => {
    setShowDeleteAlert(true);
  };

  const handleDeleteConfirm = async () => {
    await onDelete(currentStory._id);
    setShowDeleteAlert(false);
    onClose();
  };


  if (!currentStory) return null;

  const isLiked = currentStory.likedUsers?.some((u) => u._id === user?._id);

  return (
    <Dialog open={isMounted} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
        <div className="relative w-full max-w-2xl mx-auto">
          <div className="absolute top-0 left-0 w-full h-1 flex">
            <div className="h-full bg-blue-500 transition-all duration-100" style={{ width: `${progress}%` }} />
          </div>

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10">
            <div className="flex flex-col">
              <div className="flex items-center space-x-3">
                <img
                  src={currentStory.userId.profile_picture}
                  alt={currentStory.userId.username}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{currentStory.userId.username}</span>
                    <span className="text-sm text-gray-300">• {formatTimeAgo(currentStory.createdAt)}</span>
                  </div>
                  {currentStory.musicName && (
                    <div className="flex items-center space-x-2 mt-1 text-sm text-gray-300">
                      <div className="flex items-center bg-black bg-opacity-50 rounded-full px-3 py-1">
                        <Music className="w-3 h-3 mr-1" />
                        <span className="truncate max-w-[200px]">{currentStory.musicName}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {currentStory.musicPreviewUrl && (
                <button onClick={toggleMute} className="p-1 hover:bg-gray-800/50 rounded-full transition-colors">
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
              )}
              {user?._id === currentStory.userId._id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 hover:bg-gray-800/50 rounded-full transition-colors">
                      <MoreVertical className="w-6 h-6" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
                    <DropdownMenuItem 
                      onClick={handleDeleteClick}
                      className="flex items-center px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Story
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <button onClick={onClose} className="p-1 hover:bg-gray-800/50 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="relative w-full h-[80vh]">
            <img 
              src={currentStory.mediaUrl} 
              alt="Story" 
              className="w-full h-full object-contain mt-20"
              style={{ maxWidth: '100%', maxHeight: '80vh' }} 
            />

            {user?._id === currentStory.userId._id ? (
              <div className="absolute bottom-4 left-4 flex space-x-4">
                <button
                  onClick={() => showUsers('views')}
                  className="text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm"
                >
                  {currentStory.viewedUsers.length} views
                </button>
                <button
                  onClick={() => showUsers('likes')}
                  className="text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm"
                >
                  {currentStory.likedUsers.length} likes
                </button>
              </div>
            ) : (
              <div className="absolute bottom-6 right-6">
                <Fab
                  color={isLiked ? "secondary" : "default"}
                  onClick={handleLikeToggle}
                  size="small"
                  sx={{
                    backgroundColor: isLiked ? 'red' : 'white',
                    '&:hover': {
                      backgroundColor: isLiked ? 'red' : '#f5f5f5',
                    }
                  }}
                >
                  <FavoriteIcon />
                </Fab>
              </div>
            )}
          </div>

          <button onClick={handlePrevious} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={handleNext} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white">
            <ChevronRight className="w-6 h-6" />
          </button>

          {showUserList && (
            <UsersListModal
              isOpen={showUserList}
              onClose={() => setShowUserList(false)}
              users={userListType === 'views' ? currentStory.viewedUsers : currentStory.likedUsers}
              title={userListType === 'views' ? 'Views' : 'Likes'}
            />
          )}
        </div>
      </div>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="bg-gray-900 text-white border border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold">Delete Story</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete this story? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel 
              className="bg-gray-800 text-white hover:bg-gray-700 border-gray-600"
              onClick={() => setShowDeleteAlert(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white border-none"
              onClick={handleDeleteConfirm}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>




  );
};

export default StoryViewer;