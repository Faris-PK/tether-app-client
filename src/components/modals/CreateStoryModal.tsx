import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { X, Search, Music, Upload, Play, Pause } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from "@/lib/utils";
import { storyApi } from '@/api/storyApi';
storyApi
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

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ isOpen, onClose }) => {
  const { isDarkMode } = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  
  // Music Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<SpotifyTrack | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Audio Playback States
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debounced search effect
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

  // Search Spotify Tracks
  const searchSpotifyTracks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await storyApi.searchTracks({
        query: searchQuery,
        type: 'track',
        limit: 20
      });
      console.log(response.tracks);
      

      // Extract tracks from response
      const searchedTracks = response.tracks.items.map((track: SpotifyTrack) => ({
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

  // File Change Handler
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Remove Image
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
  };

  // Select Music Track
  const handleSelectMusic = (track: SpotifyTrack) => {
    // Stop any currently playing preview
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    console.log('Track : ', track.name);
    

    setSelectedMusic(track);
    setSearchQuery('');
    setTracks([]);
  };

  // Remove Selected Music
  const handleRemoveMusic = () => {
    // Stop preview if playing
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    setSelectedMusic(null);
  };

  // Toggle Music Preview
  const toggleMusicPreview = () => {
    if (!selectedMusic?.preview_url) return;

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Format Duration
  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
  };
  const handleCreateStory = async () => {
    if (!selectedFile) return;
  
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    // Only append music-related data if a track is selected
    if (selectedMusic) {
      formData.append('musicTrackId', selectedMusic.id);
      formData.append('musicPreviewUrl', selectedMusic.preview_url || '');
      formData.append('musicName', selectedMusic.name || '');
    }
  
    try {
      const newStory = await storyApi.createStory(formData);
      onClose(); // Close modal
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "max-w-4xl h-[80vh] flex flex-col",
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
      )}>
        <DialogHeader>
          <DialogTitle className={isDarkMode ? "text-white" : "text-black"}>
            Create Story
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 gap-4">
          {/* Image Upload Area */}
          <div className={cn(
            "flex-1 relative border rounded-lg overflow-hidden flex items-center justify-center",
            isDarkMode ? "border-gray-700" : "border-gray-200"
          )}>
            {previewUrl ? (
              <div className="relative">
                <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-[400px] object-cover rounded-md"
              />
                <Button 
                  onClick={handleRemoveImage} 
                  variant="destructive" 
                  className="absolute top-2 right-2 w-8 h-8 p-0 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "w-64",
                    isDarkMode ? "bg-gray-700 hover:bg-gray-600" : ""
                  )}
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload Image
                </Button>
                <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  Select an image for your story
                </p>
              </div>
            )}
          </div>

          {/* Music Search and Selection Area */}
          <div className={cn(
            "w-72 border rounded-lg p-4",
            isDarkMode ? "border-gray-700 text-gray-200" : "border-gray-200 text-gray-900"
          )}>
            <h3 className="text-lg font-semibold mb-4">Background Music</h3>
            
            {/* Search Input */}
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

            {/* Music Selection or Search Results */}
            <div className="max-h-48 overflow-y-auto">
              {selectedMusic ? (
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {selectedMusic.album.images.length > 0 && (
                      <img 
                        src={selectedMusic.album.images[0].url} 
                        alt="Album Cover" 
                        className="w-10 h-10 rounded-md object-cover"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium">{selectedMusic.name}</p>
                      <p className="text-xs text-gray-500">
                        {selectedMusic.artists.map(artist => artist.name).join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedMusic.preview_url && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={toggleMusicPreview}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleRemoveMusic}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : isLoading ? (
                <div className="text-center text-gray-500">Searching...</div>
              ) : error ? (
                <div className="text-center text-red-500">{error}</div>
              ) : tracks.length > 0 ? (
                tracks.map((track) => (
                  <div 
                    key={track.id}
                    onClick={() => handleSelectMusic(track)}
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
        </div>

        {/* Audio Preview Element (hidden) */}
        {selectedMusic?.preview_url && (
          <audio 
            ref={audioRef} 
            src={selectedMusic.preview_url}
            onEnded={() => {
              setIsPlaying(false);
            }}
          />
        )}

        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className={isDarkMode ? "border-gray-600 text-white hover:bg-gray-700" : ""}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateStory}
            disabled={!selectedFile}
            className={cn(
              isDarkMode ? "bg-[#1D9BF0] hover:bg-[#1aa3d4]" : "",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            Create Story
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStoryModal;