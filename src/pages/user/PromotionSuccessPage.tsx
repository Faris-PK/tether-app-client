import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MarketplaceApi } from '@/api/marketplaceApi';
import { toast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { log } from 'console';

interface PromotionStatus {
  success: boolean;
  error?: string;
}


const PromotionSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);
  const [status, setStatus] = useState<PromotionStatus | null>();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      verifyPromotion(sessionId);
    } else {
      navigate('/user/marketplace');
    }
  }, [searchParams, navigate]);

  const verifyPromotion = async (sessionId: string) => {
    try {
      const response = await MarketplaceApi.checkPromotionStatus(sessionId);
        console.log('what i get from backend : ', response.data.isPromoted);
      
  //    setStatus({ success });
      
      if (response.data.isPromoted) {
        setStatus({success:true})
        console.log('mission passed');
        
        toast({
          title: "Promotion Successful",
          description: "Your product has been promoted successfully!",
        });
    }
    } catch (error) {
      console.error('Error verifying promotion:', error);
    //   setStatus({ 
    //     success: false, 
    //     error: error instanceof Error ? error.message : 'Unknown error occurred' 
    //   });
      
      toast({
        title: "Verification Failed",
        description: "There was an error verifying your promotion.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
      // Redirect to marketplace after a short delay
      setTimeout(() => navigate('/user/marketplace'), 2000);
    }
  };

  const handleRetry = () => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      setProcessing(true);
      verifyPromotion(sessionId);
    }
  };

  const handleManualRedirect = () => {
    navigate('/user/marketplace');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          {processing ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="text-lg font-medium">Verifying your promotion...</span>
            </div>
          ) : status?.success ? (
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
              <h1 className="text-2xl font-bold">Thank you for your purchase!</h1>
              <p className="text-gray-600">Your promotion has been successfully verified.</p>
              <p className="text-sm text-gray-500">Redirecting you back to the marketplace...</p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
              <h1 className="text-2xl font-bold text-red-600">Verification Failed</h1>
              <p className="text-gray-600">{status?.error || 'There was an error verifying your promotion.'}</p>
              <div className="flex flex-col space-y-2">
                <Button onClick={handleRetry} variant="outline">
                  Try Again
                </Button>
                <Button onClick={handleManualRedirect}>
                  Return to Marketplace
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromotionSuccessPage;