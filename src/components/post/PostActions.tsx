import React from 'react';
import { Heart, MessageCircle, Share } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface PostActionsProps {
  isLiked: boolean;
  commentCount: number;
  isDarkMode: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
}

export const PostActions: React.FC<PostActionsProps> = ({
  isLiked,
  commentCount,
  isDarkMode,
  onLike,
  onComment,
  onShare
}) => (
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
            onClick={onLike}
            className={cn(
              isDarkMode 
                ? "hover:bg-red-950 text-gray-300" 
                : "hover:bg-red-100 text-gray-600",
              isLiked && "text-red-500"
            )}
          >
            <Heart className={cn("w-4 h-4 mr-2", isLiked && "fill-current")} />
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
            onClick={onComment}
            className={cn(
              isDarkMode 
                ? "text-gray-300 hover:bg-blue-950" 
                : "text-gray-600 hover:bg-blue-100"
            )}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            <span className="text-sm">{commentCount}</span>
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
            onClick={onShare}
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
);

export default PostActions;