import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { api } from '@/api/userApi';
import { useNavigate, useParams } from 'react-router-dom';
import { PostApi } from '@/api/postApi';
import { addFollowedUser, clearUser, removeFollowedUser } from '@/redux/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store/store';
import Modal from 'react-modal';
import FollowersModal from './modals/FollowersModal';
import CommentModal from './modals/CommentModal';
import PremiumBadge from './PremiumBadge';
import { MarketplaceApi } from '@/api/marketplaceApi';
import ProductGrid from './marketPlace/ProductGrid';
import { MarketplaceProduct } from '@/types/IMarketplace';
import { connectionApi } from '@/api/networkApi';


interface Post {
  _id: string;
  userId: {
    username: string;
    profile_picture: string;
  };
  commentCount:number
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


interface UserProfile {
  _id: string;
  username: string;
  email: string;
  bio: string;
  userLocation: {
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  profile_picture: string;
  cover_photo: string;
  followers: string[];
  following: string[];
  posts: string[];
  createdAt: string;
  premium_status: boolean;
  isBlocked: boolean;
  dob: string;
  mobile: string;
}



const UserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'marketplace'>('posts');
  const [postType, setPostType] = useState<string>('all');
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [commentModalPost, setCommentModalPost] = useState<Post | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode } = useTheme();
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const currentUserId = profile?._id;
  const user = useSelector((state: RootState) => state.user?.user);
  const [marketplaceProducts, setMarketplaceProducts] = useState<MarketplaceProduct[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

 // console.log(profile?._id)



  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await api.getUserProfile(userId!);
      console.log( 'response: ', response);
      
      setProfile(response);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }finally {
      setLoading(false);

    }
  };


  useEffect(() => {
    if (user?.following && profile?._id) {
      setIsFollowing(user.following.includes(profile._id));
    }
  }, [user?.following, profile?._id]);

  const handleFollowAction = async () => {
    if (!user || !profile) return;
    
    try {
      setFollowLoading(true);
      if (isFollowing) {
        await connectionApi.unfollowUser(profile._id);
        dispatch(removeFollowedUser(profile._id));
        // Update local state
        setProfile(prev => prev ? {
          ...prev,
          followers: prev.followers.filter(id => id !== user._id)
        } : null);
      } else {
        await connectionApi.followUser(profile._id);
        dispatch(addFollowedUser(profile._id));
        // Update local state
        setProfile(prev => prev ? {
          ...prev,
          followers: [...prev.followers, user._id]
        } : null);
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
    } finally {
      setFollowLoading(false);
    }
  };


  

  const fetchMarketplaceProducts = useCallback(async () => {
    try {
      const response = await MarketplaceApi.getUserProducts(userId!);
      console.log( ' fetchMarketplaceProducts : ', response)
      setMarketplaceProducts(response);
    } catch (err) {
      console.error('Error fetching marketplace products:', err);
    }
  }, []);

  useEffect(() => {
    fetchMarketplaceProducts();
  }, [fetchMarketplaceProducts]);


  const filteredPosts = posts.filter((post) => {
    if (postType === 'all') return true;
    return post.postType === postType;
  });

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      //console.log('UserID from UserProfile: ', userId);
      const response = await PostApi.getProfilePosts(userId!);
      // console.log('fetchPosts From Otehr: ', response);
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
  }, []);

  const formattedJoinDate = profile?.createdAt ? moment(profile?.createdAt).format('MMMM D, YYYY') : 'Unknown';
  const formattedDob = profile?.dob ? moment(profile?.dob).format('MMMM D, YYYY') : 'Unknown';
 


  const handlePostTypeChange = (event: SelectChangeEvent) => {
    setPostType(event.target.value as string);
  };

  useEffect(() => {
    fetchProfile();
    fetchPosts();
  }, [userId]);
  

  const PostCard: React.FC<{ post: Post }> = ({ post }) => {
    const [localPost, setLocalPost] = useState(post);

    const handleLike = async () => {
      try {
        const updatedPost = await PostApi.likePost(post._id);
        setLocalPost(prevPost => ({ ...prevPost, likes: updatedPost.likes }));
        fetchPosts();
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

    if (!profile) {
      return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
      <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-xl mb-4 shadow-md transition-colors duration-200 `}>
        <div className="flex justify-between items-start mb-4" >
          <div className="flex items-center" >
            <img
              src={profile.profile_picture}
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
          <span>{post.commentCount || 0} comments</span>
        </div>

        <div className={`flex justify-between ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-t pt-4`}>
          <Fab
            aria-label="like"
            size="small"
            color={localPost.likes?.includes(user?._id) ? "error" : "default"}
            onClick={handleLike}
            sx={{ transform: 'scale(0.7)' }}
          >
            <FavoriteIcon />
          </Fab>
          <Fab 
            aria-label="comment" 
            size="small" 
            onClick={() => setCommentModalPost(post)}
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
            <img src={profile?.cover_photo} alt="Cover" className="w-full h-28 object-cover rounded-lg border-2" />
            <img src={profile?.profile_picture} alt="Profile" className="absolute left-8 -bottom-16 w-32 h-32 rounded-full border-2 border-[#b2b4b4]" />
          </div>
          
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl mt-3 rounded-lg overflow-hidden transition-colors duration-200`}>
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {profile?.username}
                  </h2>
                  <div className={`flex space-x-5 mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                    <span className="flex flex-col items-center">
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {profile?.posts.length}
                      </span>
                      <span>posts</span>
                    </span>
                    <span 
                      className={`flex flex-col items-center cursor-pointer hover:text-blue-400 transition-colors duration-200`}
                      onClick={() => setShowFollowersModal(true)}
                    >
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {profile?.followers.length}
                      </span>
                      <span>followers</span>
                    </span>
                    <span 
                      className={`flex flex-col items-center cursor-pointer hover:text-blue-400 transition-colors duration-200`}
                      onClick={() => setShowFollowingModal(true)}
                    >
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                       {profile?.following.length}
                      </span>
                      <span>following</span>
                    </span>
                  </div>
                </div>
                
                {user && profile && user._id !== profile._id && (
                <button 
                  onClick={handleFollowAction}
                  disabled={followLoading}
                  className={`px-4 py-2 ${
                    isFollowing 
                      ? `${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} 
                        text-blue-500 hover:text-blue-600`
                      : 'bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white'
                  } rounded-md text-sm flex items-center transition-colors duration-200`}
                >
                  <UserPlus size={16} className="mr-2" />
                  {followLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
              </div>

              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} my-6`}>{profile?.bio}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Mail size={16} className="mr-2 text-blue-400" />
                  <span>{profile?.email}</span>
                </div>
                <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <MapPin size={16} className="mr-2 text-green-400" />
                  <span>{profile?.userLocation?.name}</span>
                </div>
                <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Calendar size={16} className="mr-2 text-purple-400" />
                  <span>Joined {profile?.createdAt ? moment(profile.createdAt).format('MMMM D, YYYY') : 'Unknown date'}</span>
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
                {/* <h2 className="text-2xl font-bold text-white mb-6">Marketplace</h2> */}
                
                {marketplaceProducts.length > 0 ? (
                        <ProductGrid products={marketplaceProducts} loading={loading} />
                ) : (
                  <div className={`flex flex-col items-center justify-center h-96 p-6 rounded-lg ${
                    isDarkMode ? 'bg-gray-600' : 'bg-gray-100'
                  }`}
                  >
                    <div className={`flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                    }`}
                    >
                      <ShoppingBag size={32} className={isDarkMode ? 'text-gray-500' : 'text-gray-500'} />
                    </div>
                    <h2 className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-xl font-semibold mb-2`}>
                      No Marketplace Items Available
                    </h2>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                      You don't have any marketplace items yet. Click the button below to add one!
                    </p>
                  
                  </div>
                )}
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
            <FollowersModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        title="Followers"
        currentUserId={profile?._id || ''}
      />

      <FollowersModal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        title="Following"
        currentUserId={profile?._id || ''}
      />
      {commentModalPost && (
      <CommentModal
        isOpen={!!commentModalPost}
        onClose={() => setCommentModalPost(null)}
        post={commentModalPost}
        isDarkMode={isDarkMode}
        currentUserId={user?._id || ''}
      />
)}
    </div>
  );
};

export default UserProfile;