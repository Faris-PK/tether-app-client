import React, { useState, useEffect } from 'react';
import { Heart, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from "@/lib/utils";

interface Story {
  id: string;
  username: string;
  media: string;
  timestamp: string;
  likes: number;
  duration: number;
}

interface StoryViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  stories: Story[];
  initialStoryIndex?: number;
}

const StoryViewModal: React.FC<StoryViewModalProps> = ({ 
  isOpen, 
  onClose, 
  stories,
  initialStoryIndex = 0 
}) => {
  const { isDarkMode } = useTheme();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const currentStory = stories[currentStoryIndex];

  useEffect(() => {
    if (!isPaused && isOpen) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (currentStoryIndex < stories.length - 1) {
              setCurrentStoryIndex(prev => prev + 1);
              return 0;
            } else {
              clearInterval(timer);
              onClose();
              return prev;
            }
          }
          return prev + (100 / (currentStory.duration / 100));
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [currentStoryIndex, isPaused, isOpen, stories.length, currentStory.duration, onClose]);

  const handlePreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" h-[90vh] p-0 gap-0">
        <div className="relative flex h-full">
          {/* Story View */}
          <div className="relative flex-1 bg-black">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 z-10 h-1 bg-gray-800">
              <div 
                className="h-full bg-white"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Story Content */}
            <div 
              className="relative h-full"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <img 
                src={currentStory.media} 
                alt="Story"
                className="w-full h-full object-contain"
              />

              {/* Navigation Buttons */}
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 rounded-full"
                onClick={handlePreviousStory}
                disabled={currentStoryIndex === 0}
              >
                {"<"}
              </button>
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 rounded-full"
                onClick={handleNextStory}
                disabled={currentStoryIndex === stories.length - 1}
              >
                {">"}
              </button>

              {/* Story Header */}
              <div className="absolute top-6 left-0 right-0 px-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src={`/api/placeholder/40/40`}
                    alt={currentStory.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-white font-semibold">{currentStory.username}</p>
                    <p className="text-white/70 text-sm">
                      {new Date(currentStory.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Story Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsLiked(!isLiked)}
                    className="text-white hover:bg-white/20"
                  >
                    <Heart 
                      className={cn("h-6 w-6", isLiked && "fill-red-500 text-red-500")}
                    />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoryViewModal;
