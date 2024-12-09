import React from 'react';
import { IChat } from '@/types/IChat';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatTimeAgo } from '@/utils/dateUtils';

interface ChatSidebarProps {
  chats: IChat[];
  selectedChat: IChat | null;
  onChatSelect: (chat: IChat) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ 
  chats, 
  selectedChat, 
  onChatSelect 
}) => {
    const user = useSelector((state: RootState) => state.user.user);

  return (
    <div className="w-1/4 border-r overflow-y-auto">
      <div className="p-4 font-bold text-xl border-b">
        Chats
      </div>
      {chats.map(chat => {
        // Assuming chat has participants and last message
        const otherUser = chat.participants.find(p => p._id !== user._id);
        const lastMessage = chat.lastMessage;

        return (
          <div 
            key={chat._id}
            className={`flex p-4 hover:bg-gray-100 cursor-pointer ${
              selectedChat?._id === chat._id ? 'bg-gray-200' : ''
            }`}
            onClick={() => onChatSelect(chat)}
          >
            <Avatar>
              <AvatarImage src={otherUser?.profile_picture} />
              <AvatarFallback>
                {otherUser?.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3 flex-1">
              <div className="flex justify-between">
                <h3 className="font-semibold">{otherUser?.username}</h3>
                {lastMessage && (
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(lastMessage.createdAt)}
                  </span>
                )}
              </div>
              {lastMessage && (
                <p className="text-sm text-gray-600 truncate">
                  {lastMessage.content}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatSidebar