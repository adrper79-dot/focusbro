// Settings View Component
export function renderSettingsView() {
  return `
    <div class="view settings-view">
      <div class="view-header">
        <h2>Settings</h2>
        <p class="view-subtitle">Customize your FocusBro experience</p>
      </div>

      <div class="settings-content">
        <div class="settings-section">
          <h3>Appearance</h3>
          <div class="setting-group">
            <label for="themeSelect">Theme</label>
            <select id="themeSelect">
              <option value="auto">Auto (System)</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>

        <div class="settings-section">
          <h3>Audio & Notifications</h3>
          <div class="setting-group">
            <label class="toggle-label">
              <input type="checkbox" id="soundEnabled">
              <span class="toggle-slider"></span>
              <span class="toggle-text">Sound Effects</span>
            </label>
          </div>
          <div class="setting-group">
            <label class="toggle-label">
              <input type="checkbox" id="notificationsEnabled">
              <span class="toggle-slider"></span>
              <span class="toggle-text">Notifications</span>
            </label>
          </div>
          <div class="setting-group">
            <label class="toggle-label">
              <input type="checkbox" id="wakeLockEnabled">
              <span class="toggle-slider"></span>
              <span class="toggle-text">Keep Screen Awake</span>
            </label>
          </div>
        </div>

        <div class="settings-section">
          <h3>Timer Defaults</h3>
          <div class="setting-group">
            <label for="defaultTimerDuration">Default Focus Duration (minutes)</label>
            <input type="number" id="defaultTimerDuration" min="1" max="99" value="25">
          </div>
          <div class="setting-group">
            <label for="breathingPattern">Breathing Pattern</label>
            <select id="breathingPattern">
              <option value="4-7-8">4-7-8 Breathing</option>
              <option value="box">Box Breathing</option>
              <option value="478-alternate">4-7-8 Alternate</option>
            </select>
          </div>
        </div>

        <div class="settings-section">
          <h3>Privacy & Data</h3>
          <div class="setting-group">
            <label class="toggle-label">
              <input type="checkbox" id="analyticsEnabled">
              <span class="toggle-slider"></span>
              <span class="toggle-text">Analytics & Usage Tracking</span>
            </label>
            <p class="setting-description">Help improve FocusBro by sharing anonymous usage data</p>
          </div>
          <div class="setting-group">
            <label class="toggle-label">
              <input type="checkbox" id="autoSync">
              <span class="toggle-slider"></span>
              <span class="toggle-text">Auto-sync Data</span>
            </label>
            <p class="setting-description">Automatically sync your data across devices</p>
          </div>
        </div>

        <div class="settings-section">
          <h3>Data Management</h3>
          <div class="setting-group">
            <button class="settings-btn secondary" onclick="exportData()">Export Data</button>
            <p class="setting-description">Download all your data as a backup</p>
          </div>
          <div class="setting-group">
            <button class="settings-btn secondary" onclick="importData()">Import Data</button>
            <p class="setting-description">Restore data from a backup file</p>
          </div>
          <div class="setting-group">
            <button class="settings-btn danger" onclick="clearAllData()">Clear All Data</button>
            <p class="setting-description">Permanently delete all your data (cannot be undone)</p>
          </div>
        </div>

        <div class="settings-section">
          <h3>About</h3>
          <div class="setting-group">
            <p><strong>FocusBro</strong> v1.0.0</p>
            <p>ADHD-focused wellness and productivity app</p>
            <p>Built with vanilla JavaScript for instant deployment</p>
          </div>
          <div class="setting-group">
            <button class="settings-btn secondary" onclick="showCredits()">Credits & Licenses</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Initialize settings view
export function initSettingsView() {
  // Load current settings
  loadSettingsIntoUI();

  // Set up event listeners
  setupSettingsListeners();
}

// Load settings values into UI elements
function loadSettingsIntoUI() {
  const settings = window.appState.settings;

  // Theme
  const themeSelect = document.getElementById('themeSelect');
  if (themeSelect) themeSelect.value = settings.theme;

  // Toggles
  const toggles = ['soundEnabled', 'notificationsEnabled', 'wakeLockEnabled', 'analyticsEnabled', 'autoSync'];
  toggles.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.checked = settings[id];
  });

  // Timer duration
  const durationInput = document.getElementById('defaultTimerDuration');
  if (durationInput) durationInput.value = settings.defaultTimerDuration;

  // Breathing pattern
  const patternSelect = document.getElementById('breathingPattern');
  if (patternSelect) patternSelect.value = settings.breathingPattern;
}

// Set up event listeners for settings changes
function setupSettingsListeners() {
  // Theme change
  const themeSelect = document.getElementById('themeSelect');
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      setSetting('theme', e.target.value);
      showToast('Theme updated', 'success');
    });
  }

  // Toggle changes
  const toggles = ['soundEnabled', 'notificationsEnabled', 'wakeLockEnabled', 'analyticsEnabled', 'autoSync'];
  toggles.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('change', (e) => {
        setSetting(id, e.target.checked);
        showToast(`${e.target.nextElementSibling.nextElementSibling.textContent} ${e.target.checked ? 'enabled' : 'disabled'}`, 'success');
      });
    }
  });

  // Timer duration change
  const durationInput = document.getElementById('defaultTimerDuration');
  if (durationInput) {
    durationInput.addEventListener('change', (e) => {
      const value = parseInt(e.target.value);
      if (value >= 1 && value <= 99) {
        setSetting('defaultTimerDuration', value);
        showToast(`Default timer set to ${value} minutes`, 'success');
      } else {
        e.target.value = getSetting('defaultTimerDuration');
        showToast('Duration must be between 1-99 minutes', 'error');
      }
    });
  }

  // Breathing pattern change
  const patternSelect = document.getElementById('breathingPattern');
  if (patternSelect) {
    patternSelect.addEventListener('change', (e) => {
      setSetting('breathingPattern', e.target.value);
      showToast('Breathing pattern updated', 'success');
    });
  }
}

// Export user data
function exportData() {
  try {
    const data = {
      settings: exportSettings(),
      events: getStoredJSON('fbEvents', []),
      energyData: getStoredJSON('fbEnergyData', []),
      user: getStoredJSON('fbUser', {}),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `focusbro-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    logEvent('data_export');
    showToast('Data exported successfully', 'success');
  } catch (error) {
    console.error('Export failed:', error);
    showToast('Failed to export data', 'error');
  }
}

