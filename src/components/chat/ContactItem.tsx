import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Contact } from '../../types/IChat';
import { useTheme } from '../../contexts/ThemeContext';

interface ContactItemProps {
  contact: Contact;
  isSelected: boolean;
  onSelect: (contact: Contact) => void;
}

const ContactItem: React.FC<ContactItemProps> = ({ contact, isSelected, onSelect }) => {
  const { isDarkMode } = useTheme();

  return (
    <div 
      onClick={() => onSelect(contact)}
      className={`
        flex items-center p-4 cursor-pointer hover:bg-opacity-10 
        ${isSelected 
          ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-200') 
          : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
        }
      `}
    >
      <Avatar className="h-10 w-10 md:h-12 md:w-12 mr-4">
        <AvatarImage src={contact.profile_picture} alt={contact.name} />
        {/* <AvatarFallback>{contact.username.charAt(0)}</AvatarFallback> */}
      </Avatar>
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-sm md:text-base truncate">{contact.username}</h3>
          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className={`
            text-xs md:text-sm truncate 
            ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
          `}>
            {contact.lastMessage}
          </p>
          {contact.unreadCount > 0 && (
            <span className="bg-[#1D9BF0] text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {contact.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactItem;