// Dopamine Menu View Component
export function renderDopamineMenuView() {
  return `
    <div class="view dopamine-menu-view">
      <div class="view-header">
        <h2>Dopamine Menu</h2>
        <p class="view-subtitle">Quick dopamine hits to reset and recharge</p>
      </div>

      <div class="dopamine-content">
        <div class="dopamine-categories">
          <div class="category-tabs">
            <button class="category-tab active" onclick="switchDopamineCategory('quick-hits')">
              ⚡ Quick Hits
            </button>
            <button class="category-tab" onclick="switchDopamineCategory('sensory')">
              👁️ Sensory
            </button>
            <button class="category-tab" onclick="switchDopamineCategory('social')">
              👥 Social
            </button>
            <button class="category-tab" onclick="switchDopamineCategory('achievement')">
              🏆 Achievement
            </button>
            <button class="category-tab" onclick="switchDopamineCategory('novelty')">
              ✨ Novelty
            </button>
          </div>
        </div>

        <div class="dopamine-grid" id="dopamineGrid">
          <!-- Dopamine activities will be populated here -->
        </div>

        <div class="dopamine-timer" id="dopamineTimer" style="display: none;">
          <div class="timer-display">
            <div class="timer-icon">⏱️</div>
            <div class="timer-text" id="timerText">00:00</div>
            <div class="timer-label" id="timerLabel">Time remaining</div>
          </div>
          <div class="timer-controls">
            <button class="timer-btn" onclick="pauseDopamineTimer()">Pause</button>
            <button class="timer-btn stop" onclick="stopDopamineTimer()">Stop</button>
          </div>
        </div>

        <div class="dopamine-stats">
          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-content">
              <div class="stat-value" id="todayHits">0</div>
              <div class="stat-label">Hits Today</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">🔥</div>
            <div class="stat-content">
              <div class="stat-value" id="streakHits">0</div>
              <div class="stat-label">Day Streak</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-content">
              <div class="stat-value" id="favoriteHit">None</div>
              <div class="stat-label">Favorite</div>
            </div>
          </div>
        </div>

        <div class="dopamine-history">
          <h3>Recent Hits</h3>
          <div class="history-list" id="dopamineHistory">
            <!-- Recent dopamine hits will be populated here -->
          </div>
        </div>
      </div>
    </div>
  `;
}

// Initialize dopamine menu view
export function initDopamineMenuView() {
  // Load dopamine data
  loadDopamineData();

  // Start with quick hits category
  switchDopamineCategory('quick-hits');

  // Set up periodic refresh
  window.dopamineRefreshInterval = setInterval(() => {
    if (document.querySelector('.dopamine-menu-view')) {
      loadDopamineData();
    }
  }, 30000); // Refresh every 30 seconds
}

// Switch dopamine category
function switchDopamineCategory(category) {
  // Update tab styling
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  event.target.classList.add('active');

  // Load category activities
  loadDopamineCategory(category);
}

