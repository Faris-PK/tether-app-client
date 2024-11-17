import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store/store';
import { X } from 'lucide-react';
import moment from 'moment';
import { api } from '../../api/userApi';
import { setUser } from '../../redux/slices/userSlice';
import IUser from '../../types/IUser';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import { useTheme } from '../../contexts/ThemeContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const googleClientId = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const geocodingClient = mbxGeocoding({
  accessToken: googleClientId,
});

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUser | null;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, user }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<Partial<IUser>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>('');
  const { isDarkMode } = useTheme();
  const [locationQuery, setLocationQuery] = useState(user?.userLocation?.name || '');
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'location') {
      setLocationQuery(value);
      if (value.length > 2) {
        geocodingClient
          .forwardGeocode({
            query: value,
            autocomplete: true,
            limit: 5,
          })
          .send()
          .then((response) => {
            setLocationSuggestions(response.body.features);
          })
          .catch((error) => console.error('Geocoding error:', error));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationSelect = (place: any) => {
    setFormData(prev => ({
      ...prev,
      userLocation: {
        ...prev.userLocation,
        name: place.place_name,
        coordinates: {
          latitude: place.geometry.coordinates[1],
          longitude: place.geometry.coordinates[0]
        }
      },
    }));
    setLocationQuery(place.place_name);
    setLocationSuggestions([]);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) {
      setErrors(['User ID is missing']);
      return;
    }

    try {
      const updatedUser = await api.updateUserProfile(formData);
      dispatch(setUser(updatedUser));
      setSuccess('Profile updated successfully!');
      setErrors([]);
      onClose();
    } catch (error: any) {
      setErrors([error.response?.data?.message || 'An error occurred while updating the profile']);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-md ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Profile</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {errors.length > 0 && (
            <AlertDialog >
              <AlertDialogDescription>
                <ul className="list-disc pl-4">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDialogDescription>
            </AlertDialog>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Name</Label>
              <Input
                id="username"
                name="username"
                value={formData.username || ''}
                onChange={handleInputChange}
                className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob ? moment(formData.dob).format('YYYY-MM-DD') : ''}
                onChange={handleInputChange}
                className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile || ''}
                onChange={handleInputChange}
                className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio || ''}
                onChange={handleInputChange}
                className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                type="text"
                id="location"
                name="location"
                value={locationQuery}
                onChange={handleInputChange}
                className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
              />
              
              {locationSuggestions.length > 0 && (
                <ScrollArea className={`mt-1 max-h-48 rounded-md ${
                  isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                  <div className="p-1">
                    {locationSuggestions.map((place) => (
                      <button
                        key={place.id}
                        type="button"
                        onClick={() => handleLocationSelect(place)}
                        className={`w-full text-left px-3 py-2 rounded-sm text-sm ${
                          isDarkMode 
                            ? 'hover:bg-gray-700 focus:bg-gray-700' 
                            : 'hover:bg-gray-100 focus:bg-gray-100'
                        }`}
                      >
                        {place.place_name}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className={isDarkMode ? 'border-gray-700 hover:bg-gray-800' : ''}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Update Profile
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;