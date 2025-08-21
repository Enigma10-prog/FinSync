const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      dateOfBirth, 
      city, 
      state, 
      employmentType, 
      monthlyIncome 
    } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ 'personalInfo.email': email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    const user = await User.create({
      personalInfo: {
        name,
        email,
        dateOfBirth,
        residence: {
          city,
          state,
          isMetro: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'].includes(city)
        }
      },
      employmentInfo: {
        type: employmentType,
        monthlyIncome: parseFloat(monthlyIncome)
      },
      auth: {
        password
      }
    });

    if (user) {
      const token = generateToken(user._id);
      
      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.personalInfo.name,
            email: user.personalInfo.email
          },
          token
        }
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ 'personalInfo.email': email }).select('+auth.password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.personalInfo.name,
          email: user.personalInfo.email
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.personalInfo.name,
          email: user.personalInfo.email,
          age: user.age,
          employmentInfo: user.employmentInfo,
          financialProfile: user.financialProfile,
          preferences: user.preferences
        }
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

module.exports = {
  register,
  login,
  getMe,
  logout
};
