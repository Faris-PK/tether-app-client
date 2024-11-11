import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface SuccessModalProps {
  isDarkMode: boolean;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isDarkMode }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`rounded-lg shadow-lg p-6 flex flex-col items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Thanks for letting us know
        </h3>
        <p className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-400'}`}>
          Your feedback helps keep our community safe.
        </p>
      </div>
    </div>
  );
};

export default SuccessModal;