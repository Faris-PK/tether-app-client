import { useTheme } from '../../contexts/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { useNavigate } from 'react-router-dom';
import { Crown } from 'lucide-react';

const ProfileCard = () => {
  const { isDarkMode } = useTheme();
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden shadow-black drop-shadow-md transition-colors duration-200`}>
        <div className="relative">
          <div className="h-24 flex items-center justify-center relative">
            <img
              src={user?.cover_photo}
              alt="Cover Photo"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <img
            src={user?.profile_picture || "/api/placeholder/80/80"}
            alt="Profile"
            className="w-20 h-20 rounded-full absolute left-1/2 transform -translate-x-1/2 -bottom-10"
          />
        </div>

        <div className="pt-10 px-4 text-center">
          <h2 className="flex items-center justify-center space-x-1 mb-2">
            <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {user?.username}
            </span>
            {user?.premium_status && (
              <Crown 
                size={18} 
                className="text-yellow-500  ml-1" 
                fill="currentColor"
              />
            )}
          </h2>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>
            {user?.bio}
          </p>
          <div className="flex justify-center space-x-8 text-sm">
          </div>
        </div>
        <div className={`border-t ${isDarkMode ? 'border-gray-600' : 'border-[#d5d8db]'} mt-5 min-w-fit`}></div>
        <button
          onClick={() => navigate('/user/profile')}
          className={`w-full py-3 font-semibold transition-all duration-300 ease-in-out 
            ${isDarkMode ? 'text-[#1D9BF0] hover:text-[#1aa3d4] hover:bg-gray-700' : 'text-[#1D9BF0] hover:text-[#2596be] hover:bg-[#e0dcdc]'}`}
        >
          My Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;