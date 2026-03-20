// ─── API ───
const API = '/api';

async function apiFetch(path, opts = {}) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    credentials: 'include',
    ...opts
  });
  return res;
}

// ─── AUTH CHECK ───
async function requireAuth() {
  const res = await apiFetch('/me');
  if (!res.ok) { window.location.href = '/login.html'; return null; }
  return res.json();
}

// ─── TOAST ───
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || '💬'}</span> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ─── SIDEBAR SETUP ───
function setupSidebar(activePage) {
  const sidebarHTML = `
  <div class="sidebar">
    <div class="sidebar-logo">
      <div class="logo-icon">🎓</div>
      <span class="logo-text">StudyMate</span>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-label">Menu</div>
      <a href="/dashboard.html" class="nav-item ${activePage === 'dashboard' ? 'active' : ''}">
        <span class="nav-icon">📊</span> Dashboard
      </a>
      <a href="/add-task.html" class="nav-item ${activePage === 'tasks' ? 'active' : ''}">
        <span class="nav-icon">✏️</span> Add Tasks
      </a>
      <a href="/schedule.html" class="nav-item ${activePage === 'schedule' ? 'active' : ''}">
        <span class="nav-icon">📅</span> Schedule
      </a>
      <a href="/notifications.html" class="nav-item ${activePage === 'notifications' ? 'active' : ''}">
        <span class="nav-icon">🔔</span> Notifications
        <span class="nav-badge notif-count" style="display:none">0</span>
      </a>
      <div class="nav-label" style="margin-top:16px">Account</div>
      <a href="/profile.html" class="nav-item ${activePage === 'profile' ? 'active' : ''}">
        <span class="nav-icon">👤</span> Profile
      </a>
    </nav>
    <div class="sidebar-footer">
      <div class="user-card" onclick="handleLogout()">
        <div class="user-avatar" id="sidebarAvatar">?</div>
        <div class="user-info">
          <div class="user-name" id="sidebarName">Loading...</div>
          <div class="user-role">Student</div>
        </div>
      </div>
    </div>
  </div>`;
  
  document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
  loadUserInfo();
  loadNotifCount();
}

async function loadUserInfo() {
  const res = await apiFetch('/me');
  if (res.ok) {
    const user = await res.json();
    const nameEl = document.getElementById('sidebarName');
    const avatarEl = document.getElementById('sidebarAvatar');
    if (nameEl) nameEl.textContent = user.name;
    if (avatarEl) avatarEl.textContent = user.name.charAt(0).toUpperCase();
  }
}

async function loadNotifCount() {
  const res = await apiFetch('/notifications');
  if (res.ok) {
    const notifs = await res.json();
    const unread = notifs.filter(n => !n.is_read).length;
    const badge = document.querySelector('.notif-count');
    if (badge && unread > 0) { badge.textContent = unread; badge.style.display = 'inline'; }
  }
}

async function handleLogout() {
  await apiFetch('/logout', { method: 'POST' });
  window.location.href = '/index.html';
}

// ─── RELATIVE TIME ───
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function diffBadge(diff) {
  const map = { Easy: 'badge-green', Medium: 'badge-yellow', Hard: 'badge-red' };
  return `<span class="badge ${map[diff] || 'badge-gray'}">${diff}</span>`;
}

function typeBadge(type) {
  const map = { Exam: 'badge-red', Assignment: 'badge-blue', 'Study Topic': 'badge-purple', 'Other Activity': 'badge-gray', 'Extra Activity': 'badge-green' };
  return `<span class="badge ${map[type] || 'badge-gray'}">${type}</span>`;
}
