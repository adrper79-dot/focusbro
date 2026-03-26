// Movement & Exercise View Component
export function renderMovementView() {
  return `
    <div class="view movement-view">
      <div class="view-header">
        <h2>Movement & Exercise</h2>
        <p class="view-subtitle">Get moving to boost focus and energy</p>
      </div>

      <div class="movement-content">
        <div class="movement-quick-start">
          <h3>Quick Start</h3>
          <div class="quick-exercises">
            <button class="exercise-btn" onclick="startExercise('desk-stretch')">
              <div class="exercise-icon">🧘</div>
              <div class="exercise-info">
                <div class="exercise-name">Desk Stretches</div>
                <div class="exercise-duration">5 min</div>
              </div>
            </button>

            <button class="exercise-btn" onclick="startExercise('walk')">
              <div class="exercise-icon">🚶</div>
              <div class="exercise-info">
                <div class="exercise-name">Quick Walk</div>
                <div class="exercise-duration">10 min</div>
              </div>
            </button>

            <button class="exercise-btn" onclick="startExercise('jumping-jacks')">
              <div class="exercise-icon">🤸</div>
              <div class="exercise-info">
                <div class="exercise-name">Jumping Jacks</div>
                <div class="exercise-duration">2 min</div>
              </div>
            </button>

            <button class="exercise-btn" onclick="startExercise('wall-sit')">
              <div class="exercise-icon">🧱</div>
              <div class="exercise-info">
                <div class="exercise-name">Wall Sit</div>
                <div class="exercise-duration">1 min</div>
              </div>
            </button>
          </div>
        </div>

        <div class="movement-tracker">
          <h3>Today's Movement</h3>
          <div class="movement-stats">
            <div class="stat-item">
              <div class="stat-icon">🏃</div>
              <div class="stat-content">
                <div class="stat-value" id="stepsToday">0</div>
                <div class="stat-label">Steps</div>
              </div>
            </div>

            <div class="stat-item">
              <div class="stat-icon">⏱️</div>
              <div class="stat-content">
                <div class="stat-value" id="activeMinutes">0</div>
                <div class="stat-label">Active Minutes</div>
              </div>
            </div>

            <div class="stat-item">
              <div class="stat-icon">🎯</div>
              <div class="stat-content">
                <div class="stat-value" id="caloriesBurned">0</div>
                <div class="stat-label">Calories</div>
              </div>
            </div>
          </div>

          <div class="movement-goals">
            <div class="goal-item">
              <label>Daily Steps Goal</label>
              <input type="number" id="stepsGoal" value="8000" min="1000" max="50000">
            </div>
            <div class="goal-item">
              <label>Active Minutes Goal</label>
              <input type="number" id="activeMinutesGoal" value="30" min="10" max="300">
            </div>
          </div>
        </div>

        <div class="movement-routines">
          <h3>Exercise Routines</h3>
          <div class="routine-cards">
            <div class="routine-card" onclick="startRoutine('focus-boost')">
              <div class="routine-icon">⚡</div>
              <div class="routine-info">
                <h4>Focus Boost</h4>
                <p>Quick exercises to improve concentration</p>
                <div class="routine-meta">8 min • 4 exercises</div>
              </div>
            </div>

            <div class="routine-card" onclick="startRoutine('energy-rush')">
              <div class="routine-icon">🔋</div>
              <div class="routine-info">
                <h4>Energy Rush</h4>
                <p>High-intensity moves for instant energy</p>
                <div class="routine-meta">12 min • 6 exercises</div>
              </div>
            </div>

            <div class="routine-card" onclick="startRoutine('desk-relief')">
              <div class="routine-icon">💺</div>
              <div class="routine-info">
                <h4>Desk Relief</h4>
                <p>Counteract sitting with targeted stretches</p>
                <div class="routine-meta">10 min • 5 exercises</div>
              </div>
            </div>

            <div class="routine-card" onclick="startRoutine('mindful-movement')">
              <div class="routine-icon">🧘</div>
              <div class="routine-info">
                <h4>Mindful Movement</h4>
                <p>Gentle flows combining breath and motion</p>
                <div class="routine-meta">15 min • 8 exercises</div>
              </div>
            </div>
          </div>
        </div>

        <div class="movement-history">
          <h3>Recent Activity</h3>
          <div class="activity-log" id="activityLog">
            <!-- Activity entries will be populated here -->
          </div>
        </div>
      </div>
    </div>
  `;
}

// Initialize movement view
export function initMovementView() {
  // Load movement data
  loadMovementData();

  // Set up goal input listeners
  setupGoalListeners();

  // Check for device motion sensors
  initMotionSensors();
}

