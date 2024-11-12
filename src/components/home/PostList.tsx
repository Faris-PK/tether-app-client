import React, { useState } from 'react';
import  SinglePost  from '../../components/post/SinglePost';
import  OptionsModal  from '../modals/OptionsModal';
import  ShareModal  from '../modals/ShareModal';
import  ReportModal  from '../modals/ReportModal';
import  SuccessModal  from '../modals/SuccessModal';
import  EmptyPostsPlaceholder  from '../post/EmptyPostsPlaceholder';
import { PostApi } from '@/api/postApi';
import CommentModal from '../modals/CommentModal';
import { useTheme } from '../../contexts/ThemeContext';
import ReportAlert from '../modals/ReportAlert';


interface PostListProps {
  posts: Post[];
  currentUserId: string;
  fetchPosts: () => void;
}

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

const PostList: React.FC<PostListProps> = ({ posts, currentUserId, fetchPosts }) => {
  const { isDarkMode } = useTheme();
  const [localPosts, setLocalPosts] = useState<Post[]>(posts);
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [commentModalPost, setCommentModalPost] = useState<Post | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedSharePost, setSelectedSharePost] = useState<Post | null>(null);
  const [reportedPosts, setReportedPosts] = useState<Set<string>>(new Set());
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [showAlertModal, setShowAlertModal] = useState(false);



  const sortedPosts = [...localPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

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

  const handleOptionClick = (action: string, postId: string) => {
    if (action === 'report') {

      // if (reportedPosts.has(postId)) {
      //   alert('You have already reported this post');
      //   return;
      // }
      setSelectedPostId(postId);
      setShowReportModal(true);
    } else if (action === 'block_user') {
      setLocalPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? { ...post, isBlocked: true } : post
        )
      );
    }
    setOpenModalId(null);
  };

  const handleReportSubmit = async (reason: string) => {
    try {
      if (!selectedPostId) return;
      
      await PostApi.reportPost(selectedPostId, reason);
      setShowReportModal(false);
      setShowSuccessModal(true);
      
      setReportedPosts(prev => new Set([...prev, selectedPostId]));

      setTimeout(() => {
        setShowSuccessModal(false);
        setSelectedPostId(null);
      }, 2000);
    } catch (error: any) {
      console.error('Error reporting post:', error);
      setAlertMessage(error.response?.data?.message || 'Error reporting post');
      setShowAlertModal(true);
    }
  };

  return (
    <div className="flex justify-center px-4 sm:px-6">
      <div className="w-full max-w-2xl">
        <div className="space-y-4">
          {sortedPosts.length > 0 ? (
            sortedPosts.map((post) => (
              !post.isBlocked && (
                <React.Fragment key={post._id}>
                  <SinglePost
                    post={post}
                    currentUserId={currentUserId}
                    isDarkMode={isDarkMode}
                    onLike={handleLike}
                    onComment={setCommentModalPost}
                    onShare={(post) => {
                      setSelectedSharePost(post);
                      setShowShareModal(true);
                    }}
                    onOptionsClick={() => setOpenModalId(post._id)}
                  />
                  {openModalId === post._id && (
                    <OptionsModal
                      postId={post._id}
                      postUserId={post.userId._id} 
                      currentUserId={currentUserId}
                      isDarkMode={isDarkMode}
                      onClose={() => setOpenModalId(null)}
                      onOptionSelect={handleOptionClick}
                    />
                  )}
                </React.Fragment>
              )
            ))
          ) : (
            <EmptyPostsPlaceholder isDarkMode={isDarkMode} />
          )}

          {showReportModal && (
            <ReportModal
              isDarkMode={isDarkMode}
              onClose={() => {
                setShowReportModal(false);
                setSelectedPostId(null);
              }}
              onSubmit={handleReportSubmit}
            />
          )}

          {showSuccessModal && (
            <SuccessModal isDarkMode={isDarkMode} />
          )}

          {showShareModal && selectedSharePost && (
            <ShareModal
              post={selectedSharePost}
              isDarkMode={isDarkMode}
              onClose={() => {
                setShowShareModal(false);
                setSelectedSharePost(null);
              }}
            />
          )}

          {commentModalPost && (
            <CommentModal
              isOpen={!!commentModalPost}
              onClose={() => setCommentModalPost(null)}
              post={commentModalPost}
              isDarkMode={isDarkMode}
              currentUserId={currentUserId}
             
            />
          )}
          <ReportAlert
            isOpen={showAlertModal}
            onClose={() => setShowAlertModal(false)}
            message={alertMessage}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
};

export default PostList;