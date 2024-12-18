import React from 'react';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, VideoIcon, MoreVertical, ChevronLeft } from 'lucide-react';
import { Contact } from '../../types/IChat';
import { useTheme } from '../../contexts/ThemeContext';
import { useSocket } from '../../contexts/SocketContext';
import { useNavigate } from 'react-router-dom';

interface ChatHeaderProps {
  selectedChat: Contact;
  onBackClick: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ selectedChat, onBackClick }) => {
  const { isDarkMode } = useTheme();
  const { onlineUsers, initiateVideoCall } = useSocket();
  const navigate = useNavigate();

  const startVideoCall = () => {
    initiateVideoCall(selectedChat.id, navigate);
  };

  const sidebarBgClass = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  // Adjusting online status logic based on new socket context
  const isOnline = Array.isArray(onlineUsers)
    ? onlineUsers.includes(selectedChat.id) // Array of user IDs
    : Boolean(onlineUsers[selectedChat.id]); // Object of user details

  return (
    <div 
      className={`p-4 flex items-center justify-between border-b ${sidebarBgClass}`}
    >
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-4 md:hidden" 
          onClick={onBackClick}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Avatar className="h-10 w-10 md:h-12 md:w-12">
          <AvatarImage src={selectedChat.profile_picture} alt={selectedChat.name} />
        </Avatar>
        <div className="flex flex-col">
          <h2 className="font-bold text-sm md:text-base">{selectedChat.username}</h2>
          <p className={`text-xs md:text-sm flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {isOnline ? (
              <>
                <span className="mr-2 w-2 h-2 rounded-full bg-green-500"></span>
                Online
              </>
            ) : (
              <>
                <span className="mr-2 w-2 h-2 rounded-full bg-gray-400"></span>
                Offline
              </>
            )}
          </p>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className={`rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          <Phone className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          onClick={startVideoCall}
        >
          <VideoIcon className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          <MoreVertical className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
