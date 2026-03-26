// Local Storage and Data Persistence Utilities
export function initStorage() {
  // Initialize storage state
  window.appState.storage = {
    isAvailable: checkStorageAvailability(),
    queue: [],
    processing: false
  };
}

// Check if localStorage is available
function checkStorageAvailability() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    console.warn('localStorage not available:', e.message);
    return false;
  }
}

// Safe localStorage get with fallback
window.safeStorageGet = function(key, fallback = null) {
  if (!window.appState.storage.isAvailable) return fallback;

  try {
    const item = localStorage.getItem(key);
    return item !== null ? item : fallback;
  } catch (e) {
    console.warn(`Failed to get ${key} from localStorage:`, e.message);
    return fallback;
  }
};

// Safe localStorage set
window.safeStorageSet = function(key, value) {
  if (!window.appState.storage.isAvailable) return false;

  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.warn(`Failed to set ${key} in localStorage:`, e.message);
    return false;
  }
};

// Safe localStorage remove
window.safeStorageRemove = function(key) {
  if (!window.appState.storage.isAvailable) return false;

  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.warn(`Failed to remove ${key} from localStorage:`, e.message);
    return false;
  }
};

// Get parsed JSON from storage
window.getStoredJSON = function(key, fallback = {}) {
  const stored = safeStorageGet(key);
  if (!stored) return fallback;

  try {
    return JSON.parse(stored);
  } catch (e) {
    console.warn(`Failed to parse stored JSON for ${key}:`, e);
    return fallback;
  }
};

// Store object as JSON
window.setStoredJSON = function(key, data) {
  try {
    const json = JSON.stringify(data);
    return safeStorageSet(key, json);
  } catch (e) {
    console.warn(`Failed to stringify data for ${key}:`, e);
    return false;
  }
};

// Clear all app-related storage
window.clearAppStorage = function() {
  const keys = [
    'fbEvents',
    'fbUser',
    'fbSettings',
    'fbStats',
    'fbAuthToken'
  ];

  keys.forEach(key => safeStorageRemove(key));
  console.log('App storage cleared');
};

// Export stored data (for debugging/backup)
window.exportStorageData = function() {
  if (!window.appState.storage.isAvailable) return null;

  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('fb')) {
      data[key] = safeStorageGet(key);
    }
  }
  return data;
};

// Import stored data (for restore)
window.importStorageData = function(data) {
  if (!window.appState.storage.isAvailable || typeof data !== 'object') return false;

  try {
    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith('fb')) {
        safeStorageSet(key, value);
      }
    });
    return true;
  } catch (e) {
    console.warn('Failed to import storage data:', e);
    return false;
  }
};

// Get storage usage information
window.getStorageInfo = function() {
  if (!window.appState.storage.isAvailable) {
    return { available: false };
  }

  let used = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    used += (key.length + value.length) * 2; // UTF-16 = 2 bytes per char
  }

  // Estimate quota (5MB is common)
  const quota = 5 * 1024 * 1024; // 5MB in bytes
  const usedMB = (used / (1024 * 1024)).toFixed(2);
  const percentUsed = ((used / quota) * 100).toFixed(1);

  return {
    available: true,
    used: used,
    usedMB: `${usedMB}MB`,
    percentUsed: `${percentUsed}%`,
    quota: quota
  };
};

// Compress data before storage (simple implementation)
window.compressData = function(data) {
  // For now, just stringify. Could implement actual compression later
  return JSON.stringify(data);
};

// Decompress stored data
window.decompressData = function(compressed) {
  try {
    return JSON.parse(compressed);
  } catch (e) {
    console.warn('Failed to decompress data:', e);
    return null;
  }
};

// Batch storage operations for performance
window.batchStorageOperation = function(operations) {
  if (!Array.isArray(operations)) return false;

  try {
    operations.forEach(op => {
      switch (op.type) {
        case 'set':
          safeStorageSet(op.key, op.value);
          break;
        case 'remove':
          safeStorageRemove(op.key);
          break;
        case 'setJSON':
          setStoredJSON(op.key, op.data);
          break;
      }
    });
    return true;
  } catch (e) {
    console.warn('Batch storage operation failed:', e);
    return false;
  }
};