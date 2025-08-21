const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Set up indexes for better performance
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
