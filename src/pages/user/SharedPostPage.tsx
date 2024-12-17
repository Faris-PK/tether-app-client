
import SideNav from '@/components/common/SettingsNav'
import Title from '@/components/common/Title'
import SharedPost from '@/components/post/SharedPost'
import { useTheme } from '../../contexts/ThemeContext';


const SharedPostPage: React.FC = () => {
  const { isDarkMode } = useTheme();


  return (
    <>
   
    <div className={`mx-auto p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-[#d8d4cd]'} h-screen flex flex-col transition-colors duration-200`}>
      <header className="flex justify-between items-center mb-4">
        <Title/>     
       
      </header>

      <div className="flex space-x-4 flex-1 overflow-hidden">
        <div className="w-1/6 space-y-4">
        
          <SideNav/>
        </div>
        <div className="w-2/3 space-y-4 overflow-y-auto pr-4 scrollbar-hide pt-2">
          
          <SharedPost/>
        </div>

        <div className="w-1/6">
        
        </div>
      </div>
    </div>
    </>
  )
}

export default SharedPostPage