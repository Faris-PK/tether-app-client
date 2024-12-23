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
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const { socket, addMessage } = useSocket();

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

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedChat) {
        try {
          const messages = await ChatApi.getMessages(selectedChat.id);
          setSelectedChat((prev) => (prev ? { ...prev, messages } : null));
        } catch (error) {
          toast.error('Failed to load messages');
        }
      }
    };

    fetchMessages();
  }, [selectedChat?.id]);

  const handleContactSelect = async (contact: Contact) => {
    try {
      await ChatApi.markMessagesAsRead(contact.id);
      setSelectedChat(contact);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    } catch (error) {
      toast.error('Failed to mark messages as read');
    }
  };

  const handleNewChatStart = (newChat: Contact) => {
    const existingChatIndex = contacts.findIndex((c) => c.id === newChat.id);
    if (existingChatIndex === -1) {
      setContacts((prev) => [...prev, newChat]);
    }
    setSelectedChat(newChat);
  };

  const handleBackButtonClick = () => {
    setSelectedChat(null);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(true);
    }
  };

  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      if (selectedChat && message.sender._id === selectedChat.id) {
        setSelectedChat((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [...prev.messages, message],
          };
        });
      }
    };

    socket?.on('new_message', handleNewMessage);

    return () => {
      socket?.off('new_message', handleNewMessage);
    };
  }, [socket, selectedChat]);

  const handleSendMessage = async (messageText?: string, file?: File, replyTo?: Message) => {
    if (selectedChat && (messageText || file)) {
      try {
        // Make sure to include the full sender object when sending the message
        const newMessage = await ChatApi.sendMessage(selectedChat.id, messageText, file, replyTo?._id);
        
        // If there's a replyTo message, make sure to include it in the new message
        const messageWithReply = {
          ...newMessage,
          replyTo: replyTo ? {
            ...replyTo,
            sender: replyTo.sender // Make sure sender object is included
          } : undefined
        };
        
        addMessage(messageWithReply);
        setSelectedChat((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [...prev.messages, messageWithReply],
            lastMessage: messageWithReply.text || 'Sent a file',
          };
        });
  
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact.id === selectedChat.id
              ? { 
                  ...contact, 
                  lastMessage: messageWithReply.text || 'Sent a file'
                }
              : contact
          )
        );
      } catch (error) {
        toast.error('Failed to send message');
      }
    }
  };

  const handleMessageDelete = (messageId: string) => {
    setSelectedChat((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        messages: prev.messages.map(msg => 
          msg._id === messageId 
            ? { ...msg, isDeleted: true }
            : msg
        ),
      };
    });
  };


  

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const bgClass = isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100';

  if (isLoading) {
    return <AppLoader />;
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
      <div
        className={`
          ${selectedChat ? 'block' : 'hidden md:block'} 
          flex-1 flex flex-col 
          ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}
        `}
      >
        {selectedChat ? (
          <>
            <ChatHeader selectedChat={selectedChat} onBackClick={handleBackButtonClick} />
            <ChatMessages
        messages={selectedChat.messages}
        onMessageDelete={handleMessageDelete}
        onReplyToMessage={setReplyToMessage}
      />
      <ChatMessageInput
        selectedChat={selectedChat}
        onSendMessage={handleSendMessage}
        replyToMessage={replyToMessage}
        onCancelReply={() => setReplyToMessage(null)}
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