// Load movement data and update UI
function loadMovementData() {
  const movementData = getStoredJSON('fbMovementData', {});
  const today = new Date().toISOString().slice(0, 10);

  // Update today's stats
  const todayData = movementData[today] || {
    steps: 0,
    activeMinutes: 0,
    caloriesBurned: 0,
    exercises: []
  };

  document.getElementById('stepsToday').textContent = todayData.steps.toLocaleString();
  document.getElementById('activeMinutes').textContent = todayData.activeMinutes;
  document.getElementById('caloriesBurned').textContent = todayData.caloriesBurned;

  // Update goals
  const goals = getStoredJSON('fbMovementGoals', { steps: 8000, activeMinutes: 30 });
  document.getElementById('stepsGoal').value = goals.steps;
  document.getElementById('activeMinutesGoal').value = goals.activeMinutes;

  // Update activity log
  updateActivityLog(todayData.exercises);
}

// Set up goal input listeners
function setupGoalListeners() {
  const stepsGoal = document.getElementById('stepsGoal');
  const activeMinutesGoal = document.getElementById('activeMinutesGoal');

  if (stepsGoal) {
    stepsGoal.addEventListener('change', (e) => {
      updateGoal('steps', parseInt(e.target.value));
    });
  }

  if (activeMinutesGoal) {
    activeMinutesGoal.addEventListener('change', (e) => {
      updateGoal('activeMinutes', parseInt(e.target.value));
    });
  }
}

// Update movement goal
function updateGoal(type, value) {
  const goals = getStoredJSON('fbMovementGoals', { steps: 8000, activeMinutes: 30 });
  goals[type] = Math.max(0, value);
  setStoredJSON('fbMovementGoals', goals);

  logEvent('goal_updated', 'movement', 0, { type, value });
  showToast(`${type} goal updated`, 'success');
}

// Initialize motion sensors for step counting
function initMotionSensors() {
  if (!window.DeviceMotionEvent) {
    console.log('Device motion not supported');
    return;
  }

  // Request permission for motion sensors (iOS 13+)
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          startMotionTracking();
        }
      })
      .catch(console.error);
  } else {
    // Android or older iOS
    startMotionTracking();
  }
}

// Start motion tracking for step counting
function startMotionTracking() {
  let stepCount = 0;
  let lastAcceleration = 0;
  let stepThreshold = 1.2; // Adjust based on device

  window.addEventListener('devicemotion', (event) => {
    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;

    // Simple step detection based on acceleration changes
    const totalAcceleration = Math.sqrt(
      acceleration.x * acceleration.x +
      acceleration.y * acceleration.y +
      acceleration.z * acceleration.z
    );

    if (Math.abs(totalAcceleration - lastAcceleration) > stepThreshold) {
      stepCount++;
      updateSteps(stepCount);
    }

    lastAcceleration = totalAcceleration;
  });

  // Update steps every few seconds
  setInterval(() => {
    if (stepCount > 0) {
      updateSteps(stepCount);
      stepCount = 0; // Reset for next interval
    }
  }, 5000);
}

// Update step count
function updateSteps(newSteps) {
  const movementData = getStoredJSON('fbMovementData', {});
  const today = new Date().toISOString().slice(0, 10);

  if (!movementData[today]) {
    movementData[today] = { steps: 0, activeMinutes: 0, caloriesBurned: 0, exercises: [] };
  }

  movementData[today].steps += newSteps;
  setStoredJSON('fbMovementData', movementData);

  // Update display
  document.getElementById('stepsToday').textContent = movementData[today].steps.toLocaleString();

  // Check goal achievement
  const goals = getStoredJSON('fbMovementGoals', { steps: 8000 });
  if (movementData[today].steps >= goals.steps) {
    showToast('Steps goal achieved! 🎉', 'success');
    logEvent('goal_achieved', 'movement', 0, { type: 'steps', value: movementData[today].steps });
  }
}

