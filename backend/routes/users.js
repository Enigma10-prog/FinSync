const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  getFinancialProfile,
  updateFinancialProfile,
  deleteAccount
} = require('../controllers/userController');

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/financial-profile', getFinancialProfile);
router.put('/financial-profile', updateFinancialProfile);
router.delete('/account', deleteAccount);

module.exports = router;
