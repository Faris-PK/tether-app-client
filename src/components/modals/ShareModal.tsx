import React, { useState } from 'react';
import { X, Link, Copy, Check, Twitter, Facebook } from 'lucide-react';
import { WhatsApp } from '@mui/icons-material';
import { Button } from "@/components/ui/button";
import  BaseModal  from './BaseModal';
import { cn } from "@/lib/utils";

interface Post {
    _id: string;
    userId: {
      username: string;
      profile_picture: string;
    };
    location: string;
    createdAt: string;
    caption: string;
    mediaUrl: string;
    likes: string[];
    commentCount?: number;
    postType: string;
    isBlocked: boolean;
  }

interface ShareModalProps {
  post: Post;
  isDarkMode: boolean;
  onClose: () => void;
}

 const ShareModal: React.FC<ShareModalProps> = ({ post, isDarkMode, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/post/${post._id}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const shareToSocial = (platform: string, url: string) => {
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(url)}`
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  return (
    <BaseModal onClose={onClose}>
      <div className={cn(
        "rounded-lg shadow-lg w-96",
        isDarkMode ? "bg-gray-800" : "bg-white"
      )}>
        <div className={cn(
          "p-4 flex justify-between items-center border-b",
          isDarkMode ? "border-gray-700" : "border-gray-200"
        )}>
          <h2 className={cn(
            "text-lg font-semibold",
            isDarkMode ? "text-white" : "text-gray-800"
          )}>
            Share Post
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className={cn(
              "p-1 hover:bg-transparent",
              isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
            )}
          >
            <X size={20} />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <button
            onClick={() => copyToClipboard(shareUrl)}
            className={cn(
              "w-full flex items-center justify-between p-3 rounded-lg transition duration-200",
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            )}
          >
            <div className="flex items-center">
              <Link className="w-5 h-5 mr-3" />
              <span>Copy Link</span>
            </div>
            {copied ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>

          <div className="grid grid-cols-3 gap-4">
            {[
              { platform: 'twitter', icon: Twitter, color: 'text-blue-400' },
              { platform: 'facebook', icon: Facebook, color: 'text-blue-600' },
              { platform: 'whatsapp', icon: WhatsApp, color: 'text-green-500' }
            ].map(({ platform, icon: Icon, color }) => (
              <Button
                key={platform}
                variant="outline"
                className={cn(
                  "flex items-center justify-center p-3 rounded-lg",
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                )}
                onClick={() => shareToSocial(platform, shareUrl)}
              >
                <Icon className={cn("w-5 h-5", color)} />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default ShareModal