// Load dopamine activities for category
function loadDopamineCategory(category) {
  const categories = {
    'quick-hits': [
      {
        id: 'deep-breath',
        name: 'Deep Breath',
        description: 'Take 5 slow, deep breaths',
        icon: '🫁',
        duration: 60,
        category: 'quick-hits'
      },
      {
        id: 'cold-water',
        name: 'Cold Water Splash',
        description: 'Splash cold water on your face',
        icon: '💧',
        duration: 30,
        category: 'quick-hits'
      },
      {
        id: 'push-ups',
        name: '5 Push-ups',
        description: 'Quick burst of physical activity',
        icon: '💪',
        duration: 60,
        category: 'quick-hits'
      },
      {
        id: 'gratitude',
        name: 'Gratitude Moment',
        description: 'Name 3 things you\'re grateful for',
        icon: '🙏',
        duration: 90,
        category: 'quick-hits'
      },
      {
        id: 'progress-review',
        name: 'Progress Review',
        description: 'Review what you\'ve accomplished today',
        icon: '📈',
        duration: 120,
        category: 'quick-hits'
      },
      {
        id: 'favorite-song',
        name: 'Favorite Song',
        description: 'Listen to your favorite uplifting song',
        icon: '🎵',
        duration: 180,
        category: 'quick-hits'
      }
    ],
    'sensory': [
      {
        id: 'bright-colors',
        name: 'Bright Colors',
        description: 'Look at something brightly colored',
        icon: '🌈',
        duration: 30,
        category: 'sensory'
      },
      {
        id: 'strong-scent',
        name: 'Strong Scent',
        description: 'Smell something with a strong, pleasant scent',
        icon: '🌸',
        duration: 45,
        category: 'sensory'
      },
      {
        id: 'texture-touch',
        name: 'Texture Touch',
        description: 'Feel different textures with your hands',
        icon: '✋',
        duration: 60,
        category: 'sensory'
      },
      {
        id: 'loud-sound',
        name: 'Loud Sound',
        description: 'Listen to a loud, stimulating sound',
        icon: '🔊',
        duration: 30,
        category: 'sensory'
      },
      {
        id: 'cold-touch',
        name: 'Cold Touch',
        description: 'Touch something pleasantly cold',
        icon: '🧊',
        duration: 45,
        category: 'sensory'
      },
      {
        id: 'visual-stimulation',
        name: 'Visual Stimulation',
        description: 'Look at something visually interesting',
        icon: '👁️',
        duration: 90,
        category: 'sensory'
      }
    ],
    'social': [
      {
        id: 'text-friend',
        name: 'Text a Friend',
        description: 'Send a positive message to someone',
        icon: '💬',
        duration: 120,
        category: 'social'
      },
      {
        id: 'social-media',
        name: 'Social Media Check',
        description: 'Check positive social media interactions',
        icon: '📱',
        duration: 180,
        category: 'social'
      },
      {
        id: 'compliment',
        name: 'Give Compliment',
        description: 'Give someone a genuine compliment',
        icon: '😊',
        duration: 60,
        category: 'social'
      },
      {
        id: 'call-loved-one',
        name: 'Call Loved One',
        description: 'Have a positive conversation with someone you care about',
        icon: '📞',
        duration: 300,
        category: 'social'
      },
      {
        id: 'help-someone',
        name: 'Help Someone',
        description: 'Do something helpful for another person',
        icon: '🤝',
        duration: 240,
        category: 'social'
      },
      {
        id: 'express-appreciation',
        name: 'Express Appreciation',
        description: 'Tell someone why you appreciate them',
        icon: '❤️',
        duration: 90,
        category: 'social'
      }
    ],
    'achievement': [
      {
        id: 'complete-task',
        name: 'Complete Small Task',
        description: 'Finish one small, achievable task',
        icon: '✅',
        duration: 300,
        category: 'achievement'
      },
      {
        id: 'learn-something',
        name: 'Learn Something New',
        description: 'Discover and absorb one new piece of information',
        icon: '📚',
        duration: 180,
        category: 'achievement'
      },
      {
        id: 'skill-practice',
        name: 'Practice a Skill',
        description: 'Spend time improving a skill you enjoy',
        icon: '🎨',
        duration: 600,
        category: 'achievement'
      },
      {
        id: 'organize-space',
        name: 'Organize Something',
        description: 'Tidy up a small area or organize your thoughts',
        icon: '🗂️',
        duration: 240,
        category: 'achievement'
      },
      {
        id: 'solve-problem',
        name: 'Solve a Problem',
        description: 'Figure out a solution to a small challenge',
        icon: '🧩',
        duration: 360,
        category: 'achievement'
      },
      {
        id: 'create-something',
        name: 'Create Something',
        description: 'Make something new, however small',
        icon: '🎭',
        duration: 480,
        category: 'achievement'
      }
    ],
    'novelty': [
      {
        id: 'new-route',
        name: 'New Route',
        description: 'Take a different path to somewhere familiar',
        icon: '🗺️',
        duration: 300,
        category: 'novelty'
      },
      {
        id: 'try-food',
        name: 'Try New Food',
        description: 'Eat something you\'ve never tried before',
        icon: '🍽️',
        duration: 60,
        category: 'novelty'
      },
      {
        id: 'change-routine',
        name: 'Change Routine',
        description: 'Do a daily task in a completely different way',
        icon: '🔄',
        duration: 180,
        category: 'novelty'
      },
      {
        id: 'explore-online',
        name: 'Online Exploration',
        description: 'Discover something new on the internet',
        icon: '🌐',
        duration: 240,
        category: 'novelty'
      },
      {
        id: 'new-experience',
        name: 'New Experience',
        description: 'Try an activity you\'ve never done before',
        icon: '🎪',
        duration: 420,
        category: 'novelty'
      },
      {
        id: 'change-environment',
        name: 'Change Environment',
        description: 'Move to a different location to work or relax',
        icon: '🏠',
        duration: 120,
        category: 'novelty'
      }
    ]
  };

  const activities = categories[category] || [];
  renderDopamineGrid(activities);
}

