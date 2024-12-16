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

interface OnlineStatus {
  [userId: string]: boolean;
}

interface SocketContextType {
  socket: Socket | null;
  notifications: Notification[];
  messages: Message[];
  onlineUsers: OnlineStatus;
  markNotificationAsRead: (notificationId: string) => void;
  addMessage: (message: Message) => void;
  initiateVideoCall: (targetUserId: string, navigate: (path: string) => void) => void;
  answerVideoCall: (roomId: string, navigate: (path: string) => void) => void;
  declineVideoCall: (roomId: string) => void;
  incomingVideoCall: { roomId: string; caller: string } | null;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  notifications: [],
  messages: [],
  onlineUsers: {},
  markNotificationAsRead: () => {},
  addMessage: () => {},
  initiateVideoCall: () => {},
  answerVideoCall: () => {},
  declineVideoCall: () => {},
  incomingVideoCall: null,
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineStatus>({});
  const [incomingVideoCall, setIncomingVideoCall] = useState<{
    roomId: string;
    caller: string;
  } | null>(null);

  const user = useSelector((state: RootState) => state?.user?.user);

  const sendHeartbeat = useCallback(() => {
    if (socket && user?._id) {
      socket.emit('user_activity', user._id);
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

      newSocket.emit('authenticate', user._id);

      newSocket.on('user_status_change', ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
        setOnlineUsers((prev) => ({ ...prev, [userId]: isOnline }));
      });

      newSocket.on('new_notification', (notification: Notification) => {
        setNotifications((prev) => [notification, ...prev]);
        toast.info(notification.content, { position: 'top-right', autoClose: 5000 });
      });

      newSocket.on('new_message', (message: Message) => {
        setMessages((prev) => [...prev, message]);
        toast.info(`New message from ${message.sender.username}`, { position: 'top-right', autoClose: 5000 });
      });

      newSocket.on('incoming_video_call', ({ roomId, caller }: { roomId: string; caller: string }) => {
        setIncomingVideoCall({ roomId, caller });
        // toast.info(`Incoming video call from ${caller}`, {
        //   position: 'top-right',
        //   autoClose: false,
          //onClick: () => navigate(`/user/video-call/${roomId}`),
      //  });
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

  const initiateVideoCall = useCallback(
    (targetUserId: string, navigate: (path: string) => void) => {
      if (!socket || !user?._id) return;
      const roomId = `video_${user._id}_${targetUserId}_${Date.now()}`;
      socket.emit('initiate_video_call', { target: targetUserId, roomId, caller: user._id });
      navigate(`/user/video-call/${roomId}`);
    },
    [socket, user?._id]
  );

  const answerVideoCall = useCallback((roomId: string, navigate: (path: string) => void) => {
    setIncomingVideoCall(null);
    navigate(`/user/video-call/${roomId}`);
  }, []);

  const declineVideoCall = useCallback(
    (roomId: string) => {
      if (!socket) return;
      socket.emit('decline_video_call', { roomId });
      setIncomingVideoCall(null);
    //  toast.info('Video call declined', { position: 'top-right', autoClose: 3000 });
    },
    [socket]
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        messages,
        onlineUsers,
        markNotificationAsRead,
        addMessage,
        initiateVideoCall,
        answerVideoCall,
        declineVideoCall,
        incomingVideoCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
