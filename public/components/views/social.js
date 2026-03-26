// Social Tools View Component
export function renderSocialView() {
  return `
    <div class="view social-view">
      <div class="view-header">
        <h2>Social Tools</h2>
        <p class="view-subtitle">Tools for managing social interactions and relationships</p>
      </div>

      <div class="social-content">
        <div class="social-categories">
          <div class="category-grid">
            <div class="social-category" onclick="loadSocialCategory('communication')">
              <div class="category-icon">💬</div>
              <div class="category-name">Communication</div>
              <div class="category-description">Better conversation skills</div>
            </div>

            <div class="social-category" onclick="loadSocialCategory('boundaries')">
              <div class="category-icon">🚧</div>
              <div class="category-name">Boundaries</div>
              <div class="category-description">Setting healthy limits</div>
            </div>

            <div class="social-category" onclick="loadSocialCategory('networking')">
              <div class="category-icon">🤝</div>
              <div class="category-name">Networking</div>
              <div class="category-description">Building connections</div>
            </div>

            <div class="social-category" onclick="loadSocialCategory('conflict')">
              <div class="category-icon">⚖️</div>
              <div class="category-name">Conflict</div>
              <div class="category-description">Resolving disagreements</div>
            </div>
          </div>
        </div>

        <div class="social-tools" id="socialTools">
          <!-- Social tools will be loaded here -->
        </div>

        <div class="social-stats">
          <div class="stat-card">
            <div class="stat-icon">💬</div>
            <div class="stat-content">
              <div class="stat-value" id="conversationsLogged">0</div>
              <div class="stat-label">Conversations Logged</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-content">
              <div class="stat-value" id="boundariesSet">0</div>
              <div class="stat-label">Boundaries Set</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-content">
              <div class="stat-value" id="socialGoal">None</div>
              <div class="stat-label">Current Goal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Initialize social view
export function initSocialView() {
  // Load communication category by default
  loadSocialCategory('communication');

  // Load social stats
  loadSocialStats();
}

// Load social tools for category
function loadSocialCategory(category) {
  // Update category selection
  document.querySelectorAll('.social-category').forEach(cat => {
    cat.classList.remove('active');
  });
  event.currentTarget.classList.add('active');

  const toolsContainer = document.getElementById('socialTools');
  if (!toolsContainer) return;

  const tools = getSocialToolsForCategory(category);
  toolsContainer.innerHTML = tools.map(tool => `
    <div class="social-tool-card" onclick="startSocialTool('${tool.id}')">
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

// Get social tools for category
function getSocialToolsForCategory(category) {
  const categories = {
    communication: [
      {
        id: 'active-listening',
        name: 'Active Listening',
        description: 'Practice techniques for better listening',
        icon: '👂',
        component: 'activeListening'
      },
      {
        id: 'conversation-starters',
        name: 'Conversation Starters',
        description: 'Helpful prompts for starting conversations',
        icon: '💭',
        component: 'conversationStarters'
      },
      {
        id: 'non-verbal-cues',
        name: 'Non-Verbal Cues',
        description: 'Understanding body language and tone',
        icon: '🙋',
        component: 'nonVerbalCues'
      },
      {
        id: 'empathy-building',
        name: 'Empathy Building',
        description: 'Exercises to develop empathy skills',
        icon: '❤️',
        component: 'empathyBuilding'
      }
    ],
    boundaries: [
      {
        id: 'boundary-setting',
        name: 'Boundary Setting',
        description: 'Define and communicate your boundaries',
        icon: '🚧',
        component: 'boundarySetting'
      },
      {
        id: 'saying-no',
        name: 'Saying No',
        description: 'Practice polite but firm refusals',
        icon: '🙅',
        component: 'sayingNo'
      },
      {
        id: 'personal-space',
        name: 'Personal Space',
        description: 'Understanding different space preferences',
        icon: '📏',
        component: 'personalSpace'
      },
      {
        id: 'time-boundaries',
        name: 'Time Boundaries',
        description: 'Managing time and availability',
        icon: '⏰',
        component: 'timeBoundaries'
      }
    ],
    networking: [
      {
        id: 'elevator-pitch',
        name: 'Elevator Pitch',
        description: 'Craft and practice your introduction',
        icon: '🏢',
        component: 'elevatorPitch'
      },
      {
        id: 'follow-up-strategies',
        name: 'Follow-Up Strategies',
        description: 'How to maintain new connections',
        icon: '📞',
        component: 'followUpStrategies'
      },
      {
        id: 'networking-events',
        name: 'Networking Events',
        description: 'Tips for successful networking',
        icon: '🎪',
        component: 'networkingEvents'
      },
      {
        id: 'relationship-mapping',
        name: 'Relationship Mapping',
        description: 'Visualize your social network',
        icon: '🗺️',
        component: 'relationshipMapping'
      }
    ],
    conflict: [
      {
        id: 'conflict-resolution',
        name: 'Conflict Resolution',
        description: 'Steps to resolve disagreements peacefully',
        icon: '🤝',
        component: 'conflictResolution'
      },
      {
        id: 'anger-management',
        name: 'Anger Management',
        description: 'Techniques to stay calm during conflict',
        icon: '😤',
        component: 'angerManagement'
      },
      {
        id: 'perspective-taking',
        name: 'Perspective Taking',
        description: 'See situations from others\' viewpoints',
        icon: '👁️',
        component: 'perspectiveTaking'
      },
      {
        id: 'apology-skills',
        name: 'Apology Skills',
        description: 'How to give and receive apologies effectively',
        icon: '🙏',
        component: 'apologySkills'
      }
    ]
  };

  return categories[category] || [];
}

// Start social tool
function startSocialTool(toolId) {
  const allTools = getAllSocialTools();
  const tool = allTools.find(t => t.id === toolId);

  if (!tool) return;

  // Create tool modal
  const modalContent = `
    <div class="social-tool-modal">
      <div class="tool-header">
        <h3>${tool.name}</h3>
        <button class="close-tool" onclick="closeSocialTool()">×</button>
      </div>
      <div class="tool-canvas" id="socialToolCanvas">
        <!-- Tool content will be loaded here -->
      </div>
      <div class="tool-controls">
        <div class="tool-timer" id="socialToolTimer">00:00</div>
        <button class="tool-control-btn" onclick="closeSocialTool()">Done</button>
      </div>
    </div>
  `;

  showModal(modalContent, { title: tool.name, size: 'large', closable: false });

  // Load tool component
  loadSocialToolComponent(tool);

  // Start usage timer
  startSocialToolTimer(tool);

  // Log usage
  logEvent('social_tool_started', toolId, 0, { category: tool.category });
}

// Load social tool component
function loadSocialToolComponent(tool) {
  const canvas = document.getElementById('socialToolCanvas');
  if (!canvas) return;

  switch (tool.component) {
    case 'activeListening':
      canvas.innerHTML = `
        <div class="active-listening">
          <div class="listening-exercise">
            <h4>Active Listening Practice</h4>
            <div class="exercise-step" id="listeningStep">
              <div class="step-number">1</div>
              <div class="step-content">
                <h5>Focus on the Speaker</h5>
                <p>Put away distractions and give your full attention to the person speaking.</p>
              </div>
            </div>
            <div class="exercise-controls">
              <button id="nextListeningStep">Next Step</button>
              <button id="practiceListening">Practice Scenario</button>
            </div>
          </div>
          <div class="listening-tips">
            <h5>Tips for Active Listening:</h5>
            <ul>
              <li>Maintain eye contact (but don't stare)</li>
              <li>Use encouraging body language</li>
              <li>Ask open-ended questions</li>
              <li>Paraphrase what you heard to confirm understanding</li>
              <li>Avoid interrupting or planning your response</li>
            </ul>
          </div>
        </div>
      `;
      initActiveListening();
      break;

    case 'conversationStarters':
      canvas.innerHTML = `
        <div class="conversation-starters">
          <div class="starter-categories">
            <button class="category-btn active" onclick="showStarterCategory('casual')">Casual</button>
            <button class="category-btn" onclick="showStarterCategory('professional')">Professional</button>
            <button class="category-btn" onclick="showStarterCategory('deep')">Deep</button>
          </div>
          <div class="starters-list" id="startersList">
            <!-- Starters will be loaded here -->
          </div>
          <div class="starter-practice">
            <textarea id="starterPractice" placeholder="Practice your chosen starter here..." rows="3"></textarea>
            <button id="saveStarterPractice">Save Practice</button>
          </div>
        </div>
      `;
      initConversationStarters();
      break;

    case 'boundarySetting':
      canvas.innerHTML = `
        <div class="boundary-setting">
          <div class="boundary-form">
            <div class="boundary-type">
              <label>What type of boundary?</label>
              <select id="boundaryType">
                <option value="physical">Physical (personal space, touch)</option>
                <option value="emotional">Emotional (feelings, support)</option>
                <option value="time">Time (availability, commitments)</option>
                <option value="material">Material (possessions, money)</option>
                <option value="intellectual">Intellectual (beliefs, opinions)</option>
              </select>
            </div>
            <div class="boundary-situation">
              <label>Situation:</label>
              <textarea id="boundarySituation" placeholder="Describe the situation where you need to set a boundary..." rows="3"></textarea>
            </div>
            <div class="boundary-statement">
              <label>Your boundary statement:</label>
              <textarea id="boundaryStatement" placeholder="Write a clear, firm statement of your boundary..." rows="3"></textarea>
            </div>
            <div class="boundary-consequences">
              <label>Consequences if crossed:</label>
              <textarea id="boundaryConsequences" placeholder="What will happen if this boundary is not respected?" rows="2"></textarea>
            </div>
          </div>
          <div class="boundary-controls">
            <button id="saveBoundary">Save Boundary</button>
            <button id="practiceBoundary">Practice Saying It</button>
          </div>
          <div class="boundary-examples">
            <h5>Example Boundaries:</h5>
            <div class="example">"I need some time to myself after work. Please don't call me during that time."</div>
            <div class="example">"I don't lend money to friends or family. That's my personal policy."</div>
          </div>
        </div>
      `;
      initBoundarySetting();
      break;

    case 'conflictResolution':
      canvas.innerHTML = `
        <div class="conflict-resolution">
          <div class="resolution-steps">
            <div class="step-indicator">
              <div class="step active" data-step="1">1. Stay Calm</div>
              <div class="step" data-step="2">2. Listen First</div>
              <div class="step" data-step="3">3. Express Feelings</div>
              <div class="step" data-step="4">4. Find Common Ground</div>
              <div class="step" data-step="5">5. Agree on Solution</div>
            </div>
            <div class="step-content" id="resolutionStepContent">
              <h4>Step 1: Stay Calm</h4>
              <p>Take deep breaths and give yourself time to process your emotions before responding.</p>
              <div class="step-tips">
                <strong>Tips:</strong>
                <ul>
                  <li>Count to 10 before speaking</li>
                  <li>Take a short break if needed</li>
                  <li>Focus on the issue, not the person</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="resolution-controls">
            <button id="prevResolutionStep" disabled>Previous</button>
            <button id="nextResolutionStep">Next Step</button>
          </div>
          <div class="resolution-practice">
            <h5>Practice Scenario</h5>
            <div class="scenario" id="conflictScenario">
              Your colleague took credit for your work in a meeting.
            </div>
            <textarea id="resolutionPractice" placeholder="How would you handle this situation?" rows="4"></textarea>
            <button id="saveResolutionPractice">Save Response</button>
          </div>
        </div>
      `;
      initConflictResolution();
      break;

    default:
      canvas.innerHTML = `
        <div class="tool-placeholder">
          <div class="placeholder-icon">${tool.icon}</div>
          <p>${tool.name} - Social tool coming soon!</p>
          <p>This is a placeholder for the ${tool.component} component.</p>
        </div>
      `;
  }
}

// Active listening implementation
function initActiveListening() {
  const nextBtn = document.getElementById('nextListeningStep');
  const practiceBtn = document.getElementById('practiceListening');
  const stepEl = document.getElementById('listeningStep');

  const steps = [
    {
      number: 1,
      title: 'Focus on the Speaker',
      content: 'Put away distractions and give your full attention to the person speaking.',
      tips: ['Maintain eye contact', 'Face the person directly', 'Put away your phone']
    },
    {
      number: 2,
      title: 'Show You\'re Listening',
      content: 'Use body language and verbal cues to show engagement.',
      tips: ['Nod occasionally', 'Use encouraging words like "uh-huh"', 'Keep an open posture']
    },
    {
      number: 3,
      title: 'Listen Without Interrupting',
      content: 'Let the person finish their thoughts before responding.',
      tips: ['Don\'t finish their sentences', 'Wait for natural pauses', 'Resist the urge to jump in']
    },
    {
      number: 4,
      title: 'Ask Clarifying Questions',
      content: 'Seek understanding when something isn\'t clear.',
      tips: ['Ask open-ended questions', 'Paraphrase to confirm understanding', 'Show genuine curiosity']
    },
    {
      number: 5,
      title: 'Reflect Back',
      content: 'Summarize what you heard to show you understand.',
      tips: ['Use phrases like "What I hear you saying is..."', 'Check for accuracy', 'Acknowledge feelings']
    }
  ];

  let currentStep = 0;

  nextBtn.addEventListener('click', () => {
    currentStep = (currentStep + 1) % steps.length;
    updateListeningStep();
  });

  practiceBtn.addEventListener('click', () => {
    const practiceScenarios = [
      'A friend is telling you about a difficult situation at work.',
      'Your partner is expressing frustration about household chores.',
      'A colleague is explaining a complex project requirement.',
      'A family member is sharing good news about their life.'
    ];

    const scenario = practiceScenarios[Math.floor(Math.random() * practiceScenarios.length)];

    showModal(`
      <div class="listening-practice">
        <h4>Practice Scenario</h4>
        <p><strong>${scenario}</strong></p>
        <p>Practice the active listening steps with this situation. What would you do or say?</p>
        <textarea placeholder="Write your response..." rows="4" id="practiceResponse"></textarea>
        <div class="practice-controls">
          <button onclick="saveListeningPractice()">Save Practice</button>
          <button onclick="hideModal()">Close</button>
        </div>
      </div>
    `, { title: 'Active Listening Practice' });
  });

  function updateListeningStep() {
    const step = steps[currentStep];
    stepEl.innerHTML = `
      <div class="step-number">${step.number}</div>
      <div class="step-content">
        <h5>${step.title}</h5>
        <p>${step.content}</p>
        <div class="step-tips">
          <strong>Tips:</strong>
          <ul>
            ${step.tips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }
}

// Conversation starters implementation
function initConversationStarters() {
  showStarterCategory('casual');
}

function showStarterCategory(category) {
  // Update button states
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  const starters = getConversationStarters(category);
  const listEl = document.getElementById('startersList');

  listEl.innerHTML = starters.map((starter, index) => `
    <div class="starter-item" onclick="selectConversationStarter(${index}, '${category}')">
      <div class="starter-text">${starter}</div>
      <div class="starter-use">Use this starter</div>
    </div>
  `).join('');
}

function getConversationStarters(category) {
  const starters = {
    casual: [
      "What's the most interesting thing you've done recently?",
      "If you could travel anywhere right now, where would you go?",
      "What's your favorite way to spend a weekend?",
      "What's a skill you'd love to learn?",
      "What's the best book you've read lately?",
      "What's your go-to comfort food?",
      "If you could have any superpower, what would it be?",
      "What's something you're really passionate about?"
    ],
    professional: [
      "What inspired you to get into your field?",
      "What's the most challenging project you've worked on?",
      "How do you stay current with industry trends?",
      "What's your approach to problem-solving?",
      "What do you enjoy most about your work?",
      "How has your career path evolved?",
      "What's a professional goal you're working toward?",
      "What advice would you give to someone starting in this field?"
    ],
    deep: [
      "What's something that changed your perspective on life?",
      "What's a belief you hold that most people disagree with?",
      "What's the most important lesson you've learned in life so far?",
      "If you could give your younger self one piece of advice, what would it be?",
      "What's something you're grateful for that you almost didn't have?",
      "What's a fear you've overcome?",
      "What's the most meaningful experience you've had?",
      "How do you define success for yourself?"
    ]
  };

  return starters[category] || [];
}

function selectConversationStarter(index, category) {
  const starters = getConversationStarters(category);
  const selectedStarter = starters[index];

  document.getElementById('starterPractice').value = selectedStarter;

  // Log usage
  logEvent('conversation_starter_used', category, 0, { starter: selectedStarter });
}

function saveStarterPractice() {
  const practice = document.getElementById('starterPractice').value.trim();

  if (!practice) {
    showToast('Please enter a conversation starter to save', 'warning');
    return;
  }

  const practices = getStoredJSON('fbConversationPractices', []);
  practices.push({
    date: new Date().toISOString(),
    practice: practice
  });

  setStoredJSON('fbConversationPractices', practices);
  showToast('Conversation practice saved!', 'success');
}

// Boundary setting implementation
function initBoundarySetting() {
  const saveBtn = document.getElementById('saveBoundary');
  const practiceBtn = document.getElementById('practiceBoundary');

  saveBtn.addEventListener('click', saveBoundary);
  practiceBtn.addEventListener('click', practiceBoundary);
}

function saveBoundary() {
  const type = document.getElementById('boundaryType').value;
  const situation = document.getElementById('boundarySituation').value.trim();
  const statement = document.getElementById('boundaryStatement').value.trim();
  const consequences = document.getElementById('boundaryConsequences').value.trim();

  if (!situation || !statement) {
    showToast('Please fill in the situation and boundary statement', 'warning');
    return;
  }

  const boundaries = getStoredJSON('fbBoundaries', []);
  boundaries.push({
    id: Date.now(),
    type,
    situation,
    statement,
    consequences,
    date: new Date().toISOString(),
    practiced: false
  });

  setStoredJSON('fbBoundaries', boundaries);
  showToast('Boundary saved!', 'success');
  logEvent('boundary_set', type, 0, { situation, statement });
}

function practiceBoundary() {
  const statement = document.getElementById('boundaryStatement').value.trim();

  if (!statement) {
    showToast('Please enter a boundary statement to practice', 'warning');
    return;
  }

  showModal(`
    <div class="boundary-practice">
      <h4>Practice Your Boundary</h4>
      <div class="practice-instruction">
        <p>Read your boundary statement out loud several times:</p>
        <div class="boundary-quote">"${statement}"</div>
      </div>
      <div class="practice-tips">
        <h5>Tips for Setting Boundaries:</h5>
        <ul>
          <li>Use "I" statements to own your feelings</li>
          <li>Be clear and specific</li>
          <li>Stay calm and confident</li>
          <li>Don't apologize for your boundary</li>
          <li>Be prepared to enforce consequences</li>
        </ul>
      </div>
      <div class="practice-controls">
        <button onclick="markBoundaryPracticed()">Mark as Practiced</button>
        <button onclick="hideModal()">Close</button>
      </div>
    </div>
  `, { title: 'Boundary Practice' });
}

function markBoundaryPracticed() {
  const boundaries = getStoredJSON('fbBoundaries', []);
  const lastBoundary = boundaries[boundaries.length - 1];

  if (lastBoundary) {
    lastBoundary.practiced = true;
    setStoredJSON('fbBoundaries', boundaries);
    showToast('Boundary marked as practiced!', 'success');
  }

  hideModal();
}

// Conflict resolution implementation
function initConflictResolution() {
  const prevBtn = document.getElementById('prevResolutionStep');
  const nextBtn = document.getElementById('nextResolutionStep');
  const saveBtn = document.getElementById('saveResolutionPractice');
  const stepContent = document.getElementById('resolutionStepContent');

  const steps = [
    {
      title: 'Stay Calm',
      content: 'Take deep breaths and give yourself time to process your emotions before responding.',
      tips: ['Count to 10 before speaking', 'Take a short break if needed', 'Focus on the issue, not the person']
    },
    {
      title: 'Listen First',
      content: 'Give the other person a chance to fully express their perspective without interruption.',
      tips: ['Use active listening techniques', 'Acknowledge their feelings', 'Ask clarifying questions']
    },
    {
      title: 'Express Your Feelings',
      content: 'Share your perspective using "I" statements and focus on how the situation affects you.',
      tips: ['Use "I feel..." statements', 'Avoid blaming language', 'Be specific about the issue']
    },
    {
      title: 'Find Common Ground',
      content: 'Look for shared interests or goals that you can both agree on.',
      tips: ['Identify mutual benefits', 'Focus on solutions', 'Be willing to compromise']
    },
    {
      title: 'Agree on Solution',
      content: 'Work together to find a resolution that addresses everyone\'s needs.',
      tips: ['Brainstorm multiple options', 'Choose a solution you can both support', 'Plan how to implement it']
    }
  ];

  let currentStep = 0;

  function updateStep() {
    const step = steps[currentStep];
    stepContent.innerHTML = `
      <h4>Step ${currentStep + 1}: ${step.title}</h4>
      <p>${step.content}</p>
      <div class="step-tips">
        <strong>Tips:</strong>
        <ul>
          ${step.tips.map(tip => `<li>${tip}</li>`).join('')}
        </ul>
      </div>
    `;

    prevBtn.disabled = currentStep === 0;
    nextBtn.textContent = currentStep === steps.length - 1 ? 'Start Over' : 'Next Step';

    // Update step indicators
    document.querySelectorAll('.step').forEach((el, index) => {
      el.classList.toggle('active', index === currentStep);
    });
  }

  prevBtn.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      updateStep();
    }
  });

  nextBtn.addEventListener('click', () => {
    currentStep = (currentStep + 1) % steps.length;
    updateStep();
  });

  saveBtn.addEventListener('click', () => {
    const practice = document.getElementById('resolutionPractice').value.trim();

    if (!practice) {
      showToast('Please enter your conflict resolution approach', 'warning');
      return;
    }

    const practices = getStoredJSON('fbConflictResolutions', []);
    practices.push({
      date: new Date().toISOString(),
      scenario: document.getElementById('conflictScenario').textContent,
      response: practice
    });

    setStoredJSON('fbConflictResolutions', practices);
    showToast('Conflict resolution practice saved!', 'success');
  });

  updateStep();
}

// Start social tool timer
function startSocialToolTimer(tool) {
  window.socialToolStartTime = Date.now();

  // Update timer display every second
  window.socialToolInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - window.socialToolStartTime) / 1000);
    const timerEl = document.getElementById('socialToolTimer');
    if (timerEl) {
      timerEl.textContent = formatTime(elapsed);
    }
  }, 1000);
}

// Close social tool
function closeSocialTool() {
  // Calculate usage time
  if (window.socialToolStartTime) {
    const usageTime = Math.floor((Date.now() - window.socialToolStartTime) / 1000);

    // Log usage
    const toolId = window.currentSocialTool;
    if (toolId) {
      logEvent('social_tool_used', toolId, usageTime);

      // Save usage data
      saveSocialToolUsage(toolId, usageTime);
    }
  }

  // Clear timers
  if (window.socialToolInterval) {
    clearInterval(window.socialToolInterval);
  }

  // Close modal
  hideModal();

  // Update stats
  loadSocialStats();

  window.socialToolStartTime = null;
  window.currentSocialTool = null;
}

// Save social tool usage
function saveSocialToolUsage(toolId, duration) {
  const usageData = getStoredJSON('fbSocialUsage', {});
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

  setStoredJSON('fbSocialUsage', usageData);
}

// Load social stats
function loadSocialStats() {
  const usageData = getStoredJSON('fbSocialUsage', {});
  const boundaries = getStoredJSON('fbBoundaries', []);
  const conversations = getStoredJSON('fbConversationPractices', []);

  const today = new Date().toISOString().slice(0, 10);
  const todayData = usageData[today] || { tools: {} };

  // Conversations logged today
  const conversationsToday = conversations.filter(c =>
    c.date.startsWith(today)
  ).length;
  document.getElementById('conversationsLogged').textContent = conversationsToday;

  // Boundaries set
  document.getElementById('boundariesSet').textContent = boundaries.length;

  // Current social goal (placeholder - could be user-set)
  const goals = ['Improve active listening', 'Set clearer boundaries', 'Network more effectively', 'Handle conflict better'];
  const currentGoal = goals[Math.floor(Math.random() * goals.length)];
  document.getElementById('socialGoal').textContent = currentGoal;
}

// Get all social tools
function getAllSocialTools() {
  const categories = ['communication', 'boundaries', 'networking', 'conflict'];
  const allTools = [];

  categories.forEach(category => {
    allTools.push(...getSocialToolsForCategory(category));
  });

  return allTools;
}