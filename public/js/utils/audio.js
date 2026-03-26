// Audio and Wake Lock Utilities
export function initAudio() {
  // Initialize audio context and wake lock
  window.appState.audioContext = null;
  window.appState.wakeLock = null;
  window.appState.isAudioPlaying = false;
}

// Initialize audio context (required for Web Audio API)
window.initAudioContext = function() {
  if (!window.appState.audioContext) {
    try {
      window.appState.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('AudioContext not supported:', e.message);
    }
  }
  return window.appState.audioContext;
};

// Request wake lock to prevent screen from turning off
window.requestWakeLock = async function() {
  if (!('wakeLock' in navigator)) {
    console.warn('Wake Lock API not supported');
    return false;
  }

  try {
    window.appState.wakeLock = await navigator.wakeLock.request('screen');
    console.log('Wake lock acquired');

    // Listen for wake lock release
    window.appState.wakeLock.addEventListener('release', () => {
      console.log('Wake lock released');
      window.appState.wakeLock = null;
    });

    return true;
  } catch (err) {
    console.warn('Failed to acquire wake lock:', err.message);
    return false;
  }
};

// Release wake lock
window.releaseWakeLock = async function() {
  if (window.appState.wakeLock) {
    try {
      await window.appState.wakeLock.release();
      window.appState.wakeLock = null;
      console.log('Wake lock manually released');
    } catch (err) {
      console.warn('Failed to release wake lock:', err.message);
    }
  }
};

// Play ambient sound using Web Audio API
window.playAmbientSound = function(frequency = 432, volume = 0.1) {
  const audioContext = initAudioContext();
  if (!audioContext) return false;

  try {
    // Resume context if suspended (required by browsers)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    // Create oscillator for ambient tone
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

    oscillator.start();
    window.appState.isAudioPlaying = true;

    // Store references for cleanup
    window.appState.currentOscillator = oscillator;
    window.appState.currentGainNode = gainNode;

    return true;
  } catch (e) {
    console.warn('Failed to play ambient sound:', e.message);
    return false;
  }
};

// Stop ambient sound
window.stopAmbientSound = function() {
  if (window.appState.currentOscillator) {
    try {
      window.appState.currentOscillator.stop();
      window.appState.isAudioPlaying = false;
      window.appState.currentOscillator = null;
      window.appState.currentGainNode = null;
    } catch (e) {
      console.warn('Failed to stop ambient sound:', e.message);
    }
  }
};

// Play notification sound (simple beep)
window.playNotificationSound = function() {
  const audioContext = initAudioContext();
  if (!audioContext) return;

  try {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Short beep at 800Hz
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (e) {
    console.warn('Failed to play notification sound:', e.message);
  }
};