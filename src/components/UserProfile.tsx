import React, { useState } from 'react';
import { UserPlus, Mail, Cake, MapPin, Calendar, Link as LinkIcon, FileText, ShoppingBag, Camera } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import moment from 'moment';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Fab from '@mui/material/Fab';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import { useTheme } from '../contexts/ThemeContext';



interface Post {
  _id: string;
  userId: {
    username: string;
    profile_picture: string;
  };
  location: string;
  createdAt: string;
  caption: string;
  mediaUrl: string;
  likes: string[];
  comments?: number;
  postType: string;
  isBlocked: boolean;
}

const UserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'marketplace'>('posts');
  const [postType, setPostType] = useState<string>('all');
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const { isDarkMode } = useTheme();

  const handlePostTypeChange = (event: SelectChangeEvent) => {
    setPostType(event.target.value as string);
  };

  const PostCard: React.FC<{ post: Post }> = ({ post }) => {
    if (post.isBlocked) {
      return (
        <div className={`flex flex-col items-center justify-center h-32 ${isDarkMode ? 'bg-[#010F18]' : 'bg-gray-100'} p-6 rounded-md mb-4`}>
          <div className="flex items-center justify-center mb-2">
            <FileText size={24} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mr-2`} />
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>This post is not available.</p>
          </div>
        </div>
      );
    }

    return (
      <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-xl mb-4 shadow-md transition-colors duration-200 `}>
        <div className="flex justify-between items-start mb-4" >
          <div className="flex items-center" >
            <img
              src={post.userId.profile_picture}
              alt={post.userId.username}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>
                {post.userId.username}
              </h3>
              <div className="flex items-center text-gray-400 text-sm">
                {post.location && <MapPin size={14} className="mr-1" />}
                <span>{post.location}</span>
              </div>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }).replace('about ', '')}
              </span>
            </div>
          </div>
        </div>

        <p className={`${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>{post.caption}</p>
        
        {post.postType !== 'note' && (
          <img 
            src={post.mediaUrl} 
            alt="Post content" 
            className="w-full max-h-[400px] object-cover rounded-md mb-4"
          />
        )}
        
        <div className="flex justify-between text-gray-400 mb-4">
          <div className="flex items-center">
            <span>{post.likes?.length || 0} likes</span>
          </div>
          <span>{post.comments || 0} comments</span>
        </div>

        <div className={`flex justify-between ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-t pt-4`}>
          <Fab
            aria-label="like"
            size="small"
            sx={{ transform: 'scale(0.7)' }}
          >
            <FavoriteIcon />
          </Fab>
          <Fab 
            aria-label="comment" 
            size="small" 
            sx={{ transform: 'scale(0.7)' }}
          >
            <CommentIcon />
          </Fab>
          <Fab 
            aria-label="share" 
            size="small" 
            sx={{ transform: 'scale(0.7)' }}
          >
            <ShareIcon />
          </Fab>
        </div>
      </div>
    );
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-950' : 'bg-gray-100'} flex w-4/5 max-h-full mb-64 rounded-md shadow-md transition-colors duration-200`}>
      <div className="flex-grow flex flex-col overflow-hidden">
        <div className="flex-grow overflow-y-auto p-4 rounded-md">
          <div className="relative mb-20">
            <img src="/default-cover.jpg" alt="Cover" className="w-full h-28 object-cover rounded-lg border-2" />
            <img src="/default-avatar.jpg" alt="Profile" className="absolute left-8 -bottom-16 w-32 h-32 rounded-full border-2 border-[#b2b4b4]" />
          </div>
          
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl mt-3 rounded-lg overflow-hidden transition-colors duration-200`}>
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Username
                  </h2>
                  <div className={`flex space-x-5 mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                    <span className="flex flex-col items-center">
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        0
                      </span>
                      <span>posts</span>
                    </span>
                    <span 
                      className={`flex flex-col items-center cursor-pointer hover:text-blue-400 transition-colors duration-200`}
                      onClick={() => setShowFollowersModal(true)}
                    >
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        0
                      </span>
                      <span>followers</span>
                    </span>
                    <span 
                      className={`flex flex-col items-center cursor-pointer hover:text-blue-400 transition-colors duration-200`}
                      onClick={() => setShowFollowingModal(true)}
                    >
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        0
                      </span>
                      <span>following</span>
                    </span>
                  </div>
                </div>
                
                <button 
                  className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm flex items-center transition-colors duration-200`}
                >
                  <UserPlus size={16} className="mr-2" />
                  Follow
                </button>
              </div>

              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} my-6`}>Bio</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Mail size={16} className="mr-2 text-blue-400" />
                  <span>email@example.com</span>
                </div>
                <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <MapPin size={16} className="mr-2 text-green-400" />
                  <span>Location</span>
                </div>
                <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Calendar size={16} className="mr-2 text-purple-400" />
                  <span>Joined {moment().format('MMMM D, YYYY')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`w-full mt-6 rounded-xl overflow-hidden shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-center border-b border-gray-700">
              <button
                className={`flex items-center justify-center py-3 px-6 font-medium text-sm focus:outline-none transition-colors duration-200 ${
                  activeTab === 'posts'
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                onClick={() => setActiveTab('posts')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Posts
              </button>
              <button
                className={`flex items-center justify-center py-3 px-6 font-medium text-sm focus:outline-none transition-colors duration-200 ${
                  activeTab === 'marketplace'
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                onClick={() => setActiveTab('marketplace')}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Marketplace
              </button>
            </div>
            
            <div className="p-6">
              {activeTab === 'posts' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Posts</h2>
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="post-type-select-label" sx={{ color: 'gray' }}>Post Type</InputLabel>
                        <Select
                          labelId="post-type-select-label"
                          id="post-type-select"
                          value={postType}
                          label="Post Type"
                          onChange={handlePostTypeChange}
                          sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
                        >
                          <MenuItem value="all">All</MenuItem>
                          <MenuItem value="image">Image</MenuItem>
                          <MenuItem value="note">Note</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </div>
                  
                  <div className={`flex flex-col items-center justify-center h-96 p-6 rounded-md ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <div className={`flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                    }`}>
                      <Camera size={32} className={isDarkMode ? 'text-gray-500' : 'text-gray-500'} />
                    </div>
                    <h2 className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-xl font-semibold mb-2`}>
                      No Posts Available
                    </h2>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                      This user hasn't posted anything yet.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'marketplace' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Marketplace</h2>
                  <p className="text-gray-400 text-center py-8">No marketplace items available.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;