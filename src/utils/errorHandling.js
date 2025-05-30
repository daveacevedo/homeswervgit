// Utility functions for error handling

/**
 * Checks if Sentry is available and not blocked by browser settings
 * @returns {Promise<boolean>} Whether Sentry is available
 */
export const checkSentryAvailability = async () => {
  // This is a simplified check - in a real app, you'd want to actually
  // try to initialize Sentry and catch any errors
  try {
    // Simulate checking if Sentry can be loaded
    return true;
  } catch (error) {
    console.warn('Sentry appears to be blocked:', error);
    return false;
  }
};

/**
 * Logs an error to the console and to Sentry if available
 * @param {Error} error - The error to log
 * @param {Object} context - Additional context for the error
 */
export const logError = (error, context = {}) => {
  // Always log to console
  console.error('Error:', error, 'Context:', context);
  
  // In a real app, you would send to Sentry here if available
  if (!context.sentryBlocked) {
    // Sentry.captureException(error, { extra: context });
    console.log('Would send to Sentry:', error, context);
  }
  
  // You could also log to your own backend API
  // logErrorToApi(error, context);
};

/**
 * Formats an error message for display to users
 * @param {Error|string} error - The error to format
 * @returns {string} A user-friendly error message
 */
export const formatErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  const errorMessage = typeof error === 'string' 
    ? error 
    : error.message || String(error);
  
  // Clean up common error messages
  if (errorMessage.includes('network')) {
    return 'Network error. Please check your internet connection and try again.';
  }
  
  if (errorMessage.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }
  
  if (errorMessage.includes('auth/')) {
    return 'Authentication error. Please check your credentials and try again.';
  }
  
  // Return the original message if no specific handling
  return errorMessage;
};

/**
 * Creates a standardized error object
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @param {Object} details - Additional error details
 * @returns {Object} Standardized error object
 */
export const createError = (code, message, details = {}) => {
  return {
    code,
    message,
    details,
    timestamp: new Date().toISOString()
  };
};
