import React, { useState } from 'react';
import { X, Plus, MapPin, Trash2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { PostApi } from '@/api/postApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import ImageCropModal from './ImageCropModal';

const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const geocodingClient = mbxGeocoding({
  accessToken: mapboxToken,
});

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAudienceModal: () => void;
  selectedAudience: string;
  fetchPosts: () => void;
}

interface PostContent {
  content: string;
  file: File | null;
  postType: 'image' | 'video' | 'note';
  location: string;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onOpenAudienceModal,
  selectedAudience,
  fetchPosts
}) => {
  const { isDarkMode } = useTheme();
  const [postContent, setPostContent] = useState<PostContent>({
    content: '',
    file: null,
    postType: 'note',
    location: '',
  });
  const user = useSelector((state: RootState) => state.user.user);
  const [errors, setErrors] = useState<string[]>([]);
  const [locationQuery, setLocationQuery] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Only show crop modal for images
      if (selectedFile.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(selectedFile);
        setSelectedImageUrl(imageUrl);
        setShowCropModal(true);
        setPostContent(prevContent => ({
          ...prevContent,
          postType: 'image'
        }));
      } else {
        // For non-image files (like videos), process normally
        setPostContent(prevContent => ({
          ...prevContent,
          file: selectedFile,
          postType: selectedFile.type.startsWith('video/') ? 'video' : prevContent.postType
        }));
      }
      setErrors([]);
    }
  };

  const handleRemoveFile = () => {
    setPostContent(prevContent => ({
      ...prevContent,
      file: null,
      postType: 'note'
    }));
    if (selectedImageUrl) {
      URL.revokeObjectURL(selectedImageUrl);
      setSelectedImageUrl('');
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    // Create a File from the Blob
    const croppedFile = new File([croppedBlob], 'cropped-image.jpg', {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });

    setPostContent(prevContent => ({
      ...prevContent,
      file: croppedFile,
    }));
    setShowCropModal(false);
    URL.revokeObjectURL(selectedImageUrl); // Clean up the object URL
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(prevContent => ({
      ...prevContent,
      content: e.target.value,
    }));
    setErrors([]);
  };

  const handlePostTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPostContent(prevContent => ({
      ...prevContent,
      postType: e.target.value as 'image' | 'video' | 'note',
      file: null,
    }));
    setErrors([]);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setLocationQuery(value);
    
    if (value.length > 2) {
      geocodingClient
        .forwardGeocode({
          query: value,
          autocomplete: true,
          limit: 5,
        })
        .send()
        .then(response => {
          setLocationSuggestions(response.body.features);
        })
        .catch(error => {
          console.error('Geocoding error:', error);
          setLocationSuggestions([]);
        });
    } else {
      setLocationSuggestions([]);
    }
  };

  const handleLocationSelect = (place: any) => {
    setPostContent(prevContent => ({
      ...prevContent,
      location: place.place_name,
    }));
    setLocationQuery(place.place_name);
    setLocationSuggestions([]);
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    if (postContent.postType === 'note') {
      if (!postContent.content.trim()) {
        newErrors.push("Please add some content to your note.");
      }
      if (postContent.file) {
        newErrors.push("Files are not allowed for notes.");
      }
    } else {
      if (!postContent.content.trim() && !postContent.file) {
        newErrors.push("Please add either content or upload a file.");
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append('caption', postContent.content);
      formData.append('audience', selectedAudience);
      formData.append('postType', postContent.postType);
      if (postContent.location) {
        formData.append('location', postContent.location);
      }
      if (postContent.file) {
        formData.append('file', postContent.file);
      }

      await PostApi.createPost(formData);
      fetchPosts();
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      setErrors(['Failed to create post. Please try again.']);
    }
  };

  if (showCropModal) {
    return (
      <ImageCropModal
        image={selectedImageUrl}
        onClose={() => {
          setShowCropModal(false);
          URL.revokeObjectURL(selectedImageUrl);
        }}
        onComplete={handleCropComplete}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 w-screen h-screen flex items-center justify-center">
      <div className={`bg-${isDarkMode ? 'gray-800' : 'white'} w-full max-w-4xl rounded-lg shadow-lg`}>
        <div className="flex justify-between items-center p-3 border-b border-gray-300">
          <h2 className={`text-lg font-semibold text-${isDarkMode ? 'white' : 'black'}`}>Create Post</h2>
          <button onClick={onClose} className={`text-${isDarkMode ? 'gray-400' : 'gray-600'} hover:text-white`}>
            <X size={20} />
          </button>
        </div>

        <div className="flex h-[400px]">
          {/* Left side - File upload and preview */}
          <div className="w-2/5 p-4 border-r border-gray-300">
            {!postContent.file ? (
              <label className={`h-full flex flex-col items-center justify-center border-2 border-dashed border-${isDarkMode ? 'gray-600' : 'gray-400'} rounded-lg cursor-pointer`}>
                <Plus size={24} className={`text-${isDarkMode ? 'gray-400' : 'gray-500'} mb-2`} />
                <p className={`text-${isDarkMode ? 'gray-400' : 'gray-500'} text-sm`}>Add photos or videos</p>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="relative h-full">
                {postContent.postType === 'image' && (
                  <img
                    src={URL.createObjectURL(postContent.file)}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-lg"
                  />
                )}
                <button
                  onClick={handleRemoveFile}
                  className="absolute top-2 right-2 bg-red-500 p-1.5 rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={16} className="text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Right side - Post details */}
          <div className="w-3/5 p-4 flex flex-col">
            <div className="flex items-center mb-3">
              <img
                src={user?.profile_picture || '/placeholder-avatar.png'}
                alt={user?.username}
                className="w-7 h-7 rounded-full mr-2"
              />
              <h2 className={`text-sm font-semibold text-${isDarkMode ? 'white' : 'black'}`}>{user?.username}</h2>
            </div>

            <div className="mb-3">
              <button
                onClick={onOpenAudienceModal}
                className={`text-xs bg-transparent text-${isDarkMode ? 'gray-400' : 'gray-600'} hover:text-white`}
              >
                Select audience ({selectedAudience})
              </button>
            </div>

            <textarea
              className={`flex-1 w-full bg-transparent text-${isDarkMode ? 'white' : 'black'} placeholder-${isDarkMode ? 'gray-500' : 'gray-400'} resize-none outline-none text-sm mb-3`}
              placeholder="Share your thoughts here"
              value={postContent.content}
              onChange={handleContentChange}
            />

            {errors.length > 0 && (
              <div className="text-red-500 text-xs mb-3">
                {errors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Add location"
                    value={locationQuery}
                    onChange={handleLocationChange}
                    className={`w-full bg-transparent text-${isDarkMode ? 'gray-400' : 'gray-600'} border border-${isDarkMode ? 'gray-600' : 'gray-400'} rounded-md py-1.5 px-2 text-sm outline-none`}
                  />
                  <MapPin className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                </div>
                
                {locationSuggestions.length > 0 && (
                  <div className={`absolute z-10 w-64 mt-1 bg-${isDarkMode ? 'gray-700' : 'white'} border border-${isDarkMode ? 'gray-600' : 'gray-300'} rounded-md shadow-lg`}>
                    {locationSuggestions.map((place) => (
                      <div
                        key={place.id}
                        className={`p-2 text-xs cursor-pointer hover:bg-${isDarkMode ? 'gray-600' : 'gray-100'} text-${isDarkMode ? 'white' : 'black'}`}
                        onClick={() => handleLocationSelect(place)}
                      >
                        {place.place_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <select
                value={postContent.postType}
                onChange={handlePostTypeChange}
                className={`w-full bg-transparent text-${isDarkMode ? 'gray-400' : 'gray-600'} border border-${isDarkMode ? 'gray-600' : 'gray-400'} rounded-md py-1.5 px-2 text-sm outline-none`}
              >
                <option value="note">Note</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>

            <button
              className="w-full bg-[#0095F6] text-white rounded-lg py-1.5 font-semibold text-sm mt-4"
              onClick={handleSubmit}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;