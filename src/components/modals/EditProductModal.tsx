import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MarketplaceApi } from '../../api/marketplaceApi';
import { MarketplaceProduct } from '../../types/IMarketplace';
import { MapPin, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: MarketplaceProduct;
  onProductUpdate: () => void;
  categories: { icon: React.ReactNode; name: string; }[];
  isDarkMode: boolean;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onProductUpdate,
  categories,
  isDarkMode
}) => {
  const [formData, setFormData] = useState({
    title: product.title,
    price: product.price.toString(),
    category: product.category,
    location: product.location,
    description: product.description,
    images: product.images
  });
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationQuery, setLocationQuery] = useState(product.location.name);
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    setFormData({
      title: product.title,
      price: product.price.toString(),
      category: product.category,
      location: product.location,
      description: product.description,
      images: product.images
    });
    setLocationQuery(product.location.name);
    setImagePreviews([]);
  }, [product]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    if (name !== 'location') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setLocationQuery(value);
    
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        name: value
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
      setSelectedFiles(files);
      
      // Create preview URLs for new files
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
    }
  };

  const handleRemoveExistingImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleRemoveNewImage = (indexToRemove: number) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('location', JSON.stringify(formData.location));
      formDataToSend.append('title', formData.title);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('existingImages', JSON.stringify(formData.images));

      selectedFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      await MarketplaceApi.updateProduct(product._id, formDataToSend);
      toast.success('Product updated successfully');
      // Call onProductUpdate after successful update
      onProductUpdate();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      toast.error('Failed to update product');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`sm:max-w-[425px] max-h-[90vh] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}
      >
        <div className="overflow-y-auto max-h-[calc(90vh-2rem)] pr-6 -mr-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Product</DialogTitle>
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
                required
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
                required
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
                  required
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
                required
              />
            </div>

            {/* Existing Images */}
            {formData.images.length > 0 && (
              <div>
                <Label>Current Images</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Upload */}
            <div>
              <Label htmlFor="images">New Images (Optional)</Label>
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
                    <span className="text-sm">Click to upload new images (max 10)</span>
                    {selectedFiles.length > 0 && (
                      <span className="text-sm text-blue-500">
                        {selectedFiles.length} file(s) selected
                      </span>
                    )}
                  </div>
                </label>
              </div>

              {/* New Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`New upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
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

            <div className="flex justify-end gap-3 sticky bottom-0 bg-inherit pt-4">
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
                {isLoading ? 'Updating...' : 'Update Product'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;