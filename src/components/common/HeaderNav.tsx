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


// Title Component
const Title = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate('/home')} 
      className={`w-1/6 h-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} flex items-center justify-center overflow-hidden rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 cursor-pointer`}
    >
      <div className="flex items-center space-x-2 px-3 group">
        <div className="w-6 h-6 bg-[#1D9BF0] rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-12">
          <span className="text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">T</span>
        </div>
        <span className="text-[#1D9BF0] font-bold text-md tracking-wider group-hover:tracking-widest transition-all duration-300">Tether.</span>
      </div>
    </div>
  );
};

// SearchBar Component
interface User {
  _id: string;
  username: string;
  email: string;
  profile_picture?: string;
}

const SearchBar = () => {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const navigate = useNavigate();
  const currentUserId = useSelector((state: RootState) => state.user.user?._id);

  useEffect(() => {
    setCurrentPage(1);
    fetchUsers(1);
  }, [searchTerm]);

  const fetchUsers = async (page: number) => {
    if (searchTerm.trim().length === 0) {
      setUsers([]);
      setIsDropdownVisible(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.searchUsers(searchTerm, page, 4);
      
      if (page === 1) {
        setUsers(response.data.users);
      } else {
        setUsers(prevUsers => [...prevUsers, ...response.data.users]);
      }
      
      setTotalUsers(response.data.totalUsers);
      setHasMore(response.data.totalUsers > page * 5);
      setIsDropdownVisible(true);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleShowMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchUsers(nextPage);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('search-dropdown');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleNavigateToProfile = (userId: string) => {
    if (currentUserId === userId) {
      navigate('/user/profile');
    } else {
      navigate(`/user/userProfile/${userId}`);
    }
  };

  return (
    <div className="relative w-1/4">
      <div className={`h-10 ${isDarkMode ? 'bg-gray-600' : 'bg-white'} flex items-center px-3 rounded-md shadow-lg transition-colors duration-200`}>
        <Search className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} w-5 h-5`} />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search users"
          className={`ml-2 w-full bg-transparent outline-none ${
            isDarkMode ? 'text-gray-200 placeholder-gray-400' : 'text-gray-700 placeholder-gray-500'
          }`}
        />
      </div>

      {isDropdownVisible && (
        <div 
          id="search-dropdown"
          className={`absolute w-full mt-1 rounded-md shadow-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-white'
          } max-h-96 overflow-y-auto z-50`}
        >
          {isLoading && currentPage === 1 ? (
            <div className={`p-3 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Searching...
            </div>
          ) : users.length > 0 ? (
            <>
              {users.map(user => (
                <div
                  key={user._id}
                  className={`p-3 flex items-center gap-2 cursor-pointer ${
                    isDarkMode 
                      ? 'hover:bg-gray-600 text-gray-200' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => {
                    handleNavigateToProfile(user._id)
                    setIsDropdownVisible(false);
                  }}
                >
                  {user.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                    }`}>
                      {user.username[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{user.username}</div>
                    <div className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {user.email}
                    </div>
                  </div>
                </div>
              ))}
              
              {hasMore && (
                <button
                  onClick={handleShowMore}
                  className={`w-full p-3 text-center ${
                    isDarkMode 
                      ? 'text-blue-400 hover:bg-gray-600' 
                      : 'text-blue-500 hover:bg-gray-100'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Show More'}
                </button>
              )}
            </>
          ) : (
            <div className={`p-3 text-center ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              No users found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// HeaderNav Component
interface HeaderNavProps {
  onPostCreated: () => void;
}

const HeaderNav: React.FC<HeaderNavProps> = ({ onPostCreated }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const user = useSelector((state: RootState) => state?.user?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [isAudienceModalOpen, setAudienceModalOpen] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState('public');
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState(false);

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

        <NotificationsSheet />


        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`relative rounded-full w-10 h-10 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 cursor-pointer ${
                  isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white'
                }`}
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