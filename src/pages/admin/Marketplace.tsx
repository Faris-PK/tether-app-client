import React, { useEffect, useState } from 'react';
import { adminApi } from '@/api/adminApi';
import { MarketplaceProduct } from '@/types/IMarketplace';
import { Search, ArrowUpDown, Eye, Settings, Ban, CheckCircle, MapPin, DollarSign, Tag, Package, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedProducts = await adminApi.getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      setError('Failed to fetch products');
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleShowDetails = (product: MarketplaceProduct) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  const handleBlockProduct = async (productId: string, currentStatus: boolean) => {
    try {
     // console.log(productId, currentStatus);
      
      const status = currentStatus ? 'unblock' : 'block';
      await adminApi.updateProductStatus(productId, status);
      await fetchProducts(); // Refresh the product list
      
      // Update the selected product if it's currently being viewed
      if (selectedProduct?._id === productId) {
        setSelectedProduct(prev => prev ? { ...prev, isBlocked: !currentStatus } : null);
      }
    } catch (error) {
      console.error('Failed to update product status:', error);
      setError('Failed to update product status. Please try again.');
    }
  };

  const handleApprove = async (productId: string) => {
    try {
      await adminApi.approveProduct(productId);
      await fetchProducts(); // Refresh the list after approval
      if (selectedProduct?._id === productId) {
        setSelectedProduct({ ...selectedProduct, isApproved: true });
      }
    } catch (error) {
      console.error('Failed to approve product:', error);
    }
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const filteredProducts = products
    .filter(product => 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <div className="w-full space-y-4 p-4 md:p-6">
      {/* Header and Search Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h2 className="text-2xl md:text-3xl font-bold text-[#464255]">Marketplace</h2>
        
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <div className="relative flex-1 sm:min-w-[300px]">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
          <Button
            onClick={handleSort}
            variant="default"
            className="bg-[#00B074] hover:bg-[#00965f]"
          >
            <span className="hidden sm:inline">Sort by Date</span>
            <ArrowUpDown className="h-4 w-4 sm:ml-2" />
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <ScrollArea className="h-[calc(100vh-12rem)] rounded-lg border">
        {loading ? (
          <div className="space-y-4 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#F7F6FE] sticky top-0">
              <tr>
                <th className="p-3 text-left hidden md:table-cell">ID</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left hidden sm:table-cell">Seller</th>
                <th className="p-3 text-left hidden sm:table-cell">Price</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 hidden md:table-cell">{index + 1}</td>
                  <td className="p-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.title}</p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {product.location.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 hidden sm:table-cell">
                    <div className="flex items-center space-x-2">
                      <img
                        src={product.userId.profile_picture}
                        alt={product.userId.username}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-gray-600">{product.userId.username}</span>
                    </div>
                  </td>
                  <td className="p-3 hidden sm:table-cell">
                    <span className="text-gray-600">₹{product.price.toLocaleString()}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      {product.isPromoted && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Promoted
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.isBlocked
                            ? 'bg-red-100 text-red-800'
                            : product.isApproved
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {product.isBlocked 
                          ? 'Blocked' 
                          : product.isApproved 
                          ? 'Approved' 
                          : 'Pending'}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleShowDetails(product)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {!product.isApproved && !product.isBlocked && (
                          <DropdownMenuItem 
                            onClick={() => handleApprove(product._id)}
                            className="text-green-600"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve Product
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleBlockProduct(product._id, product.isBlocked)}
                          className={product.isBlocked ? 'text-green-600' : 'text-red-600'}
                        >
                          {product.isBlocked ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Unblock Product
                            </>
                          ) : (
                            <>
                              <Ban className="mr-2 h-4 w-4" />
                              Block Product
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ScrollArea>

      {/* Product Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Product Images */}
                  <div className="grid grid-cols-5 gap-2">
                    {selectedProduct.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${selectedProduct.title} - ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>

                  {/* Product Header */}
                  <div>
                    <h3 className="text-2xl font-semibold">{selectedProduct.title}</h3>
                    <p className="text-xl text-gray-600 mt-2">₹{selectedProduct.price.toLocaleString()}</p>
                    <p className="text-gray-500 mt-2 whitespace-pre-line">{selectedProduct.description}</p>
                  </div>

                  <Separator />

                  {/* Product Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">Location</span>
                      </div>
                      <p className="mt-1 font-medium">{selectedProduct.location.name}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Tag className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">Category</span>
                      </div>
                      <p className="mt-1 font-medium">{selectedProduct.category}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">Promotion Status</span>
                      </div>
                      <p className="mt-1 font-medium">
                        {selectedProduct.isPromoted 
                          ? `Promoted until ${formatDate(selectedProduct.promotionExpiry)}`
                          : 'Not Promoted'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">Approval Status</span>
                      </div>
                      <p className="mt-1 font-medium">
                        {selectedProduct.isApproved ? 'Approved' : 'Pending Approval'}
                      </p>
                    </div>
                  </div>

                  {/* Seller Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Seller Information</h4>
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedProduct.userId.profile_picture}
                        alt={selectedProduct.userId.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{selectedProduct.userId.username}</p>
                        <p className="text-sm text-gray-500">Member since {formatDate(selectedProduct.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowDetails(false)}
                    >
                      Close
                    </Button>
                    <Button
                      variant={selectedProduct.isBlocked ? "default" : "destructive"}
                      onClick={() => handleBlockProduct(selectedProduct._id, selectedProduct.isBlocked)}
                    >
                      {selectedProduct.isBlocked ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Unblock Product
                        </>
                      ) : (
                        <>
                          <Ban className="mr-2 h-4 w-4" />
                          Block Product
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Marketplace;