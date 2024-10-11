import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { UserData } from '../../types/user';
import { Search, ArrowUpDown, Eye } from 'lucide-react';

const Users: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await adminApi.getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleBlockUnblock = async (userId: string, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await adminApi.unblockUser(userId);
      } else {
        await adminApi.blockUser(userId);
      }
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Failed to block/unblock user:', error);
    }
  };

  const handleShowDetails = (userId: string) => {
    // Implement show details functionality
    console.log('Show details for user:', userId);
  };

  const filteredUsers = users
    .filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-[#464255] mb-6">Users</h2>
      
      <div className="mb-4 flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button
          onClick={handleSort}
          className="flex items-center px-4 py-2 bg-[#00B074] text-white rounded-lg"
        >
          Sort by Date <ArrowUpDown className="ml-2" />
        </button>
      </div>

      <div className="overflow-x-auto">
        {filteredUsers.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F7F6FE] text-left">
                <th className="p-3">Sl No</th>
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">Status</th>
                <th className="p-3">Registration Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user._id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F7F6FE]'}>
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">
                    <div className="flex items-center">
                      {/* <img 
                        src={user.profilePicture || '/default-avatar.png'} 
                        alt={`${user.username}'s avatar`}
                        className="w-10 h-10 rounded-full mr-3"
                      /> */}
                      {user.username}
                    </div>
                  </td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full ${user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-[#ADFFD0] text-[#1F9254]'}`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleBlockUnblock(user._id, user.isBlocked)}
                      className={`px-3 py-1 rounded mr-2 ${user.isBlocked ? 'bg-green-500' : 'bg-red-500'} text-white`}
                    >
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600 mt-6">No users found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default Users;
