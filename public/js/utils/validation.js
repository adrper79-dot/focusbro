// Input Validation and Sanitization Utilities
export function initValidation() {
  // Initialize validation state
  window.appState.validation = {
    rules: {},
    errors: {}
  };
}

// Sanitize HTML input to prevent XSS
window.sanitizeHTML = function(str) {
  if (typeof str !== 'string') return '';

  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

// Validate email format
window.isValidEmail = function(email) {
  if (typeof email !== 'string') return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Validate password strength
window.validatePassword = function(password) {
  if (typeof password !== 'string') return { valid: false, errors: ['Password must be a string'] };

  const errors = [];
  const minLength = 8;

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Validate timer duration (1-99 minutes)
window.isValidDuration = function(duration) {
  if (typeof duration !== 'number' && typeof duration !== 'string') return false;

  const num = parseInt(duration, 10);
  return !isNaN(num) && num >= 1 && num <= 99;
};

// Sanitize and validate user input
window.sanitizeInput = function(input, options = {}) {
  const {
    maxLength = 1000,
    allowHTML = false,
    trim = true
  } = options;

  if (typeof input !== 'string') return '';

  let sanitized = input;

  if (trim) {
    sanitized = sanitized.trim();
  }

  if (!allowHTML) {
    sanitized = sanitizeHTML(sanitized);
  }

  if (maxLength > 0) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
};

// Validate form data object
window.validateFormData = function(data, rules) {
  const errors = {};
  let isValid = true;

  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];
    const fieldErrors = [];

    // Required check
    if (rule.required && (value === undefined || value === null || value === '')) {
      fieldErrors.push(`${field} is required`);
      isValid = false;
    }

    // Type checks
    if (value !== undefined && value !== null && value !== '') {
      if (rule.type === 'email' && !isValidEmail(value)) {
        fieldErrors.push('Invalid email format');
        isValid = false;
      }

      if (rule.type === 'number') {
        const num = parseFloat(value);
        if (isNaN(num)) {
          fieldErrors.push(`${field} must be a number`);
          isValid = false;
        } else {
          if (rule.min !== undefined && num < rule.min) {
            fieldErrors.push(`${field} must be at least ${rule.min}`);
            isValid = false;
          }
          if (rule.max !== undefined && num > rule.max) {
            fieldErrors.push(`${field} must be no more than ${rule.max}`);
            isValid = false;
          }
        }
      }

      if (rule.type === 'string' && typeof value !== 'string') {
        fieldErrors.push(`${field} must be text`);
        isValid = false;
      }

      // Length checks for strings
      if (typeof value === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          fieldErrors.push(`${field} must be at least ${rule.minLength} characters`);
          isValid = false;
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          fieldErrors.push(`${field} must be no more than ${rule.maxLength} characters`);
          isValid = false;
        }
      }
    }

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
    }
  }

  return { isValid, errors };
};

// Safe JSON parsing with validation
window.safeJSONParse = function(jsonString, fallback = null) {
  if (typeof jsonString !== 'string') return fallback;

  try {
    const parsed = JSON.parse(jsonString);

    // Basic validation - ensure it's an object/array
    if (typeof parsed !== 'object' || parsed === null) {
      return fallback;
    }

    return parsed;
  } catch (e) {
    console.warn('JSON parse error:', e.message);
    return fallback;
  }
};

// Validate API response structure
window.validateAPIResponse = function(response, expectedFields = []) {
  if (!response || typeof response !== 'object') {
    return { valid: false, error: 'Invalid response format' };
  }

  // Handle both response.results and direct array formats
  const data = response.results || response;
  if (!Array.isArray(data)) {
    return { valid: false, error: 'Response data is not an array' };
  }

  // Check for expected fields if specified
  if (expectedFields.length > 0) {
    const missingFields = expectedFields.filter(field =>
      data.length > 0 && !data[0].hasOwnProperty(field)
    );

    if (missingFields.length > 0) {
      return {
        valid: false,
        error: `Missing expected fields: ${missingFields.join(', ')}`
      };
    }
  }

  return { valid: true, data };
};

// Rate limiting for form submissions
window.createRateLimiter = function(maxAttempts = 5, windowMs = 60000) {
  const attempts = [];

  return function() {
    const now = Date.now();

    // Remove old attempts outside the window
    while (attempts.length > 0 && attempts[0] < now - windowMs) {
      attempts.shift();
    }

    if (attempts.length >= maxAttempts) {
      return false; // Rate limited
    }

    attempts.push(now);
    return true; // Allow
  };
};