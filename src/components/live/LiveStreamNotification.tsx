import React, { useEffect, useState } from 'react';
import { liveStreamApi } from '@/api/liveStreamApi';
import  ILiveStream  from '@/types/ILiveStream';
import { toast } from 'react-toastify';

interface LiveStreamNotificationProps {
  userId: string;
}

const LiveStreamNotification: React.FC<LiveStreamNotificationProps> = ({ userId }) => {
  const [activeLiveStreams, setActiveLiveStreams] = useState<ILiveStream[]>([]);

  useEffect(() => {
    const checkLiveStreams = async () => {
      try {
        const streams = await liveStreamApi.getLiveStreams();
        
        // Compare with previous active streams
        const newStreams = streams.filter(
          stream => !activeLiveStreams.some(
            activeStream => activeStream._id === stream._id
          )
        );

        // Show notifications for new live streams
        newStreams.forEach(stream => {
          const hostName = (stream.host as any).username;
          toast.info(`${hostName} started a live stream!`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            onClick: () => {
              // Navigate to live stream
              window.location.href = `/room/${stream.roomId}`;
            }
          });
        });

        setActiveLiveStreams(streams);
      } catch (error) {
        console.error('Error checking live streams:', error);
      }
    };

    // Initial check
    checkLiveStreams();

    // Set up periodic checks
    const intervalId = setInterval(checkLiveStreams, 30000); // Check every 30 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [userId]);

  return null; // This component doesn't render anything visible
};

export default LiveStreamNotification;