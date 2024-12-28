import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12'
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  fullScreen = true,
  className = ''
}) => {
  const containerClasses = `flex justify-center items-center ${
    fullScreen ? 'min-h-screen' : 'min-h-[200px]'
  }`;

  return (
    <div 
      className={containerClasses} 
      role="status" 
      aria-live="polite"
    >
      <Loader2 
        className={`animate-spin text-primary ${sizeMap[size]} ${className}`}
        aria-hidden="true"
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;