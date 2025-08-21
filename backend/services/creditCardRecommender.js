class CreditCardRecommender {
  constructor(cards) {
    this.cards = cards;
  }

  filterByEligibility(cards, userProfile) {
    return cards.filter(card => {
      // Check income eligibility
      if (userProfile.income < card.eligibility.minIncome) {
        return false;
      }
      
      // Check credit score eligibility
      if (userProfile.creditScore < card.eligibility.minCibilScore) {
        return false;
      }
      
      // Check employment type eligibility
      if (card.eligibility.employmentType.length > 0 && 
          !card.eligibility.employmentType.includes(userProfile.employmentType)) {
        return false;
      }
      
      return true;
    });
  }

  calculateMatchScore(card, userProfile) {
    let score = 0;
    const maxScore = 100;
    
    // Spending pattern matching (40%)
    const spendingMatch = this.calculateSpendingMatch(card, userProfile.spendingPattern);
    score += spendingMatch * 0.4;
    
    // Fee sensitivity (20%)
    const feeScore = userProfile.feeSensitivity ? 
      (card.annualFee === 0 ? 1 : 0.2) : 0.8;
    score += feeScore * 0.2;
    
    // Reward preference matching (20%)
    const rewardMatch = this.calculateRewardMatch(card, userProfile.rewardPreferences);
    score += rewardMatch * 0.2;
    
    // Card rating (10%)
    const ratingScore = card.rating / 5;
    score += ratingScore * 0.1;
    
    // Approval rate (10%)
    const approvalScore = card.approvalRate / 100;
    score += approvalScore * 0.1;
    
    return Math.round(score * maxScore);
  }

  calculateSpendingMatch(card, spendingPattern) {
    let match = 0;
    const totalSpending = Object.values(spendingPattern).reduce((sum, amount) => sum + amount, 0);
    
    if (totalSpending === 0) return 0.5; // Neutral score if no spending data
    
    for (const category of card.features.rewardCategories) {
      const categorySpending = spendingPattern[category.category] || 0;
      const spendingRatio = categorySpending / totalSpending;
      match += spendingRatio * (category.rate / 10); // Normalize rate to 0-1 scale
    }
    
    return Math.min(1, match);
  }

  calculateRewardMatch(card, rewardPreferences) {
    if (!rewardPreferences || rewardPreferences.length === 0) return 0.5;
    
    let match = 0;
    
    for (const preference of rewardPreferences) {
      if (card.category.toLowerCase() === preference.toLowerCase()) {
        match += 0.5;
      }
      
      if (card.features.rewardCategories.some(cat => 
        cat.category.toLowerCase() === preference.toLowerCase())) {
        match += 0.5;
      }
    }
    
    return Math.min(1, match / rewardPreferences.length);
  }

  recommendCards(userProfile, limit = 5) {
    // First filter by eligibility
    const eligibleCards = this.filterByEligibility(this.cards, userProfile);
    
    // Calculate match score for each eligible card
    const scoredCards = eligibleCards.map(card => {
      const matchScore = this.calculateMatchScore(card, userProfile);
      return { ...card.toObject(), matchScore };
    });
    
    // Sort by match score (descending) and return top results
    return scoredCards
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }

  compareCards(cardIds, userProfile) {
    const cards = this.cards.filter(card => cardIds.includes(card._id.toString()));
    const comparisons = cards.map(card => {
      const matchScore = this.calculateMatchScore(card, userProfile);
      const annualValue = this.calculateAnnualValue(card, userProfile.spendingPattern);
      
      return {
        card: card,
        matchScore,
        annualValue,
        keyFeatures: this.extractKeyFeatures(card)
      };
    });
    
    return comparisons.sort((a, b) => b.matchScore - a.matchScore);
  }

  calculateAnnualValue(card, spendingPattern) {
    let annualRewards = 0;
    let annualFees = card.annualFee;
    
    // Calculate rewards based on spending pattern
    for (const category of card.features.rewardCategories) {
      const categorySpending = spendingPattern[category.category] || 0;
      const monthlyCapping = category.capping || Infinity;
      const monthlyRewards = Math.min(categorySpending * category.rate / 100, monthlyCapping);
      annualRewards += monthlyRewards * 12;
    }
    
    // Add value of other benefits
    let benefitValue = 0;
    if (card.features.airportLoungeAccess) {
      benefitValue += card.features.loungeAccessCount * 1000; // Approximate value per visit
    }
    
    if (card.features.fuelSurchargeWaiver) {
      // Assuming fuel spending and surcharge waiver
      const fuelSpending = spendingPattern.fuel || 0;
      benefitValue += fuelSpending * 0.01 * 12; // 1% surcharge waiver
    }
    
    return annualRewards + benefitValue - annualFees;
  }

  extractKeyFeatures(card) {
    const features = [];
    
    // Add reward features
    if (card.features.rewardCategories.length > 0) {
      const topCategory = card.features.rewardCategories
        .sort((a, b) => b.rate - a.rate)[0];
      features.push(`${topCategory.rate}% rewards on ${topCategory.category}`);
    }
    
    // Add benefit features
    if (card.features.airportLoungeAccess) {
      features.push(`Airport lounge access (${card.features.loungeAccessCount} visits)`);
    }
    
    if (card.features.fuelSurchargeWaiver) {
      features.push('Fuel surcharge waiver');
    }
    
    if (card.features.domesticTravelInsurance > 0) {
      features.push(`Travel insurance: ₹${card.features.domesticTravelInsurance.toLocaleString()}`);
    }
    
    // Add fee information
    features.push(`Annual fee: ₹${card.annualFee}`);
    
    return features.slice(0, 5); // Return top 5 features
  }
}

module.exports = CreditCardRecommender;
