import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MoreVertical, Check, Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns';
import { PostApi } from '@/api/postApi';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Comment } from '@/types/IComment';

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

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  isDarkMode: boolean;
  currentUserId: string;
  fetchPosts: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  onClose,
  post,
  isDarkMode,
  currentUserId,
  fetchPosts
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const editInputRef = useRef<HTMLTextAreaElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const replyInputRef = useRef<HTMLTextAreaElement>(null);
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});



  useEffect(() => {
    if (isOpen) {
      fetchComments();
      if (commentInputRef.current) {
        commentInputRef.current.focus();
      }
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (editingCommentId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingCommentId]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (editingCommentId) {
        setEditingCommentId(null);
      } else {
        handleClose();
      }
    }
  };

  const handleClose = () => {
    if (modalContentRef.current) {
      modalContentRef.current.classList.add('animate-fadeOut');
      setTimeout(() => {
        onClose();
      }, 200);
    } else {
      onClose();
    }
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === modalRef.current) {
      handleClose();
    }
  };

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await PostApi.getPostComments(post._id);
      setComments(response);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await PostApi.addComment(post._id, newComment);
      setComments(prev => [...prev, response]);
      setNewComment('');
      fetchComments();
    //  fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleEditComment = async (commentId: string) => {
    const comment = comments.find(c => c._id === commentId);
    if (comment) {
      setEditingCommentId(commentId);
      setEditContent(comment.content);
    }
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      const updatedComment = await PostApi.editComment(post._id, commentId, editContent);
      setComments(prev => 
        prev.map(comment => 
          comment._id === commentId ? { ...comment, content: updatedComment.content } : comment
        )
      );
      setEditingCommentId(null);
      setEditContent('');
     // fetchPosts();
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await PostApi.deleteComment(post._id, commentId);
      setComments(prev => prev.filter(comment => comment._id !== commentId));
     // fetchPosts();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleSubmitReply = async (parentCommentId: string) => {
    if (!replyContent.trim()) return;

    try {
      const response = await PostApi.addReplyToComment(post._id, parentCommentId, replyContent);
      
      // Update comments to include new reply
      setComments(prevComments => 
        prevComments.map(comment => 
          comment._id === parentCommentId 
            ? { 
                ...comment, 
                replies: [...(comment.replies || []), response] 
              } 
            : comment
        )
      );
      
      setReplyingToCommentId(null);
      setReplyContent('');
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const handleDeleteReply = async (parentCommentId: string, replyId: string) => {
    try {
      await PostApi.deleteComment(post._id, replyId);
      
      // Update comments to remove the specific reply
      setComments(prevComments => 
        prevComments.map(comment => 
          comment._id === parentCommentId 
            ? { 
                ...comment, 
                replies: comment.replies 
                  ? comment.replies.filter(reply => reply._id !== replyId) 
                  : []
              } 
            : comment
        )
      );
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  };

  const toggleRepliesVisibility = (commentId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  

  const CommentActions = ({ comment, isReply = false }: { 
    comment: Comment, 
    isReply?: boolean 
  }) => {
    if (comment.userId._id !== currentUserId) return null;

    const handleDelete = isReply 
      ? () => handleDeleteReply(
          comments.find(c => 
            c.replies?.some(r => r._id === comment._id)
          )?._id || '', 
          comment._id
        )
      : () => handleDeleteComment(comment._id);


    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0",
              isDarkMode 
                ? "text-gray-400 hover:text-white" 
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <MoreVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={cn(
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
        )}>
          {!isReply && (
            <DropdownMenuItem
              onClick={() => handleEditComment(comment._id)}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              )}
            >
              <Pencil size={14} /> Edit
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={handleDelete}
            className={cn(
              "flex items-center gap-2 cursor-pointer text-red-500",
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            )}
          >
            <Trash2 size={14} /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  if (!isOpen) return null;

  // Render method for replies
  const renderReplies = (comment: Comment) => {
    if (!comment.replies || comment.replies.length === 0) return null;

    const isExpanded = expandedComments[comment._id];
    
    return (
      <div>
        {comment.replies.length > 0 && (
          <button 
            onClick={() => toggleRepliesVisibility(comment._id)}
            className="text-sm text-blue-500 hover:text-blue-600 flex items-center ml-10 mt-2"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={14} className="mr-1" /> Hide Replies
              </>
            ) : (
              <>
                <ChevronDown size={14} className="mr-1" /> View {comment.replies.length} Repl{comment.replies.length === 1 ? 'y' : 'ies'}
              </>
            )}
          </button>
        )}

        {isExpanded && comment.replies && comment.replies.map((reply) => (
          <div key={reply._id} className="ml-10 mt-2">
            <div className="flex items-start">
              <img
                src={reply.userId.profile_picture}
                alt={reply.userId.username}
                className="w-6 h-6 rounded-full mr-2"
              />
              <div className="flex-1">
                <div className={cn(
                  "rounded-lg p-2",
                  isDarkMode ? "bg-gray-600" : "bg-gray-200"
                )}>
                  <div className="flex justify-between items-start">
                    <p className={cn(
                      "font-semibold text-xs mb-1",
                      isDarkMode ? "text-white" : "text-black"
                    )}>
                      {reply.userId.username}
                    </p>
                    <CommentActions comment={reply} isReply={true} />
                  </div>
                  <p className={cn(
                    "text-xs",
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  )}>
                    {reply.content}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  

  return (
    <div 
      ref={modalRef}
      onClick={handleOutsideClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn"
    >
      <div 
        ref={modalContentRef}
        className={cn(
          "flex w-full max-w-4xl h-[80vh] rounded-lg shadow-lg overflow-hidden animate-scaleIn",
          isDarkMode ? "bg-gray-800" : "bg-white"
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* Left side - Post Content */}
        <div className="w-1/2 border-r border-gray-200 dark:border-gray-700">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <img
                  src={post.userId.profile_picture}
                  alt={post.userId.username}
                  className="w-8 h-8 rounded-full mr-3"
                />
                <span className={cn(
                  "font-semibold",
                  isDarkMode ? "text-white" : "text-black"
                )}>
                  {post.userId.username}
                </span>
              </div>
            </div>

            {/* Post Image/Content */}
            <div className="flex-1 overflow-hidden">
              {post.postType !== 'note' && (
                <img 
                  src={post.mediaUrl} 
                  alt="Post content"
                  className="w-full h-full object-cover"
                />
              )}
              {post.postType === 'note' && (
                <div className={cn(
                  "p-4",
                  isDarkMode ? "text-gray-300" : "text-gray-800"
                )}>
                  {post.caption}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Comments */}
        <div className="w-1/2 flex flex-col h-full relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className={cn(
              "absolute top-2 right-2 rounded-full p-1 hover:bg-opacity-10 z-10",
              isDarkMode 
                ? "text-gray-400 hover:text-white hover:bg-white" 
                : "text-gray-600 hover:text-gray-900 hover:bg-black"
            )}
          >
            <X size={20} />
          </Button>

          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className={cn(
                  "animate-spin rounded-full h-8 w-8 border-2",
                  isDarkMode ? "border-white" : "border-gray-800"
                )} />
              </div>
            ) : comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>No comments yet.</p>
                <p>Be the first to comment!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="mb-4">
                  <div className="flex items-start group">
                    <img
                      src={comment.userId.profile_picture}
                      alt={comment.userId.username}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <div className="flex-1">
                      <div className={cn(
                        "rounded-lg p-3",
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      )}>
                        <div className="flex justify-between items-start">
                          <p className={cn(
                            "font-semibold text-sm mb-1",
                            isDarkMode ? "text-white" : "text-black"
                          )}>
                            {comment.userId.username}
                          </p>
                          <CommentActions comment={comment} />
                        </div>
                        
                        {editingCommentId === comment._id ? (
                          <div className="mt-2">
                            <textarea
                              ref={editInputRef}
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className={cn(
                                "w-full resize-none rounded-lg p-2 text-sm focus:outline-none focus:ring-2",
                                isDarkMode 
                                  ? "bg-gray-600 text-white placeholder-gray-400 focus:ring-blue-500" 
                                  : "bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-400"
                              )}
                              rows={2}
                            />
                            <div className="flex justify-end gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingCommentId(null)}
                                className={cn(
                                  "text-sm",
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                )}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleSaveEdit(comment._id)}
                                className="text-sm bg-blue-500 hover:bg-blue-600 text-white"
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className={cn(
                            "text-sm",
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          )}>
                            {comment.content}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </p>
                      <button 
                          onClick={() => setReplyingToCommentId(
                            replyingToCommentId === comment._id ? null : comment._id
                          )}
                          className="text-sm text-blue-500 hover:text-blue-600"
                        >
                          Reply
                        </button>
                        {renderReplies(comment)}
                         {/* New Reply Input Field */}
                      {replyingToCommentId === comment._id && (
                        <div className="w-full mt-2">
                          <div className="flex items-center">
                            <textarea
                              ref={replyInputRef}
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="Write a reply..."
                              className={cn(
                                "flex-1 resize-none rounded-lg p-2 mr-2 focus:outline-none focus:ring-2",
                                isDarkMode 
                                  ? "bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500" 
                                  : "bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-blue-400"
                              )}
                              rows={2}
                            />
                            <Button
                              onClick={() => handleSubmitReply(comment._id)}
                              disabled={!replyContent.trim()}
                              className={cn(
                                "rounded-full p-2",
                                isDarkMode
                                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                                  : "bg-blue-500 hover:bg-blue-600 text-white"
                              )}
                            >
                              <Send size={16} />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Comment input */}
          <form 
            onSubmit={handleSubmitComment}
            className={cn(
              "p-4 border-t",
              isDarkMode ? "border-gray-700" : "border-gray-200"
            )}
          >
            <div className="flex items-center">
              <textarea
                ref={commentInputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className={cn(
                  "flex-1 resize-none rounded-lg p-2 mr-2 focus:outline-none focus:ring-2",
                  isDarkMode 
                    ? "bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500" 
                    : "bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-blue-400"
                )}
                rows={1}
              />
              <Button
                type="submit"
                disabled={!newComment.trim()}
                className={cn(
                  "rounded-full p-2",
                  isDarkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                )}
              >
                <Send size={20} />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;