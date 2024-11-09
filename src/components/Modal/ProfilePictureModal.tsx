import React, { useState } from 'react';
import { X, Camera, Trash2 } from 'lucide-react';
import Button from '@mui/material/Button';
import Cropper from 'react-easy-crop';

// Interface definitions
interface ProfilePictureModalProps {
  onUpload: (file: File) => Promise<void>;
  onRemove: () => Promise<void>;
  isProfilePicture: boolean;
  onClose: () => void;
}

interface CropModalProps {
  image: string;
  onClose: () => void;
  onComplete: (processedImage: Blob, filterName: string) => void;
}

// Define available aspect ratios
const aspectRatios = {
  'Free': undefined,
  '1:1 Square': 1,
  '4:3 Landscape': 4/3,
  '3:4 Portrait': 3/4,
  '16:9 Widescreen': 16/9,
  '9:16 Mobile': 9/16,
  '2:3 Classic': 2/3,
  '3:2 Classic Landscape': 3/2,
};

// Define image filters
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

// Utility functions for image processing
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', error => reject(error));
    image.src = url;
  });

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<Blob> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, 'image/jpeg');
  });
};

const applyFilter = async (image: Blob, filterName: string): Promise<Blob> => {
  const url = URL.createObjectURL(image);
  const img = await createImage(url);
  
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  ctx.filter = filters[filterName as keyof typeof filters];
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  URL.revokeObjectURL(url);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, 'image/jpeg', 0.9);
  });
};

// ImageCropModal Component - Only used for profile pictures
const ImageCropModal: React.FC<CropModalProps> = ({ image, onClose, onComplete }) => {
  const [step, setStep] = useState<'crop' | 'filter'>('crop');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<keyof typeof aspectRatios>('1:1 Square');

  React.useEffect(() => {
    if (croppedImage) {
      const url = URL.createObjectURL(croppedImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [croppedImage]);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropComplete = React.useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropFinish = async () => {
    try {
      if (croppedAreaPixels) {
        const cropped = await getCroppedImg(image, croppedAreaPixels);
        setCroppedImage(cropped);
        setStep('filter');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFilterComplete = async () => {
    try {
      if (croppedImage) {
        const filteredImage = await applyFilter(croppedImage, selectedFilter);
        onComplete(filteredImage, selectedFilter);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-lg shadow-lg">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white">
            {step === 'crop' ? 'Crop Image' : 'Apply Filter'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        {step === 'crop' ? (
          <>
            <div className="relative h-96 w-full">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatios[selectedAspectRatio]}
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-4 gap-2 mb-4">
                {Object.entries(aspectRatios).map(([name]) => (
                  <button
                    key={name}
                    onClick={() => setSelectedAspectRatio(name as keyof typeof aspectRatios)}
                    className={`p-2 text-sm rounded-lg ${
                      selectedAspectRatio === name
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm dark:text-white">Zoom</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropFinish}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-4">
            <div className="relative w-full h-64 mb-4">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                  style={{ filter: filters[selectedFilter as keyof typeof filters] }}
                />
              )}
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
                onClick={() => setStep('crop')}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                Back
              </button>
              <button
                onClick={handleFilterComplete}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ProfilePictureModal Component
const ProfilePictureModal: React.FC<ProfilePictureModalProps> = ({
  onUpload,
  onRemove,
  isProfilePicture,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setShowCropModal(false);
    setSelectedImage('');
    onClose();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      if (isProfilePicture) {
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
        setShowCropModal(true);
      } else {
        // For cover photo, directly upload without cropping
        await onUpload(file);
        closeModal();
      }
    }
  };

  const handleRemove = async () => {
    await onRemove();
    closeModal();
  };

  const handleCropComplete = async (croppedImageBlob: Blob, filterName: string) => {
    const croppedFile = new File([croppedImageBlob], 'cropped-profile-picture.jpg', {
      type: 'image/jpeg',
    });
    
    await onUpload(croppedFile);
    setShowCropModal(false);
    closeModal();
  };

  return (
    <>
      {/* Trigger Button */}
      <button onClick={openModal} className="bg-gray-500 p-2 rounded-full">
        <Camera className="h-4 w-4 text-white" />
      </button>

      {/* Main Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#010F18] p-6 rounded-lg shadow-lg w-full max-w-sm relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-gray-600 text-white p-2 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="text-xl text-white font-semibold mb-4">
              {isProfilePicture ? 'Profile Picture' : 'Cover Photo'}
            </h2>

            <div className="flex flex-col space-y-4">
              <Button
                variant="outlined"
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                Upload New Picture
              </Button>

              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <Button
                variant="outlined"
                color="error"
                startIcon={<Trash2 />}
                onClick={handleRemove}
              >
                Remove Picture
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Crop Modal - Only shown for profile pictures */}
      {isProfilePicture && showCropModal && selectedImage && (
        <ImageCropModal
          image={selectedImage}
          onClose={() => {
            setShowCropModal(false);
            URL.revokeObjectURL(selectedImage);
            setSelectedImage('');
          }}
          onComplete={handleCropComplete}
        />
      )}
    </>
  );
};

export default ProfilePictureModal;