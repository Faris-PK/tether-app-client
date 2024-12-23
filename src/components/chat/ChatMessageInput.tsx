import React, { useState, useRef } from 'react';
import { Send, Smile, Paperclip, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Contact, Message } from '@/types/IChat';
import { toast } from 'sonner';

interface ChatMessageInputProps {
  selectedChat: Contact;
  onSendMessage: (message?: string, file?: File, replyToMessage?: Message) => Promise<void>;
  replyToMessage?: Message | null;
  onCancelReply?: () => void;
}

const ChatMessageInput: React.FC<ChatMessageInputProps> = ({ 
  onSendMessage,
  replyToMessage,
  onCancelReply 
}) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { 
        toast.error('File size should not exceed 10MB');
        return;
      }
      
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        toast.error('Only images and videos are allowed');
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearSelectedFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() || selectedFile) {
      try {
        await onSendMessage(
          message.trim() || undefined, 
          selectedFile || undefined,
          replyToMessage || undefined
        );
        setMessage('');
        clearSelectedFile();
        onCancelReply?.();
      } catch (error) {
        console.error('Failed to send message', error);
      }
    }
  };

  return (
    <div className="p-4 border-t">
      {/* Reply to Message UI */}
      {replyToMessage && (
        <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-blue-500 mb-1">
              Replying to {replyToMessage.sender.username}
            </p>
            <p className="text-sm truncate">{replyToMessage.text}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancelReply}
            className="ml-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Preview for Selected File */}
      {selectedFile && (
        <div className="mb-2 relative inline-block">
          {selectedFile.type.startsWith('image/') ? (
            <img 
              src={previewUrl!} 
              alt="Preview" 
              className="h-20 w-20 object-cover rounded"
            />
          ) : (
            <video 
              src={previewUrl!} 
              className="h-20 w-20 object-cover rounded"
              controls
            />
          )}
          <button
            onClick={clearSelectedFile}
            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      )}

      {/* Input Field and Actions */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon">
          <Smile className="h-5 w-5" />
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*,video/*"
          className="hidden"
        />
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        
        <Textarea 
          placeholder="Type a message..."
          className="flex-1 min-h-[50px] max-h-[150px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        
        <Button 
          variant="default" 
          size="icon"
          onClick={handleSendMessage}
          disabled={!message.trim() && !selectedFile}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatMessageInput;
