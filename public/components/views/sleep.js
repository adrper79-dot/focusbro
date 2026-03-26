// Sleep Tools View Component
export function renderSleepView() {
  return `
    <div class="view sleep-view">
      <div class="view-header">
        <h2>Sleep Tools</h2>
        <p class="view-subtitle">Tools to help you wind down and get better sleep</p>
      </div>

      <div class="sleep-content">
        <div class="sleep-categories">
          <div class="category-grid">
            <div class="sleep-category" onclick="loadSleepCategory('wind-down')">
              <div class="category-icon">🌙</div>
              <div class="category-name">Wind Down</div>
              <div class="category-description">Relaxation and preparation</div>
            </div>

            <div class="sleep-category" onclick="loadSleepCategory('sounds')">
              <div class="category-icon">🔊</div>
              <div class="category-name">Sleep Sounds</div>
              <div class="category-description">Ambient audio for sleep</div>
            </div>

            <div class="sleep-category" onclick="loadSleepCategory('routines')">
              <div class="category-name">Routines</div>
              <div class="category-description">Sleep hygiene habits</div>
            </div>

            <div class="sleep-category" onclick="loadSleepCategory('tracking')">
              <div class="category-icon">📊</div>
              <div class="category-name">Tracking</div>
              <div class="category-description">Monitor your sleep patterns</div>
            </div>
          </div>
        </div>

        <div class="sleep-tools" id="sleepTools">
          <!-- Sleep tools will be loaded here -->
        </div>

        <div class="sleep-stats">
          <div class="stat-card">
            <div class="stat-icon">😴</div>
            <div class="stat-content">
              <div class="stat-value" id="avgSleepTime">7.2h</div>
              <div class="stat-label">Avg Sleep Time</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">🌙</div>
            <div class="stat-content">
              <div class="stat-value" id="sleepStreak">5</div>
              <div class="stat-label">Sleep Streak</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-content">
              <div class="stat-value" id="sleepQuality">Good</div>
              <div class="stat-label">Sleep Quality</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Initialize sleep view
export function initSleepView() {
  // Load wind-down category by default
  loadSleepCategory('wind-down');

  // Load sleep stats
  loadSleepStats();
}

// Load sleep tools for category
function loadSleepCategory(category) {
  // Update category selection
  document.querySelectorAll('.sleep-category').forEach(cat => {
    cat.classList.remove('active');
  });
  event.currentTarget.classList.add('active');

  const toolsContainer = document.getElementById('sleepTools');
  if (!toolsContainer) return;

  const tools = getSleepToolsForCategory(category);
  toolsContainer.innerHTML = tools.map(tool => `
    <div class="sleep-tool-card" onclick="startSleepTool('${tool.id}')">
      <div class="tool-icon">${tool.icon}</div>
      <div class="tool-info">
        <h4 class="tool-name">${tool.name}</h4>
        <p class="tool-description">${tool.description}</p>
      </div>
      <div class="tool-action">
        <button class="tool-btn">Start</button>
      </div>
    </div>
  `).join('');
}

// Get sleep tools for category
function getSleepToolsForCategory(category) {
  const categories = {
    'wind-down': [
      {
        id: 'progressive-muscle-relaxation',
        name: 'Progressive Muscle Relaxation',
        description: 'Systematically relax muscle groups',
        icon: '🧘',
        component: 'progressiveRelaxation'
      },
      {
        id: 'guided-sleep-meditation',
        name: 'Guided Sleep Meditation',
        description: 'Calming meditation for bedtime',
        icon: '🌙',
        component: 'guidedSleepMeditation'
      },
      {
        id: 'breathing-exercise',
        name: '4-7-8 Breathing',
        description: 'Calming breathing technique',
        icon: '🫁',
        component: 'breathingExercise'
      },
      {
        id: 'gratitude-journal',
        name: 'Gratitude Journal',
        description: 'Write down things you\'re grateful for',
        icon: '📝',
        component: 'gratitudeJournal'
      }
    ],
    sounds: [
      {
        id: 'white-noise',
        name: 'White Noise',
        description: 'Consistent background noise',
        icon: '🌊',
        component: 'whiteNoise'
      },
      {
        id: 'nature-sounds',
        name: 'Nature Sounds',
        description: 'Rain, ocean, forest sounds',
        icon: '🌲',
        component: 'natureSounds'
      },
      {
        id: 'binaural-beats',
        name: 'Binaural Beats',
        description: 'Brainwave entrainment for sleep',
        icon: '🧠',
        component: 'binauralBeats'
      },
      {
        id: 'ambient-music',
        name: 'Ambient Music',
        description: 'Soft, soothing instrumental music',
        icon: '🎵',
        component: 'ambientMusic'
      }
    ],
    routines: [
      {
        id: 'sleep-schedule',
        name: 'Sleep Schedule',
        description: 'Set consistent bedtime and wake time',
        icon: '⏰',
        component: 'sleepSchedule'
      },
      {
        id: 'bedtime-routine',
        name: 'Bedtime Routine',
        description: 'Create a calming pre-sleep ritual',
        icon: '🛏️',
        component: 'bedtimeRoutine'
      },
      {
        id: 'screen-wind-down',
        name: 'Screen Wind Down',
        description: 'Gradually reduce screen time before bed',
        icon: '📱',
        component: 'screenWindDown'
      },
      {
        id: 'sleep-environment',
        name: 'Sleep Environment',
        description: 'Optimize your bedroom for sleep',
        icon: '🏠',
        component: 'sleepEnvironment'
      }
    ],
    tracking: [
      {
        id: 'sleep-log',
        name: 'Sleep Log',
        description: 'Track your sleep patterns and quality',
        icon: '📊',
        component: 'sleepLog'
      },
      {
        id: 'sleep-goals',
        name: 'Sleep Goals',
        description: 'Set and track sleep improvement goals',
        icon: '🎯',
        component: 'sleepGoals'
      },
      {
        id: 'sleep-insights',
        name: 'Sleep Insights',
        description: 'Analyze your sleep data for patterns',
        icon: '💡',
        component: 'sleepInsights'
      },
      {
        id: 'dream-journal',
        name: 'Dream Journal',
        description: 'Record and analyze your dreams',
        icon: '💭',
        component: 'dreamJournal'
      }
    ]
  };

  return categories[category] || [];
}

// Start sleep tool
function startSleepTool(toolId) {
  const allTools = getAllSleepTools();
  const tool = allTools.find(t => t.id === toolId);

  if (!tool) return;

  // Create tool modal
  const modalContent = `
    <div class="sleep-tool-modal">
      <div class="tool-header">
        <h3>${tool.name}</h3>
        <button class="close-tool" onclick="closeSleepTool()">×</button>
      </div>
      <div class="tool-canvas" id="sleepToolCanvas">
        <!-- Tool content will be loaded here -->
      </div>
      <div class="tool-controls">
        <div class="tool-timer" id="sleepToolTimer">00:00</div>
        <button class="tool-control-btn" onclick="closeSleepTool()">Done</button>
      </div>
    </div>
  `;

  showModal(modalContent, { title: tool.name, size: 'large', closable: false });

  // Load tool component
  loadSleepToolComponent(tool);

  // Start usage timer
  startSleepToolTimer(tool);

  // Log usage
  logEvent('sleep_tool_started', toolId, 0, { category: tool.category });
}

// Load sleep tool component
function loadSleepToolComponent(tool) {
  const canvas = document.getElementById('sleepToolCanvas');
  if (!canvas) return;

  switch (tool.component) {
    case 'progressiveRelaxation':
      canvas.innerHTML = `
        <div class="progressive-relaxation">
          <div class="relaxation-guide">
            <div class="current-muscle" id="currentMuscle">Getting ready...</div>
            <div class="progress-bar">
              <div class="progress-fill" id="relaxationProgress"></div>
            </div>
          </div>
          <div class="relaxation-controls">
            <button id="startRelaxation">Begin Relaxation</button>
            <button id="pauseRelaxation" style="display:none;">Pause</button>
          </div>
          <div class="relaxation-instructions" id="relaxationInstructions">
            Lie down comfortably. We'll work through different muscle groups, tensing and then relaxing them.
          </div>
        </div>
      `;
      initProgressiveRelaxation();
      break;

    case 'guidedSleepMeditation':
      canvas.innerHTML = `
        <div class="guided-meditation">
          <div class="meditation-visual">
            <div class="breathing-circle" id="breathingCircle"></div>
          </div>
          <div class="meditation-text" id="meditationText">
            Close your eyes and take a deep breath...
          </div>
          <div class="meditation-controls">
            <button id="startMeditation">Begin Meditation</button>
            <button id="pauseMeditation" style="display:none;">Pause</button>
          </div>
        </div>
      `;
      initGuidedSleepMeditation();
      break;

    case 'breathingExercise':
      canvas.innerHTML = `
        <div class="breathing-exercise">
          <div class="breathing-animation">
            <div class="breath-circle" id="breathCircle"></div>
            <div class="breath-instruction" id="breathInstruction">Breathe In</div>
          </div>
          <div class="breathing-guide">
            <div class="step-counter">Step <span id="currentStep">1</span> of 4</div>
            <div class="step-description" id="stepDescription">
              Inhale quietly through your nose for 4 seconds
            </div>
          </div>
          <div class="breathing-controls">
            <button id="startBreathing">Start 4-7-8 Breathing</button>
            <button id="pauseBreathing" style="display:none;">Pause</button>
          </div>
        </div>
      `;
      initBreathingExercise();
      break;

    case 'gratitudeJournal':
      canvas.innerHTML = `
        <div class="gratitude-journal">
          <div class="journal-prompt">
            <h4>What are you grateful for today?</h4>
            <p>Write down 3 things you're thankful for. This can help shift your mindset before sleep.</p>
          </div>
          <div class="journal-entries">
            <div class="entry-group">
              <label>1.</label>
              <textarea id="gratitude1" placeholder="Something you're grateful for..." rows="2"></textarea>
            </div>
            <div class="entry-group">
              <label>2.</label>
              <textarea id="gratitude2" placeholder="Another thing..." rows="2"></textarea>
            </div>
            <div class="entry-group">
              <label>3.</label>
              <textarea id="gratitude3" placeholder="One more..." rows="2"></textarea>
            </div>
          </div>
          <div class="journal-controls">
            <button id="saveGratitude">Save Entry</button>
            <button id="viewPastEntries">View Past Entries</button>
          </div>
        </div>
      `;
      initGratitudeJournal();
      break;

    case 'whiteNoise':
      canvas.innerHTML = `
        <div class="white-noise">
          <div class="noise-visual">
            <div class="sound-waves" id="soundWaves"></div>
          </div>
          <div class="noise-controls">
            <div class="volume-control">
              <label>Volume:</label>
              <input type="range" id="noiseVolume" min="0" max="100" value="50">
            </div>
            <div class="noise-type">
              <label>Type:</label>
              <select id="noiseType">
                <option value="white">White Noise</option>
                <option value="pink">Pink Noise</option>
                <option value="brown">Brown Noise</option>
              </select>
            </div>
          </div>
          <div class="noise-buttons">
            <button id="playNoise">Play</button>
            <button id="pauseNoise" style="display:none;">Pause</button>
          </div>
        </div>
      `;
      initWhiteNoise();
      break;

    case 'sleepLog':
      canvas.innerHTML = `
        <div class="sleep-log">
          <div class="log-form">
            <div class="log-date">
              <label>Date:</label>
              <input type="date" id="sleepDate" value="${new Date().toISOString().slice(0, 10)}">
            </div>
            <div class="log-times">
              <div class="time-input">
                <label>Bedtime:</label>
                <input type="time" id="bedtime">
              </div>
              <div class="time-input">
                <label>Wake time:</label>
                <input type="time" id="waketime">
              </div>
            </div>
            <div class="sleep-quality">
              <label>Quality (1-10):</label>
              <input type="range" id="sleepQuality" min="1" max="10" value="7">
              <span id="qualityValue">7</span>
            </div>
            <div class="sleep-notes">
              <label>Notes:</label>
              <textarea id="sleepNotes" placeholder="How did you sleep? Any factors that affected your sleep?" rows="3"></textarea>
            </div>
          </div>
          <div class="log-controls">
            <button id="saveSleepLog">Save Entry</button>
            <button id="viewSleepHistory">View History</button>
          </div>
        </div>
      `;
      initSleepLog();
      break;

    default:
      canvas.innerHTML = `
        <div class="tool-placeholder">
          <div class="placeholder-icon">${tool.icon}</div>
          <p>${tool.name} - Sleep tool coming soon!</p>
          <p>This is a placeholder for the ${tool.component} component.</p>
        </div>
      `;
  }
}

// Progressive muscle relaxation implementation
function initProgressiveRelaxation() {
  const currentMuscle = document.getElementById('currentMuscle');
  const progressBar = document.getElementById('relaxationProgress');
  const instructions = document.getElementById('relaxationInstructions');
  const startBtn = document.getElementById('startRelaxation');
  const pauseBtn = document.getElementById('pauseRelaxation');

  if (!currentMuscle) return;

  const muscleGroups = [
    { name: 'Feet and Toes', instruction: 'Tighten your toes and feet for 5 seconds, then release.' },
    { name: 'Calves', instruction: 'Tighten your calf muscles for 5 seconds, then release.' },
    { name: 'Thighs', instruction: 'Tighten your thigh muscles for 5 seconds, then release.' },
    { name: 'Abdomen', instruction: 'Tighten your abdominal muscles for 5 seconds, then release.' },
    { name: 'Chest and Shoulders', instruction: 'Tighten your chest and shoulder muscles for 5 seconds, then release.' },
    { name: 'Arms', instruction: 'Tighten your arm muscles for 5 seconds, then release.' },
    { name: 'Hands and Fingers', instruction: 'Tighten your hands and fingers for 5 seconds, then release.' },
    { name: 'Neck and Face', instruction: 'Tighten your neck and facial muscles for 5 seconds, then release.' }
  ];

  let currentIndex = 0;
  let isRunning = false;
  let intervalId;

  startBtn.addEventListener('click', startRelaxation);
  pauseBtn.addEventListener('click', pauseRelaxation);

  function startRelaxation() {
    if (isRunning) return;

    isRunning = true;
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';

    runRelaxationSequence();
  }

  function pauseRelaxation() {
    isRunning = false;
    clearInterval(intervalId);
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
  }

  function runRelaxationSequence() {
    if (!isRunning || currentIndex >= muscleGroups.length) {
      if (currentIndex >= muscleGroups.length) {
        currentMuscle.textContent = 'Relaxation Complete';
        instructions.textContent = 'Take a few deep breaths and enjoy the relaxation.';
        pauseRelaxation();
      }
      return;
    }

    const muscle = muscleGroups[currentIndex];
    currentMuscle.textContent = muscle.name;
    instructions.textContent = muscle.instruction;
    progressBar.style.width = `${((currentIndex + 1) / muscleGroups.length) * 100}%`;

    // Tense phase (5 seconds)
    setTimeout(() => {
      if (!isRunning) return;
      instructions.textContent = 'Now release and relax...';

      // Release phase (10 seconds)
      setTimeout(() => {
        if (!isRunning) return;
        currentIndex++;
        runRelaxationSequence();
      }, 10000);
    }, 5000);
  }
}

// Guided sleep meditation implementation
function initGuidedSleepMeditation() {
  const breathingCircle = document.getElementById('breathingCircle');
  const meditationText = document.getElementById('meditationText');
  const startBtn = document.getElementById('startMeditation');
  const pauseBtn = document.getElementById('pauseMeditation');

  if (!breathingCircle) return;

  const meditationScript = [
    "Close your eyes and take a deep breath...",
    "Feel the weight of your body sinking into the bed...",
    "Let go of the day's tensions...",
    "Imagine a peaceful place...",
    "Your mind is calm and quiet...",
    "Each breath brings more relaxation...",
    "Let your thoughts drift away...",
    "You are safe and comfortable...",
    "Sleep comes naturally to you...",
    "Good night..."
  ];

  let currentIndex = 0;
  let isRunning = false;
  let intervalId;

  startBtn.addEventListener('click', startMeditation);
  pauseBtn.addEventListener('click', pauseMeditation);

  function startMeditation() {
    if (isRunning) return;

    isRunning = true;
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';

    runMeditation();
  }

  function pauseMeditation() {
    isRunning = false;
    clearInterval(intervalId);
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
  }

  function runMeditation() {
    if (!isRunning || currentIndex >= meditationScript.length) {
      if (currentIndex >= meditationScript.length) {
        meditationText.textContent = 'Sweet dreams...';
        pauseMeditation();
      }
      return;
    }

    meditationText.textContent = meditationScript[currentIndex];
    currentIndex++;

    // Breathing animation
    breathingCircle.style.transform = 'scale(1.2)';
    setTimeout(() => {
      breathingCircle.style.transform = 'scale(1)';
    }, 2000);

    intervalId = setTimeout(runMeditation, 8000);
  }
}

// 4-7-8 Breathing implementation
function initBreathingExercise() {
  const breathCircle = document.getElementById('breathCircle');
  const breathInstruction = document.getElementById('breathInstruction');
  const currentStep = document.getElementById('currentStep');
  const stepDescription = document.getElementById('stepDescription');
  const startBtn = document.getElementById('startBreathing');
  const pauseBtn = document.getElementById('pauseBreathing');

  if (!breathCircle) return;

  const steps = [
    { instruction: 'Inhale quietly through your nose for 4 seconds', duration: 4000, text: 'Breathe In' },
    { instruction: 'Hold your breath for 7 seconds', duration: 7000, text: 'Hold' },
    { instruction: 'Exhale completely through your mouth for 8 seconds', duration: 8000, text: 'Breathe Out' },
    { instruction: 'Hold your breath for 7 seconds before next cycle', duration: 7000, text: 'Hold' }
  ];

  let currentIndex = 0;
  let isRunning = false;
  let intervalId;

  startBtn.addEventListener('click', startBreathing);
  pauseBtn.addEventListener('click', pauseBreathing);

  function startBreathing() {
    if (isRunning) return;

    isRunning = true;
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';

    runBreathingCycle();
  }

  function pauseBreathing() {
    isRunning = false;
    clearInterval(intervalId);
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
  }

  function runBreathingCycle() {
    if (!isRunning) return;

    const step = steps[currentIndex];
    currentStep.textContent = currentIndex + 1;
    stepDescription.textContent = step.instruction;
    breathInstruction.textContent = step.text;

    // Visual feedback
    if (currentIndex === 0) {
      breathCircle.style.transform = 'scale(1.5)';
    } else if (currentIndex === 2) {
      breathCircle.style.transform = 'scale(0.8)';
    } else {
      breathCircle.style.transform = 'scale(1)';
    }

    setTimeout(() => {
      if (!isRunning) return;

      currentIndex = (currentIndex + 1) % steps.length;
      runBreathingCycle();
    }, step.duration);
  }
}

// Gratitude journal implementation
function initGratitudeJournal() {
  const saveBtn = document.getElementById('saveGratitude');
  const viewBtn = document.getElementById('viewPastEntries');

  saveBtn.addEventListener('click', saveGratitudeEntry);
  viewBtn.addEventListener('click', viewPastEntries);
}

function saveGratitudeEntry() {
  const entries = [
    document.getElementById('gratitude1').value,
    document.getElementById('gratitude2').value,
    document.getElementById('gratitude3').value
  ].filter(entry => entry.trim());

  if (entries.length === 0) {
    showToast('Please write at least one thing you\'re grateful for', 'warning');
    return;
  }

  const gratitudeData = getStoredJSON('fbGratitudeEntries', []);
  const entry = {
    date: new Date().toISOString(),
    entries: entries
  };

  gratitudeData.push(entry);
  setStoredJSON('fbGratitudeEntries', gratitudeData);

  showToast('Gratitude entry saved!', 'success');
  logEvent('gratitude_entry_saved', 'journal', entries.length);
}

function viewPastEntries() {
  const entries = getStoredJSON('fbGratitudeEntries', []);

  if (entries.length === 0) {
    showToast('No past entries found', 'info');
    return;
  }

  const entriesHtml = entries.slice(-10).reverse().map(entry => `
    <div class="past-entry">
      <div class="entry-date">${new Date(entry.date).toLocaleDateString()}</div>
      <ul>
        ${entry.entries.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  const modalContent = `
    <div class="gratitude-history">
      <h3>Recent Gratitude Entries</h3>
      <div class="entries-list">
        ${entriesHtml}
      </div>
    </div>
  `;

  showModal(modalContent, { title: 'Gratitude History', size: 'large' });
}

// White noise implementation
function initWhiteNoise() {
  const volumeSlider = document.getElementById('noiseVolume');
  const noiseType = document.getElementById('noiseType');
  const playBtn = document.getElementById('playNoise');
  const pauseBtn = document.getElementById('pauseNoise');
  const soundWaves = document.getElementById('soundWaves');

  let audioContext;
  let source;
  let gainNode;
  let isPlaying = false;

  playBtn.addEventListener('click', playNoise);
  pauseBtn.addEventListener('click', pauseNoise);
  volumeSlider.addEventListener('input', updateVolume);
  noiseType.addEventListener('change', changeNoiseType);

  function playNoise() {
    if (isPlaying) return;

    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      gainNode = audioContext.createGain();
      gainNode.connect(audioContext.destination);

      updateVolume();
      generateNoise();

      isPlaying = true;
      playBtn.style.display = 'none';
      pauseBtn.style.display = 'inline-block';

      // Visual feedback
      soundWaves.classList.add('active');
    } catch (e) {
      showToast('Audio not supported in this browser', 'error');
    }
  }

  function pauseNoise() {
    if (!isPlaying) return;

    if (source) {
      source.stop();
    }
    if (audioContext) {
      audioContext.close();
    }

    isPlaying = false;
    playBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    soundWaves.classList.remove('active');
  }

  function updateVolume() {
    if (gainNode) {
      gainNode.gain.value = volumeSlider.value / 100;
    }
  }

  function changeNoiseType() {
    if (isPlaying) {
      if (source) source.stop();
      generateNoise();
    }
  }

  function generateNoise() {
    const bufferSize = audioContext.sampleRate * 2;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    const type = noiseType.value;

    for (let i = 0; i < bufferSize; i++) {
      let noise = Math.random() * 2 - 1;

      // Apply different noise characteristics
      switch (type) {
        case 'pink':
          // Simple pink noise approximation
          noise *= (1 / Math.sqrt(i + 1));
          break;
        case 'brown':
          // Simple brown noise approximation
          if (i > 0) {
            noise = (data[i - 1] + 0.02 * noise) / 1.02;
          }
          break;
        case 'white':
        default:
          // White noise - no modification
          break;
      }

      data[i] = noise;
    }

    source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(gainNode);
    source.start();
  }
}

