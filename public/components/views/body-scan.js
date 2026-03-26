// Body Scan View Component
export function renderBodyScanView() {
  return `
    <div class="view body-scan-view">
      <div class="view-header">
        <h2>Body Scan Meditation</h2>
        <p class="view-subtitle">Systematic relaxation from head to toe</p>
      </div>

      <div class="body-scan-content">
        <div class="scan-setup">
          <div class="setup-instructions">
            <h3>Preparation</h3>
            <ul>
              <li>Lie down or sit comfortably in a quiet space</li>
              <li>Close your eyes and take a few deep breaths</li>
              <li>Allow yourself to fully relax into this practice</li>
              <li>The scan will take about 10 minutes</li>
            </ul>
            <button class="start-scan-btn" onclick="startBodyScan()">Begin Body Scan</button>
          </div>

          <div class="scan-progress">
            <div class="progress-visualization">
              <div class="body-outline">
                <div class="body-part head" data-part="head">
                  <div class="part-label">Head</div>
                </div>
                <div class="body-part neck" data-part="neck">
                  <div class="part-label">Neck</div>
                </div>
                <div class="body-part shoulders" data-part="shoulders">
                  <div class="part-label">Shoulders</div>
                </div>
                <div class="body-part arms" data-part="arms">
                  <div class="part-label">Arms</div>
                </div>
                <div class="body-part chest" data-part="chest">
                  <div class="part-label">Chest</div>
                </div>
                <div class="body-part back" data-part="back">
                  <div class="part-label">Back</div>
                </div>
                <div class="body-part abdomen" data-part="abdomen">
                  <div class="part-label">Abdomen</div>
                </div>
                <div class="body-part hips" data-part="hips">
                  <div class="part-label">Hips</div>
                </div>
                <div class="body-part legs" data-part="legs">
                  <div class="part-label">Legs</div>
                </div>
                <div class="body-part feet" data-part="feet">
                  <div class="part-label">Feet</div>
                </div>
              </div>
            </div>

            <div class="scan-controls" id="scanControls" style="display: none;">
              <div class="current-focus">
                <div class="focus-label">Focusing on:</div>
                <div class="focus-area" id="currentFocusArea">Preparing...</div>
              </div>

              <div class="scan-timer">
                <div class="timer-display" id="scanTimer">00:00</div>
                <div class="timer-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" id="scanProgress" style="width: 0%"></div>
                  </div>
                </div>
              </div>

              <div class="control-buttons">
                <button class="control-btn" onclick="pauseBodyScan()">
                  <span class="control-icon" id="pausePlayIcon">⏸</span>
                  <span id="pausePlayText">Pause</span>
                </button>
                <button class="control-btn stop" onclick="stopBodyScan()">
                  <span class="control-icon">⏹</span>
                  <span>Stop</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="scan-instructions" id="scanInstructions">
          <div class="instruction-card">
            <h4>During the Scan</h4>
            <p>Bring your attention to each part of your body as it's highlighted. Notice any sensations without judgment. If your mind wanders, gently bring it back to the current body part.</p>
          </div>
        </div>

        <div class="scan-history">
          <h3>Recent Sessions</h3>
          <div class="history-list" id="scanHistory">
            <!-- Body scan history will be populated here -->
          </div>
        </div>
      </div>
    </div>
  `;
}

// Initialize body scan view
export function initBodyScanView() {
  // Load scan history
  loadBodyScanHistory();
}

// Start body scan meditation
function startBodyScan() {
  // Define scan sequence with timing
  const scanSequence = [
    { part: 'preparation', duration: 30, instruction: 'Get comfortable and take a few deep breaths' },
    { part: 'head', duration: 45, instruction: 'Notice your forehead, eyes, cheeks, and jaw. Allow them to relax completely.' },
    { part: 'neck', duration: 30, instruction: 'Feel your neck and throat. Release any tension in these areas.' },
    { part: 'shoulders', duration: 45, instruction: 'Bring awareness to your shoulders. Let them drop and relax.' },
    { part: 'arms', duration: 60, instruction: 'Scan down your arms to your elbows, forearms, wrists, and hands. Feel them becoming heavy and relaxed.' },
    { part: 'chest', duration: 45, instruction: 'Notice your chest and upper back. Allow your breathing to be natural and easy.' },
    { part: 'back', duration: 60, instruction: 'Feel your entire back from shoulders to lower back. Release any holding or tension.' },
    { part: 'abdomen', duration: 45, instruction: 'Bring attention to your abdomen. Feel it rise and fall with each breath.' },
    { part: 'hips', duration: 45, instruction: 'Notice your hips and pelvic area. Allow them to relax into the surface beneath you.' },
    { part: 'legs', duration: 75, instruction: 'Scan your thighs, knees, calves, and shins. Feel them becoming warm and heavy.' },
    { part: 'feet', duration: 60, instruction: 'Finally, bring awareness to your feet and toes. Feel them completely relaxed.' },
    { part: 'completion', duration: 60, instruction: 'Take a moment to feel your whole body relaxed. When ready, gently open your eyes.' }
  ];

  // Calculate total duration
  const totalDuration = scanSequence.reduce((sum, step) => sum + step.duration, 0);

  // Initialize scan state
  window.bodyScanState = {
    sequence: scanSequence,
    currentStep: 0,
    totalDuration,
    elapsedTime: 0,
    isPaused: false,
    intervalId: null,
    startTime: Date.now()
  };

  // Show controls
  document.getElementById('scanControls').style.display = 'block';

  // Start the scan
  proceedToNextScanStep();

  // Log event
  logEvent('body_scan_started', 'meditation', totalDuration);
}

