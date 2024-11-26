import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Car, DeleteIcon, EditIcon, Home, MapPin, MoreVertical, ShoppingBag, Smartphone, Sofa, Tag, Trophy, Gamepad, Calendar, Sparkles } from 'lucide-react';
import { MarketplaceProduct } from '../../types/IMarketplace';
import ProductDetailModal from '../modals/ProductDetailModal';
import ProductPromotionModal from '../modals/ProductPromotionModal';
import EmptyState from './EmptyState';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';
import { MarketplaceApi } from '@/api/marketplaceApi';
import EditProductModal from '../modals/EditProductModal';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';

interface ProductGridProps {
  products: MarketplaceProduct[];
  loading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onProductUpdate: () => void;
}

interface Category {
  icon: React.ReactNode;
  name: string;
}

const categories: Category[] = [
  { icon: <Car className="w-5 h-5" />, name: 'Vehicles' },
  { icon: <Home className="w-5 h-5" />, name: 'Property' },
  { icon: <ShoppingBag className="w-5 h-5" />, name: 'Clothes' },
  { icon: <Smartphone className="w-5 h-5" />, name: 'Mobiles' },
  { icon: <Trophy className="w-5 h-5" />, name: 'Sports' },
  { icon: <Gamepad className="w-5 h-5" />, name: 'Games' },
  { icon: <Sofa className="w-5 h-5" />, name: 'Furniture' },
];

const PromotedBadge: React.FC = () => (
  <div className="absolute top-3 right-3 z-10 animate-fade-in">
    <div className="relative">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-blue-400 rounded-full blur opacity-50 animate-pulse"></div>
      
      {/* Badge content */}
      <div className="relative flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-200">
        <Sparkles className="w-4 h-4 animate-sparkle" />
        <span className="text-xs font-semibold">Promoted</span>
      </div>
    </div>
  </div>
);

const ProductCard: React.FC<{
  product: MarketplaceProduct;
  currentUserId: string | undefined;
  onProductClick: (product: MarketplaceProduct) => void;
  onPromoteProduct: (product: MarketplaceProduct, event: React.MouseEvent) => void;
  onEditProduct: (product: MarketplaceProduct, event: React.MouseEvent) => void;
  onDeleteProduct: (product: MarketplaceProduct, event: React.MouseEvent) => void;
  isDarkMode: boolean;
}> = ({
  product,
  currentUserId,
  onProductClick,
  onPromoteProduct,
  onEditProduct,
  onDeleteProduct,
  isDarkMode,
}) => {
  const formatCreationDate = (createdAt: string) => {
    const today = new Date();
    const creationDate = new Date(createdAt);

    today.setHours(0, 0, 0, 0);
    const creationDay = new Date(creationDate);
    creationDay.setHours(0, 0, 0, 0);

    if (creationDate.getDate() === today.getDate()) {
      return 'Today';
    }

    return creationDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card 
      className={`
        overflow-hidden hover:shadow-lg transition-all duration-300 
        bg-white dark:bg-gray-800 cursor-pointer rounded-lg relative
        ${product.isPromoted ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
        transform hover:-translate-y-1
      `}
      onClick={() => onProductClick(product)}
    >
      {product.isPromoted && <PromotedBadge />}
      
      {currentUserId === product.userId._id && !product.isPromoted && (
        <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-48 bg-white dark:bg-gray-800 dark:text-gray-200"
            >
              {!product.isPromoted && (
                <DropdownMenuItem
                  onClick={(e) => onPromoteProduct(product, e)}
                  className="cursor-pointer font-semibold flex items-center space-x-2 hover:bg-gray-300 dark:hover:bg-gray-700"
                >
                  <Tag className="h-4 w-4" />
                  <span>Promote Item</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onClick={(e) => onEditProduct(product, e)}
                className="cursor-pointer font-semibold flex items-center space-x-2 hover:bg-gray-300 dark:hover:bg-gray-700"
              >
                <EditIcon className="h-4 w-4" />
                <span>Edit Product</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => onDeleteProduct(product, e)}
                className="cursor-pointer font-semibold flex items-center space-x-2 text-red-600 hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-red-500"
              >
                <DeleteIcon className="h-4 w-4 text-red-600 dark:text-red-500" />
                <span>Delete Product</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden group">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover p-1 rounded-lg transform group-hover:scale-105 transition-transform duration-300"
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
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="w-4 h-4 mr-1" />
          {formatCreationDate(product.createdAt)}
        </div>
      </div>
    </Card>
  );
};

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading,
  isLoadingMore,
  hasMore,
  onLoadMore,
  onProductUpdate
}) => {
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [productToPromote, setProductToPromote] = useState<MarketplaceProduct | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<MarketplaceProduct | null>(null);
  const [productToDelete, setProductToDelete] = useState<MarketplaceProduct | null>(null);
  const currentUserId = useSelector((state: RootState) => state.user?.user?._id);
  const { isDarkMode } = useTheme();

  // Sort products to show promoted items first
  const sortedProducts = [...products].sort((a, b) => {
    if (a.isPromoted && !b.isPromoted) return -1;
    if (!a.isPromoted && b.isPromoted) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleProductClick = (product: MarketplaceProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handlePromoteProduct = (product: MarketplaceProduct, event: React.MouseEvent) => {
    event.stopPropagation();
    setProductToPromote(product);
    setIsPromotionModalOpen(true);
  };

  const handleEditProduct = (product: MarketplaceProduct, event: React.MouseEvent) => {
    event.stopPropagation();
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setProductToEdit(null);
    onProductUpdate?.();
  };

  const handleDeleteProduct = (product: MarketplaceProduct, event: React.MouseEvent) => {
    event.stopPropagation();
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await MarketplaceApi.deleteProduct(productToDelete._id);
      toast.success('Product deleted successfully');
      onProductUpdate?.();
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {sortedProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            currentUserId={currentUserId}
            onProductClick={handleProductClick}
            onPromoteProduct={handlePromoteProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {isLoadingMore ? (
              <span className="flex items-center">
                Loading...
              </span>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}

      <ProductDetailModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {productToPromote && (
        <ProductPromotionModal
          isOpen={isPromotionModalOpen}
          onClose={() => {
            setIsPromotionModalOpen(false);
            setProductToPromote(null);
          }}
          product={productToPromote}
          onPromotionSuccess={() => {
            onProductUpdate?.();
            setIsPromotionModalOpen(false);
            setProductToPromote(null);
          }}
        />
      )}

      {productToEdit && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setProductToEdit(null);
          }}
          product={productToEdit}
          onProductUpdate={handleEditSuccess}
          categories={categories}
          isDarkMode={isDarkMode}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        isDarkMode={isDarkMode}
      />
    </>
  );
};

export default ProductGrid;