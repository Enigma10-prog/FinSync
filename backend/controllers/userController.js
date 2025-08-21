const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.personalInfo.name,
          email: user.personalInfo.email,
          phone: user.personalInfo.phone,
          dateOfBirth: user.personalInfo.dateOfBirth,
          gender: user.personalInfo.gender,
          residence: user.personalInfo.residence,
          employmentInfo: user.employmentInfo,
          financialProfile: user.financialProfile,
          preferences: user.preferences,
          age: user.age
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { personalInfo, employmentInfo, financialProfile, preferences } = req.body;
    
    const updateData = {};
    
    if (personalInfo) {
      updateData.personalInfo = { ...req.user.personalInfo, ...personalInfo };
    }
    
    if (employmentInfo) {
      updateData.employmentInfo = { ...req.user.employmentInfo, ...employmentInfo };
    }
    
    if (financialProfile) {
      updateData.financialProfile = { ...req.user.financialProfile, ...financialProfile };
    }
    
    if (preferences) {
      updateData.preferences = { ...req.user.preferences, ...preferences };
    }
    
    updateData.updatedAt = new Date();
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.personalInfo.name,
          email: user.personalInfo.email,
          phone: user.personalInfo.phone,
          dateOfBirth: user.personalInfo.dateOfBirth,
          gender: user.personalInfo.gender,
          residence: user.personalInfo.residence,
          employmentInfo: user.employmentInfo,
          financialProfile: user.financialProfile,
          preferences: user.preferences,
          age: user.age
        }
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get financial profile
// @route   GET /api/users/financial-profile
// @access  Private
const getFinancialProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      data: {
        financialProfile: user.financialProfile,
        employmentInfo: user.employmentInfo,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Get financial profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update financial profile
// @route   PUT /api/users/financial-profile
// @access  Private
const updateFinancialProfile = async (req, res) => {
  try {
    const { financialProfile, employmentInfo, preferences } = req.body;
    
    const updateData = {};
    
    if (financialProfile) {
      updateData.financialProfile = { ...req.user.financialProfile, ...financialProfile };
    }
    
    if (employmentInfo) {
      updateData.employmentInfo = { ...req.user.employmentInfo, ...employmentInfo };
    }
    
    if (preferences) {
      updateData.preferences = { ...req.user.preferences, ...preferences };
    }
    
    updateData.updatedAt = new Date();
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: {
        financialProfile: user.financialProfile,
        employmentInfo: user.employmentInfo,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Update financial profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    
    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getFinancialProfile,
  updateFinancialProfile,
  deleteAccount
}; 