// Render dopamine activities grid
function renderDopamineGrid(activities) {
  const grid = document.getElementById('dopamineGrid');
  if (!grid) return;

  grid.innerHTML = activities.map(activity => `
    <div class="dopamine-card" onclick="startDopamineActivity('${activity.id}')">
      <div class="dopamine-icon">${activity.icon}</div>
      <div class="dopamine-info">
        <h4 class="dopamine-name">${activity.name}</h4>
        <p class="dopamine-description">${activity.description}</p>
        <div class="dopamine-meta">${Math.ceil(activity.duration / 60)} min</div>
      </div>
      <div class="dopamine-action">
        <button class="dopamine-btn">Start</button>
      </div>
    </div>
  `).join('');
}

// Start dopamine activity
function startDopamineActivity(activityId) {
  // Find activity data
  const allActivities = getAllDopamineActivities();
  const activity = allActivities.find(a => a.id === activityId);

  if (!activity) return;

  // Start timer
  startDopamineTimer(activity);

  // Log the start
  logEvent('dopamine_hit_started', activityId, activity.duration);

  showToast(`Starting: ${activity.name}`, 'info');
}

// Get all dopamine activities
function getAllDopamineActivities() {
  const categories = ['quick-hits', 'sensory', 'social', 'achievement', 'novelty'];
  const allActivities = [];

  categories.forEach(category => {
    const activities = getDopamineActivitiesForCategory(category);
    allActivities.push(...activities);
  });

  return allActivities;
}

// Get activities for a specific category
function getDopamineActivitiesForCategory(category) {
  // This mirrors the data from loadDopamineCategory
  const categoryData = {
    'quick-hits': [
      { id: 'deep-breath', name: 'Deep Breath', duration: 60, category: 'quick-hits' },
      { id: 'cold-water', name: 'Cold Water Splash', duration: 30, category: 'quick-hits' },
      { id: 'push-ups', name: '5 Push-ups', duration: 60, category: 'quick-hits' },
      { id: 'gratitude', name: 'Gratitude Moment', duration: 90, category: 'quick-hits' },
      { id: 'progress-review', name: 'Progress Review', duration: 120, category: 'quick-hits' },
      { id: 'favorite-song', name: 'Favorite Song', duration: 180, category: 'quick-hits' }
    ],
    'sensory': [
      { id: 'bright-colors', name: 'Bright Colors', duration: 30, category: 'sensory' },
      { id: 'strong-scent', name: 'Strong Scent', duration: 45, category: 'sensory' },
      { id: 'texture-touch', name: 'Texture Touch', duration: 60, category: 'sensory' },
      { id: 'loud-sound', name: 'Loud Sound', duration: 30, category: 'sensory' },
      { id: 'cold-touch', name: 'Cold Touch', duration: 45, category: 'sensory' },
      { id: 'visual-stimulation', name: 'Visual Stimulation', duration: 90, category: 'sensory' }
    ],
    'social': [
      { id: 'text-friend', name: 'Text a Friend', duration: 120, category: 'social' },
      { id: 'social-media', name: 'Social Media Check', duration: 180, category: 'social' },
      { id: 'compliment', name: 'Give Compliment', duration: 60, category: 'social' },
      { id: 'call-loved-one', name: 'Call Loved One', duration: 300, category: 'social' },
      { id: 'help-someone', name: 'Help Someone', duration: 240, category: 'social' },
      { id: 'express-appreciation', name: 'Express Appreciation', duration: 90, category: 'social' }
    ],
    'achievement': [
      { id: 'complete-task', name: 'Complete Small Task', duration: 300, category: 'achievement' },
      { id: 'learn-something', name: 'Learn Something New', duration: 180, category: 'achievement' },
      { id: 'skill-practice', name: 'Practice a Skill', duration: 600, category: 'achievement' },
      { id: 'organize-space', name: 'Organize Something', duration: 240, category: 'achievement' },
      { id: 'solve-problem', name: 'Solve a Problem', duration: 360, category: 'achievement' },
      { id: 'create-something', name: 'Create Something', duration: 480, category: 'achievement' }
    ],
    'novelty': [
      { id: 'new-route', name: 'New Route', duration: 300, category: 'novelty' },
      { id: 'try-food', name: 'Try New Food', duration: 60, category: 'novelty' },
      { id: 'change-routine', name: 'Change Routine', duration: 180, category: 'novelty' },
      { id: 'explore-online', name: 'Online Exploration', duration: 240, category: 'novelty' },
      { id: 'new-experience', name: 'New Experience', duration: 420, category: 'novelty' },
      { id: 'change-environment', name: 'Change Environment', duration: 120, category: 'novelty' }
    ]
  };

  return categoryData[category] || [];
}

