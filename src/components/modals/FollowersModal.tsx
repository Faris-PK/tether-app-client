import React, { useEffect, useState } from 'react';
import { X, Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addFollowedUser, removeFollowedUser } from '../../redux/slices/userSlice';
import { connectionApi } from '../../api/networkApi';
import { Button } from '@/components/ui/button';
import { useTheme } from '../../contexts/ThemeContext';
import { api } from '@/api/userApi';

interface User {
  _id: string;
  username: string;
  profile_picture: string;
  bio?: string;
  isFollowing: boolean;
}

interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: 'Followers' | 'Following';
  currentUserId: string;
}

const FollowersModal: React.FC<FollowersModalProps> = ({ isOpen, onClose, title, currentUserId }) => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await (title === 'Followers' ? api.getFollowers(currentUserId) : api.getFollowing(currentUserId));
        console.log('response : ', response.data);

        const usersWithFollowStatus = response.data.map((user: any) => ({
          _id: user._id,
          username: user.username,
          profile_picture: user.profile_picture,
          bio: user.bio,
          isFollowing: user.isFollowing || title === 'Following'
        }));

        setUsers(usersWithFollowStatus);
        setFilteredUsers(usersWithFollowStatus);
      } catch (err) {
        setError('Failed to load users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchUsers();
      setSearchQuery(''); // Reset search when modal opens
    }
  }, [isOpen, title]);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.bio && user.bio.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleFollowToggle = async (userId: string, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await connectionApi.unfollowUser(userId);
        dispatch(removeFollowedUser(userId));
      } else {
        await connectionApi.followUser(userId);
        dispatch(addFollowedUser(userId));
      }

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId
            ? { ...user, isFollowing: !user.isFollowing }
            : user
        )
      );
    } catch (err) {
      setError('Failed to update follow status');
      console.error('Error updating follow status:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg w-full max-w-md shadow-lg transition-colors duration-200`}>
        {/* Header */}
        <div className={`border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} p-4 flex items-center justify-between`}>
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-full transition-colors duration-200 ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Input */}
        <div className={`p-4 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <Search className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-transparent border-none focus:outline-none ${
                isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className={`p-4 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Loading...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              {error}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className={`p-4 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {searchQuery ? 'No users found' : `No ${title.toLowerCase()} yet`}
            </div>
          ) : (
            <div className="p-2">
              { filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className={`flex items-center justify-between p-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'hover:bg-gray-700' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.profile_picture || '/default-avatar.jpg'}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {user.username}
                      </h3>
                      {user.bio && (
                        <p className={`text-sm line-clamp-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {user.bio}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {user._id !== currentUserId && (
                    <button
                      onClick={() => handleFollowToggle(user._id, user.isFollowing)}
                      className={`px-4 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                        user.isFollowing
                          ? isDarkMode
                            ? 'border border-gray-600 hover:bg-gray-700 text-gray-300'
                            : 'border border-gray-300 hover:bg-gray-100 text-gray-700'
                          : 'bg-[#1D9BF0] text-white hover:bg-[#1aa3d4]'
                      }`}
                    >
                      {user.isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersModal;