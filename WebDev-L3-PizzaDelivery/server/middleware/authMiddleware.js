/**
 * Authentication & Authorization Middleware
 * Verifies JWT access tokens and enforces Role-Based Access Control (RBAC).
 */

const jwt = require('jsonwebtoken');
const { getDb } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'pizzalab_super_secret_jwt_key_2026';

/**
 * Verify JWT token attached in Authorization header: Bearer <token>
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: Authentication token required.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const db = getDb();
    const user = db.users.find(u => u.id === decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session: User account not found.'
      });
    }

    req.user = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired authentication token.'
    });
  }
}

/**
 * Enforce Admin Role (Page 27 & 29: Customer cannot access admin-only routes)
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Administrator privileges required.'
    });
  }
  next();
}

module.exports = {
  authenticateToken,
  requireAdmin,
  JWT_SECRET
};