// Start dopamine timer
function startDopamineTimer(activity) {
  const timerElement = document.getElementById('dopamineTimer');
  const timerText = document.getElementById('timerText');
  const timerLabel = document.getElementById('timerLabel');

  if (!timerElement || !timerText || !timerLabel) return;

  // Show timer
  timerElement.style.display = 'block';

  // Set initial state
  window.dopamineTimerState = {
    activity,
    remaining: activity.duration,
    isPaused: false,
    intervalId: null
  };

  // Update display
  updateDopamineTimerDisplay();

  // Start countdown
  window.dopamineTimerState.intervalId = setInterval(() => {
    if (!window.dopamineTimerState.isPaused) {
      window.dopamineTimerState.remaining--;

      if (window.dopamineTimerState.remaining <= 0) {
        completeDopamineActivity();
        return;
      }

      updateDopamineTimerDisplay();
    }
  }, 1000);
}

// Update dopamine timer display
function updateDopamineTimerDisplay() {
  const state = window.dopamineTimerState;
  if (!state) return;

  const timerText = document.getElementById('timerText');
  const timerLabel = document.getElementById('timerLabel');

  if (timerText) {
    timerText.textContent = formatTime(state.remaining);
  }

  if (timerLabel) {
    timerLabel.textContent = state.isPaused ? 'Paused' : 'Time remaining';
  }
}

// Pause dopamine timer
function pauseDopamineTimer() {
  if (!window.dopamineTimerState) return;

  window.dopamineTimerState.isPaused = !window.dopamineTimerState.isPaused;

  const pauseBtn = document.querySelector('.timer-controls .timer-btn:first-child');
  if (pauseBtn) {
    pauseBtn.textContent = window.dopamineTimerState.isPaused ? 'Resume' : 'Pause';
  }

  updateDopamineTimerDisplay();
}

// Stop dopamine timer
function stopDopamineTimer() {
  if (!window.dopamineTimerState) return;

  clearInterval(window.dopamineTimerState.intervalId);

  const timerElement = document.getElementById('dopamineTimer');
  if (timerElement) {
    timerElement.style.display = 'none';
  }

  window.dopamineTimerState = null;

  showToast('Dopamine hit stopped', 'info');
}

// Complete dopamine activity
function completeDopamineActivity() {
  const state = window.dopamineTimerState;
  if (!state) return;

  clearInterval(state.intervalId);

  // Hide timer
  const timerElement = document.getElementById('dopamineTimer');
  if (timerElement) {
    timerElement.style.display = 'none';
  }

  // Log completion
  logEvent('dopamine_hit_completed', state.activity.id, state.activity.duration);

  // Save to history
  saveDopamineHit(state.activity);

  // Update stats
  loadDopamineData();

  showToast(`Dopamine hit completed: ${state.activity.name}! 🎉`, 'success');

  window.dopamineTimerState = null;
}

