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
import { toast } from "@/hooks/use-toast"
import { paymentApi } from '../../api/paymentApi';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const VITE_STRIPE_MONTHLY_PRICE_ID = import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID;
const VITE_STRIPE_YEARLY_PRICE_ID = import.meta.env.VITE_STRIPE_YEARLY_PRICE_ID;


interface Plan {
  title: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  priceId: string; // Add this to match with your backend
  planType: 'monthly' | 'yearly';
}

interface PremiumSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PremiumSubscriptionModal: React.FC<PremiumSubscriptionModalProps> = ({ isOpen, onClose }) => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState<string | null>(null);

  const plans: Plan[] = [ 
    { 
      title: "Monthly Premium", 
      price: "₹99", 
      period: "/month", 
      planType: 'monthly', 
      priceId: VITE_STRIPE_MONTHLY_PRICE_ID, 
      features: [ 
        "Marketplace access", 
        "Live video option", 
        "Ad-free experience", 
        "Premium badges", 
        "Priority support", 
        "Exclusive features"
      ] 
    }, 
    { 
      title: "Yearly Premium", 
      price: "₹799", 
      period: "/year", 
      planType: 'yearly', 
      priceId: VITE_STRIPE_YEARLY_PRICE_ID, 
      features: [ 
        "All monthly features", 
        "Save 17% yearly", 
        "Item promoting option", 
        "Premium analytics", 
        "Custom profile themes", 
        "Marketplace access", 
        "Live video option"
      ], 
      popular: true 
    } 
  ];  

  const makePayment = async (plan: Plan) => {
    try {
      setLoading(plan.title);

      // 1. Create subscription session from your backend
      const { sessionUrl } = await paymentApi.createSubscription({
        planType: plan.planType,
        priceId: plan.priceId
      });

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
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-4xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <DialogHeader>
          <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-800'}>Upgrade to Tether Premium</DialogTitle>
          <DialogDescription className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            Choose the perfect plan for your social networking needs
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row gap-4">
          {plans.map((plan) => (
            <Card 
              key={plan.title} 
              className={`p-6 space-y-4 flex-1 relative ${
                plan.popular ? 'border-2 border-yellow-500' : ''
              } ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
            >
              {plan.popular && (
                <div className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full ${isDarkMode ? 'bg-yellow-500 text-gray-800' : 'bg-yellow-500 text-white'}`}>
                  Most Popular
                </div>
              )}
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{plan.title}</h3>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {plan.price}
                <span className={`text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{plan.period}</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Check className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-green-400' : 'text-green-500'} flex-shrink-0`} />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => makePayment(plan)}
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                color={isDarkMode ? "gray" : "default"}
                disabled={loading === plan.title}
              >
                {loading === plan.title ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Subscribe Now'
                )}
              </Button>
            </Card>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="secondary" color={isDarkMode ? "gray" : "default"}>
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumSubscriptionModal;