import React, { useState, useRef, useEffect } from 'react';
import { MapPin, MoreVertical, MessageCircle, Share2, Camera, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Fab from '@mui/material/Fab';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import { PostApi } from '../api/postApi';
import CommentModal from './Modal/CommentModal';

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

interface PostListProps {
  posts: Post[];
  currentUserId: string;
}

const reportReasons = [
  "Spam",
  "Nudity or sexual activity",
  "Hate speech or symbols",
  "Violence or dangerous organizations",
  "Sale of illegal or regulated goods",
  "Bullying or harassment",
  "Intellectual property violation",
  "False information",
  "Suicide or self-injury",
  "Other"
];

const PostList: React.FC<PostListProps> = ({ posts, currentUserId }) => {
  const [localPosts, setLocalPosts] = useState<Post[]>(posts);
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const reportModalRef = useRef<HTMLDivElement>(null);

  const sortedPosts = [...localPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleOptionClick = (action: string, postId: string) => {
    if (action === 'report') {
      setShowReportModal(true);
      setSelectedPostId(postId);
      console.log(`Action: ${action}, Post ID: ${postId}`);
    } else {
      console.log(`Action: ${action}, Post ID: ${postId}`);
      setOpenModalId(null);
    }
  };

  const handleReportSubmit = async (reason: string) => {
    try {
      if (!selectedPostId) {
        throw new Error('No post selected for reporting');
      }
      await PostApi.reportPost(selectedPostId, reason);
      setShowReportModal(false);
      setShowSuccessModal(true);
      
      setTimeout(() => {
        setShowSuccessModal(false);
        setOpenModalId(null);
        setSelectedPostId(null);
      }, 2000);
    } catch (error) {
      console.error('Error reporting post:', error);
      // You might want to show an error message to the user
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const updatedPost = await PostApi.likePost(postId);
      setLocalPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? { ...post, likes: updatedPost.likes } : post
        )
      );
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  const handleCommentClick = (post: Post) => {
    setSelectedPost(post);
    setCommentModalOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setOpenModalId(null);
      }
      if (reportModalRef.current && !reportModalRef.current.contains(event.target as Node)) {
        setShowReportModal(false);
        setSelectedPostId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const ReportModal = () => (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      style={{ display: showReportModal ? 'flex' : 'none' }}
    >
      <div ref={reportModalRef} className="bg-[#010F18] rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-white text-lg font-semibold">Report</h2>
          <button 
            onClick={() => {
              setShowReportModal(false);
              setSelectedPostId(null);
            }}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        <div className="py-2">
          {reportReasons.map((reason) => (
            <button
              key={reason}
              className="w-full text-left text-white px-4 py-3 hover:bg-[#1B2730] transition duration-200"
              onClick={() => handleReportSubmit(reason)}
            >
              {reason}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const SuccessModal = () => (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      style={{ display: showSuccessModal ? 'flex' : 'none' }}
    >
      <div className="bg-[#010F18] rounded-lg shadow-lg p-6 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-white text-lg font-semibold mb-2">Thanks for letting us know</h3>
        <p className="text-gray-400 text-center">Your feedback helps keep our community safe.</p>
      </div>
    </div>
  );

  const OptionsModal = ({ postId }: { postId: string }) => (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      style={{ display: openModalId === postId ? 'flex' : 'none' }}
    >
      <div ref={modalRef} className="bg-[#010F18] rounded-lg shadow-lg w-64">
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
          !post.isBlocked ? (
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
                  <span>{post.likes.length} likes</span>
                </div>
                <span>{post.comments || 0} comments</span>
              </div>
  
              <div className="flex justify-between border-t border-gray-700 pt-4">
                <Fab
                  aria-label="like"
                  size="small"
                  color={post.likes.includes(currentUserId) ? "error" : "default"}
                  onClick={() => handleLike(post._id)}
                  sx={{ transform: 'scale(0.7)', }}
                >
                  <FavoriteIcon />
                </Fab>
                <Fab 
                  aria-label="comment" 
                  size="small" 
                  onClick={() => handleCommentClick(post)}
                  sx={{ transform: 'scale(0.7)' }}
                >
                  <CommentIcon />
                </Fab>
                <Fab aria-label="share" size="small" sx={{ transform: 'scale(0.7)' }}>
                  <ShareIcon />
                </Fab>
              </div>
  
              <OptionsModal postId={post._id} />
              {selectedPost && (
        <CommentModal
          isOpen={commentModalOpen}
          onClose={() => {
            setCommentModalOpen(false);
            setSelectedPost(null);
          }}
          post={{
            ...selectedPost,
            comments: [
              // You can add sample comments here for testing
              {
                _id: '1',
                userId: {
                  username: 'user1',
                  profile_picture: '/path-to-avatar.jpg'
                },
                content: 'This is a great post!',
                createdAt: new Date().toISOString(),
                likes: []
              },
              // Add more sample comments as needed
            ]
          }}
          currentUserId={currentUserId}
        />
            )}
            </div>
          ) : (
            // <div key={post._id} className="bg-[#010F18] p-4 rounded-xl text-center">
            //   <p className="text-gray-400">This post is not available.</p>
            // </div>
            <div className="flex flex-col items-center justify-center h-96 bg-[#010F18] p-6 rounded-md">
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-[#1F2937] mb-4">
              <Camera size={32} className="text-gray-400" />
            </div>
            <h2 className="text-white text-xl font-semibold mb-2">No Posts Available</h2>
            <p className="text-gray-400">There are no posts to display right now. Check back later or follow more users!</p>
          </div>
          )
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
      <ReportModal />
      <SuccessModal />
    </div>
  );
  
  
};

export default PostList;