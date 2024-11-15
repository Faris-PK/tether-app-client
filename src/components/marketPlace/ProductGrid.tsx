import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { MapPin } from 'lucide-react';
import { MarketplaceProduct } from '../../types/IMarketplace';
import ProductDetailModal from '../modals/ProductDetailModal';
import EmptyState from './EmptyState';

interface ProductGridProps {
  products: MarketplaceProduct[];
  loading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, loading }) => {
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (product: MarketplaceProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="h-48 animate-pulse bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card 
            key={product._id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800 cursor-pointer rounded-lg"
            onClick={() => handleProductClick(product)}
          >
            <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover p-1 rounded-lg"
              />
            </div>
            <div className="p-4">
              <div className="mb-2 flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
                  {product.title}
                </h3>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  ₹{product.price.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                {product.location.name}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ProductDetailModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default ProductGrid;