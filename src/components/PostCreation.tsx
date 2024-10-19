import React, { useState, useRef, useEffect } from 'react';
import { Image, Video, Radio, Send } from 'lucide-react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CreatePostModal from './Modal/PostCreationModal';
import AudienceSelectionModal from './Modal/AudienceSelectionModal';
import { RootState } from '@/redux/store/store';
import { useSelector } from 'react-redux';


interface PostCreationProps {
  onPostCreated: () => void;
}

const PostCreation: React.FC<PostCreationProps> = ({onPostCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAudienceModalOpen, setIsAudienceModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'photo' | 'video' | null>(null);
  const [thoughts, setThoughts] = useState('');
  const [inputWidth, setInputWidth] = useState('100%');
  const [selectedAudience, setSelectedAudience] = useState('public'); 
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (thoughts && inputRef.current && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const buttonWidth = 40; // Approximate width of the send button
      const newWidth = containerWidth - buttonWidth - 10; // 10px for some padding
      setInputWidth(`${newWidth}px`);
    } else {
      setInputWidth('100%');
    }
  }, [thoughts]);

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

  const handleOpenAudienceModal = () => {
    setIsAudienceModalOpen(true);
  };

  const handleCloseAudienceModal = () => {
    setIsAudienceModalOpen(false);
  };

  const handleShare = () => {
    
    console.log('Sharing post:', selectedAudience);
    setThoughts('');
    setIsModalOpen(false);
    setIsAudienceModalOpen(false);
  };

  const handleAudienceSelect = (audience: string) => {
    setSelectedAudience(audience);
    setIsAudienceModalOpen(false);
  };


  return (
    <>
      <div className="bg-[#010F18] p-4 rounded-xl mb-4 shadow-[4px_4px_10px_rgba(0,0,0,0.5)]">
        <div className="flex items-start">
        <img
            src={user.profile_picture}
            alt="Your Profile"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div className="flex-grow" ref={containerRef}>
            <div className="flex items-center">
              <textarea
                ref={inputRef}
                placeholder="Share your thoughts..."
                className="bg-[#ffffff2e] text-white p-3 rounded-md h-12 mb-2 resize-none"
                style={{ width: inputWidth, transition: 'width 0.3s' }}
                value={thoughts}
                onChange={(e) => setThoughts(e.target.value)}
              />
              {thoughts && (
                <IconButton
                  className="ml-2 bg-[#0095F6] hover:bg-[#0077C8]"
                  onClick={handleShare}
                  size="small"
                >
                  <Send className="h-6 w-6 ml-2 mb-2 text-gray-400" />
                </IconButton>
              )}
            </div>
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
        modalType={modalType}
        onOpenAudienceModal={handleOpenAudienceModal}
        onPost={() => {
          handleShare();
          onPostCreated();
        }}
        selectedAudience={selectedAudience}
      />

      <AudienceSelectionModal
        isOpen={isAudienceModalOpen}
        onClose={handleCloseAudienceModal}
        onSelect={handleAudienceSelect}
      />
    </>
  );
};

export default PostCreation;