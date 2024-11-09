import React, { useState, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';
import Cropper from 'react-easy-crop';

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

const ImageCropModal: React.FC<CropModalProps> = ({ image, onClose, onComplete }) => {
  const [step, setStep] = useState<'crop' | 'filter'>('crop');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<keyof typeof aspectRatios>('1:1 Square');

  useEffect(() => {
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

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
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

export default ImageCropModal;