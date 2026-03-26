// UI and DOM Utilities
export function initUI() {
  // Initialize UI state
  window.appState.ui = {
    currentView: 'dashboard',
    isMobile: window.innerWidth < 768,
    toastQueue: [],
    modalStack: []
  };

  // Listen for window resize
  window.addEventListener('resize', debounce(() => {
    window.appState.ui.isMobile = window.innerWidth < 768;
  }, 250));
}

// Debounce utility (imported from timer.js)
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Show toast notification
window.showToast = function(message, type = 'info', duration = 3000) {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;

  // Add to DOM
  const container = document.getElementById('toastContainer') || createToastContainer();
  container.appendChild(toast);

  // Auto-remove after duration
  if (duration > 0) {
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, duration);
  }

  // Add show class for animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
};

// Create toast container if it doesn't exist
function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toastContainer';
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// Show loading spinner
window.showLoading = function(message = 'Loading...') {
  const existing = document.getElementById('loadingOverlay');
  if (existing) return;

  const overlay = document.createElement('div');
  overlay.id = 'loadingOverlay';
  overlay.className = 'loading-overlay';
  overlay.innerHTML = `
    <div class="loading-spinner">
      <div class="spinner"></div>
      <div class="loading-text">${message}</div>
    </div>
  `;

  document.body.appendChild(overlay);
};

// Hide loading spinner
window.hideLoading = function() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.remove();
  }
};

// Show modal dialog
window.showModal = function(content, options = {}) {
  const {
    title = '',
    size = 'medium',
    closable = true,
    onClose = null
  } = options;

  // Create modal elements
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = `modal modal-${size}`;

  modal.innerHTML = `
    ${title ? `<div class="modal-header">
      <h3 class="modal-title">${title}</h3>
      ${closable ? '<button class="modal-close" onclick="hideModal()">×</button>' : ''}
    </div>` : ''}
    <div class="modal-body">
      ${content}
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Add to modal stack
  window.appState.ui.modalStack.push({
    overlay,
    onClose
  });

  // Focus management
  modal.setAttribute('tabindex', '-1');
  modal.focus();

  // Animation
  requestAnimationFrame(() => {
    overlay.classList.add('show');
  });

  // ESC key handler
  const escHandler = (e) => {
    if (e.key === 'Escape' && closable) {
      hideModal();
    }
  };
  document.addEventListener('keydown', escHandler);

  // Store handler for cleanup
  overlay._escHandler = escHandler;
};

// Hide top modal
window.hideModal = function() {
  const current = window.appState.ui.modalStack.pop();
  if (!current) return;

  const { overlay, onClose } = current;

  // Remove ESC handler
  if (overlay._escHandler) {
    document.removeEventListener('keydown', overlay._escHandler);
  }

  // Animation
  overlay.classList.remove('show');
  setTimeout(() => {
    overlay.remove();
    if (onClose) onClose();
  }, 300);
};

// Update UI element safely
window.safeUpdateElement = function(selector, content, fallback = '') {
  const element = document.querySelector(selector);
  if (element) {
    element.innerHTML = content;
  } else {
    console.warn(`Element not found: ${selector}`);
    if (fallback) {
      showToast(fallback, 'warning');
    }
  }
};

// Toggle element visibility
window.toggleVisibility = function(selector, show = null) {
  const element = document.querySelector(selector);
  if (!element) return false;

  const isVisible = element.style.display !== 'none';
  const shouldShow = show !== null ? show : !isVisible;

  element.style.display = shouldShow ? 'block' : 'none';
  return shouldShow;
};

// Safe query selector with fallback
window.safeQuerySelector = function(selector, fallback = null) {
  try {
    return document.querySelector(selector) || fallback;
  } catch (e) {
    console.warn(`Invalid selector: ${selector}`, e);
    return fallback;
  }
};

// Get element bounds safely
window.getElementBounds = function(selector) {
  const element = document.querySelector(selector);
  return element ? element.getBoundingClientRect() : null;
};

// Scroll to element smoothly
window.scrollToElement = function(selector, offset = 0) {
  const element = document.querySelector(selector);
  if (element) {
    const top = element.offsetTop - offset;
    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  }
};