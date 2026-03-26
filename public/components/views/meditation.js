// Meditation View Component
export function renderMeditationView() {
  return `
    <div class="view meditation-view">
      <div class="view-header">
        <h2>Guided Meditation</h2>
        <p class="view-subtitle">Find your center with focused breathing exercises</p>
      </div>

      <div class="meditation-content">
        <div class="meditation-selector">
          <div class="meditation-option" data-type="body-scan">
            <div class="meditation-icon">🧘</div>
            <h3>Body Scan</h3>
            <p>Progressive relaxation from toes to head</p>
            <div class="meditation-duration">10 min</div>
          </div>

          <div class="meditation-option" data-type="mindfulness">
            <div class="meditation-icon">🌸</div>
            <h3>Mindfulness</h3>
            <p>Present moment awareness meditation</p>
            <div class="meditation-duration">15 min</div>
          </div>

          <div class="meditation-option" data-type="loving-kindness">
            <div class="meditation-icon">💝</div>
            <h3>Loving Kindness</h3>
            <p>Cultivate compassion and self-love</p>
            <div class="meditation-duration">12 min</div>
          </div>

          <div class="meditation-option" data-type="walking">
            <div class="meditation-icon">🚶</div>
            <h3>Walking Meditation</h3>
            <p>Mindful movement and awareness</p>
            <div class="meditation-duration">20 min</div>
          </div>
        </div>

        <div class="meditation-player" id="meditationPlayer" style="display: none;">
          <div class="player-header">
            <h3 id="currentMeditationTitle">Select a meditation</h3>
            <button class="close-player" onclick="closeMeditationPlayer()">×</button>
          </div>

          <div class="player-controls">
            <div class="progress-container">
              <div class="progress-bar">
                <div class="progress-fill" id="meditationProgress" style="width: 0%"></div>
              </div>
              <div class="time-display">
                <span id="currentTime">0:00</span>
                <span id="totalTime">0:00</span>
              </div>
            </div>

            <div class="control-buttons">
              <button class="control-btn" id="prevBtn" onclick="previousMeditation()" disabled>
                <span class="control-icon">⏮</span>
              </button>
              <button class="control-btn play-btn" id="playPauseBtn" onclick="toggleMeditation()">
                <span class="control-icon" id="playPauseIcon">▶</span>
              </button>
              <button class="control-btn" id="nextBtn" onclick="nextMeditation()" disabled>
                <span class="control-icon">⏭</span>
              </button>
            </div>

            <div class="volume-control">
              <span class="volume-icon">🔊</span>
              <input type="range" id="volumeSlider" min="0" max="1" step="0.1" value="0.7">
            </div>
          </div>

          <div class="meditation-instructions" id="meditationInstructions">
            <p>Get comfortable and prepare to begin your meditation practice.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Initialize meditation view
export function initMeditationView() {
  // Add event listeners to meditation options
  document.querySelectorAll('.meditation-option').forEach(option => {
    option.addEventListener('click', () => {
      const type = option.dataset.type;
      startMeditation(type);
    });
  });

  // Initialize audio context for meditation audio
  initAudioContext();
}

// Start meditation session
function startMeditation(type) {
  const player = document.getElementById('meditationPlayer');
  const title = document.getElementById('currentMeditationTitle');

  // Set meditation title
  const titles = {
    'body-scan': 'Body Scan Meditation',
    'mindfulness': 'Mindfulness Meditation',
    'loving-kindness': 'Loving Kindness Meditation',
    'walking': 'Walking Meditation'
  };

  title.textContent = titles[type] || 'Guided Meditation';

  // Show player
  player.style.display = 'block';
  player.scrollIntoView({ behavior: 'smooth' });

  // Initialize meditation state
  window.appState.currentMeditation = {
    type,
    isPlaying: false,
    currentTime: 0,
    duration: getMeditationDuration(type),
    instructions: getMeditationInstructions(type)
  };

  // Update UI
  updateMeditationUI();

  // Log event
  logEvent('meditation_start', type);
}

// Close meditation player
function closeMeditationPlayer() {
  const player = document.getElementById('meditationPlayer');

  // Stop any playing audio
  stopMeditationAudio();

  // Hide player
  player.style.display = 'none';

  // Clear meditation state
  window.appState.currentMeditation = null;

  // Log event
  logEvent('meditation_end');
}

// Toggle play/pause
function toggleMeditation() {
  const meditation = window.appState.currentMeditation;
  if (!meditation) return;

  meditation.isPlaying = !meditation.isPlaying;

  if (meditation.isPlaying) {
    startMeditationTimer();
    playMeditationAudio();
  } else {
    stopMeditationTimer();
    pauseMeditationAudio();
  }

  updateMeditationUI();
}

// Start meditation timer
function startMeditationTimer() {
  const meditation = window.appState.currentMeditation;
  if (!meditation) return;

  meditation.timerId = setInterval(() => {
    meditation.currentTime++;

    if (meditation.currentTime >= meditation.duration) {
      completeMeditation();
      return;
    }

    updateMeditationUI();
  }, 1000);
}

// Stop meditation timer
function stopMeditationTimer() {
  const meditation = window.appState.currentMeditation;
  if (!meditation || !meditation.timerId) return;

  clearInterval(meditation.timerId);
  meditation.timerId = null;
}

// Complete meditation session
function completeMeditation() {
  stopMeditationTimer();
  stopMeditationAudio();

  const meditation = window.appState.currentMeditation;
  if (meditation) {
    logEvent('meditation_complete', meditation.type, meditation.duration);
  }

  showToast('Meditation completed! 🌸', 'success');
  closeMeditationPlayer();
}

// Update meditation UI
function updateMeditationUI() {
  const meditation = window.appState.currentMeditation;
  if (!meditation) return;

  // Update progress bar
  const progress = (meditation.currentTime / meditation.duration) * 100;
  document.getElementById('meditationProgress').style.width = `${progress}%`;

  // Update time display
  document.getElementById('currentTime').textContent = formatTime(meditation.currentTime);
  document.getElementById('totalTime').textContent = formatTime(meditation.duration);

  // Update play/pause button
  const playPauseIcon = document.getElementById('playPauseIcon');
  playPauseIcon.textContent = meditation.isPlaying ? '⏸' : '▶';

  // Update instructions
  const instructions = meditation.instructions[meditation.currentTime] ||
                      meditation.instructions.default ||
                      'Continue breathing mindfully...';
  document.getElementById('meditationInstructions').innerHTML = `<p>${instructions}</p>`;
}

// Placeholder functions for audio (would need actual audio files)
function playMeditationAudio() {
  // Implementation would load and play meditation audio
  console.log('Playing meditation audio...');
}

function pauseMeditationAudio() {
  // Implementation would pause meditation audio
  console.log('Pausing meditation audio...');
}

function stopMeditationAudio() {
  // Implementation would stop meditation audio
  console.log('Stopping meditation audio...');
}

function previousMeditation() {
  // Implementation for previous track
  console.log('Previous meditation...');
}

function nextMeditation() {
  // Implementation for next track
  console.log('Next meditation...');
}

// Get meditation duration in seconds
function getMeditationDuration(type) {
  const durations = {
    'body-scan': 600,      // 10 minutes
    'mindfulness': 900,    // 15 minutes
    'loving-kindness': 720, // 12 minutes
    'walking': 1200        // 20 minutes
  };
  return durations[type] || 600;
}

// Get meditation instructions
function getMeditationInstructions(type) {
  const instructions = {
    'body-scan': {
      0: 'Find a comfortable position and close your eyes gently.',
      30: 'Bring your awareness to your toes. Feel them relax completely.',
      60: 'Move your attention up to your feet and ankles. Let them soften.',
      90: 'Feel your calves and shins relaxing with each breath.',
      120: 'Notice your knees loosening and releasing tension.',
      150: 'Bring awareness to your thighs. Allow them to relax deeply.',
      180: 'Feel your hips and lower back becoming comfortable.',
      210: 'Notice your abdomen and chest rising and falling with breath.',
      240: 'Bring attention to your upper back and shoulders. Release any tightness.',
      270: 'Feel your arms relaxing from shoulders to fingertips.',
      300: 'Notice your neck and throat softening.',
      330: 'Bring awareness to your face - jaw, cheeks, eyes, forehead.',
      360: 'Feel your entire body relaxed and at peace.',
      480: 'When ready, gently bring your awareness back to the room.',
      default: 'Scan your body for any remaining tension and release it with each breath.'
    },
    'mindfulness': {
      0: 'Sit comfortably and bring your attention to your breath.',
      30: 'Notice the sensation of air entering and leaving your nostrils.',
      60: 'If your mind wanders, gently bring it back to your breath.',
      120: 'Observe your thoughts without judgment, like clouds passing by.',
      180: 'Notice physical sensations in your body.',
      240: 'Be present with whatever arises in this moment.',
      default: 'Continue observing your breath and any sensations that arise.'
    },
    'loving-kindness': {
      0: 'Begin by wishing yourself well: "May I be happy, may I be healthy."',
      60: 'Extend this wish to someone you care about deeply.',
      120: 'Send loving kindness to a neutral person.',
      180: 'Offer loving kindness to someone who has challenged you.',
      240: 'Finally, extend this wish to all beings everywhere.',
      default: 'Repeat these phrases with sincerity and compassion.'
    },
    'walking': {
      0: 'Find a quiet space where you can walk slowly and mindfully.',
      30: 'As you walk, feel each foot making contact with the ground.',
      60: 'Notice the shifting of your weight from one foot to the other.',
      90: 'Be aware of your arms swinging gently at your sides.',
      120: 'Observe your surroundings without judgment.',
      180: 'If your mind wanders, bring it back to the sensation of walking.',
      default: 'Continue walking with full awareness of each step.'
    }
  };

  return instructions[type] || { default: 'Continue your meditation practice.' };
}