class TaxCalculator {
  constructor(financialYear = '2024-2025') {
    this.financialYear = financialYear;
    this.taxSlabs = this.getTaxSlabs();
    this.cessRate = 0.04; // 4% health and education cess
  }

  getTaxSlabs() {
    // Return tax slabs based on financial year
    return {
      oldRegime: [
        { limit: 250000, rate: 0 },
        { limit: 500000, rate: 0.05 },
        { limit: 1000000, rate: 0.20 },
        { limit: Infinity, rate: 0.30 }
      ],
      newRegime: [
        { limit: 300000, rate: 0 },
        { limit: 600000, rate: 0.05 },
        { limit: 900000, rate: 0.10 },
        { limit: 1200000, rate: 0.15 },
        { limit: 1500000, rate: 0.20 },
        { limit: Infinity, rate: 0.30 }
      ]
    };
  }

  calculateTaxableIncome(income, deductions, regime) {
    let taxableIncome = income.total;
    
    if (regime === 'OLD') {
      // Apply all deductions for old regime
      taxableIncome -= deductions.total;
    } else {
      // Apply only specific deductions for new regime
      taxableIncome -= deductions.standardDeduction || 50000;
      // Other limited deductions as per new regime rules
    }
    
    return Math.max(0, taxableIncome);
  }

  calculateTaxBySlab(taxableIncome, slabs) {
    let tax = 0;
    let remainingIncome = taxableIncome;
    let previousLimit = 0;

    for (const slab of slabs) {
      if (remainingIncome <= 0) break;
      
      const taxableInSlab = Math.min(remainingIncome, slab.limit - previousLimit);
      tax += taxableInSlab * slab.rate;
      remainingIncome -= taxableInSlab;
      previousLimit = slab.limit;
    }

    return tax;
  }

  calculate(income, deductions, regime = 'OLD') {
    const taxableIncome = this.calculateTaxableIncome(income, deductions, regime);
    const slabs = this.taxSlabs[regime.toLowerCase() + 'Regime'];
    const taxAmount = this.calculateTaxBySlab(taxableIncome, slabs);
    const cess = taxAmount * this.cessRate;
    const totalTax = taxAmount + cess;

    return {
      grossIncome: income.total,
      totalDeductions: deductions.total,
      taxableIncome,
      taxAmount,
      cess,
      totalTax
    };
  }

  compareRegimes(income, deductions) {
    const oldRegimeResult = this.calculate(income, deductions, 'OLD');
    const newRegimeResult = this.calculate(income, deductions, 'NEW');
    
    const recommendedRegime = oldRegimeResult.totalTax <= newRegimeResult.totalTax ? 'OLD' : 'NEW';
    const potentialSavings = Math.abs(oldRegimeResult.totalTax - newRegimeResult.totalTax);

    return {
      oldRegime: oldRegimeResult,
      newRegime: newRegimeResult,
      recommendedRegime,
      potentialSavings
    };
  }

  generateSuggestions(userProfile, currentDeductions) {
    const suggestions = [];
    const { income, investments, expenses } = userProfile;
    
    // Section 80C suggestions (max 1.5L)
    const eightyCLimit = 150000;
    const current80C = currentDeductions.section80C || 0;
    
    if (current80C < eightyCLimit) {
      const remaining80C = eightyCLimit - current80C;
      suggestions.push({
        category: 'Investment',
        instrument: 'ELSS Mutual Funds',
        section: '80C',
        suggestedAmount: Math.min(remaining80C, 50000),
        potentialSavings: Math.min(remaining80C, 50000) * 0.3, // Assuming 30% tax bracket
        priority: 'HIGH'
      });
    }
    
    // Section 80D suggestions (Health Insurance)
    const eightyDLimit = userProfile.age > 60 ? 50000 : 25000;
    const current80D = currentDeductions.section80D || 0;
    
    if (current80D < eightyDLimit) {
      const remaining80D = eightyDLimit - current80D;
      suggestions.push({
        category: 'Insurance',
        instrument: 'Health Insurance Premium',
        section: '80D',
        suggestedAmount: remaining80D,
        potentialSavings: remaining80D * 0.3,
        priority: 'MEDIUM'
      });
    }
    
    // HRA optimization
    if (expenses.rent > 0 && income.salary > 0) {
      const hraExemption = this.calculateHRAExemption(
        income.salary.basic, 
        expenses.rent, 
        userProfile.residence.isMetro
      );
      
      if (currentDeductions.hraExemption < hraExemption) {
        suggestions.push({
          category: 'Allowance',
          instrument: 'HRA Declaration',
          section: '10(13A)',
          suggestedAmount: hraExemption - currentDeductions.hraExemption,
          potentialSavings: (hraExemption - currentDeductions.hraExemption) * 0.3,
          priority: 'HIGH'
        });
      }
    }
    
    return suggestions;
  }

  calculateHRAExemption(basicSalary, actualRent, isMetro) {
    const fiftyPercentOfBasic = basicSalary * 0.5;
    const actualRentMinus10Percent = actualRent - (basicSalary * 0.1);
    const exemption = Math.min(
      fiftyPercentOfBasic,
      actualRentMinus10Percent,
      actualRent
    );
    
    return Math.max(0, exemption);
  }
}

module.exports = TaxCalculator;
