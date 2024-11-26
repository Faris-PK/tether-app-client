import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Home, Bookmark, Settings, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PremiumSubscriptionModal from '../modals/PremiumSubscriptionModal';
import { RootState } from '@/redux/store/store';

const SideNav = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const {user} = useSelector((state: RootState) => state.user);


  // State to keep track of the active navigation item
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  // Define your navigation items with their respective icons, labels, and routes
  const navItems = [
    { icon: Home, label: 'Home', path: '/user/home' },
    { icon: Bookmark, label: 'Saved', path: '/user/saved' },
    { icon: Settings, label: 'Settings', path: '/user/settings' },
    { icon: ShoppingBag, label: 'Market Place', path: '/user/marketplace' },
  ];

  const handleNavItemClick = (index : any, path : any) => {
    setActiveIndex(index);
    if (path === '/user/marketplace') {
      if (user?.premium_status) {
        navigate(path);
      } else {
        setIsPremiumModalOpen(true);
      }
    } else {
      navigate(path);
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden shadow-black drop-shadow-md`}>
      <div className="p-5">
        <nav className="space-y-2">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavItemClick(index, item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                ${activeIndex === index 
                  ? `${isDarkMode ? 'bg-gray-700 text-[#1D9BF0]' : 'bg-blue-50 text-[#1D9BF0]'}` 
                  : `${isDarkMode 
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-[#1D9BF0]' 
                      : 'text-gray-600 hover:bg-blue-50 hover:text-[#1D9BF0]'}` 
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      {!user?.premium_status && <PremiumSubscriptionModal isOpen={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} />}
    </div>
  );
};

export default SideNav;