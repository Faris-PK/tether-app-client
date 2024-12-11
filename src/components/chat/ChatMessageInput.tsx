import React, { useState } from 'react';
import { Send, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Contact } from '@/types/IChat';
import { useSocket } from '@/contexts/SocketContext';

interface ChatMessageInputProps {
  selectedChat: Contact;
  onSendMessage: (message: string) => Promise<void>;
}

const ChatMessageInput: React.FC<ChatMessageInputProps> = ({ 
  selectedChat, 
  onSendMessage 
}) => {
  const [message, setMessage] = useState('');
  const { socket } = useSocket();

  const handleSendMessage = async () => {
    if (message.trim()) {
      try {
        await onSendMessage(message);
        setMessage('');
      } catch (error) {
        console.error('Failed to send message', error);
      }
    }
  };

  const handleTyping = (isTyping: boolean) => {
    // Emit typing status to socket
    socket?.emit('typing', {
      senderId: selectedChat.id,
      receiverId: selectedChat.id,
      isTyping
    });
  };

  return (
    <div className="p-4 border-t flex items-center space-x-2">
      <Button variant="ghost" size="icon">
        <Smile className="h-5 w-5" />
      </Button>
      
      <Textarea 
        placeholder="Type a message..."
        className="flex-1 min-h-[50px] max-h-[150px]"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          handleTyping(e.target.value.length > 0);
        }}
        onFocus={() => handleTyping(true)}
        onBlur={() => handleTyping(false)}
      />
      
      <Button 
        variant="default" 
        size="icon"
        onClick={handleSendMessage}
        disabled={!message.trim()}
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ChatMessageInput;