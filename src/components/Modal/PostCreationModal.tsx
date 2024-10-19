import React, { useState } from 'react';
import { X, MapPin, Plus } from 'lucide-react';
import { PostApi } from '@/api/postApi';
import PostData from '@/types/IPost';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { addPostToUser } from '@/redux/slices/userSlice';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalType: 'photo' | 'video' | null;
  onOpenAudienceModal: () => void;
  onPost: () => void;
  selectedAudience: string;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  modalType,
  onOpenAudienceModal,
  onPost,
  selectedAudience,
}) => {
  const [postContent, setPostContent] = useState<PostData>({
    content: '',
    audience: selectedAudience,
    file: null,
    location: '',
    postType: modalType === 'photo' ? 'image' : modalType === 'video' ? 'video' : 'note',
  });
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch()

  if (!isOpen) return null;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(prevContent => ({ ...prevContent, content: e.target.value }));
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileType = selectedFile.type.split('/')[0];
      setPostContent(prevContent => ({
        ...prevContent,
        file: selectedFile,
        postType: fileType === 'image' ? 'image' : 'video',
      }));
      setError(null);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostContent(prevContent => ({ ...prevContent, location: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!postContent.content.trim() && !postContent.file) {
      setError("Please add a caption or upload a file before posting.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('caption', postContent.content);
      formData.append('audience', postContent.audience);
      formData.append('postType', postContent.file ? postContent.postType : 'note');
      if (postContent.file) formData.append('file', postContent.file);
      if (postContent.location) formData.append('location', postContent.location);

      const response = await PostApi.createPost(formData);
      console.log("Post creation successful: ", response._id);
      if (response) {
        // Dispatch action to update the user's posts in the Redux store
        dispatch(addPostToUser(response._id));
      }

      setPostContent({
        content: '',
        audience: selectedAudience,
        file: null,
        location: '',
        postType: 'note',
      });

      onClose();
      onPost();
    } catch (error) {
      console.error('Error creating post:', error);
      setError("An error occurred while creating the post. Please try again.");
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 ">
      <div className="bg-[#010F18] w-full max-w-md rounded-lg shadow-lg">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {modalType === 'photo' ? 'Create Photo Post' : modalType === 'video' ? 'Create Video Post' : 'Create Notes Post'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-600 rounded-full mr-3">
              <img className='rounded-full'  src={user?.profile_picture} alt="" />
            </div>
            <div>
              <p className="text-white font-semibold">{user?.username}</p>
              <button 
                onClick={onOpenAudienceModal}
                className="bg-transparent text-gray-400 text-sm hover:text-white"
              >
                Select audience ({selectedAudience})
              </button>
            </div>
          </div>

          <textarea
            className="w-full bg-transparent text-white placeholder-gray-500 resize-none outline-none"
            rows={4}
            placeholder="Share your thoughts here"
            value={postContent.content}
            onChange={handleContentChange}
          />

          <div className="flex items-center mt-4">
            <MapPin size={20} className="mr-2 text-gray-400" />
            <input
              type="text"
              className="bg-transparent text-white placeholder-gray-500 outline-none border-b border-gray-600 w-full"
              placeholder="Add location"
              value={postContent.location}
              onChange={handleLocationChange}
            />
          </div>

          <div className="mt-4">
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-4 cursor-pointer">
              <Plus size={24} className="text-gray-400 mb-2" />
              <p className="text-gray-400">
                Add {modalType === 'photo' ? 'photos' : modalType === 'video' ? 'videos' : 'notes'}
              </p>
              <input
                type="file"
                className="hidden"
                accept={modalType === 'photo' ? 'image/*' : 'video/*'}
                onChange={handleFileChange}
              />
            </label>
            {postContent.file && (
              <p className="mt-2 text-sm text-gray-300">{postContent.file.name}</p>
            )}
          </div>

          {error && (
            <p className="mt-4 text-red-500 text-sm">{error}</p>
          )}
        </div>

        <div className="p-4 border-t border-gray-700">
          <button
            className="w-full bg-[#0095F6] text-white font-semibold py-2 rounded-md"
            onClick={handleSubmit}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;