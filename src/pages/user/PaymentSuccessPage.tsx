import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from '../../contexts/ThemeContext';
import { CheckCircle2 } from 'lucide-react';
import { paymentApi } from '../../api/paymentApi';
import { useDispatch } from 'react-redux';
import { updatePremiumStatus } from '@/redux/slices/userSlice';

const PaymentSuccessPage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      verifyPayment(sessionId);
    }
  }, [searchParams]);

  const verifyPayment = async (sessionId: string) => {
    try {
      console.log('verifyPayment triggered ');
      
      const response = await paymentApi.verifyPayment(sessionId);
      console.log(" Reponse of succes payment : ", response.data );
      dispatch(updatePremiumStatus(true));
      
      setLoading(false);
    } catch (err) {
      console.log(err,"EERRRRRRRRRRR");
      
      setError('Failed to verify payment. Please contact support.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className={`max-w-md w-full p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Payment Verification Failed</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
            <Button onClick={() => navigate('/user/home')}>
              Return to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className={`max-w-md w-full p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
        <div className="text-center">
          <div className="text-green-500 mb-4">
            <CheckCircle2 className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Thank you for upgrading to Premium! Your account has been successfully upgraded and you now have access to all premium features.
          </p>
          <div className="space-y-4">
            <Button 
              className="w-full"
              onClick={() => navigate('/user/home')}
            >
              Return to Home
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/user/profile')}
            >
              View Profile
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
