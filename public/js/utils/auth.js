// Authentication Utilities
export function initAuth() {
  // Check for existing session
  const token = localStorage.getItem('fbToken');
  if (token) {
    try {
      const userData = JSON.parse(localStorage.getItem('fbUser') || '{}');
      window.appState.user = userData;
      updateAuthUI();
    } catch (e) {
      console.warn('Invalid stored user data');
      localStorage.removeItem('fbToken');
      localStorage.removeItem('fbUser');
    }
  }
}

export function updateAuthUI() {
  const authBtn = document.getElementById('authBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const userDisplay = document.getElementById('userDisplay');

  if (window.appState.user) {
    authBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
    userDisplay.style.display = 'block';
    userDisplay.textContent = window.appState.user.email || 'Logged in';
  } else {
    authBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
    userDisplay.style.display = 'none';
  }
}

window.logout = function() {
  localStorage.removeItem('fbToken');
  localStorage.removeItem('fbUser');
  localStorage.removeItem('fbSessionId');
  window.appState.user = null;
  updateAuthUI();
  showToast('Logged out successfully', 'success');
};