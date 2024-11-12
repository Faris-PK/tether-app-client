import React, { useCallback, useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

import Title from '@/components/common/Title';
import SearchBar from '@/components/common/SearchBar';
import ProfileCard from '@/components/common/ProfileCard';
import SideNav from '@/components/common/SettingsNav';
import StoryArea from '@/components/home/StoryArea';
import PostList from '@/components/home/PostList';
import SuggestedProfiles from '@/components/common/SuggestedProfiles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { useNavigate } from 'react-router-dom';
import { PostApi } from '@/api/postApi';
import { clearUser } from '@/redux/slices/userSlice';
import HeaderNav from '@/components/common/HeaderNav';
import UserProfile from '@/components/UserProfile';

const UserProfilePage: React.FC = () => {
  const { isDarkMode } = useTheme();


  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUserId = useSelector((state: RootState) => state.user?.user?._id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await PostApi.getAllPosts();
     // console.log('Response: ',response);
      
      setPosts(response);
      setLoading(false);
    } catch (err: any) {
     // console.log('Error from backend: ', err.response?.data?.message);
      
      if (err.response?.status === 403 && err.response?.data?.message === 'User is blocked') {
        dispatch(clearUser());
      navigate('/signin');
      } else {
        setError('Error fetching posts');
      }
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className={`mx-auto p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-[#d8d4cd]'} h-screen flex flex-col transition-colors duration-200`}>
    <header className="flex justify-between items-center mb-4">
      <Title/>
      <SearchBar/>
      <HeaderNav onPostCreated={fetchPosts} />
    </header>

    <div className="flex space-x-4 flex-1 overflow-hidden">
      <div className="w-1/6 space-y-4">
        <ProfileCard/>
        <SideNav/>
      </div>
      <div className="w-2/3 space-y-4 overflow-y-auto pr-4 scrollbar-hide">
        {/* <StoryArea /> */}
        {/* <PostList posts={posts} currentUserId={currentUserId} /> */}
        <UserProfile/>
      </div>

      <div className="w-1/6">
        <SuggestedProfiles/>
      </div>
    </div>
  </div>
  );
};

export default UserProfilePage;