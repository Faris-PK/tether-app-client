import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Plus, Minus } from 'lucide-react';
import { RootState } from '@/redux/store/store';
import { useSelector } from 'react-redux';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  const [location, setLocation] = useState<string>('');
  const [radius, setRadius] = useState<string>('80');
  const user = useSelector((state: RootState) => state.user.user);


  const radiusOptions: string[] = ['20', '40', '60', '80', '100'];

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
                value={user?.location.toString() ? user?.location.toString() :""}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
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
          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationModal;
