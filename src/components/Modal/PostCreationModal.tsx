import React, { useState } from 'react';
import { X, MapPin, Plus } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  modalType: 'photo' | 'video' | null; // Add modalType prop
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  userName,
  modalType, // Accept the modalType prop
}) => {
  const [postContent, setPostContent] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-[#010F18] w-full max-w-md rounded-lg shadow-lg">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {modalType === 'photo' ? 'Create Photo Post' : modalType === 'video' ? 'Create Video Post' : 'Create Post'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-600 rounded-full mr-3"></div>
            <div>
              <p className="text-white font-semibold">{userName}</p>
              <select className="bg-transparent text-gray-400 text-sm">
                <option>Friends</option>
                <option>Public</option>
                <option>Only me</option>
              </select>
            </div>
          </div>
          
          <textarea
            className="w-full bg-transparent text-white placeholder-gray-500 resize-none outline-none"
            rows={4}
            placeholder="Share your notes here"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          
          <button className="flex items-center text-gray-400 mt-2">
            <MapPin size={20} className="mr-2" />
            Add location
          </button>
          
          <div className="mt-4 border-2 border-dashed border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center">
            <Plus size={24} className="text-gray-400 mb-2" />
            <p className="text-gray-400">Add {modalType === 'photo' ? 'photos' : modalType === 'video' ? 'videos' : 'photos/videos'}</p>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <button className="w-full bg-[#0095F6] text-white font-semibold py-2 rounded-md">
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
