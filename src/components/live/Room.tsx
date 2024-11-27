import React, { useRef, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { liveStreamApi } from '@/api/liveStreamApi';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';

const Room = () => {
    const { roomId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const user = useSelector((state: RootState) => state.user?.user);

    
    const isHost = location.state?.isHost || false;
    const liveStreamId = location.state?.liveStreamId;

    useEffect(() => {
        if (!roomId) {
            console.error("Room ID is required");
            navigate('/');
            return;
        }

        const liveStream = async () => {
            const appID = Number(import.meta.env.VITE_APP_ID);
            const serverSecret = import.meta.env.VITE_SERVER_SECRET;

            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                appID,
                serverSecret,
                roomId,
                Date.now().toString(),
                isHost ? user?.username : user?.username
            );

            const zp = ZegoUIKitPrebuilt.create(kitToken);

            // Handling host leaving the stream
            const handleHostLeave = async () => {
                if (isHost && liveStreamId) {
                    try {
                        // Call the leave livestream API
                        await liveStreamApi.leaveLiveStream(liveStreamId);
                        
                        toast.info('Live stream ended', {
                            position: "top-right",
                            autoClose: 3000,
                        });

                        // Navigate back to home or appropriate page
                        navigate('/');
                    } catch (error) {
                        console.error('Error leaving live stream:', error);
                        toast.error('Failed to end live stream', {
                            position: "top-right",
                            autoClose: 3000,
                        });
                    }
                }
            };

            // Confirmation dialog for host leaving
            const confirmHostLeave = () => {
                if (isHost) {
                    const confirmEnd = window.confirm('Are you sure you want to end the live stream?');
                    if (confirmEnd) {
                        handleHostLeave();
                    }
                }
            };

            zp.joinRoom({
                container: containerRef.current,
                scenario: {
                    mode: ZegoUIKitPrebuilt.LiveStreaming,
                    config: {
                        role: isHost 
                            ? ZegoUIKitPrebuilt.Host 
                            : ZegoUIKitPrebuilt.Audience
                    }
                },
                turnOnMicrophoneWhenJoining: isHost,
                turnOnCameraWhenJoining: isHost,
                showMyCameraToggleButton: isHost,
                showMyMicrophoneToggleButton: isHost,
                branding: {
                    logoURL: "/src/assets/tether-favicon.svg"
                },
                sharedLinks: [
                    {
                        name: 'Copy Room Link',
                        url: `http://localhost:5173/room/${roomId}`
                    }
                ],
                onLeaveRoom: handleHostLeave
            });

            // For hosts, add a custom method to trigger leave confirmation
            if (isHost) {
                // You might need to customize how this is triggered based on Zego UI
                window.addEventListener('beforeunload', (e) => {
                    e.preventDefault();
                    confirmHostLeave();
                });
            }

            // Cleanup function
            return () => {
                zp.destroy();
            };
        };

        liveStream();
    }, [roomId, isHost, navigate, liveStreamId]);

    return (
        <div ref={containerRef} className="relative w-full h-screen">
            <div className="absolute inset-0 flex justify-center items-center">
                <div className="relative w-full h-full overflow-hidden">
                    <video className="w-full h-full object-contain" />
                </div>
            </div>
        </div>
    );
};

export default Room;