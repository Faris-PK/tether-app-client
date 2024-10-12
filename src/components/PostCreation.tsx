import React, { useState } from 'react';
import { Image, Video, Radio } from 'lucide-react';
import ProfilePicture from '../assets/profile-picture.jpg';
import CreatePostModal from './Modal/PostCreationModal';
import Button from '@mui/material/Button';

const PostCreation: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'photo' | 'video' | null>(null);

  const handlePhotoClick = () => {
    setModalType('photo');
    setIsModalOpen(true);
  };

  const handleVideoClick = () => {
    setModalType('video');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  return (
    <>
      <div className="bg-[#010F18] p-4 rounded-md mb-4">
        <div className="flex items-start">
          <img
            src={ProfilePicture}
            alt="Your Profile"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div className="flex-grow">
            <textarea
              placeholder="Share your thoughts..."
              className="w-full bg-[#ffffff2e] text-white p-3 rounded-md h-12 mb-2 resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <div className="flex space-x-4 w-full justify-around"> 
                <Button variant="outlined" onClick={handlePhotoClick}>
                  <Image className="h-5 w-5 mr-1 text-[#20B048]" />
                  Photo
                </Button>
                <Button variant="outlined" onClick={handleVideoClick}>
                  <Video className="h-5 w-5 mr-1 text-[#059DBF]" />
                  Video
                </Button>
                <Button variant="outlined">
                  <Radio className="h-5 w-5 mr-1 text-[#FF0000]" />
                  Live
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        userName="Faris pk"
        modalType={modalType}
      />
    </>
  );
};

export default PostCreation;