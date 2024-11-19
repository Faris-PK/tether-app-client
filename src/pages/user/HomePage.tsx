import React, { useCallback, useEffect, useState } from 'react';
import HeaderNav from '../../components/common/HeaderNav';
import PostList from '../../components/home/PostList';
import ProfileCard from '../../components/common/ProfileCard';
import SearchBar from '../../components/common/SearchBar';
import StoryArea from '../../components/home/StoryArea';
import SuggestedProfiles from '../../components/common/SuggestedProfiles';
import Title from '../../components/common/Title';
import SideNav from '../../components/common/SettingsNav';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from "react-router-dom";
import { PostApi } from "@/api/postApi";
import { clearUser } from '../../redux/slices/userSlice';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { Button } from "@/components/ui/button";

interface Post {
  _id: string;
  userId: {
    _id:string,
    username: string;
    profile_picture: string;
  };
  location: string;
  createdAt: string;
  caption: string;
  mediaUrl: string;
  likes: string[];
  commentCount?: number;
  postType: string;
  isBlocked: boolean;
}

const HomePage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const postsPerPage = 2;
  
  const currentUserId = useSelector((state: RootState) => state.user.user?._id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchPosts = useCallback(async (page: number = 1) => {
    try {
      setIsLoadingMore(page > 1);
      if (page === 1) setLoading(true);
      
      const response = await PostApi.getAllPosts(page, postsPerPage);
      console.log(' response: ', response);
      
      if (page === 1) {
        setPosts(response.posts);
      } else {
        setPosts(prevPosts => [...prevPosts, ...response.posts]);
      }
      
      setTotalPages(response.totalPages);
      setLoading(false);
      setIsLoadingMore(false);
    } catch (err: any) {
      if (err.response?.status === 403 && err.response?.data?.message === 'User is blocked') {
        dispatch(clearUser());
        navigate('/signin');
      } else {
        setError('Error fetching posts....');
      }
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [navigate, dispatch]);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  const loadMore = () => {
    if (currentPage < totalPages && !isLoadingMore) {
      const nextPage = currentPage+1;
      setCurrentPage(nextPage);
      fetchPosts(nextPage);
    }
  };

  if (loading && currentPage === 1) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={`mx-auto p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-[#d8d4cd]'} h-screen flex flex-col transition-colors duration-200`}>
      <header className="flex justify-between items-center mb-4">
        <Title/>
        <SearchBar/>
        <HeaderNav onPostCreated={() => {
          setCurrentPage(1);
          fetchPosts(1);
        }} />
      </header>

      <div className="flex space-x-4 flex-1 overflow-hidden">
        <div className="w-1/6 space-y-4">
          <ProfileCard/>
          <SideNav/>
        </div>
        <div className="w-2/3 space-y-4 overflow-y-auto pr-4 scrollbar-hide pt-2">
          <StoryArea />
          <PostList 
            posts={posts} 
            currentUserId={currentUserId} 
            fetchPosts={() => {
              setCurrentPage(1);
              fetchPosts(1);
            }}
          />
          {currentPage < totalPages && (
            <div className="mt-8 flex justify-center">
              <Button
                onClick={loadMore}
                disabled={isLoadingMore}
                className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isLoadingMore ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </div>

        <div className="w-1/6">
          <SuggestedProfiles/>
        </div>
      </div>
    </div>
  );
};

export default HomePage;