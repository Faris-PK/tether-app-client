import React, { useEffect, useRef } from 'react';
import { Contact } from '../../types/IChat';
import { useTheme } from '../../contexts/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { CheckCheck } from 'lucide-react';
import { useSocket } from '@/contexts/SocketContext';

interface ChatMessagesProps {
  selectedChat: Contact;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ selectedChat }) => {
  const { isDarkMode } = useTheme();
  const userId = useSelector((state: RootState) => state.user?.user?._id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedChat.messages]);
  

  


  const chatBgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';

  return (
    <div className={`flex-1 overflow-y-auto p-4 space-y-3 md:space-y-4 ${chatBgClass}`}>
      {selectedChat.messages?.map((message) => (
        <div key={message.id} className="mb-2">
          <div 
            className={`flex ${
              message.sender._id === userId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div 
              className={`
                max-w-[70%] p-2 md:p-3 rounded-lg relative
                ${message.sender._id === userId
                  ? (isDarkMode 
                    ? 'bg-emerald-800 text-white' 
                    : 'bg-emerald-600 text-white')
                  : (isDarkMode 
                    ? 'bg-gray-700 text-gray-200' 
                    : 'bg-gray-200 text-gray-800')
                }
                shadow-sm
              `}
            >
              <p className="text-sm md:text-base pr-14">{message.text}</p>
              <div 
                className="absolute bottom-1 right-2 flex items-center space-x-1"
              >
                {/* Time */}
                <span 
                  className={`
                    text-[10px] 
                    ${message.sender._id === userId
                      ? (isDarkMode ? 'text-gray-300' : 'text-gray-100')
                      : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                    }
                  `}
                >
                  {new Date(message.createdAt).toLocaleString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
                
                {/* Tick icon with conditional color */}
                {message.sender._id === userId && (
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
            </div>
          </div>
        </div>
        
      ))}
      <div ref={messagesEndRef} />

    </div>
  );
};

export default ChatMessages;




