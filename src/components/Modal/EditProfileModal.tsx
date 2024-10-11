import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store/store';
import Modal from 'react-modal';
import { X } from 'lucide-react';
import moment from 'moment';
import { api } from '../../api/userApi';
import { setUser } from '../../redux/slices/userSlice';
import IUser from '../../types/IUser';
console.log();

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUser | null;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, user }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<Partial<IUser>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

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
      onClose();
    } catch (error: any) {
      console.error(error);
      setErrors([error.response?.data?.message || 'An error occurred while updating the profile']);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit Profile"
      className="fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-[#D9D9D9] bg-opacity-20"
    >
      <div className="bg-[#010F18] rounded-lg w-full max-w-md p-6 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-white hover:text-gray-300"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">Edit Profile</h2>

        {/* {success && <p className="text-green-500 mb-4">{success}</p>} */}
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
              value={formData.dob ? moment(formData.dob).format('YYYY-MM-DD') : ''}
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
            <input
                type="text"
                id="location"
                name="location"
                value={formData.location ? JSON.stringify(formData.location) : ''}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value ? JSON.parse(e.target.value) : null }))}
                className="w-full p-2 rounded bg-[#D9D9D9] bg-opacity-18 text-white"
            />
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
  );
};

export default EditProfileModal;