import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store/store';
import { 
  MapPin,
  Calendar,
  Mail,
  Edit3,
  X ,
  Cake
} from 'lucide-react';
import Modal from 'react-modal';
import moment from 'moment';
import { api } from '../api/userApi';
import { setUser } from '../redux/slices/userSlice';
import IUser from '../types/IUser';

Modal.setAppElement('#root');

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  console.log('Current user state: ', user);
  
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<IUser>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) {
      setErrors(['User ID is missing']);
      return;
    }

    try {
      const updatedUser = await api.updateUserProfile(formData);
      dispatch(setUser(updatedUser));
      setSuccess('Profile updated successfully!');
      setErrors([]);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error(error);
      setErrors([error.response?.data?.message || 'An error occurred while updating the profile']);
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
            <img src={user.profile_picture || '/default-avatar.jpg'} alt="Profile" className="absolute left-8 -bottom-16 w-48 h-48 rounded-full border-4 border-[#010F18]" />
          </div>

          <div className="bg-[#1B2730] rounded-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">{user.username}</h2>
                <div className="flex space-x-4 mt-2 text-gray-300">
                  <span>{user.posts?.length || 0} posts</span>
                  <span>{user.followers.length } followers</span>
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
                  {user.social_links.map((link : string, index: number) => (
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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Profile"
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-[#D9D9D9] bg-opacity-20"
      >
        <div className="bg-[#010F18] rounded-lg w-full max-w-md p-6 relative">
          <button 
            onClick={closeModal} 
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold text-white mb-4">Edit Profile</h2>

          {success && <p className="text-green-500 mb-4">{success}</p>}
          {errors.length > 0 && (
            <ul className="text-red-500 mb-4">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}

          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1" htmlFor="username">Name</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username || ''}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-[#D9D9D9] bg-opacity-18 text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1" htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob || ''}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-[#D9D9D9] bg-opacity-18 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1" htmlFor="mobile">Mobile</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile || ''}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-[#D9D9D9] bg-opacity-18 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1" htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio || ''}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-[#D9D9D9] bg-opacity-18 text-white"
                rows={3}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1" htmlFor="location">Location</label>
              {/* <input
                type="text"
                id="location"
                name="location"
                value={formData.location || ''}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-[#D9D9D9] bg-opacity-18 text-white"
              /> */}
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1" htmlFor="social_links">Social Media Link</label>
              <input
                type="url"
                id="social_links"
                name="social_links"
                value={formData.social_links?.[0] || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, social_links: [e.target.value] }))}
                className="w-full p-2 rounded bg-[#D9D9D9] bg-opacity-18 text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#1D9BF0] text-white py-2 rounded-md hover:bg-[#2589cc] transition duration-200"
            >
              Update Profile
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;