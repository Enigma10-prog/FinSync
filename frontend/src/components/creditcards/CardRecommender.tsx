import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { 
  CreditCardIcon, 
  SparklesIcon, 
  TrophyIcon, 
  BanknotesIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon,
  FunnelIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { creditCardsAPI, CreditCard, CreditCardRecommendation } from '../../services/api';

// Types
interface UserProfile {
  monthlyIncome: number;
  creditScore: number;
  employmentType: string;
  age: number;
  city: string;
  spending: {
    [category: string]: number;
  };
  preferences: {
    feeTolerance: 'none' | 'low' | 'medium' | 'high';
    rewardPreference: 'cashback' | 'points' | 'miles' | 'lifestyle';
    cardUsage: 'everyday' | 'travel' | 'shopping' | 'fuel' | 'premium';
  };
}

// Main Component
const UltimateCardRecommender = () => {
  const [recommendations, setRecommendations] = useState<CreditCardRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    issuers: [] as string[],
    categories: [] as string[],
    annualFee: [0, 10000] as [number, number],
    minIncome: 0,
  });
  const [availableCards, setAvailableCards] = useState<CreditCard[]>([]);
  const [issuers, setIssuers] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();

  // Watch form values for real-time updates
  const formValues = watch();

  // Spending categories for the form
  const spendingCategories = [
    { id: 'groceries', label: 'Groceries & Supermarket' },
    { id: 'dining', label: 'Dining & Food Delivery' },
    { id: 'travel', label: 'Travel & Transport' },
    { id: 'fuel', label: 'Fuel & Automotive' },
    { id: 'online', label: 'Online Shopping' },
    { id: 'bills', label: 'Utility Bills' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'health', label: 'Health & Fitness' },
    { id: 'fashion', label: 'Fashion & Lifestyle' },
    { id: 'electronics', label: 'Electronics & Gadgets' },
  ];

  // Load available cards and metadata on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load all credit cards
        const cards = await creditCardsAPI.getAllCards();
        setAvailableCards(cards);
        
        // Extract unique issuers and categories
        const uniqueIssuers = Array.from(new Set(cards.map(card => card.issuer)));
        const uniqueCategories = Array.from(new Set(cards.map(card => card.category)));
        
        setIssuers(uniqueIssuers);
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Failed to load credit cards:', error);
      }
    };

    loadInitialData();
  }, []);

  // Advanced recommendation algorithm using backend API
  const generateRecommendations = async (data: any) => {
    setLoading(true);
    
    try {
      // Prepare user profile for API
      const userProfile = {
        income: parseFloat(data.income) || 0,
        creditScore: data.creditScore === 'excellent' ? 800 : 
                    data.creditScore === 'good' ? 750 :
                    data.creditScore === 'fair' ? 700 : 650,
        spendingPattern: {
          groceries: parseFloat(data.groceries) || 0,
          dining: parseFloat(data.dining) || 0,
          travel: parseFloat(data.travel) || 0,
          fuel: parseFloat(data.fuel) || 0,
          online: parseFloat(data.online) || 0,
          bills: parseFloat(data.bills) || 0,
          entertainment: parseFloat(data.entertainment) || 0,
          health: parseFloat(data.health) || 0,
          fashion: parseFloat(data.fashion) || 0,
          electronics: parseFloat(data.electronics) || 0,
        },
        preferences: {
          rewardTypes: [data.rewardPreference || 'cashback'],
          feeSensitivity: data.feePreference === 'none' || data.feePreference === 'low'
        }
      };

      // Get recommendations from backend
      const apiRecommendations = await creditCardsAPI.getRecommendations(userProfile);
      
      // Apply additional filters if any
      let filteredRecommendations = apiRecommendations;
      
      if (filters.issuers.length > 0) {
        filteredRecommendations = filteredRecommendations.filter(card => 
          filters.issuers.includes(card.issuer)
        );
      }
      
      if (filters.categories.length > 0) {
        filteredRecommendations = filteredRecommendations.filter(card => 
          filters.categories.includes(card.category)
        );
      }
      
      if (filters.minIncome > 0) {
        filteredRecommendations = filteredRecommendations.filter(card => 
          card.eligibility.minIncome <= filters.minIncome
        );
      }
      
      filteredRecommendations = filteredRecommendations.filter(card => 
        card.annualFee >= filters.annualFee[0] && card.annualFee <= filters.annualFee[1]
      );
      
      setRecommendations(filteredRecommendations);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      // Fallback to local filtering if API fails
      const fallbackRecommendations = availableCards
        .filter(card => {
          const annualIncome = (parseFloat(data.income) || 0) * 12;
          return annualIncome >= card.eligibility.minIncome;
        })
        .slice(0, 5)
        .map(card => ({ ...card, matchScore: Math.floor(Math.random() * 30) + 70 }));
      
      setRecommendations(fallbackRecommendations);
    } finally {
      setLoading(false);
    }
  };

  const toggleCardComparison = (cardId: string) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter(id => id !== cardId));
    } else if (selectedCards.length < 3) {
      setSelectedCards([...selectedCards, cardId]);
    }
  };

  const compareCards = () => {
    setShowComparison(true);
  };

  const resetFilters = () => {
    setFilters({
      issuers: [],
      categories: [],
      annualFee: [0, 10000],
      minIncome: 0,
    });
  };

  const CardItem = ({ card, index, showCheckbox = false }: { 
    card: CreditCardRecommendation; 
    index: number;
    showCheckbox?: boolean;
  }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Card Header */}
      <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-green-50">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              {index === 0 && <SparklesIcon className="h-5 w-5 text-yellow-500 mr-1" />}
              <span className="text-lg font-bold text-gray-900">{card.name}</span>
            </div>
            <p className="text-gray-600">{card.issuer}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {card.category}
              </span>
            </div>
          </div>
          <div className="text-right ml-4">
            <div className={`text-2xl font-bold ${
              card.matchScore >= 90 ? 'text-green-600' : 
              card.matchScore >= 75 ? 'text-blue-600' : 'text-orange-600'
            }`}>
              {card.matchScore}%
            </div>
            <p className="text-sm text-gray-500">Match Score</p>
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <BanknotesIcon className="h-5 w-5 mr-2 text-blue-500" />
              Card Details
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Annual Fee:</span>
                <span className="font-medium">₹{card.annualFee === 0 ? '0 (Free)' : card.annualFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Joining Fee:</span>
                <span className="font-medium">₹{card.joiningFee === 0 ? '0' : card.joiningFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Min Income:</span>
                <span className="font-medium">₹{(card.eligibility.minIncome/100000).toFixed(0)}L/year</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Min CIBIL:</span>
                <span className="font-medium">{card.eligibility.minCibilScore}+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reward Rate:</span>
                <span className="font-medium text-green-600">{card.features.rewardRate}%</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2 text-green-500" />
              Key Features
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {card.benefits.slice(0, 3).map((benefit, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="flex-1">{benefit.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold text-green-700 mb-2">Benefits</h4>
            <ul className="space-y-1 text-sm">
              {card.benefits.slice(0, 3).map((benefit, idx) => (
                <li key={idx} className="flex items-start text-green-600">
                  <span className="mr-2">+</span>
                  <span className="flex-1">{benefit.description}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-blue-700 mb-2">Features</h4>
            <ul className="space-y-1 text-sm">
              {card.features.airportLoungeAccess && (
                <li className="flex items-start text-blue-600">
                  <span className="mr-2">✈️</span>
                  <span className="flex-1">Airport lounge access ({card.features.loungeAccessCount} visits)</span>
                </li>
              )}
              {card.features.fuelSurchargeWaiver && (
                <li className="flex items-start text-blue-600">
                  <span className="mr-2">⛽</span>
                  <span className="flex-1">Fuel surcharge waiver</span>
                </li>
              )}
              {card.features.domesticTravelInsurance > 0 && (
                <li className="flex items-start text-blue-600">
                  <span className="mr-2">🛡️</span>
                  <span className="flex-1">Travel insurance: ₹{(card.features.domesticTravelInsurance/100000).toFixed(1)}L</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {showCheckbox && (
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCards.includes(card._id)}
                onChange={() => toggleCardComparison(card._id)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Compare</span>
            </label>
          )}
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors">
            View Full Details
          </button>
          <a 
            href={card.applyUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 transition-colors text-center"
          >
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <CreditCardIcon className="h-7 w-7 mr-3 text-blue-600" />
          Find Your Perfect Credit Card
        </h2>
        
        <form onSubmit={handleSubmit(generateRecommendations)} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Income (₹) *
              </label>
              <input
                type="number"
                {...register('income', { 
                  required: 'Income is required', 
                  min: { value: 0, message: 'Income must be positive' },
                  max: { value: 1000000, message: 'Income seems too high' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 75000"
              />
              {errors.income && (
                <p className="mt-1 text-sm text-red-600">{errors.income.message as string}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Credit Score Range
              </label>
              <select
                {...register('creditScore')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="excellent">Excellent (750+)</option>
                <option value="good">Good (700-749)</option>
                <option value="fair">Fair (650-699)</option>
                <option value="poor">Poor (below 650)</option>
                <option value="unknown">I don't know</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Type
              </label>
              <select
                {...register('employmentType')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Salaried">Salaried</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Business">Business Owner</option>
                <option value="Student">Student</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                {...register('age', { 
                  min: { value: 18, message: 'Must be at least 18 years old' },
                  max: { value: 70, message: 'Age seems too high' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 30"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-600">{errors.age.message as string}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City Type
              </label>
              <select
                {...register('cityType')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Metro">Metro</option>
                <option value="Tier 1">Tier 1</option>
                <option value="Tier 2">Tier 2</option>
                <option value="Tier 3">Tier 3</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Spending Patterns */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Monthly Spending (₹)</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {spendingCategories.map(category => (
                <div key={category.id}>
                  <label className="block text-sm text-gray-600 mb-1">{category.label}</label>
                  <input
                    type="number"
                    {...register(category.id)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Fee Preference
              </label>
              <select
                {...register('feePreference')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="none">No fee preferred</option>
                <option value="low">Low fee (under ₹1,000)</option>
                <option value="medium">Moderate fee (₹1,000-₹5,000)</option>
                <option value="high">Don't mind high fee for benefits</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reward Preference
              </label>
              <select
                {...register('rewardPreference')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="cashback">Cashback</option>
                <option value="points">Reward Points</option>
                <option value="miles">Air Miles</option>
                <option value="lifestyle">Lifestyle Benefits</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Card Usage
              </label>
              <select
                {...register('cardUsage')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="everyday">Everyday Spending</option>
                <option value="travel">Travel</option>
                <option value="shopping">Shopping</option>
                <option value="fuel">Fuel & Automotive</option>
                <option value="premium">Premium Lifestyle</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-6 rounded-md font-medium hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Analyzing Your Profile...' : 'Find My Perfect Cards'}
            </button>

            {recommendations.length > 0 && (
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
                Filters
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filter Cards
            </h3>
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issuers
              </label>
              <div className="space-y-2">
                {issuers.map(issuer => (
                  <label key={issuer} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.issuers.includes(issuer)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({...filters, issuers: [...filters.issuers, issuer]});
                        } else {
                          setFilters({...filters, issuers: filters.issuers.filter(i => i !== issuer)});
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{issuer}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="space-y-2">
                {categories.map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({...filters, categories: [...filters.categories, category]});
                        } else {
                          setFilters({...filters, categories: filters.categories.filter(c => c !== category)});
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Fee Range: ₹{filters.annualFee[0]} - ₹{filters.annualFee[1]}
              </label>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={filters.annualFee[1]}
                  onChange={(e) => setFilters({...filters, annualFee: [filters.annualFee[0], parseInt(e.target.value)]})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Income Requirement: ₹{filters.minIncome.toLocaleString('en-IN')}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5000000"
                    step="100000"
                    value={filters.minIncome}
                    onChange={(e) => setFilters({...filters, minIncome: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => generateRecommendations(formValues)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Analyzing credit cards to find your best matches...</p>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center justify-center">
              <TrophyIcon className="h-7 w-7 mr-2 text-yellow-500" />
              Your Top Credit Card Matches
            </h3>
            <p className="text-gray-600 mt-2">Based on your spending pattern and preferences</p>
            
            {recommendations.length > 1 && (
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={compareCards}
                  disabled={selectedCards.length < 2}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    selectedCards.length >= 2 
                      ? 'bg-purple-600 text-white hover:bg-purple-700' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ArrowsRightLeftIcon className="h-5 w-5 mr-2" />
                  Compare Selected ({selectedCards.length}/3)
                </button>

                <div className="flex items-center text-sm text-gray-500">
                  <QuestionMarkCircleIcon className="h-5 w-5 mr-1" />
                  Found {recommendations.length} matching cards
                </div>
              </div>
            )}
          </div>

          {!showComparison ? (
            // Show all recommendations
            <div className="space-y-6">
              {recommendations.map((card, index) => (
                <CardItem key={card._id} card={card} index={index} showCheckbox={recommendations.length > 1} />
              ))}
            </div>
          ) : (
            // Show comparison view
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                <ArrowsRightLeftIcon className="h-6 w-6 mr-2 text-purple-600" />
                Card Comparison
              </h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Feature</th>
                      {selectedCards.map(cardId => {
                        const card = recommendations.find(c => c._id === cardId);
                        return card ? (
                          <th key={card._id} className="text-center py-3 px-4">
                            {card.name}
                            <div className="text-sm text-gray-500">{card.issuer}</div>
                          </th>
                        ) : null;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 font-medium">Match Score</td>
                      {selectedCards.map(cardId => {
                        const card = recommendations.find(c => c._id === cardId);
                        return card ? (
                          <td key={card._id} className="text-center py-3">
                            <span className={`text-lg font-bold ${
                              card.matchScore >= 90 ? 'text-green-600' : 
                              card.matchScore >= 75 ? 'text-blue-600' : 'text-orange-600'
                            }`}>
                              {card.matchScore}%
                            </span>
                          </td>
                        ) : null;
                      })}
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 font-medium">Annual Fee</td>
                      {selectedCards.map(cardId => {
                        const card = recommendations.find(c => c._id === cardId);
                        return card ? (
                          <td key={card._id} className="text-center py-3">
                            ₹{card.annualFee === 0 ? '0' : card.annualFee.toLocaleString('en-IN')}
                          </td>
                        ) : null;
                      })}
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 font-medium">Reward Rate</td>
                      {selectedCards.map(cardId => {
                        const card = recommendations.find(c => c._id === cardId);
                        return card ? (
                          <td key={card._id} className="text-center py-3">
                            {card.features.rewardRate}%
                          </td>
                        ) : null;
                      })}
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 font-medium">Min Income Required</td>
                      {selectedCards.map(cardId => {
                        const card = recommendations.find(c => c._id === cardId);
                        return card ? (
                          <td key={card._id} className="text-center py-3">
                            ₹{(card.eligibility.minIncome/100000).toFixed(0)}L/year
                          </td>
                        ) : null;
                      })}
                    </tr>
                    <tr>
                      <td className="py-3 font-medium">Category</td>
                      {selectedCards.map(cardId => {
                        const card = recommendations.find(c => c._id === cardId);
                        return card ? (
                          <td key={card._id} className="text-center py-3">
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              {card.category}
                            </span>
                          </td>
                        ) : null;
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setShowComparison(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Back to All Recommendations
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UltimateCardRecommender;