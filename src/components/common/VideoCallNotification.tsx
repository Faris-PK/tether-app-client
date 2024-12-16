import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '@/contexts/SocketContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';

const VideoCallNotification: React.FC = () => {
  const navigate = useNavigate();
  const { incomingVideoCall, answerVideoCall, declineVideoCall } = useSocket();
  const user = useSelector((state: RootState) => state.user.user);

  if (!incomingVideoCall) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center">
        <h2 className="text-xl mb-4 text-black">Incoming Video Call</h2>
        <p className="mb-4 text-black">From: {incomingVideoCall.caller}</p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => answerVideoCall(incomingVideoCall.roomId, navigate)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Answer
          </button>
          <button 
            onClick={() => declineVideoCall(incomingVideoCall.roomId)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallNotification;