import React, { useState, useRef, useEffect } from 'react';
import { IChat, IMessage } from '@/types/chat';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatMessageTime } from '@/utils/dateUtils';
import { Send, Image, FileVideo } from 'lucide-react';

interface ChatWindowProps {
  selectedChat: IChat | null;
  messages: IMessage[];
  isLoading: boolean;
  onSendMessage: (content: string, messageType?: 'text' | 'image' | 'video') => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ 
  selectedChat, 
  messages, 
  isLoading,
  onSendMessage 
}) => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput);
      setMessageInput('');
    }
  };

  const handleFileUpload = (type: 'image' | 'video') => {
    // Implement file upload logic
    // This could open a file picker or trigger a file upload process
    console.log(`Uploading ${type}`);
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        Select a chat to start messaging
      </div>
    );
  }

  const otherUser = selectedChat.participants.find(p => p._id !== user._id);

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center">
        <Avatar>
          <AvatarImage src={otherUser?.profile_picture} />
          <AvatarFallback>
            {otherUser?.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h2 className="ml-3 font-semibold">{otherUser?.username}</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="text-center text-gray-500">Loading messages...</div>
        ) : (
          messages.map(message => (
            <div 
              key={message._id}
              className={`flex mb-4 ${
                message.sender._id === user._id ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender._id !== user._id && (
                <Avatar className="mr-2">
                  <AvatarImage src={message.sender.profile_picture} />
                  <AvatarFallback>
                    {message.sender.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <div 
                className={`p-2 rounded-lg max-w-xs ${
                  message.sender._id === user._id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200'
                }`}
              >
                {message.messageType === 'image' ? (
                  <img src={message.content} alt="Shared" className="max-w-full rounded" />
                ) : message.messageType === 'video' ? (
                  <video src={message.content} controls className="max-w-full rounded" />
                ) : (
                  message.content
                )}
                <div className="text-xs mt-1 text-right">
                  {formatMessageTime(message.createdAt)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => handleFileUpload('image')}
        >
          <Image className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => handleFileUpload('video')}
        >
          <FileVideo className="h-5 w-5" />
        </Button>
        <Input 
          placeholder="Type a message..." 
          className="mx-2 flex-1"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <Button 
          variant="default" 
          size="icon"
          onClick={handleSendMessage}
          disabled={!messageInput.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;