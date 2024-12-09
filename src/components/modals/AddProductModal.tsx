import React, { useState, ChangeEvent, FormEvent } from 'react';
import { X, MapPin, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MarketplaceApi } from '../../api/marketplaceApi';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

// Initialize Mapbox client
const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const geocodingClient = mbxGeocoding({
  accessToken: mapboxToken,
});

interface Category {
  icon: React.ReactNode;
  name: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  categories: Category[];
}

interface FormFields {
  title: string;
  price: string;
  category: string;
  location: {
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  description: string;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  categories
}) => {
  const [formData, setFormData] = useState<FormFields>({
    title: '',
    price: '',
    category: '',
    location: {
      name: '',
      coordinates: {
        latitude: 0,
        longitude: 0
      }
    },
    description: ''
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [locationQuery, setLocationQuery] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setLocationQuery(value);

    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        name: value,
        coordinates: {
          latitude: 0,
          longitude: 0
        }
      }
    }));

    if (value.length > 2) {
      geocodingClient
        .forwardGeocode({
          query: value,
          autocomplete: true,
          limit: 5,
        })
        .send()
        .then(response => {
          setLocationSuggestions(response.body.features);
        })
        .catch(error => {
          console.error('Geocoding error:', error);
          setLocationSuggestions([]);
        });
    } else {
      setLocationSuggestions([]);
    }
  };

  const handleLocationSelect = (place: any) => {
    const [longitude, latitude] = place.center;

    setFormData(prev => ({
      ...prev,
      location: {
        name: place.place_name,
        coordinates: {
          latitude,
          longitude
        }
      }
    }));
    setLocationQuery(place.place_name);
    setLocationSuggestions([]);
  };

  const handleCategoryChange = (value: string): void => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Check total number of files
      const totalFiles = files.length + selectedFiles.length;
      if (totalFiles > 10) {
        setError('You can upload up to 10 images.');
        return;
      }

      // Create preview URLs
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      
      // Combine existing and new files/previews
      setSelectedFiles(prev => [...prev, ...files]);
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
      setError('');
    }
  };

  const removeImage = (indexToRemove: number) => {
    // Revoke the object URL to free up memory
    URL.revokeObjectURL(imagePreviewUrls[indexToRemove]);

    // Remove the file and its preview
    setSelectedFiles(prev => 
      prev.filter((_, index) => index !== indexToRemove)
    );
    setImagePreviewUrls(prev => 
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const validateForm = (): boolean => {
    if (formData.title.length < 3) {
      setError('Title must be at least 3 characters.');
      return false;
    }
    if (parseFloat(formData.price) <= 0 || isNaN(parseFloat(formData.price))) {
      setError('Price must be a positive number.');
      return false;
    }
    if (!formData.category) {
      setError('Please select a category.');
      return false;
    }
    if (!formData.location.name) {
      setError('Please select a valid location.');
      return false;
    }
    if (formData.description.length < 10) {
      setError('Description must be at least 10 characters.');
      return false;
    }
    if (selectedFiles.length === 0) {
      setError('Please upload at least one image.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('location', JSON.stringify(formData.location));
      formDataToSend.append('title', formData.title);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);

      selectedFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      await MarketplaceApi.createProduct(formDataToSend);
      onClose();
    } catch (err) {
      setError('Error creating product.');
    } finally {
      setIsLoading(false);
    }
  };

  // Clean up object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviewUrls]);

  return (
<Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent 
    className={`
      sm:max-w-[425px] 
      ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}
      max-h-[90vh] 
      overflow-y-auto 
      scrollbar-thin 
      ${isDarkMode ? 'scrollbar-thumb-gray-700 scrollbar-track-gray-800' : 'scrollbar-thumb-gray-300 scrollbar-track-gray-100'}
    `}
  >
    <DialogHeader>
      <DialogTitle className="text-xl font-semibold sticky top-0 bg-inherit z-10 pb-2">
        Create New Listing
      </DialogTitle>
    </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className={isDarkMode ? 'bg-gray-700 text-white' : ''}
        />
      </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              className={isDarkMode ? 'bg-gray-700 text-white' : ''}
              
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className={isDarkMode ? 'bg-gray-700 text-white' : ''}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category, index) => (
                  <SelectItem key={index} value={category.name}>
                    <div className="flex items-center gap-2">
                      {category.icon}
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <Input
                id="location"
                name="location"
                value={locationQuery}
                onChange={handleLocationChange}
                className={`${isDarkMode ? 'bg-gray-700 text-white' : ''} pr-8`}
                
              />
              <MapPin className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            
            {locationSuggestions.length > 0 && (
              <div className={`absolute z-10 w-full mt-1 bg-${isDarkMode ? 'gray-700' : 'white'} border border-${isDarkMode ? 'gray-600' : 'gray-300'} rounded-md shadow-lg max-h-48 overflow-y-auto`}>
                {locationSuggestions.map((place) => (
                  <div
                    key={place.id}
                    className={`p-2 text-sm cursor-pointer hover:bg-${isDarkMode ? 'gray-600' : 'gray-100'} text-${isDarkMode ? 'white' : 'black'}`}
                    onClick={() => handleLocationSelect(place)}
                  >
                    {place.place_name}
                  </div>
                ))}
              </div>
            )}
            
            {/* Display selected coordinates if available */}
            {formData.location.coordinates.latitude !== 0 && (
              <div className="mt-1 text-sm text-gray-500">
                Selected coordinates: {formData.location.coordinates.latitude.toFixed(6)}, {formData.location.coordinates.longitude.toFixed(6)}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={isDarkMode ? 'bg-gray-700 text-white' : ''}
              rows={4}
              
            />
          </div>

          <div>
            <Label htmlFor="images">Images</Label>
            <div 
              className={`border-2 border-dashed rounded-lg p-4 text-center ${
                isDarkMode ? 'border-gray-600' : 'border-gray-300'
              }`}
            >
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <label 
                htmlFor="images" 
                className="cursor-pointer block"
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm">Click to upload images (max 10)</span>
                  {selectedFiles.length > 0 && (
                    <span className="text-sm text-blue-500">
                      {selectedFiles.length} file(s) selected
                    </span>
                  )}
                </div>
              </label>
            </div>
            
            {/* Image Preview Section */}
            {imagePreviewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {imagePreviewUrls.map((previewUrl, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={previewUrl} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

      <div className="flex justify-end gap-3 sticky bottom-0 bg-inherit pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className={isDarkMode ? 'bg-gray-700 text-white' : ''}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#30bef1] hover:bg-[#38a0e6] text-white"
        >
          {isLoading ? 'Creating...' : 'Create Listing'}
        </Button>
      </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;