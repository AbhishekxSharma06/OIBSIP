/**
 * Database Layer for PizzaLab
 * Provides persistent data storage with JSON file synchronization and in-memory cache.
 * Designed to work seamlessly out-of-the-box without requiring an external database install,
 * while matching MongoDB document structure and Mongoose query patterns.
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'pizzalab_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Seeds adhering to PRD requirements
function getInitialSeedData() {
  const salt = bcrypt.genSaltSync(10);
  const adminHash = bcrypt.hashSync('Admin@12345', salt);
  const customerHash = bcrypt.hashSync('Customer@12345', salt);

  return {
    users: [
      {
        id: 'usr_admin_1',
        email: 'admin@pizzalab.com',
        name: 'Operations Manager',
        passwordHash: adminHash,
        role: 'admin',
        isVerified: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr_cust_1',
        email: 'customer@example.com',
        name: 'Rohit Verma',
        passwordHash: customerHash,
        role: 'customer',
        isVerified: true,
        createdAt: new Date().toISOString()
      }
    ],

    // 5 bases, 5 sauces, 5 cheeses, 6 veggies (PRD Page 27, 30, 33)
    inventory: [
      // Bases
      { id: 'base_1', category: 'base', name: 'Thin Crust', price: 120, stock: 45, threshold: 15 },
      { id: 'base_2', category: 'base', name: 'Cheese Burst', price: 190, stock: 35, threshold: 15 },
      { id: 'base_3', category: 'base', name: 'Pan Crust', price: 140, stock: 40, threshold: 15 },
      { id: 'base_4', category: 'base', name: 'Whole Wheat', price: 150, stock: 25, threshold: 15 },
      { id: 'base_5', category: 'base', name: 'Gluten-Free', price: 180, stock: 12, threshold: 15 }, // Initially below threshold for demo

      // Sauces
      { id: 'sauce_1', category: 'sauce', name: 'Classic Marinara', price: 40, stock: 65, threshold: 20 },
      { id: 'sauce_2', category: 'sauce', name: 'Spicy Peri-Peri', price: 50, stock: 50, threshold: 20 },
      { id: 'sauce_3', category: 'sauce', name: 'Creamy Garlic White', price: 55, stock: 38, threshold: 20 },
      { id: 'sauce_4', category: 'sauce', name: 'Smoky Barbecue', price: 50, stock: 42, threshold: 20 },
      { id: 'sauce_5', category: 'sauce', name: 'Fresh Basil Pesto', price: 60, stock: 18, threshold: 20 }, // Below threshold for demo

      // Cheeses
      { id: 'cheese_1', category: 'cheese', name: 'Classic Mozzarella', price: 70, stock: 80, threshold: 25 },
      { id: 'cheese_2', category: 'cheese', name: 'Sharp Cheddar', price: 85, stock: 45, threshold: 20 },
      { id: 'cheese_3', category: 'cheese', name: 'Creamy Ricotta', price: 90, stock: 30, threshold: 15 },
      { id: 'cheese_4', category: 'cheese', name: 'Aged Parmesan', price: 95, stock: 28, threshold: 15 },
      { id: 'cheese_5', category: 'cheese', name: 'Artisan Vegan Cheese', price: 110, stock: 16, threshold: 20 }, // Below threshold for demo

      // Veggies / Toppings
      { id: 'veg_1', category: 'veggie', name: 'Button Mushrooms', price: 35, stock: 60, threshold: 20 },
      { id: 'veg_2', category: 'veggie', name: 'Black Olives', price: 40, stock: 55, threshold: 20 },
      { id: 'veg_3', category: 'veggie', name: 'Spicy Jalapeños', price: 30, stock: 70, threshold: 20 },
      { id: 'veg_4', category: 'veggie', name: 'Crisp Bell Peppers', price: 30, stock: 65, threshold: 20 },
      { id: 'veg_5', category: 'veggie', name: 'Caramelized Onions', price: 25, stock: 50, threshold: 20 },
      { id: 'veg_6', category: 'veggie', name: 'Tandoori Paneer', price: 60, stock: 32, threshold: 15 }
    ],

    orders: [
      {
        id: 'ord_demo_101',
        userId: 'usr_cust_1',
        customerName: 'Rohit Verma',
        customerEmail: 'customer@example.com',
        deliveryAddress: 'Flat 402, Green Park Avenue, New Delhi',
        items: [
          {
            base: { id: 'base_1', name: 'Thin Crust', price: 120 },
            sauce: { id: 'sauce_1', name: 'Classic Marinara', price: 40 },
            cheese: { id: 'cheese_1', name: 'Classic Mozzarella', price: 70 },
            veggies: [
              { id: 'veg_1', name: 'Button Mushrooms', price: 35 },
              { id: 'veg_2', name: 'Black Olives', price: 40 }
            ],
            quantity: 1,
            unitPrice: 305,
            subtotal: 305
          }
        ],
        subtotal: 305,
        deliveryFee: 40,
        tax: 15,
        totalAmount: 360,
        paymentStatus: 'paid',
        paymentMethod: 'Razorpay Test Mode',
        razorpayPaymentId: 'pay_test_987456123',
        orderStatus: 'In Kitchen', // 'Order Received' -> 'In Kitchen' -> 'Sent to Delivery' -> 'Delivered'
        statusHistory: [
          { status: 'Order Received', timestamp: new Date(Date.now() - 3600000).toISOString() },
          { status: 'In Kitchen', timestamp: new Date(Date.now() - 1800000).toISOString() }
        ],
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ],

    config: {
      defaultThreshold: 20,
      alertEmailRecipient: 'admin@pizzalab.com',
      lastAlertSentAt: null
    }
  };
}

// In-Memory Database cache
let dbState = null;

function loadDatabase() {
  if (dbState) return dbState;

  if (fs.existsSync(DATA_FILE)) {
    try {
      const content = fs.readFileSync(DATA_FILE, 'utf8');
      dbState = JSON.parse(content);
      return dbState;
    } catch (err) {
      console.warn('Error reading database file, re-initializing from seeds:', err);
    }
  }

  dbState = getInitialSeedData();
  saveDatabase();
  return dbState;
}

function saveDatabase() {
  if (!dbState) return;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(dbState, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write database to disk:', err);
  }
}

module.exports = {
  getDb: loadDatabase,
  persist: saveDatabase
};
