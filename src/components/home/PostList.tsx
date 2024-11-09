import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Heart, Share, MoreVertical, MapPin, Camera, X, Link, Check, Copy, Twitter, Facebook } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTheme } from '../../contexts/ThemeContext';
import { PostApi } from '@/api/postApi';
import CommentModal from '../Modal/CommentModal';
import { WhatsApp } from '@mui/icons-material';

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
  isBlocked: boolean;
}

interface PostListProps {
  posts: Post[];
  currentUserId: string;
  fetchPosts: () => void;
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
  const { isDarkMode } = useTheme();
  const [localPosts, setLocalPosts] = useState<Post[]>(posts);
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [commentModalPost, setCommentModalPost] = useState<Post | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const reportModalRef = useRef<HTMLDivElement>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedSharePost, setSelectedSharePost] = useState<Post | null>(null);
  const [copied, setCopied] = useState(false);
  const shareModalRef = useRef<HTMLDivElement>(null);

  const sortedPosts = [...localPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleOptionClick = (action: string, postId: string) => {
    if (action === 'report') {
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

  const handleReportSubmit = async (reason: string) => {
    try {
      if (!selectedPostId) return;
      
      await PostApi.reportPost(selectedPostId, reason);
      setShowReportModal(false);
      setShowSuccessModal(true);
      
      setTimeout(() => {
        setShowSuccessModal(false);
        setSelectedPostId(null);
      }, 2000);
    } catch (error) {
      console.error('Error reporting post:', error);
    }
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setSelectedPostId(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setOpenModalId(null);
      }
      if (reportModalRef.current && !reportModalRef.current.contains(event.target as Node)) {
        handleCloseReportModal();
      }
      if (shareModalRef.current && !shareModalRef.current.contains(event.target as Node)) {
        handleCloseShareModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setSelectedSharePost(null);
    setCopied(false);
  };

  const handleShare = (post: Post) => {
    setSelectedSharePost(post);
    setShowShareModal(true);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const BlockedPostPlaceholder = () => (
    <div className={cn(
      "flex flex-col items-center justify-center h-96 p-6 rounded-md",
      isDarkMode ? "bg-gray-800" : "bg-gray-100"
    )}>
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-700 mb-4">
        <Camera size={32} className="text-gray-400" />
      </div>
      <h2 className={cn(
        "text-xl font-semibold mb-2",
        isDarkMode ? "text-white" : "text-gray-800"
      )}>
        Post Not Available
      </h2>
      <p className="text-gray-400">This post is no longer accessible.</p>
    </div>
  );

  const shareToSocial = (platform: string, url: string) => {
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(url)}`
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  const ShareModal = () => {
    if (!selectedSharePost) return null;

    const shareUrl = `${window.location.origin}/post/${selectedSharePost._id}`;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div
          ref={shareModalRef}
          className={cn(
            "rounded-lg shadow-lg w-96",
            isDarkMode ? "bg-gray-800" : "bg-white"
          )}
        >
          <div className={cn(
            "p-4 flex justify-between items-center border-b",
            isDarkMode ? "border-gray-700" : "border-gray-200"
          )}>
            <h2 className={cn(
              "text-lg font-semibold",
              isDarkMode ? "text-white" : "text-gray-800"
            )}>
              Share Post
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseShareModal}
              className={cn(
                "p-1 hover:bg-transparent",
                isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
              )}
            >
              <X size={20} />
            </Button>
          </div>

          <div className="p-4 space-y-4">
            {/* Copy Link Button */}
            <button
              onClick={() => copyToClipboard(shareUrl)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg transition duration-200",
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              )}
            >
              <div className="flex items-center">
                <Link className="w-5 h-5 mr-3" />
                <span>Copy Link</span>
              </div>
              {copied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>

            {/* Social Share Buttons */}
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant="outline"
                className={cn(
                  "flex items-center justify-center p-3 rounded-lg",
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                )}
                onClick={() => shareToSocial('twitter', shareUrl)}
              >
                <Twitter className="w-5 h-5 text-blue-400" />
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "flex items-center justify-center p-3 rounded-lg",
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                )}
                onClick={() => shareToSocial('facebook', shareUrl)}
              >
                <Facebook className="w-5 h-5 text-blue-600" />
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "flex items-center justify-center p-3 rounded-lg",
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                )}
                onClick={() => shareToSocial('whatsapp', shareUrl)}
              >
                <WhatsApp className="w-5 h-5 text-green-500" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };


  const PostComponent: React.FC<Post> = (post) => {
    const [isLiked, setIsLiked] = useState(post.likes.includes(currentUserId));
    const [imageLoaded, setImageLoaded] = useState(false);

    const handlePostLike = async () => {
      await handleLike(post._id);
      setIsLiked(!isLiked);
    };

    return (
      <div className={cn(
        "p-4 mb-4 rounded-xl transition-colors duration-200 shadow-black drop-shadow-md",
        isDarkMode ? "bg-gray-800" : "bg-white"
      )}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
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
                <div className="flex items-center text-gray-600 text-md">
                  <MapPin size={14} className="mr-1" />
                  <span>{post.location}</span>
                </div>
              )}
              <span className="text-gray-500 text-sm">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpenModalId(post._id)}
                  className={cn(
                    "rounded-full p-1",
                    isDarkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <MoreVertical size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>More options</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <p className={cn(
          "mb-4",
          isDarkMode ? "text-gray-300" : "text-black"
        )}>
          {post.caption}
        </p>
        
        {post.postType !== 'note' && (
          <div className="flex justify-center overflow-hidden rounded-md mb-4">
            <img 
              src={post.mediaUrl} 
              alt="Post content" 
              className={cn(
                "max-w-full h-auto object-contain max-h-[800px] rounded-sm",
                !imageLoaded && "hidden"
              )}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="w-full h-64 bg-gray-200 animate-pulse rounded-md" />
            )}
          </div>
        )}

        <div className="flex justify-between text-gray-400 mb-4">
          <span>{post.likes.length} likes</span>
          <span>{post.commentCount || 0} comments</span>
        </div>

        <div className={cn(
          "flex justify-between pt-4 border-t",
          isDarkMode ? "border-gray-700" : "border-gray-200"
        )}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePostLike}
                  className={cn(
                    isDarkMode 
                      ? "hover:bg-red-950 text-gray-300" 
                      : "hover:bg-red-100 text-gray-600",
                    isLiked && "text-red-500"
                  )}
                >
                  <Heart className={cn("w-4 h-4 mr-2", isLiked && "fill-current")} />
                  <span className="text-sm"></span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isLiked ? 'Unlike' : 'Like'} post</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCommentModalPost(post)}
                  className={cn(
                    isDarkMode 
                      ? "text-gray-300 hover:bg-blue-950" 
                      : "text-gray-600 hover:bg-blue-100"
                  )}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">{post.commentCount}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Comment on post</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare(post)}
                  className={cn(
                    isDarkMode 
                      ? "text-gray-300 hover:bg-green-950" 
                      : "text-gray-600 hover:bg-green-100"
                  )}
                >
                  <Share className="w-4 h-4 mr-2" />
                  <span className="text-sm">Share</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share post</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    );
  };

  const OptionsModal = ({ postId }: { postId: string }) => (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div 
        ref={modalRef} 
        className={cn(
          "rounded-lg shadow-lg w-64",
          isDarkMode ? "bg-gray-800" : "bg-white"
        )}
      >
        {[
          { text: 'Unfollow', action: 'unfollow', color: 'text-red-500' },
          { text: 'Report', action: 'report', color: 'text-red-500' },
          { text: 'Block user', action: 'block_user', color: 'text-red-500'},
          { text: 'Save post', action: 'save' },
          { text: 'About this Account', action: 'about_account' },
        ].map(({ text, action, color }) => (
          <button
            key={action}
            className={cn(
              "w-full text-center font-bold px-4 py-3 transition duration-300 ease-in-out",
              isDarkMode ? "hover:bg-[#1B2730]" : "hover:bg-gray-100",
              color || (isDarkMode ? "text-white" : "text-gray-800")
            )}
            onClick={() => handleOptionClick(action, postId)}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );

  const ReportModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div 
        ref={reportModalRef}
        className={cn(
          "rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto",
          isDarkMode ? "bg-gray-800" : "bg-white"
        )}
      >
        <div className={cn(
          "p-4 flex justify-between items-center border-b",
          isDarkMode ? "border-gray-700" : "border-gray-200"
        )}>
          <h2 className={cn(
            "text-lg font-semibold",
            isDarkMode ? "text-white" : "text-gray-800"
          )}>
            Report
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCloseReportModal}
            className={cn(
              "p-1 hover:bg-transparent",
              isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
            )}
          >
            <X size={20} />
          </Button>
        </div>
        <div className="py-2">
          {reportReasons.map((reason) => (
            <button
              key={reason}
              onClick={() => handleReportSubmit(reason)}
              className={cn(
                "w-full text-left px-4 py-3 transition duration-200",
                isDarkMode 
                  ? "text-white hover:bg-gray-700" 
                  : "text-gray-800 hover:bg-gray-100"
              )}
            >
              {reason}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={cn(
        "rounded-lg shadow-lg p-6 flex flex-col items-center",
        isDarkMode ? "bg-gray-800" : "bg-white"
      )}>
        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className={cn(
          "text-lg font-semibold mb-2",
          isDarkMode ? "text-white" : "text-gray-800"
        )}>
          Thanks for letting us know
        </h3>
        <p className="text-gray-400 text-center">
          Your feedback helps keep our community safe.
        </p>
      </div>
    </div>
  );

  const EmptyPostsPlaceholder = () => (
    <div className={cn(
      "flex flex-col items-center justify-center h-96 p-6 rounded-md shadow-black drop-shadow-md",
      isDarkMode ? "bg-gray-800" : "bg-white"
    )}>
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 mb-4">
        <Camera size={32} className="text-gray-100" />
      </div>

      <h2 className={cn(
        "text-xl font-semibold mb-2",
        isDarkMode ? "text-white" : "text-gray-800"
      )}>
        No Posts Available
      </h2>
      <p className="text-gray-400">There are no posts to display right now. Check back later or follow more users!</p>
    </div>
  );

  return (
    <div className="flex justify-center px-4 sm:px-6">
      <div className="w-full max-w-2xl">
        <div className="space-y-4">
          {sortedPosts.length > 0 ? (
            sortedPosts.map((post) => (
              <React.Fragment key={post._id}>
                {!post.isBlocked ? (
                  <>
                    <PostComponent {...post} />
                    {openModalId === post._id && <OptionsModal postId={post._id} />}
                  </>
                ) : (
                  <div></div>
                )}
              </React.Fragment>
            ))
          ) : (
            <EmptyPostsPlaceholder />
          )}

          {showReportModal && <ReportModal />}
          {showSuccessModal && <SuccessModal />}
          {showShareModal && <ShareModal />}
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
      </div>
    </div>
  );
};

export default PostList;