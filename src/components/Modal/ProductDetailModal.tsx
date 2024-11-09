import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { MarketplaceProduct } from '../../types/IMarketplace';
import { Button } from "@/components/ui/button";

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
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  if (!product) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const nextImage = () => {
    if (product.images) {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const previousImage = () => {
    if (product.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl p-0 gap-0">
        <div className="flex flex-col md:flex-row h-[80vh]">
          {/* Left side - Image Carousel */}
          <div className="md:w-1/2 relative h-64 md:h-full bg-gray-100">
            {product.images && product.images.length > 0 ? (
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
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {product.images.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          {/* Right side - Product Details */}
          <div className="md:w-1/2 p-6 overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{product.title}</DialogTitle>
            </DialogHeader>

            {/* Price and Category */}
            <div className="flex items-center justify-between mt-6 mb-4">
              <span className="text-2xl font-bold text-blue-600">
                ₹{product.price.toLocaleString()}
              </span>
              <Badge variant="secondary" className="text-sm">
                {product.category}
              </Badge>
            </div>

            {/* Location */}
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{product.location}</span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Seller Info */}
            <div className="flex items-center space-x-4 border-t pt-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
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
                <h4 className="font-semibold">{product.userId?.username}</h4>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Posted on {formatDate(product.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;