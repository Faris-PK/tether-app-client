import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Message } from '@/types/IChat';

export interface Notification {
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

interface SocketContextType {
  socket: Socket | null;
  notifications: Notification[];
  messages: Message[];
  onlineUsers: string[];
  markNotificationAsRead: (notificationId: string) => void;
  addMessage: (message: Message) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  notifications: [],
  messages: [],
  onlineUsers: [],
  markNotificationAsRead: () => {},
  addMessage: () => {},
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const user = useSelector((state: RootState) => state?.user?.user);

  const sendHeartbeat = useCallback(() => {
    if (socket && user?._id) {
      socket.emit('user_activity');
    }
  }, [socket, user?._id]);

  useEffect(() => {
    const heartbeatInterval = setInterval(sendHeartbeat, 2 * 60 * 1000);
    return () => clearInterval(heartbeatInterval);
  }, [sendHeartbeat]);

  useEffect(() => {
    if (user?._id) {
      const newSocket = io(import.meta.env.VITE_BASE_URL, {
        withCredentials: true,
        query: { userId: user._id },
      });

      newSocket.on('getOnlineUsers', (userIds: string[]) => {
        setOnlineUsers(userIds);
      });

      newSocket.on('user_status_change', ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
        setOnlineUsers((prev) =>
          isOnline
            ? [...new Set([...prev, userId])]
            : prev.filter((id) => id !== userId)
        );
      });

      newSocket.on('new_notification', (notification: Notification) => {
        setNotifications((prev) => [notification, ...prev]);
        toast.info(notification.content, { position: 'top-right', autoClose: 5000 });
      });

      newSocket.on('new_message', (message: Message) => {
        setMessages((prev) => [...prev, message]);
        toast.info(`New message from ${message.sender.username}`, { position: 'top-right', autoClose: 5000 });
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user?._id]);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification._id === notificationId ? { ...notification, read: true } : notification))
    );
  }, []);

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        messages,
        onlineUsers,
        markNotificationAsRead,
        addMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);