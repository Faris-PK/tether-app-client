import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Car, DeleteIcon, EditIcon, Home, MapPin, MoreVertical, ShoppingBag, Smartphone, Sofa, Tag, Trophy,Gamepad } from 'lucide-react';
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

const ProductGrid: React.FC<ProductGridProps> = ({ products, loading, onProductUpdate }) => {

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card 
            key={product._id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800 cursor-pointer rounded-lg relative"
            onClick={() => handleProductClick(product)}
          >
            {product.isPromoted && (
              <div className="absolute top-2 right-2 z-10">
                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  Promoted
                </span>
              </div>
            )}
            
            {currentUserId === product.userId._id &&  !product.isPromoted &&  (
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
                        onClick={(e) => handlePromoteProduct(product, e)}
                        className="cursor-pointer font-semibold flex items-center space-x-2 hover:bg-gray-300 dark:hover:bg-gray-700"
                      >
                        <Tag className="h-4 w-4" />
                        <span>Promote Item</span>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      onClick={(e) => handleEditProduct(product, e)}
                      className="cursor-pointer font-semibold flex items-center space-x-2 hover:bg-gray-300 dark:hover:bg-gray-700"
                    >
                      <EditIcon className="h-4 w-4" />
                      <span>Edit Product</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={(e) => handleDeleteProduct(product, e)}
                      className="cursor-pointer font-semibold flex items-center space-x-2 text-red-600 hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-red-500"
                    >
                      <DeleteIcon className="h-4 w-4 text-red-600 dark:text-red-500" />
                      <span>Delete Product</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

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

      {/* New modals for edit and delete */}
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