import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Send } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface User {
  username: string;
  profile_picture: string;
}

interface Comment {
  _id: string;
  userId: User;
  content: string;
  createdAt: string;
  likes: string[];
}

interface Post {
  _id: string;
  userId: User;
  caption: string;
  mediaUrl: string;
  postType: string;
  comments: Comment[];
}

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  currentUserId: string;
}

const CommentModal: React.FC<CommentModalProps> = ({ 
  isOpen, 
  onClose, 
  post, 
  currentUserId 
}) => {
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    // In a real app, this would be handled by an API call
    console.log('New comment:', newComment);
    setNewComment('');
  };

  const CommentItem = ({ comment }: { comment: Comment }) => (
    <div className="flex space-x-3 py-4">
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.userId.profile_picture} alt={comment.userId.username} />
        <AvatarFallback>{comment.userId.username[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-sm text-white">
            {comment.userId.username}
          </span>
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-gray-200 mt-1">{comment.content}</p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] bg-[#010F18] text-white p-0 gap-0">
        <div className="flex h-[600px]">
          {/* Left side - Post Preview */}
          <div className="flex-1 border-r border-gray-800">
            {post.postType !== 'note' && (
              <div className="relative h-full">
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <img 
                    src={post.mediaUrl} 
                    alt="Post content" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right side - Comments */}
          <div className="w-96 flex flex-col">
            {/* Comments Header */}
            <DialogHeader className="p-4 border-b border-gray-800">
              <DialogTitle>Comments</DialogTitle>
            </DialogHeader>

            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.userId.profile_picture} alt={post.userId.username} />
                  <AvatarFallback>{post.userId.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-semibold text-sm">{post.userId.username}</span>
                  <p className="text-sm text-gray-300">{post.caption}</p>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <ScrollArea className="flex-1 p-4">
              {post.comments.map((comment) => (
                <CommentItem key={comment._id} comment={comment} />
              ))}
            </ScrollArea>

            {/* Comment Input */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-[#1B2730] text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCommentSubmit();
                    }
                  }}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleCommentSubmit}
                  disabled={!newComment.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentModal;