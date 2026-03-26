// FocusBro - Main Application Module
import { initNavigation } from './utils/navigation.js';
import { initAuth } from './utils/auth.js';
import { initAnalytics } from './utils/analytics.js';
import { initUI } from './utils/ui.js';
import { loadView } from './utils/viewManager.js';
import { initTabNavigation, addToRecentTools } from './utils/tabManager.js';

// Import view components
import { renderDashboardView, initDashboardView } from '../components/views/dashboard.js';
import { renderPomodoroView, initPomodoroView } from '../components/views/pomodoro.js';
import { renderBreathingView, initBreathingView } from '../components/views/breathing.js';
import { renderGroundingView, initGroundingView } from '../components/views/grounding.js';
import { renderMeditationView, initMeditationView } from '../components/views/meditation.js';
import { renderEnergyView, initEnergyView } from '../components/views/energy.js';
import { renderSettingsView, initSettingsView } from '../components/views/settings.js';
import { renderAnalyticsView, initAnalyticsView } from '../components/views/analytics.js';
import { renderMedicationView, initMedicationView } from '../components/views/medication.js';
import { renderMovementView, initMovementView } from '../components/views/movement.js';
import { renderDopamineMenuView, initDopamineMenuView } from '../components/views/dopamine-menu.js';
import { renderBodyScanView, initBodyScanView } from '../components/views/body-scan.js';
import { renderFidgetView, initFidgetView } from '../components/views/fidget.js';
import { renderSleepView, initSleepView } from '../components/views/sleep.js';
import { renderSocialView, initSocialView } from '../components/views/social.js';

// Global state
window.appState = {
  user: null,
  currentView: 'dashboard',
  eventQueue: [],
  isProcessingQueue: false,
  fbEvents: [],
  sessionCount: 0,
  energyLogs: [],
  pomodoroTimer: null,
  medInterval: null,
  medDisplayInterval: null,
  syncInterval: null,
  keepAliveRunning: false,
  keepAliveInterval: null,
  loadingStates: new Map()
};

// Initialize the application
async function initApp() {
  console.log('🚀 Initializing FocusBro...');

  // Initialize core utilities
  initNavigation();
  initAuth();
  initAnalytics();
  initUI();
  initTabNavigation();

  // Load initial view
  await loadView('dashboard');

  // Initialize user state
  const token = localStorage.getItem('fbToken');
  if (token) {
    try {
      const userData = JSON.parse(localStorage.getItem('fbUser') || '{}');
      window.appState.user = userData;
      updateAuthUI();
    } catch (e) {
      console.warn('Invalid stored user data');
    }
  }

  console.log('✅ FocusBro initialized');
}

// Utility functions
window.showToast = function(message, type = 'info') {
  // Implementation will be in ui.js
};

window.updateAuthUI = function() {
  // Implementation will be in auth.js
};

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}