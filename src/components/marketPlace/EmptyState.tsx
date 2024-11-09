import { Package } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-gray-50 dark:bg-gray-800 rounded-lg">
      <Package className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-500" />
      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
        No Products Found
      </h3>
      <p className="max-w-md text-gray-500 dark:text-gray-400">
        We couldn't find any products matching your criteria. Try adjusting your filters or check back later for new listings.
      </p>
    </div>
  );
};

export default EmptyState