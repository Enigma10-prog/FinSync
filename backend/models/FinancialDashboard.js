const mongoose = require('mongoose');

const financialDashboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  netWorth: {
    totalAssets: { type: Number, default: 0 },
    totalLiabilities: { type: Number, default: 0 },
    netWorth: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  },
  assets: {
    cash: { type: Number, default: 0 },
    savingsAccounts: { type: Number, default: 0 },
    fixedDeposits: { type: Number, default: 0 },
    mutualFunds: { type: Number, default: 0 },
    stocks: { type: Number, default: 0 },
    ppf: { type: Number, default: 0 },
    epf: { type: Number, default: 0 },
    nps: { type: Number, default: 0 },
    realEstate: { type: Number, default: 0 },
    gold: { type: Number, default: 0 },
    otherAssets: { type: Number, default: 0 }
  },
  liabilities: {
    homeLoan: { type: Number, default: 0 },
    carLoan: { type: Number, default: 0 },
    personalLoan: { type: Number, default: 0 },
    educationLoan: { type: Number, default: 0 },
    creditCardDebt: { type: Number, default: 0 },
    otherLiabilities: { type: Number, default: 0 }
  },
  cashFlow: {
    monthlyIncome: { type: Number, default: 0 },
    monthlyExpenses: { type: Number, default: 0 },
    monthlySavings: { type: Number, default: 0 },
    expenseBreakdown: {
      housing: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      transportation: { type: Number, default: 0 },
      healthcare: { type: Number, default: 0 },
      entertainment: { type: Number, default: 0 },
      education: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    }
  },
  financialGoals: [{
    name: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    targetDate: { type: Date, required: true },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    completed: { type: Boolean, default: false }
  }],
  creditScore: {
    score: { type: Number, min: 300, max: 900 },
    lastUpdated: { type: Date },
    factors: [{
      name: String,
      impact: { type: String, enum: ['Positive', 'Negative'] }
    }]
  },
  lastSynced: { type: Date }
});

// Index for efficient querying
financialDashboardSchema.index({ userId: 1 });

// Pre-save middleware to calculate net worth
financialDashboardSchema.pre('save', function(next) {
  // Calculate total assets
  const totalAssets = Object.values(this.assets).reduce((sum, value) => sum + (value || 0), 0);
  
  // Calculate total liabilities
  const totalLiabilities = Object.values(this.liabilities).reduce((sum, value) => sum + (value || 0), 0);
  
  // Calculate net worth
  this.netWorth.totalAssets = totalAssets;
  this.netWorth.totalLiabilities = totalLiabilities;
  this.netWorth.netWorth = totalAssets - totalLiabilities;
  this.netWorth.lastUpdated = new Date();
  
  next();
});

module.exports = mongoose.model('FinancialDashboard', financialDashboardSchema);
