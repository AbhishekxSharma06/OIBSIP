/**
 * Admin Operations & Inventory Management Routes (/api/admin)
 * Enforces admin-only RBAC. Allows viewing all orders, advancing order status,
 * monitoring low-stock items, manual restocks, and threshold configuration.
 */

const express = require('express');
const router = express.Router();
const { getDb, persist } = require('../config/db');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Protect all admin routes
router.use(authenticateToken, requireAdmin);

/**
 * GET /api/admin/stats
 * Operational summary metrics for the admin console
 */
router.get('/stats', (req, res) => {
  const db = getDb();

  const totalOrders = db.orders.length;
  const activeOrders = db.orders.filter(o => o.orderStatus !== 'Delivered').length;
  const lowStockItems = db.inventory.filter(i => i.stock <= i.threshold);
  const totalRevenue = db.orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return res.json({
    success: true,
    data: {
      totalOrders,
      activeOrders,
      lowStockCount: lowStockItems.length,
      totalRevenue,
      lowStockItems
    }
  });
});

/**
 * GET /api/admin/orders
 * List all customer orders with status filter
 */
router.get('/orders', (req, res) => {
  const db = getDb();
  const { status } = req.query;

  let filtered = db.orders;
  if (status && status !== 'all') {
    filtered = filtered.filter(o => o.orderStatus.toLowerCase() === status.toLowerCase());
  }

  return res.json({
    success: true,
    orders: filtered
  });
});

/**
 * PATCH /api/admin/orders/:id/status
 * Transition order status: 'Order Received' -> 'In Kitchen' -> 'Sent to Delivery' -> 'Delivered'
 */
router.patch('/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Order Received', 'In Kitchen', 'Sent to Delivery', 'Delivered'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
    });
  }

  const db = getDb();
  const order = db.orders.find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found.'
    });
  }

  order.orderStatus = status;
  if (!order.statusHistory) order.statusHistory = [];
  order.statusHistory.push({
    status,
    timestamp: new Date().toISOString()
  });

  persist();

  return res.json({
    success: true,
    message: `Order status updated to '${status}' successfully.`,
    order
  });
});

/**
 * GET /api/admin/inventory
 * Complete inventory breakdown with low-stock flags
 */
router.get('/inventory', (req, res) => {
  const db = getDb();
  const inventoryWithStatus = db.inventory.map(item => ({
    ...item,
    isLowStock: item.stock <= item.threshold
  }));

  return res.json({
    success: true,
    inventory: inventoryWithStatus,
    config: db.config
  });
});

/**
 * PATCH /api/admin/inventory/:id
 * Manual stock adjustment (Restock / Correction)
 */
router.patch('/inventory/:id', (req, res) => {
  const { quantity, adjustment } = req.body;
  const db = getDb();
  const item = db.inventory.find(i => i.id === req.params.id);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Inventory item not found.'
    });
  }

  if (typeof quantity === 'number') {
    item.stock = Math.max(0, quantity);
  } else if (typeof adjustment === 'number') {
    item.stock = Math.max(0, item.stock + adjustment);
  } else {
    return res.status(400).json({
      success: false,
      message: 'Provide either a new quantity or an adjustment offset.'
    });
  }

  persist();

  return res.json({
    success: true,
    message: `Updated stock for '${item.name}' to ${item.stock}.`,
    item: {
      ...item,
      isLowStock: item.stock <= item.threshold
    }
  });
});

/**
 * PATCH /api/admin/config/threshold
 * Updates low-stock alert threshold globally or for item
 */
router.patch('/config/threshold', (req, res) => {
  const { threshold, itemId } = req.body;
  const numericThreshold = parseInt(threshold, 10);

  if (isNaN(numericThreshold) || numericThreshold < 0) {
    return res.status(400).json({
      success: false,
      message: 'Threshold must be a non-negative integer.'
    });
  }

  const db = getDb();

  if (itemId) {
    const item = db.inventory.find(i => i.id === itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });
    item.threshold = numericThreshold;
  } else {
    // Apply globally
    db.config.defaultThreshold = numericThreshold;
    db.inventory.forEach(i => { i.threshold = numericThreshold; });
  }

  persist();

  return res.json({
    success: true,
    message: 'Low stock threshold configuration updated.',
    config: db.config
  });
});

module.exports = router;
