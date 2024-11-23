import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface UserListModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: Array<{
    _id: string;
    username: string;
    profile_picture: string;
  }>;
  title: string;
}

const UserListModal: React.FC<UserListModalProps> = ({ isOpen, onClose, users, title }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto p-4">
            {users.map(user => (
              <div key={user._id} className="flex items-center space-x-3 mb-4">
                <img
                  src={user.profile_picture}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-medium">{user.username}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default UserListModal;