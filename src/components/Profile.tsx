import React, { useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store/store';
import { 
  MapPin,
  Calendar,
  Mail,
  Edit3,
  Cake,
  Camera
} from 'lucide-react';
import moment from 'moment';
import EditProfileModal from './modal/EditProfileModal';
import { api } from '../api/userApi';
import Modal from 'react-modal';
import { setUser } from '../redux/slices/userSlice';

Modal.setAppElement('#root'); 

const Profile: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>('');

  const formattedJoinDate = user?.createdAt ? moment(user.createdAt).format('MMMM D, YYYY') : 'Unknown';
  const formattedDob = user?.dob ? moment(user.dob).format('MMMM D, YYYY') : 'Unknown';

  const openModal = () => {
    setIsModalOpen(true);
    setErrors([]);
    setSuccess('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // File uploading
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    if (event.target.files) {
      const file = event.target.files[0];
      await handleUpload(type, file);
    }
  };

  const handleUpload = async (type: 'profile' | 'cover', file: File) => {
    if (!file) {
      setErrors([...errors, `Please select a ${type} picture to upload.`]);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await api.uploadImage(formData);
      console.log('Response from frontend: ', response);
      dispatch(setUser(response));
      // Update user state here if necessary
      setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} picture uploaded successfully!`);
    } catch (error) {
      console.error(`Error uploading ${type} picture:`, error);
      setErrors([...errors, `Failed to upload ${type} picture.`]);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[#010F18] flex h-screen overflow-hidden hide-scrollbar rounded-md">
      <div className="flex-grow flex flex-col overflow-hidden">
        <div className="flex-grow overflow-y-auto p-4 rounded-md">
          <div className="relative mb-16">
            <img src={user.cover_photo || '/default-cover.jpg'} alt="Cover" className="w-full h-64 object-cover rounded-t-lg" />
            <button 
              className="absolute top-2 right-2 bg-[#059DBF] text-white p-2 rounded-full"
              onClick={() => document.getElementById('coverPhotoInput')?.click()}
            >
              <Camera size={16} />
            </button>
            <input
              id="coverPhotoInput"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'cover')}
              className="hidden"
            />
            <img src={user.profile_picture || '/default-avatar.jpg'} alt="Profile" className="absolute left-8 -bottom-16 w-48 h-48 rounded-full border-4 border-[#010F18]" />
            <button 
              className="absolute left-48 bg-[#059DBF] text-white p-2 rounded-full"
              onClick={() => document.getElementById('profilePictureInput')?.click()}
            >
              <Camera size={16} />
            </button>
            <input
              id="profilePictureInput"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'profile')}
              className="hidden"
            />
          </div>

          <div className="bg-[#1B2730] rounded-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">{user.username}</h2>
                <div className="flex space-x-4 mt-2 text-gray-300">
                  <span>{user.posts?.length || 0} posts</span>
                  <span>{user.followers.length} followers</span>
                  <span>{user.following?.length} following</span>
                </div>
              </div>
              <button 
                className="bg-[#059DBF] text-white px-4 py-2 rounded-md flex items-center"
                onClick={openModal}
              >
                <Edit3 size={16} className="mr-2" />
                Edit Profile
              </button>
            </div>

            <p className="text-white mb-4">{user.bio}</p>

            <div className="grid grid-cols-2 gap-4 text-gray-300">
              <div className="flex items-center">
                <Mail size={16} className="mr-2" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center">
                <Cake size={16} className="mr-2" />
                <span>{formattedDob || 'Not specified'}</span>
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-2" />
                <span>{user.location || 'Not specified'}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>Joined {formattedJoinDate}</span>
              </div>
            </div>

            {user.social_links && user.social_links.length > 0 && (
              <div className="mt-4">
                <h3 className="text-white font-semibold mb-2">Social Links:</h3>
                <ul className="list-disc list-inside text-gray-300">
                  {user.social_links.map((link: string, index: number) => (
                    <li key={index}>
                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {user.premium_status && (
              <div className="mt-4 text-yellow-400">
                <span className="font-semibold">Premium User</span>
                {user.premium_expiration && (
                  <span> - Expires on {moment(user.premium_expiration).format('MMMM D, YYYY')}</span>
                )}
              </div>
            )}
          </div>

          {/* You can add Posts and Marketplace sections here */}
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={closeModal}
        user={user}
      />
    </div>
  );
};

export default Profile;

function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}
