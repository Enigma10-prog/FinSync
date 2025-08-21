const express = require('express');
const { protect } = require('../middleware/auth');
const {
  calculateTax,
  getTaxHistory,
  getTaxCalculation,
  getTaxSuggestions,
  getLatestRules
} = require('../controllers/taxController');

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.post('/calculate', calculateTax);
router.get('/history', getTaxHistory);
router.get('/calculations/:id', getTaxCalculation);
router.post('/suggestions', getTaxSuggestions);
router.get('/latest-rules', getLatestRules);

module.exports = router;
