import React from 'react';
import { X } from 'lucide-react';
import profile_picture from '../../assets/profile-picture.jpg';
import Button from '@mui/material/Button';

interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const FollowersModal: React.FC<FollowersModalProps> = ({ isOpen, onClose, title }) => {
  if (!isOpen) return null;

  // Static list of users for demonstration purposes
  const staticUsers = [
    { id: 1, username: "John Doe", avatar: "/default-avatar.jpg" },
    { id: 2, username: "Jane Smith", avatar: "/default-avatar.jpg" },
    { id: 3, username: "Mike Johnson", avatar: "/default-avatar.jpg" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#010F18] w-full max-w-md rounded-xl shadow-[4px_4px_10px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* User List */}
        <div className="max-h-96 overflow-y-auto">
          {staticUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={profile_picture}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover border border-gray-700"
                />
                <div>
                  <h3 className="text-white font-medium">{user.username}</h3>
                </div>
              </div>
              {/* Material UI Outlined Button */}
              <Button variant="outlined" color="error" size="small">
                Unfollow
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowersModal;
