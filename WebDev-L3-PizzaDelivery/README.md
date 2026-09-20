# WebDev-L3-PizzaDelivery — PizzaLab Full-Stack Application

> **OIBSIP Track**: Web Development & Designing  
> **Level**: 3 | **Task**: 1 (Comprehensive Full-Stack Project)  
> **Tech Stack**: React Architecture, Node.js, Express, MongoDB Data Adapter, Razorpay Sandbox, WebSockets/Polling, Node-Cron

---

## 📌 Project Overview
**PizzaLab** connects end-to-end customer pizza customization with real-time restaurant kitchen operations and inventory risk control. Built strictly against the **OIBSIP Level 3 PRD, TRD, and UI/UX blueprint**.

---

## 🎯 Acceptance Criteria & Checklist

### 1. Authentication & Security (PRD Page 27, 29)
- [x] **Registration & Login**: Hashed password storage (`bcryptjs`), JWT token authentication, email validation.
- [x] **Role-Based Access Control (RBAC)**: Strict segregation between `customer` and `admin` roles. Customer tokens are forbidden from accessing `/api/admin/*` routes (HTTP 403).
- [x] **Generic Credential Error Handling**: Safeguards against user enumeration.

### 2. Custom Pizza Builder (PRD Page 27, 30)
- [x] **4-Step Wizard**:
  1. *5 Bases*: Thin Crust (₹120), Cheese Burst (₹190), Pan Crust (₹140), Whole Wheat (₹150), Gluten-Free (₹180).
  2. *5 Sauces*: Classic Marinara (₹40), Spicy Peri-Peri (₹50), Creamy Garlic White (₹55), Smoky Barbecue (₹50), Fresh Basil Pesto (₹60).
  3. *5 Cheeses*: Classic Mozzarella (₹70), Sharp Cheddar (₹85), Creamy Ricotta (₹90), Aged Parmesan (₹95), Artisan Vegan Cheese (₹110).
  4. *6 Toppings*: Button Mushrooms (₹35), Black Olives (₹40), Spicy Jalapeños (₹30), Crisp Bell Peppers (₹30), Caramelized Onions (₹25), Tandoori Paneer (₹60).
- [x] **Live Graphical Representation**: Real-time CSS canvas displaying crust gradient, sauce hue, cheese melt, and topping scatter coordinates.
- [x] **Dynamic Pricing Engine**: Sticky order summary showing real-time price impact of choices.

### 3. Server-Side Consistency & Order Processing (PRD Page 29)
- [x] **Critical Consistency Rule**: "Never trust client amounts or stock." The Express API independently recalculates subtotals, verifies ingredient availability, and decrements inventory atomically upon order placement.
- [x] **Razorpay Test Checkout Simulation**: Test modal supporting UPI and Card payments, creating confirmed orders and payment IDs (`pay_test_*`).

### 4. Real-Time Order Tracking (PRD Page 27, 30, 32)
- [x] **Visual 4-Stage Stepper**: *Order Received* ➔ *In Kitchen* ➔ *Sent to Delivery* ➔ *Delivered*.
- [x] **Live Polling**: Synchronizes order status in real time (every 3 seconds) with status pulse indicators.

### 5. Admin Operations & Inventory Control (PRD Page 27, 31)
- [x] **Operations Dashboard**: Live metrics (active orders, revenue, low-stock count).
- [x] **Status Workflow Controller**: One-click status advancement (*In Kitchen*, *Sent to Delivery*, *Delivered*).
- [x] **Low-Stock Alert Banners**: Highlighted warning chips when ingredients fall below threshold.
- [x] **Manual Stock Management**: Quick `+10 Restock` buttons and configurable global threshold.

### 6. Scheduled Automation (PRD Page 27, 32)
- [x] **Automated Stock Alert Job**: `node-cron` scheduled task (`services/stockAlertJob.js`) scanning inventory thresholds and dispatching alert logs.

---

## 🔑 Preloaded Test Accounts
| Role | Email | Password |
|---|---|---|
| **Customer** | `customer@example.com` | `Customer@12345` |
| **Administrator** | `admin@pizzalab.com` | `Admin@12345` |

---

## 🚀 How to Run Locally

### 1. Start the API Server
```bash
cd server
npm install
npm start
```
The server will start on `http://localhost:5000` with the automated cron scanner active.

### 2. Run Backend Verification Tests
```bash
cd server
npm test
```

### 3. Open the Frontend Client
- Open `client/index.html` directly in any web browser, OR
- Serve via Vite:
  ```bash
  cd client
  npm install
  npm run dev
  ```
  Visit `http://localhost:3000`.