// Sleep log implementation
function initSleepLog() {
  const qualitySlider = document.getElementById('sleepQuality');
  const qualityValue = document.getElementById('qualityValue');
  const saveBtn = document.getElementById('saveSleepLog');
  const viewBtn = document.getElementById('viewSleepHistory');

  qualitySlider.addEventListener('input', () => {
    qualityValue.textContent = qualitySlider.value;
  });

  saveBtn.addEventListener('click', saveSleepEntry);
  viewBtn.addEventListener('click', viewSleepHistory);
}

function saveSleepEntry() {
  const date = document.getElementById('sleepDate').value;
  const bedtime = document.getElementById('bedtime').value;
  const waketime = document.getElementById('waketime').value;
  const quality = document.getElementById('sleepQuality').value;
  const notes = document.getElementById('sleepNotes').value;

  if (!bedtime || !waketime) {
    showToast('Please enter both bedtime and wake time', 'warning');
    return;
  }

  const sleepData = getStoredJSON('fbSleepLog', []);
  const entry = {
    date,
    bedtime,
    waketime,
    quality: parseInt(quality),
    notes,
    duration: calculateSleepDuration(bedtime, waketime)
  };

  // Remove existing entry for this date
  const filtered = sleepData.filter(e => e.date !== date);
  filtered.push(entry);

  setStoredJSON('fbSleepLog', filtered);

  showToast('Sleep entry saved!', 'success');
  logEvent('sleep_entry_saved', 'log', entry.duration);
}

