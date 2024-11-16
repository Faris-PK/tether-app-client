import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, Calendar, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { MarketplaceProduct } from '@/types/IMarketplace';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';

const googleClientId = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = googleClientId;

const geocodingClient = mbxGeocoding({
  accessToken: googleClientId,
});

interface ProductDetailModalProps {
  product: MarketplaceProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  isOpen, 
  onClose 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const user = useSelector((state: RootState) => state.user.user);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const nextImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const previousImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  // Cleanup function for map
  const cleanupMap = () => {
    if (marker.current) {
      marker.current.remove();
      marker.current = null;
    }
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    setMapInitialized(false);
  };

  // Initialize map
  const initializeMap = () => {
    if (!mapContainer.current || !product || mapInitialized) return;

    // Clean up existing map if any
    cleanupMap();

    // Create new map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [product.location.coordinates.longitude, product.location.coordinates.latitude],
      zoom: 17,
      scrollZoom: false,
    });

    // Add marker
    marker.current = new mapboxgl.Marker({
      anchor: 'bottom'
    })
      .setLngLat([product.location.coordinates.longitude, product.location.coordinates.latitude])
      .addTo(map.current);

    // Add controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    setMapInitialized(true);
  };

  // Effect for modal open state
  useEffect(() => {
    if (isOpen && product) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        initializeMap();
      }, 100);

      return () => {
        clearTimeout(timer);
        cleanupMap();
      };
    }
  }, [isOpen, product]);

  // Reset current image index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupMap();
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Image Gallery */}
          <div className="md:w-2/3 relative">
            {/* Main Image */}
            <div className="relative h-[400px]">
              {product?.images && product.images.length > 0 ? (
                <>
                  <img
                    src={product.images[currentImageIndex]}
                    alt={`${product.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {product.images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90"
                        onClick={previousImage}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </>
                  )}
                  {/* {product.isPromoted && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="secondary" className="px-2 py-1">
                        Promoted
                      </Badge>
                    </div>
                  )} */}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
            
            {/* Thumbnail Strip */}
            <div className="flex gap-2 p-2 bg-white border-t">
              {product?.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 ${
                    currentImageIndex === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right side - Product Details */}
          <div className="md:w-1/3 border-l">
            <div className="p-4">
              {/* Title and Price */}
              {product && (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold">{product.title}</h2>
                    {product.isPromoted && (
                      <Badge variant="secondary" className="px-2 py-1 text-blue-600">
                        Promoted
                      </Badge>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-gray-600 mb-4">
                    ₹{product.price.toLocaleString()}
                  </div>

                  {/* Details Section */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Details</h3>
                    <p>{product.location.name}</p>
                    {product?.description && (
                      <div className="space-y-2 text-sm">
                        {product.description.split(',').map((line, index) => (
                          <p key={index}>{line.trim()}</p>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Location Map */}
                  <div className="mt-4">
                    <div 
                      ref={mapContainer} 
                      className="h-32 bg-gray-100 rounded-sm overflow-hidden"
                    />
                  </div>

                  {/* Seller Info */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                          {product.userId?.profile_picture ? (
                            <img
                              src={product.userId.profile_picture}
                              alt={product.userId.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-full h-full p-2 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{product.userId?.username}</div>
                          <div className="text-sm text-gray-500">Joined Tether in 2024</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Button size="sm" variant="outline" className="h-8">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;