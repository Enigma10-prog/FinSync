import React from 'react';
import FinancialOverview from '../components/dashboard/FinancialOverview';

const Dashboard = () => {
  // Mock financial data - in real app, this would come from API
  const mockFinancialData = {
    netWorth: 1250000,
    assets: {
      total: 1650000,
      equity: 450000,
      debt: 280000,
      gold: 120000,
      realEstate: 650000,
      cash: 150000
    },
    liabilities: {
      total: 400000,
      homeLoan: 350000,
      creditCard: 25000,
      personalLoan: 25000
    },
    cashFlow: {
      monthlyIncome: 125000,
      monthlyExpense: 55000,
      recentTransactions: [
        { id: 1, date: '2025-01-15', description: 'Salary Credit', category: 'Income', type: 'income', amount: 125000 },
        { id: 2, date: '2025-01-14', description: 'Grocery Shopping', category: 'Food', type: 'expense', amount: -8500 },
        { id: 3, date: '2025-01-12', description: 'Restaurant Bill', category: 'Food', type: 'expense', amount: -3200 },
        { id: 4, date: '2025-01-10', description: 'Online Shopping', category: 'Shopping', type: 'expense', amount: -15000 },
        { id: 5, date: '2025-01-08', description: 'Mutual Fund SIP', category: 'Investment', type: 'expense', amount: -25000 }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Financial Dashboard</h1>
          <p className="text-xl text-gray-600">
            Your complete financial overview and insights at a glance
          </p>
        </div>
        
        <FinancialOverview financialData={mockFinancialData} />
      </div>
    </div>
  );
};

export default Dashboard;