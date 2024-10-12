import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store/store';
import { UserPen, Mail, Cake, MapPin, Calendar, Link as LinkIcon } from 'lucide-react';
import moment from 'moment';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"
import EditProfileModal from './Modal/EditProfileModal';
import { api } from '../api/userApi';
import { setUser } from '../redux/slices/userSlice';
import ProfilePictureModal from './Modal/ProfilePictureModal';

const Profile: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState<boolean>(false);

  const formattedJoinDate = user?.createdAt ? moment(user.createdAt).format('MMMM D, YYYY') : 'Unknown';
  const formattedDob = user?.dob ? moment(user.dob).format('MMMM D, YYYY') : 'Unknown';

  const openModal = () => {
    setIsModalOpen(true);
    setErrors([]);
    setSuccess('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleUpload = async (type: 'profile' | 'cover', file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await api.uploadImage(formData);
      dispatch(setUser(response));
      setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} picture uploaded successfully!`);
      if (type === 'profile') {
        setIsProfileModalOpen(false);
      } else {
        setIsCoverModalOpen(false);
      }
    } catch (error) {
      console.error(`Error uploading ${type} picture:`, error);
      setErrors([...errors, `Failed to upload ${type} picture.`]);
    }
  };

  const handleRemove = async (type: 'profile' | 'cover') => {
    try {
      const response = await api.removeProfilePicture(type);
      dispatch(setUser(response));
      setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} picture removed successfully!`);
      setIsCoverModalOpen(false); // Close the modal after removing the cover photo
    } catch (error) {
      console.error(`Error removing ${type} picture:`, error);
      setErrors([...errors, `Failed to remove ${type} picture.`]);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[#010F18] flex w-4/5 h-screen overflow-hidden hide-scrollbar rounded-md">
      <div className="flex-grow flex flex-col overflow-hidden">
        <div className="flex-grow overflow-y-auto p-4 rounded-md">
        <div className="relative mb-16">
            <img src={user.cover_photo || '/default-cover.jpg'} alt="Cover" className="w-full h-64 object-cover rounded-sm border-2 border-[#b2b4b4]" />
            <div className="absolute top-2 right-2">
              <ProfilePictureModal
                onUpload={(file) => handleUpload('cover', file)}
                onRemove={() => handleRemove('cover')}
                isProfilePicture={false}
                onClose={() => setIsCoverModalOpen(false)}
              />
            </div>
            <img src={user.profile_picture || '/default-avatar.jpg'} alt="Profile" className="absolute left-8 -bottom-16 w-48 h-48 rounded-full border-2 border-[#b2b4b4]" />
            <div className="absolute left-48 bottom-0">
              <ProfilePictureModal
                onUpload={(file) => handleUpload('profile', file)}
                onRemove={() => handleRemove('profile')}
                isProfilePicture={true}
                onClose={() => setIsProfileModalOpen(false)}
              />
            </div>
          </div>

          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-xl mt-3">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-3xl font-bold">{user.username}</CardTitle>
            <div className="flex space-x-4 mt-2 text-gray-300">
              <span>{user.posts?.length || 0} posts</span>
              <span>{user.followers.length} followers</span>
              <span>{user.following?.length} following</span>
            </div>
          </div>
          <Button variant="outline" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={openModal}>
            <UserPen size={16} className="mr-2" />
            Edit Profile
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-6">{user.bio}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-300">
            <Mail size={16} className="mr-2 text-blue-400" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Cake size={16} className="mr-2 text-pink-400" />
            <span>{formattedDob}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <MapPin size={16} className="mr-2 text-green-400" />
            <span>{user.location || 'Not specified'}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Calendar size={16} className="mr-2 text-purple-400" />
            <span>Joined {formattedJoinDate}</span>
          </div>
        </div>
        {user.social_links && user.social_links.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Social Links</h3>
            <ul className="space-y-2">
              {user.social_links.map((link : string , index : number) => (
                <li key={index} className="flex items-center">
                  <LinkIcon size={14} className="mr-2 text-blue-400" />
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {user.premium_status && (
          <div className="mt-6">
            <Badge variant="secondary" className="bg-yellow-500 text-black">
              Premium User
              {user.premium_expiration && (
                <span className="ml-2">
                  Expires on {moment(user.premium_expiration).format('MMMM D, YYYY')}
                </span>
              )}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>

          {/* You can add Posts and Marketplace sections here */}
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={closeModal}
        user={user}
      />
    </div>
  );
};

export default Profile;

function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}
