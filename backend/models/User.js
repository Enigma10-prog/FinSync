const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  personalInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    dateOfBirth: { type: Date, required: true },
    panNumber: { type: String, uppercase: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    residence: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      isMetro: { type: Boolean, default: false }
    }
  },
  employmentInfo: {
    type: { 
      type: String, 
      enum: ['Salaried', 'Self-Employed', 'Business', 'Retired', 'Student'],
      required: true 
    },
    employerName: { type: String },
    designation: { type: String },
    monthlyIncome: { type: Number, required: true },
    incomeProof: { type: String } // URL to uploaded document
  },
  financialProfile: {
    cibilScore: { type: Number, min: 300, max: 900 },
    existingInvestments: {
      elss: { type: Number, default: 0 },
      ppf: { type: Number, default: 0 },
      nps: { type: Number, default: 0 },
      fd: { type: Number, default: 0 },
      mutualFunds: { type: Number, default: 0 },
      stocks: { type: Number, default: 0 },
      others: { type: Number, default: 0 }
    },
    expenses: {
      rent: { type: Number, default: 0 },
      educationLoan: { type: Number, default: 0 },
      homeLoan: {
        principal: { type: Number, default: 0 },
        interest: { type: Number, default: 0 }
      },
      insurance: {
        health: { type: Number, default: 0 },
        life: { type: Number, default: 0 }
      }
    },
    spendingPattern: {
      groceries: { type: Number, default: 0 },
      dining: { type: Number, default: 0 },
      travel: { type: Number, default: 0 },
      fuel: { type: Number, default: 0 },
      shopping: { type: Number, default: 0 },
      entertainment: { type: Number, default: 0 }
    }
  },
  preferences: {
    riskAppetite: { 
      type: String, 
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    financialGoals: [{
      name: String,
      targetAmount: Number,
      targetYear: Number,
      priority: { type: String, enum: ['High', 'Medium', 'Low'] }
    }],
    cardPreferences: [{
      rewardType: { type: String, enum: ['Cashback', 'Travel', 'Fuel', 'Shopping'] },
      feeSensitivity: { type: Boolean, default: false }
    }]
  },
  auth: {
    password: { type: String, required: true, select: false },
    refreshTokens: [String],
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('auth.password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.auth.password = await bcrypt.hash(this.auth.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.auth.password);
};

// Calculate age
userSchema.virtual('age').get(function() {
  if (!this.personalInfo.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.personalInfo.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
