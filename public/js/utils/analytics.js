// Analytics and Event Logging Utilities
export function initAnalytics() {
  // Initialize event logging
  window.appState.fbEvents = safeJSONParse('fbEvents', []);
}

// Safe JSON parsing with fallback
function safeJSONParse(key, fallback = {}) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Failed to parse ${key} from localStorage:`, e);
    return fallback;
  }
}

// Event logging function
window.logEvent = function(eventType, tool = '', durationSeconds = 0, data = {}) {
  const event = {
    id: crypto.randomUUID(),
    type: eventType,
    tool,
    duration_seconds: durationSeconds,
    data,
    timestamp: new Date().toISOString(),
    synced: false
  };

  // Add to queue instead of directly writing
  window.appState.eventQueue.push(event);
  processEventQueue();

  console.log(`[Event] ${eventType} | ${tool} | ${durationSeconds}s`);
};

async function processEventQueue() {
  // Prevent concurrent processing
  if (window.appState.isProcessingQueue || window.appState.eventQueue.length === 0) {
    return;
  }

  window.appState.isProcessingQueue = true;

  try {
    // Batch process all queued events
    const eventsToAdd = [...window.appState.eventQueue];
    window.appState.eventQueue = [];

    // Load existing events (single read operation)
    window.appState.fbEvents = safeJSONParse('fbEvents', []);

    // Add all new events at once
    window.appState.fbEvents.push(...eventsToAdd);

    // Cap at 10,000 events locally; prune oldest if exceeded
    if (window.appState.fbEvents.length > 10000) {
      window.appState.fbEvents = window.appState.fbEvents.slice(-10000);
    }

    // Single write operation
    localStorage.setItem('fbEvents', JSON.stringify(window.appState.fbEvents));
  } catch (error) {
    console.error('Error processing event queue:', error.message);
    // Re-queue events that failed to process
    window.appState.eventQueue = [...window.appState.eventQueue, ...eventsToAdd];
  } finally {
    window.appState.isProcessingQueue = false;

    // Process any events that arrived while we were processing
    if (window.appState.eventQueue.length > 0) {
      processEventQueue();
    }
  }
}

// Calculate current and longest streaks from logged events
window.getStreak = function() {
  const fbEvents = safeJSONParse('fbEvents', []);

  // Filter only session_complete events with type 'focus'
  const focusSessions = fbEvents.filter(e =>
    e.type === 'session_complete' && e.data?.type === 'focus'
  );

  if (focusSessions.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastActiveDate: null, totalSessions: 0 };
  }

  // Extract unique dates (YYYY-MM-DD in UTC)
  const datesSet = new Set();
  focusSessions.forEach(e => {
    const date = new Date(e.timestamp).toISOString().slice(0, 10);
    datesSet.add(date);
  });

  // Sort dates descending
  const dates = Array.from(datesSet).sort().reverse();

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;
  let foundCurrentStreakBreak = false;

  // Walk backward from today, checking for consecutive days
  // Stop early once we've counted the current streak and found a reasonable long streak
  const MAX_ITERATIONS = 730; // ~2 years
  for (let i = 0; i < dates.length && i < MAX_ITERATIONS; i++) {
    if (i === 0) {
      tempStreak = 1;
      currentStreak = 1;
    } else {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      const diffDays = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day
        tempStreak++;
        if (i === 1 || dates[i] === dates[0]) {
          // First iteration or recent date
          currentStreak = tempStreak;
        }
      } else {
        // Gap detected; reset temp streak
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
        foundCurrentStreakBreak = true;

        // Optimization: stop if we've found current streak break and a long enough streak
        // This prevents unnecessary iterations through old data
        if (foundCurrentStreakBreak && longestStreak > 30) {
          break;
        }
      }
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  return {
    currentStreak,
    longestStreak,
    lastActiveDate: dates[0] || null,
    totalSessions: focusSessions.length
  };
};