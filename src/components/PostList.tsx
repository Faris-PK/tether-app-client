import React, { useState, useRef, useEffect } from 'react';
import { MapPin, MoreVertical, Heart, MessageCircle, Share2, Camera } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
  likes?: number;
  comments?: number;
  postType: string;
}

interface PostListProps {
  posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleOptionClick = (action: string, postId: string) => {
    console.log(`Action: ${action}, Post ID: ${postId}`);
    setOpenModalId(null);
  };

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

  const OptionsModal = ({ postId }: { postId: string }) => (
    <div 
      className="fixed inset-0 bg-white bg-opacity-5 flex justify-center items-center z-50"
      style={{ display: openModalId === postId ? 'flex' : 'none' }}
    >
      <div ref={modalRef} className="bg-[#010F18] rounded-lg shadow-[4px_4px_10px_rgba(0,0,0,0.5)] w-64 ">
        {[
          { text: 'Unfollow', action: 'unfollow', color: 'text-red-500' },
          { text: 'Report', action: 'report', color: 'text-red-500' },
          { text: 'Block user', action: 'block_user', color: 'text-red-500'},
          { text: 'Save post', action: 'save' },
          { text: 'About this Account', action: 'about_account' },
        ].map(({ text, action, color }) => (
          <button
          key={action}
          className={`w-full text-center font-bold px-4 py-3 hover:bg-[#1B2730] ${color || 'text-white'} transition duration-300 ease-in-out`}
          onClick={() => handleOptionClick(action, postId)}
        >
          {text}
        </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 hide-scrollbar overflow-auto">
      {sortedPosts.length > 0 ? (
        sortedPosts.map((post) => (
          <div key={post._id} className="bg-[#010F18] p-4 rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <img
                  src={post.userId.profile_picture}
                  alt={post.userId.username}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h3 className="text-white font-semibold">{post.userId.username}</h3>
                  <div className="flex items-center text-gray-400 text-sm">
                    {post.location && <MapPin size={14} className="mr-1" />}
                    <span>{post.location}</span>
                  </div>
                  <span className="text-gray-400 text-xs">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }).replace('about ', '')}
                  </span>
                </div>
              </div>
              <button 
                className="text-white hover:bg-gray-700 rounded-full p-1 transition-colors duration-200"
                onClick={() => setOpenModalId(post._id)}
              >
                <MoreVertical size={20} />
              </button>
            </div>

            <p className="text-white mb-4">{post.caption}</p>
            {post.postType !== 'note' && (
              <img 
                src={post.mediaUrl} 
                alt="Post content" 
                className="w-full max-h-[400px] object-cover rounded-md mb-4"
              />
            )}
            <div className="flex justify-between text-gray-400 mb-4">
              <div className="flex items-center">
                {/* <div className="bg-[#FF0000] rounded-full p-1 mr-2">
                  <Heart size={16} className="text-white" />
                </div> */}
                <span>{post.likes || 0} likes</span>
              </div>
              <span>{post.comments || 0} comments</span>
            </div>

            <div className="flex justify-between border-t border-gray-700 pt-4">
              {[{ icon: Heart, text: 'Like' }, { icon: MessageCircle, text: 'Comment' }, { icon: Share2, text: 'Share' }].map(
                ({ icon: Icon, text }, index) => (
                  <button key={index} className="flex items-center text-white hover:bg-gray-700 rounded p-2 transition-colors duration-200">
                    <Icon size={20} className="mr-2" />
                    {text}
                  </button>
                )
              )}
            </div>

            <OptionsModal postId={post._id} />
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-96 bg-[#010F18] p-6 rounded-md">
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-[#1F2937] mb-4">
            <Camera size={32} className="text-gray-400" />
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">No Posts Available</h2>
          <p className="text-gray-400">There are no posts to display right now. Check back later or follow more users!</p>
        </div>
      )}
    </div>
  );
};

export default PostList;