// Save dopamine hit to history
function saveDopamineHit(activity) {
  const dopamineData = getStoredJSON('fbDopamineData', {});
  const today = new Date().toISOString().slice(0, 10);

  if (!dopamineData[today]) {
    dopamineData[today] = { hits: [], count: 0 };
  }

  const hit = {
    id: activity.id,
    name: activity.name,
    category: activity.category,
    duration: activity.duration,
    completed: new Date().toISOString()
  };

  dopamineData[today].hits.push(hit);
  dopamineData[today].count++;

  setStoredJSON('fbDopamineData', dopamineData);
}

// Load dopamine data and update UI
function loadDopamineData() {
  const dopamineData = getStoredJSON('fbDopamineData', {});
  const today = new Date().toISOString().slice(0, 10);

  const todayData = dopamineData[today] || { hits: [], count: 0 };

  // Update stats
  document.getElementById('todayHits').textContent = todayData.count;

  // Calculate streak
  const streak = calculateDopamineStreak(dopamineData);
  document.getElementById('streakHits').textContent = streak;

  // Find favorite activity
  const favorite = findFavoriteDopamineActivity(dopamineData);
  document.getElementById('favoriteHit').textContent = favorite || 'None';

  // Update history
  updateDopamineHistory(todayData.hits);
}

// Calculate dopamine hit streak
function calculateDopamineStreak(data) {
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 30; i++) { // Check last 30 days
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toISOString().slice(0, 10);

    if (data[dateStr] && data[dateStr].count > 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// Find favorite dopamine activity
function findFavoriteDopamineActivity(data) {
  const activityCounts = {};

  // Count all activities across all days
  Object.values(data).forEach(dayData => {
    if (dayData.hits) {
      dayData.hits.forEach(hit => {
        activityCounts[hit.name] = (activityCounts[hit.name] || 0) + 1;
      });
    }
  });

  // Find most frequent
  let favorite = null;
  let maxCount = 0;

  Object.entries(activityCounts).forEach(([name, count]) => {
    if (count > maxCount) {
      maxCount = count;
      favorite = name;
    }
  });

  return favorite;
}

// Update dopamine history display
function updateDopamineHistory(hits) {
  const container = document.getElementById('dopamineHistory');
  if (!container) return;

  if (!hits || hits.length === 0) {
    container.innerHTML = '<p class="no-history">No dopamine hits today. Try one!</p>';
    return;
  }

  // Sort by completion time (most recent first)
  const sortedHits = hits.sort((a, b) =>
    new Date(b.completed) - new Date(a.completed)
  );

  container.innerHTML = sortedHits.slice(0, 5).map(hit => {
    const time = new Date(hit.completed).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
      <div class="history-entry">
        <div class="history-icon">${getDopamineIcon(hit.id)}</div>
        <div class="history-info">
          <div class="history-name">${hit.name}</div>
          <div class="history-time">${time}</div>
        </div>
      </div>
    `;
  }).join('');
}

// Get icon for dopamine activity
function getDopamineIcon(activityId) {
  const iconMap = {
    'deep-breath': '🫁',
    'cold-water': '💧',
    'push-ups': '💪',
    'gratitude': '🙏',
    'progress-review': '📈',
    'favorite-song': '🎵',
    'bright-colors': '🌈',
    'strong-scent': '🌸',
    'texture-touch': '✋',
    'loud-sound': '🔊',
    'cold-touch': '🧊',
    'visual-stimulation': '👁️',
    'text-friend': '💬',
    'social-media': '📱',
    'compliment': '😊',
    'call-loved-one': '📞',
    'help-someone': '🤝',
    'express-appreciation': '❤️',
    'complete-task': '✅',
    'learn-something': '📚',
    'skill-practice': '🎨',
    'organize-space': '🗂️',
    'solve-problem': '🧩',
    'create-something': '🎭',
    'new-route': '🗺️',
    'try-food': '🍽️',
    'change-routine': '🔄',
    'explore-online': '🌐',
    'new-experience': '🎪',
    'change-environment': '🏠'
  };

  return iconMap[activityId] || '⚡';
}