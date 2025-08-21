const mongoose = require('mongoose');
const CreditCard = require('./models/CreditCard');
require('dotenv').config();

const sampleCreditCards = [
  {
    name: "HDFC Regalia Credit Card",
    issuer: "HDFC",
    category: "Premium",
    joiningFee: 2500,
    annualFee: 2500,
    renewalConditions: "Spend ₹3L in a year to get annual fee waiver",
    eligibility: {
      minIncome: 1200000,
      minCibilScore: 750,
      employmentType: ["Salaried", "Self-Employed"]
    },
    features: {
      rewardRate: 1.5,
      rewardCategories: [
        { category: "Travel", rate: 2.5, capping: 10000 },
        { category: "Dining", rate: 2.5, capping: 10000 },
        { category: "Shopping", rate: 1.5, capping: 50000 }
      ],
      airportLoungeAccess: true,
      loungeAccessCount: 8,
      fuelSurchargeWaiver: true,
      surchargeWaiverLimit: 4000,
      domesticTravelInsurance: 1000000,
      internationalTravelInsurance: 2000000,
      rentalCarDiscount: true,
      golfAccess: true
    },
    interestRates: {
      purchase: 3.49,
      cashAdvance: 3.49
    },
    fees: {
      cashAdvance: 2.5,
      latePayment: 750,
      overLimit: 500
    },
    benefits: [
      { type: "Rewards", description: "1.5% unlimited rewards on all spends" },
      { type: "Travel", description: "8 complimentary airport lounge visits" },
      { type: "Insurance", description: "₹10L domestic travel insurance" },
      { type: "Fuel", description: "1% fuel surcharge waiver up to ₹400" }
    ],
    applicationProcess: {
      documentation: ["PAN Card", "Aadhaar Card", "Salary Slips", "Bank Statements"],
      processingTime: "7-10 working days"
    },
    rating: 4.5,
    reviewCount: 1250,
    approvalRate: 85,
    imageUrl: "https://example.com/hdfc-regalia.jpg",
    applyUrl: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia",
    isActive: true
  },
  {
    name: "SBI SimplyCLICK Credit Card",
    issuer: "SBI",
    category: "Shopping",
    joiningFee: 999,
    annualFee: 999,
    renewalConditions: "Spend ₹1L in a year to get annual fee waiver",
    eligibility: {
      minIncome: 600000,
      minCibilScore: 700,
      employmentType: ["Salaried", "Self-Employed"]
    },
    features: {
      rewardRate: 1.25,
      rewardCategories: [
        { category: "Online Shopping", rate: 10, capping: 2000 },
        { category: "Dining", rate: 5, capping: 1000 },
        { category: "Movies", rate: 5, capping: 1000 }
      ],
      airportLoungeAccess: false,
      loungeAccessCount: 0,
      fuelSurchargeWaiver: true,
      surchargeWaiverLimit: 2000,
      domesticTravelInsurance: 0,
      internationalTravelInsurance: 0,
      rentalCarDiscount: false,
      golfAccess: false
    },
    interestRates: {
      purchase: 3.99,
      cashAdvance: 3.99
    },
    fees: {
      cashAdvance: 2.5,
      latePayment: 750,
      overLimit: 500
    },
    benefits: [
      { type: "Online Shopping", description: "10X rewards on online shopping" },
      { type: "Dining", description: "5X rewards on dining spends" },
      { type: "Movies", description: "5X rewards on movie ticket bookings" },
      { type: "Fuel", description: "1% fuel surcharge waiver up to ₹200" }
    ],
    applicationProcess: {
      documentation: ["PAN Card", "Aadhaar Card", "Salary Slips", "Bank Statements"],
      processingTime: "5-7 working days"
    },
    rating: 4.2,
    reviewCount: 890,
    approvalRate: 78,
    imageUrl: "https://example.com/sbi-simplyclick.jpg",
    applyUrl: "https://www.sbicard.com/en/personal/credit-cards/rewards/simplyclick.page",
    isActive: true
  },
  {
    name: "ICICI Amazon Pay Credit Card",
    issuer: "ICICI",
    category: "Cashback",
    joiningFee: 0,
    annualFee: 0,
    renewalConditions: "Lifetime free",
    eligibility: {
      minIncome: 600000,
      minCibilScore: 700,
      employmentType: ["Salaried", "Self-Employed", "Business"]
    },
    features: {
      rewardRate: 5,
      rewardCategories: [
        { category: "Amazon", rate: 5, capping: 5000 },
        { category: "Other Spends", rate: 1, capping: 10000 }
      ],
      airportLoungeAccess: false,
      loungeAccessCount: 0,
      fuelSurchargeWaiver: true,
      surchargeWaiverLimit: 2000,
      domesticTravelInsurance: 0,
      internationalTravelInsurance: 0,
      rentalCarDiscount: false,
      golfAccess: false
    },
    interestRates: {
      purchase: 3.99,
      cashAdvance: 3.99
    },
    fees: {
      cashAdvance: 2.5,
      latePayment: 750,
      overLimit: 500
    },
    benefits: [
      { type: "Cashback", description: "5% cashback on Amazon for Prime members" },
      { type: "Cashback", description: "2% cashback on Amazon for non-Prime members" },
      { type: "Cashback", description: "1% cashback on all other spends" },
      { type: "Fuel", description: "1% fuel surcharge waiver up to ₹200" }
    ],
    applicationProcess: {
      documentation: ["PAN Card", "Aadhaar Card", "Salary Slips"],
      processingTime: "3-5 working days"
    },
    rating: 4.8,
    reviewCount: 2100,
    approvalRate: 92,
    imageUrl: "https://example.com/icici-amazon.jpg",
    applyUrl: "https://www.amazon.in/icici-credit-card",
    isActive: true
  }
];

const setupDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/financial-advisor');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await CreditCard.deleteMany({});
    console.log('✅ Cleared existing credit card data');

    // Insert sample data
    const insertedCards = await CreditCard.insertMany(sampleCreditCards);
    console.log(`✅ Inserted ${insertedCards.length} sample credit cards`);

    // Create indexes
    await CreditCard.createIndexes();
    console.log('✅ Created database indexes');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('📊 Sample credit cards added:');
    insertedCards.forEach(card => {
      console.log(`   - ${card.name} (${card.issuer})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase; 