// Authentication & Token Management

const API_BASE = '';

function getToken() {
  return localStorage.getItem('rushikesh_iot_token');
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('rushikesh_iot_user') || 'null');
  } catch (e) {
    return null;
  }
}

function setSession(token, user) {
  localStorage.setItem('rushikesh_iot_token', token);
  localStorage.setItem('rushikesh_iot_user', JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem('rushikesh_iot_token');
  localStorage.removeItem('rushikesh_iot_user');
}

function logout() {
  clearSession();
  window.location.href = '/login.html';
}

// Check session on protected pages
function requireAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = '/login.html';
    return false;
  }
  return true;
}

// Redirect if already logged in (on login page)
function redirectIfLoggedIn() {
  const token = getToken();
  if (token) {
    window.location.href = '/index.html';
  }
}

// Show Alert Toast
function showAlert(message, type = 'error') {
  const alertBox = document.getElementById('alertBox');
  if (!alertBox) return;

  alertBox.className = `p-4 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3 ${
    type === 'error'
      ? 'bg-red-500/10 border border-red-500/30 text-red-400'
      : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
  }`;
  
  alertBox.innerHTML = `
    <i class="fa-solid ${type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-check'} text-base"></i>
    <span>${message}</span>
  `;
  alertBox.classList.remove('hidden');

  setTimeout(() => {
    alertBox.classList.add('hidden');
  }, 4000);
}
