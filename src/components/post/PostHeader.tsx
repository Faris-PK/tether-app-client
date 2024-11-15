import React from 'react';
import { MapPin, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom'; 
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';

interface PostHeaderProps {
  userId: string;
  username: string;
  profilePicture: string;
  location: string;
  createdAt: string;
  isDarkMode: boolean;
  onOptionsClick: () => void;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  userId,
  username,
  profilePicture,
  location,
  createdAt,
  isDarkMode,
  onOptionsClick
}) => {
  const navigate = useNavigate(); 
  const user = useSelector((state: RootState) => state.user.user);

  const handleNavigateToProfile = () => {
    if (userId === user?._id) {
      navigate('/user/profile');
    } else {
      navigate(`/user/userProfile/${userId}`);
    }
  };

  return (
    <div className="flex justify-between items-start mb-4">
      <div
        className="flex items-center cursor-pointer"
        onClick={handleNavigateToProfile} 
      >
        <img
          src={profilePicture}
          alt={username}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h3 className={cn(
            "font-bold",
            isDarkMode ? "text-white" : "text-black"
          )}>
            {username}
          </h3>
          {location && (
            <div className={cn(
              "flex items-center text-md",
              isDarkMode ? "text-gray-400" : "text-gray-800"
            )}>
              <MapPin size={14} className="mr-1" />
              <span>{location}</span>
            </div>
          )}
          <span className={cn(
            "text-sm",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onOptionsClick}
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
  );
};

export default PostHeader;
