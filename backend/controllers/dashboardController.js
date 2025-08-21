const FinancialDashboard = require('../models/FinancialDashboard');
const User = require('../models/User');

// @desc    Get financial overview
// @route   GET /api/dashboard/overview
// @access  Private
const getOverview = async (req, res) => {
  try {
    let dashboard = await FinancialDashboard.findOne({ userId: req.user.id });
    
    if (!dashboard) {
      // Create default dashboard if none exists
      dashboard = await FinancialDashboard.create({
        userId: req.user.id,
        cashFlow: {
          monthlyIncome: req.user.employmentInfo.monthlyIncome || 0
        }
      });
    }

    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    console.error('Get overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update financial dashboard
// @route   PUT /api/dashboard/overview
// @access  Private
const updateOverview = async (req, res) => {
  try {
    const { assets, liabilities, cashFlow, financialGoals } = req.body;
    
    let dashboard = await FinancialDashboard.findOne({ userId: req.user.id });
    
    if (!dashboard) {
      dashboard = new FinancialDashboard({ userId: req.user.id });
    }
    
    if (assets) dashboard.assets = { ...dashboard.assets, ...assets };
    if (liabilities) dashboard.liabilities = { ...dashboard.liabilities, ...liabilities };
    if (cashFlow) dashboard.cashFlow = { ...dashboard.cashFlow, ...cashFlow };
    if (financialGoals) dashboard.financialGoals = financialGoals;
    
    await dashboard.save();
    
    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    console.error('Update overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get net worth history
// @route   GET /api/dashboard/net-worth
// @access  Private
const getNetWorth = async (req, res) => {
  try {
    const dashboard = await FinancialDashboard.findOne({ userId: req.user.id });
    
    if (!dashboard) {
      return res.json({
        success: true,
        data: {
          netWorth: 0,
          totalAssets: 0,
          totalLiabilities: 0
        }
      });
    }
    
    res.json({
      success: true,
      data: dashboard.netWorth
    });
  } catch (error) {
    console.error('Get net worth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get cash flow analysis
// @route   GET /api/dashboard/cash-flow
// @access  Private
const getCashFlow = async (req, res) => {
  try {
    const dashboard = await FinancialDashboard.findOne({ userId: req.user.id });
    
    if (!dashboard) {
      return res.json({
        success: true,
        data: {
          monthlyIncome: req.user.employmentInfo.monthlyIncome || 0,
          monthlyExpenses: 0,
          monthlySavings: req.user.employmentInfo.monthlyIncome || 0,
          expenseBreakdown: {}
        }
      });
    }
    
    res.json({
      success: true,
      data: dashboard.cashFlow
    });
  } catch (error) {
    console.error('Get cash flow error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get asset allocation
// @route   GET /api/dashboard/asset-allocation
// @access  Private
const getAssetAllocation = async (req, res) => {
  try {
    const dashboard = await FinancialDashboard.findOne({ userId: req.user.id });
    
    if (!dashboard) {
      return res.json({
        success: true,
        data: {
          assets: {},
          liabilities: {},
          allocation: []
        }
      });
    }
    
    // Calculate allocation percentages
    const totalAssets = dashboard.netWorth.totalAssets;
    const allocation = totalAssets > 0 ? Object.entries(dashboard.assets).map(([key, value]) => ({
      category: key,
      amount: value,
      percentage: (value / totalAssets) * 100
    })).filter(item => item.amount > 0) : [];
    
    res.json({
      success: true,
      data: {
        assets: dashboard.assets,
        liabilities: dashboard.liabilities,
        allocation
      }
    });
  } catch (error) {
    console.error('Get asset allocation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  getOverview,
  updateOverview,
  getNetWorth,
  getCashFlow,
  getAssetAllocation
}; 