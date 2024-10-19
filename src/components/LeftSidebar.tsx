import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../redux/slices/userSlice';
import { RootState } from '../redux/store/store';
import { 
  House, 
  Users, 
  BookMarked, 
  Youtube, 
  Settings, 
  Store
} from 'lucide-react';
import ProfilePicture from '../assets/profile-picture.jpg';
import CoverPhoto from '../assets/Cover-photo.jpg';
import Modal from '../components/Modal/SetingsModal';
import { api } from '../api/userApi';

const LeftSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
    setIsModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      dispatch(clearUser());
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="w-1/5 p-3 flex flex-col overflow-y-auto">
      <div>
        <div className="bg-[#1B2730] p-2 rounded-md mb-4">
          <h1 className="text-2xl text-white font-bold text-center">Tether.</h1>
        </div>
        
        <div className="flex flex-col items-center mb-6 border-2 rounded-md" style={{ borderColor: '#908888' }}>
          <img src={CoverPhoto} alt="Cover" className="w-full h-28 object-cover" />
          <img src={ProfilePicture} alt="Profile" className="w-24 h-24 rounded-full border-2 border-white -mt-10" />
          <h2 className="mt-2 mb-4 text-lg text-white font-medium">{user.username}</h2>
        </div>
      </div>

      <aside className="w-full text-white mt-4">
        <nav>
          <ul className="space-y-4 bg-[#1B2730] p-4 rounded-lg font-medium flex flex-col items-center">
            {[
              { icon: House, text: 'Home' },
              { icon: Users, text: 'Friends' },
              { icon: BookMarked, text: 'Saved' },
              { icon: Youtube, text: 'Videos' },
              { icon: Settings, text: 'Settings', onClick: handleSettingsClick },
              { icon: Store, text: 'Marketplace' },
            ].map(({ icon: Icon, text, onClick }, index) => (
              <li key={index} className="w-5/6">
                <button 
                  className="border border-[#908888] rounded-full w-full flex items-center justify-center space-x-2 p-2 hover:bg-white hover:bg-opacity-30 active:bg-white active:bg-opacity-60 transition duration-300"
                  onClick={onClick}
                >
                  <Icon size={20} />
                  <span>{text}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} anchorElement={anchorElement} onLogout={handleLogout} />
      </aside>
    </div>
  );
};

export default LeftSidebar