// Start quick exercise
function startExercise(type) {
  const exercises = {
    'desk-stretch': {
      name: 'Desk Stretches',
      duration: 300, // 5 minutes
      instructions: [
        'Neck rolls: Gently roll your head in circles',
        'Shoulder shrugs: Lift shoulders to ears and release',
        'Arm stretches: Reach arms overhead, then across body',
        'Wrist flexes: Extend arms and flex wrists up and down',
        'Seated twists: Gently twist torso side to side'
      ]
    },
    'walk': {
      name: 'Quick Walk',
      duration: 600, // 10 minutes
      instructions: [
        'Stand up and take a deep breath',
        'Walk at a brisk pace around your space',
        'Focus on your breathing and surroundings',
        'Notice how your body feels in motion',
        'Return to your seat feeling refreshed'
      ]
    },
    'jumping-jacks': {
      name: 'Jumping Jacks',
      duration: 120, // 2 minutes
      instructions: [
        'Start with feet together, arms at sides',
        'Jump feet apart while raising arms overhead',
        'Jump back to start position',
        'Repeat at a comfortable pace',
        'Breathe steadily throughout'
      ]
    },
    'wall-sit': {
      name: 'Wall Sit',
      duration: 60, // 1 minute
      instructions: [
        'Find a wall and slide down until knees are at 90 degrees',
        'Keep back flat against the wall',
        'Hold the position steadily',
        'Breathe deeply and focus on the burn',
        'Slide back up when time is complete'
      ]
    }
  };

  const exercise = exercises[type];
  if (!exercise) return;

  // Start timer
  startTimer(exercise.duration, (remaining) => {
    if (remaining <= 0) {
      completeExercise(exercise);
    }
  });

  // Show instructions
  showExerciseInstructions(exercise);

  logEvent('exercise_started', type, exercise.duration);
}

// Show exercise instructions
function showExerciseInstructions(exercise) {
  const instructionsHTML = exercise.instructions.map(instruction =>
    `<div class="exercise-step">${instruction}</div>`
  ).join('');

  const modalContent = `
    <div class="exercise-modal">
      <h3>${exercise.name}</h3>
      <div class="exercise-timer">
        <div class="timer-display" id="exerciseTimer">Starting...</div>
      </div>
      <div class="exercise-instructions">
        ${instructionsHTML}
      </div>
      <div class="exercise-controls">
        <button onclick="stopExercise()">Stop Exercise</button>
      </div>
    </div>
  `;

  showModal(modalContent, { title: 'Exercise in Progress', closable: false });

  // Update timer display
  const updateTimer = () => {
    const timerState = getTimerState();
    if (timerState.active) {
      document.getElementById('exerciseTimer').textContent =
        `Time remaining: ${formatTime(timerState.remaining)}`;
      setTimeout(updateTimer, 1000);
    }
  };
  updateTimer();
}

// Complete exercise
function completeExercise(exercise) {
  hideModal();

  // Log completion
  logEvent('exercise_completed', exercise.name.toLowerCase().replace(' ', '-'), exercise.duration);

  // Update movement data
  const movementData = getStoredJSON('fbMovementData', {});
  const today = new Date().toISOString().slice(0, 10);

  if (!movementData[today]) {
    movementData[today] = { steps: 0, activeMinutes: 0, caloriesBurned: 0, exercises: [] };
  }

  movementData[today].activeMinutes += Math.ceil(exercise.duration / 60);
  movementData[today].caloriesBurned += Math.ceil(exercise.duration / 60) * 5; // Rough estimate
  movementData[today].exercises.push({
    type: exercise.name.toLowerCase().replace(' ', '-'),
    duration: exercise.duration,
    completed: new Date().toISOString()
  });

  setStoredJSON('fbMovementData', movementData);

  // Update display
  loadMovementData();

  showToast(`${exercise.name} completed! Great job! 💪`, 'success');
}

// Stop exercise early
function stopExercise() {
  stopTimer();
  hideModal();
  showToast('Exercise stopped', 'info');
}

// Start exercise routine
function startRoutine(type) {
  const routines = {
    'focus-boost': {
      name: 'Focus Boost Routine',
      exercises: [
        { name: 'Deep Breathing', duration: 60 },
        { name: 'Neck Rolls', duration: 30 },
        { name: 'Arm Circles', duration: 60 },
        { name: 'Desk Push-ups', duration: 30 }
      ]
    },
    'energy-rush': {
      name: 'Energy Rush Routine',
      exercises: [
        { name: 'Jumping Jacks', duration: 60 },
        { name: 'High Knees', duration: 60 },
        { name: 'Burpees', duration: 45 },
        { name: 'Mountain Climbers', duration: 60 },
        { name: 'Squats', duration: 60 },
        { name: 'Plank', duration: 45 }
      ]
    },
    'desk-relief': {
      name: 'Desk Relief Routine',
      exercises: [
        { name: 'Seated Spinal Twist', duration: 60 },
        { name: 'Wrist and Finger Stretches', duration: 60 },
        { name: 'Seated Forward Bend', duration: 60 },
        { name: 'Shoulder Rolls', duration: 60 },
        { name: 'Ankle Rolls', duration: 60 }
      ]
    },
    'mindful-movement': {
      name: 'Mindful Movement Routine',
      exercises: [
        { name: 'Gentle Neck Stretches', duration: 60 },
        { name: 'Arm Swings', duration: 90 },
        { name: 'Standing Side Bend', duration: 60 },
        { name: 'Mindful Walking', duration: 180 },
        { name: 'Seated Meditation', duration: 120 },
        { name: 'Final Relaxation', duration: 90 }
      ]
    }
  };

  const routine = routines[type];
  if (!routine) return;

  // Start routine
  startRoutineExecution(routine);

  logEvent('routine_started', type, routine.exercises.reduce((sum, ex) => sum + ex.duration, 0));
}

