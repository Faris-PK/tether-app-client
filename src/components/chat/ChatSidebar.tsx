import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, X, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ContactItem from './ContactItem';
import SearchResultItem from './SearchResultItem';
import { Contact } from '../../types/IChat';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { ChatApi } from '../../api/chatApi';
import { toast } from 'sonner';
import debounce from 'lodash/debounce';

interface ChatSidebarProps {
  contacts: Contact[];
  selectedChat: Contact | null; 
  onContactSelect: (contact: Contact) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  onNewChatStart: (contact: Contact) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ 
  contacts, 
  selectedChat, 
  onContactSelect, 
  isSidebarOpen, 
  toggleSidebar,
  onNewChatStart
}) => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [searchResults, setSearchResults] = useState<Contact[]>([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Resize effect
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      // Automatically show sidebar on larger screens
      if (window.innerWidth >= 768 && !isSidebarOpen) {
        toggleSidebar();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Debounced search function
  const debouncedSearchUsers = useCallback(
    debounce(async (query: string) => {
      if (query.trim() === '') {
        setSearchResults([]);
        setIsSearching(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const results = await ChatApi.searchUsers(query);
        setSearchResults(results);
        setIsSearching(results.length > 0);
      } catch (error) {
        toast.error('Failed to search users');
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  // Handle search query changes
  useEffect(() => {
    // Local filtering for contacts
    if (searchQuery.trim() === '') {
      setFilteredContacts(contacts);
      setSearchResults([]);
      setIsSearching(false);
    } else {
      const filtered = contacts.filter(contact => 
        contact.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredContacts(filtered);

      // Trigger debounced search for users
      debouncedSearchUsers(searchQuery);
    }

    // Cleanup function to cancel any pending debounced calls
    return () => {
      debouncedSearchUsers.cancel();
    };
  }, [searchQuery, contacts, debouncedSearchUsers]);

  const handleStartNewChat = async (user: Contact) => {
    try {
      const newChat = await ChatApi.startNewChat(user.id);
      onNewChatStart(newChat);
      setSearchQuery('');
      setSearchResults([]);
      setIsSearching(false);
    } catch (error) {
      toast.error('Failed to start new chat');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const sidebarBgClass = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  return (
    <>
      {screenWidth < 768 && !isSidebarOpen && (
        <Button 
          variant="ghost" 
          size="icon" 
          className={`
            fixed top-4 left-4 z-20 
            ${isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-100'}
          `}
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}

      <div 
        className={`
          ${isSidebarOpen ? 'block' : 'hidden'} 
          fixed inset-0 z-30 md:static md:block 
          md:w-1/3 lg:w-1/4 xl:w-1/3
          ${sidebarBgClass} 
          border-r overflow-hidden
        `}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`rounded-full mr-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              onClick={() => navigate('/user/home')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-bold">Chats</h2>
          </div>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search chats or users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`
                w-full pl-10 pr-10 py-2 rounded-full text-sm focus:outline-none focus:ring-2
                ${isDarkMode 
                  ? 'bg-gray-700 text-gray-200 placeholder-gray-400 focus:ring-[#1D9BF0]' 
                  : 'bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-[#1D9BF0]'}
              `}
            />
            <Search 
              className={`
                absolute left-3 top-1/2 transform -translate-y-1/2 
                ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
              `} 
              size={20} 
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className={`
                  absolute right-2 top-1/2 transform -translate-y-1/2 
                  ${isDarkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}
                `}
                onClick={clearSearch}
              >
                <X size={20} />
              </Button>
            )}
          </div>
        </div>

        {/* Contact or Search Results List */}
        <div className="overflow-y-auto h-[calc(100vh-200px)]">
          {isLoading ? (
            <div className="text-center p-4">
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Searching...
              </p>
            </div>
          ) : isSearching ? (
            searchResults.length > 0 ? (
              searchResults.map(user => (
                <SearchResultItem 
                  key={user.id} 
                  user={user}
                  onStartChat={handleStartNewChat}
                />
              ))
            ) : (
              <div className="text-center p-4">
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No users found
                </p>
              </div>
            )
          ) : (
            filteredContacts.length > 0 ? (
              filteredContacts.map(contact => (
                <ContactItem 
                  key={contact.id} 
                  contact={contact}
                  isSelected={selectedChat?.id === contact.id}
                  onSelect={onContactSelect}
                />
              ))
            ) : (
              <div className="text-center p-4">
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No contacts found. Search for users to start a chat.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;