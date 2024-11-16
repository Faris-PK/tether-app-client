import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { useTheme } from '../../contexts/ThemeContext';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from "@/hooks/use-toast";
import { MarketplaceApi } from '@/api/marketplaceApi';
import { MarketplaceProduct } from '../../types/IMarketplace';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: MarketplaceProduct;
  onPromotionSuccess?: () => void;
}

const ProductPromotionModal: React.FC<PromotionModalProps> = ({ 
  isOpen, 
  onClose, 
  product,
  onPromotionSuccess 
}) => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);

  const promotionDetails = {
    title: "30-Day Product Promotion",
    price: "₹99",
    features: [
      "Featured placement in search results",
      "Higher visibility to potential buyers",
      "Special promotion badge",
      "Priority in category listings",
      "Enhanced product analytics",
      "30 days of premium visibility"
    ]
  };

  const handlePromotion = async () => {
    try {
      setLoading(true);

      // 1. Create promotion session
      const { sessionUrl } = await MarketplaceApi.promoteProduct(product._id);

      // 2. Initialize Stripe
      const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }

      // 3. Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionUrl
      });

      if (error) {
        throw error;
      }

    } catch (error) {
      console.error('Promotion error:', error);
      toast({
        title: "Promotion Error",
        description: "There was an error processing your promotion request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <DialogHeader>
          <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-800'}>
            Promote Your Product
          </DialogTitle>
          <DialogDescription className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            Boost visibility and reach more potential buyers
          </DialogDescription>
        </DialogHeader>

        <Card className={`p-6 space-y-4 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}>
          <div className="space-y-2">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {promotionDetails.title}
            </h3>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {promotionDetails.price}
              <span className={`text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                /30 days
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Promoting: <span className="font-semibold">{product.title}</span>
            </p>
            <ul className="space-y-2">
              {promotionDetails.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <Check className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-green-400' : 'text-green-500'} flex-shrink-0`} />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            onClick={handlePromotion}
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Promote Now'
            )}
          </Button>
        </Card>

        <DialogFooter>
          <Button onClick={onClose} variant="secondary" className="w-full">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductPromotionModal;