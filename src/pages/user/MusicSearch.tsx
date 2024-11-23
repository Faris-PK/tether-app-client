import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Music, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from "@/lib/utils";

// TypeScript Interfaces
interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { 
    images: { url: string }[];
    name: string;
  };
  preview_url: string | null;
  duration_ms: number;
}

interface MusicSearchProps {
  onSelectMusic: (track: SpotifyTrack) => void;
  onCancelMusic: () => void;
}

const MusicSearch: React.FC<MusicSearchProps> = ({ onSelectMusic, onCancelMusic }) => {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced search to reduce API calls
  useEffect(() => {
    // Only search if query is at least 3 characters
    if (searchQuery.length < 3) {
      setTracks([]);
      return;
    }

    // Debounce search
    const delayDebounceFn = setTimeout(() => {
      searchSpotifyTracks();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const searchSpotifyTracks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:5000/user/spotify/search', {
        params: {
          query: searchQuery,
          type: 'track',
          limit: 10
        }
      });

      // Extract tracks from response
      const searchedTracks = response.data.tracks.items.map((track: SpotifyTrack) => ({
        id: track.id,
        name: track.name,
        artists: track.artists,
        album: track.album,
        preview_url: track.preview_url,
        duration_ms: track.duration_ms
      }));

      setTracks(searchedTracks);
    } catch (err) {
      setError('Failed to fetch tracks. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Format duration from milliseconds
  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={cn(
      "w-full border rounded-lg p-4",
      isDarkMode ? "border-gray-700 text-gray-200" : "border-gray-200 text-gray-900"
    )}>
      <h3 className="text-lg font-semibold mb-4">Background Music</h3>
      
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search music on Spotify"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Search Results */}
      <div className="max-h-48 overflow-y-auto">
        {isLoading ? (
          <div className="text-center text-gray-500">Searching...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : tracks.length > 0 ? (
          tracks.map((track) => (
            <div 
              key={track.id}
              onClick={() => onSelectMusic(track)}
              className={cn(
                "flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer rounded-md transition-colors",
                isDarkMode ? "hover:bg-gray-700" : ""
              )}
            >
              <div className="flex items-center space-x-3">
                {track.album.images.length > 0 && (
                  <img 
                    src={track.album.images[0].url} 
                    alt="Album Cover" 
                    className="w-10 h-10 rounded-md object-cover"
                  />
                )}
                <div>
                  <p className="text-sm font-medium">{track.name}</p>
                  <p className="text-xs text-gray-500">
                    {track.artists.map(artist => artist.name).join(', ')}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-500">
                {formatDuration(track.duration_ms)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-center text-gray-500">
            {searchQuery ? 'No tracks found' : 'Start typing to search music'}
          </p>
        )}
      </div>
    </div>
  );
};

export default MusicSearch;