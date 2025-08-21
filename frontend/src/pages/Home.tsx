import React from 'react';
import { Link } from 'react-router-dom';
import { ChartBarIcon, CurrencyRupeeIcon, CreditCardIcon, ShieldCheckIcon, ArrowTrendingUpIcon, CalculatorIcon } from '@heroicons/react/24/outline';

const Home = () => {
  const features = [
    {
      icon: CalculatorIcon,
      title: 'Smart Tax Calculator',
      description: 'Compare old vs new tax regimes and get personalized recommendations to maximize your savings.',
      color: 'bg-blue-500'
    },
    {
      icon: CreditCardIcon,
      title: 'Credit Card Recommender',
      description: 'Find the perfect credit card based on your spending patterns and financial goals.',
      color: 'bg-green-500'
    },
    {
      icon: ChartBarIcon,
      title: 'Financial Dashboard',
      description: 'Track your net worth, investments, and expenses with interactive charts and insights.',
      color: 'bg-purple-500'
    },
    {
      icon: ArrowTrendingUpIcon,
      title: 'Investment Planning',
      description: 'Build diversified portfolios with expert guidance tailored to Indian markets.',
      color: 'bg-orange-500'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Tax Optimization',
      description: 'Discover hidden deductions and legal tax-saving opportunities.',
      color: 'bg-red-500'
    },
    {
      icon: CurrencyRupeeIcon,
      title: 'Expense Tracking',
      description: 'Monitor spending patterns and identify areas for better financial management.',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Master Your <span className="text-yellow-400">Financial</span> Future
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              India's most comprehensive financial advisory platform. Optimize taxes, choose smart investments, 
              and make informed financial decisions with AI-powered insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-lg text-blue-900 bg-white hover:bg-blue-50 transition-all duration-200 transform hover:scale-105"
              >
                Get Started Free
              </Link>
              <Link
                to="/tax-hub"
                className="inline-flex items-center px-8 py-3 border-2 border-white text-lg font-medium rounded-lg text-white hover:bg-white hover:text-blue-900 transition-all duration-200"
              >
                Calculate Tax Savings
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Financial Success
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From tax planning to investment strategies, we provide comprehensive tools 
              designed specifically for Indian investors and taxpayers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-6`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">₹50L+</div>
              <div className="text-gray-600">Tax Savings Generated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">25K+</div>
              <div className="text-gray-600">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">100+</div>
              <div className="text-gray-600">Credit Cards Listed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">4.8★</div>
              <div className="text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Optimize Your Finances?
          </h2>
          <p className="text-xl text-white mb-8 opacity-90">
            Join thousands of Indians who have already started their journey to financial freedom.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Start Your Financial Journey
            <ChartBarIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;