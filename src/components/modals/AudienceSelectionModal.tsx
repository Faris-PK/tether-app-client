import React, { useState } from 'react';
import { X, Globe, Users, Lock, User, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface AudienceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedAudience: string) => void;
}

const AudienceSelectionModal: React.FC<AudienceSelectionModalProps> = ({ isOpen, onClose, onSelect }) => {
  const { isDarkMode } = useTheme();
  const [selectedOption, setSelectedOption] = useState('public');

  if (!isOpen) return null;

  const options = [
    { id: 'public', icon: Globe, label: 'Public', description: 'Anyone on Tether' },
    { id: 'friends', icon: Users, label: 'Friends', description: 'Your friends on Tether' },
    { id: 'only-me', icon: Lock, label: 'Only me', description: '' },
    { id: 'specific-friends', icon: User, label: 'Specific friends', description: 'Only show to some friends' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 w-screen h-screen flex items-center justify-center">
      <div className={`bg-${isDarkMode ? 'gray-800' : 'white'} w-full max-w-md rounded-lg shadow-lg`}>
        <div className="flex justify-between items-center p-4 border-b border-${isDarkMode ? 'gray-600' : 'gray-300'}">
          <h2 className={`text-xl font-semibold text-${isDarkMode ? 'white' : 'black'}`}>Post audience</h2>
          <button onClick={onClose} className={`text-${isDarkMode ? 'gray-400' : 'gray-600'} hover:text-white`}>
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4">
          <p className={`text-${isDarkMode ? 'white' : 'black'} mb-4`}>Who can see your post</p>
          <div className="space-y-4">
            {options.map((option) => (
              <button 
                key={option.id}
                className={`w-full flex items-center text-${isDarkMode ? 'white' : 'black'} p-2 hover:bg-${isDarkMode ? 'gray-700' : 'gray-200'} rounded-md`}
                onClick={() => {
                  setSelectedOption(option.id);
                  onSelect(option.id);
                }}
              >
                <div className="mr-3 relative">
                  <option.icon size={24} className={`text-${isDarkMode ? 'gray-400' : 'gray-600'}`} />
                  <div className={`absolute -top-1 -right-1 w-4 h-4 bg-[#0095F6] rounded-full flex items-center justify-center ${selectedOption === option.id ? 'opacity-100' : 'opacity-0'}`}>
                    <Check size={12} color="white" />
                  </div>
                </div>
                <div className="text-left flex-grow">
                  <p className="font-semibold">{option.label}</p>
                  {option.description && <p className={`text-sm text-${isDarkMode ? 'gray-400' : 'gray-600'}`}>{option.description}</p>}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceSelectionModal;