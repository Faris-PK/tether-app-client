import React from 'react';

import NavBarSection from '../../components/NavBarSection';
import TopBar from '../../components/TopBar';
import Profile from '../../components/Profile';

const ProfilePage: React.FC = () => {
  

  return (
   <div className="bg-[#1B2730] flex h-screen overflow-hidden">
      <div className="w-1/5 p-3 flex flex-col overflow-y-auto">
      <div className="bg-[#010F18] p-2 rounded-md mb-4">
        <h1 className="text-2xl text-white font-bold text-center">Tether.</h1>
      </div>
       
        {/* Render NavBarSection */}
        <aside className="w-full text-white mt-24">
          <NavBarSection />
        </aside>
      </div>
      
      <div className="flex-grow flex flex-col ">
        <TopBar />
        {/* <div className="flex p-3 overflow-hidden h-full"> */}
          <div className="flex-grow mr-4">
            <Profile/>      
          </div>    
        {/* </div> */}
      </div>
    </div>

  );
};

export default ProfilePage;