// Execute routine step by step
function startRoutineExecution(routine) {
  let currentExerciseIndex = 0;

  const executeNextExercise = () => {
    if (currentExerciseIndex >= routine.exercises.length) {
      completeRoutine(routine);
      return;
    }

    const exercise = routine.exercises[currentExerciseIndex];

    // Show current exercise
    const modalContent = `
      <div class="exercise-modal">
        <h3>${routine.name}</h3>
        <div class="routine-progress">
          Exercise ${currentExerciseIndex + 1} of ${routine.exercises.length}
        </div>
        <div class="current-exercise">
          <h4>${exercise.name}</h4>
          <div class="exercise-timer">
            <div class="timer-display" id="routineTimer">Starting...</div>
          </div>
        </div>
        <div class="exercise-controls">
          <button onclick="skipExercise()">Skip</button>
          <button onclick="stopRoutine()">Stop Routine</button>
        </div>
      </div>
    `;

    showModal(modalContent, { title: 'Routine in Progress', closable: false });

    // Start timer for this exercise
    startTimer(exercise.duration, (remaining) => {
      if (remaining <= 0) {
        currentExerciseIndex++;
        hideModal();
        setTimeout(executeNextExercise, 1000); // Brief pause between exercises
      }
    });

    // Update timer display
    const updateTimer = () => {
      const timerState = getTimerState();
      if (timerState.active) {
        document.getElementById('routineTimer').textContent =
          `Time remaining: ${formatTime(timerState.remaining)}`;
        setTimeout(updateTimer, 1000);
      }
    };
    updateTimer();
  };

  executeNextExercise();
}

// Skip current exercise in routine
function skipExercise() {
  stopTimer();
  hideModal();
  // Routine will continue to next exercise
}

// Stop routine
function stopRoutine() {
  stopTimer();
  hideModal();
  showToast('Routine stopped', 'info');
}

// Complete routine
function completeRoutine(routine) {
  hideModal();

  const totalDuration = routine.exercises.reduce((sum, ex) => sum + ex.duration, 0);

  // Update movement data
  const movementData = getStoredJSON('fbMovementData', {});
  const today = new Date().toISOString().slice(0, 10);

  if (!movementData[today]) {
    movementData[today] = { steps: 0, activeMinutes: 0, caloriesBurned: 0, exercises: [] };
  }

  movementData[today].activeMinutes += Math.ceil(totalDuration / 60);
  movementData[today].caloriesBurned += Math.ceil(totalDuration / 60) * 6; // Slightly higher for routines
  movementData[today].exercises.push({
    type: 'routine',
    routineName: routine.name,
    duration: totalDuration,
    completed: new Date().toISOString()
  });

  setStoredJSON('fbMovementData', movementData);

  // Update display
  loadMovementData();

  logEvent('routine_completed', routine.name.toLowerCase().replace(/\s+/g, '-'), totalDuration);
  showToast(`${routine.name} completed! Amazing work! 🏆`, 'success');
}

// Update activity log
function updateActivityLog(exercises) {
  const container = document.getElementById('activityLog');
  if (!container) return;

  if (!exercises || exercises.length === 0) {
    container.innerHTML = '<p class="no-activity">No activity logged today. Start moving!</p>';
    return;
  }

  // Sort by completion time (most recent first)
  const sortedExercises = exercises.sort((a, b) =>
    new Date(b.completed) - new Date(a.completed)
  );

  container.innerHTML = sortedExercises.slice(0, 5).map(exercise => {
    const time = new Date(exercise.completed).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
      <div class="activity-entry">
        <div class="activity-icon">${getActivityIcon(exercise.type)}</div>
        <div class="activity-info">
          <div class="activity-name">${formatActivityName(exercise)}</div>
          <div class="activity-time">${time} • ${Math.ceil(exercise.duration / 60)} min</div>
        </div>
      </div>
    `;
  }).join('');
}

// Get icon for activity type
function getActivityIcon(type) {
  const icons = {
    'desk-stretch': '🧘',
    'walk': '🚶',
    'jumping-jacks': '🤸',
    'wall-sit': '🧱',
    'routine': '🏆',
    'default': '💪'
  };
  return icons[type] || icons.default;
}

// Format activity name for display
function formatActivityName(exercise) {
  if (exercise.routineName) {
    return exercise.routineName;
  }

  return exercise.type.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}