// Timer and Interval Utilities
export function initTimer() {
  // Initialize timer state
  window.appState.timer = {
    active: false,
    startTime: null,
    duration: 0,
    remaining: 0,
    intervalId: null,
    onTick: null,
    onComplete: null
  };
}

// Start a countdown timer
window.startTimer = function(durationSeconds, onTick = null, onComplete = null) {
  // Clear any existing timer
  stopTimer();

  const startTime = Date.now();
  const endTime = startTime + (durationSeconds * 1000);

  window.appState.timer = {
    active: true,
    startTime,
    duration: durationSeconds,
    remaining: durationSeconds,
    endTime,
    intervalId: null,
    onTick,
    onComplete
  };

  // Start the interval (update every second)
  window.appState.timer.intervalId = setInterval(() => {
    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));

    window.appState.timer.remaining = remaining;

    if (onTick) {
      onTick(remaining);
    }

    if (remaining <= 0) {
      completeTimer();
    }
  }, 1000);

  console.log(`Timer started: ${durationSeconds}s`);
};

// Stop the current timer
window.stopTimer = function() {
  if (window.appState.timer.intervalId) {
    clearInterval(window.appState.timer.intervalId);
    window.appState.timer.intervalId = null;
  }

  window.appState.timer.active = false;
  console.log('Timer stopped');
};

// Complete timer (called when timer reaches zero)
function completeTimer() {
  stopTimer();

  if (window.appState.timer.onComplete) {
    window.appState.timer.onComplete();
  }

  // Play notification sound if available
  if (window.playNotificationSound) {
    window.playNotificationSound();
  }

  console.log('Timer completed');
}

// Get current timer state
window.getTimerState = function() {
  return { ...window.appState.timer };
};

// Format seconds into MM:SS display
window.formatTime = function(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Create a repeating interval with cleanup tracking
window.createTrackedInterval = function(callback, intervalMs, maxIterations = null) {
  let iterations = 0;
  const intervalId = setInterval(() => {
    iterations++;

    try {
      callback(iterations);
    } catch (e) {
      console.error('Tracked interval callback error:', e);
      clearInterval(intervalId);
      return;
    }

    if (maxIterations && iterations >= maxIterations) {
      clearInterval(intervalId);
    }
  }, intervalMs);

  // Return cleanup function
  return () => clearInterval(intervalId);
};

// Debounce function for UI events
window.debounce = function(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for performance-critical events
window.throttle = function(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};