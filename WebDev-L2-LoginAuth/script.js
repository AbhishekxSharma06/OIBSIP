/**
 * OIBSIP Level 2 Task 4: AuthVault (Login Authentication System)
 * Implements client-side session authentication, password strength validation,
 * generic credential error handling, and dashboard route guarding.
 */

(() => {
  'use strict';

  const USERS_STORAGE_KEY = 'authvault_registered_users_v1';
  const SESSION_STORAGE_KEY = 'authvault_active_session_v1';

  // Seed default user if not present
  function initializeSeedUser() {
    try {
      const existing = localStorage.getItem(USERS_STORAGE_KEY);
      if (!existing) {
        const seedUsers = [
          {
            email: 'user@example.com',
            name: 'Priya Sharma',
            // Stored simulated hash representation
            passwordHash: btoa('Password123'),
            registeredAt: Date.now() - 86400000
          }
        ];
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(seedUsers));
      }
    } catch (e) {
      console.warn('Storage initialization note:', e);
    }
  }

  initializeSeedUser();

  /**
   * Safe JSON storage helper
   */
  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function getSession() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY) || localStorage.getItem(SESSION_STORAGE_KEY));
    } catch {
      return null;
    }
  }

  function setSession(sessionData) {
    const serialized = JSON.stringify(sessionData);
    sessionStorage.setItem(SESSION_STORAGE_KEY, serialized);
    localStorage.setItem(SESSION_STORAGE_KEY, serialized);
  }

  function clearSession() {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }

  /* ==========================================================================
     PAGE ROUTING CHECK: Dashboard vs Login Portal
     ========================================================================== */
  const isDashboardPage = document.body.classList.contains('dashboard-page');

  if (isDashboardPage) {
    // PROTECTED ROUTE GUARD
    const currentSession = getSession();

    if (!currentSession || !currentSession.email) {
      // Unauthenticated access intercepted -> Redirect to login
      window.location.replace('index.html?reason=unauthorized');
      return;
    }

    // Populate Dashboard Data
    const dashNavEmail = document.getElementById('dashNavEmail');
    const dashDisplayName = document.getElementById('dashDisplayName');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const sessionId = document.getElementById('sessionId');
    const sessionTime = document.getElementById('sessionTime');
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutActionBtn = document.getElementById('logoutActionBtn');

    if (dashNavEmail) dashNavEmail.textContent = currentSession.email;
    if (dashDisplayName) dashDisplayName.textContent = currentSession.name || 'Member';
    if (profileName) profileName.textContent = currentSession.name || 'Member';
    if (profileEmail) profileEmail.textContent = currentSession.email;
    if (sessionId) sessionId.textContent = currentSession.token || 'sess_' + Math.random().toString(36).substr(2, 9);
    if (sessionTime) sessionTime.textContent = new Date(currentSession.loginTime).toLocaleString();

    function handleLogout() {
      clearSession();
      window.location.replace('index.html?reason=logged_out');
    }

    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (logoutActionBtn) logoutActionBtn.addEventListener('click', handleLogout);

    return; // End dashboard initialization
  }

  /* ==========================================================================
     LOGIN / REGISTER PORTAL LOGIC
     ========================================================================== */
  // If user is already authenticated and visits login page, redirect directly to dashboard
  const activeSession = getSession();
  if (activeSession && activeSession.email) {
    // Allow staying if logout redirect query exists
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('reason')) {
      window.location.replace('dashboard.html');
      return;
    }
  }

  // DOM Elements
  const tabSignIn = document.getElementById('tabSignIn');
  const tabRegister = document.getElementById('tabRegister');
  const signInForm = document.getElementById('signInForm');
  const registerForm = document.getElementById('registerForm');
  const formHeaderTitle = document.getElementById('formHeaderTitle');
  const formHeaderSubtitle = document.getElementById('formHeaderSubtitle');
  const authAlert = document.getElementById('authAlert');
  const alertText = document.getElementById('alertText');
  const alertIcon = document.getElementById('alertIcon');

  // Input elements
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const regName = document.getElementById('regName');
  const regEmail = document.getElementById('regEmail');
  const regPassword = document.getElementById('regPassword');
  const regPasswordConfirm = document.getElementById('regPasswordConfirm');
  const strengthFill = document.getElementById('strengthFill');
  const strengthLabel = document.getElementById('strengthLabel');

  // Check URL query notifications
  const queryParams = new URLSearchParams(window.location.search);
  if (queryParams.get('reason') === 'unauthorized') {
    showAlert('error', 'Authentication Required: Please sign in to access the protected dashboard.');
  } else if (queryParams.get('reason') === 'logged_out') {
    showAlert('info', 'Session ended successfully. You have been logged out.');
  }

  /**
   * Notification Banner Helper
   */
  function showAlert(type, message) {
    authAlert.className = `alert-box ${type}`;
    alertText.textContent = message;
    alertIcon.textContent = type === 'error' ? '⚠️' : type === 'success' ? '✔' : 'ℹ';
    authAlert.hidden = false;
  }

  function hideAlert() {
    authAlert.hidden = true;
  }

  /**
   * Tab Switching
   */
  function switchTab(mode) {
    hideAlert();
    if (mode === 'signin') {
      tabSignIn.classList.add('active');
      tabRegister.classList.remove('active');
      signInForm.hidden = false;
      registerForm.hidden = true;
      formHeaderTitle.textContent = 'Welcome back';
      formHeaderSubtitle.textContent = 'Sign in with your credentials to access your protected dashboard.';
    } else {
      tabRegister.classList.add('active');
      tabSignIn.classList.remove('active');
      registerForm.hidden = false;
      signInForm.hidden = true;
      formHeaderTitle.textContent = 'Create your account';
      formHeaderSubtitle.textContent = 'Join AuthVault with email and a secure password.';
    }
  }

  tabSignIn.addEventListener('click', () => switchTab('signin'));
  tabRegister.addEventListener('click', () => switchTab('register'));

  /**
   * Password Visibility Toggle
   */
  document.querySelectorAll('.btn-toggle-pwd').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = 'Hide';
      } else {
        input.type = 'password';
        btn.textContent = 'Show';
      }
    });
  });

  /**
   * Password Strength Analysis
   * Requirement: >= 8 characters and at least 1 number
   */
  function evaluatePasswordStrength(pwd) {
    if (!pwd) {
      strengthFill.style.width = '0%';
      strengthFill.style.backgroundColor = 'var(--color-border)';
      strengthLabel.textContent = 'Enter password';
      return false;
    }

    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1 || pwd.length < 8) {
      strengthFill.style.width = '25%';
      strengthFill.style.backgroundColor = 'var(--color-error)';
      strengthLabel.textContent = 'Weak (Needs >= 8 chars & 1 number)';
      return false;
    } else if (score === 2) {
      strengthFill.style.width = '60%';
      strengthFill.style.backgroundColor = 'var(--color-warning)';
      strengthLabel.textContent = 'Good password';
      return true;
    } else {
      strengthFill.style.width = '100%';
      strengthFill.style.backgroundColor = 'var(--color-success)';
      strengthLabel.textContent = 'Strong password';
      return true;
    }
  }

  regPassword.addEventListener('input', () => {
    evaluatePasswordStrength(regPassword.value);
  });

  /**
   * Registration Submission
   */
  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    hideAlert();

    const name = regName.value.trim();
    const email = regEmail.value.trim().toLowerCase();
    const password = regPassword.value;
    const confirm = regPasswordConfirm.value;

    // 1. Validate empty inputs
    if (!name || !email || !password || !confirm) {
      showAlert('error', 'All fields are required.');
      return;
    }

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert('error', 'Please enter a valid email address.');
      return;
    }

    // 3. Password Complexity Rule: >= 8 chars + at least 1 number
    if (password.length < 8 || !/[0-9]/.test(password)) {
      showAlert('error', 'Password must be at least 8 characters long and contain at least 1 number.');
      return;
    }

    // 4. Password confirmation match
    if (password !== confirm) {
      showAlert('error', 'Passwords do not match.');
      return;
    }

    // 5. Duplicate account check
    const users = getUsers();
    const isDuplicate = users.some(u => u.email.toLowerCase() === email);
    if (isDuplicate) {
      showAlert('error', 'An account with this email address already exists.');
      return;
    }

    // Create user record
    const newUser = {
      name,
      email,
      passwordHash: btoa(password), // Simulated safe hash
      registeredAt: Date.now()
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    // Clear form and switch to sign in
    registerForm.reset();
    evaluatePasswordStrength('');
    switchTab('signin');
    loginEmail.value = email;
    showAlert('success', 'Account registered successfully! Please sign in with your credentials.');
  });

  /**
   * Sign In Submission
   * Requirement: Generic error message to prevent user enumeration attacks
   */
  signInForm.addEventListener('submit', (event) => {
    event.preventDefault();
    hideAlert();

    const email = loginEmail.value.trim().toLowerCase();
    const password = loginPassword.value;

    if (!email || !password) {
      showAlert('error', 'Please provide both email and password.');
      return;
    }

    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email);

    // Generic error copy: DO NOT reveal if email exists or password was wrong
    if (!user || user.passwordHash !== btoa(password)) {
      showAlert('error', 'Invalid email or password. Please verify your credentials.');
      return;
    }

    // Authenticated successfully -> Establish Session
    const session = {
      email: user.email,
      name: user.name,
      token: 'jwt_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
      loginTime: Date.now()
    };

    setSession(session);

    // Redirect to Protected Dashboard
    showAlert('success', 'Authentication successful. Opening dashboard...');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 400);
  });
})();