function calculateSleepDuration(bedtime, waketime) {
  const bed = new Date(`2000-01-01T${bedtime}`);
  const wake = new Date(`2000-01-01T${waketime}`);

  // Handle overnight sleep
  if (wake < bed) {
    wake.setDate(wake.getDate() + 1);
  }

  return (wake - bed) / (1000 * 60 * 60); // hours
}

function viewSleepHistory() {
  const entries = getStoredJSON('fbSleepLog', []);

  if (entries.length === 0) {
    showToast('No sleep entries found', 'info');
    return;
  }

  // Sort by date
  entries.sort((a, b) => new Date(b.date) - new Date(a.date));

  const historyHtml = entries.slice(0, 30).map(entry => `
    <div class="sleep-entry">
      <div class="entry-header">
        <span class="entry-date">${new Date(entry.date).toLocaleDateString()}</span>
        <span class="entry-duration">${entry.duration.toFixed(1)}h</span>
        <span class="entry-quality">Quality: ${entry.quality}/10</span>
      </div>
      ${entry.notes ? `<div class="entry-notes">${entry.notes}</div>` : ''}
    </div>
  `).join('');

  const modalContent = `
    <div class="sleep-history">
      <h3>Sleep History</h3>
      <div class="entries-list">
        ${historyHtml}
      </div>
    </div>
  `;

  showModal(modalContent, { title: 'Sleep History', size: 'large' });
}

