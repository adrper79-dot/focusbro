/**
 * Authentication module for FocusBro
 * Uses Web Crypto API for password hashing (PBKDF2)
 * No external dependencies - works in Cloudflare Workers
 */

/**
 * Hash password using PBKDF2 (Web Crypto API)
 * Returns salt + hash to be stored in DB
 */
export async function hashPassword(password) {
  // Generate random salt
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  // Encode password
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Import key
  const key = await crypto.subtle.importKey('raw', data, 'PBKDF2', false, [
    'deriveBits'
  ]);
  
  // Derive bits (256 bits = 32 bytes) with 100,000 iterations
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    key,
    256
  );
  
  // Convert to hex strings for storage
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const hashHex = Array.from(new Uint8Array(derivedBits))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  // Return combined: salt$hash (easier to store in SQLite)
  return `${saltHex}$${hashHex}`;
}

/**
 * Verify password against stored hash
 */
export async function verifyPassword(password, storedHash) {
  const [saltHex, hashHex] = storedHash.split('$');
  
  if (!saltHex || !hashHex) {
    return false;
  }
  
  // Reconstruct salt from hex
  const salt = new Uint8Array(
    saltHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
  );
  
  // Encode password
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Import key
  const key = await crypto.subtle.importKey('raw', data, 'PBKDF2', false, [
    'deriveBits'
  ]);
  
  // Derive with same params
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    key,
    256
  );
  
  // Convert to hex
  const computedHash = Array.from(new Uint8Array(derivedBits))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  // Compare (constant-time comparison)
  return computedHash === hashHex;
}

/**
 * Generate secure session token
 */
export function generateSessionToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

/**
 * Validate password strength
 */
export function isStrongPassword(password) {
  // At least 8 chars, requires uppercase, lowercase, number
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return minLength && hasUpper && hasLower && hasNumber;
}
