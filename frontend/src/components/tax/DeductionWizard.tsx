import React, { useState } from 'react';
import { ChevronRightIcon, LightBulbIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const DeductionWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const questions = [
    {
      id: 'employment',
      question: "What is your employment status?",
      options: ["Salaried Employee", "Self-Employed/Freelancer", "Business Owner", "Retired"]
    },
    {
      id: 'income',
      question: "What is your annual income range?",
      options: ["Below ₹5 Lakh", "₹5-10 Lakh", "₹10-20 Lakh", "₹20-50 Lakh", "Above ₹50 Lakh"]
    },
    {
      id: 'investments',
      question: "Do you currently invest in any 80C instruments?",
      options: ["Yes, regularly", "Occasionally", "No, but interested", "No, not interested"]
    },
    {
      id: 'house',
      question: "What is your housing situation?",
      options: ["Own house with home loan", "Own house without loan", "Rent a house", "Live with family"]
    },
    {
      id: 'health',
      question: "Do you have health insurance?",
      options: ["Yes, for myself only", "Yes, for family", "No, but planning", "No health insurance"]
    },
    {
      id: 'parents',
      question: "Do you support your parents financially?",
      options: ["Yes, they are senior citizens", "Yes, but they are not senior citizens", "No"]
    },
    {
      id: 'education',
      question: "Are you paying for any education loans or children's education?",
      options: ["Yes, education loan", "Yes, children's education", "Both", "Neither"]
    }
  ];

  const handleAnswer = (questionId: string, answer: string) => {
    const newResponses = { ...responses, [questionId]: answer };
    setResponses(newResponses);
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateSuggestions(newResponses);
    }
  };

  const generateSuggestions = (allResponses: Record<string, string>) => {
    const generated: any[] = [];
    
    // Section 80C recommendations
    if (allResponses.investments !== "Yes, regularly") {
      generated.push({
        section: "80C",
        title: "Tax-Saving Investments",
        description: "Invest in ELSS mutual funds, PPF, EPF, or NSC to save up to ₹46,800 in taxes annually",
        maxDeduction: "₹1,50,000",
        potentialSavings: 46800,
        priority: "high",
        options: ["ELSS Mutual Funds", "Public Provident Fund (PPF)", "Employee Provident Fund (EPF)", "National Savings Certificate (NSC)"]
      });
    }

    // Home loan interest
    if (allResponses.house === "Own house with home loan") {
      generated.push({
        section: "24B",
        title: "Home Loan Interest Deduction",
        description: "Claim deduction for home loan interest up to ₹2 lakh for self-occupied property",
        maxDeduction: "₹2,00,000",
        potentialSavings: 62400,
        priority: "high",
        options: ["Self-occupied property interest", "Let-out property has no limit"]
      });
    }

    // Health insurance
    if (allResponses.health.includes("No")) {
      generated.push({
        section: "80D",
        title: "Health Insurance Premium",
        description: "Get health insurance and claim deduction on premiums paid",
        maxDeduction: "₹25,000 (₹50,000 for senior citizens)",
        potentialSavings: 7800,
        priority: "medium",
        options: ["Individual health insurance", "Family floater policy", "Top-up plans"]
      });
    }

    // HRA exemption
    if (allResponses.house === "Rent a house" && allResponses.employment === "Salaried Employee") {
      generated.push({
        section: "HRA",
        title: "House Rent Allowance",
        description: "Claim HRA exemption if you receive HRA from employer and pay rent",
        maxDeduction: "Varies based on salary and rent",
        potentialSavings: 31200,
        priority: "high",
        options: ["Keep rent receipts", "Landlord PAN required for rent >₹1L/month"]
      });
    }

    // Parents' health insurance
    if (allResponses.parents.includes("Yes")) {
      generated.push({
        section: "80D",
        title: "Parents' Health Insurance",
        description: "Additional deduction for health insurance premium paid for parents",
        maxDeduction: allResponses.parents.includes("senior citizens") ? "₹50,000" : "₹25,000",
        potentialSavings: allResponses.parents.includes("senior citizens") ? 15600 : 7800,
        priority: "medium",
        options: ["Separate policy for parents", "Family floater including parents"]
      });
    }

    // Education loan
    if (allResponses.education.includes("education loan")) {
      generated.push({
        section: "80E",
        title: "Education Loan Interest",
        description: "Claim deduction on interest paid on education loan for higher studies",
        maxDeduction: "No limit",
        potentialSavings: 31200,
        priority: "medium",
        options: ["Only interest component", "No time limit for deduction"]
      });
    }

    // NPS
    if (allResponses.income !== "Below ₹5 Lakh") {
      generated.push({
        section: "80CCD(1B)",
        title: "National Pension System (NPS)",
        description: "Additional ₹50,000 deduction over and above Section 80C limit",
        maxDeduction: "₹50,000",
        potentialSavings: 15600,
        priority: "medium",
        options: ["Tier-I NPS account", "Long-term retirement planning"]
      });
    }

    setSuggestions(generated.sort((a, b) => b.potentialSavings - a.potentialSavings));
  };

  const resetWizard = () => {
    setCurrentStep(0);
    setResponses({});
    setSuggestions([]);
  };

  if (suggestions.length > 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Personalized Tax-Saving Recommendations</h2>
          <button
            onClick={resetWizard}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Start Over
          </button>
        </div>

        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center">
            <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-green-900">
                Potential Annual Tax Savings: ₹{suggestions.reduce((sum, s) => sum + s.potentialSavings, 0).toLocaleString('en-IN')}
              </h3>
              <p className="text-green-700">Based on 31% tax bracket (30% + 4% cess)</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                    suggestion.priority === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {suggestion.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                  </span>
                  <span className="ml-3 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    Section {suggestion.section}
                  </span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  ₹{suggestion.potentialSavings.toLocaleString('en-IN')} savings
                </span>
              </div>

              <h4 className="text-xl font-semibold text-gray-900 mb-2">{suggestion.title}</h4>
              <p className="text-gray-600 mb-4">{suggestion.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Maximum Deduction:</span>
                  <p className="text-lg font-semibold text-blue-600">{suggestion.maxDeduction}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Available Options:</span>
                  <ul className="mt-1 space-y-1">
                    {suggestion.options.map((option: string, idx: number) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center">
                        <ChevronRightIcon className="h-3 w-3 mr-1" />
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <LightBulbIcon className="h-4 w-4 inline mr-1 text-yellow-500" />
                  <strong>Pro Tip:</strong> This deduction can reduce your taxable income and save approximately 
                  ₹{suggestion.potentialSavings.toLocaleString('en-IN')} annually in taxes.
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">📝 Next Steps</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Review each recommendation and prioritize based on your financial goals</li>
            <li>• Consult with a tax advisor for personalized advice</li>
            <li>• Keep all investment and payment receipts for tax filing</li>
            <li>• Plan your investments before March 31st to claim deductions for current financial year</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Tax Deduction Discovery Wizard</h2>
      <p className="text-gray-600 mb-6">
        Answer a few questions to discover tax-saving opportunities you might be missing.
      </p>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentStep + 1} of {questions.length}</span>
          <span>{Math.round(((currentStep + 1) / questions.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-6 text-gray-800">
          {questions[currentStep].question}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {questions[currentStep].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(questions[currentStep].id, option)}
              className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-800">{option}</span>
                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      {currentStep > 0 && (
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            ← Previous Question
          </button>
        </div>
      )}
    </div>
  );
};

export default DeductionWizard;