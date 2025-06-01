import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'blue' }) => {
  let sizeClass = 'h-6 w-6';
  if (size === 'small') {
    sizeClass = 'h-4 w-4';
  } else if (size === 'large') {
    sizeClass = 'h-12 w-12';
  }

  let colorClass = 'border-blue-500';
  if (color === 'white') {
    colorClass = 'border-white';
  } else if (color === 'gray') {
    colorClass = 'border-gray-500';
  }

  return (
    <div className={`animate-spin rounded-full ${sizeClass} border-t-2 border-b-2 ${colorClass}`}></div>
  );
};

export default LoadingSpinner;
