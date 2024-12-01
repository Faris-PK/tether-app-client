import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { connectionApi } from '../../api/networkApi';
import { useDispatch } from 'react-redux';
import { addFollowedUser, removeFollowedUser } from '../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';  
type Suggestion = {
  _id: string;
  username: string;
  profile_picture: string;
  mutualFriends: number;
  isFollowing: boolean;
  createdAt: string;
};

const SuggestedProfiles = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();  
  const [peopleYouMayKnow, setPeopleYouMayKnow] = useState<Suggestion[]>([]);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const maxDisplayedSuggestions = 3;

  const isNewProfile = (createdAt: string) => {
    const profileDate = new Date(createdAt);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    return profileDate >= twoDaysAgo;
  };

  const fetchSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await connectionApi.getPeopleSuggestions();
      setPeopleYouMayKnow(response.map(({ _id, username, profile_picture, mutualFriends, isFollowing, createdAt }: any) => 
        ({ _id, username, profile_picture, mutualFriends, isFollowing, createdAt })));
    } catch (err) {
      setError('Error fetching suggestions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSuggestions(); }, [fetchSuggestions]);

  const removeSuggestion = async (id: string) => {
    try {
      await connectionApi.removeSuggestion(id);
      setPeopleYouMayKnow(prev => prev.filter(person => person._id !== id));
    } catch {
      setError('Error removing suggestion');
    }
  };

  const handleFollowAction = async (id: string, currentStatus: boolean) => {
    try {
      await connectionApi[currentStatus ? 'unfollowUser' : 'followUser'](id);
      dispatch(currentStatus ? removeFollowedUser(id) : addFollowedUser(id));
      setPeopleYouMayKnow(prev => 
        prev.map(person => person._id === id ? { ...person, isFollowing: !currentStatus } : person)
      );
    } catch {
      setError('Error updating follow status');
    }
  };

  const handleNavigateToProfile = (userId: string) => {
    navigate(`/user/userProfile/${userId}`);
  };

  if (loading || error) {
    return (
      <Card className={`w-full rounded-xl shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <CardContent className="p-4">
          <p className={`text-center ${error ? 'text-red-500' : isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {error || 'Loading suggestions...'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const SuggestionItem = ({ profile }: { profile: Suggestion }) => (
    <div className="flex items-center justify-between py-2">
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => handleNavigateToProfile(profile._id)}
      >
        <div className="relative w-8 h-8">
          <img
            src={profile.profile_picture}
            alt={profile.username}
            className="rounded-full object-cover w-full h-full"
          />
          {isNewProfile(profile.createdAt) && (
            <Badge className="absolute top-0 right-0 bg-blue-500 h-3 px-1 text-[8px] font-medium text-white transform translate-x-1 -translate-y-1">
              NEW
            </Badge>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center space-x-1">
            <span className={`font-medium text-sm truncate ${isDarkMode ? 'text-gray-200' : 'text-black'}`}>
              {profile.username}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-1 flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFollowAction(profile._id, profile.isFollowing)}
          className={`h-7 px-4 text-xs font-sm rounded-full transition-all duration-300
            ${profile.isFollowing 
              ? `${isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-100 hover:bg-gray-200'} text-blue-500 hover:text-blue-600`
              : 'bg-[#1D9BF0] text-white hover:bg-[#1A8CD8] hover:text-gray-100'
            }`}
        >
          {profile.isFollowing ? 'Following' : 'Follow'}
        </Button>
        <button
          onClick={() => removeSuggestion(profile._id)}
          className={`p-1 rounded-full hover:bg-gray-200 transition-colors ${
            isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500'
          }`}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
  
  const displayedSuggestions = showAllSuggestions 
    ? peopleYouMayKnow 
    : peopleYouMayKnow.slice(0, maxDisplayedSuggestions);

  return (
    <Card className={`w-full rounded-xl shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white ' : 'text-black '}`}>
          Suggested for you
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {displayedSuggestions.map(profile => (
          <SuggestionItem key={profile._id} profile={profile} />
        ))}
        {peopleYouMayKnow.length > maxDisplayedSuggestions && (
          <Button
            variant="ghost"
            onClick={() => setShowAllSuggestions(!showAllSuggestions)}
            className={`w-full text-sm ${isDarkMode ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-500 hover:bg-gray-100'}`}
          >
            {showAllSuggestions ? 'Show less' : 'Show more'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SuggestedProfiles;
