import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';

const PremiumBadge: React.FC = () => {
  return (
    <div className="mt-6 flex items-center gap-2">
      <Badge 
        className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black px-3 py-1 flex items-center gap-2 shadow-lg hover:from-amber-600 hover:to-yellow-500 transition-all duration-300"
      >
        <Crown size={16} className="animate-pulse" />
        <span className="font-semibold">Premium</span>
      </Badge>
    </div>
  );
};

export default PremiumBadge;
