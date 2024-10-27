import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { Search, ArrowUpDown, Eye, Ban, CheckCircle, MoreHorizontal, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
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


// Type definition for post data
type PostData = {
  _id: string;
  title: string | undefined;
  content: string;
  author: {
    _id: string;
    username: string | undefined;
    profile_picture: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
  image?: string;
  isBlocked: boolean;
};

const Posts = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedPost, setSelectedPost] = useState<PostData | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await adminApi.getPosts();
      
      
      // Transform the data to match our PostData type
      const transformedPosts = fetchedPosts.map((post: any) => ({
        _id: post._id,
        title: post.caption || 'Untitled Post',
        content: post.caption || '',
        author: {
          _id: post.userId?._id || '',
          username: post.userId?.username || 'Unknown User',
          profile_picture: post.userId?.profile_picture || '/default-avatar.png',
        },
        createdAt: post.createdAt,
        likes: post.likes || 0, 
        comments: post.comments?.length || 0,
        image: post.mediaUrl,
        isBlocked: post.isBlocked || false,
      }));
      
      setPosts(transformedPosts);
      console.log('posts : ', posts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setError('Failed to load posts. Please try again later.');
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

  const handleShowDetails = (post: PostData) => {
    setSelectedPost(post);
    setShowDetails(true);
  };

  const handleBlockPost = async (postId: string, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await adminApi.unblockPost(postId);
      } else {
        await adminApi.blockPost(postId);
      }
      await fetchPosts(); // Refresh the post list
    } catch (error) {
      console.error('Failed to update post status:', error);
      setError('Failed to update post status. Please try again.');
    }
  };

  const filteredPosts = posts
    .filter(post => {
      const searchLower = searchTerm.toLowerCase();
      const titleMatch = post.title?.toLowerCase().includes(searchLower) || false;
      const authorMatch = post.author.username?.toLowerCase().includes(searchLower) || false;
      return titleMatch || authorMatch;
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  if (loading) {
    return <div className="text-center py-8">Loading posts...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>{error}</p>
        <button 
          onClick={fetchPosts}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 p-4 md:p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h2 className="text-2xl md:text-3xl font-bold text-[#464255]">Posts Management</h2>
        
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <div className="relative flex-1 sm:min-w-[300px]">
            <Input
              placeholder="Search posts..."
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
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchPosts} variant="outline">
              Retry
            </Button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#F7F6FE] sticky top-0">
              <tr>
                <th className="p-3 text-left hidden md:table-cell">ID</th>
                <th className="p-3 text-left">Author</th>
                <th className="p-3 text-left hidden sm:table-cell">Content</th>
                <th className="p-3 text-left hidden lg:table-cell">Engagement</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post, index) => (
                <tr key={post._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 hidden md:table-cell">{index + 1}</td>
                  <td className="p-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.author.profile_picture}
                        alt={`${post.author.username}'s avatar`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="hidden sm:block">
                        <p className="font-medium">{post.author.username}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 hidden sm:table-cell">
                    <p className="line-clamp-2">{post.title}</p>
                  </td>
                  <td className="p-3 hidden lg:table-cell">
                    <div className="flex space-x-4">
                      <span className="flex items-center">
                        <span className="text-red-500 mr-1">❤️</span>
                        {post.likes}
                      </span>
                      <span className="flex items-center">
                        <span className="text-blue-500 mr-1">💬</span>
                        {post.comments}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.isBlocked
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {post.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleShowDetails(post)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleBlockPost(post._id, post.isBlocked)}
                          className={post.isBlocked ? 'text-green-600' : 'text-red-600'}
                        >
                          {post.isBlocked ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Unblock Post
                            </>
                          ) : (
                            <>
                              <Ban className="mr-2 h-4 w-4" />
                              Block Post
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

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Post Details</DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedPost.author.profile_picture}
                      alt={`${selectedPost.author.username}'s avatar`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{selectedPost.author.username}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(selectedPost.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold">{selectedPost.title}</h2>
                  
                  {selectedPost.image && (
                    <img
                      src={selectedPost.image}
                      alt="Post content"
                      className="w-full rounded-lg object-cover"
                      loading="lazy"
                    />
                  )}
                  
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedPost.content}</p>
                  
                  <div className="flex space-x-4 text-gray-600">
                    <span className="flex items-center">
                      ❤️ {selectedPost.likes} likes
                    </span>
                    <span className="flex items-center">
                      💬 {selectedPost.comments} comments
                    </span>
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

export default Posts;