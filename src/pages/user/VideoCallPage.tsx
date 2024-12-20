import  { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '@/contexts/SocketContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { Camera, CameraOff, Mic, MicOff, PhoneOff } from 'lucide-react';

const VideoCallPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const user = useSelector((state: RootState) => state.user.user);

  const userVideo = useRef<HTMLVideoElement>(null);
  const partnerVideo = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const userStream = useRef<MediaStream | null>(null);
  const otherUsers = useRef<string[]>([]);

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callState, setCallState] = useState<'connecting' | 'connected' | 'ended'>('connecting');

  useEffect(() => {
    if (!user?._id || !roomId) {
      navigate('/user/home');
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
        userStream.current = stream;
        socket?.emit('join_video_room', roomId);

        socket?.on('other_users_in_room', (users: string[]) => {
          otherUsers.current = users;
          users.forEach(callUser);
        });

        socket?.on('new_user_joined', (userId: string) => {
          if (!otherUsers.current.includes(userId)) {
            otherUsers.current.push(userId);
          }
        });

        socket?.on('call_ended', handleCallEnded);
        socket?.on('offer', handleReceiveCall);
        socket?.on('answer', handleAnswer);
        socket?.on('ice-candidate', handleNewICECandidateMsg);
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
        navigate('/user/home');
      });

    return () => {
      userStream.current?.getTracks().forEach(track => track.stop());
      peerRef.current?.close();
      socket?.off('other_users_in_room');
      socket?.off('new_user_joined');
      socket?.off('call_ended');
      socket?.off('offer');
      socket?.off('answer');
      socket?.off('ice-candidate');
      
      // Notify other participants that we're leaving
      socket?.emit('end_call', { roomId });
    };
  }, [roomId, socket, user?._id]);

  const toggleAudio = () => {
    if (userStream.current) {
      const audioTrack = userStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setIsAudioEnabled(!isAudioEnabled);
      }
    }
  };

  const toggleVideo = () => {
    if (userStream.current) {
      const videoTrack = userStream.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  const endCall = () => {
    socket?.emit('end_call', { roomId });
    handleCallEnded();
  };

  const handleCallEnded = () => {
    userStream.current?.getTracks().forEach(track => track.stop());
    peerRef.current?.close();
    setCallState('ended');
    navigate('/user/home');
  };

  function callUser(userId: string) {
    peerRef.current = createPeer(userId);
    userStream.current?.getTracks().forEach((track) => {
      peerRef.current?.addTrack(track, userStream.current!);
    });
  }

  function createPeer(userId: string): RTCPeerConnection {
    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.stunprotocol.org' },
        {
          urls: 'turn:numb.viagenie.ca',
          credential: 'muazkh',
          username: 'webrtc@live.com',
        },
      ],
    });

    peer.onicecandidate = handleICECandidateEvent;
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userId);

    return peer;
  }

  function handleNegotiationNeededEvent(userId: string) {
    peerRef.current
      ?.createOffer()
      .then((offer) => peerRef.current?.setLocalDescription(offer))
      .then(() => {
        const payload = {
          target: userId,
          caller: user?._id,
          sdp: peerRef.current?.localDescription,
        };
        socket?.emit('offer', payload);
      })
      .catch((e) => console.error(e));
  }

  function handleReceiveCall(incoming: { sdp: RTCSessionDescriptionInit; caller: string }) {
    peerRef.current = createPeer(incoming.caller);
    const desc = new RTCSessionDescription(incoming.sdp);

    peerRef.current
      ?.setRemoteDescription(desc)
      .then(() => {
        userStream.current?.getTracks().forEach((track) => {
          peerRef.current?.addTrack(track, userStream.current!);
        });
      })
      .then(() => peerRef.current?.createAnswer())
      .then((answer) => peerRef.current?.setLocalDescription(answer))
      .then(() => {
        const payload = {
          target: incoming.caller,
          caller: user?._id,
          sdp: peerRef.current?.localDescription,
        };
        socket?.emit('answer', payload);
      })
      .catch((e) => console.error(e));
  }

  function handleAnswer(message: { sdp: RTCSessionDescriptionInit }) {
    const desc = new RTCSessionDescription(message.sdp);
    peerRef.current?.setRemoteDescription(desc).catch((e) => console.error(e));
  }

  function handleICECandidateEvent(e: RTCPeerConnectionIceEvent) {
    if (e.candidate) {
      const payload = {
        target: otherUsers.current[0], // For simplicity, targeting first user
        candidate: e.candidate,
      };
      socket?.emit('ice-candidate', payload);
    }
  }

  function handleNewICECandidateMsg(incoming: { candidate: RTCIceCandidateInit }) {
    const candidate = new RTCIceCandidate(incoming.candidate);
    peerRef.current?.addIceCandidate(candidate).catch((e) => console.error(e));
  }

  function handleTrackEvent(e: RTCTrackEvent) {
    if (partnerVideo.current) {
      partnerVideo.current.srcObject = e.streams[0];
      setCallState('connected');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="relative w-full max-w-6xl">
        {/* Main call grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Partner video (large) */}
          <div className="relative col-span-1 md:col-span-2 aspect-video">
            <video
              ref={partnerVideo}
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-lg bg-gray-800"
            />
            {callState === 'connecting' && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 rounded-lg">
                <div className="text-white text-xl font-semibold">Connecting...</div>
              </div>
            )}
          </div>
          
          {/* User video (small) */}
          <div className="absolute top-4 right-4 w-48 aspect-video">
            <video
              ref={userVideo}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-lg bg-gray-800 shadow-lg"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-4 bg-gray-800 px-6 py-3 rounded-full shadow-lg">
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-full ${
                isAudioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isAudioEnabled ? (
                <Mic className="w-6 h-6 text-white" />
              ) : (
                <MicOff className="w-6 h-6 text-white" />
              )}
            </button>

            <button
              onClick={endCall}
              className="p-4 bg-red-500 hover:bg-red-600 rounded-full mx-2"
            >
              <PhoneOff className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full ${
                isVideoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isVideoEnabled ? (
                <Camera className="w-6 h-6 text-white" />
              ) : (
                <CameraOff className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallPage;
