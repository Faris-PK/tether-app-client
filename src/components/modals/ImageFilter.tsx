import React, { useState, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';

const filters = {
  normal: '',
  grayscale: 'grayscale(100%)',
  sepia: 'sepia(100%)',
  saturate: 'saturate(200%)',
  brightness: 'brightness(120%)',
  contrast: 'contrast(120%)',
  warmth: 'sepia(50%) saturate(150%)',
  coolness: 'hue-rotate(180deg) saturate(120%)',
  vintage: 'sepia(50%) contrast(120%) brightness(90%)',
  fade: 'opacity(80%) brightness(120%)',
};

interface FilterModalProps {
  image: string | Blob;
  onClose: () => void;
  onFilterComplete: (filteredImage: Blob, filterName: string) => void;
}

const ImageFilterModal: React.FC<FilterModalProps> = ({ image, onClose, onFilterComplete }) => {
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (image instanceof Blob) {
      setImageUrl(URL.createObjectURL(image));
    } else {
      setImageUrl(image);
    }
    return () => {
      if (image instanceof Blob) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [image]);

  const applyFilter = useCallback(async () => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Could not get canvas context');

      // Apply filter using CSS filter
      ctx.filter = filters[selectedFilter as keyof typeof filters];
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          onFilterComplete(blob, selectedFilter);
        }
      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error('Error applying filter:', error);
    }
  }, [imageUrl, selectedFilter, onFilterComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-lg shadow-lg">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white">Apply Filter</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="relative w-full h-64 mb-4">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-contain"
              style={{ filter: filters[selectedFilter as keyof typeof filters] }}
            />
          </div>

          <div className="grid grid-cols-5 gap-4 mb-4">
            {Object.entries(filters).map(([name]) => (
              <button
                key={name}
                onClick={() => setSelectedFilter(name)}
                className={`p-2 text-sm rounded-lg ${
                  selectedFilter === name
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={applyFilter}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageFilterModal;