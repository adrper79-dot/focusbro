// Analytics View Component
export function renderAnalyticsView() {
  return `
    <div class="view analytics-view">
      <div class="view-header">
        <h2>Analytics</h2>
        <p class="view-subtitle">Track your progress and discover patterns</p>
      </div>

      <div class="analytics-content">
        <div class="stats-overview">
          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-content">
              <div class="stat-value" id="totalSessions">0</div>
              <div class="stat-label">Total Sessions</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">🔥</div>
            <div class="stat-content">
              <div class="stat-value" id="currentStreak">0</div>
              <div class="stat-label">Current Streak</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">🏆</div>
            <div class="stat-content">
              <div class="stat-value" id="longestStreak">0</div>
              <div class="stat-label">Longest Streak</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-content">
              <div class="stat-value" id="totalTime">0h</div>
              <div class="stat-label">Total Focus Time</div>
            </div>
          </div>
        </div>

        <div class="analytics-charts">
          <div class="chart-container">
            <h3>Focus Sessions Over Time</h3>
            <div class="chart-placeholder" id="sessionsChart">
              <p>Loading session data...</p>
            </div>
          </div>

          <div class="chart-container">
            <h3>Daily Activity Pattern</h3>
            <div class="chart-placeholder" id="dailyPatternChart">
              <p>Loading pattern data...</p>
            </div>
          </div>
        </div>

        <div class="analytics-insights">
          <div class="insight-card">
            <h3>Recent Achievements</h3>
            <div class="achievements-list" id="achievementsList">
              <div class="achievement">
                <span class="achievement-icon">🎯</span>
                <span class="achievement-text">Complete your first focus session</span>
              </div>
              <div class="achievement">
                <span class="achievement-icon">🔥</span>
                <span class="achievement-text">Maintain a 3-day streak</span>
              </div>
              <div class="achievement">
                <span class="achievement-icon">⏱️</span>
                <span class="achievement-text">Focus for 25 minutes straight</span>
              </div>
            </div>
          </div>

          <div class="insight-card">
            <h3>Tool Usage</h3>
            <div class="usage-breakdown" id="toolUsage">
              <div class="usage-item">
                <span class="tool-name">Pomodoro Timer</span>
                <div class="usage-bar">
                  <div class="usage-fill" style="width: 65%"></div>
                </div>
                <span class="usage-percent">65%</span>
              </div>
              <div class="usage-item">
                <span class="tool-name">Breathing Exercises</span>
                <div class="usage-bar">
                  <div class="usage-fill" style="width: 20%"></div>
                </div>
                <span class="usage-percent">20%</span>
              </div>
              <div class="usage-item">
                <span class="tool-name">Grounding</span>
                <div class="usage-bar">
                  <div class="usage-fill" style="width: 10%"></div>
                </div>
                <span class="usage-percent">10%</span>
              </div>
              <div class="usage-item">
                <span class="tool-name">Meditation</span>
                <div class="usage-bar">
                  <div class="usage-fill" style="width: 5%"></div>
                </div>
                <span class="usage-percent">5%</span>
              </div>
            </div>
          </div>

          <div class="insight-card">
            <h3>Weekly Summary</h3>
            <div class="weekly-summary" id="weeklySummary">
              <div class="summary-item">
                <span class="summary-label">This Week</span>
                <span class="summary-value" id="thisWeekSessions">0 sessions</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Last Week</span>
                <span class="summary-value" id="lastWeekSessions">0 sessions</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Improvement</span>
                <span class="summary-value" id="weeklyImprovement">0%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="analytics-export">
          <button class="analytics-btn" onclick="exportAnalytics()">Export Analytics</button>
          <button class="analytics-btn secondary" onclick="refreshAnalytics()">Refresh Data</button>
        </div>
      </div>
    </div>
  `;
}

// Initialize analytics view
export function initAnalyticsView() {
  // Load analytics data
  loadAnalyticsData();

  // Set up refresh timer (update every 30 seconds when viewing analytics)
  window.analyticsRefreshInterval = setInterval(() => {
    if (document.querySelector('.analytics-view')) {
      loadAnalyticsData();
    }
  }, 30000);
}

