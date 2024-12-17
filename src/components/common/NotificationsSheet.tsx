import React, { useState } from 'react';
import { Bell, Image as ImageIcon, MessageCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { api } from '../../api/userApi';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Separate interface definitions for better organization
interface Sender {
  username: string;
  profile_picture?: string;
}

interface PostDetails {
  _id: string;
  mediaUrl?: string;
  postType: 'image' | 'video' | 'note';
  caption?: string;
  userId: {
    username: string;
  };
}

interface CommentDetails {
  content: string;
  postId?: {
    mediaUrl?: string;
    postType: 'image' | 'video' | 'note';
  };
}

interface Notification {
  _id: string;
  recipient: string;
  sender: Sender;
  type: 'follow_request' | 'follow_accept' | 'like' | 'comment' | 'reply_comment';
  content: string;
  postId?: PostDetails;
  commentId?: CommentDetails;
  isRead: boolean;
  createdAt: string;
}

interface NotificationPagination {
  currentPage: number;
  totalPages: number;
  totalNotifications: number;
}

// Utility component for user avatar
const UserAvatar: React.FC<{ user: Sender }> = ({ user }) => {
  if (user.profile_picture) {
    return (
      <img
        src={user.profile_picture}
        alt={`${user.username}'s profile`}
        className="h-10 w-10 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
      <span className="text-gray-600 font-semibold">
        {user.username.charAt(0).toUpperCase()}
      </span>
    </div>
  );
};

// Utility function to format timestamp
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return date.toLocaleDateString();
};

// Media preview component
const MediaPreview: React.FC<{ mediaUrl?: string; postType?: 'image' | 'video' | 'note' }> = ({ 
  mediaUrl, 
  postType 
}) => {
  if (!mediaUrl) return null;

  switch (postType) {
    case 'image':
      return (
        <img
          src={mediaUrl}
          alt="Post media"
          className="w-12 h-12 object-cover rounded"
        />
      );
    case 'video':
      return (
        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-gray-500" />
        </div>
      );
    default:
      return null;
  }
};

// Individual notification item component
const NotificationItem: React.FC<{ 
  notification: Notification; 
  isDarkMode: boolean; 
}> = ({ notification, isDarkMode }) => {
  const { mediaUrl, postType } = (() => {
    switch (notification.type) {
      case 'like':
      case 'comment':
        return { 
          mediaUrl: notification.postId?.mediaUrl, 
          postType: notification.postId?.postType 
        };
      case 'reply_comment':
        return { 
          mediaUrl: notification.commentId?.postId?.mediaUrl, 
          postType: notification.commentId?.postId?.postType 
        };
      default:
        return { mediaUrl: undefined, postType: undefined };
    }
  })();

  return (
    <div
      className={`p-4 flex flex-col border-b ${
        isDarkMode 
          ? 'border-gray-700 hover:bg-gray-700' 
          : 'border-gray-200 hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center mb-2">
        <div className="mr-3">
          <UserAvatar user={notification.sender} />
        </div>
        <div className="flex-1 flex items-center">
          <div className="mr-3">
            <p className="text-sm">{notification.content}</p>
            <span className="text-xs text-gray-500">
              {formatTimestamp(notification.createdAt)}
            </span>
          </div>
          <div className="ml-auto">
            <MediaPreview mediaUrl={mediaUrl} postType={postType} />
          </div>
        </div>
      </div>
      
      {/* Comment display for comment and reply notifications */}
      {(notification.type === 'comment' || notification.type === 'reply_comment') && 
       notification.commentId?.content && (
        <div 
          className={`flex items-start ml-12 mt-2 p-2 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}
        >
          <MessageCircle className="w-4 h-4 mr-2 text-gray-500 mt-1" />
          <p className="text-xs text-gray-600 flex-1">
            {notification.commentId.content}
          </p>
        </div>
      )}
    </div>
  );
};

interface NotificationsSheetProps {
  onNotificationCountUpdate?: (count: number) => void;
}

const NotificationsSheet: React.FC<NotificationsSheetProps> = ({ 
  onNotificationCountUpdate 
}) => {
  const { isDarkMode } = useTheme();
  const { toast } = useToast();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pagination, setPagination] = useState<NotificationPagination>({
    currentPage: 1,
    totalPages: 1,
    totalNotifications: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const response = await api.getUserNotifications(page);

      if (response.success) {
        setNotifications(response.data);
        setPagination({
          currentPage: response.pagination.currentPage,
          totalPages: response.pagination.totalPages,
          totalNotifications: response.pagination.totalNotifications,
        });

        // Update notification count when prop is provided
        if (onNotificationCountUpdate) {
          onNotificationCountUpdate(response.pagination.totalNotifications);
        }
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet onOpenChange={(open) => open && fetchNotifications()}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`relative rounded-full w-10 h-10 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 cursor-pointer ${
            isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white'
          }`}
        >
          <Bell className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          {notifications.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-[#1D9BF0] text-white">
              {notifications.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className={`w-96 p-0 ${
          isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
        }`}
      >
        <SheetHeader
          className={`p-4 border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          } flex flex-row justify-between items-center`}
        >
          <SheetTitle className="text-xl font-bold">
            Notifications
            {pagination.totalNotifications > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                ({pagination.totalNotifications})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                isDarkMode={isDarkMode}
              />
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationsSheet;