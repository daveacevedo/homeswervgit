/**
 * Utility functions for error handling and reporting
 */

// Check if Sentry is available and not blocked
export const checkSentryAvailability = async () => {
  try {
    // Simple test to see if we can reach Sentry's API
    const response = await fetch('https://sentry.io/api/0/', {
      method: 'HEAD',
      mode: 'no-cors', // This prevents CORS issues but means we can't read the response
      cache: 'no-cache',
    });
    
    // If we get here, the request didn't throw, which is a good sign
    return true;
  } catch (error) {
    console.error('Error checking Sentry availability:', error);
    return false;
  }
};

// Log errors to console and potentially to a backend service
export const logError = (error, context = {}) => {
  // Always log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', error);
    console.error('Context:', context);
  }
  
  // If Sentry is blocked or unavailable, we could send to our own error logging endpoint
  if (context.sentryBlocked) {
    // Log to our own error tracking system
    try {
      // This would be an API call to your own error logging service
      // For now, we'll just log to console
      console.info('Would log to fallback error service:', {
        error: typeof error === 'string' ? error : error.message || 'Unknown error',
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
      });
    } catch (loggingError) {
      console.error('Failed to log to fallback service:', loggingError);
    }
  }
  
  // Return a unique ID for this error instance
  return Date.now().toString();
};

// Format error for display to users
export const formatErrorForUser = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  
  // If it's an API error with a specific format
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  
  // If it's a standard Error object
  if (error.message) {
    return error.message;
  }
  
  // Default fallback
  return 'An unexpected error occurred. Please try again later.';
};

// Determine if an error should be shown to the user
export const shouldShowErrorToUser = (error) => {
  // Don't show network connectivity errors directly
  if (error.name === 'NetworkError' || error.message?.includes('network')) {
    return false;
  }
  
  // Don't show CORS errors directly
  if (error.message?.includes('CORS')) {
    return false;
  }
  
  // Show most other errors
  return true;
};
