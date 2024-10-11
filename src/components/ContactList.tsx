import React from 'react';
import { Search } from 'lucide-react';
import ProfilePicture from '../assets/profile-picture.jpg';

const ContactList: React.FC = () => {
  const contacts = [
    { id: 1, name: 'John Doe', online: true },
    { id: 2, name: 'Jane Smith', online: true },
    { id: 3, name: 'Alice Johnson', online: false },
    { id: 4, name: 'Bob Williams', online: true },
    { id: 5, name: 'Charlie Brown', online: false },
  ];

  return (
    <div className="w-1/5 bg-[#010F18] rounded-md p-4  ">
      <h2 className="text-white text-xl font-semibold mb-4">Online</h2>
      
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search contacts..."
          className="w-full bg-[#ffffff2e] text-white p-2 pl-8 rounded-md"
        />
        <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {contacts.map((contact) => (
          <div key={contact.id} className="flex items-center">
            <div className="relative">
              <img
                src={ProfilePicture}
                alt={contact.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              {contact.online && (
                <div className="absolute bottom-0 left-8 bg-green-500 rounded-full h-3 w-3 border-2 border-[#1B2730]"></div>
              )}
            </div>
            <span className="text-white">{contact.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ContactList;