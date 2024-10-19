import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import ProfilePicture from '../assets/profile-picture.jpg';
import CoverPhoto from '../assets/Cover-photo.jpg';

const ProfileSection: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
 //console.log('User details fron slice: ', user);
 
  return (
    <div className=" bg-[#010F18] flex flex-col items-center mb-6 rounded-md shadow-[4px_4px_10px_rgba(0,0,0,0.5)]">
      <img src={user?.cover_photo} alt="Cover" className="w-full h-28 object-cover rounded-t-md" />
      <img src={user?.profile_picture} alt="Profile" className="w-24 h-24 rounded-full border-2 border-white -mt-10" />
      <h2 className="mt-2 mb-4 text-lg text-white font-medium">{user?.username}</h2>
    </div>
  );
};

export default ProfileSection;