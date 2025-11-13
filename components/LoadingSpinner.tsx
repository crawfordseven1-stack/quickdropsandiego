// components/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-blue"></div>
      <p className="mt-4 text-primary-blue font-semibold">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
