import React from 'react';
import CardRecommender from '../components/creditcards/CardRecommender';

const CreditCards = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Credit Card Recommendations</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the perfect credit card based on your spending patterns, income, and preferences. 
            Get personalized recommendations from 100+ cards available in India.
          </p>
        </div>
        
        <CardRecommender />
      </div>
    </div>
  );
};

export default CreditCards;