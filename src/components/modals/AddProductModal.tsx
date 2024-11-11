import React, { useState, ChangeEvent, FormEvent } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MarketplaceApi } from '../../api/marketplaceApi';

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
  location: string;
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
    location: '',
    description: ''
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Append images
      selectedFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      await MarketplaceApi.createProduct(formDataToSend);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null && 'response' in err) {
        const apiError = err as { response?: { data?: { message?: string } } };
        setError(apiError.response?.data?.message || 'Error creating product');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-[425px] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Listing</DialogTitle>
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
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={isDarkMode ? 'bg-gray-700 text-white' : ''}
              required
            />
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
                required
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
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
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