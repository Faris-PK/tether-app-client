import React from 'react';

import NavBarSection from '../../components/NavBarSection';
import TopBar from '../../components/TopBar';
import Profile from '../../components/Profile';

const ProfilePage: React.FC = () => {
  

  return (
   <div className="bg-[#1B2730] flex h-screen overflow-hidden">
      <div className="w-1/5 p-3 flex flex-col overflow-y-auto">
      <div className="bg-[#010F18] p-2 rounded-md mb-4 shadow-[4px_4px_10px_rgba(0,0,0,0.5)]">
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-200 via-blue-500 to-black bg-clip-text text-transparent">Tether.</h1>
      </div>
       
        {/* Render NavBarSection */}
        <aside className="w-full text-white mt-24">
          <NavBarSection />
        </aside>
      </div>
      
      <div className="flex-grow flex flex-col ">
        <TopBar />
        <div className=" flex p-3 overflow-hidden h-full">
          <div className="flex-grow mr-5  ">
            <Profile/>      
          </div>    
        </div>
      </div>
    </div>

  );
};

export default ProfilePage;