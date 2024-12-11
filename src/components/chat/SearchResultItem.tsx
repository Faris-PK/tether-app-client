import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle } from 'lucide-react';
import { Contact } from '../../types/IChat';
import { useTheme } from '../../contexts/ThemeContext';

interface SearchResultItemProps {
  user: Contact;
  onStartChat: (user: Contact) => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ user, onStartChat }) => {
  const { isDarkMode } = useTheme();

  console.log('users: ', user);
  

  return (
    <div 
      className={`
        flex items-center p-4 justify-between cursor-pointer 
        ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
      `}
    >
      <div className="flex items-center">
        <Avatar className="h-10 w-10 md:h-12 md:w-12 mr-4">
          <AvatarImage src={user.profile_picture} />
        </Avatar>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-sm md:text-base truncate">{user.username}</h3>
          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {/* {contact.messages[contact.messages.length - 1].timestamp} */}
          </span>
        </div>
      </div>
      <Button
        onClick={() => onStartChat(user)}
        variant="ghost"
        className={`
          ${isDarkMode 
            ? 'text-gray-300 hover:bg-gray-600' 
            : 'text-gray-600 hover:bg-gray-200'}
        `}
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        Start Chat
      </Button>
    </div>
  );
};

export default SearchResultItem;
