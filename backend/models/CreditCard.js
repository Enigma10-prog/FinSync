const mongoose = require('mongoose');

const creditCardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true }, // HDFC, SBI, ICICI, etc.
  category: { 
    type: String, 
    enum: ['Premium', 'Travel', 'Cashback', 'Fuel', 'Shopping', 'Entertainment', 'Secured'],
    required: true 
  },
  joiningFee: { type: Number, required: true },
  annualFee: { type: Number, required: true },
  renewalConditions: { type: String },
  eligibility: {
    minIncome: { type: Number, required: true },
    minCibilScore: { type: Number, required: true },
    employmentType: [{ type: String }] // Salaried, Self-Employed, etc.
  },
  features: {
    rewardRate: { type: Number }, // Percentage
    rewardCategories: [{
      category: { type: String, required: true },
      rate: { type: Number, required: true },
      capping: { type: Number } // Monthly capping
    }],
    airportLoungeAccess: { type: Boolean, default: false },
    loungeAccessCount: { type: Number, default: 0 },
    fuelSurchargeWaiver: { type: Boolean, default: false },
    surchargeWaiverLimit: { type: Number, default: 0 },
    domesticTravelInsurance: { type: Number, default: 0 },
    internationalTravelInsurance: { type: Number, default: 0 },
    rentalCarDiscount: { type: Boolean, default: false },
    golfAccess: { type: Boolean, default: false }
  },
  interestRates: {
    purchase: { type: Number, required: true },
    cashAdvance: { type: Number, required: true }
  },
  fees: {
    cashAdvance: { type: Number, default: 0 },
    latePayment: { type: Number, default: 0 },
    overLimit: { type: Number, default: 0 }
  },
  benefits: [{
    type: { type: String, required: true },
    description: { type: String, required: true }
  }],
  applicationProcess: {
    documentation: [{ type: String }],
    processingTime: { type: String }
  },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, default: 0 },
  approvalRate: { type: Number, min: 0, max: 100, default: 0 },
  imageUrl: { type: String },
  applyUrl: { type: String },
  isActive: { type: Boolean, default: true },
  lastUpdated: { type: Date, default: Date.now }
});

// Indexes for efficient querying
creditCardSchema.index({ category: 1, issuer: 1 });
creditCardSchema.index({ 'eligibility.minIncome': 1 });
creditCardSchema.index({ 'eligibility.minCibilScore': 1 });
creditCardSchema.index({ isActive: 1 });

module.exports = mongoose.model('CreditCard', creditCardSchema);
