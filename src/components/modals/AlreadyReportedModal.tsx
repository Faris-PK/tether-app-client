import React from 'react';

interface AlreadyReportedModalProps {
  isDarkMode: boolean;
  onClose: () => void;
}

const AlreadyReportedModal: React.FC<AlreadyReportedModalProps> = ({ isDarkMode, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`rounded-lg shadow-lg p-6 flex flex-col items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center mb-4">
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Already Reported
        </h3>
        <p className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-400'}`}>
          You've already reported this post. Thank you for your feedback!
        </p>
        <button
          onClick={onClose}
          className={`mt-4 px-4 py-2 rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'} hover:${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AlreadyReportedModal;
