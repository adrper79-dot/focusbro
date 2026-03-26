// Dashboard View Component
const dashboardHTML = `
  <!-- MOTIVATIONAL GALLERY HERO -->
  <div class="gallery-hero" id="galleryHero">
    <div class="gallery-container">
      <div class="gallery-image" id="galleryImage"></div>
      <div class="gallery-quote" id="galleryQuote"></div>
      <div class="gallery-nav">
        <button class="gallery-btn prev" onclick="rotateGallery(-1)" aria-label="Previous image">←</button>
        <div class="gallery-dots" id="galleryDots"></div>
        <button class="gallery-btn next" onclick="rotateGallery(1)" aria-label="Next image">→</button>
      </div>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="card-header">Energy Level</div>
      <div class="card-value" id="currentEnergy">--</div>
      <div class="card-subtext">1-10 scale</div>
    </div>
    <div class="card">
      <div class="card-header">Last Med Dose</div>
      <div class="card-value" id="medDisplay">--:--</div>
      <div class="card-subtext" id="medStatus">No dose logged</div>
    </div>
    <div class="card">
      <div class="card-header">Today's Sessions</div>
      <div class="card-value" id="sessionCount">0</div>
      <div class="card-subtext">Pomodoro cycles</div>
    </div>
    <div class="card">
      <div class="card-header">Current Streak</div>
      <div class="card-value" id="dashboardStreak">0</div>
      <div class="card-subtext">days 🔥</div>
    </div>
    <div class="card">
      <div class="card-header">Total Sessions</div>
      <div class="card-value" id="dashboardTotalSessions">0</div>
      <div class="card-subtext">all time</div>
    </div>
    <div class="card">
      <div class="card-header">Total Focus Time</div>
      <div class="card-value" id="dashboardFocusHours">0h</div>
      <div class="card-subtext">hours</div>
    </div>
  </div>
  <div class="panel">
    <div class="panel-header"><div class="panel-title">Quick Access</div></div>
    <div class="panel-body">
      <button class="btn btn-success btn-lg btn-block" onclick="switchView('pomodoro')">Start Pomodoro</button>
      <button class="btn btn-primary btn-lg btn-block" style="margin-top: 8px;" onclick="switchView('breathing')">Breathing Exercise</button>
      <button class="btn btn-secondary btn-lg btn-block" style="margin-top: 8px;" onclick="switchView('grounding')">Grounding (5-4-3-2-1)</button>
    </div>
  </div>
`;

export default dashboardHTML;