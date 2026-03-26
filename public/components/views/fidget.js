// Fidget Tools View Component
export function renderFidgetView() {
  return `
    <div class="view fidget-view">
      <div class="view-header">
        <h2>Fidget Tools</h2>
        <p class="view-subtitle">Interactive tools to help with focus and sensory stimulation</p>
      </div>

      <div class="fidget-content">
        <div class="fidget-categories">
          <div class="category-grid">
            <div class="fidget-category" onclick="loadFidgetCategory('visual')">
              <div class="category-icon">👁️</div>
              <div class="category-name">Visual</div>
              <div class="category-description">Color patterns and animations</div>
            </div>

            <div class="fidget-category" onclick="loadFidgetCategory('interactive')">
              <div class="category-icon">🖱️</div>
              <div class="category-name">Interactive</div>
              <div class="category-description">Click and drag tools</div>
            </div>

            <div class="fidget-category" onclick="loadFidgetCategory('rhythm')">
              <div class="category-icon">🥁</div>
              <div class="category-name">Rhythm</div>
              <div class="category-description">Sound and timing patterns</div>
            </div>

            <div class="fidget-category" onclick="loadFidgetCategory('math')">
              <div class="category-icon">🔢</div>
              <div class="category-name">Math</div>
              <div class="category-description">Numbers and calculations</div>
            </div>
          </div>
        </div>

        <div class="fidget-tools" id="fidgetTools">
          <!-- Fidget tools will be loaded here -->
        </div>

        <div class="fidget-stats">
          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-content">
              <div class="stat-value" id="toolsUsed">0</div>
              <div class="stat-label">Tools Used Today</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-content">
              <div class="stat-value" id="timeSpent">0m</div>
              <div class="stat-label">Time Spent</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-content">
              <div class="stat-value" id="favoriteTool">None</div>
              <div class="stat-label">Favorite Tool</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Initialize fidget view
export function initFidgetView() {
  // Load visual category by default
  loadFidgetCategory('visual');

  // Load stats
  loadFidgetStats();
}

// Load fidget tools for category
function loadFidgetCategory(category) {
  // Update category selection
  document.querySelectorAll('.fidget-category').forEach(cat => {
    cat.classList.remove('active');
  });
  event.currentTarget.classList.add('active');

  const toolsContainer = document.getElementById('fidgetTools');
  if (!toolsContainer) return;

  const tools = getFidgetToolsForCategory(category);
  toolsContainer.innerHTML = tools.map(tool => `
    <div class="fidget-tool-card" onclick="startFidgetTool('${tool.id}')">
      <div class="tool-icon">${tool.icon}</div>
      <div class="tool-info">
        <h4 class="tool-name">${tool.name}</h4>
        <p class="tool-description">${tool.description}</p>
      </div>
      <div class="tool-action">
        <button class="tool-btn">Try It</button>
      </div>
    </div>
  `).join('');
}

// Get fidget tools for category
function getFidgetToolsForCategory(category) {
  const categories = {
    visual: [
      {
        id: 'color-cycles',
        name: 'Color Cycles',
        description: 'Smoothly changing colors and patterns',
        icon: '🌈',
        component: 'colorCycles'
      },
      {
        id: 'ripple-effect',
        name: 'Ripple Effect',
        description: 'Interactive water ripple simulation',
        icon: '💧',
        component: 'rippleEffect'
      },
      {
        id: 'particle-flow',
        name: 'Particle Flow',
        description: 'Flowing particles with mouse interaction',
        icon: '✨',
        component: 'particleFlow'
      },
      {
        id: 'mandala-spinner',
        name: 'Mandala Spinner',
        description: 'Rotating mandala patterns',
        icon: '🌀',
        component: 'mandalaSpinner'
      }
    ],
    interactive: [
      {
        id: 'drag-shapes',
        name: 'Drag Shapes',
        description: 'Move and arrange geometric shapes',
        icon: '🔷',
        component: 'dragShapes'
      },
      {
        id: 'click-counter',
        name: 'Click Counter',
        description: 'Count clicks with satisfying feedback',
        icon: '👆',
        component: 'clickCounter'
      },
      {
        id: 'slider-puzzle',
        name: 'Slider Puzzle',
        description: 'Slide tiles to complete the picture',
        icon: '🧩',
        component: 'sliderPuzzle'
      },
      {
        id: 'drawing-canvas',
        name: 'Drawing Canvas',
        description: 'Free-form drawing with smooth lines',
        icon: '✏️',
        component: 'drawingCanvas'
      }
    ],
    rhythm: [
      {
        id: 'metronome',
        name: 'Metronome',
        description: 'Adjustable tempo with visual and audio cues',
        icon: '⏰',
        component: 'metronome'
      },
      {
        id: 'rhythm-patterns',
        name: 'Rhythm Patterns',
        description: 'Create and play rhythmic sequences',
        icon: '🥁',
        component: 'rhythmPatterns'
      },
      {
        id: 'sound-waves',
        name: 'Sound Waves',
        description: 'Visualize sound frequencies',
        icon: '〰️',
        component: 'soundWaves'
      },
      {
        id: 'pulse-generator',
        name: 'Pulse Generator',
        description: 'Generate pulsing patterns and sounds',
        icon: '💓',
        component: 'pulseGenerator'
      }
    ],
    math: [
      {
        id: 'number-spiral',
        name: 'Number Spiral',
        description: 'Watch numbers arrange in spiral patterns',
        icon: '🌀',
        component: 'numberSpiral'
      },
      {
        id: 'prime-finder',
        name: 'Prime Finder',
        description: 'Discover prime numbers interactively',
        icon: '🔢',
        component: 'primeFinder'
      },
      {
        id: 'fibonacci-sequence',
        name: 'Fibonacci Sequence',
        description: 'Explore the famous number sequence',
        icon: '🌿',
        component: 'fibonacciSequence'
      },
      {
        id: 'math-patterns',
        name: 'Math Patterns',
        description: 'Generate and explore mathematical patterns',
        icon: '📐',
        component: 'mathPatterns'
      }
    ]
  };

  return categories[category] || [];
}

// Start fidget tool
function startFidgetTool(toolId) {
  const allTools = getAllFidgetTools();
  const tool = allTools.find(t => t.id === toolId);

  if (!tool) return;

  // Create tool modal
  const modalContent = `
    <div class="fidget-tool-modal">
      <div class="tool-header">
        <h3>${tool.name}</h3>
        <button class="close-tool" onclick="closeFidgetTool()">×</button>
      </div>
      <div class="tool-canvas" id="toolCanvas">
        <!-- Tool content will be loaded here -->
      </div>
      <div class="tool-controls">
        <div class="tool-timer" id="toolTimer">00:00</div>
        <button class="tool-control-btn" onclick="closeFidgetTool()">Done</button>
      </div>
    </div>
  `;

  showModal(modalContent, { title: tool.name, size: 'large', closable: false });

  // Load tool component
  loadFidgetToolComponent(tool);

  // Start usage timer
  startFidgetToolTimer(tool);

  // Log usage
  logEvent('fidget_tool_started', toolId, 0, { category: tool.category });
}

// Load fidget tool component
function loadFidgetToolComponent(tool) {
  const canvas = document.getElementById('toolCanvas');
  if (!canvas) return;

  // Simple implementations for demo - in real app these would be more sophisticated
  switch (tool.component) {
    case 'colorCycles':
      canvas.innerHTML = `
        <div class="color-cycles">
          <div class="color-wheel" id="colorWheel"></div>
          <div class="cycle-controls">
            <button onclick="toggleColorCycle()">Toggle Animation</button>
            <input type="range" id="cycleSpeed" min="1" max="10" value="3">
          </div>
        </div>
      `;
      initColorCycles();
      break;

    case 'rippleEffect':
      canvas.innerHTML = `
        <div class="ripple-canvas" id="rippleCanvas" style="width: 100%; height: 300px; background: #f0f0f0; border-radius: 8px;"></div>
      `;
      initRippleEffect();
      break;

    case 'clickCounter':
      canvas.innerHTML = `
        <div class="click-counter">
          <div class="counter-display" id="clickCount">0</div>
          <button class="big-click-btn" id="clickBtn">Click Me!</button>
          <div class="counter-stats">
            <div>Clicks: <span id="totalClicks">0</span></div>
            <div>Combo: <span id="clickCombo">0</span></div>
          </div>
        </div>
      `;
      initClickCounter();
      break;

    case 'metronome':
      canvas.innerHTML = `
        <div class="metronome">
          <div class="tempo-display">
            <div class="tempo-value" id="tempoValue">120</div>
            <div class="tempo-label">BPM</div>
          </div>
          <input type="range" id="tempoSlider" min="40" max="200" value="120">
          <div class="metronome-visual">
            <div class="pendulum" id="pendulum"></div>
          </div>
          <div class="metronome-controls">
            <button id="startMetronome">Start</button>
            <button id="stopMetronome">Stop</button>
          </div>
        </div>
      `;
      initMetronome();
      break;

    default:
      canvas.innerHTML = `
        <div class="tool-placeholder">
          <div class="placeholder-icon">${tool.icon}</div>
          <p>${tool.name} - Interactive tool coming soon!</p>
          <p>This is a placeholder for the ${tool.component} component.</p>
        </div>
      `;
  }
}

// Simple color cycles implementation
function initColorCycles() {
  const wheel = document.getElementById('colorWheel');
  const speedSlider = document.getElementById('cycleSpeed');

  if (!wheel) return;

  let isAnimating = true;
  let hue = 0;

  function animate() {
    if (!isAnimating) return;

    hue = (hue + 1) % 360;
    wheel.style.background = `hsl(${hue}, 70%, 60%)`;

    setTimeout(animate, 100 - (speedSlider ? speedSlider.value * 8 : 24));
  }

  animate();

  // Make it globally available for toggle
  window.toggleColorCycle = () => {
    isAnimating = !isAnimating;
    if (isAnimating) animate();
  };
}

// Simple ripple effect
function initRippleEffect() {
  const canvas = document.getElementById('rippleCanvas');
  if (!canvas) return;

  canvas.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = e.offsetX + 'px';
    ripple.style.top = e.offsetY + 'px';

    canvas.appendChild(ripple);

    setTimeout(() => ripple.remove(), 1000);
  });
}

// Click counter implementation
function initClickCounter() {
  const countDisplay = document.getElementById('clickCount');
  const totalDisplay = document.getElementById('totalClicks');
  const comboDisplay = document.getElementById('clickCombo');
  const button = document.getElementById('clickBtn');

  if (!countDisplay || !button) return;

  let totalClicks = 0;
  let combo = 0;
  let comboTimeout;

  button.addEventListener('click', () => {
    totalClicks++;
    combo++;

    countDisplay.textContent = combo;
    totalDisplay.textContent = totalClicks;
    comboDisplay.textContent = combo;

    // Reset combo after 2 seconds
    clearTimeout(comboTimeout);
    comboTimeout = setTimeout(() => {
      combo = 0;
      comboDisplay.textContent = combo;
    }, 2000);

    // Visual feedback
    button.style.transform = 'scale(0.95)';
    setTimeout(() => button.style.transform = '', 100);
  });
}

// Metronome implementation
function initMetronome() {
  const tempoValue = document.getElementById('tempoValue');
  const tempoSlider = document.getElementById('tempoSlider');
  const pendulum = document.getElementById('pendulum');
  const startBtn = document.getElementById('startMetronome');
  const stopBtn = document.getElementById('stopMetronome');

  if (!tempoValue || !pendulum) return;

  let isRunning = false;
  let intervalId;

  tempoSlider.addEventListener('input', (e) => {
    tempoValue.textContent = e.target.value;
  });

  startBtn.addEventListener('click', () => {
    if (isRunning) return;

    isRunning = true;
    const bpm = parseInt(tempoSlider.value);
    const interval = (60 / bpm) * 1000;

    intervalId = setInterval(() => {
      // Visual beat
      pendulum.style.transform = 'rotate(30deg)';
      setTimeout(() => pendulum.style.transform = 'rotate(-30deg)', interval / 4);

      // Audio beat (simple click)
      if (window.playNotificationSound) {
        window.playNotificationSound();
      }
    }, interval);
  });

  stopBtn.addEventListener('click', () => {
    isRunning = false;
    clearInterval(intervalId);
  });
}

// Start fidget tool timer
function startFidgetToolTimer(tool) {
  window.fidgetToolStartTime = Date.now();

  // Update timer display every second
  window.fidgetToolInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - window.fidgetToolStartTime) / 1000);
    const timerEl = document.getElementById('toolTimer');
    if (timerEl) {
      timerEl.textContent = formatTime(elapsed);
    }
  }, 1000);
}

// Close fidget tool
function closeFidgetTool() {
  // Calculate usage time
  if (window.fidgetToolStartTime) {
    const usageTime = Math.floor((Date.now() - window.fidgetToolStartTime) / 1000);

    // Log usage
    const toolId = window.currentFidgetTool;
    if (toolId) {
      logEvent('fidget_tool_used', toolId, usageTime);

      // Save usage data
      saveFidgetToolUsage(toolId, usageTime);
    }
  }

  // Clear timers
  if (window.fidgetToolInterval) {
    clearInterval(window.fidgetToolInterval);
  }

  // Close modal
  hideModal();

  // Update stats
  loadFidgetStats();

  window.fidgetToolStartTime = null;
  window.currentFidgetTool = null;
}

// Save fidget tool usage
function saveFidgetToolUsage(toolId, duration) {
  const usageData = getStoredJSON('fbFidgetUsage', {});
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

  setStoredJSON('fbFidgetUsage', usageData);
}

// Load fidget stats
function loadFidgetStats() {
  const usageData = getStoredJSON('fbFidgetUsage', {});
  const today = new Date().toISOString().slice(0, 10);

  const todayData = usageData[today] || { tools: {}, totalTime: 0 };

  // Tools used today
  const toolsUsed = Object.keys(todayData.tools).length;
  document.getElementById('toolsUsed').textContent = toolsUsed;

  // Time spent today
  const timeSpent = Math.floor(todayData.totalTime / 60);
  document.getElementById('timeSpent').textContent = `${timeSpent}m`;

  // Favorite tool
  const favorite = findFavoriteFidgetTool(usageData);
  document.getElementById('favoriteTool').textContent = favorite || 'None';
}

// Find favorite fidget tool
function findFavoriteFidgetTool(usageData) {
  const toolCounts = {};

  // Count usage across all days
  Object.values(usageData).forEach(dayData => {
    Object.entries(dayData.tools || {}).forEach(([toolId, data]) => {
      toolCounts[toolId] = (toolCounts[toolId] || 0) + data.count;
    });
  });

  // Find most used
  let favorite = null;
  let maxCount = 0;

  Object.entries(toolCounts).forEach(([toolId, count]) => {
    if (count > maxCount) {
      maxCount = count;
      favorite = getFidgetToolName(toolId);
    }
  });

  return favorite;
}

// Get fidget tool name by ID
function getFidgetToolName(toolId) {
  const allTools = getAllFidgetTools();
  const tool = allTools.find(t => t.id === toolId);
  return tool ? tool.name : toolId;
}

// Get all fidget tools
function getAllFidgetTools() {
  const categories = ['visual', 'interactive', 'rhythm', 'math'];
  const allTools = [];

  categories.forEach(category => {
    allTools.push(...getFidgetToolsForCategory(category));
  });

  return allTools;
}