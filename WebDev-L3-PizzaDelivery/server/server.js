/**
 * PizzaLab Express Server (OIBSIP Level 3 Full Stack Application)
 * Full-stack pizza ordering platform with dynamic builder, inventory management,
 * Razorpay test payment integration, and automated low-stock monitoring.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { initStockAlertJob } = require('./services/stockAlertJob');
const authRoutes = require('./routes/authRoutes');
const pizzaRoutes = require('./routes/pizzaRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'PizzaLab Delivery & Inventory API'
  });
});

// Serve client if static build exists
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Internal Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred. Please try again later.'
  });
});

// Boot Server
app.listen(PORT, () => {
  console.log('================================================================');
  console.log(`🚀 PizzaLab API Server listening on: http://localhost:${PORT}`);
  console.log('================================================================');
  console.log('Preloaded Test Accounts:');
  console.log('  Customer : customer@example.com / Customer@12345');
  console.log('  Admin    : admin@pizzalab.com    / Admin@12345');
  console.log('================================================================');

  // Launch low-stock alert cron service
  initStockAlertJob();
});
