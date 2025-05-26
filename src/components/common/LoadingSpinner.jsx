import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'blue', fullScreen = false }) => {
  // Size classes
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4',
  };
  
  // Color classes
  const colorClasses = {
    blue: 'border-blue-500',
    gray: 'border-gray-500',
    white: 'border-white',
    orange: 'border-orange-500',
  };
  
  // Container classes
  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50' 
    : 'flex items-center justify-center';
  
  return (
    <div className={containerClasses}>
      <div 
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin border-t-transparent`}
        role="status"
        aria-label="Loading"
      />
      {fullScreen && (
        <span className="sr-only">Loading...</span>
      )}
    </div>
  );
};

export default LoadingSpinner;
