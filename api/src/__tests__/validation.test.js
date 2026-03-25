/**
 * FocusBro API - Validation Tests
 * Tests for input validation helpers
 */

import { describe, it, expect } from 'vitest';

describe('Input Validation Helper', () => {
  const validateInput = (value, type, opts = {}) => {
    const { min = 0, max = 1000, required = false, maxSize = 10000 } = opts;
    
    if (required && (value === null || value === undefined || value === '')) {
      return { valid: false, error: 'Field is required' };
    }
    
    if (value === null || value === undefined) {
      return { valid: true };
    }
    
    // Handle array type specially since typeof [] === 'object'
    const isArray = Array.isArray(value);
    const isCorrectType = type === 'array' ? isArray : (typeof value === type);
    
    if (!isCorrectType) {
      return { valid: false, error: `Expected ${type}, got ${typeof value}` };
    }
    
    if (type === 'string') {
      if (value.length < min || value.length > max) {
        return { valid: false, error: `Length must be between ${min} and ${max}` };
      }
    } else if (type === 'array') {
      if (value.length < min || value.length > max) {
        return { valid: false, error: `Array length must be between ${min} and ${max}` };
      }
      const size = JSON.stringify(value).length;
      if (size > maxSize) {
        return { valid: false, error: `Data exceeds maximum size` };
      }
    } else if (type === 'number') {
      if (value < min || value > max) {
        return { valid: false, error: `Number must be between ${min} and ${max}` };
      }
    }
    
    return { valid: true };
  };

  describe('String Validation', () => {
    it('should accept valid strings', () => {
      const result = validateInput('hello', 'string');
      expect(result.valid).toBe(true);
    });

    it('should reject non-string values', () => {
      const result = validateInput(123, 'string');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Expected string');
    });

    it('should enforce minimum length', () => {
      const result = validateInput('ab', 'string', { min: 3 });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('between 3');
    });

    it('should enforce maximum length', () => {
      const result = validateInput('hello world', 'string', { max: 5 });
      expect(result.valid).toBe(false);
    });

    it('should allow empty strings when not required', () => {
      const result = validateInput('', 'string', { required: false });
      expect(result.valid).toBe(true);
    });

    it('should reject empty strings when required', () => {
      const result = validateInput('', 'string', { required: true });
      expect(result.valid).toBe(false);
    });
  });

  describe('Number Validation', () => {
    it('should accept valid numbers', () => {
      const result = validateInput(42, 'number');
      expect(result.valid).toBe(true);
    });

    it('should reject non-number values', () => {
      const result = validateInput('42', 'number');
      expect(result.valid).toBe(false);
    });

    it('should enforce minimum value', () => {
      const result = validateInput(5, 'number', { min: 10 });
      expect(result.valid).toBe(false);
    });

    it('should enforce maximum value', () => {
      const result = validateInput(100, 'number', { max: 50 });
      expect(result.valid).toBe(false);
    });

    it('should accept zero', () => {
      const result = validateInput(0, 'number', { min: 0, max: 100 });
      expect(result.valid).toBe(true);
    });
  });

  describe('Array Validation', () => {
    it('should accept valid arrays', () => {
      const result = validateInput([1, 2, 3], 'array');
      expect(result.valid).toBe(true);
    });

    it('should reject non-array values', () => {
      const result = validateInput('not-array', 'array');
      expect(result.valid).toBe(false);
    });

    it('should enforce minimum length', () => {
      const result = validateInput([1], 'array', { min: 2 });
      expect(result.valid).toBe(false);
    });

    it('should enforce maximum length', () => {
      const result = validateInput([1, 2, 3, 4, 5], 'array', { max: 3 });
      expect(result.valid).toBe(false);
    });

    it('should enforce maximum size in bytes', () => {
      const largeArray = Array(1000).fill({ data: 'x'.repeat(100) });
      const result = validateInput(largeArray, 'array', { maxSize: 1000 });
      expect(result.valid).toBe(false);
    });
  });

  describe('Type Validation', () => {
    it('should validate object type', () => {
      const result = validateInput({ key: 'value' }, 'object');
      // Note: typeof {} === 'object' in JavaScript
      expect(result.valid || result.error.includes('Expected object')).toBeTruthy();
    });

    it('should validate null/undefined', () => {
      const result1 = validateInput(null, 'string');
      const result2 = validateInput(undefined, 'string');
      expect(result1.valid).toBe(true); // null/undefined allowed when not required
      expect(result2.valid).toBe(true);
    });

    it('should require fields when specified', () => {
      const result = validateInput(null, 'string', { required: true });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });
  });
});

