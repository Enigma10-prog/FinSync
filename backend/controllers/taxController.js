const TaxCalculation = require('../models/TaxCalculation');
const User = require('../models/User');
const TaxCalculator = require('../services/taxCalculator');

// @desc    Calculate tax
// @route   POST /api/tax/calculate
// @access  Private
const calculateTax = async (req, res) => {
  try {
    const {
      salary,
      otherIncome,
      deductions,
      regime,
      financialYear = '2024-2025'
    } = req.body;

    const calculator = new TaxCalculator(financialYear);

    // Calculate total income
    const totalIncome = {
      total: (salary.basic || 0) + 
             (salary.hra || 0) + 
             (salary.specialAllowance || 0) + 
             (salary.otherAllowances || 0) +
             (otherIncome.interest || 0) +
             (otherIncome.rental || 0) +
             (otherIncome.capitalGains || 0) +
             (otherIncome.other || 0)
    };

    // Calculate total deductions
    const totalDeductions = {
      total: (deductions.section80C || 0) +
             (deductions.section80D || 0) +
             (deductions.section80E || 0) +
             (deductions.section80G || 0) +
             (deductions.section80TTA || 0) +
             (deductions.nps || 0) +
             (deductions.hraExemption || 0) +
             (deductions.homeLoanInterest || 0) +
             (deductions.otherDeductions || 0) +
             50000, // Standard deduction
      ...deductions
    };

    // Calculate tax for both regimes
    const comparison = calculator.compareRegimes(totalIncome, totalDeductions);

    // Get user profile for suggestions
    const user = await User.findById(req.user.id);
    const suggestions = calculator.generateSuggestions(
      {
        income: { salary, otherIncome },
        investments: user.financialProfile.existingInvestments,
        expenses: user.financialProfile.expenses,
        age: user.age,
        residence: user.personalInfo.residence
      },
      deductions
    );

    // Save calculation to database
    const taxCalculation = await TaxCalculation.create({
      userId: req.user.id,
      financialYear,
      inputs: {
        salary,
        otherIncome,
        deductions,
        regime
      },
      results: comparison,
      suggestions
    });

    res.json({
      success: true,
      data: {
        calculation: taxCalculation,
        comparison,
        suggestions
      }
    });
  } catch (error) {
    console.error('Tax calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get tax calculation history
// @route   GET /api/tax/history
// @access  Private
const getTaxHistory = async (req, res) => {
  try {
    const calculations = await TaxCalculation.find({ userId: req.user.id })
      .sort({ calculationDate: -1 })
      .limit(10);

    res.json({
      success: true,
      data: calculations
    });
  } catch (error) {
    console.error('Get tax history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get specific tax calculation
// @route   GET /api/tax/calculations/:id
// @access  Private
const getTaxCalculation = async (req, res) => {
  try {
    const calculation = await TaxCalculation.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!calculation) {
      return res.status(404).json({
        success: false,
        message: 'Calculation not found'
      });
    }

    res.json({
      success: true,
      data: calculation
    });
  } catch (error) {
    console.error('Get tax calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get tax saving suggestions
// @route   POST /api/tax/suggestions
// @access  Private
const getTaxSuggestions = async (req, res) => {
  try {
    const { currentInvestments } = req.body;
    
    const user = await User.findById(req.user.id);
    const calculator = new TaxCalculator();

    const suggestions = calculator.generateSuggestions(
      {
        income: { salary: user.employmentInfo },
        investments: user.financialProfile.existingInvestments,
        expenses: user.financialProfile.expenses,
        age: user.age,
        residence: user.personalInfo.residence
      },
      currentInvestments
    );

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Get tax suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get latest tax rules
// @route   GET /api/tax/latest-rules
// @access  Public
const getLatestRules = async (req, res) => {
  try {
    const calculator = new TaxCalculator();
    const taxSlabs = calculator.getTaxSlabs();

    res.json({
      success: true,
      data: {
        financialYear: '2024-2025',
        taxSlabs,
        cessRate: 0.04,
        standardDeduction: 50000,
        section80CLimit: 150000,
        section80DLimit: 25000,
        section80ELimit: 'No limit',
        npsLimit: 50000
      }
    });
  } catch (error) {
    console.error('Get latest rules error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  calculateTax,
  getTaxHistory,
  getTaxCalculation,
  getTaxSuggestions,
  getLatestRules
};
