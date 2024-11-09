import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store/store';
import { UserPen, Mail, Cake, MapPin, Calendar, Link as LinkIcon, FileText, ShoppingBag, Image as ImageIcon, Paperclip, UserPlus, MoreVertical, Heart, MessageCircle, Share2, Camera, Edit, Trash2, Plus } from 'lucide-react';
import moment from 'moment';
import { useTheme } from '../contexts/ThemeContext';
import { formatDistanceToNow } from 'date-fns';
import EditProfileModal from './Modal/EditProfileModal';
import { api } from '../api/userApi';
import { clearUser, removePostFromUser, setUser } from '../redux/slices/userSlice';
import ProfilePictureModal from './Modal/ProfilePictureModal';
import { PostApi } from '@/api/postApi';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Modal from 'react-modal';
import EditPostModal from './Modal/EditPostModal';
import Fab from '@mui/material/Fab';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import FollowersModal from './Modal/FollowersModal';
import CommentModal from './Modal/CommentModal';
import PremiumBadge from './PremiumBadge';


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

Modal.setAppElement('#root');

const Profile: React.FC = () => {
  const { isDarkMode } = useTheme();
  const user = useSelector((state: RootState) => state.user?.user);
  
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState<boolean>(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isAudienceModalOpen, setIsAudienceModalOpen] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState('public');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'marketplace'>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postType, setPostType] = useState<string>('all');
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [commentModalPost, setCommentModalPost] = useState<Post | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const currentUserId  = useSelector((state: RootState) => state.user.user?._id);
  

  const navigate = useNavigate();

  const formattedJoinDate = user?.createdAt ? moment(user.createdAt).format('MMMM D, YYYY') : 'Unknown';
  const formattedDob = user?.dob ? moment(user.dob).format('MMMM D, YYYY') : 'Unknown';

  const openModal = () => {
    setIsModalOpen(true);
    setErrors([]);
    setSuccess('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenPostModal = () => {
    setIsPostModalOpen(true);
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
  };

  const handleOpenAudienceModal = () => {
    setIsAudienceModalOpen(true);
  };

  const handleCloseAudienceModal = () => {
    setIsAudienceModalOpen(false);
  };

  const handleAudienceSelect = (audience: string) => {
    setSelectedAudience(audience);
    setIsAudienceModalOpen(false);
  };

  const handlePostCreated = () => {
    fetchPosts();
    setSuccess('Post created successfully!');
  };


  const handleUpload = async (type: 'profile' | 'cover', file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await api.uploadImage(formData);
      dispatch(setUser(response));
      setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} picture uploaded successfully!`);
      if (type === 'profile') {
        setIsProfileModalOpen(false);
      } else {
        setIsCoverModalOpen(false);
      }
    } catch (error) {
      console.error(`Error uploading ${type} picture:`, error);
      setErrors([...errors, `Failed to upload ${type} picture.`]);
    }
  };

  const handleRemove = async (type: 'profile' | 'cover') => {
    try {
      const response = await api.removeProfilePicture(type);
      dispatch(setUser(response));
      setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} picture removed successfully!`);
      setIsCoverModalOpen(false);
    } catch (error) {
      console.error(`Error removing ${type} picture:`, error);
      setErrors([...errors, `Failed to remove ${type} picture.`]);
    }
  };


  const handleDeletePost = async (postId: string) => {
   // const dispatch = useDispatch();
  
    try {
      //console.log('Post Id: ', postId);
      
      await PostApi.deletePost(postId);
      setPosts(posts.filter(post => post._id !== postId));
      
      // Dispatch action to remove the post from the user's posts in the Redux store
      dispatch(removePostFromUser(postId));
      
      setSuccess('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      setErrors([...errors, 'Failed to delete post.']);
    }
    setOpenModalId(null);
  };



  const handleEditPost = (post: Post) => {
    setEditingPost(post);
  };

  const handleSaveEdit = async (postId: string, caption: string, location: string) => {
    try {
      const updatedPost = await PostApi.updatePost(postId, { caption, location });
      setPosts(posts.map(post => post._id === postId ? updatedPost : post));
      setSuccess('Post updated successfully!');
    } catch (error) {
      console.error('Error updating post:', error);
      setErrors([...errors, 'Failed to update post.']);
    }
    setEditingPost(null);
  };


  const handlePostTypeChange = (event: SelectChangeEvent) => {
    setPostType(event.target.value as string);
  };

  const filteredPosts = posts.filter((post) => {
    if (postType === 'all') return true;
    return post.postType === postType;
  });

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await PostApi.getProfilePosts();
      //console.log('Response From Backend: ', response);
      setPosts(response);
      setLoading(false);
    } catch (err: any) {
      console.log(err);
      
      if (err.response?.status === 403 && err.response?.data?.message === 'User is blocked') {
        dispatch(clearUser());
        navigate('/signin');
      } else {
        setError('Error fetching posts');
      }
      setLoading(false);
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setOpenModalId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (action: string, postId: string) => {
    console.log(`Action: ${action}, Post ID: ${postId}`);
    setOpenModalId(null);
  };

  interface OptionsModalProps {
    postId: string;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (postId: string) => void;
    onDelete: (postId: string) => void;
  }
  
  const OptionsModal: React.FC<OptionsModalProps> = ({ postId, isOpen, onClose, onEdit, onDelete }) => {
    const modalRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          onClose();
        }
      };
  
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, onClose]);
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-white bg-opacity-5 flex justify-center items-center z-50">
        <div ref={modalRef} className="bg-[#010F18] rounded-lg shadow-[4px_4px_10px_rgba(0,0,0,0.5)] w-64">
          <button
            className="w-full text-center font-bold px-4 py-3 hover:bg-[#1B2730] text-white transition duration-300 ease-in-out flex items-center justify-center"
            onClick={() => onEdit(postId)}
          >
            <Edit size={20} className="mr-2" />
            Edit
          </button>
          <button
            className="w-full text-center font-bold px-4 py-3 hover:bg-[#1B2730] text-red-500 transition duration-300 ease-in-out flex items-center justify-center"
            onClick={() => onDelete(postId)}
          >
            <Trash2 size={16} className="mr-2" />
            Delete Post
          </button>
        </div>
      </div>
    );
  };
  


  interface PostCardProps {
    post: Post;
    onEdit: (post: Post) => void;
    onDelete: (postId: string) => void;
    currentUserId: string;
  }
  
  const PostCard: React.FC<PostCardProps> = ({ post, onEdit, onDelete , currentUserId}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [localPost, setLocalPost] = useState(post);

  const handleLike = async () => {
    try {
      const updatedPost = await PostApi.likePost(post._id);
      setLocalPost(prevPost => ({ ...prevPost, likes: updatedPost.likes }));
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };
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
     <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-xl mb-4 shadow-md transition-colors duration-200`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
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
          <button 
            className={`${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} rounded-full p-1 transition-colors duration-200`}
            onClick={() => setIsModalOpen(true)}
          >
            <MoreVertical size={20} />
          </button>
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
            <span>{localPost.likes?.length || 0} likes</span>
          </div>
          <span>{post.comments || 0} comments</span>
        </div>

        <div className={`flex justify-between ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-t pt-4`}>
          <Fab
            aria-label="like"
            size="small"
            color={localPost.likes?.includes(currentUserId) ? "error" : "default"}
            onClick={handleLike}
            sx={{ transform: 'scale(0.7)' }}
          >
            <FavoriteIcon />
          </Fab>
          <Fab 
           aria-label="comment" 
           size="small" 
           onClick={() => setCommentModalPost(post)}
           sx={{ transform: 'scale(0.7)' }}>
            <CommentIcon />
          </Fab>
          <Fab aria-label="share" size="small" sx={{ transform: 'scale(0.7)' }}>
            <ShareIcon />
          </Fab>
        </div>

        <OptionsModal
          postId={post._id}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onEdit={() => onEdit(post)}
          onDelete={() => onDelete(post._id)}
        />
      </div>
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;


  return (
    <div className={` flex w-4/5 max-h-full mb-64 rounded-md shadow-md transition-colors duration-200 border-2aa`}>
    <div className="flex-grow flex flex-col overflow-hidden">
      <div className="flex-grow overflow-y-auto p-4 rounded-md" style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        overflow: "-moz-scrollbars-none",
      }}>
          <div className="relative mb-20">
            <img src={user?.cover_photo || '/default-cover.jpg'} alt="Cover" className="w-full  object-cover rounded-lg border-2 " />
            <div className="absolute top-2 right-2">
              <ProfilePictureModal
                onUpload={(file) => handleUpload('cover', file)}
                onRemove={() => handleRemove('cover')}
                isProfilePicture={false}
                onClose={() => setIsCoverModalOpen(false)}
              />
            </div>
            <img src={user?.profile_picture || '/default-avatar.jpg'} alt="Profile" className="absolute left-8 -bottom-16 w-32 h-32 rounded-full border-2 border-[#b2b4b4]" />
            <div className="absolute left-32  ">
              <ProfilePictureModal
                onUpload={(file) => handleUpload('profile', file)}
                onRemove={() => handleRemove('profile')}
                isProfilePicture={true}
                onClose={() => setIsProfileModalOpen(false)}
              />
            </div>
          </div>
          
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl mt-3 rounded-lg overflow-hidden transition-colors duration-200`}>
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {user?.username}
                  </h2>
                  
                  {/* Premium Badge positioned directly under username */}
                  {user?.premium_status && (
                    <div className="mt-1">
                      <PremiumBadge />
                    </div>
                  )}

                  <div className={`flex space-x-5 mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                    {/* Stats section */}
                    <span className="flex flex-col items-center">
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {user?.posts.length || 0}
                      </span>
                      <span>posts</span>
                    </span>
                    {/* Followers and Following buttons */}
                    <span 
                      className={`flex flex-col items-center cursor-pointer hover:text-blue-400 transition-colors duration-200`}
                      onClick={() => setShowFollowersModal(true)}
                    >
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {user?.followers.length}
                      </span>
                      <span>followers</span>
                    </span>
                    <span 
                      className={`flex flex-col items-center cursor-pointer hover:text-blue-400 transition-colors duration-200`}
                      onClick={() => setShowFollowingModal(true)}
                    >
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {user?.following.length}
                      </span>
                      <span>following</span>
                    </span>
                  </div>
                </div>
                
                {/* Edit Profile Button */}
                <button 
                  onClick={openModal}
                  className={`px-4 py-2 ${isDarkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} text-${isDarkMode ? 'white' : 'gray-800'} rounded-md text-sm flex items-center transition-colors duration-200`}
                >
                  <UserPen size={16} className="mr-2" />
                  Edit Profile
                </button>
              </div>

              {/* Bio */}
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} my-6`}>{user?.bio}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Mail size={16} className="mr-2 text-blue-400" />
                  <span>{user?.email}</span>
                </div>
                <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Cake size={16} className="mr-2 text-pink-400" />
                  <span>{formattedDob}</span>
                </div>
                <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <MapPin size={16} className="mr-2 text-green-400" />
                  <span>{user?.location?.toString() || 'Not specified'}</span>
                </div>
                <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Calendar size={16} className="mr-2 text-purple-400" />
                  <span>Joined {formattedJoinDate}</span>
                </div>
              </div>
              
              {user?.social_links && user?.social_links.length > 0 && (
                <div className="mt-6">
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Social Links
                  </h3>
                  <ul className="space-y-2">
                    {user?.social_links.map((link: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <LinkIcon size={14} className="mr-2 text-blue-400" />
                        <a 
                          href={link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-400 hover:underline"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
                    <h2 className="text-2xl font-bold text-white">Your Posts</h2>
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
                          {[...new Set(posts.map((post) => post.postType))].map((type) => (
                            <MenuItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </div>
                  {filteredPosts.length > 0 ? (
                    <div className="space-y-4 hide-scrollbar overflow-auto">
                     {filteredPosts.map((post) => (
                      <PostCard
                        key={post._id}
                        post={post}
                        onEdit={handleEditPost}
                        onDelete={handleDeletePost}
                        currentUserId={user?._id || ''}
                      />
                    ))}
                    </div>
                  ) : (
                    <div className={`flex flex-col items-center justify-center h-96 p-6 rounded-md ${
                      isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                      }`}
                    >
                      <Camera size={32} className={isDarkMode ? 'text-gray-500' : 'text-gray-500'} />
                    </div>
                    <h2 className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-xl font-semibold mb-2`}>
                      No Posts Available
                    </h2>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                      There are no posts to display right now. Start sharing your moments!
                    </p>
                  </div>
                  
                  )}
                </div>
              )}

              {activeTab === 'marketplace' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Marketplace</h2>
                  <p className="text-gray-400 text-center py-8">Your marketplace items will be displayed here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={closeModal}
        user={user}
      />
      {editingPost && (
        <EditPostModal
          isOpen={!!editingPost}
          onClose={() => setEditingPost(null)}
          post={editingPost}
          onSave={handleSaveEdit}
        />
      )}
     

     <FollowersModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        title="Followers"
        currentUserId={currentUserId}
      />

      <FollowersModal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        title="Following"
        currentUserId={currentUserId}
      />
      {commentModalPost && (
  <CommentModal
    isOpen={!!commentModalPost}
    onClose={() => setCommentModalPost(null)}
    post={commentModalPost}
    isDarkMode={isDarkMode}
    currentUserId={currentUserId}
  />
)}

    </div>
  );
};

export default Profile;