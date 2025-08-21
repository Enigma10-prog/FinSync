const mongoose = require('mongoose');

const taxCalculationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  calculationDate: { type: Date, default: Date.now },
  financialYear: { type: String, required: true }, // e.g., "2024-2025"
  inputs: {
    // Income details
    salary: {
      basic: { type: Number, required: true },
      hra: { type: Number, default: 0 },
      specialAllowance: { type: Number, default: 0 },
      otherAllowances: { type: Number, default: 0 },
      professionalTax: { type: Number, default: 0 }
    },
    otherIncome: {
      interest: { type: Number, default: 0 },
      rental: { type: Number, default: 0 },
      capitalGains: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    },
    
    // Deductions
    deductions: {
      section80C: { type: Number, default: 0 },
      section80D: { type: Number, default: 0 },
      section80E: { type: Number, default: 0 },
      section80G: { type: Number, default: 0 },
      section80TTA: { type: Number, default: 0 },
      nps: { type: Number, default: 0 },
      hraExemption: { type: Number, default: 0 },
      homeLoanInterest: { type: Number, default: 0 },
      otherDeductions: { type: Number, default: 0 }
    },
    
    // Regime selection
    regime: { type: String, enum: ['OLD', 'NEW'], required: true }
  },
  results: {
    oldRegime: {
      grossIncome: { type: Number, required: true },
      totalDeductions: { type: Number, required: true },
      taxableIncome: { type: Number, required: true },
      taxAmount: { type: Number, required: true },
      cess: { type: Number, required: true },
      totalTax: { type: Number, required: true }
    },
    newRegime: {
      grossIncome: { type: Number, required: true },
      totalDeductions: { type: Number, required: true },
      taxableIncome: { type: Number, required: true },
      taxAmount: { type: Number, required: true },
      cess: { type: Number, required: true },
      totalTax: { type: Number, required: true }
    },
    recommendedRegime: { type: String, enum: ['OLD', 'NEW'], required: true },
    potentialSavings: { type: Number, required: true }
  },
  suggestions: [{
    category: { type: String, required: true },
    instrument: { type: String, required: true },
    section: { type: String, required: true },
    suggestedAmount: { type: Number, required: true },
    potentialSavings: { type: Number, required: true },
    priority: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], required: true }
  }]
});

// Index for efficient querying
taxCalculationSchema.index({ userId: 1, calculationDate: -1 });
taxCalculationSchema.index({ userId: 1, financialYear: 1 });

module.exports = mongoose.model('TaxCalculation', taxCalculationSchema);
