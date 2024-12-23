import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { CheckCheck, Trash2, MoreVertical, Reply } from 'lucide-react';
import { Message } from '@/types/IChat';
import { ChatApi } from '@/api/chatApi';
import { useSocket } from '@/contexts/SocketContext';
import { toast } from 'sonner';
import ImagePreviewModal from './ImagePreviewModal';

interface ChatMessagesProps {
  messages: Message[];
  onMessageDelete?: (messageId: string) => void;
  onReplyToMessage?: (message: Message) => void;
}

const MessageContent: React.FC<{ 
  message: Message;
  onImageClick: (url: string) => void;
  onReply: (message: Message) => void;
}> = ({ message, onImageClick }) => {
  if (message.isDeleted) {
    return <em className="text-gray-400">This message was deleted</em>;
  }

  return (
    <div className="space-y-2 pr-12 pb-4"> {/* Added right padding for actions and bottom padding for timestamp */}
      {message.replyTo && (
        <div className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border-l-2 border-blue-500 mb-2">
          <p className="text-xs text-blue-500 font-medium">
            Reply to {message?.replyTo?.sender?.username}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
            {message.replyTo.text}
          </p>
        </div>
      )}
      
      {message.fileUrl && message.fileType === 'image' ? (
        <div className="relative inline-block">
          <img 
            src={message.fileUrl} 
            alt="Message attachment" 
            className="max-w-[300px] max-h-[300px] rounded-lg cursor-pointer object-cover"
            onClick={() => onImageClick(message.fileUrl!)}
          />
        </div>
      ) : (
        <p className="text-sm md:text-base whitespace-pre-wrap break-words">
          {message.text}
        </p>
      )}
    </div>
  );
};

const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages, 
  onMessageDelete,
  onReplyToMessage 
}) => {
  const { isDarkMode } = useTheme();
  const { socket } = useSocket();
  const userId = useSelector((state: RootState) => state.user?.user?._id);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
    <>
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${chatBgClass}`}>
        {messages?.map((message) => {
          const isOwnMessage = message.sender._id === userId;
          const isSelected = selectedMessage === message._id;

          return (
            <div key={message._id} className="group relative">
              <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                  relative
                  max-w-[85%] sm:max-w-[75%] md:max-w-[65%]
                  p-3
                  rounded-2xl
                  ${isOwnMessage
                    ? (isDarkMode 
                      ? 'bg-emerald-800 text-white' 
                      : 'bg-emerald-600 text-white')
                    : (isDarkMode 
                      ? 'bg-gray-700 text-gray-200' 
                      : 'bg-white text-gray-800 border border-gray-200')
                  }
                  ${message.isDeleted ? 'opacity-60' : ''}
                  shadow-sm
                `}>
                  <MessageContent 
                    message={message} 
                    onImageClick={setPreviewImage}
                    onReply={onReplyToMessage!}
                  />

                  {/* Action buttons */}
                  {!message.isDeleted && (
                    <div className="absolute top-2 right-2 flex items-center space-x-1">
                      <button
                        onClick={() => onReplyToMessage?.(message)}
                        className={`
                          p-1.5 rounded-full 
                          transition-opacity duration-200
                          opacity-0 group-hover:opacity-100
                          ${isOwnMessage 
                            ? 'hover:bg-emerald-700/50' 
                            : 'hover:bg-gray-200 dark:hover:bg-gray-600'}
                        `}
                      >
                        <Reply size={14} />
                      </button>
                      {isOwnMessage && (
                        <button
                          onClick={() => setSelectedMessage(isSelected ? null : message._id)}
                          className={`
                            p-1.5 rounded-full
                            transition-opacity duration-200
                            opacity-0 group-hover:opacity-100
                            ${isOwnMessage 
                              ? 'hover:bg-emerald-700/50' 
                              : 'hover:bg-gray-200 dark:hover:bg-gray-600'}
                          `}
                        >
                          <MoreVertical size={14} />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Timestamp and read status */}
                  <div className="absolute bottom-1 right-3 flex items-center space-x-1">
                    <span className={`
                      text-[10px] 
                      ${isOwnMessage
                        ? 'text-emerald-100/70'
                        : 'text-gray-500 dark:text-gray-400'
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
                          ml-1
                        `}
                        title={message.read ? 'Read' : 'Delivered'}
                      >
                        <CheckCheck size={12} />
                      </span>
                    )}
                  </div>

                  {/* Delete dropdown */}
                  {isSelected && (
                    <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10">
                      <button
                        onClick={() => handleDeleteMessage(message._id)}
                        className="flex items-center px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-sm"
                      >
                        <Trash2 size={14} className="mr-2" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      {previewImage && (
        <ImagePreviewModal
          imageUrl={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </>
  );
};

export default ChatMessages;