import React from 'react';
import { X, Link, Twitter, Facebook } from 'lucide-react';
import { WhatsApp } from '@mui/icons-material';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,

} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const [showCopyAlert, setShowCopyAlert] = React.useState(false);
  const shareUrl = `${window.location.origin}/user/post/${post._id}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopyAlert(true);
      setTimeout(() => setShowCopyAlert(false), 500);
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

  const shareOptions = [
    { 
      text: 'Copy Link', 
      action: () => copyToClipboard(shareUrl), 
      icon: <Link className="mr-2 h-4 w-4" /> 
    },
    { 
      text: 'Share on Twitter', 
      action: () => shareToSocial('twitter', shareUrl), 
      icon: <Twitter className="mr-2 h-4 w-4" />,
      color: 'text-blue-400'
    },
    { 
      text: 'Share on Facebook', 
      action: () => shareToSocial('facebook', shareUrl), 
      icon: <Facebook className="mr-2 h-4 w-4" />,
      color: 'text-blue-600'
    },
    { 
      text: 'Share on WhatsApp', 
      action: () => shareToSocial('whatsapp', shareUrl), 
      icon: <WhatsApp className="mr-2 h-4 w-4" />,
      color: 'text-green-500'
    }
  ];

  return (
    <>
      <Dialog open onOpenChange={() => onClose()}>
        <DialogContent className={cn(
          "sm:max-w-[380px]",
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        )}>
          <DialogHeader>
            <DialogTitle>Share Post</DialogTitle>
            <DialogDescription>
              Choose how you want to share this post
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[400px] overflow-auto">
            <div className="space-y-4 p-4">
              {shareOptions.map((option) => (
                <Button
                  key={option.text}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    isDarkMode ? "text-white hover:bg-gray-700" : "text-gray-900 hover:bg-gray-100",
                    option.color
                  )}
                  onClick={option.action}
                >
                  {option.icon}
                  {option.text}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCopyAlert} onOpenChange={setShowCopyAlert}>
        <AlertDialogContent className={cn(
          "max-w-[200px] p-4",
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        )}>
          <div className="flex items-center justify-center">
            <p className="text-sm font-medium">Link copied!</p>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ShareModal;