import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store/store';
import Modal from 'react-modal';
import { X } from 'lucide-react';
import moment from 'moment';
import { api } from '../../api/userApi';
import { setUser } from '../../redux/slices/userSlice';
import IUser from '../../types/IUser';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import { useTheme } from '../../contexts/ThemeContext';

const googleClientId = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// Initialize Mapbox geocoding client
const geocodingClient = mbxGeocoding({
  accessToken: googleClientId,
});

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
  const { isDarkMode } = useTheme();

  const [locationQuery, setLocationQuery] = useState(user?.userLocation?.name || '');
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    if (name === 'location') {
      console.log(value,"value of location")
      setLocationQuery(value);
      console.log(value,"value of location 2")

      if (value.length > 2) {
        geocodingClient
          .forwardGeocode({
            query: value,
            autocomplete: true,
            limit: 5,
          })
          .send()
          .then((response) => {
            setLocationSuggestions(response.body.features);
          })
          .catch((error) => console.error('Geocoding error:', error));
      }
    }
  

  };
  

  const handleLocationSelect = (place: any) => {
    setFormData((prev) => ({
      ...prev,
      userLocation: {
        ...prev.userLocation,
        name: place.place_name,
        coordinates: {
          latitude: place.geometry.coordinates[1],
          longitude: place.geometry.coordinates[0]
        }
      },
    }));
    setLocationQuery(place.place_name);
    setLocationSuggestions([]);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) {
      setErrors(['User ID is missing']);
      return;
    }

    try {
      console.log(' Data before updating profiel : ', formData)
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
      className={`fixed inset-0 flex items-center justify-center p-4 ${
        isDarkMode ? 'bg-gray-800 bg-opacity-20' : 'bg-[#D9D9D9] bg-opacity-20'
      }`}
      overlayClassName="fixed inset-0 backdrop-blur-sm"
    >
      <div
        className={`bg-[#010F18] rounded-xl w-full max-w-md p-6 relative shadow-black drop-shadow-md transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800' : 'bg-[#ffff]'
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 text-white hover:text-gray-300 ${
            isDarkMode ? 'text-white hover:text-gray-300' : 'text-[#000] hover:text-gray-600'
          }`}
        >
          <X size={24} />
        </button>
        <h2
          className={`text-2xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-[#000]'
          }`}
        >
          Edit Profile
        </h2>

        {errors.length > 0 && (
          <ul className="text-red-500 mb-4">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}

        <form onSubmit={handleUpdateProfile}>
          <div className="mb-4">
            <label
              className={`block font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-[#000]'
              }`}
              htmlFor="username"
            >
              Name
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username || ''}
              onChange={handleInputChange}
              className={`w-full p-2 rounded bg-gray-600 bg-opacity-18 ${
                isDarkMode
                  ? 'text-white focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] transition duration-200'
                  : 'text-[#000] focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] transition duration-200'
              }`}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className={`block font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-[#000]'
              }`}
              htmlFor="dob"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob ? moment(formData.dob).format('YYYY-MM-DD') : ''}
              onChange={handleInputChange}
              className={`w-full p-2 rounded bg-gray-600 bg-opacity-18 ${
                isDarkMode
                  ? 'text-white focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] transition duration-200'
                  : 'text-[#000] focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] transition duration-200'
              }`}
            />
          </div>
          <div className="mb-4">
            <label
              className={`block font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-[#000]'
              }`}
              htmlFor="mobile"
            >
              Mobile
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile || ''}
              onChange={handleInputChange}
              className={`w-full p-2 rounded bg-gray-600 bg-opacity-18 ${
                isDarkMode
                  ? 'text-white focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] transition duration-200'
                  : 'text-[#000] focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] transition duration-200'
              }`}
            />
          </div>
          <div className="mb-4">
            <label
              className={`block font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-[#000]'
              }`}
              htmlFor="bio"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio || ''}
              onChange={handleInputChange}
              className={`w-full p-2 rounded bg-gray-600 bg-opacity-18 ${
                isDarkMode
                  ? 'text-white focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] transition duration-200'
                  : 'text-[#000] focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] transition duration-200'
              }`}
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label
              className={`block font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-[#000]'
              }`}
              htmlFor="location"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={locationQuery}
              onChange={handleInputChange}
              className={`w-full p-2 rounded bg-gray-600 bg-opacity-18 ${
                isDarkMode
                  ? 'text-white focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] transition duration-200'
                  : 'text-[#000] focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] transition duration-200'
              }`}
            />

            {/* Render location suggestions */}
            {locationSuggestions.length > 0 && (
              <ul
                className={`bg-gray-700 rounded mt-2 ${
                  isDarkMode ? 'text-white' : 'text-[#000]'
                }`}
              >
                {locationSuggestions.map((place) => (
                  <li
                    key={place.id}
                    className="p-2 cursor-pointer hover:bg-gray-500 transition-colors duration-200"
                    onClick={() => handleLocationSelect(place)}
                  >
                    {place.place_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <button
            type="submit"
            className={`w-full py-3 font-semibold transition-all duration-300 ease-in-out ${
              isDarkMode
                ? 'bg-[#1D9BF0] text-white hover:bg-[#1aa3d4] hover:text-white'
                : 'bg-[#1D9BF0] text-white hover:bg-[#2596be] hover:text-white'
            }`}
          >
            Update Profile
            </button>
        </form>
      </div>
    </Modal>
  );
};

export default EditProfileModal;