// Import user data
function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);

        // Validate data structure
        if (!data.settings || !data.events) {
          throw new Error('Invalid backup file format');
        }

        // Import settings
        if (data.settings) {
          importSettings(data.settings);
        }

        // Import events
        if (data.events) {
          setStoredJSON('fbEvents', data.events);
        }

        // Import energy data
        if (data.energyData) {
          setStoredJSON('fbEnergyData', data.energyData);
        }

        // Import user data
        if (data.user) {
          setStoredJSON('fbUser', data.user);
        }

        // Reload settings UI
        loadSettingsIntoUI();

        logEvent('data_import');
        showToast('Data imported successfully', 'success');

        // Suggest refresh
        setTimeout(() => {
          if (confirm('Data imported. Refresh the page to apply all changes?')) {
            window.location.reload();
          }
        }, 1000);

      } catch (error) {
        console.error('Import failed:', error);
        showToast('Failed to import data: ' + error.message, 'error');
      }
    };

    reader.readAsText(file);
  };

  input.click();
}

// Clear all user data
function clearAllData() {
  const confirmed = confirm(
    'This will permanently delete ALL your data including:\n' +
    '• Focus sessions and streaks\n' +
    '• Energy tracking data\n' +
    '• Settings and preferences\n' +
    '• Analytics data\n\n' +
    'This action cannot be undone. Are you sure?'
  );

  if (!confirmed) return;

  const reallyConfirmed = confirm('Are you REALLY sure? This will delete everything.');
  if (!reallyConfirmed) return;

  try {
    // Clear all FocusBro data
    clearAppStorage();

    // Reset settings to defaults
    resetSettings();

    // Reload settings UI
    loadSettingsIntoUI();

    logEvent('data_clear');
    showToast('All data cleared', 'warning');

    // Suggest refresh
    setTimeout(() => {
      if (confirm('All data cleared. Refresh the page to start fresh?')) {
        window.location.reload();
      }
    }, 1000);

  } catch (error) {
    console.error('Clear data failed:', error);
    showToast('Failed to clear data', 'error');
  }
}

// Show credits and licenses
function showCredits() {
  const credits = `
    <div class="credits-content">
      <h3>FocusBro - ADHD Wellness App</h3>
      <p>Built with vanilla JavaScript for instant deployment and zero external dependencies.</p>

      <h4>Credits</h4>
      <ul>
        <li><strong>Icons:</strong> Heroicons, Material Design Icons</li>
        <li><strong>Fonts:</strong> System fonts for optimal performance</li>
        <li><strong>Architecture:</strong> Progressive enhancement with offline-first design</li>
      </ul>

      <h4>License</h4>
      <p>This application is provided as-is for personal use. All rights reserved.</p>

      <h4>Privacy</h4>
      <p>All data is stored locally in your browser. No data is sent to external servers unless you enable sync features.</p>
    </div>
  `;

  showModal(credits, { title: 'Credits & Information', size: 'large' });
}