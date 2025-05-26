import React from 'react';
import { useError } from '../../contexts/ErrorContext';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ErrorNotification = () => {
  const { errors, removeError, sentryAvailable } = useError();
  
  if (errors.length === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full space-y-2">
      {errors.map((error) => (
        <div 
          key={error.id} 
          className="bg-white shadow-lg rounded-lg border-l-4 border-red-500 p-4 flex items-start"
        >
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Error</h3>
            <p className="text-sm text-gray-600 mt-1">{error.message}</p>
            {!sentryAvailable && (
              <p className="text-xs text-amber-600 mt-2">
                Note: Error reporting is currently disabled. This may be due to an ad blocker.
              </p>
            )}
          </div>
          <button 
            onClick={() => removeError(error.id)}
            className="ml-4 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ErrorNotification;
