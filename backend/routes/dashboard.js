const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getOverview,
  updateOverview,
  getNetWorth,
  getCashFlow,
  getAssetAllocation
} = require('../controllers/dashboardController');

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.get('/overview', getOverview);
router.put('/overview', updateOverview);
router.get('/net-worth', getNetWorth);
router.get('/cash-flow', getCashFlow);
router.get('/asset-allocation', getAssetAllocation);

module.exports = router;