// Proceed to next scan step
function proceedToNextScanStep() {
  const state = window.bodyScanState;
  if (!state || state.currentStep >= state.sequence.length) {
    completeBodyScan();
    return;
  }

  const step = state.sequence[state.currentStep];

  // Update UI for current step
  updateScanUI(step);

  // Start timer for this step
  let stepElapsed = 0;
  const stepDuration = step.part === 'preparation' ? step.duration : step.duration;

  state.stepIntervalId = setInterval(() => {
    if (state.isPaused) return;

    stepElapsed++;

    // Update progress
    const stepProgress = (stepElapsed / stepDuration) * 100;
    document.getElementById('scanProgress').style.width = `${stepProgress}%`;

    // Update timer
    const remaining = state.totalDuration - state.elapsedTime - stepElapsed;
    document.getElementById('scanTimer').textContent = formatTime(remaining);

    if (stepElapsed >= stepDuration) {
      clearInterval(state.stepIntervalId);
      state.currentStep++;
      state.elapsedTime += stepDuration;
      proceedToNextScanStep();
    }
  }, 1000);
}

// Update scan UI for current step
function updateScanUI(step) {
  // Update current focus area
  document.getElementById('currentFocusArea').textContent =
    step.part.charAt(0).toUpperCase() + step.part.slice(1);

  // Highlight current body part
  document.querySelectorAll('.body-part').forEach(part => {
    part.classList.remove('active');
  });

  if (step.part !== 'preparation' && step.part !== 'completion') {
    const currentPart = document.querySelector(`.body-part[data-part="${step.part}"]`);
    if (currentPart) {
      currentPart.classList.add('active');
    }
  }

  // Update instructions
  document.getElementById('scanInstructions').innerHTML = `
    <div class="instruction-card">
      <h4>Current Focus</h4>
      <p>${step.instruction}</p>
    </div>
  `;
}

// Pause/resume body scan
function pauseBodyScan() {
  const state = window.bodyScanState;
  if (!state) return;

  state.isPaused = !state.isPaused;

  const pausePlayIcon = document.getElementById('pausePlayIcon');
  const pausePlayText = document.getElementById('pausePlayText');

  if (state.isPaused) {
    pausePlayIcon.textContent = '▶';
    pausePlayText.textContent = 'Resume';
    showToast('Body scan paused', 'info');
  } else {
    pausePlayIcon.textContent = '⏸';
    pausePlayText.textContent = 'Pause';
    showToast('Body scan resumed', 'info');
  }
}

// Stop body scan
function stopBodyScan() {
  const state = window.bodyScanState;
  if (!state) return;

  // Clear intervals
  if (state.stepIntervalId) {
    clearInterval(state.stepIntervalId);
  }

  // Reset UI
  resetScanUI();

  // Clear state
  window.bodyScanState = null;

  logEvent('body_scan_stopped', 'meditation');
  showToast('Body scan stopped', 'info');
}

// Complete body scan
function completeBodyScan() {
  const state = window.bodyScanState;
  if (!state) return;

  // Clear intervals
  if (state.stepIntervalId) {
    clearInterval(state.stepIntervalId);
  }

  // Reset UI
  resetScanUI();

  // Save completion
  saveBodyScanSession(state);

  // Update history
  loadBodyScanHistory();

  logEvent('body_scan_completed', 'meditation', state.totalDuration);
  showToast('Body scan completed! 🌸', 'success');

  // Clear state
  window.bodyScanState = null;
}

// Reset scan UI to initial state
function resetScanUI() {
  // Hide controls
  document.getElementById('scanControls').style.display = 'none';

  // Clear highlights
  document.querySelectorAll('.body-part').forEach(part => {
    part.classList.remove('active');
  });

  // Reset progress
  document.getElementById('scanProgress').style.width = '0%';
  document.getElementById('scanTimer').textContent = '00:00';
  document.getElementById('currentFocusArea').textContent = 'Preparing...';

  // Reset instructions
  document.getElementById('scanInstructions').innerHTML = `
    <div class="instruction-card">
      <h4>During the Scan</h4>
      <p>Bring your attention to each part of your body as it's highlighted. Notice any sensations without judgment. If your mind wanders, gently bring it back to the current body part.</p>
    </div>
  `;
}

// Save body scan session
function saveBodyScanSession(state) {
  const scanData = getStoredJSON('fbBodyScanData', []);
  const session = {
    id: crypto.randomUUID(),
    duration: state.totalDuration,
    completed: new Date().toISOString(),
    steps: state.sequence.length
  };

  scanData.push(session);

  // Keep only last 50 sessions
  if (scanData.length > 50) {
    scanData.splice(0, scanData.length - 50);
  }

  setStoredJSON('fbBodyScanData', scanData);
}

// Load body scan history
function loadBodyScanHistory() {
  const scanData = getStoredJSON('fbBodyScanData', []);
  const container = document.getElementById('scanHistory');

  if (!container) return;

  if (scanData.length === 0) {
    container.innerHTML = '<p class="no-history">No body scan sessions yet. Try your first one!</p>';
    return;
  }

  // Sort by completion time (most recent first)
  const sortedSessions = scanData.sort((a, b) =>
    new Date(b.completed) - new Date(a.completed)
  );

  container.innerHTML = sortedSessions.slice(0, 5).map(session => {
    const date = new Date(session.completed);
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = date.toLocaleDateString();

    return `
      <div class="history-entry">
        <div class="history-icon">🧘</div>
        <div class="history-info">
          <div class="history-name">Body Scan</div>
          <div class="history-time">${timeString} • ${dateString}</div>
          <div class="history-duration">${Math.ceil(session.duration / 60)} minutes</div>
        </div>
      </div>
    `;
  }).join('');
}