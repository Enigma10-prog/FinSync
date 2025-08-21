const CreditCard = require('../models/CreditCard');

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
      documentation: ["PAN Card", "Aadhaar Card", "Salary Slips"],
      processingTime: "5-7 working days"
    },
    rating: 4.2,
    reviewCount: 890,
    approvalRate: 90,
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
    renewalConditions: "No annual fee",
    eligibility: {
      minIncome: 400000,
      minCibilScore: 650,
      employmentType: ["Salaried", "Self-Employed"]
    },
    features: {
      rewardRate: 1,
      rewardCategories: [
        { category: "Amazon", rate: 5, capping: 5000 },
        { category: "Fuel", rate: 2, capping: 2000 },
        { category: "Others", rate: 1, capping: 100000 }
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
      { type: "Amazon", description: "5% cashback on Amazon purchases" },
      { type: "Fuel", description: "2% cashback on fuel spends" },
      { type: "No Annual Fee", description: "Lifetime free credit card" },
      { type: "Cashback", description: "1% unlimited cashback on all spends" }
    ],
    applicationProcess: {
      documentation: ["PAN Card", "Aadhaar Card", "Salary Slips"],
      processingTime: "3-5 working days"
    },
    rating: 4.7,
    reviewCount: 2100,
    approvalRate: 95,
    imageUrl: "https://example.com/icici-amazon-pay.jpg",
    applyUrl: "https://www.icicibank.com/Personal-Banking/cards/credit-card/amazon-pay-credit-card/index.page",
    isActive: true
  },
  {
    name: "Axis Flipkart Credit Card",
    issuer: "Axis",
    category: "Shopping",
    joiningFee: 500,
    annualFee: 500,
    renewalConditions: "Spend ₹50K in a year to get annual fee waiver",
    eligibility: {
      minIncome: 400000,
      minCibilScore: 650,
      employmentType: ["Salaried", "Self-Employed"]
    },
    features: {
      rewardRate: 1.5,
      rewardCategories: [
        { category: "Flipkart", rate: 5, capping: 5000 },
        { category: "Fuel", rate: 1, capping: 2000 },
        { category: "Others", rate: 1.5, capping: 100000 }
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
      { type: "Flipkart", description: "5% unlimited rewards on Flipkart" },
      { type: "Fuel", description: "1% fuel surcharge waiver up to ₹200" },
      { type: "Rewards", description: "1.5% rewards on all other spends" },
      { type: "Welcome", description: "₹500 welcome voucher on Flipkart" }
    ],
    applicationProcess: {
      documentation: ["PAN Card", "Aadhaar Card", "Salary Slips"],
      processingTime: "5-7 working days"
    },
    rating: 4.3,
    reviewCount: 750,
    approvalRate: 88,
    imageUrl: "https://example.com/axis-flipkart.jpg",
    applyUrl: "https://www.axisbank.com/retail/cards/credit-card/flipkart-axis-bank-credit-card",
    isActive: true
  },
  {
    name: "Citi PremierMiles Credit Card",
    issuer: "Citi",
    category: "Travel",
    joiningFee: 3000,
    annualFee: 3000,
    renewalConditions: "Spend ₹5L in a year to get annual fee waiver",
    eligibility: {
      minIncome: 1500000,
      minCibilScore: 750,
      employmentType: ["Salaried", "Self-Employed"]
    },
    features: {
      rewardRate: 2,
      rewardCategories: [
        { category: "Travel", rate: 3, capping: 15000 },
        { category: "Dining", rate: 2, capping: 10000 },
        { category: "Others", rate: 2, capping: 100000 }
      ],
      airportLoungeAccess: true,
      loungeAccessCount: 12,
      fuelSurchargeWaiver: true,
      surchargeWaiverLimit: 4000,
      domesticTravelInsurance: 2000000,
      internationalTravelInsurance: 5000000,
      rentalCarDiscount: true,
      golfAccess: true
    },
    interestRates: {
      purchase: 3.49,
      cashAdvance: 3.49
    },
    fees: {
      cashAdvance: 2.5,
      latePayment: 1000,
      overLimit: 750
    },
    benefits: [
      { type: "Travel", description: "3X miles on travel spends" },
      { type: "Lounge", description: "12 complimentary airport lounge visits" },
      { type: "Insurance", description: "₹20L domestic travel insurance" },
      { type: "Miles", description: "2X miles on all other spends" }
    ],
    applicationProcess: {
      documentation: ["PAN Card", "Aadhaar Card", "Salary Slips", "Bank Statements", "IT Returns"],
      processingTime: "10-15 working days"
    },
    rating: 4.6,
    reviewCount: 680,
    approvalRate: 75,
    imageUrl: "https://example.com/citi-premiermiles.jpg",
    applyUrl: "https://www.citibank.co.in/credit-card/premiermiles-credit-card",
    isActive: true
  }
];

const seedCreditCards = async () => {
  try {
    // Clear existing data
    await CreditCard.deleteMany({});
    
    // Insert sample data
    await CreditCard.insertMany(sampleCreditCards);
    
    console.log('Credit card data seeded successfully');
  } catch (error) {
    console.error('Error seeding credit card data:', error);
  }
};

module.exports = { seedCreditCards };
