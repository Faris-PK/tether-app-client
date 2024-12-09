import React, { useState, useEffect } from 'react';
import { Search, Phone, VideoIcon, MoreVertical, Paperclip, Smile, Send, ChevronLeft, MessageCircle, Menu, X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

const contacts = [
  {
    id: 1,
    name: 'Emily Johnson',
    username: 'emily_j',
    profilePic: 'https://api.dicebear.com/7.x/miniavs/svg?seed=emily',
    lastMessage: 'Hey, are we still meeting for coffee?',
    unreadCount: 2,
    messages: [
      { id: 1, sender: 'emily_j', text: 'Hey, are we still meeting for coffee?', timestamp: '10:30 AM' },
      { id: 2, sender: 'you', text: 'Yes, let\'s meet at the usual cafe at 2 PM.', timestamp: '10:35 AM' },
      { id: 3, sender: 'emily_j', text: 'Perfect! Can\'t wait to catch up.', timestamp: '10:40 AM' }
    ]
  },
  {
    id: 2,
    name: 'Alex Rodriguez',
    username: 'alex_rod',
    profilePic: 'https://api.dicebear.com/7.x/miniavs/svg?seed=alex',
    lastMessage: 'Project updates looking good!',
    unreadCount: 1,
    messages: [
      { id: 1, sender: 'alex_rod', text: 'Project updates looking good!', timestamp: '09:45 AM' },
      { id: 2, sender: 'you', text: 'Thanks! Let\'s review the final draft tomorrow.', timestamp: '09:50 AM' }
    ]
  },
  {
    id: 3,
    name: 'Sophia Williams',
    username: 'sophia_w',
    profilePic: 'https://api.dicebear.com/7.x/miniavs/svg?seed=sophia',
    lastMessage: 'Don’t forget about tonight’s event!',
    unreadCount: 3,
    messages: [
      { id: 1, sender: 'sophia_w', text: 'Are you coming to the event tonight?', timestamp: '08:00 AM' },
      { id: 2, sender: 'you', text: 'Yes, I’ll be there at 7 PM.', timestamp: '08:15 AM' },
      { id: 3, sender: 'sophia_w', text: 'Great! Don’t forget about tonight’s event!', timestamp: '11:45 AM' }
    ]
  },

];


const ChatPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<typeof contacts[0] | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState(contacts);

  // Handle responsive design with screen width
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      // Automatically show sidebar on larger screens
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        contact.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [searchQuery]);

  const handleSendMessage = () => {
    if (selectedChat && messageInput.trim()) {
      selectedChat.messages.push({
        id: selectedChat.messages.length + 1,
        sender: 'you',
        text: messageInput,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setMessageInput('');
    }
  };

  const handleBackButtonClick = () => {
    // Instead of navigating to home, clear the selected chat
    setSelectedChat(null);
    
    // On mobile, ensure sidebar is open when back button is clicked
    if (screenWidth < 768) {
      setIsSidebarOpen(true);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleContactSelect = (contact: typeof contacts[0]) => {
    setSelectedChat(contact);
    // On mobile, hide sidebar when a contact is selected
    if (screenWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  

  // Responsive background and text color classes
  const bgClass = isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100';
  const sidebarBgClass = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';
  const chatBgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';

  return (
    <div className={`flex h-screen ${bgClass}`}>
      {/* Mobile Menu Button */}
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

      {/* Sidebar for Mobile and Desktop */}
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
              placeholder="Search chats..." 
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


        {/* Contact List */}
        <div className="overflow-y-auto h-[calc(100vh-200px)]">
          {filteredContacts.length > 0 ? (
            filteredContacts.map(contact => (
              <div 
                key={contact.id} 
                onClick={() => handleContactSelect(contact)}
                className={`
                  flex items-center p-4 cursor-pointer hover:bg-opacity-10 
                  ${selectedChat?.id === contact.id 
                    ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-200') 
                    : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
                  }
                `}
              >
                <Avatar className="h-10 w-10 md:h-12 md:w-12 mr-4">
                  <AvatarImage src={contact.profilePic} alt={contact.name} />
                  <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-sm md:text-base truncate">{contact.name}</h3>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {contact.messages[contact.messages.length - 1].timestamp}
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
            ))
          ) : (
            <div className="text-center p-4">
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No contacts found
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div 
        className={`
          ${selectedChat ? 'block' : 'hidden md:block'} 
          flex-1 flex flex-col 
          ${chatBgClass}
        `}
      >
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div 
              className={`
                p-4 flex items-center justify-between border-b 
                ${sidebarBgClass}
              `}
            >
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="mr-4" 
                  onClick={handleBackButtonClick}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Avatar className="h-10 w-10 md:h-12 md:w-12 mr-4">
                  <AvatarImage src={selectedChat.profilePic} alt={selectedChat.name} />
                  <AvatarFallback>{selectedChat.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-bold text-sm md:text-base">{selectedChat.name}</h2>
                  <p className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Online
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

            {/* Messages */}
            <div 
              className={`
                flex-1 overflow-y-auto p-4 space-y-3 md:space-y-4 
                ${chatBgClass}
              `}
            >
              {selectedChat.messages.map(message => (
                <div 
                  key={message.id} 
                  className={`flex ${
                    message.sender === 'you' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div 
                    className={`
                      max-w-[70%] p-2 md:p-3 rounded-lg 
                      ${message.sender === 'you'
                        ? (isDarkMode 
                          ? 'bg-[#1D9BF0] text-white' 
                          : 'bg-[#1D9BF0] text-white')
                        : (isDarkMode 
                          ? 'bg-gray-700 text-gray-200' 
                          : 'bg-gray-200 text-black')
                      }
                    `}
                  >
                    <p className="text-sm md:text-base">{message.text}</p>
                    <span 
                      className={`
                        text-xs block mt-1 
                        ${message.sender === 'you'
                          ? (isDarkMode ? 'text-gray-200' : 'text-gray-100')
                          : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                        }
                      `}
                    >
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div 
              className={`
                p-3 md:p-4 border-t flex items-center space-x-2 
                ${sidebarBgClass}
              `}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className={`rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <Paperclip className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <Smile className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className={`
                    w-full p-2 rounded-lg text-sm md:text-base focus:outline-none 
                    ${isDarkMode 
                      ? 'bg-gray-700 text-gray-200 placeholder-gray-400' 
                      : 'bg-gray-100 text-gray-900 placeholder-gray-500'}
                  `}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                className={`
                  rounded-full 
                  ${isDarkMode 
                    ? 'bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white' 
                    : 'bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white'}
                `}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default ChatPage;