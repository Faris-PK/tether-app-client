import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Button, Typography, Avatar, Grid, IconButton, Box } from '@mui/material';
import { UserPlus, X } from 'lucide-react';
import NavBarSection from '../../components/NavBarSection';
import TopBar from '../../components/TopBar';
import { connectionApi } from '../../api/networkApi';

interface FriendRequest {
  _id: string;  // notification ID
  content: string;
  sender: {
    _id: string;  // sender's user ID
    username: string;
    profile_picture: string;
  };
  isFollowing: boolean;
}

interface Suggestion {
  _id: string;
  username: string;
  profile_picture: string;
  mutualFriends: number;
  isFollowing: boolean;
}

const ConnectionPage: React.FC = () => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [peopleYouMayKnow, setPeopleYouMayKnow] = useState<Suggestion[]>([]);
  const [showAllRequests, setShowAllRequests] = useState(false);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const maxDisplayedRequests = 3;
  const maxDisplayedSuggestions = 3;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [requestsResponse, suggestionsResponse] = await Promise.all([
        connectionApi.getFollowRequests(),
        connectionApi.getPeopleSuggestions()
      ]);

      const friendRequestsData = requestsResponse.map((request: any) => ({
        _id: request._id,
        content: request.content,
        sender: {
          _id: request.sender._id,  // Include sender's ID
          username: request.sender.username,
          profile_picture: request.sender.profile_picture
        },
        isFollowing: request.isFollowing
      }));

      const peopleSuggestionsData = suggestionsResponse.map((suggestion: any) => ({
        _id: suggestion._id,
        username: suggestion.username,
        profile_picture: suggestion.profile_picture,
        mutualFriends: suggestion.mutualFriends,
        isFollowing: suggestion.isFollowing
      }));

      setFriendRequests(friendRequestsData);
      setPeopleYouMayKnow(peopleSuggestionsData);
      setLoading(false);
    } catch (err) {
      setError('Error fetching data');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const removeFriendRequest = async (notificationId: string) => {
    try {
      await connectionApi.removeFollowRequest(notificationId);
      setFriendRequests(prevRequests => prevRequests.filter((friend) => friend._id !== notificationId));
    } catch (err) {
      setError('Error removing friend request');
    }
  };

  const removeSuggestion = async (id: string) => {
    try {
      await connectionApi.removeSuggestion(id);
      setPeopleYouMayKnow(prevSuggestions => prevSuggestions.filter((person) => person._id !== id));
    } catch (err) {
      setError('Error removing suggestion');
    }
  };

  const handleFollowAction = async (
    id: string, 
    type: 'request' | 'suggestion', 
    currentStatus: boolean,
    senderId?: string  // Add optional senderId parameter
  ) => {
    try {
      const targetUserId = type === 'request' ? senderId : id;  // Use senderId for requests, regular id for suggestions
      
      if (!targetUserId) {
        throw new Error('User ID not found');
      }

      if (currentStatus) {
        await connectionApi.unfollowUser(targetUserId);
      } else {
        await connectionApi.followUser(targetUserId);
      }

      if (type === 'request') {
        setFriendRequests(prevRequests =>
          prevRequests.map(friend =>
            friend._id === id
              ? { ...friend, isFollowing: !friend.isFollowing }
              : friend
          )
        );
      } else {
        setPeopleYouMayKnow(prevSuggestions =>
          prevSuggestions.map(person =>
            person._id === id
              ? { ...person, isFollowing: !person.isFollowing }
              : person
          )
        );
      }
    } catch (err) {
      setError('Error updating follow status');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;


  return (
    <div className="bg-[#1B2730] flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-1/5 p-3 flex flex-col">
        <div className="bg-[#010F18] p-2 rounded-md mb-4 shadow-[4px_4px_10px_rgba(0,0,0,0.5)]">
          <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-200 via-blue-500 to-black bg-clip-text text-transparent">
            Tether.
          </h1>
        </div>
        <aside className="w-full text-white mt-4 md:mt-24">
          <NavBarSection />
        </aside>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col overflow-hidden">
        <TopBar />
        <div className="flex flex-col p-3 overflow-hidden h-full w-full md:w-5/6">
          
          {/* Friend Requests Section */}
          <Box sx={{ mb: 4, flexGrow: 1, overflowY: 'auto', height: '50vh' }}>
            <Card sx={{ bgcolor: '#010F18' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Typography variant="h6" sx={{ color: '#bdb7b7', fontWeight: 600 }}>
                    Follow Requests
                  </Typography>
                  {friendRequests.length > maxDisplayedRequests && (
                    <Button sx={{ color: '#3B82F6' }} onClick={() => setShowAllRequests(!showAllRequests)}>
                      {showAllRequests ? 'Show Less' : 'See All'}
                    </Button>
                  )}
                </Box>
                <Grid container spacing={2}>
                {(showAllRequests ? friendRequests : friendRequests.slice(0, maxDisplayedRequests)).map((friend) => (
        <Grid item xs={12} sm={6} lg={4} key={friend._id}>
          <Card sx={{ bgcolor: '#1B2730', height: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar src={friend.sender.profile_picture} alt={friend.sender.username} sx={{ width: 48, height: 48, mr: 2 }} />
                <Box>
                  <Typography variant="body1" color="white">
                    {friend.sender.username}
                  </Typography>
                  <Typography variant="body2" color="gray" sx={{ fontSize: '0.75rem' }}>
                    {friend.content}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleFollowAction(friend._id, 'request', friend.isFollowing, friend.sender._id)}
                  sx={{
                    bgcolor: friend.isFollowing ? '#1B2730' : '#3B82F6',
                    color: friend.isFollowing ? '#3B82F6' : 'white',
                    '&:hover': {
                      bgcolor: friend.isFollowing ? '#2C3E50' : '#2563EB',
                    },
                    fontSize: '0.75rem',
                  }}
                >
                  {friend.isFollowing ? 'Unfollow' : 'Follow Back'}
                </Button>
                <IconButton size="small" onClick={() => removeFriendRequest(friend._id)} sx={{ color: 'gray' }}>
                  <X size={20} />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
                </Grid>
              </CardContent>
            </Card>
          </Box>

          {/* People You May Know Section */}
          <Box sx={{ mb: 4, flexGrow: 1, overflowY: 'auto', height: '50vh' }}>
            <Card sx={{ bgcolor: '#010F18' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Typography variant="h6" sx={{ color: '#bdb7b7', fontWeight: 600 }}>
                    People You May Know
                  </Typography>
                  {peopleYouMayKnow.length > maxDisplayedSuggestions && (
                    <Button sx={{ color: '#3B82F6' }} onClick={() => setShowAllSuggestions(!showAllSuggestions)}>
                      {showAllSuggestions ? 'Show Less' : 'See All'}
                    </Button>
                  )}
                </Box>
                <Grid container spacing={2}>
                  {(showAllSuggestions ? peopleYouMayKnow : peopleYouMayKnow.slice(0, maxDisplayedSuggestions)).map((person) => (
                    <Grid item xs={12} sm={6} lg={4} key={person._id}>
                      <Card sx={{ bgcolor: '#1B2730', height: '100%' }}>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar src={person.profile_picture} alt={person.username} sx={{ width: 48, height: 48, mr: 2 }} />
                            <Box>
                              <Typography variant="body1" color="white">
                                {person.username}
                              </Typography>
                              <Typography variant="body2" color="gray" sx={{ fontSize: '0.75rem' }}>
                                {person.mutualFriends} mutual friends
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleFollowAction(person._id, 'suggestion', person.isFollowing)}
                              sx={{
                                bgcolor: person.isFollowing ? '#1B2730' : '#3B82F6',
                                color: person.isFollowing ? '#3B82F6' : 'white',
                                '&:hover': {
                                  bgcolor: person.isFollowing ? '#2C3E50' : '#2563EB',
                                },
                                fontSize: '0.75rem',
                              }}
                            >
                              {person.isFollowing ? 'Unfollow' : 'Follow'}
                            </Button>
                            <IconButton size="small" onClick={() => removeSuggestion(person._id)} sx={{ color: 'gray' }}>
                              <X size={20} />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default ConnectionPage;