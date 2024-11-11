import React, { useState, useCallback, useEffect } from 'react';
import { X, Crop, Image as ImageIcon, ZoomIn, RotateCcw } from 'lucide-react';
import Cropper from 'react-easy-crop';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CropModalProps {
  image: string;
  onClose: () => void;
  onComplete: (processedImage: Blob, filterName: string) => void;
}

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
  const [activeTab, setActiveTab] = useState<'crop' | 'filter'>('crop');
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
        setActiveTab('filter');
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
    <Card className="max-h-3xl max-w-3xl bg-white dark:bg-gray-900 shadow-2xl">
      <CardHeader className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Edit Image</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'crop' | 'filter')}>
          <TabsList className="grid w-60 grid-cols-2">
            <TabsTrigger value="crop" className="flex items-center gap-2">
              <Crop className="h-4 w-4" />
              Crop
            </TabsTrigger>
            <TabsTrigger value="filter" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Filter
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="p-6">
        {activeTab === 'crop' ? (
          <div className="space-y-6">
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatios[selectedAspectRatio]}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                classes={{
                  containerClassName: "rounded-lg"
                }}
              />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Aspect Ratio</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(aspectRatios).map(([name]) => (
                    <Badge
                      key={name}
                      variant={selectedAspectRatio === name ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => setSelectedAspectRatio(name as keyof typeof aspectRatios)}
                    >
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ZoomIn className="h-4 w-4" />
                  <h3 className="text-sm font-medium">Zoom</h3>
                </div>
                <Slider
                  value={[zoom]}
                  min={1}
                  max={3}
                  step={0.1}
                  onValueChange={([value]) => setZoom(value)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleCropFinish}>Next</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                  style={{ filter: filters[selectedFilter as keyof typeof filters] }}
                />
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Filters</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {Object.entries(filters).map(([name]) => (
                  <Badge
                    key={name}
                    variant={selectedFilter === name ? "default" : "secondary"}
                    className="cursor-pointer py-2 justify-center"
                    onClick={() => setSelectedFilter(name)}
                  >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('crop')}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleFilterComplete}>Apply</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  </div>
  );
};

export default ImageCropModal;