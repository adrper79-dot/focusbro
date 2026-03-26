// Energy Management View Component
export function renderEnergyView() {
  return `
    <div class="view energy-view">
      <div class="view-header">
        <h2>Energy Management</h2>
        <p class="view-subtitle">Track and optimize your daily energy patterns</p>
      </div>

      <div class="energy-content">
        <div class="energy-tracker">
          <div class="current-energy">
            <h3>Current Energy Level</h3>
            <div class="energy-gauge">
              <div class="energy-fill" id="energyFill" style="width: 70%"></div>
              <div class="energy-marker" id="energyMarker"></div>
            </div>
            <div class="energy-labels">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
            <input type="range" id="energySlider" min="1" max="10" value="7" class="energy-slider">
          </div>

          <div class="energy-log">
            <h3>Energy Log</h3>
            <div class="log-entries" id="energyLog">
              <!-- Energy entries will be populated here -->
            </div>
            <button class="log-energy-btn" onclick="logCurrentEnergy()">Log Current Energy</button>
          </div>
        </div>

        <div class="energy-insights">
          <div class="insight-card">
            <h3>Daily Patterns</h3>
            <div class="pattern-chart" id="dailyPatternChart">
              <div class="chart-placeholder">
                <p>Track your energy for a few days to see patterns</p>
              </div>
            </div>
          </div>

          <div class="insight-card">
            <h3>Peak Hours</h3>
            <div class="peak-hours" id="peakHours">
              <div class="peak-hour">
                <span class="time">9:00 AM - 11:00 AM</span>
                <span class="level">High Energy</span>
              </div>
              <div class="peak-hour">
                <span class="time">2:00 PM - 4:00 PM</span>
                <span class="level">Medium Energy</span>
              </div>
            </div>
          </div>

          <div class="insight-card">
            <h3>Recommendations</h3>
            <div class="recommendations" id="energyRecommendations">
              <div class="recommendation">
                <span class="rec-icon">☕</span>
                <span class="rec-text">Consider a short walk to boost energy</span>
              </div>
              <div class="recommendation">
                <span class="rec-icon">💧</span>
                <span class="rec-text">Stay hydrated for better focus</span>
              </div>
              <div class="recommendation">
                <span class="rec-icon">🌞</span>
                <span class="rec-text">Try some natural light exposure</span>
              </div>
            </div>
          </div>
        </div>

        <div class="energy-tools">
          <div class="tool-card">
            <h3>Quick Energy Boost</h3>
            <div class="boost-options">
              <button class="boost-btn" onclick="quickBoost('stretch')">
                <span class="boost-icon">🧘</span>
                <span>Quick Stretch</span>
              </button>
              <button class="boost-btn" onclick="quickBoost('breathe')">
                <span class="boost-icon">🫁</span>
                <span>Deep Breathing</span>
              </button>
              <button class="boost-btn" onclick="quickBoost('hydrate')">
                <span class="boost-icon">💧</span>
                <span>Drink Water</span>
              </button>
              <button class="boost-btn" onclick="quickBoost('move')">
                <span class="boost-icon">🚶</span>
                <span>Take a Walk</span>
              </button>
            </div>
          </div>

          <div class="tool-card">
            <h3>Energy Drainers</h3>
            <div class="drainer-tracker">
              <div class="drainer-item">
                <label>
                  <input type="checkbox" id="drainer1">
                  <span>Skipped breakfast</span>
                </label>
              </div>
              <div class="drainer-item">
                <label>
                  <input type="checkbox" id="drainer2">
                  <span>Poor sleep quality</span>
                </label>
              </div>
              <div class="drainer-item">
                <label>
                  <input type="checkbox" id="drainer3">
                  <span>Too much screen time</span>
                </label>
              </div>
              <div class="drainer-item">
                <label>
                  <input type="checkbox" id="drainer4">
                  <span>Dehydration</span>
                </label>
              </div>
              <div class="drainer-item">
                <label>
                  <input type="checkbox" id="drainer5">
                  <span>Stress/anxiety</span>
                </label>
              </div>
            </div>
            <button class="analyze-drainers-btn" onclick="analyzeDrainers()">Analyze Impact</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Initialize energy view
export function initEnergyView() {
  // Load existing energy data
  loadEnergyData();

  // Set up energy slider
  const slider = document.getElementById('energySlider');
  if (slider) {
    slider.addEventListener('input', updateEnergyGauge);
    updateEnergyGauge(); // Initial update
  }

  // Load energy log
  displayEnergyLog();
}

// Update energy gauge based on slider
function updateEnergyGauge() {
  const slider = document.getElementById('energySlider');
  const fill = document.getElementById('energyFill');
  const marker = document.getElementById('energyMarker');

  if (!slider || !fill || !marker) return;

  const value = parseInt(slider.value);
  const percentage = ((value - 1) / 9) * 100; // 1-10 scale to 0-100%

  fill.style.width = `${percentage}%`;
  marker.style.left = `${percentage}%`;

  // Update marker color based on energy level
  if (value <= 3) {
    marker.style.backgroundColor = 'var(--energy-low)';
  } else if (value <= 7) {
    marker.style.backgroundColor = 'var(--energy-medium)';
  } else {
    marker.style.backgroundColor = 'var(--energy-high)';
  }
}

// Log current energy level
function logCurrentEnergy() {
  const slider = document.getElementById('energySlider');
  if (!slider) return;

  const energyLevel = parseInt(slider.value);
  const timestamp = new Date().toISOString();

  const entry = {
    id: crypto.randomUUID(),
    level: energyLevel,
    timestamp,
    context: getCurrentContext()
  };

  // Save to storage
  const energyData = getStoredJSON('fbEnergyData', []);
  energyData.push(entry);
  setStoredJSON('fbEnergyData', energyData);

  // Update display
  displayEnergyLog();

  // Log event
  logEvent('energy_log', 'manual', 0, { level: energyLevel });

  showToast(`Energy level ${energyLevel}/10 logged`, 'success');
}

// Get current context (time of day, etc.)
function getCurrentContext() {
  const hour = new Date().getHours();
  if (hour < 6) return 'early-morning';
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 21) return 'evening';
  return 'night';
}

// Display energy log
function displayEnergyLog() {
  const logContainer = document.getElementById('energyLog');
  if (!logContainer) return;

  const energyData = getStoredJSON('fbEnergyData', []);
  const recentEntries = energyData.slice(-10).reverse(); // Last 10 entries

  if (recentEntries.length === 0) {
    logContainer.innerHTML = '<p class="no-entries">No energy logs yet. Start tracking!</p>';
    return;
  }

  logContainer.innerHTML = recentEntries.map(entry => {
    const date = new Date(entry.timestamp);
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = date.toLocaleDateString();

    return `
      <div class="log-entry">
        <div class="log-time">${timeString}</div>
        <div class="log-date">${dateString}</div>
        <div class="log-level">
          <div class="energy-dot" style="background-color: ${getEnergyColor(entry.level)}"></div>
          <span>${entry.level}/10</span>
        </div>
      </div>
    `;
  }).join('');
}

// Get color for energy level
function getEnergyColor(level) {
  if (level <= 3) return 'var(--energy-low)';
  if (level <= 7) return 'var(--energy-medium)';
  return 'var(--energy-high)';
}

// Quick energy boost actions
function quickBoost(type) {
  const boosts = {
    stretch: {
      message: 'Time for a quick stretch! Reach for the sky and twist gently.',
      duration: 60
    },
    breathe: {
      message: 'Take 5 deep breaths. Inhale for 4 counts, exhale for 6.',
      duration: 30
    },
    hydrate: {
      message: 'Drink a glass of water. Hydration boosts energy!',
      duration: 0
    },
    move: {
      message: 'Stand up and take a 2-minute walk around your space.',
      duration: 120
    }
  };

  const boost = boosts[type];
  if (!boost) return;

  showToast(boost.message, 'info');

  if (boost.duration > 0) {
    // Start a timer for the boost activity
    startTimer(boost.duration, (remaining) => {
      if (remaining === 0) {
        showToast('Boost complete! How do you feel?', 'success');
        logEvent('energy_boost', type, boost.duration);
      }
    });
  } else {
    logEvent('energy_boost', type, 0);
  }
}

// Analyze energy drainers
function analyzeDrainers() {
  const drainers = [];
  for (let i = 1; i <= 5; i++) {
    const checkbox = document.getElementById(`drainer${i}`);
    if (checkbox && checkbox.checked) {
      drainers.push(checkbox.nextElementSibling.textContent);
    }
  }

  if (drainers.length === 0) {
    showToast('No energy drainers selected', 'info');
    return;
  }

  // Generate recommendations based on selected drainers
  const recommendations = generateRecommendations(drainers);

  // Update recommendations display
  const recContainer = document.getElementById('energyRecommendations');
  if (recContainer) {
    recContainer.innerHTML = recommendations.map(rec => `
      <div class="recommendation">
        <span class="rec-icon">${rec.icon}</span>
        <span class="rec-text">${rec.text}</span>
      </div>
    `).join('');
  }

  logEvent('energy_analysis', 'drainers', 0, { drainers, recommendations: recommendations.length });
  showToast('Analysis complete! Check recommendations above.', 'success');
}

// Generate personalized recommendations
function generateRecommendations(drainers) {
  const recommendations = [];

  if (drainers.includes('Skipped breakfast')) {
    recommendations.push({
      icon: '🥐',
      text: 'Try a protein-rich breakfast to stabilize energy'
    });
  }

  if (drainers.includes('Poor sleep quality')) {
    recommendations.push({
      icon: '😴',
      text: 'Establish a consistent bedtime routine'
    });
  }

  if (drainers.includes('Too much screen time')) {
    recommendations.push({
      icon: '📱',
      text: 'Take regular screen breaks using the 20-20-20 rule'
    });
  }

  if (drainers.includes('Dehydration')) {
    recommendations.push({
      icon: '💧',
      text: 'Keep water nearby and set hydration reminders'
    });
  }

  if (drainers.includes('Stress/anxiety')) {
    recommendations.push({
      icon: '🧘',
      text: 'Practice the 4-7-8 breathing technique daily'
    });
  }

  // Add general recommendations if we have few specific ones
  if (recommendations.length < 3) {
    const generalRecs = [
      { icon: '🏃', text: 'Incorporate short movement breaks throughout your day' },
      { icon: '🌱', text: 'Consider your caffeine and sugar intake patterns' },
      { icon: '📊', text: 'Track your energy patterns for a week to identify trends' }
    ];

    recommendations.push(...generalRecs.slice(0, 3 - recommendations.length));
  }

  return recommendations;
}

// Load and process energy data for insights
function loadEnergyData() {
  const energyData = getStoredJSON('fbEnergyData', []);

  if (energyData.length > 0) {
    // Calculate average energy by time of day
    const timeAverages = calculateTimeAverages(energyData);
    updatePeakHours(timeAverages);

    // Generate pattern insights
    generatePatternInsights(energyData);
  }
}

// Calculate average energy by time period
function calculateTimeAverages(data) {
  const periods = {
    morning: { start: 6, end: 12, entries: [], avg: 0 },
    afternoon: { start: 12, end: 17, entries: [], avg: 0 },
    evening: { start: 17, end: 21, entries: [], avg: 0 }
  };

  data.forEach(entry => {
    const hour = new Date(entry.timestamp).getHours();
    for (const [period, config] of Object.entries(periods)) {
      if (hour >= config.start && hour < config.end) {
        config.entries.push(entry.level);
        break;
      }
    }
  });

  // Calculate averages
  Object.values(periods).forEach(config => {
    if (config.entries.length > 0) {
      config.avg = config.entries.reduce((a, b) => a + b, 0) / config.entries.length;
    }
  });

  return periods;
}

// Update peak hours display
function updatePeakHours(periods) {
  const container = document.getElementById('peakHours');
  if (!container) return;

  const sortedPeriods = Object.entries(periods)
    .filter(([_, config]) => config.avg > 0)
    .sort((a, b) => b[1].avg - a[1].avg);

  if (sortedPeriods.length === 0) return;

  container.innerHTML = sortedPeriods.map(([period, config]) => {
    const timeRange = getTimeRange(period);
    const level = config.avg >= 7 ? 'High' : config.avg >= 4 ? 'Medium' : 'Low';

    return `
      <div class="peak-hour">
        <span class="time">${timeRange}</span>
        <span class="level">${level} Energy (${config.avg.toFixed(1)})</span>
      </div>
    `;
  }).join('');
}

// Get time range string for period
function getTimeRange(period) {
  const ranges = {
    morning: '6:00 AM - 12:00 PM',
    afternoon: '12:00 PM - 5:00 PM',
    evening: '5:00 PM - 9:00 PM'
  };
  return ranges[period] || period;
}

// Generate pattern insights
function generatePatternInsights(data) {
  const chartContainer = document.getElementById('dailyPatternChart');
  if (!chartContainer || data.length < 3) return;

  // Simple text-based insights for now
  const avgEnergy = data.reduce((sum, entry) => sum + entry.level, 0) / data.length;
  const trend = calculateTrend(data);

  chartContainer.innerHTML = `
    <div class="pattern-insight">
      <p><strong>Average Energy:</strong> ${avgEnergy.toFixed(1)}/10</p>
      <p><strong>Recent Trend:</strong> ${trend}</p>
      <p><strong>Entries:</strong> ${data.length} logged</p>
    </div>
  `;
}

// Calculate simple trend
function calculateTrend(data) {
  if (data.length < 2) return 'Not enough data';

  const recent = data.slice(-5); // Last 5 entries
  const older = data.slice(-10, -5); // Previous 5 entries

  if (older.length === 0) return 'Tracking started recently';

  const recentAvg = recent.reduce((sum, e) => sum + e.level, 0) / recent.length;
  const olderAvg = older.reduce((sum, e) => sum + e.level, 0) / older.length;

  const diff = recentAvg - olderAvg;

  if (diff > 0.5) return 'Trending upward 📈';
  if (diff < -0.5) return 'Trending downward 📉';
  return 'Stable 📊';
}