import React, { useState } from 'react';
import { Search, Car, Home, ShoppingBag, Smartphone, Trophy, Gamepad, Sofa, MapPin } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import AddProductModal from '../Modal/AddProductModal';


interface Category {
  icon: React.ReactNode;
  name: string;
}

interface SidebarProps {
    onSearch?: (query: string) => void;
    onPriceChange?: (min: string, max: string) => void;
    onCategorySelect?: (category: string) => void;
    onLocationClick?: () => void;
  }

  const Sidebar: React.FC<SidebarProps> = ({ 
    onSearch, 
    onPriceChange, 
    onCategorySelect,
    onLocationClick,
  }) => {
  const { isDarkMode } = useTheme();
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const locationRef = React.useRef<HTMLDivElement>(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);


  const categories: Category[] = [
    { icon: <Car className="w-5 h-5" />, name: 'Vehicles' },
    { icon: <Home className="w-5 h-5" />, name: 'Property' },
    { icon: <ShoppingBag className="w-5 h-5" />, name: 'Clothes' },
    { icon: <Smartphone className="w-5 h-5" />, name: 'Mobiles' },
    { icon: <Trophy className="w-5 h-5" />, name: 'Sports' },
    { icon: <Gamepad className="w-5 h-5" />, name: 'Games' },
    { icon: <Sofa className="w-5 h-5" />, name: 'Furniture' },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    if (type === 'min') {
      setPriceMin(value);
    } else {
      setPriceMax(value);
    }
    onPriceChange?.(type === 'min' ? value : priceMin, type === 'max' ? value : priceMax);
  };

  return (
    <div className={`w-64 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-4 h-full rounded-lg shadow-md transition-colors duration-200`}>
      <div className="mb-6">
        <h2 className={`text-xl mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'} font-semibold`}>Marketplace</h2>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search Marketplace"
            className={`w-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <Search className={`absolute right-3 top-2.5 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>

        {/* Create New List Button */}
        <button 
          className="w-full hover:bg-[#38a0e6] bg-[#30bef1] text-white rounded-lg py-2 px-4 text-sm transition-colors"
          onClick={() => setIsAddProductModalOpen(true)}
        >
          + Create new list
        </button>
      </div>

      {/* Filters Section */}
      <div className="mb-6">
        <h3 className={`text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Filters</h3>
        {/* Location */}
        <div className="flex items-center gap-2 text-blue-400 text-sm mb-4 cursor-pointer" onClick={() => onLocationClick?.()}>
        <MapPin className="w-5 h-5" />
        <span>Your location</span>
        </div>


        {/* Price Range */}
        <div className="mb-4">
          <h4 className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Price</h4>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min."
              value={priceMin}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className={`w-1/2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} rounded-lg py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <input
              type="number"
              placeholder="Max."
              value={priceMax}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className={`w-1/2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} rounded-lg py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>

        {/* Date List Dropdown */}
        <div className="mb-4">
          <select 
            className={`w-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            onChange={(e) => {/* Add your date sort handler here */}}
          >
            <option value="">Date list</option>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className={`text-lg mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Categories</h3>
        <div className="space-y-2">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg cursor-pointer transition-colors`}
              onClick={() => onCategorySelect?.(category.name)}
            >
              <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{category.icon}</div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{category.name}</span>
            </div>
          ))}
        </div>
      </div>
      <AddProductModal 
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        isDarkMode={isDarkMode}
        categories={categories}
      />
    </div>
  );
};

export default Sidebar;