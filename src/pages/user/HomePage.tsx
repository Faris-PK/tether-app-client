import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileSection from "../../components/ProfileSection";
import NavBarSection from "../../components/NavBarSection";
import TopBar from "../../components/TopBar";
import StoryArea from "../../components/StoryArea";
import PostCreation from "../../components/PostCreation";
import PostList from "../../components/PostList";
import ContactList from "../../components/ContactList";
import { PostApi } from "@/api/postApi";
import { clearUser } from '../../redux/slices/userSlice';
import { useDispatch } from "react-redux";

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await PostApi.getAllPosts();
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className="bg-[#1B2730] flex h-screen overflow-hidden">
      <div
        className="w-1/5 p-3 flex flex-col overflow-y-auto"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // Internet Explorer and Edge
          overflow: "-moz-scrollbars-none", // Older versions of Firefox
        }}
      >
        <div className="bg-[#010F18] p-2 rounded-xl mb-4 shadow-[4px_4px_10px_rgba(0,0,0,0.5)]">
          <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-200 via-blue-600 to-black bg-clip-text text-transparent transition-all duration-300 ease-in-out hover:scale-105 hover:drop-shadow-lg cursor-pointer">
            Tether.
          </h1>
        </div>

        <ProfileSection />
        <aside className="w-full text-white mt-4 rounded-md">
          <NavBarSection />
        </aside>
      </div>

      <div className="flex-grow flex flex-col">
        <TopBar />
        <div className="flex p-3 overflow-hidden h-screen ">
          <div
            className="my_class flex-grow mr-4 overflow-y-auto  rounded-md"
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // Internet Explorer and Edge
              overflow: "-moz-scrollbars-none", // Older versions of Firefox
            }}
          >
            <StoryArea />
            <PostCreation onPostCreated={fetchPosts}/>
            <PostList posts={posts} />
          </div>
          <ContactList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;


