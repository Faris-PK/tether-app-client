import React, { useState } from 'react';
import { Camera, Trash2, X } from 'lucide-react';
import Button from '@mui/material/Button';


interface ProfilePictureModalProps {
  onUpload: (file: File) => Promise<void>;
  onRemove: () => Promise<void>;
  isProfilePicture: boolean;
  onClose: () => void;
}

const ProfilePictureModal: React.FC<ProfilePictureModalProps> = ({
  onUpload,
  onRemove,
  isProfilePicture,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    onClose();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      await onUpload(event.target.files[0]);
      closeModal();
    }
  };

  const handleRemove = async () => {
    await onRemove();
    closeModal();
  };

  return (
    <>
      {/* Trigger Button */}
      <button onClick={openModal} className="bg-gray-500 p-2 rounded-full">
        <Camera className="h-4 w-4 text-white" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#010F18] p-6 rounded-lg shadow-lg w-full max-w-sm relative">
            {/* Close Modal Button at Top Right */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-gray-600 text-white p-2 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="text-xl text-white font-semibold mb-4">
              {isProfilePicture ? 'Profile Picture' : 'Cover Photo'}
            </h2>

            <div className="flex flex-col space-y-4">
              {/* Upload Button */}
              <Button
                variant="outlined"
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                Upload New Picture
              </Button>

              {/* Hidden File Input */}
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Remove Button */}
              <Button
                variant="outlined"
                color="error" // To match the red color from your previous button
                startIcon={<Trash2 />} // Adds the Trash2 icon at the start of the button
                onClick={handleRemove}
              >
                Remove Picture
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePictureModal;
