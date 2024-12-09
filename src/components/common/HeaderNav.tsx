import React, { useEffect, useState } from 'react';
import { Bell, MessageCircle, Sun, Moon, ChevronDown, LogOut, PenSquare, Search } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RootState } from '@/redux/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '@/api/userApi';
import { clearUser } from '@/redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import CreatePostModal from '../modals/PostCreationModal';
import AudienceSelectionModal from '../modals/AudienceSelectionModal';
import LogoutConfirmation from '../modals/LogoutConfirmation';
import NotificationsSheet from './NotificationsSheet';
import Title from './Title';
import SearchBar from './SearchBar';



// HeaderNav Component
interface HeaderNavProps {
  onPostCreated: () => void;
}

const HeaderNav: React.FC<HeaderNavProps> = ({ onPostCreated }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [isAudienceModalOpen, setAudienceModalOpen] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState('public');
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);


  const handleAudienceSelect = (audience: string) => {
    setSelectedAudience(audience);
    setAudienceModalOpen(false);
  };

  const handleLogout = async () => {
    setIsLogoutConfirmationOpen(true);
  };

  const handleLogoutConfirmation = async () => {
    try {
      await api.logout();
      dispatch(clearUser());
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setIsLogoutConfirmationOpen(false);
    }
  };

  const navigateToProfile = async () => {
    try {
      navigate('/user/profile');
    } catch (error) {
      // Handle error
    }
  };

  const updateNotificationCount = (count: number) => {
    setNotificationCount(count);
  };

  return (
    <div className="flex items-center justify-between w-full">
      {/* Title Component */}
      <Title />

      {/* SearchBar Component */}
      <SearchBar />

      {/* HeaderNav Controls */}
      <div className="flex items-center space-x-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setPostModalOpen(true)}
                className={`flex items-center space-x-2 rounded-full px-4 py-2 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white' 
                    : 'bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white'
                }`}
              >
                <PenSquare className="h-5 w-5" />
                <span className="font-semibold">Create Post</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create a new post</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full w-10 h-10 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 cursor-pointer ${
                  isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-yellow-50 hover:bg-yellow-100'
                }`}
                onClick={toggleDarkMode}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-yellow-500" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <NotificationsSheet onNotificationCountUpdate={updateNotificationCount} />


        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`relative rounded-full w-10 h-10 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 cursor-pointer ${
                  isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white'
                }`}
                onClick={() => navigate('/user/messages')}
              >
                <MessageCircle className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-[#1D9BF0] hover:bg-[#1D9BF0] text-white">
                  2
                </Badge>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Messages</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className={`flex items-center space-x-2 rounded-full h-10 px-3 ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-purple-50 hover:bg-purple-100 shadow-black drop-shadow-md'
              }`}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profile_picture} alt="Profile" />
                <AvatarFallback>{user?.username}</AvatarFallback>
              </Avatar>
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {user?.username}
              </span>
              <ChevronDown className={`h-4 w-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={`w-48 ${
            isDarkMode ? 'bg-gray-800 text-gray-200' : ''
          }`}>
            <DropdownMenuItem
              onClick={navigateToProfile} 
              className={`cursor-pointer font-semibold ${
                isDarkMode ? 'hover:bg-gray-700' : ''
              }`}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className={`cursor-pointer font-semibold ${
              isDarkMode ? 'hover:bg-gray-700' : ''
            }`}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600 font-semibold hover:bg-gray-700">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <CreatePostModal
          isOpen={isPostModalOpen}
          onClose={() => setPostModalOpen(false)}
          onOpenAudienceModal={() => setAudienceModalOpen(true)}
          selectedAudience={selectedAudience}
          fetchPosts={onPostCreated}
        />

        <AudienceSelectionModal
          isOpen={isAudienceModalOpen}
          onClose={() => setAudienceModalOpen(false)}
          onSelect={handleAudienceSelect}
        />

        <LogoutConfirmation
          isOpen={isLogoutConfirmationOpen}
          onClose={() => setIsLogoutConfirmationOpen(false)}
          onLogout={handleLogoutConfirmation}
        />
      </div>
    </div>
  );
};

export default HeaderNav;