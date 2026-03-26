// Tab Navigation Manager
export function initTabNavigation() {
  // Initialize tab state
  window.appState.tabs = {
    currentTab: 'dashboard',
    tabViews: {
      dashboard: ['dashboard'],
      focus: ['pomodoro', 'task-difficulty'],
      wellness: ['breathing', 'grounding', 'body-scan', 'meditation'],
      health: ['medication', 'movement'],
      energy: ['energy', 'dopamine-menu', 'fidget'],
      insights: ['analytics', 'sleep']
    },
    recentTools: []
  };

  // Load initial tab
  switchTab('dashboard');

  // Load recent tools
  loadRecentTools();
}

// Switch to a tab
export function switchTab(tabName) {
  // Update tab UI
  document.querySelectorAll('.tab-item').forEach(tab => {
    tab.classList.remove('active');
  });
  const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
  if (activeTab) {
    activeTab.classList.add('active');
  }

  // Update app state
  window.appState.tabs.currentTab = tabName;

  // Show tab content
  showTabContent(tabName);

  // Update breadcrumb
  updateBreadcrumb(tabName);

  // Log tab switch
  logEvent('tab_switched', tabName, 0, { previousTab: window.appState.tabs.previousTab });
  window.appState.tabs.previousTab = tabName;
}

// Show content for a tab
function showTabContent(tabName) {
  const tabViews = window.appState.tabs.tabViews[tabName] || [];
  const content = document.getElementById('mainContent');

  if (tabViews.length === 0) {
    content.innerHTML = '<div class="tab-placeholder">No tools available in this category yet.</div>';
    return;
  }

  // Create tab content with tool grid
  const toolsHtml = tabViews.map(viewName => {
    const toolInfo = getToolInfo(viewName);
    return `
      <div class="tool-card" onclick="switchView('${viewName}')">
        <div class="tool-icon">${toolInfo.icon}</div>
        <div class="tool-info">
          <h3 class="tool-name">${toolInfo.name}</h3>
          <p class="tool-description">${toolInfo.description}</p>
        </div>
        <div class="tool-action">
          <button class="tool-btn">Open</button>
        </div>
      </div>
    `;
  }).join('');

  const recentToolsHtml = getRecentToolsHtml();

  content.innerHTML = `
    <div class="tab-content">
      <div class="tab-header">
        <h2 class="tab-title">${getTabTitle(tabName)}</h2>
        <p class="tab-subtitle">${getTabSubtitle(tabName)}</p>
      </div>

      ${recentToolsHtml ? `<div class="recent-tools-section">
        <h3>Recent Tools</h3>
        <div class="recent-tools-grid">
          ${recentToolsHtml}
        </div>
      </div>` : ''}

      <div class="tools-section">
        <h3>All Tools</h3>
        <div class="tools-grid">
          ${toolsHtml}
        </div>
      </div>
    </div>
  `;
}

// Get tool information
function getToolInfo(viewName) {
  const tools = {
    dashboard: { name: 'Dashboard', description: 'Overview and quick actions', icon: '🏠' },
    'keep-alive': { name: 'Keep Alive', description: 'Prevent screen sleep', icon: '⚡' },
    pomodoro: { name: 'Pomodoro Timer', description: 'Focus sessions with breaks', icon: '🍅' },
    'task-difficulty': { name: 'Task Difficulty', description: 'Break down overwhelming tasks', icon: '📋' },
    breathing: { name: 'Breathing Exercises', description: 'Calm your mind and body', icon: '🫁' },
    grounding: { name: 'Grounding (5-4-3-2-1)', description: 'Connect with your senses', icon: '🌱' },
    'body-scan': { name: 'Body Scan', description: 'Progressive muscle relaxation', icon: '🧘' },
    meditation: { name: 'Meditation', description: 'Guided mindfulness sessions', icon: '🧘‍♀️' },
    medication: { name: 'Medication Tracker', description: 'Manage your medication schedule', icon: '💊' },
    movement: { name: 'Movement Breaks', description: 'Quick exercises and stretches', icon: '🏃‍♂️' },
    energy: { name: 'Mood & Energy', description: 'Track and boost your energy', icon: '⚡' },
    'dopamine-menu': { name: 'Dopamine Menu', description: 'Healthy dopamine hits', icon: '🎯' },
    fidget: { name: 'Fidget Tools', description: 'Interactive sensory tools', icon: '🌀' },
    analytics: { name: 'Analytics', description: 'Track your progress and habits', icon: '📊' },
    sleep: { name: 'Sleep Tools', description: 'Improve your sleep quality', icon: '🌙' },
    settings: { name: 'Settings', description: 'Customize your experience', icon: '⚙️' }
  };

  return tools[viewName] || { name: viewName, description: 'Tool description', icon: '🔧' };
}

// Get tab title
function getTabTitle(tabName) {
  const titles = {
    dashboard: 'Home',
    focus: 'Focus Tools',
    wellness: 'Wellness Tools',
    health: 'Health Tools',
    energy: 'Energy Tools',
    insights: 'Insights & Analytics'
  };
  return titles[tabName] || tabName;
}

// Get tab subtitle
function getTabSubtitle(tabName) {
  const subtitles = {
    dashboard: 'Your personal wellness dashboard',
    focus: 'Tools to improve concentration and productivity',
    wellness: 'Mindfulness and relaxation techniques',
    health: 'Medication and movement tracking',
    energy: 'Mood management and dopamine regulation',
    insights: 'Track progress and analyze patterns'
  };
  return subtitles[tabName] || '';
}

// Update breadcrumb navigation
function updateBreadcrumb(tabName) {
  const breadcrumbBar = document.getElementById('breadcrumbBar');
  const currentBreadcrumb = document.getElementById('currentBreadcrumb');

  if (breadcrumbBar && currentBreadcrumb) {
    currentBreadcrumb.textContent = getTabTitle(tabName);
  }
}

// Get recent tools HTML
function getRecentToolsHtml() {
  const recentTools = window.appState.tabs.recentTools.slice(0, 4);
  if (recentTools.length === 0) return '';

  return recentTools.map(toolName => {
    const toolInfo = getToolInfo(toolName);
    return `
      <div class="recent-tool-card" onclick="switchView('${toolName}')">
        <div class="tool-icon">${toolInfo.icon}</div>
        <div class="tool-name">${toolInfo.name}</div>
      </div>
    `;
  }).join('');
}

// Load recent tools from storage
function loadRecentTools() {
  const recent = getStoredJSON('fbRecentTools', []);
  window.appState.tabs.recentTools = recent;
}

// Add tool to recent tools
export function addToRecentTools(toolName) {
  const recent = window.appState.tabs.recentTools;
  const filtered = recent.filter(tool => tool !== toolName);
  filtered.unshift(toolName);
  window.appState.tabs.recentTools = filtered.slice(0, 8); // Keep last 8

  setStoredJSON('fbRecentTools', window.appState.tabs.recentTools);
}

// Global tab switching function
window.switchTab = switchTab;