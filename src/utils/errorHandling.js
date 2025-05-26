/**
 * Centralized error handling utility
 */

// Log error to console with additional context
export const logError = (error, context = {}) => {
  console.error(
    `Error${context.location ? ` in ${context.location}` : ''}:`,
    error,
    context
  );
};

// Format error message for user display
export const formatErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  // Handle different error types
  if (typeof error === 'string') {
    return error;
  }
  
  if (error.message) {
    return error.message;
  }
  
  if (error.error_description) {
    return error.error_description;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// Handle API errors consistently
export const handleApiError = (error, fallbackMessage = 'API request failed') => {
  logError(error, { location: 'API request' });
  
  // Return user-friendly error message
  return formatErrorMessage(error) || fallbackMessage;
};

// Create a standardized error response object
export const createErrorResponse = (error, status = 'error') => {
  return {
    status,
    message: formatErrorMessage(error),
    timestamp: new Date().toISOString(),
    error: process.env.NODE_ENV === 'development' ? error : undefined
  };
};
