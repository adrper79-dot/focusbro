// Auto-generated HTML - do not edit
export default `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>FocusBro Platform</title>
<meta name="description" content="Enterprise productivity analytics and focus management platform.">
<link rel="icon" href="/favicon.ico">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --white: #ffffff;
    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-300: #d1d5db;
    --gray-400: #9ca3af;
    --gray-500: #6b7280;
    --gray-600: #4b5563;
    --gray-700: #374151;
    --gray-800: #1f2937;
    --gray-900: #111827;
    
    --primary: #1e40af;
    --primary-light: #3b82f6;
    --primary-lighter: #60a5fa;
    --primary-dark: #1e3a8a;
    
    --success: #059669;
    --warning: #d97706;
    --danger: #dc2626;
    --info: #0891b2;
    
    --font: 'Inter', sans-serif;
    --mono: 'IBM Plex Mono', monospace;
    
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  html { height: 100%; }
  body {
    font-family: var(--font);
    background: var(--white);
    color: var(--gray-900);
    line-height: 1.6;
    height: 100%;
  }

  .dashboard {
    display: flex;
    height: 100vh;
    background: var(--gray-50);
  }

  /* SIDEBAR */
  .sidebar {
    width: 240px;
    background: var(--gray-900);
    color: var(--white);
    padding: 24px 0;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--gray-800);
    overflow-y: auto;
  }

  .sidebar-header {
    padding: 0 24px 32px;
    border-bottom: 1px solid var(--gray-800);
  }

  .logo {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.5px;
    color: var(--white);
  }

  .nav {
    flex: 1;
    padding: 24px 0;
  }

  .nav-item {
    padding: 12px 24px;
    color: var(--gray-400);
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s;
    border-left: 3px solid transparent;
  }

  .nav-item:hover {
    background: var(--gray-800);
    color: var(--gray-300);
  }

  .nav-item.active {
    color: var(--primary-light);
    border-left-color: var(--primary-light);
    background: rgba(59, 130, 246, 0.1);
  }

  /* MAIN CONTENT */
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .header {
    background: var(--white);
    border-bottom: 1px solid var(--gray-200);
    padding: 20px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: var(--shadow-sm);
  }

  .header-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--gray-900);
  }

  .header-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-family: var(--font);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .button-primary {
    background: var(--primary);
    color: var(--white);
  }

  .button-primary:hover {
    background: var(--primary-dark);
    box-shadow: var(--shadow);
  }

  .button-secondary {
    background: var(--gray-200);
    color: var(--gray-900);
  }

  .button-secondary:hover {
    background: var(--gray-300);
  }

  /* CONTENT AREA */
  .content {
    flex: 1;
    overflow-y: auto;
    padding: 32px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }

  .card {
    background: var(--white);
    border: 1px solid var(--gray-200);
    border-radius: 8px;
    padding: 20px;
    box-shadow: var(--shadow);
    transition: all 0.2s;
  }

  .card:hover {
    border-color: var(--gray-300);
    box-shadow: var(--shadow-md);
  }

  .card-header {
    font-size: 11px;
    font-weight: 700;
    color: var(--gray-600);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
  }

  .card-value {
    font-size: 32px;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 8px;
    font-family: var(--mono);
  }

  .card-subtext {
    font-size: 12px;
    color: var(--gray-500);
  }

  .card-metric {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--gray-100);
  }

  .metric-label {
    font-size: 11px;
    color: var(--gray-600);
    font-weight: 600;
  }

  .metric-value {
    font-size: 14px;
    font-weight: 700;
    color: var(--primary);
  }

  .status-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
    margin-top: 8px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  .status-active {
    background: rgba(5, 150, 105, 0.1);
    color: var(--success);
  }

  .status-inactive {
    background: rgba(107, 114, 128, 0.1);
    color: var(--gray-600);
  }

  /* PANELS */
  .panel {
    background: var(--white);
    border: 1px solid var(--gray-200);
    border-radius: 8px;
    box-shadow: var(--shadow);
    margin-bottom: 20px;
  }

  .panel-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--gray-100);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .panel-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--gray-900);
  }

  .panel-body {
    padding: 20px;
  }

  .session-table {
    width: 100%;
    font-size: 12px;
  }

  .session-table thead {
    border-bottom: 1px solid var(--gray-200);
  }

  .session-table th {
    padding: 12px 0;
    text-align: left;
    font-weight: 700;
    color: var(--gray-600);
    text-transform: uppercase;
    letter-spacing: 0.4px;
    font-size: 10px;
  }

  .session-table td {
    padding: 12px 0;
    border-bottom: 1px solid var(--gray-100);
    color: var(--gray-700);
  }

  .session-table tr:last-child td {
    border-bottom: none;
  }

  .time-badge {
    background: var(--gray-100);
    padding: 4px 8px;
    border-radius: 4px;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--gray-700);
  }

  /* TIMER */
  .timer-display {
    background: var(--gray-50);
    border: 1px solid var(--gray-200);
    border-radius: 8px;
    padding: 24px;
    text-align: center;
    margin: 20px 0;
  }

  .timer-large {
    font-family: var(--mono);
    font-size: 48px;
    font-weight: 700;
    color: var(--primary);
    margin: 16px 0;
  }

  .timer-label {
    font-size: 11px;
    color: var(--gray-600);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  /* FORMS */
  .form-group {
    margin-bottom: 16px;
  }

  .form-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    color: var(--gray-700);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  .form-input,
  .form-select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--gray-300);
    border-radius: 6px;
    font-family: var(--font);
    font-size: 13px;
    color: var(--gray-900);
    background: var(--white);
  }

  .form-input:focus,
  .form-select:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
  }

  /* MODAL */
  .modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    align-items: center;
    justify-content: center;
  }

  .modal.active {
    display: flex;
  }

  .modal-content {
    background: var(--white);
    border-radius: 8px;
    box-shadow: var(--shadow-lg);
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
  }

  .modal-header {
    padding: 20px;
    border-bottom: 1px solid var(--gray-200);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--gray-900);
  }

  .close-button {
    background: none;
    border: none;
    font-size: 24px;
    color: var(--gray-500);
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-button:hover {
    color: var(--gray-700);
  }

  .modal-body {
    padding: 20px;
  }

  .modal-footer {
    padding: 16px 20px;
    border-top: 1px solid var(--gray-200);
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .dashboard {
      flex-direction: column;
    }

    .sidebar {
      width: 100%;
      height: auto;
      flex-direction: row;
      padding: 12px 0;
    }

    .nav {
      display: flex;
      gap: 0;
      padding: 0;
      flex: 1;
    }

    .nav-item {
      flex: 1;
      padding: 8px 12px;
      text-align: center;
      border-left: none;
      border-bottom: 3px solid transparent;
    }

    .nav-item.active {
      border-left: none;
      border-bottom-color: var(--primary-light);
    }

    .header {
      flex-direction: column;
      gap: 16px;
    }

    .grid {
      grid-template-columns: 1fr;
    }

    .content {
      padding: 16px;
    }
  }
</style>
</head>
<body>

<div class="dashboard">
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="logo">FocusBro</div>
    </div>
    <nav class="nav">
      <div class="nav-item active" onclick="switchView('overview')">Overview</div>
      <div class="nav-item" onclick="switchView('sessions')">Sessions</div>
      <div class="nav-item" onclick="switchView('devices')">Devices</div>
      <div class="nav-item" onclick="switchView('medication')">Medication</div>
      <div class="nav-item" onclick="switchView('settings')">Settings</div>
    </nav>
  </div>

  <div class="main">
    <div class="header">
      <div class="header-title" id="viewTitle">Overview</div>
      <div class="header-actions">
        <button class="button button-secondary" onclick="openModal('syncModal')">Sync Data</button>
        <button class="button button-primary" onclick="openModal('loginModal')">Login</button>
      </div>
    </div>

    <div class="content">
      <div id="overview-view" class="view">
        <div class="grid">
          <div class="card">
            <div class="card-header">Active Sessions</div>
            <div class="card-value" id="sessionCount">0</div>
            <div class="card-subtext">Last 24 hours</div>
            <div class="card-metric">
              <span class="metric-label">Current</span>
              <span class="metric-value" id="currentSession">Inactive</span>
            </div>
          </div>

          <div class="card">
            <div class="card-header">Focus Time</div>
            <div class="card-value" id="focusTime">0h</div>
            <div class="card-subtext">Productive hours</div>
            <div class="card-metric">
              <span class="metric-label">Goal</span>
              <span class="metric-value">8h</span>
            </div>
          </div>

          <div class="card">
            <div class="card-header">Devices</div>
            <div class="card-value" id="deviceCount">0</div>
            <div class="card-subtext">Connected devices</div>
            <div class="card-metric">
              <span class="metric-label">Status</span>
              <span class="metric-value" id="deviceStatus">Offline</span>
            </div>
          </div>

          <div class="card">
            <div class="card-header">Data Synced</div>
            <div class="card-value" id="syncCount">0</div>
            <div class="card-subtext">Snapshots</div>
            <div class="card-metric">
              <span class="metric-label">Last Sync</span>
              <span class="metric-value" id="lastSync">Never</span>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <div class="panel-title">Current Status</div>
          </div>
          <div class="panel-body">
            <div class="timer-display">
              <div class="timer-label">Session Timer</div>
              <div class="timer-large" id="sessionTimer">00:00:00</div>
              <div id="sessionStatus" style="font-weight: 600; font-size: 13px; margin-bottom: 8px;">Not logged in</div>
              <div class="status-badge status-inactive" id="statusBadge">Inactive</div>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <div class="panel-title">Active Sessions</div>
          </div>
          <div class="panel-body">
            <table class="session-table">
              <thead>
                <tr>
                  <th>Device</th>
                  <th>Started</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody id="sessionList">
                <tr>
                  <td colspan="3" style="text-align: center; color: var(--gray-500); padding: 20px 0;">No active sessions</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div id="sessions-view" class="view" style="display:none;">
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title">Session History</div>
          </div>
          <div class="panel-body">
            <table class="session-table">
              <thead>
                <tr>
                  <th>Device</th>
                  <th>Started</th>
                  <th>Ended</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody id="historyList">
                <tr>
                  <td colspan="4" style="text-align: center; color: var(--gray-500); padding: 20px 0;">No session history</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div id="medication-view" class="view" style="display:none;">
        <div class="grid">
          <div class="card">
            <div class="card-header">Hours Since Dose</div>
            <div class="card-value" id="medStatus">--:--</div>
            <div class="card-subtext" id="medTimerText">No dose logged</div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <div class="panel-title">Log Medication</div>
          </div>
          <div class="panel-body">
            <div class="form-group">
              <label class="form-label">Time of Dose</label>
              <input type="time" id="medTime" class="form-input">
            </div>
            <button class="button button-primary" onclick="logMedication()">Log Dose</button>
          </div>
        </div>
      </div>

      <div id="devices-view" class="view" style="display:none;">
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title">Connected Devices</div>
          </div>
          <div class="panel-body">
            <table class="session-table">
              <thead>
                <tr>
                  <th>Device Name</th>
                  <th>Last Activity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody id="deviceList">
                <tr>
                  <td colspan="3" style="text-align: center; color: var(--gray-500); padding: 20px 0;">No devices connected</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div id="settings-view" class="view" style="display:none;">
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title">Account Settings</div>
          </div>
          <div class="panel-body">
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-input" placeholder="user@example.com">
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" class="form-input" placeholder="••••••••">
            </div>
            <button class="button button-primary">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div id="loginModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <div class="modal-title">Sign In</div>
      <button class="close-button" onclick="closeModal('loginModal')">&times;</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">Email</label>
        <input type="email" id="loginEmail" class="form-input" placeholder="user@example.com">
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <input type="password" id="loginPassword" class="form-input" placeholder="Password">
      </div>
    </div>
    <div class="modal-footer">
      <button class="button button-secondary" onclick="closeModal('loginModal')">Cancel</button>
      <button class="button button-primary" onclick="handleLogin()">Sign In</button>
    </div>
  </div>
</div>

<div id="syncModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <div class="modal-title">Sync Data</div>
      <button class="close-button" onclick="closeModal('syncModal')">&times;</button>
    </div>
    <div class="modal-body">
      <p style="margin-bottom: 16px; color: var(--gray-600); font-size: 13px;">Synchronize your focus data with the cloud.</p>
      <div id="syncStatus" style="padding: 12px; background: var(--gray-50); border-radius: 6px; font-size: 12px; color: var(--gray-600); border: 1px solid var(--gray-200);">Ready to sync</div>
    </div>
    <div class="modal-footer">
      <button class="button button-secondary" onclick="closeModal('syncModal')">Cancel</button>
      <button class="button button-primary" onclick="handleSync()">Sync Now</button>
    </div>
  </div>
</div>

<script>
  let medLastDose = null;
  let medInterval = null;
  let sessionTimer = null;
  let sessionStartTime = null;

  function switchView(view) {
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    document.getElementById(view + '-view').style.display = 'block';
    
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event.target.classList.add('active');
    
    const titles = {
      'overview': 'Overview',
      'sessions': 'Sessions',
      'devices': 'Devices',
      'medication': 'Medication',
      'settings': 'Settings'
    };
    document.getElementById('viewTitle').textContent = titles[view];
  }

  function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
  }

  function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
  }

  function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    if (!email) {
      alert('Please enter your email');
      return;
    }
    closeModal('loginModal');
    updateSessionStatus('Active', true);
    if (!sessionStartTime) {
      sessionStartTime = Date.now();
      startSessionTimer();
    }
  }

  function handleSync() {
    const status = document.getElementById('syncStatus');
    status.textContent = 'Syncing...';
    setTimeout(() => {
      status.textContent = 'Sync completed successfully';
      document.getElementById('syncCount').textContent = Math.floor(Math.random() * 100) + 50;
    }, 1500);
  }

  function logMedication() {
    const timeInput = document.getElementById('medTime');
    const time = timeInput.value;
    
    if (!time) {
      const now = new Date();
      medLastDose = now;
    } else {
      const [h, m] = time.split(':');
      const today = new Date();
      medLastDose = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(h), parseInt(m));
    }
    
    localStorage.setItem('fb_med_dose', medLastDose.toISOString());
    timeInput.value = '';
    updateMedTimer();
    
    if (!medInterval) {
      medInterval = setInterval(updateMedTimer, 1000);
    }
  }

  function updateMedTimer() {
    const status = document.getElementById('medStatus');
    const text = document.getElementById('medTimerText');
    
    const saved = localStorage.getItem('fb_med_dose');
    if (!saved) {
      status.textContent = '--:--';
      text.textContent = 'No dose logged';
      status.style.color = 'var(--gray-900)';
      return;
    }
    
    medLastDose = new Date(saved);
    const elapsed = Date.now() - medLastDose.getTime();
    const hours = Math.floor(elapsed / 3600000);
    const mins = Math.floor((elapsed % 3600000) / 60000);
    
    status.textContent = \`\${hours}:\${String(mins).padStart(2, '0')}h\`;
    
    if (hours >= 8) {
      text.textContent = 'Time for next dose';
      status.style.color = 'var(--danger)';
    } else if (hours >= 6) {
      text.textContent = 'Consider next dose soon';
      status.style.color = 'var(--warning)';
    } else {
      text.textContent = 'Dose still active';
      status.style.color = 'var(--success)';
    }
  }

  function startSessionTimer() {
    sessionTimer = setInterval(() => {
      if (sessionStartTime) {
        const elapsed = Date.now() - sessionStartTime;
        const hours = Math.floor(elapsed / 3600000);
        const mins = Math.floor((elapsed % 3600000) / 60000);
        const secs = Math.floor((elapsed % 60000) / 1000);
        document.getElementById('sessionTimer').textContent = 
          \`\${String(hours).padStart(2, '0')}:\${String(mins).padStart(2, '0')}:\${String(secs).padStart(2, '0')}\`;
      }
    }, 1000);
  }

  function updateSessionStatus(status, isActive) {
    document.getElementById('sessionStatus').textContent = status;
    const badge = document.getElementById('statusBadge');
    if (isActive) {
      badge.textContent = 'Active';
      badge.className = 'status-badge status-active';
      document.getElementById('currentSession').textContent = 'Active';
    } else {
      badge.textContent = 'Inactive';
      badge.className = 'status-badge status-inactive';
      document.getElementById('currentSession').textContent = 'Inactive';
    }
  }

  window.addEventListener('storage', updateMedTimer);
  updateMedTimer();
</script>

</body>
</html>

`;
