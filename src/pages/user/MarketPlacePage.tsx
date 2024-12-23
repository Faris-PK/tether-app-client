import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Title from '@/components/common/Title';
import Sidebar from '../../components/marketPlace/Sidebar';
import { MapPin, Bell, MessageCircle, Sun, Moon, ChevronDown } from 'lucide-react';
import LocationModal from '../../components/modals/LocationModal';
import { MarketplaceProduct } from '@/types/IMarketplace';
import { MarketplaceApi } from '@/api/marketplaceApi';
import ProductGrid from '@/components/marketPlace/ProductGrid';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RootState } from '@/redux/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '@/api/userApi';
import { clearUser } from '@/redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';

interface MarketPlacePageProps {
  // Add any props if needed
}

const MarketPlacePage: React.FC<MarketPlacePageProps> = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchRadius, setSearchRadius] = useState(80);
  const productsPerPage = 8;

  const [filters, setFilters] = useState({
    searchQuery: '',
    minPrice: '',
    maxPrice: '',
    category: '',
    dateSort: '',
    locationFilter: user?.userLocation?.coordinates 
      ? {
          latitude: user.userLocation.coordinates.latitude,
          longitude: user.userLocation.coordinates.longitude,
          radius: searchRadius 
        } 
      : undefined
  });


  const fetchProducts = async (page: number = 1) => {
    try {
      setIsLoadingMore(true);
      const response = await MarketplaceApi.getAllProducts(page, productsPerPage,  {
        searchQuery: filters.searchQuery,
        minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
        category: filters.category,
        dateSort: filters.dateSort,
        locationFilter: filters.locationFilter
      });

     // console.log('response from market: ', products);
      
      if (page === 1) {
        setProducts(response.products);
      } else {
        setProducts(prevProducts => [...prevProducts, ...response.products]);
      }
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoadingMore(false);
      setLoading(false);
    }
  };

    // Update location filter when user location or radius changes
    const updateLocationFilter = (location?: {
      latitude: number, 
      longitude: number
    }, radiusKm?: number) => {
      const newRadius = radiusKm || searchRadius;
      
      const newLocationFilter = location 
        ? {
            latitude: location.latitude,
            longitude: location.longitude,
            radius: newRadius
          }
        : undefined;
  
      setFilters(prev => ({
        ...prev,
        locationFilter: newLocationFilter
      }));
      
      // Update search radius state
      if (radiusKm) {
        setSearchRadius(radiusKm);
      }
  
      // Reset to first page and fetch products
      setCurrentPage(1);
      fetchProducts(1);
    };
  
    // Update the LocationModal to pass both location and radius
    const handleLocationUpdate = (locationData: {
      name: string,
      coordinates: {
        latitude: number,
        longitude: number
      }
    }, radius: string) => {
      updateLocationFilter(
        locationData.coordinates, 
        parseInt(radius)
      );
      setIsLocationModalOpen(false);
    };
  
    useEffect(() => {
      fetchProducts();
    }, [filters]);

  
  const loadMore = () => {
    if (currentPage < totalPages && !isLoadingMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchProducts(nextPage);
    }
  };
  
  useEffect(() => {
    fetchProducts();
    //console.log(user);
  },[filters]);
 
  

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
    setCurrentPage(1);
  };

  const handlePriceChange = (min: string, max: string) => {
    setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
    setCurrentPage(1);
  };

  const handleCategorySelect = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
    setCurrentPage(1);
  };

  const handleDateSort = (dateSort: string) => {
    setFilters(prev => ({ ...prev, dateSort }));
    setCurrentPage(1);
  };

  const handleLocationClick = () => {
    setIsLocationModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      dispatch(clearUser());
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const navigateToProfile = async () => {
    try {
      navigate('/user/profile');
    } catch (error) {
      // Handle error
    }
  };

  

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      minPrice: '',
      maxPrice: '',
      category: '',
      dateSort: '',
      locationFilter: user?.userLocation?.coordinates 
      ? {
          latitude: user.userLocation.coordinates.latitude,
          longitude: user.userLocation.coordinates.longitude,
          radius: searchRadius 
        } 
      : undefined
    });
    setCurrentPage(1);
    fetchProducts(1);
  };
  
  

  return (
    <div className={`mx-auto p-4 scrollbar-hide ${isDarkMode ? 'bg-gray-900' : 'bg-[#d8d4cd]'} min-h-screen flex flex-col transition-colors duration-200`}>
      <header className="flex justify-between items-center mb-4">
        <Title />
        <div className="flex items-center space-x-6">
          {/* Location */}
          <div 
            className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'} cursor-pointer`}
            onClick={() => setIsLocationModalOpen(true)}
          >
            <MapPin className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">{user?.userLocation?.name ? user?.userLocation?.name : "Your location" }</span>
          </div>

          {/* Dark Mode Toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full w-10 h-10 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 cursor-pointer ${
                    isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-yellow-50 hover:bg-yellow-100'
                  }`}
                  onClick={toggleDarkMode}
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <Moon className="h-5 w-5 text-yellow-500" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Notifications */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`relative rounded-full w-10 h-10 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 cursor-pointer ${
                    isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white'
                  }`}
                >
                  <Bell className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-[#1D9BF0] hover:bg-[#1D9BF0] text-white">
                    3
                  </Badge>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Messages */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`relative rounded-full w-10 h-10 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 cursor-pointer ${
                    isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white'
                  }`}
                >
                  <MessageCircle className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-[#1D9BF0] hover:bg-[#1D9BF0] text-white">
                    2
                  </Badge>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Messages</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={`flex items-center space-x-2 rounded-full h-10 px-3 ${
                  isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-purple-50 hover:bg-purple-100 shadow-black drop-shadow-md'
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profile_picture} alt="Profile" />
                  <AvatarFallback>{user?.username}</AvatarFallback>
                </Avatar>
                <span className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {user?.username}
                </span>
                <ChevronDown className={`h-4 w-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={`w-48 ${
              isDarkMode ? 'bg-gray-800 text-gray-200' : ''
            }`}>
              <DropdownMenuItem
                onClick={navigateToProfile} 
                className={`cursor-pointer font-semibold ${
                  isDarkMode ? 'hover:bg-gray-700' : ''
                }`}
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`cursor-pointer font-semibold ${
                  isDarkMode ? 'hover:bg-gray-700' : ''
                }`}
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 font-semibold hover:bg-gray-700"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      
      <div className="flex flex-1 gap-4">
        <Sidebar 
          onSearch={handleSearch}
          onPriceChange={handlePriceChange}
          onCategorySelect={handleCategorySelect}
          onLocationClick={handleLocationClick}
          onDateSort={handleDateSort}
          onClearFilters={resetFilters}
        />
        <main className="flex-1 space-y-4">
          <ProductGrid 
            products={products}
            loading={loading}
            isLoadingMore={isLoadingMore}
            hasMore={currentPage < totalPages}
            onLoadMore={loadMore}
            onProductUpdate={() => {
              setCurrentPage(1);
              fetchProducts(1);
            }}
          />
        </main>
      </div>

      <LocationModal 
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        isDarkMode={isDarkMode}
        onLocationUpdate={handleLocationUpdate} // Add this prop
      />
    </div>
  );
};

export default MarketPlacePage;