// Start sleep tool timer
function startSleepToolTimer(tool) {
  window.sleepToolStartTime = Date.now();

  // Update timer display every second
  window.sleepToolInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - window.sleepToolStartTime) / 1000);
    const timerEl = document.getElementById('sleepToolTimer');
    if (timerEl) {
      timerEl.textContent = formatTime(elapsed);
    }
  }, 1000);
}

// Close sleep tool
function closeSleepTool() {
  // Calculate usage time
  if (window.sleepToolStartTime) {
    const usageTime = Math.floor((Date.now() - window.sleepToolStartTime) / 1000);

    // Log usage
    const toolId = window.currentSleepTool;
    if (toolId) {
      logEvent('sleep_tool_used', toolId, usageTime);

      // Save usage data
      saveSleepToolUsage(toolId, usageTime);
    }
  }

  // Clear timers
  if (window.sleepToolInterval) {
    clearInterval(window.sleepToolInterval);
  }

  // Close modal
  hideModal();

  // Update stats
  loadSleepStats();

  window.sleepToolStartTime = null;
  window.currentSleepTool = null;
}

// Save sleep tool usage
function saveSleepToolUsage(toolId, duration) {
  const usageData = getStoredJSON('fbSleepUsage', {});
  const today = new Date().toISOString().slice(0, 10);

  if (!usageData[today]) {
    usageData[today] = { tools: {}, totalTime: 0 };
  }

  if (!usageData[today].tools[toolId]) {
    usageData[today].tools[toolId] = { count: 0, totalTime: 0 };
  }

  usageData[today].tools[toolId].count++;
  usageData[today].tools[toolId].totalTime += duration;
  usageData[today].totalTime += duration;

  setStoredJSON('fbSleepUsage', usageData);
}

