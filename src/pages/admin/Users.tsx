import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { UserData } from '../../types/user';
import { Search, ArrowUpDown, Eye, UserCog, Ban, CheckCircle, MapPin, Calendar, Link2, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Users = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedUsers = await adminApi.getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleShowDetails = (user: UserData) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  const handleBlockUnblock = async (userId: string, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await adminApi.unblockUser(userId);
      } else {
        await adminApi.blockUser(userId);
      }
      await fetchUsers();
      // Update selected user if they're currently being viewed
      if (selectedUser && selectedUser._id === userId) {
        const updatedUser = users.find(u => u._id === userId);
        setSelectedUser(updatedUser || null);
      }
    } catch (error) {
      console.error('Failed to block/unblock user:', error);
    }
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
    <div className="w-full space-y-4 p-4 md:p-6">
      {/* Header and Search Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h2 className="text-2xl md:text-3xl font-bold text-[#464255]">User Management</h2>
        
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <div className="relative flex-1 sm:min-w-[300px]">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
          <Button
            onClick={handleSort}
            variant="default"
            className="bg-[#00B074] hover:bg-[#00965f]"
          >
            <span className="hidden sm:inline">Sort by Date</span>
            <ArrowUpDown className="h-4 w-4 sm:ml-2" />
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <ScrollArea className="h-[calc(100vh-12rem)] rounded-lg border">
        {loading ? (
          <div className="space-y-4 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#F7F6FE] sticky top-0">
              <tr>
                <th className="p-3 text-left hidden md:table-cell">ID</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left hidden sm:table-cell">Email</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 hidden md:table-cell">{index + 1}</td>
                  <td className="p-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.profile_picture || '/default-avatar.png'}
                        alt={`${user.username}'s avatar`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-gray-500 hidden sm:block">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 hidden sm:table-cell">
                    <span className="text-gray-600">{user.email}</span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isBlocked
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <UserCog className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleShowDetails(user)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleBlockUnblock(user._id, user.isBlocked)}
                          className={user.isBlocked ? 'text-green-600' : 'text-red-600'}
                        >
                          {user.isBlocked ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Unblock User
                            </>
                          ) : (
                            <>
                              <Ban className="mr-2 h-4 w-4" />
                              Block User
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ScrollArea>

      {/* User Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* User Header */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedUser.profile_picture || '/default-avatar.png'}
                      alt={`${selectedUser.username}'s avatar`}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-2xl font-semibold">{selectedUser.username}</h3>
                      <p className="text-gray-600">{selectedUser.email}</p>
                      {selectedUser.bio && (
                        <p className="text-gray-500 mt-2">{selectedUser.bio}</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* User Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">Joined</span>
                      </div>
                      <p className="mt-1 font-medium">
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">Location</span>
                      </div>
                      <p className="mt-1 font-medium">
                        {selectedUser.location || 'Not specified'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Link2 className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">Social Links</span>
                      </div>
                      <p className="mt-1 font-medium">
                        {selectedUser.social_links?.length || 0} connected
                      </p>
                    </div>
                  </div>

                  {/* Activity Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <UsersIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">Followers</span>
                      </div>
                      <p className="mt-1 font-medium">{selectedUser.followers?.length || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <UsersIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">Following</span>
                      </div>
                      <p className="mt-1 font-medium">{selectedUser.following?.length || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">Posts</span>
                      </div>
                      <p className="mt-1 font-medium">{selectedUser.posts?.length || 0}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowDetails(false)}
                    >
                      Close
                    </Button>
                    <Button
                      variant={selectedUser.isBlocked ? 'default' : 'destructive'}
                      onClick={() => handleBlockUnblock(selectedUser._id, selectedUser.isBlocked)}
                    >
                      {selectedUser.isBlocked ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Unblock User
                        </>
                      ) : (
                        <>
                          <Ban className="mr-2 h-4 w-4" />
                          Block User
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;