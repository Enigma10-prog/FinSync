const mongoose = require('mongoose');

// Import models before connecting
require('../models/User');
require('../models/TaxCalculation');
require('../models/CreditCard');
require('../models/FinancialDashboard');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('Error: MONGO_URI environment variable is not defined!');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Optional: Create indexes for performance
    await mongoose.model('User').createIndexes({ 'personalInfo.email': 1 });
    await mongoose.model('TaxCalculation').createIndexes({ userId: 1, calculationDate: -1 });
    await mongoose.model('CreditCard').createIndexes({ category: 1, issuer: 1 });
    await mongoose.model('FinancialDashboard').createIndexes({ userId: 1 });

  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
