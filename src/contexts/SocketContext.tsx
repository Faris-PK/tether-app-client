import React, { createContext, useState, useContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { toast } from 'react-toastify';

interface SocketContextType {
  socket: Socket | null;
  notifications: Notification[];
  markNotificationAsRead: (notificationId: string) => void;
}

interface Notification {
  _id: string;
  recipient: string;
  sender: {
    username: string;
    profile_picture: string;
  };
  type: 'like' | 'comment' | 'follow_request' | 'follow_accept';
  content: string;
  read: boolean;
  postId?: string;
  createdAt: Date;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  notifications: [],
  markNotificationAsRead: () => {},
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const user = useSelector((state: RootState) => state?.user?.user);

  useEffect(() => {
    if (user?._id) {
      // Create socket connection
      const newSocket = io(import.meta.env.VITE_BASE_URL, {
        withCredentials: true,
      });

      // Authenticate the socket connection
      newSocket.emit('authenticate', user._id);

      // Listen for new notifications
      newSocket.on('new_notification', (notification: Notification) => {
        setNotifications(prev => [notification, ...prev]);
        
        // Show toast notification
        toast.info(notification.content, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });

      setSocket(newSocket);

      // Clean up socket connection
      return () => {
        newSocket.disconnect();
      };
    }
  }, [user?._id]);

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      // Here you would typically call an API to mark the notification as read
      // For now, we'll update the local state
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <SocketContext.Provider value={{ 
      socket, 
      notifications,
      markNotificationAsRead 
    }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket context
export const useSocket = () => useContext(SocketContext);