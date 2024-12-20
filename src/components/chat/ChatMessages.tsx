import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { CheckCheck, Trash2, MoreVertical } from 'lucide-react';
import { Message } from '@/types/IChat';
import { ChatApi } from '@/api/chatApi';
import { useSocket } from '@/contexts/SocketContext';
import { toast } from 'sonner';

interface ChatMessagesProps {
  messages: Message[];
  onMessageDelete?: (messageId: string) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, onMessageDelete }) => {
  const { isDarkMode } = useTheme();
  const { socket } = useSocket();
  const userId = useSelector((state: RootState) => state.user?.user?._id);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await ChatApi.deleteMessage(messageId);
      onMessageDelete?.(messageId);
      setSelectedMessage(null);
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast.error('Failed to delete message');
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('message_deleted', (messageId: string) => {
        onMessageDelete?.(messageId);
      });

      return () => {
        socket.off('message_deleted');
      };
    }
  }, [socket, onMessageDelete]);

  const chatBgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';

  return (
    <div className={`flex-1 overflow-y-auto p-4 space-y-3 md:space-y-4 ${chatBgClass}`}>
      {messages?.map((message) => {
        const isOwnMessage = message.sender._id === userId;
        const isSelected = selectedMessage === message._id;

        return (
          <div key={message._id} className="mb-2">
            <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
              <div className={`
                max-w-[70%] p-2 md:p-3 rounded-lg relative
                ${isOwnMessage
                  ? (isDarkMode 
                    ? 'bg-emerald-800 text-white' 
                    : 'bg-emerald-600 text-white')
                  : (isDarkMode 
                    ? 'bg-gray-700 text-gray-200' 
                    : 'bg-gray-200 text-gray-800')
                }
                ${message.isDeleted ? 'opacity-60' : ''}
                shadow-sm group
              `}>
                <p className="text-sm md:text-base pr-14">
                  {message.isDeleted ? (
                    <em className="text-gray-400">This message was deleted</em>
                  ) : (
                    message.text
                  )}
                </p>
                <div className="absolute bottom-1 right-2 flex items-center space-x-1">
                  <span className={`
                    text-[10px] 
                    ${isOwnMessage
                      ? (isDarkMode ? 'text-gray-300' : 'text-gray-100')
                      : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                    }
                  `}>
                    {new Date(message.createdAt).toLocaleString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </span>
                  
                  {isOwnMessage && !message.isDeleted && (
                    <span 
                      className={`
                        ${message.read ? 'text-blue-400' : 'text-gray-400'}
                      `}
                      title={message.read ? 'Read' : 'Delivered'}
                    >
                      <CheckCheck size={14} />
                    </span>
                  )}
                </div>

                {/* Message actions */}
                {isOwnMessage && !message.isDeleted && (
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => setSelectedMessage(isSelected ? null : message._id)}
                      className="p-1 rounded-full hover:bg-gray-700/20 invisible group-hover:visible"
                    >
                      <MoreVertical size={16} />
                    </button>
                    
                    {isSelected && (
                      <div className="absolute right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10">
                        <button
                          onClick={() => handleDeleteMessage(message._id)}
                          className="flex items-center px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;