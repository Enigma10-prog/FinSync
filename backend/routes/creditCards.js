const express = require('express');
const { protect, optionalAuth } = require('../middleware/auth');
const {
  getCreditCards,
  getRecommendations,
  getCreditCard,
  compareCards,
  getCategories
} = require('../controllers/creditCardController');

const router = express.Router();

// Routes
router.get('/', getCreditCards);
router.post('/recommend', protect, getRecommendations);
router.get('/:id', getCreditCard);
router.post('/compare', protect, compareCards);
router.get('/categories', getCategories);

module.exports = router;
