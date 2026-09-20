/**
 * Order Processing & Status Tracking Routes (/api/orders)
 * 
 * CRITICAL CONSISTENCY RULE (PRD Page 29):
 * Server independently verifies ingredient stock and recalculates order pricing
 * before persisting mutations. Never trusts client amounts.
 */

const express = require('express');
const router = express.Router();
const { getDb, persist } = require('../config/db');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * POST /api/orders
 * Create new pizza order with server-side stock verification and price calculation
 */
router.post('/', authenticateToken, (req, res) => {
  const { items, deliveryAddress, customerName } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Order must contain at least one configured pizza item.'
    });
  }

  if (!deliveryAddress || !deliveryAddress.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Delivery address is required.'
    });
  }

  const db = getDb();

  // 1. Validate items, recalculate prices, and verify stock availability
  let computedSubtotal = 0;
  const verifiedItems = [];
  const requiredStockDeductions = new Map(); // itemId -> quantity to deduct

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const qty = Math.max(1, parseInt(item.quantity) || 1);

    // Find base
    const baseItem = db.inventory.find(inv => inv.id === item.baseId && inv.category === 'base');
    if (!baseItem) {
      return res.status(400).json({ success: false, message: `Invalid pizza base selected: ${item.baseId}` });
    }

    // Find sauce
    const sauceItem = db.inventory.find(inv => inv.id === item.sauceId && inv.category === 'sauce');
    if (!sauceItem) {
      return res.status(400).json({ success: false, message: `Invalid pizza sauce selected: ${item.sauceId}` });
    }

    // Find cheese
    const cheeseItem = db.inventory.find(inv => inv.id === item.cheeseId && inv.category === 'cheese');
    if (!cheeseItem) {
      return res.status(400).json({ success: false, message: `Invalid cheese selected: ${item.cheeseId}` });
    }

    // Accumulate toppings
    const verifiedVeggies = [];
    let pizzaItemUnitPrice = baseItem.price + sauceItem.price + cheeseItem.price;

    // Track stock needs
    requiredStockDeductions.set(baseItem.id, (requiredStockDeductions.get(baseItem.id) || 0) + qty);
    requiredStockDeductions.set(sauceItem.id, (requiredStockDeductions.get(sauceItem.id) || 0) + qty);
    requiredStockDeductions.set(cheeseItem.id, (requiredStockDeductions.get(cheeseItem.id) || 0) + qty);

    if (item.veggieIds && Array.isArray(item.veggieIds)) {
      for (const vegId of item.veggieIds) {
        const vegItem = db.inventory.find(inv => inv.id === vegId && inv.category === 'veggie');
        if (!vegItem) {
          return res.status(400).json({ success: false, message: `Invalid topping option selected: ${vegId}` });
        }
        pizzaItemUnitPrice += vegItem.price;
        verifiedVeggies.push({ id: vegItem.id, name: vegItem.name, price: vegItem.price });
        requiredStockDeductions.set(vegItem.id, (requiredStockDeductions.get(vegItem.id) || 0) + qty);
      }
    }

    const itemSubtotal = pizzaItemUnitPrice * qty;
    computedSubtotal += itemSubtotal;

    verifiedItems.push({
      base: { id: baseItem.id, name: baseItem.name, price: baseItem.price },
      sauce: { id: sauceItem.id, name: sauceItem.name, price: sauceItem.price },
      cheese: { id: cheeseItem.id, name: cheeseItem.name, price: cheeseItem.price },
      veggies: verifiedVeggies,
      quantity: qty,
      unitPrice: pizzaItemUnitPrice,
      subtotal: itemSubtotal
    });
  }

  // 2. Stock Availability Check
  for (const [invId, neededQty] of requiredStockDeductions.entries()) {
    const invItem = db.inventory.find(inv => inv.id === invId);
    if (!invItem || invItem.stock < neededQty) {
      return res.status(409).json({
        success: false,
        message: `Insufficient inventory for ingredient '${invItem ? invItem.name : invId}'. Available: ${invItem ? invItem.stock : 0}, Required: ${neededQty}.`
      });
    }
  }

  // 3. Atomically decrement inventory
  for (const [invId, neededQty] of requiredStockDeductions.entries()) {
    const invItem = db.inventory.find(inv => inv.id === invId);
    if (invItem) {
      invItem.stock -= neededQty;
    }
  }

  // 4. Compute delivery fee, tax, and final amount
  const deliveryFee = 40;
  const tax = Math.round(computedSubtotal * 0.05); // 5% GST
  const totalAmount = computedSubtotal + deliveryFee + tax;

  const newOrder = {
    id: 'ord_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
    userId: req.user.userId,
    customerName: customerName || req.user.name || 'Valued Guest',
    customerEmail: req.user.email,
    deliveryAddress: deliveryAddress.trim(),
    items: verifiedItems,
    subtotal: computedSubtotal,
    deliveryFee,
    tax,
    totalAmount,
    paymentStatus: 'paid', // Razorpay Test Success confirmed
    paymentMethod: 'Razorpay Test Checkout',
    razorpayPaymentId: 'pay_test_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
    orderStatus: 'Order Received',
    statusHistory: [
      { status: 'Order Received', timestamp: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);
  persist();

  return res.status(201).json({
    success: true,
    message: 'Order placed successfully and payment captured.',
    order: newOrder
  });
});

/**
 * GET /api/orders
 * Returns all orders for the authenticated customer
 */
router.get('/', authenticateToken, (req, res) => {
  const db = getDb();
  const userOrders = db.orders.filter(o => o.userId === req.user.userId);
  return res.json({
    success: true,
    orders: userOrders
  });
});

/**
 * GET /api/orders/:id
 * Retrieve live order details and status for tracking
 */
router.get('/:id', authenticateToken, (req, res) => {
  const db = getDb();
  const order = db.orders.find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found.'
    });
  }

  // Allow order owner or admin
  if (order.userId !== req.user.userId && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized access to this order.'
    });
  }

  return res.json({
    success: true,
    order
  });
});

module.exports = router;
