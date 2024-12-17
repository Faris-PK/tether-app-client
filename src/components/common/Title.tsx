import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Title = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate('/home')} 
      className={`w-1/6 h-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} flex items-center justify-center overflow-hidden rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 cursor-pointer`}
    >
      <div className="flex items-center space-x-2 px-3 group">
        <div className="w-6 h-6 bg-[#1D9BF0] rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-12">
          <span className="text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">T</span>
        </div>
        <span className="text-[#1D9BF0] font-bold text-md tracking-wider group-hover:tracking-widest transition-all duration-300">Tether.</span>
      </div>
    </div>
  );
};

export default Title;
