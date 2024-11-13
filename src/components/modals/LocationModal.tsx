import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Plus, Minus } from 'lucide-react';
import { RootState } from '@/redux/store/store';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store/store';
import { updateUserLocation } from '@/redux/slices/userSlice';
import { api } from '@/api/userApi';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

const googleClientId = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// Initialize Mapbox geocoding client
const geocodingClient = mbxGeocoding({
  accessToken: googleClientId,
});

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const [locationQuery, setLocationQuery] = useState(user?.userLocation?.name || '');
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [radius, setRadius] = useState<string>('80');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const radiusOptions: string[] = ['20', '40', '60', '80', '100'];

  useEffect(() => {
    if (user?.userLocation?.name) {
      setLocationQuery(user.userLocation.name);
    }
  }, [user?.userLocation?.name]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationQuery(value);
    setError('');

    if (value.length > 2) {
      try {
        const response = await geocodingClient
          .forwardGeocode({
            query: value,
            autocomplete: true,
            limit: 5,
          })
          .send();
        setLocationSuggestions(response.body.features);
      } catch (error) {
        console.error('Geocoding error:', error);
        setError('Failed to fetch location suggestions');
        setLocationSuggestions([]);
      }
    } else {
      setLocationSuggestions([]);
    }
  };

  const handleLocationSelect = async (place: any) => {
    setIsLoading(true);
    try {
      const updatedLocation = {
        userLocation: {
          name: place.place_name,
          coordinates: {
            latitude: place.geometry.coordinates[1],
            longitude: place.geometry.coordinates[0]
          }
        }
      };

      const updatedUser = await api.updateUserProfile(updatedLocation);
      dispatch(updateUserLocation(updatedUser.userLocation));
      setLocationQuery(place.place_name);
      setLocationSuggestions([]);
      setError('');
    } catch (error: any) {
      console.error('Error updating location:', error);
      setError(error.response?.data?.message || 'Failed to update location');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    if (locationSuggestions.length > 0) {
      await handleLocationSelect(locationSuggestions[0]);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-md ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Change location</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Location Input */}
          <div className="space-y-2">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Search by town, city, neighbourhood or postal code.
            </p>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                className={`pl-10 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-200'
                }`}
                placeholder="Location"
                value={locationQuery}
                onChange={handleInputChange}
              />
              
              {/* Location Suggestions */}
              {locationSuggestions.length > 0 && (
                <div className={`absolute z-10 w-full mt-1 rounded-md shadow-lg ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                } border ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <ul className="py-1 max-h-60 overflow-auto">
                    {locationSuggestions.map((place) => (
                      <li
                        key={place.id}
                        className={`px-4 py-2 cursor-pointer flex items-center ${
                          isDarkMode
                            ? 'hover:bg-gray-700'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => handleLocationSelect(place)}
                      >
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span>{place.place_name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {error && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
          </div>

          {/* Radius Selection */}
          <div className="space-y-2">
            <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Radius
            </label>
            <Select value={radius} onValueChange={setRadius}>
              <SelectTrigger className={`w-full ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-200'
              }`}>
                <SelectValue>{radius} Kilometers</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {radiusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option} Kilometers
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Map Preview */}
          <div className={`rounded-lg overflow-hidden border ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="relative h-48 bg-gray-100">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm text-gray-500">Map Preview</span>
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button 
                  variant="secondary" 
                  size="icon"
                  className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon"
                  className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <Button 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleApply}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Apply'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationModal;