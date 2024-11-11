import React, { useState } from 'react';
import  PostHeader  from './PostHeader';
import { PostActions } from './PostActions';
import { cn } from "@/lib/utils";

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
  
interface SinglePostProps {
  post: Post;
  currentUserId: string;
  isDarkMode: boolean;
  onLike: (postId: string) => Promise<void>;
  onComment: (post: Post) => void;
  onShare: (post: Post) => void;
  onOptionsClick: () => void;
}

 const SinglePost: React.FC<SinglePostProps> = ({
  post,
  currentUserId,
  isDarkMode,
  onLike,
  onComment,
  onShare,
  onOptionsClick
}) => {
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUserId));
  const [imageLoaded, setImageLoaded] = useState(false);

  const handlePostLike = async () => {
    await onLike(post._id);
    setIsLiked(!isLiked);
  };

  return (
    <div className={cn(
      "p-4 mb-4 rounded-xl transition-colors duration-200 shadow-black drop-shadow-md",
      isDarkMode ? "bg-gray-800" : "bg-white"
    )}>
      <PostHeader
        username={post.userId.username}
        profilePicture={post.userId.profile_picture}
        location={post.location}
        createdAt={post.createdAt}
        isDarkMode={isDarkMode}
        onOptionsClick={onOptionsClick}
      />

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

      <PostActions
        isLiked={isLiked}
        commentCount={post.commentCount || 0}
        isDarkMode={isDarkMode}
        onLike={handlePostLike}
        onComment={() => onComment(post)}
        onShare={() => onShare(post)}
      />
    </div>
  );
};

export default SinglePost;