// Load sleep stats
function loadSleepStats() {
  const sleepData = getStoredJSON('fbSleepLog', []);
  const usageData = getStoredJSON('fbSleepUsage', {});

  if (sleepData.length === 0) {
    document.getElementById('avgSleepTime').textContent = 'No data';
    document.getElementById('sleepStreak').textContent = '0';
    document.getElementById('sleepQuality').textContent = 'Unknown';
    return;
  }

  // Calculate average sleep time
  const totalHours = sleepData.reduce((sum, entry) => sum + entry.duration, 0);
  const avgHours = totalHours / sleepData.length;
  document.getElementById('avgSleepTime').textContent = `${avgHours.toFixed(1)}h`;

  // Calculate sleep streak (consecutive days with entries)
  const streak = calculateSleepStreak(sleepData);
  document.getElementById('sleepStreak').textContent = streak;

  // Calculate average quality
  const avgQuality = sleepData.reduce((sum, entry) => sum + entry.quality, 0) / sleepData.length;
  const qualityText = avgQuality >= 8 ? 'Excellent' : avgQuality >= 6 ? 'Good' : avgQuality >= 4 ? 'Fair' : 'Poor';
  document.getElementById('sleepQuality').textContent = qualityText;
}

// Calculate sleep streak
function calculateSleepStreak(sleepData) {
  if (sleepData.length === 0) return 0;

  // Sort by date descending
  const sorted = [...sleepData].sort((a, b) => new Date(b.date) - new Date(a.date));

  let streak = 0;
  let currentDate = new Date();

  for (const entry of sorted) {
    const entryDate = new Date(entry.date);

    // Check if entry is for today or yesterday (allowing for some flexibility)
    const daysDiff = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));

    if (daysDiff <= 1) {
      streak++;
      currentDate = entryDate;
    } else {
      break;
    }
  }

  return streak;
}

// Get all sleep tools
function getAllSleepTools() {
  const categories = ['wind-down', 'sounds', 'routines', 'tracking'];
  const allTools = [];

  categories.forEach(category => {
    allTools.push(...getSleepToolsForCategory(category));
  });

  return allTools;
}