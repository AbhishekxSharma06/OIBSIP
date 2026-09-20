/**
 * Pizza Builder Options Routes (/api/pizzas)
 * Provides frontend with dynamically priced bases, sauces, cheeses, and toppings,
 * along with real-time stock availability.
 */

const express = require('express');
const router = express.Router();
const { getDb } = require('../config/db');

/**
 * GET /api/pizzas/options
 * Returns categorized builder options
 */
router.get('/options', (req, res) => {
  const db = getDb();

  // Group inventory items by category
  const categories = {
    bases: [],
    sauces: [],
    cheeses: [],
    veggies: []
  };

  db.inventory.forEach(item => {
    const option = {
      id: item.id,
      name: item.name,
      price: item.price,
      inStock: item.stock > 0,
      stock: item.stock,
      category: item.category
    };

    if (item.category === 'base') categories.bases.push(option);
    else if (item.category === 'sauce') categories.sauces.push(option);
    else if (item.category === 'cheese') categories.cheeses.push(option);
    else if (item.category === 'veggie') categories.veggies.push(option);
  });

  return res.json({
    success: true,
    data: categories
  });
});

module.exports = router;