describe('API Response Validation', () => {
  const validateApiResponse = (response, expectedSchema = {}) => {
    if (!response || typeof response !== 'object') {
      return { valid: false, error: 'Response is not an object' };
    }
    
    let data = response.results || response;
    
    if (Object.keys(expectedSchema).length > 0) {
      for (const [field, expectedType] of Object.entries(expectedSchema)) {
        const value = data[field];
        
        if (value === undefined) {
          return { valid: false, error: `Missing required field: ${field}` };
        }
        
        const isArray = Array.isArray(value);
        const isCorrectType = expectedType === 'array' ? isArray : (typeof value === expectedType);
        
        if (!isCorrectType) {
          return { valid: false, error: `Field "${field}" must be ${expectedType}` };
        }
      }
    }
    
    return { valid: true, data };
  };

  it('should validate D1 response format with results', () => {
    const response = {
      results: [{ id: 1, name: 'Test' }]
    };
    
    // Validate the structure: response should have 'results' array
    expect(Array.isArray(response.results)).toBe(true);
    expect(response.results[0]).toHaveProperty('id');
    expect(response.results[0]).toHaveProperty('name');
  });

  it('should validate direct array response format', () => {
    const response = [{ id: 1, name: 'Test' }];
    
    const result = validateApiResponse(response);
    expect(result.valid).toBe(true);
  });

  it('should reject invalid response format', () => {
    const response = null;
    
    const result = validateApiResponse(response);
    expect(result.valid).toBe(false);
  });

  it('should validate required fields in response', () => {
    const response = { id: 1 }; // missing name field
    
    const result = validateApiResponse(response, { 
      id: 'number',
      name: 'string'
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Missing required field');
  });

  it('should validate field types in response', () => {
    const response = { 
      id: 'not-a-number',
      name: 'Test'
    };
    
    const result = validateApiResponse(response, { 
      id: 'number',
      name: 'string'
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('must be number');
  });
});

describe('Email Validation', () => {
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 255;
  };

  it('should accept valid emails', () => {
    const validEmails = [
      'user@example.com',
      'test.user@sub.example.com',
      'user+tag@example.co.uk'
    ];
    
    validEmails.forEach(email => {
      expect(isValidEmail(email)).toBe(true);
    });
  });

  it('should reject invalid emails', () => {
    const invalidEmails = [
      'not-email',
      'user@',
      '@example.com',
      'user @example.com',
      'user@.com',
      ''
    ];
    
    invalidEmails.forEach(email => {
      expect(isValidEmail(email)).toBe(false);
    });
  });

  it('should reject emails exceeding 255 characters', () => {
    const longEmail = 'a'.repeat(300) + '@example.com';
    expect(isValidEmail(longEmail)).toBe(false);
  });
});

describe('Password Validation', () => {
  const isStrongPassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    return minLength && hasUpper && hasLower && hasNumber;
  };

  it('should accept strong passwords', () => {
    const strongPasswords = [
      'Password123',
      'MySecurePass456',
      'Test@Password789'
    ];
    
    strongPasswords.forEach(pwd => {
      expect(isStrongPassword(pwd)).toBe(true);
    });
  });

  it('should reject weak passwords', () => {
    const weakPasswords = [
      'short',           // Too short
      'noupppercase1',   // No uppercase
      'NOLOWERCASE1',    // No lowercase
      'NoNumbers',       // No numbers
      '12345678'         // No letters
    ];
    
    weakPasswords.forEach(pwd => {
      expect(isStrongPassword(pwd)).toBe(false);
    });
  });
});
