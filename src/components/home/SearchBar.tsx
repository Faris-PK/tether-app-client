import { Search } from 'lucide-react';
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const SearchBar = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`w-1/4 h-10 ${isDarkMode ? 'bg-gray-600' : 'bg-[#ecf2ff]'} flex items-center px-3 rounded-md shadow-lg transition-colors duration-200`}>
      <Search className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} w-5 h-5`} />
      <input
        type="text"
        placeholder="Search"
        className={`ml-2 w-full bg-transparent outline-none ${isDarkMode ? 'text-gray-200 placeholder-gray-400' : 'text-gray-700 placeholder-gray-500'}`}
      />
    </div>
  );
};

export default SearchBar;