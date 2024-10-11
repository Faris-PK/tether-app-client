import React from 'react';
import illustration from '../assets/Ilustração.png';

interface LeftSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  className?: string; 
}

const LeftSection: React.FC<LeftSectionProps> = ({ title, subtitle, description, className }) => {
  return (
    <div className={`w-1/2 bg-[#1D9BF0] flex flex-col items-center p-6 overflow-hidden ${className}`}>
      <div className="flex flex-col items-start justify-center h-full px-12 text-white flex-grow">
        <div className="mt-20">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          {subtitle && <h1 className="text-3xl font-bold mb-2">{subtitle}</h1>}
          {description && <p className="text-lg mt-8 font-medium">{description}</p>}
        </div>
        <div className="flex-grow flex justify-center items-center">
          <img 
            src={illustration} 
            alt="Illustration" 
            className="w-4/5 h-auto"
          />
        </div>
      </div>
      <div className="w-full text-center mb-4">
        <p className="text-white">© 2024 Tether, Inc.</p>
      </div>
    </div>
  );
};

export default LeftSection;
