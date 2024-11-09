import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, Heart, Share, MapPin, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from '../../contexts/ThemeContext';
import { PostApi } from '@/api/postApi';
import CommentModal from '../Modal/CommentModal';

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
  commentCount?: number;
  postType: string;
}

const SinglePostView: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const response = await PostApi.getPostById(postId as string);
        setPost(response);
        // You'll need to get the currentUserId from your auth context or similar
        setIsLiked(response.likes.includes(currentUserId));
      } catch (err) {
        setError('Post not found or unavailable');
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const handleLike = async () => {
    if (!post) return;
    
    try {
      const updatedPost = await PostApi.likePost(post._id);
      setPost(prev => prev ? { ...prev, likes: updatedPost.likes } : null);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center min-h-screen p-4",
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      )}>
        <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
        <p className="text-gray-500 mb-6">The post you're looking for doesn't exist or has been removed.</p>
        <Button
          onClick={() => navigate('/')}
          className={cn(
            "flex items-center",
            isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"
          )}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className={cn(
            "mb-6 flex items-center",
            isDarkMode ? "text-white hover:bg-gray-800" : "text-gray-900 hover:bg-gray-100"
          )}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Feed
        </Button>

        <div className={cn(
          "rounded-xl shadow-lg overflow-hidden",
          isDarkMode ? "bg-gray-800" : "bg-white"
        )}>
          <div className="p-4">
            {/* Post Header */}
            <div className="flex items-center mb-4">
              <img
                src={post.userId.profile_picture}
                alt={post.userId.username}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 className={cn(
                  "font-semibold",
                  isDarkMode ? "text-white" : "text-black"
                )}>
                  {post.userId.username}
                </h3>
                {post.location && (
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin size={14} className="mr-1" />
                    <span>{post.location}</span>
                  </div>
                )}
                <span className="text-gray-500 text-sm">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>

            {/* Post Caption */}
            <p className={cn(
              "mb-4",
              isDarkMode ? "text-gray-300" : "text-gray-900"
            )}>
              {post.caption}
            </p>

            {/* Post Media */}
            {post.postType !== 'note' && (
              <div className="flex justify-center overflow-hidden rounded-md mb-4">
                <img
                  src={post.mediaUrl}
                  alt="Post content"
                  className={cn(
                    "max-w-full h-auto object-contain max-h-[600px]",
                    !imageLoaded && "hidden"
                  )}
                  onLoad={() => setImageLoaded(true)}
                />
                {!imageLoaded && (
                  <div className="w-full h-64 bg-gray-200 animate-pulse rounded-md" />
                )}
              </div>
            )}

            {/* Post Stats */}
            <div className="flex justify-between text-gray-500 mb-4">
              <span>{post.likes.length} likes</span>
              <span>{post.commentCount || 0} comments</span>
            </div>

            {/* Action Buttons */}
            <div className={cn(
              "flex justify-between pt-4 border-t",
              isDarkMode ? "border-gray-700" : "border-gray-200"
            )}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={cn(
                  isDarkMode 
                    ? "hover:bg-red-950 text-gray-300" 
                    : "hover:bg-red-100 text-gray-600",
                  isLiked && "text-red-500"
                )}
              >
                <Heart className={cn("w-4 h-4 mr-2", isLiked && "fill-current")} />
                <span className="text-sm">Like</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCommentModal(true)}
                className={cn(
                  isDarkMode 
                    ? "text-gray-300 hover:bg-blue-950" 
                    : "text-gray-600 hover:bg-blue-100"
                )}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">Comment</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {}} // You can implement share functionality here
                className={cn(
                  isDarkMode 
                    ? "text-gray-300 hover:bg-green-950" 
                    : "text-gray-600 hover:bg-green-100"
                )}
              >
                <Share className="w-4 h-4 mr-2" />
                <span className="text-sm">Share</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showCommentModal && post && (
        <CommentModal
          isOpen={showCommentModal}
          onClose={() => setShowCommentModal(false)}
          post={post}
          isDarkMode={isDarkMode}
          currentUserId={currentUserId} // You'll need to get this from your auth context
        />
      )}
    </div>
  );
};

export default SinglePostView;