import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useTheme } from '../../contexts/ThemeContext';

interface LogoutConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const LogoutConfirmation: React.FC<LogoutConfirmationProps> = ({
  isOpen,
  onClose,
  onLogout,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose} >
      <AlertDialogContent className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
        <AlertDialogTitle className={isDarkMode ? 'text-white' : 'text-black'}>
          Confirm Logout
        </AlertDialogTitle>
        <AlertDialogDescription className={isDarkMode ? 'text-gray-300' : 'text-black'}>
          Are you sure you want to log out? This action cannot be undone.
        </AlertDialogDescription>
        <div className="flex justify-end gap-2">
          <AlertDialogCancel asChild>
            <Button variant="secondary" onClick={onClose} className={isDarkMode ? 'text-white hover:bg-gray-700 bg-gray-400' : 'text-black hover:bg-gray-200'}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={onLogout} className={isDarkMode ? 'text-white hover:bg-red-600 bg-slate-700' : 'text-white hover:bg-red-600'}>
              Logout
            </Button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutConfirmation;