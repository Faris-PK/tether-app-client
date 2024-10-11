import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import ProfilePicture from '../assets/profile-picture.jpg';
import CoverPhoto from '../assets/Cover-photo.jpg';

const ProfileSection: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <div className=" bg-[#010F18] flex flex-col items-center mb-6 rounded-md ">
      <img src={CoverPhoto} alt="Cover" className="w-full h-28 object-cover rounded-t-md" />
      <img src={ProfilePicture} alt="Profile" className="w-24 h-24 rounded-full border-2 border-white -mt-10" />
      <h2 className="mt-2 mb-4 text-lg text-white font-medium">{user.username}</h2>
    </div>
  );
};

export default ProfileSection;
