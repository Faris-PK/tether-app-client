import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import ChatSidebar from '../../components/chat/ChatSidebar';
import ChatHeader from '../../components/chat/ChatHeader';
import ChatMessages from '../../components/chat/ChatMessages';
import ChatMessageInput from '../../components/chat/ChatMessageInput';
import EmptyChat from '../../components/chat/EmptyChat';
import { Contact, Message } from '../../types/IChat';
import { ChatApi } from '../../api/chatApi';
import { toast } from 'sonner';
import AppLoader from '@/components/common/AppLoader';
import { useSocket } from '@/contexts/SocketContext';

const ChatPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedChat, setSelectedChat] = useState<Contact | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { socket,addMessage } = useSocket();


  // Fetch contacts on component mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        const fetchedContacts = await ChatApi.getContacts();
        setContacts(fetchedContacts);
      } catch (error) {
        toast.error('Failed to load contacts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Fetch messages when a contact is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedChat) {
        try {
          const messages = await ChatApi.getMessages(selectedChat.id);
          console.log('messages: ', messages);
          
          setSelectedChat(prev => prev ? { ...prev, messages } : null);
        } catch (error) {
          toast.error('Failed to load messages');
        }
      }
    };

    fetchMessages();
  }, [selectedChat?.id]);

  const handleContactSelect = async (contact: Contact) => {
    try {
      // Mark messages as read when contact is selected
      await ChatApi.markMessagesAsRead(contact.id);
      
      setSelectedChat(contact);
      // On mobile, hide sidebar when a contact is selected
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    } catch (error) {
      toast.error('Failed to mark messages as read');
    }
  };

  const handleNewChatStart = (newChat: Contact) => {
    // Check if the chat already exists in contacts
    const existingChatIndex = contacts.findIndex(c => c.id === newChat.id);
    
    if (existingChatIndex === -1) {
      // Add new chat to contacts if it doesn't exist
      setContacts(prev => [...prev, newChat]);
    }
    
    // Select the new chat
    setSelectedChat(newChat);
  };

  const handleBackButtonClick = () => {
    // Clear the selected chat
    setSelectedChat(null);
    
    // On mobile, ensure sidebar is open when back button is clicked
    if (window.innerWidth < 768) {
      setIsSidebarOpen(true);
    }
  };

  // Listen for new messages from socket
  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      // If the message is for the currently selected chat
      if (selectedChat && message.sender._id === selectedChat.id) {
        setSelectedChat(prev => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [...prev.messages, message]
          };
        });
      }
    };

    socket?.on('new_message', handleNewMessage);

    return () => {
      socket?.off('new_message', handleNewMessage);
    };
  }, [socket, selectedChat]);

  const handleSendMessage = async (messageText: string) => {
    if (selectedChat) {
      try {
        const newMessage = await ChatApi.sendMessage(selectedChat.id, messageText);
        addMessage(newMessage);

        
        // Update the selected chat with the new message
        setSelectedChat(prev => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [...prev?.messages, newMessage],
            lastMessage: newMessage.text
          };
        });

        // Update contacts list with the latest message
        setContacts(prevContacts => 
          prevContacts.map(contact => 
            contact.id === selectedChat.id 
              ? { ...contact, lastMessage: newMessage.text } 
              : contact
          )
        );
      } catch (error) {
        toast.error('Failed to send message');
      }
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Responsive background and text color classes
  const bgClass = isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100';

  // Show loading state
  if (isLoading) {
   <AppLoader/>
  }

  return (
    <div className={`flex h-screen ${bgClass}`}>
      <ChatSidebar 
        contacts={contacts}
        selectedChat={selectedChat}
        onContactSelect={handleContactSelect}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        onNewChatStart={handleNewChatStart}
      />


      {/* Chat Window */}
      <div 
        className={`
          ${selectedChat ? 'block' : 'hidden md:block'} 
          flex-1 flex flex-col 
          ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}
        `}
      >
        {selectedChat ? (
          <>
            <ChatHeader 
              selectedChat={selectedChat} 
              onBackClick={handleBackButtonClick} 
            />
            <ChatMessages selectedChat={selectedChat} />
            <ChatMessageInput 
              selectedChat={selectedChat}
              onSendMessage={handleSendMessage}
            />
          </>
        ) : (
          <EmptyChat />
        )}
      </div>
    </div>
  );
};

export default ChatPage;