import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const EmptyChat: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <div 
      className={`
        flex items-center justify-center h-full 
        ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}
      `}
    >
      <div className="text-center">
        <MessageCircle 
          className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} 
          size={64} 
        />
        <h2 
          className={`
            text-xl font-semibold mb-2 
            ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}
          `}
        >
          Select a chat to start messaging
        </h2>
        <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
          Choose a contact from the list to begin your conversation
        </p>
      </div>
    </div>
  );
};

export default EmptyChat;