// Load and process analytics data
function loadAnalyticsData() {
  const events = getStoredJSON('fbEvents', []);
  const streakData = getStreak();

  // Update overview stats
  updateOverviewStats(events, streakData);

  // Generate charts
  generateSessionsChart(events);
  generateDailyPatternChart(events);

  // Update insights
  updateAchievements(events, streakData);
  updateToolUsage(events);
  updateWeeklySummary(events);
}

// Update overview statistics
function updateOverviewStats(events, streakData) {
  // Total sessions
  document.getElementById('totalSessions').textContent = streakData.totalSessions;

  // Streaks
  document.getElementById('currentStreak').textContent = streakData.currentStreak;
  document.getElementById('longestStreak').textContent = streakData.longestStreak;

  // Total focus time
  const focusSessions = events.filter(e => e.type === 'session_complete' && e.data?.type === 'focus');
  const totalMinutes = focusSessions.reduce((sum, session) => sum + (session.duration_seconds || 0), 0) / 60;
  const hours = Math.floor(totalMinutes / 60);
  const mins = Math.floor(totalMinutes % 60);

  document.getElementById('totalTime').textContent = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

// Generate sessions over time chart
function generateSessionsChart(events) {
  const chartContainer = document.getElementById('sessionsChart');
  if (!chartContainer) return;

  // Group sessions by date
  const sessionsByDate = {};
  events.filter(e => e.type === 'session_complete').forEach(event => {
    const date = new Date(event.timestamp).toISOString().slice(0, 10);
    sessionsByDate[date] = (sessionsByDate[date] || 0) + 1;
  });

  // Get last 14 days
  const dates = [];
  const counts = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10);
    dates.push(dateStr);
    counts.push(sessionsByDate[dateStr] || 0);
  }

  // Simple text-based chart for now
  const maxCount = Math.max(...counts);
  const chart = dates.map((date, i) => {
    const count = counts[i];
    const barWidth = maxCount > 0 ? Math.round((count / maxCount) * 20) : 0;
    const bar = '█'.repeat(barWidth) || '░';
    const shortDate = new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' });

    return `${shortDate}: ${bar} ${count}`;
  }).join('\n');

  chartContainer.innerHTML = `<pre class="text-chart">${chart}</pre>`;
}

// Generate daily activity pattern chart
function generateDailyPatternChart(events) {
  const chartContainer = document.getElementById('dailyPatternChart');
  if (!chartContainer) return;

  // Group by hour of day
  const hourlyActivity = new Array(24).fill(0);
  events.filter(e => e.type === 'session_complete').forEach(event => {
    const hour = new Date(event.timestamp).getHours();
    hourlyActivity[hour]++;
  });

  // Create simple bar chart
  const maxActivity = Math.max(...hourlyActivity);
  const chart = hourlyActivity.map((count, hour) => {
    const barWidth = maxActivity > 0 ? Math.round((count / maxActivity) * 15) : 0;
    const bar = '█'.repeat(barWidth) || '░';
    const hourLabel = `${hour.toString().padStart(2, '0')}:00`;

    return `${hourLabel}: ${bar} ${count}`;
  }).join('\n');

  chartContainer.innerHTML = `<pre class="text-chart">${chart}</pre>`;
}

// Update achievements based on progress
function updateAchievements(events, streakData) {
  const achievements = [];

  // First session achievement
  if (streakData.totalSessions > 0) {
    achievements.push({
      icon: '🎯',
      text: 'Completed first focus session',
      unlocked: true
    });
  }

  // Streak achievements
  if (streakData.currentStreak >= 3) {
    achievements.push({
      icon: '🔥',
      text: 'Maintained 3-day streak',
      unlocked: true
    });
  }

  if (streakData.longestStreak >= 7) {
    achievements.push({
      icon: '🏆',
      text: 'Achieved 7-day streak',
      unlocked: true
    });
  }

  // Time-based achievements
  const focusSessions = events.filter(e => e.type === 'session_complete' && e.data?.type === 'focus');
  const hasLongSession = focusSessions.some(s => (s.duration_seconds || 0) >= 1500); // 25 minutes

  if (hasLongSession) {
    achievements.push({
      icon: '⏱️',
      text: 'Focused for 25+ minutes straight',
      unlocked: true
    });
  }

  // Tool usage achievements
  const toolUsage = {};
  events.forEach(e => {
    if (e.tool) toolUsage[e.tool] = (toolUsage[e.tool] || 0) + 1;
  });

  const mostUsedTool = Object.entries(toolUsage).sort((a, b) => b[1] - a[1])[0];
  if (mostUsedTool && mostUsedTool[1] >= 10) {
    achievements.push({
      icon: '⭐',
      text: `Used ${mostUsedTool[0]} 10+ times`,
      unlocked: true
    });
  }

  // Display achievements
  const container = document.getElementById('achievementsList');
  if (container) {
    container.innerHTML = achievements.map(achievement => `
      <div class="achievement ${achievement.unlocked ? 'unlocked' : 'locked'}">
        <span class="achievement-icon">${achievement.icon}</span>
        <span class="achievement-text">${achievement.text}</span>
      </div>
    `).join('');
  }
}

