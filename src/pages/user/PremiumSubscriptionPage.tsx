import  { useState } from 'react';
import { Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTheme } from '../../contexts/ThemeContext';
import PremiumSubscriptionModal from '../../components/modals/PremiumSubscriptionModal';

const PremiumSubscriptionPage = () => {
  const { isDarkMode } = useTheme();
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);



  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50 '
    }`}>
      <Card className={`max-w-2xl w-full p-8 text-center ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex flex-col items-center space-y-6">
          {/* Lock Icon */}
          <div className={`p-4 rounded-full ${
            isDarkMode ? 'bg-gray-700' : 'bg-blue-100'
          }`}>
            <Lock className={`w-12 h-12 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-400'
            }`} />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Subscribe to unlock
            </h1>
            <p className={`text-lg ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Access premium features and take your experience to the next level
            </p>
          </div>

          {/* Features Grid */}
          
          {/* Subscribe Button */}
          <Button
            onClick={() => setIsPremiumModalOpen(true)}
            className="mt-8 px-8 py-6 text-lg bg-black hover:bg-gray-600 text-white"
          >
            Subscribe Now
          </Button>
        </div>
      </Card>

      {/* Premium Subscription Modal */}
      <PremiumSubscriptionModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
      />
    </div>
  );
};

export default PremiumSubscriptionPage;