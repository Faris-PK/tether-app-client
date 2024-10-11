import React from 'react';
import { Image, Video, Radio } from 'lucide-react';
import ProfilePicture from '../assets/profile-picture.jpg';

const PostCreation: React.FC = () => {
  return (
    <div className="bg-[#010F18] p-4 rounded-md mb-4 ">
    <div className="flex items-start">
      <img
        src={ProfilePicture}
        alt="Your Profile"
        className="w-12 h-12 rounded-full mr-4"
      />
      <div className="flex-grow">
        <textarea
          placeholder="Share your thoughts..."
          className="w-full bg-[#ffffff2e] text-white p-3 rounded-md h-12 mb-2 resize-none"
        />
        <div className="flex justify-between items-center mt-2">
          <div className="flex space-x-44 w-full">
            <div className="border-2 border-[#908888] rounded-3xl px-10 py-1">
              <button className="flex items-center text-white">
                <Image className="h-5 w-5 mr-1 text-[#20B048]" />
                Photo
              </button>
            </div>
            <div className="border-2 border-[#908888] rounded-3xl px-10 py-1">
              <button className="flex items-center text-white">
                <Video className="h-5 w-5 mr-1 text-[#059DBF]" />
                Video
              </button>
            </div>
            <div className="border-2 border-[#908888] rounded-3xl px-10 py-1">
              <button className="flex items-center text-white">
                <Radio className="h-5 w-5 mr-1 text-[#FF0000]" />
                Live
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default PostCreation