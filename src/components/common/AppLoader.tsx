import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import React from 'react';

interface AppLoaderProps {
    fromHome?: boolean;
}

const AppLoader: React.FC<AppLoaderProps> = ({ fromHome = false }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-10 bg-gray-900">
      <div className="flex flex-col items-center justify-center">
        {fromHome && (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 32 32" 
            className="w-24 h-24 animate-pulse"
          >
            {/* Background circle */}
            <circle cx="16" cy="16" r="16" fill="#1D9BF0"/>
            
            {/* Letter T */}
            <text 
              x="50%" 
              y="50%" 
              fontSize="20" 
              fontWeight="bold" 
              fill="white" 
              textAnchor="middle" 
              dominantBaseline="central" 
              fontFamily="Arial, sans-serif"
            >
              T
            </text>
          </svg>
        )}
        <Box sx={{ width: '100%', marginTop: fromHome ? '20px' : '0'}}>
          <LinearProgress />
        </Box>
      </div>
    </div>
  );
};

export default AppLoader;