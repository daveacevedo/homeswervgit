import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkSentryAvailability, logError } from '../utils/errorHandling';

const ErrorContext = createContext();

export function useError() {
  return useContext(ErrorContext);
}

export function ErrorProvider({ children }) {
  const [globalError, setGlobalError] = useState(null);
  const [sentryAvailable, setSentryAvailable] = useState(true);
  
  // Check if Sentry is available on mount
  useEffect(() => {
    const checkSentry = async () => {
      const available = await checkSentryAvailability();
      setSentryAvailable(available);
    };
    
    checkSentry();
  }, []);
  
  // Function to capture and handle errors
  const captureError = (error, errorInfo = {}) => {
    // Set the global error state
    setGlobalError({
      message: error.message || String(error),
      stack: error.stack,
      ...errorInfo
    });
    
    // Log the error using our utility
    logError(error, {
      sentryBlocked: !sentryAvailable,
      ...errorInfo
    });
    
    return error;
  };
  
  // Function to clear the global error
  const clearError = () => {
    setGlobalError(null);
  };
  
  const value = {
    globalError,
    captureError,
    clearError,
    sentryAvailable
  };
  
  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
}
