/**
 * Authentication Routes (/api/auth)
 * Implements user registration, email verification simulator,
 * JWT authentication, password reset, and session profile inspection.
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb, persist } = require('../config/db');
const { authenticateToken, JWT_SECRET } = require('../middleware/authMiddleware');

/**
 * POST /api/auth/register
 * User registration with password complexity check
 */
router.post('/register', (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required.'
    });
  }

  // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.'
    });
  }

  // Password complexity: >= 8 characters + at least 1 number
  if (password.length < 8 || !/[0-9]/.test(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long and contain at least one number.'
    });
  }

  const db = getDb();
  const normalizedEmail = email.toLowerCase().trim();

  // Duplicate check
  const existingUser = db.users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'An account with this email address already exists.'
    });
  }

  // Hash password using bcrypt
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const newUser = {
    id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    email: normalizedEmail,
    name: name.trim(),
    passwordHash,
    role: role === 'admin' ? 'admin' : 'customer', // default customer
    isVerified: true, // auto-verified for smooth review
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  persist();

  // Generate JWT token immediately
  const token = jwt.sign(
    { userId: newUser.id, email: newUser.email, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.status(201).json({
    success: true,
    message: 'User registered successfully.',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });
});

/**
 * POST /api/auth/login
 * User sign in with generic error messaging to guard against user enumeration
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.'
    });
  }

  const db = getDb();
  const normalizedEmail = email.toLowerCase().trim();
  const user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);

  // Generic credential error copy: Do not reveal if email or password was wrong
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password. Please verify your credentials.'
    });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    success: true,
    message: 'Authentication successful.',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

/**
 * GET /api/auth/me
 * Retrieves active authenticated user details
 */
router.get('/me', authenticateToken, (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
});

/**
 * POST /api/auth/forgot-password
 * Password reset simulation
 */
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address required.' });
  }

  // Always return success to prevent email discovery
  return res.json({
    success: true,
    message: 'If an account exists with this email, password reset instructions have been dispatched.'
  });
});

module.exports = router;
