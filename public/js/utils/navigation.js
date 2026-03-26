// Navigation Utilities
export function initNavigation() {
  // Handle mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const menuBackdrop = document.getElementById('menuBackdrop');
  const sidebar = document.querySelector('.sidebar');

  if (menuToggle && menuBackdrop && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      menuBackdrop.classList.toggle('open');
      menuToggle.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', sidebar.classList.contains('open'));
    });

    menuBackdrop.addEventListener('click', () => {
      sidebar.classList.remove('open');
      menuBackdrop.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  }

  // Handle keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Dashboard/Home shortcut (H key or D key)
    if (e.key === 'h' || e.key === 'H' || e.key === 'd' || e.key === 'D') {
      if (!e.target.matches('input, textarea, select')) {
        e.preventDefault();
        switchView('dashboard');
      }
    }

    // Tab shortcuts
    if (e.key === '1') {
      if (!e.target.matches('input, textarea, select')) {
        e.preventDefault();
        switchTab('dashboard');
      }
    }
    if (e.key === '2') {
      if (!e.target.matches('input, textarea, select')) {
        e.preventDefault();
        switchTab('focus');
      }
    }
    if (e.key === '3') {
      if (!e.target.matches('input, textarea, select')) {
        e.preventDefault();
        switchTab('wellness');
      }
    }
    if (e.key === '4') {
      if (!e.target.matches('input, textarea, select')) {
        e.preventDefault();
        switchTab('health');
      }
    }
    if (e.key === '5') {
      if (!e.target.matches('input, textarea, select')) {
        e.preventDefault();
        switchTab('energy');
      }
    }
    if (e.key === '6') {
      if (!e.target.matches('input, textarea, select')) {
        e.preventDefault();
        switchTab('insights');
      }
    }

    // Tool shortcuts (existing)
    if (e.key === 'p' || e.key === 'P') {
      if (!e.target.matches('input, textarea, select')) {
        e.preventDefault();
        switchView('pomodoro');
      }
    }

    if (e.key === 'b' || e.key === 'B') {
      if (!e.target.matches('input, textarea, select')) {
        e.preventDefault();
        switchView('breathing');
      }
    }

    if (e.key === 'g' || e.key === 'G') {
      if (!e.target.matches('input, textarea, select')) {
        e.preventDefault();
        switchView('grounding');
      }
    }

    if (e.key === 'm' || e.key === 'M') {
      if (!e.target.matches('input, textarea, select')) {
        e.preventDefault();
        switchView('meditation');
      }
    }

    if (e.key === 'e' || e.key === 'E') {
      if (!e.target.matches('input, textarea, select')) {
        e.preventDefault();
        switchView('energy');
      }
    }

    if (e.key === 'a' || e.key === 'A') {
      if (!e.target.matches('input, textarea, select')) {
        e.preventDefault();
        switchView('analytics');
      }
    }

    if (e.key === 's' || e.key === 'S') {
      if (!e.target.matches('input, textarea, select')) {
        e.preventDefault();
        switchView('settings');
      }
    }

    // Help shortcut (? key)
    if (e.key === '?') {
      if (!e.target.matches('input, textarea, select')) {
        e.preventDefault();
        showKeyboardHelp();
      }
    }
  });
}

function showKeyboardHelp() {
  const helpHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">Keyboard Shortcuts</div>
        <button class="close-btn" onclick="closeModal('keyboardHelpModal')">&times;</button>
      </div>
      <div class="modal-body">
        <div style="display: grid; gap: 12px;">
          <div><strong>Tab Navigation:</strong></div>
          <div><strong>1</strong> - Home/Dashboard</div>
          <div><strong>2</strong> - Focus Tools</div>
          <div><strong>3</strong> - Wellness Tools</div>
          <div><strong>4</strong> - Health Tools</div>
          <div><strong>5</strong> - Energy Tools</div>
          <div><strong>6</strong> - Insights</div>
          <div><strong>Tool Shortcuts:</strong></div>
          <div><strong>H/D</strong> - Dashboard/Home</div>
          <div><strong>P</strong> - Pomodoro Timer</div>
          <div><strong>B</strong> - Breathing Exercises</div>
          <div><strong>G</strong> - Grounding Exercise</div>
          <div><strong>M</strong> - Meditation</div>
          <div><strong>E</strong> - Energy & Mood</div>
          <div><strong>A</strong> - Analytics</div>
          <div><strong>S</strong> - Settings</div>
          <div><strong>?</strong> - Show this help</div>
        </div>
      </div>
    </div>
  `;

  openModal('keyboardHelpModal', helpHTML);
}