import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { useSocket } from './SocketContext';

export interface VideoCallContextType {
  initiateVideoCall: (targetUserId: string, navigate: (path: string) => void) => void;
  answerVideoCall: (roomId: string, navigate: (path: string) => void) => void;
  declineVideoCall: (roomId: string) => void;
  incomingVideoCall: { roomId: string; caller: string } | null;
  isCallEnded: boolean;
  setIsCallEnded: (ended: boolean) => void;
}

const VideoCallContext = createContext<VideoCallContextType>({
  initiateVideoCall: () => {},
  answerVideoCall: () => {},
  declineVideoCall: () => {},
  incomingVideoCall: null,
  isCallEnded: false,
  setIsCallEnded: () => {},
});

export const VideoCallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incomingVideoCall, setIncomingVideoCall] = useState<{
    roomId: string;
    caller: string;
  } | null>(null);
  const [isCallEnded, setIsCallEnded] = useState(false);

  const { socket } = useSocket();
  const user = useSelector((state: RootState) => state?.user?.user);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingVideoCall = ({ roomId, caller }: { roomId: string; caller: string }) => {
      setIncomingVideoCall({ roomId, caller });
    };

    const handleVideoCallDeclined = () => {
      setIncomingVideoCall(null);
      setIsCallEnded(true);
    };

    socket.on('incoming_video_call', handleIncomingVideoCall);
    socket.on('video_call_declined', handleVideoCallDeclined);
    socket.on('call_ended', handleVideoCallDeclined);

    return () => {
      socket.off('incoming_video_call', handleIncomingVideoCall);
      socket.off('video_call_declined', handleVideoCallDeclined);
      socket.off('call_ended', handleVideoCallDeclined);
    };
  }, [socket]);

  const initiateVideoCall = useCallback(
    (targetUserId: string, navigate: (path: string) => void) => {
      if (!socket || !user?._id) return;
      const roomId = `video_${user._id}_${targetUserId}_${Date.now()}`;
      socket.emit('initiate_video_call', { target: targetUserId, roomId, caller: user._id });
      setIsCallEnded(false);
      navigate(`/user/video-call/${roomId}`);
    },
    [socket, user?._id]
  );

  const answerVideoCall = useCallback((roomId: string, navigate: (path: string) => void) => {
    setIncomingVideoCall(null);
    setIsCallEnded(false);
    navigate(`/user/video-call/${roomId}`);
  }, []);

  const declineVideoCall = useCallback(
    (roomId: string) => {
      if (!socket) return;
      socket.emit('decline_video_call', { roomId });
      setIncomingVideoCall(null);
      setIsCallEnded(true);
    },
    [socket]
  );

  return (
    <VideoCallContext.Provider
      value={{
        initiateVideoCall,
        answerVideoCall,
        declineVideoCall,
        incomingVideoCall,
        isCallEnded,
        setIsCallEnded,
      }}
    >
      {children}
    </VideoCallContext.Provider>
  );
};

export const useVideoCall = () => useContext(VideoCallContext);