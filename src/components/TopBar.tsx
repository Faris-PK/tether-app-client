import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../redux/slices/userSlice';
import { 
  House, 
  Users, 
  BookMarked, 
  Youtube, 
  Settings, 
  Store
} from 'lucide-react';
import Modal from '../components/Modal/SetingsModal';
import { api } from '../api/userApi';

const NavBarSection: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const handleHomeClick = () => {
    console.log('handleHomeClick');
    navigate('/home');  
  };

  const handleFriendsClick = () => {
    console.log('handleFriendsClick');
    
    navigate('/user/friends');  
  };

  return (
    <>
      <nav className="hide-scrollbar overflow-auto shadow-[4px_4px_10px_rgba(0,0,0,0.5)]">
        <ul className="space-y-5  bg-[#010F18] p-4 rounded-lg font-thin flex flex-col items-center ">
          {[
            {  icon: House, text: 'Home', onClick: handleHomeClick },
            { icon: Users, text: 'My Network', onClick: handleFriendsClick },
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
    </>
  );
};

export default NavBarSection;
