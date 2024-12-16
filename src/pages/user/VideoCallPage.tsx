import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '@/contexts/SocketContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';

const VideoCallPage: React.FC = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const user = useSelector((state: RootState) => state.user.user);

  const userVideo = useRef<HTMLVideoElement>(null);
  const partnerVideo = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const userStream = useRef<MediaStream | null>(null);
  const otherUsers = useRef<string[]>([]);

  const [callState, setCallState] = useState<'connecting' | 'connected' | 'ended'>('connecting');

  useEffect(() => {
    if (!user?._id || !roomId) {
      navigate('/user/home');
      return;
    }

    // Request camera and microphone access
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
        userStream.current = stream;

        // Join video room
        socket?.emit('join_video_room', roomId);

        // Listen for other users in the room
        socket?.on('other_users_in_room', (users: string[]) => {
          otherUsers.current = users;
          users.forEach(callUser);
        });

        // Listen for new user joining
        socket?.on('new_user_joined', (userId: string) => {
          if (!otherUsers.current.includes(userId)) {
            otherUsers.current.push(userId);
          }
        });

        // WebRTC signaling events
        socket?.on('offer', handleReceiveCall);
        socket?.on('answer', handleAnswer);
        socket?.on('ice-candidate', handleNewICECandidateMsg);
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
        navigate('/user/home');
      });

    return () => {
      // Cleanup
      userStream.current?.getTracks().forEach(track => track.stop());
      peerRef.current?.close();
      socket?.off('other_users_in_room');
      socket?.off('new_user_joined');
      socket?.off('offer');
      socket?.off('answer');
      socket?.off('ice-candidate');
    };
  }, [roomId, socket, user?._id]);

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

  function endCall() {
    userStream.current?.getTracks().forEach(track => track.stop());
    peerRef.current?.close();
    navigate('/user/home');
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="video-container flex space-x-4">
        <div className="local-video">
          <video 
            ref={userVideo} 
            autoPlay 
            playsInline 
            muted 
            className="w-64 h-48 bg-black rounded-lg"
          />
          <p>You</p>
        </div>
        <div className="remote-video">
          <video 
            ref={partnerVideo} 
            autoPlay 
            playsInline 
            className="w-64 h-48 bg-black rounded-lg"
          />
          <p>Partner</p>
        </div>
      </div>
      <div className="mt-4">
        <button 
          onClick={endCall} 
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          End Call
        </button>
      </div>
      {callState === 'connecting' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <p className="text-white">Connecting...</p>
        </div>
      )}
    </div>
  );
};

export default VideoCallPage;