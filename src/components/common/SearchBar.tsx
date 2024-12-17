import { Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { api } from '../../api/userApi';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/redux/store/store';
import { useSelector } from 'react-redux';

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
 /// const [totalUsers, setTotalUsers] = useState(0);
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
      
     // setTotalUsers(response.data.totalUsers);
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

  // Handle click outside to close dropdown
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
      {/* Search Input */}
      <div 
        className={`
          h-10 
          flex items-center 
          px-3 
          rounded-3xl 
          shadow-lg 
          transition-colors 
          duration-200 
          ${isDarkMode 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
          }
        `}
      >
        <Search 
          className={`
            ${isDarkMode 
              ? 'text-gray-400' 
              : 'text-gray-500'
            } 
            w-5 h-5
          `} 
        />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search users"
          className={`
            ml-2 
            w-full 
            bg-transparent 
            outline-none 
            ${isDarkMode 
              ? 'text-gray-200 placeholder-gray-500' 
              : 'text-gray-700 placeholder-gray-500'
            }
          `}
        />
      </div>

      {/* Dropdown for search results */}
      {isDropdownVisible && (
        <div
          id="search-dropdown"
          className={`
            absolute 
            w-full 
            mt-1 
            rounded-2xl 
            shadow-lg 
            max-h-96 
            overflow-y-auto 
            z-50 
            ${isDarkMode 
              ? 'bg-gray-900 border border-gray-700' 
              : 'bg-white border border-gray-200'
            }
          `}
        >
          {isLoading && currentPage === 1 ? (
            <div 
              className={`
                p-3 
                text-center 
                ${isDarkMode 
                  ? 'text-gray-400' 
                  : 'text-gray-600'
                }
              `}
            >
              Searching...
            </div>
          ) : users.length > 0 ? (
            <>
              {users.map(user => (
                <div
                  key={user._id}
                  className={`
                    p-3 
                    flex 
                    items-center 
                    gap-2 
                    cursor-pointer 
                    ${isDarkMode 
                      ? 'hover:bg-gray-700 text-gray-200' 
                      : 'hover:bg-gray-100 text-gray-800'
                    }
                  `}
                  onClick={() => {
                    handleNavigateToProfile(user._id);
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
                    <div 
                      className={`
                        w-8 
                        h-8 
                        rounded-full 
                        flex 
                        items-center 
                        justify-center 
                        ${isDarkMode 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-200 text-gray-700'
                        }
                      `}
                    >
                      {user.username[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div 
                      className={`
                        font-medium 
                        ${isDarkMode 
                          ? 'text-gray-200' 
                          : 'text-gray-800'
                        }
                      `}
                    >
                      {user.username}
                    </div>
                    <div 
                      className={`
                        text-sm 
                        ${isDarkMode 
                          ? 'text-gray-400' 
                          : 'text-gray-500'
                        }
                      `}
                    >
                      {user.email}
                    </div>
                  </div>
                </div>
              ))}

              {/* Show More button */}
              {hasMore && (
                <button
                  onClick={handleShowMore}
                  className={`
                    w-full 
                    p-3 
                    text-center 
                    transition-colors 
                    duration-200 
                    ${isDarkMode 
                      ? 'text-blue-400 hover:bg-gray-700' 
                      : 'text-blue-600 hover:bg-gray-100'
                    }
                  `}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : `Show More`}
                </button>
              )}
            </>
          ) : (
            <div 
              className={`
                p-3 
                text-center 
                ${isDarkMode 
                  ? 'text-gray-400' 
                  : 'text-gray-600'
                }
              `}
            >
              No users found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;