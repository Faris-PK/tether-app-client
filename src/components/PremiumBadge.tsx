import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';

const PremiumBadge: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  
  const getPremiumDuration = () => {
    if (!user?.premium_expiration) return null;
    
    const expirationDate = new Date(user.premium_expiration);
    const currentDate = new Date();
    const monthsDifference = (expirationDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    return monthsDifference > 1 ? 'year' : 'month';
  };

  const premiumDuration = getPremiumDuration();
  
  if (!premiumDuration) return null;

  return (
    <div className="mt-6 flex items-center gap-2">
      <Badge 
        className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black px-3 py-1 flex items-center gap-2 shadow-lg hover:from-amber-600 hover:to-yellow-500 transition-all duration-300"
      >
        <Crown size={16} className="animate-pulse" />
        <span className="font-semibold">
          {premiumDuration === 'year' ? '1 Year Premium' : '1 Month Premium'}
        </span>
      </Badge>
    </div>
  );
};

export default PremiumBadge;