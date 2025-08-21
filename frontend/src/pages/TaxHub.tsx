import React, { useState } from 'react';
import TaxCalculator from '../components/tax/TaxCalculator';
import RegimeComparison from '../components/tax/RegimeComparison';
import DeductionWizard from '../components/tax/DeductionWizard';
import { CalculatorIcon, ScaleIcon, LightBulbIcon } from '@heroicons/react/24/outline';

const TaxHub = () => {
  const [activeTab, setActiveTab] = useState('calculator');

  const tabs = [
    { id: 'calculator', name: 'Tax Calculator', icon: CalculatorIcon },
    { id: 'comparison', name: 'Regime Comparison', icon: ScaleIcon },
    { id: 'wizard', name: 'Deduction Wizard', icon: LightBulbIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tax Optimization Hub</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Maximize your tax savings with our comprehensive suite of tools designed for Indian taxpayers.
            Compare tax regimes, discover deductions, and plan your investments smartly.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === 'calculator' && <TaxCalculator />}
          {activeTab === 'comparison' && <RegimeComparison />}
          {activeTab === 'wizard' && <DeductionWizard />}
        </div>

        {/* Quick Tips Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Tax Saving Quick Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Section 80C</h4>
              <p className="text-sm text-blue-800">Save up to ₹46,800 annually by investing ₹1.5L in PPF, ELSS, or EPF.</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Health Insurance</h4>
              <p className="text-sm text-green-800">Claim ₹25,000 deduction under 80D for health insurance premiums.</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">HRA Exemption</h4>
              <p className="text-sm text-purple-800">Optimize HRA exemption - can save up to ₹1L+ in metro cities.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxHub;