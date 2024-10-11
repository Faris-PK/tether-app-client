import React from 'react';
import { MapPin, MoreVertical, Heart, MessageCircle, Share2 } from 'lucide-react';
import ProfilePicture from '../assets/profile-picture.jpg';
import post1 from '../assets/post-1.jpg';

const PostList: React.FC = () => {
  const posts = [
    {
      id: 1,
      username: 'John Doe',
      location: 'New York City',
      postedTime: '2 hours ago',
      caption: 'Enjoying the view from the top of the Empire State Building! 🗽',
      imageUrl: post1,
      likes: 1234,
      comments: 56,
    },
    {
      id: 2,
      username: 'Jane Smith',
      location: 'Paris',
      postedTime: '5 hours ago',
      caption: 'A perfect day at the Eiffel Tower ❤️',
      imageUrl: post1, 
      likes: 5678,
      comments: 123,
    },
  ];

  return (
    <div className="space-y-4 hide-scrollbar overflow-auto ">
      {posts.map((post) => (
        <div key={post.id} className="bg-[#010F18] p-4 rounded-md">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <img src={ProfilePicture} alt={post.username} className="w-10 h-10 rounded-full mr-3" />
              <div>
                <h3 className="text-white font-semibold">{post.username}</h3>
                <div className="flex items-center text-gray-400 text-sm">
                  <MapPin size={14} className="mr-1" />
                  <span>{post.location}</span>
                </div>
                <span className="text-gray-400 text-xs">{post.postedTime}</span>
              </div>
            </div>
            <button className="text-white">
              <MoreVertical size={20} />
            </button>
          </div>

          <p className="text-white mb-4">{post.caption}</p>
          <img src={post.imageUrl} alt="Post content" className="w-full h-150 object-cover rounded-md mb-4" />

          <div className="flex justify-between text-gray-400 mb-4">
            <div className="flex items-center">
              <div className="bg-[#FF0000] rounded-full p-1 mr-2">
                <Heart size={16} className="text-white" />
              </div>
              <span>{post.likes} likes</span>
            </div>
            <span>{post.comments} comments</span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-4">
            {[
              { icon: Heart, text: 'Like' },
              { icon: MessageCircle, text: 'Comment' },
              { icon: Share2, text: 'Share' },
            ].map(({ icon: Icon, text }, index) => (
              <button key={index} className="flex items-center text-white">
                <Icon size={20} className="mr-2" />
                {text}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList