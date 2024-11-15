import { PostApi } from '@/api/postApi';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Heart, MessageCircle, MapPin } from 'lucide-react';

interface PostData {
  _id: string;
  userId: {
    profile_picture: string;
    username: string;
    _id: string;
  };
  caption: string;
  mediaUrl: string;
  postType: string;
  location: string;
  likes: string[];
  commentCount: number;
  createdAt: string;
  isBlocked: boolean;
}

const SharedPost: React.FC = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSinglePost = useCallback(async () => {
    try {
      setLoading(true);
      const response = await PostApi.getSinglePost(postId ?? '');
      setPost(response);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load post');
      console.error('Error from backend: ', err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchSinglePost();
  }, [fetchSinglePost]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        Loading post...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="space-y-0 pb-2">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              {post.userId.profile_picture ? (
                <img 
                  src={post.userId.profile_picture}
                  alt={post.userId.username}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
              )}
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold">{post.userId.username}</div>
              {post.location && (
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  {post.location}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {formatDate(post.createdAt)}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {post.mediaUrl && post.postType === 'image' && (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              <img
                src={post.mediaUrl}
                alt={post.caption}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          
          <p className="text-gray-700">{post.caption}</p>
        </CardContent>

        <CardFooter className="border-t pt-4">
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-2">
              <Heart 
                className={`w-6 h-6 ${
                  post.likes?.length > 0 ? 'fill-red-500 text-red-500' : 'text-gray-500'
                }`} 
              />
              <span className="text-sm text-gray-600">{post.likes?.length || 0}</span>
            </button>
            <button className="flex items-center space-x-2">
              <MessageCircle className="w-6 h-6 text-gray-500" />
              <span className="text-sm text-gray-600">{post.commentCount || 0}</span>
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SharedPost;