// Update tool usage breakdown
function updateToolUsage(events) {
  const toolUsage = {};
  let totalEvents = 0;

  events.forEach(e => {
    if (e.tool && e.type === 'session_complete') {
      toolUsage[e.tool] = (toolUsage[e.tool] || 0) + 1;
      totalEvents++;
    }
  });

  const container = document.getElementById('toolUsage');
  if (!container || totalEvents === 0) return;

  const sortedTools = Object.entries(toolUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4); // Top 4 tools

  container.innerHTML = sortedTools.map(([tool, count]) => {
    const percentage = Math.round((count / totalEvents) * 100);
    return `
      <div class="usage-item">
        <span class="tool-name">${formatToolName(tool)}</span>
        <div class="usage-bar">
          <div class="usage-fill" style="width: ${percentage}%"></div>
        </div>
        <span class="usage-percent">${percentage}%</span>
      </div>
    `;
  }).join('');
}

// Format tool name for display
function formatToolName(tool) {
  const names = {
    'pomodoro': 'Pomodoro Timer',
    'breathing': 'Breathing Exercises',
    'grounding': 'Grounding',
    'meditation': 'Meditation',
    'body-scan': 'Body Scan',
    'mindfulness': 'Mindfulness',
    'loving-kindness': 'Loving Kindness',
    'walking': 'Walking Meditation'
  };
  return names[tool] || tool.charAt(0).toUpperCase() + tool.slice(1);
}

// Update weekly summary
function updateWeeklySummary(events) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
  weekStart.setHours(0, 0, 0, 0);

  const lastWeekStart = new Date(weekStart);
  lastWeekStart.setDate(weekStart.getDate() - 7);

  // Count sessions this week
  const thisWeekSessions = events.filter(e => {
    const eventDate = new Date(e.timestamp);
    return eventDate >= weekStart && e.type === 'session_complete';
  }).length;

  // Count sessions last week
  const lastWeekSessions = events.filter(e => {
    const eventDate = new Date(e.timestamp);
    return eventDate >= lastWeekStart && eventDate < weekStart && e.type === 'session_complete';
  }).length;

  // Calculate improvement
  let improvement = 0;
  if (lastWeekSessions > 0) {
    improvement = Math.round(((thisWeekSessions - lastWeekSessions) / lastWeekSessions) * 100);
  }

  // Update display
  document.getElementById('thisWeekSessions').textContent = `${thisWeekSessions} sessions`;
  document.getElementById('lastWeekSessions').textContent = `${lastWeekSessions} sessions`;

  const improvementEl = document.getElementById('weeklyImprovement');
  improvementEl.textContent = `${improvement > 0 ? '+' : ''}${improvement}%`;
  improvementEl.className = improvement >= 0 ? 'positive' : 'negative';
}

// Export analytics data
function exportAnalytics() {
  try {
    const events = getStoredJSON('fbEvents', []);
    const streakData = getStreak();

    const analyticsData = {
      overview: {
        totalSessions: streakData.totalSessions,
        currentStreak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
        lastActiveDate: streakData.lastActiveDate
      },
      events: events,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `focusbro-analytics-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Analytics exported successfully', 'success');
  } catch (error) {
    console.error('Analytics export failed:', error);
    showToast('Failed to export analytics', 'error');
  }
}

// Refresh analytics data
function refreshAnalytics() {
  showLoading('Refreshing analytics...');
  setTimeout(() => {
    loadAnalyticsData();
    hideLoading();
    showToast('Analytics refreshed', 'success');
  }, 500);
}