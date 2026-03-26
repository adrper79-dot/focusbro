// View Manager - Handles loading and switching between views
import { addToRecentTools } from './tabManager.js';

const viewCache = new Map();

export async function loadView(viewName) {
  try {
    // Add to recent tools (except dashboard)
    if (viewName !== 'dashboard') {
      addToRecentTools(viewName);
    }

    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    const activeNav = document.querySelector(`[onclick="switchView('${viewName}')"]`);
    if (activeNav) {
      activeNav.classList.add('active');
    }

    // Update header title
    const titles = {
      'dashboard': 'FocusBro',
      'pomodoro': 'Pomodoro Timer',
      'breathing': 'Breathing Exercise',
      'grounding': 'Grounding (5-4-3-2-1)',
      'meditation': 'Meditation',
      'energy': 'Mood & Energy',
      'settings': 'Settings',
      'analytics': 'Analytics',
      'medication': 'Medication Tracker',
      'movement': 'Movement & Exercise',
      'dopamine-menu': 'Dopamine Menu',
      'body-scan': 'Body Scan',
      'fidget': 'Fidget Tools',
      'sleep': 'Sleep Tools',
      'social': 'Social Tools'
    };
    document.getElementById('viewTitle').textContent = titles[viewName] || viewName;

    // Load view content
    const content = document.getElementById('mainContent');
    content.innerHTML = '<div class="loading">Loading...</div>';

    // Check cache first
    if (viewCache.has(viewName)) {
      content.innerHTML = viewCache.get(viewName);
      initializeView(viewName);
      return;
    }

    // Load view module and render content
    try {
      const module = await import(`../components/views/${viewName}.js`);
      const renderFunction = module[`render${viewName.charAt(0).toUpperCase() + viewName.slice(1)}View`];
      if (renderFunction) {
        const viewHTML = renderFunction();
        content.innerHTML = viewHTML;
        viewCache.set(viewName, viewHTML);
        initializeView(viewName);
      } else {
        throw new Error(`Render function not found for view: ${viewName}`);
      }
    } catch (error) {
      console.error(`Failed to load view ${viewName}:`, error);
      document.getElementById('mainContent').innerHTML =
        '<div class="error">Failed to load view. Please try again.</div>';
    }

  } catch (error) {
    console.error(`Failed to load view ${viewName}:`, error);
    document.getElementById('mainContent').innerHTML =
      '<div class="error">Failed to load view. Please try again.</div>';
  }
}

function initializeView(viewName) {
  // Initialize view-specific functionality
  switch (viewName) {
    case 'dashboard':
      initDashboard();
      break;
    case 'pomodoro':
      initPomodoro();
      break;
    case 'breathing':
      initBreathing();
      break;
    case 'grounding':
      initGrounding();
      break;
    case 'meditation':
      initMeditation();
      break;
    case 'energy':
      initEnergy();
      break;
    case 'settings':
      initSettings();
      break;
    case 'analytics':
      initAnalytics();
      break;
    case 'medication':
      initMedication();
      break;
    case 'movement':
      initMovement();
      break;
    case 'dopamine-menu':
      initDopamineMenu();
      break;
    case 'body-scan':
      initBodyScan();
      break;
    case 'fidget':
      initFidget();
      break;
    case 'sleep':
      initSleep();
      break;
    case 'social':
      initSocial();
      break;
  }
}

// View initializers
function initDashboard() {
  // Import and call the dashboard initializer
  import('../components/views/dashboard.js').then(module => {
    if (module.initDashboardView) {
      module.initDashboardView();
    }
  });
}

function initPomodoro() {
  import('../components/views/pomodoro.js').then(module => {
    if (module.initPomodoroView) {
      module.initPomodoroView();
    }
  });
}

function initBreathing() {
  import('../components/views/breathing.js').then(module => {
    if (module.initBreathingView) {
      module.initBreathingView();
    }
  });
}

function initGrounding() {
  import('../components/views/grounding.js').then(module => {
    if (module.initGroundingView) {
      module.initGroundingView();
    }
  });
}

function initMeditation() {
  import('../components/views/meditation.js').then(module => {
    if (module.initMeditationView) {
      module.initMeditationView();
    }
  });
}

function initEnergy() {
  import('../components/views/energy.js').then(module => {
    if (module.initEnergyView) {
      module.initEnergyView();
    }
  });
}

function initSettings() {
  import('../components/views/settings.js').then(module => {
    if (module.initSettingsView) {
      module.initSettingsView();
    }
  });
}

function initAnalytics() {
  import('../components/views/analytics.js').then(module => {
    if (module.initAnalyticsView) {
      module.initAnalyticsView();
    }
  });
}

function initMedication() {
  import('../components/views/medication.js').then(module => {
    if (module.initMedicationView) {
      module.initMedicationView();
    }
  });
}

function initMovement() {
  import('../components/views/movement.js').then(module => {
    if (module.initMovementView) {
      module.initMovementView();
    }
  });
}

function initDopamineMenu() {
  import('../components/views/dopamine-menu.js').then(module => {
    if (module.initDopamineMenuView) {
      module.initDopamineMenuView();
    }
  });
}

function initBodyScan() {
  import('../components/views/body-scan.js').then(module => {
    if (module.initBodyScanView) {
      module.initBodyScanView();
    }
  });
}

function initFidget() {
  import('../components/views/fidget.js').then(module => {
    if (module.initFidgetView) {
      module.initFidgetView();
    }
  });
}

function initSleep() {
  import('../components/views/sleep.js').then(module => {
    if (module.initSleepView) {
      module.initSleepView();
    }
  });
}

function initSocial() {
  import('../components/views/social.js').then(module => {
    if (module.initSocialView) {
      module.initSocialView();
    }
  });
}

// Global switchView function for navigation
window.switchView = loadView;