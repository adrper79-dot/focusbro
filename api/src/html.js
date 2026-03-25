
export default `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>FocusBro - Professional Focus Management</title>
<meta name="description" content="ADHD-friendly enterprise focus management platform.">
<link rel="icon" href="/favicon.ico">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
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
    --primary-bg: #eff6ff;
    
    --success: #059669;
    --success-bg: #ecfdf5;
    --warning: #d97706;
    --warning-bg: #fffbeb;
    --danger: #dc2626;
    --danger-bg: #fef2f2;
    --info: #0891b2;
    
    --font: 'Inter', sans-serif;
    --mono: 'IBM Plex Mono', monospace;
    
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  html, body { height: 100%; overflow: hidden; }
  body {
    font-family: var(--font);
    background: var(--white);
    color: var(--gray-900);
    line-height: 1.5;
  }

  /* LAYOUT */
  .app { display: flex; height: 100vh; }
  .sidebar { width: 260px; background: var(--gray-900); color: var(--white); overflow-y: auto; display: flex; flex-direction: column; border-right: 1px solid var(--gray-800); }
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .header { background: var(--white); border-bottom: 1px solid var(--gray-200); padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: var(--shadow-sm); min-height: 64px; }
  .content { flex: 1; overflow-y: auto; padding: 24px 32px; background: var(--gray-50); }

  /* SIDEBAR */
  .logo { padding: 20px 24px; border-bottom: 1px solid var(--gray-800); font-size: 16px; font-weight: 700; }
  .nav { flex: 1; padding: 16px 0; }
  .nav-item {
    padding: 12px 20px;
    color: var(--gray-400);
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s;
    border-left: 3px solid transparent;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .nav-item:hover { background: var(--gray-800); color: var(--gray-300); }
  .nav-item.active { color: var(--primary-light); border-left-color: var(--primary-light); background: rgba(59, 130, 246, 0.1); }
  .sidebar-footer { padding: 16px 24px; border-top: 1px solid var(--gray-800); }

  /* HEADER */
  .header-title { font-size: 20px; font-weight: 600; }
  .header-actions { display: flex; gap: 12px; }
  .user-badge { font-size: 12px; background: var(--primary-bg); color: var(--primary); padding: 6px 12px; border-radius: 6px; }

  /* BUTTONS */
  .btn {
    padding: 10px 18px;
    border: none;
    border-radius: 6px;
    font-family: var(--font);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .btn-primary { background: var(--primary); color: var(--white); }
  .btn-primary:hover { background: var(--primary-dark); box-shadow: var(--shadow); }
  .btn-secondary { background: var(--gray-200); color: var(--gray-900); }
  .btn-secondary:hover { background: var(--gray-300); }
  .btn-success { background: var(--success); color: var(--white); }
  .btn-success:hover { background: #0d9488; }
  .btn-lg { padding: 14px 24px; font-size: 14px; }
  .btn-block { width: 100%; justify-content: center; }

  /* GRID & CARDS */
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .card {
    background: var(--white);
    border: 1px solid var(--gray-200);
    border-radius: 8px;
    padding: 20px;
    box-shadow: var(--shadow);
    transition: all 0.2s;
    position: relative;
  }
  .card:hover { border-color: var(--gray-300); box-shadow: var(--shadow-md); }
  .card-header { font-size: 11px; font-weight: 700; color: var(--gray-600); text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 12px; }
  .card-value { font-size: 32px; font-weight: 700; color: var(--gray-900); margin-bottom: 4px; font-family: var(--mono); }
  .card-subtext { font-size: 12px; color: var(--gray-500); }
  .card-action { margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--gray-100); }

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
  .panel-title { font-size: 14px; font-weight: 700; }
  .panel-body { padding: 20px; }

  /* TIMER - ADHD FRIENDLY */
  .timer-section {
    background: var(--primary-bg);
    border: 2px solid var(--primary);
    border-radius: 12px;
    padding: 32px;
    text-align: center;
    margin-bottom: 24px;
  }
  .timer-label { font-size: 12px; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
  .timer-display {
    font-family: var(--mono);
    font-size: 56px;
    font-weight: 700;
    color: var(--primary);
    margin: 16px 0;
    line-height: 1;
  }
  .timer-status { font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 16px; }
  .timer-buttons { display: flex; gap: 12px; justify-content: center; }

  /* STATUS BADGES */
  .badge {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  .badge-success { background: var(--success-bg); color: var(--success); }
  .badge-warning { background: var(--warning-bg); color: var(--warning); }
  .badge-danger { background: var(--danger-bg); color: var(--danger); }
  .badge-info { background: var(--primary-bg); color: var(--primary); }

  /* MODALS */
  .modal { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center; }
  .modal.active { display: flex; }
  .modal-content { background: var(--white); border-radius: 8px; box-shadow: var(--shadow-lg); width: 90%; max-width: 500px; max-height: 80vh; overflow-y: auto; }
  .modal-header { padding: 20px; border-bottom: 1px solid var(--gray-200); display: flex; justify-content: space-between; align-items: center; }
  .modal-title { font-size: 16px; font-weight: 700; }
  .close-btn { background: none; border: none; font-size: 24px; color: var(--gray-500); cursor: pointer; }
  .modal-body { padding: 20px; }
  .modal-footer { padding: 16px 20px; border-top: 1px solid var(--gray-200); display: flex; gap: 8px; justify-content: flex-end; }

  /* FORMS */
  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 12px; font-weight: 600; color: var(--gray-700); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.3px; }
  .form-input, .form-textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--gray-300);
    border-radius: 6px;
    font-family: var(--font);
    font-size: 13px;
    color: var(--gray-900);
    background: var(--white);
  }
  .form-input:focus, .form-textarea:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1); }

  /* TABLES */
  .table {
    width: 100%;
    font-size: 12px;
  }
  .table thead { border-bottom: 1px solid var(--gray-200); }
  .table th {
    padding: 12px 0;
    text-align: left;
    font-weight: 700;
    color: var(--gray-600);
    text-transform: uppercase;
    letter-spacing: 0.3px;
    font-size: 10px;
  }
  .table td {
    padding: 12px 0;
    border-bottom: 1px solid var(--gray-100);
    color: var(--gray-700);
  }
  .table tr:last-child td { border-bottom: none; }

  /* FEATURE SHOWCASE (LANDING) */
  .landing-hero {
    background: gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
    color: var(--white);
    padding: 60px 32px;
    text-align: center;
  }
  .landing-title { font-size: 36px; font-weight: 700; margin-bottom: 16px; }
  .landing-subtitle { font-size: 16px; opacity: 0.9; margin-bottom: 24px; }
  .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 32px; padding: 0 32px; }
  .feature-card {
    background: var(--white);
    border: 1px solid var(--gray-200);
    border-radius: 8px;
    padding: 24px;
    text-align: center;
    box-shadow: var(--shadow);
  }
  .feature-icon { font-size: 28px; margin-bottom: 12px; }
  .feature-name { font-size: 14px; font-weight: 700; margin-bottom: 8px; }
  .feature-desc { font-size: 12px; color: var(--gray-600); }

  /* WIDGET CUSTOMIZATION */
  .widget-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
  .widget { padding: 16px; border: 2px dashed var(--gray-300); border-radius: 8px; cursor: move; opacity: 0.7; }
  .widget.active { border-color: var(--primary); opacity: 1; background: var(--primary-bg); }

  @media (max-width: 768px) {
    .app { flex-direction: column; }
    .sidebar { width: 100%; height: auto; flex-direction: row; overflow-x: auto; }
    .nav { display: flex; padding: 0; margin: 0 auto; }
    .nav-item { padding: 8px 16px; border-left: none; border-bottom: 3px solid transparent; }
    .nav-item.active { border-left: none; border-bottom-color: var(--primary-light); }
    .grid { grid-template-columns: 1fr; }
    .content { padding: 16px; }
  }
</style>
</head>
<body>

<div class="app">
  <!-- SIDEBAR NAVIGATION -->
  <div class="sidebar">
    <div class="logo" id="sidebarLogo">FocusBro</div>
    <nav class="nav" id="appNav" style="display:none;">
      <div class="nav-item active" onclick="switchView('dashboard')">Dashboard</div>
      <div class="nav-item" onclick="switchView('pomodoro')">Pomodoro</div>
      <div class="nav-item" onclick="switchView('medication')">Medication</div>
      <div class="nav-item" onclick="switchView('focus')">Focus Time</div>
      <div class="nav-item" onclick="switchView('sessions')">Sessions</div>
      <div class="nav-item" onclick="switchView('devices')">Devices</div>
      <div class="nav-item" onclick="switchView('customize')">Customize</div>
    </nav>
    <div class="sidebar-footer" id="sidebarFooter">
      <button class="btn btn-primary btn-block" id="authBtn" onclick="openModal('authModal')">Sign In</button>
    </div>
  </div>

  <!-- MAIN CONTENT -->
  <div class="main">
    <div class="header">
      <div class="header-title" id="viewTitle">FocusBro</div>
      <div class="header-actions">
        <span id="userDisplay" style="display:none;" class="user-badge">Logged in</span>
        <button class="btn btn-secondary" id="logoutBtn" style="display:none;" onclick="logout()">Logout</button>
      </div>
    </div>

    <div class="content" id="mainContent">
      <!-- LANDING PAGE -->
      <div id="landing-view" class="view">
        <div style="background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%); color: var(--white); padding: 60px 32px; text-align: center; border-radius: 12px; margin-bottom: 32px;">
          <h1 style="font-size: 36px; margin-bottom: 16px;">FocusBro</h1>
          <p style="font-size: 16px; opacity: 0.95;">ADHD-friendly focus management for the workplace</p>
          <button class="btn btn-lg" style="background: var(--white); color: var(--primary); margin-top: 24px;" onclick="openModal('authModal')">Get Started</button>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div style="font-size: 28px; margin-bottom: 12px;">⏱</div>
            <div class="feature-name">Pomodoro Timer</div>
            <div class="feature-desc">Focus intervals with break reminders to maintain productivity</div>
          </div>
          <div class="feature-card">
            <div style="font-size: 28px; margin-bottom: 12px;">💊</div>
            <div class="feature-name">Medication Tracker</div>
            <div class="feature-desc">Track medication timing for consistent focus management</div>
          </div>
          <div class="feature-card">
            <div style="font-size: 28px; margin-bottom: 12px;">⏰</div>
            <div class="feature-name">Focus Analytics</div>
            <div class="feature-desc">Track productive hours and identify your peak focus times</div>
          </div>
          <div class="feature-card">
            <div style="font-size: 28px; margin-bottom: 12px;">🖥</div>
            <div class="feature-name">Device Sync</div>
            <div class="feature-desc">Sync data across all your devices seamlessly</div>
          </div>
          <div class="feature-card">
            <div style="font-size: 28px; margin-bottom: 12px;">⚙</div>
            <div class="feature-name">Custom Dashboard</div>
            <div class="feature-desc">Arrange widgets to suit your workflow and preferences</div>
          </div>
          <div class="feature-card">
            <div style="font-size: 28px; margin-bottom: 12px;">📊</div>
            <div class="feature-name">Session Tracking</div>
            <div class="feature-desc">Monitor all your work sessions in real time</div>
          </div>
        </div>
      </div>

      <!-- DASHBOARD VIEW -->
      <div id="dashboard-view" class="view" style="display:none;">
        <div class="grid">
          <div class="card">
            <div class="card-header">Active Focus</div>
            <div class="card-value" id="focusHours">0h</div>
            <div class="card-subtext">Today's focus time</div>
          </div>
          <div class="card">
            <div class="card-header">Current Session</div>
            <div class="card-value" id="sessionTime">00:00</div>
            <div class="card-subtext">Active right now</div>
          </div>
          <div class="card">
            <div class="card-header">Medication Status</div>
            <div id="medDisplay" class="card-value" style="font-size: 24px; color: var(--success);">--:--</div>
            <div class="card-subtext" id="medStatus">No dose logged</div>
          </div>
          <div class="card">
            <div class="card-header">Devices Connected</div>
            <div class="card-value" id="deviceCount">0</div>
            <div class="card-subtext">Synced devices</div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <div class="panel-title">Quick Actions</div>
          </div>
          <div class="panel-body">
            <button class="btn btn-success btn-lg btn-block" onclick="switchView('pomodoro')">Start Pomodoro Session</button>
            <button class="btn btn-primary btn-lg btn-block" style="margin-top: 8px;" onclick="switchView('focus')">View Focus Metrics</button>
            <button class="btn btn-secondary btn-lg btn-block" style="margin-top: 8px;" onclick="switchView('medication')">Log Medication</button>
          </div>
        </div>
      </div>

      <!-- POMODORO VIEW -->
      <div id="pomodoro-view" class="view" style="display:none;">
        <div class="timer-section">
          <div class="timer-label">Pomodoro Timer</div>
          <div class="timer-display" id="pomodoroDisplay">25:00</div>
          <div class="timer-status" id="pomodoroStatus">Ready to start</div>
          <div class="timer-buttons">
            <button class="btn btn-success" id="pomodoroStart" onclick="startPomodoro()">Start</button>
            <button class="btn btn-secondary" id="pomodoroStop" onclick="stopPomodoro()" style="display:none;">Stop</button>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header"><div class="panel-title">Session Settings</div></div>
          <div class="panel-body">
            <div class="form-group">
              <label class="form-label">Focus Duration (minutes)</label>
              <input type="number" id="focusDuration" class="form-input" value="25" min="5" max="120">
            </div>
            <div class="form-group">
              <label class="form-label">Break Duration (minutes)</label>
              <input type="number" id="breakDuration" class="form-input" value="5" min="1" max="30">
            </div>
          </div>
        </div>
      </div>

      <!-- MEDICATION VIEW -->
      <div id="medication-view" class="view" style="display:none;">
        <div class="card">
          <div class="card-header">Hours Since Last Dose</div>
          <div class="card-value" id="medHours">--:--</div>
          <div class="card-subtext" id="medText">No dose logged</div>
        </div>

        <div class="panel">
          <div class="panel-header"><div class="panel-title">Log Medication</div></div>
          <div class="panel-body">
            <div class="form-group">
              <label class="form-label">Time of Dose</label>
              <input type="time" id="medTime" class="form-input">
            </div>
            <button class="btn btn-success btn-lg btn-block" onclick="logMedication()">Log Dose</button>
          </div>
        </div>
      </div>

      <!-- FOCUS TIME VIEW -->
      <div id="focus-view" class="view" style="display:none;">
        <div class="grid">
          <div class="card">
            <div class="card-header">Weekly Focus</div>
            <div class="card-value">24h 35m</div>
            <div class="card-subtext">Total focus time</div>
          </div>
          <div class="card">
            <div class="card-header">Peak Hours</div>
            <div class="card-value">9-11 AM</div>
            <div class="card-subtext">Most productive time</div>
          </div>
          <div class="card">
            <div class="card-header">Sessions</div>
            <div class="card-value">18</div>
            <div class="card-subtext">This week</div>
          </div>
        </div>
      </div>

      <!-- SESSIONS VIEW -->
      <div id="sessions-view" class="view" style="display:none;">
        <div class="panel">
          <div class="panel-header"><div class="panel-title">Recent Sessions</div></div>
          <div class="panel-body">
            <table class="table">
              <thead>
                <tr><th>Device</th><th>Start Time</th><th>Duration</th><th>Status</th></tr>
              </thead>
              <tbody>
                <tr><td colspan="4" style="text-align:center; padding: 20px;">No sessions yet. Start by logging in!</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- DEVICES VIEW -->
      <div id="devices-view" class="view" style="display:none;">
        <div class="panel">
          <div class="panel-header"><div class="panel-title">Connected Devices</div></div>
          <div class="panel-body">
            <table class="table">
              <thead>
                <tr><th>Device Name</th><th>Last Seen</th><th>Status</th></tr>
              </thead>
              <tbody>
                <tr><td colspan="3" style="text-align:center; padding: 20px;">No devices connected</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- CUSTOMIZE VIEW -->
      <div id="customize-view" class="view" style="display:none;">
        <div class="panel">
          <div class="panel-header"><div class="panel-title">Customize Your Dashboard</div></div>
          <div class="panel-body">
            <p style="margin-bottom: 16px; font-size: 13px;">Select which widgets you want on your dashboard:</p>
            <div class="widget-grid" id="widgetSelector">
              <div class="widget">
                <input type="checkbox" id="w-focus" checked><label for="w-focus">Focus Time Card</label>
              </div>
              <div class="widget">
                <input type="checkbox" id="w-session" checked><label for="w-session">Current Session</label>
              </div>
              <div class="widget">
                <input type="checkbox" id="w-med" checked><label for="w-med">Medication Tracker</label>
              </div>
              <div class="widget">
                <input type="checkbox" id="w-devices" checked><label for="w-devices">Devices</label>
              </div>
              <div class="widget">
                <input type="checkbox" id="w-pomodoro"><label for="w-pomodoro">Pomodoro Widget</label>
              </div>
              <div class="widget">
                <input type="checkbox" id="w-focus-metrics"><label for="w-focus-metrics">Focus Analytics</label>
              </div>
            </div>
            <button class="btn btn-primary btn-lg btn-block" style="margin-top: 16px;" onclick="saveCustomization()">Save Customization</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- AUTH MODAL -->
<div id="authModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <div class="modal-title" id="authTitle">Sign In</div>
      <button class="close-btn" onclick="closeModal('authModal')">&times;</button>
    </div>
    <div class="modal-body">
      <div id="signInForm">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" id="email" class="form-input" placeholder="you@example.com">
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" id="password" class="form-input" placeholder="••••••••">
        </div>
        <button class="btn btn-primary btn-lg btn-block" onclick="handleSignIn()">Sign In</button>
        <p style="text-align: center; margin-top: 12px; font-size: 12px;">
          Don't have an account? <a href="#" onclick="toggleAuthForm(); return false;" style="color: var(--primary); text-decoration: none;">Sign Up</a>
        </p>
      </div>

      <div id="signUpForm" style="display:none;">
        <div class="form-group">
          <label class="form-label">Name</label>
          <input type="text" id="name" class="form-input" placeholder="Your name">
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" id="signupEmail" class="form-input" placeholder="you@example.com">
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" id="signupPassword" class="form-input" placeholder="••••••••">
        </div>
        <div class="form-group">
          <label class="form-label">Confirm Password</label>
          <input type="password" id="confirmPassword" class="form-input" placeholder="••••••••">
        </div>
        <button class="btn btn-primary btn-lg btn-block" onclick="handleSignUp()">Create Account</button>
        <p style="text-align: center; margin-top: 12px; font-size: 12px;">
          Already have an account? <a href="#" onclick="toggleAuthForm(); return false;" style="color: var(--primary); text-decoration: none;">Sign In</a>
        </p>
      </div>
    </div>
  </div>
</div>

<script>
  let user = null;
  let pomodoroTimer = null;
  let pomodoroTime = 25 * 60;
  let isPomodoro = true;
  let medLastDose = null;
  let medInterval = null;

  function toggleAuthForm() {
    document.getElementById('signInForm').style.display = document.getElementById('signInForm').style.display === 'none' ? 'block' : 'none';
    document.getElementById('signUpForm').style.display = document.getElementById('signUpForm').style.display === 'none' ? 'block' : 'none';
    document.getElementById('authTitle').textContent = document.getElementById('signInForm').style.display === 'none' ? 'Sign Up' : 'Sign In';
  }

  function handleSignIn() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (!email || !password) { alert('Please fill in all fields'); return; }
    
    user = { email, name: email.split('@')[0] };
    localStorage.setItem('fbUser', JSON.stringify(user));
    closeModal('authModal');
    updateUI();
  }

  function handleSignUp() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    
    if (!name || !email || !password || !confirm) { alert('Please fill in all fields'); return; }
    if (password !== confirm) { alert('Passwords do not match'); return; }
    
    user = { email, name };
    localStorage.setItem('fbUser', JSON.stringify(user));
    closeModal('authModal');
    updateUI();
  }

  function logout() {
    user = null;
    localStorage.removeItem('fbUser');
    updateUI();
  }

  function openModal(id) { document.getElementById(id).classList.add('active'); }
  function closeModal(id) { document.getElementById(id).classList.remove('active'); }

  function switchView(view) {
    if (!user && view !== 'landing') {
      openModal('authModal');
      return;
    }
    
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    document.getElementById(view + '-view').style.display = 'block';
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    event?.target?.classList.add('active');
  }

  function startPomodoro() {
    const duration = parseInt(document.getElementById('focusDuration').value) * 60;
    pomodoroTime = duration;
    isPomodoro = true;
    
    document.getElementById('pomodoroStart').style.display = 'none';
    document.getElementById('pomodoroStop').style.display = 'inline-block';
    
    pomodoroTimer = setInterval(() => {
      pomodoroTime--;
      const mins = Math.floor(pomodoroTime / 60);
      const secs = pomodoroTime % 60;
      document.getElementById('pomodoroDisplay').textContent = 
        \`\${String(mins).padStart(2, '0')}:\${String(secs).padStart(2, '0')}\`;
      
      if (pomodoroTime <= 0) {
        alert('Focus session complete! Time for a break.');
        stopPomodoro();
      }
    }, 1000);
  }

  function stopPomodoro() {
    clearInterval(pomodoroTimer);
    document.getElementById('pomodoroStart').style.display = 'inline-block';
    document.getElementById('pomodoroStop').style.display = 'none';
    pomodoroTime = parseInt(document.getElementById('focusDuration').value) * 60;
    const mins = Math.floor(pomodoroTime / 60);
    document.getElementById('pomodoroDisplay').textContent = \`\${mins}:00\`;
  }

  function logMedication() {
    const time = document.getElementById('medTime').value;
    if (!time) {
      medLastDose = new Date();
    } else {
      const [h, m] = time.split(':');
      const today = new Date();
      medLastDose = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(h), parseInt(m));
    }
    localStorage.setItem('fbMedDose', medLastDose.toISOString());
    document.getElementById('medTime').value = '';
    updateMedication();
    if (!medInterval) {
      medInterval = setInterval(updateMedication, 1000);
    }
  }

  function updateMedication() {
    const saved = localStorage.getItem('fbMedDose');
    if (!saved) {
      document.getElementById('medDisplay').textContent = '--:--';
      document.getElementById('medStatus').textContent = 'No dose logged';
      document.getElementById('medHours').textContent = '--:--';
      document.getElementById('medText').textContent = 'No dose logged';
      return;
    }
    
    medLastDose = new Date(saved);
    const elapsed = Date.now() - medLastDose.getTime();
    const hours = Math.floor(elapsed / 3600000);
    const mins = Math.floor((elapsed % 3600000) / 60000);
    const display = \`\${hours}:\${String(mins).padStart(2, '0')}h\`;
    
    document.getElementById('medDisplay').textContent = display;
    document.getElementById('medHours').textContent = display;
    
    if (hours >= 8) {
      document.getElementById('medStatus').textContent = 'Time for next dose';
      document.getElementById('medText').textContent = 'Time for next dose';
      document.getElementById('medDisplay').style.color = 'var(--danger)';
    } else if (hours >= 6) {
      document.getElementById('medStatus').textContent = 'Consider next dose soon';
      document.getElementById('medText').textContent = 'Consider next dose soon';
      document.getElementById('medDisplay').style.color = 'var(--warning)';
    } else {
      document.getElementById('medStatus').textContent = 'Dose still active';
      document.getElementById('medText').textContent = 'Dose still active';
      document.getElementById('medDisplay').style.color = 'var(--success)';
    }
  }

  function saveCustomization() {
    alert('Dashboard customization saved!');
  }

  function updateUI() {
    const  hasNav = !!user;
    document.getElementById('appNav').style.display = hasNav ? 'block' : 'none';
    document.getElementById('authBtn').style.display = user ? 'none' : 'block';
    document.getElementById('logoutBtn').style.display = user ? 'block' : 'none';
    document.getElementById('userDisplay').style.display = user ? 'block' : 'none';
    
    if (user) {
      document.getElementById('userDisplay').textContent = user.name;
      switchView('dashboard');
    } else {
      document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
      document.getElementById('landing-view').style.display = 'block';
      document.getElementById('viewTitle').textContent = 'FocusBro';
    }
  }

  // Initialize
  const saved = localStorage.getItem('fbUser');
  if (saved) {
    user = JSON.parse(saved);
  }
  updateUI();
  updateMedication();
  window.addEventListener('storage', updateMedication);
</script>

</body>
</html>
`;
