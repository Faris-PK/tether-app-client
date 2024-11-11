import React from 'react';
import { Edit, Trash2, UserMinus, Flag, Ban, Bookmark, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';

interface OptionsModalProps {
  postId: string;
  postUserId: string;
  currentUserId: string;
  isDarkMode: boolean;
  onClose: () => void;
  onOptionSelect: (action: string, postId: string) => void;
}

const OptionsModal: React.FC<OptionsModalProps> = ({
  postId,
  postUserId,
  currentUserId,
  isDarkMode,
  onClose,
  onOptionSelect
}) => {
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);

  const handleOptionClick = (action: string) => {
    if (action === 'delete') {
      setShowDeleteAlert(true);
    } else {
      onOptionSelect(action, postId);
      onClose();
    }
  };

  const getOptions = () => {
    const isOwnPost = postUserId === currentUserId;
    
    if (isOwnPost) {
      return [
        { text: 'Edit Post', action: 'edit', icon: <Edit className="mr-2 h-4 w-4" /> },
        { text: 'Save Post', action: 'save', icon: <Bookmark className="mr-2 h-4 w-4" /> },
        { text: 'Delete Post', action: 'delete', icon: <Trash2 className="mr-2 h-4 w-4" />, variant: 'destructive' },
      ];
    } else {
      return [
        { text: 'Save Post', action: 'save', icon: <Bookmark className="mr-2 h-4 w-4" /> },
        { text: 'Report', action: 'report', icon: <Flag className="mr-2 h-4 w-4" />, variant: 'destructive' },
        { text: 'About this Account', action: 'about_account', icon: <Info className="mr-2 h-4 w-4" /> },
        { text: 'Unfollow', action: 'unfollow', icon: <UserMinus className="mr-2 h-4 w-4" />, variant: 'destructive' },
        { text: 'Block User', action: 'block_user', icon: <Ban className="mr-2 h-4 w-4" />, variant: 'destructive' },
      ];
    }
  };

  return (
    <>
      <Dialog open onOpenChange={() => onClose()}>
        <DialogContent className={cn(
          "sm:max-w-[380px]",
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        )}>
          <DialogHeader>
            <DialogTitle>Post Options</DialogTitle>
            <DialogDescription>
              Select an action to perform on this post.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[400px] overflow-auto">
            <div className="space-y-4 p-4">
              {getOptions().map((item) => (
                <Button
                  key={item.action}
                  variant={item.variant === 'destructive' ? 'ghost' : 'ghost'}
                  className={cn(
                    "w-full justify-start",
                    item.variant === 'destructive' && (isDarkMode ? "text-red-500" : "text-red-600"),
                    item.variant !== 'destructive' && (isDarkMode ? "text-white" : "text-gray-900")
                  )}
                  onClick={() => handleOptionClick(item.action)}
                >
                  {item.icon}
                  {item.text}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className={cn(
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        )}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onOptionSelect('delete', postId);
                setShowDeleteAlert(false);
                onClose();
              }}
              className={cn(
                isDarkMode ? "text-red-500" : "text-red-600",
                "bg-transparent hover:bg-red-100 dark:hover:bg-red-700"
              )}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OptionsModal;
