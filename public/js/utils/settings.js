// User Settings and Preferences Utilities
export function initSettings() {
  // Initialize default settings
  window.appState.settings = getStoredJSON('fbSettings', {
    theme: 'auto', // 'light', 'dark', 'auto'
    soundEnabled: true,
    notificationsEnabled: true,
    wakeLockEnabled: true,
    defaultTimerDuration: 25, // minutes
    breathingPattern: '4-7-8', // '4-7-8', 'box', '478-alternate'
    analyticsEnabled: true,
    autoSync: true,
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  // Apply current settings
  applySettings();
}

// Get current setting value
window.getSetting = function(key, fallback = null) {
  return window.appState.settings[key] !== undefined
    ? window.appState.settings[key]
    : fallback;
};

// Update setting value
window.setSetting = function(key, value) {
  window.appState.settings[key] = value;
  saveSettings();
  applySetting(key, value);
};

// Save settings to storage
function saveSettings() {
  setStoredJSON('fbSettings', window.appState.settings);
}

// Apply a specific setting
function applySetting(key, value) {
  switch (key) {
    case 'theme':
      applyTheme(value);
      break;
    case 'soundEnabled':
      // Sound setting affects audio utilities
      break;
    case 'notificationsEnabled':
      // Notification setting affects UI utilities
      break;
    case 'wakeLockEnabled':
      // Wake lock setting affects audio utilities
      break;
    case 'language':
      applyLanguage(value);
      break;
  }
}

// Apply all current settings
function applySettings() {
  Object.entries(window.appState.settings).forEach(([key, value]) => {
    applySetting(key, value);
  });
}

// Apply theme setting
function applyTheme(theme) {
  const root = document.documentElement;

  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');

    // Listen for theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (getSetting('theme') === 'auto') {
        root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    });
  } else {
    root.setAttribute('data-theme', theme);
  }
}

// Apply language setting
function applyLanguage(lang) {
  document.documentElement.lang = lang;

  // Load language strings if available
  // For now, just set the lang attribute
  // Could be extended to load i18n strings
}

// Reset settings to defaults
window.resetSettings = function() {
  window.appState.settings = {
    theme: 'auto',
    soundEnabled: true,
    notificationsEnabled: true,
    wakeLockEnabled: true,
    defaultTimerDuration: 25,
    breathingPattern: '4-7-8',
    analyticsEnabled: true,
    autoSync: true,
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  saveSettings();
  applySettings();
  showToast('Settings reset to defaults', 'info');
};

// Export settings for backup
window.exportSettings = function() {
  return { ...window.appState.settings };
};

// Import settings from backup
window.importSettings = function(settings) {
  if (typeof settings !== 'object') return false;

  try {
    window.appState.settings = { ...window.appState.settings, ...settings };
    saveSettings();
    applySettings();
    showToast('Settings imported successfully', 'success');
    return true;
  } catch (e) {
    console.warn('Failed to import settings:', e);
    showToast('Failed to import settings', 'error');
    return false;
  }
};

// Get available theme options
window.getThemeOptions = function() {
  return [
    { value: 'auto', label: 'Auto (System)' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' }
  ];
};

// Get available breathing patterns
window.getBreathingPatterns = function() {
  return [
    { value: '4-7-8', label: '4-7-8 Breathing' },
    { value: 'box', label: 'Box Breathing' },
    { value: '478-alternate', label: '4-7-8 Alternate' }
  ];
};

// Validate setting value
window.isValidSetting = function(key, value) {
  const validators = {
    theme: (v) => ['auto', 'light', 'dark'].includes(v),
    soundEnabled: (v) => typeof v === 'boolean',
    notificationsEnabled: (v) => typeof v === 'boolean',
    wakeLockEnabled: (v) => typeof v === 'boolean',
    defaultTimerDuration: (v) => typeof v === 'number' && v >= 1 && v <= 99,
    breathingPattern: (v) => ['4-7-8', 'box', '478-alternate'].includes(v),
    analyticsEnabled: (v) => typeof v === 'boolean',
    autoSync: (v) => typeof v === 'boolean',
    language: (v) => typeof v === 'string' && v.length === 2,
    timezone: (v) => typeof v === 'string'
  };

  const validator = validators[key];
  return validator ? validator(value) : false;
};

// Get settings summary for display
window.getSettingsSummary = function() {
  const s = window.appState.settings;
  return {
    theme: s.theme,
    sound: s.soundEnabled ? 'Enabled' : 'Disabled',
    notifications: s.notificationsEnabled ? 'Enabled' : 'Disabled',
    wakeLock: s.wakeLockEnabled ? 'Enabled' : 'Disabled',
    defaultTimer: `${s.defaultTimerDuration} minutes`,
    breathingPattern: s.breathingPattern,
    analytics: s.analyticsEnabled ? 'Enabled' : 'Disabled',
    autoSync: s.autoSync ? 'Enabled' : 'Disabled',
    language: s.language.toUpperCase(),
    timezone: s.timezone
  };
};