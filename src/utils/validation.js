/**
 * Validation utility functions
 */

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (min 8 chars, at least 1 letter and 1 number)
export const isValidPassword = (password) => {
  if (!password || password.length < 8) return false;
  
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return hasLetter && hasNumber;
};

// Phone number validation (simple format check)
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone.replace(/[\s()-]/g, ''));
};

// URL validation
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Form validation helper
export const validateForm = (data, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(field => {
    const value = data[field];
    const rules = validationRules[field];
    
    // Required field validation
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors[field] = rules.requiredMessage || 'This field is required';
      return;
    }
    
    // Skip other validations if field is empty and not required
    if (!value && !rules.required) return;
    
    // Minimum length validation
    if (rules.minLength && value.length < rules.minLength) {
      errors[field] = `Must be at least ${rules.minLength} characters`;
      return;
    }
    
    // Maximum length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      errors[field] = `Must be no more than ${rules.maxLength} characters`;
      return;
    }
    
    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      errors[field] = rules.patternMessage || 'Invalid format';
      return;
    }
    
    // Custom validation function
    if (rules.validate) {
      const customError = rules.validate(value, data);
      if (customError) {
        errors[field] = customError;
        return;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
