const CreditCard = require('../models/CreditCard');
const CreditCardRecommender = require('../services/creditCardRecommender');

// @desc    Get all credit cards with filtering
// @route   GET /api/credit-cards
// @access  Public
const getCreditCards = async (req, res) => {
  try {
    const { category, issuer, minIncome, maxFee } = req.query;
    
    let query = { isActive: true };
    
    if (category) query.category = category;
    if (issuer) query.issuer = issuer;
    if (minIncome) query['eligibility.minIncome'] = { $lte: parseInt(minIncome) };
    if (maxFee) query.annualFee = { $lte: parseInt(maxFee) };
    
    const cards = await CreditCard.find(query).sort({ rating: -1 });
    
    res.json({
      success: true,
      data: cards
    });
  } catch (error) {
    console.error('Get credit cards error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get personalized card recommendations
// @route   POST /api/credit-cards/recommend
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    const { income, creditScore, spendingPattern, preferences } = req.body;
    
    const cards = await CreditCard.find({ isActive: true });
    const recommender = new CreditCardRecommender(cards);
    
    const userProfile = {
      income: parseInt(income),
      creditScore: parseInt(creditScore),
      spendingPattern,
      rewardPreferences: preferences?.rewardTypes || [],
      feeSensitivity: preferences?.feeSensitivity || false,
      employmentType: req.user.employmentInfo.type
    };
    
    const recommendations = recommender.recommendCards(userProfile, 5);
    
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get specific card details
// @route   GET /api/credit-cards/:id
// @access  Public
const getCreditCard = async (req, res) => {
  try {
    const card = await CreditCard.findById(req.params.id);
    
    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Credit card not found'
      });
    }
    
    res.json({
      success: true,
      data: card
    });
  } catch (error) {
    console.error('Get credit card error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Compare multiple cards
// @route   POST /api/credit-cards/compare
// @access  Private
const compareCards = async (req, res) => {
  try {
    const { cardIds, userProfile } = req.body;
    
    const cards = await CreditCard.find({ 
      _id: { $in: cardIds },
      isActive: true 
    });
    
    const recommender = new CreditCardRecommender(cards);
    const comparison = recommender.compareCards(cardIds, userProfile);
    
    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    console.error('Compare cards error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get card categories
// @route   GET /api/credit-cards/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await CreditCard.distinct('category');
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  getCreditCards,
  getRecommendations,
  getCreditCard,
  compareCards,
  getCategories
}; 