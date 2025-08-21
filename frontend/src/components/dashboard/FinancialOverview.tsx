import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline';

interface FinancialData {
  netWorth: number;
  assets: {
    total: number;
    equity: number;
    debt: number;
    gold: number;
    realEstate: number;
    cash: number;
  };
  liabilities: {
    total: number;
    homeLoan: number;
    creditCard: number;
    personalLoan: number;
  };
  cashFlow: {
    monthlyIncome: number;
    monthlyExpense: number;
    recentTransactions: Array<{
      id: number;
      date: string;
      description: string;
      category: string;
      type: 'income' | 'expense';
      amount: number;
    }>;
  };
}

const FinancialOverview = ({ financialData }: { financialData: FinancialData }) => {
  const { netWorth, assets, liabilities, cashFlow } = financialData;

  // Asset allocation data for pie chart
  const assetData = [
    { name: 'Real Estate', value: assets.realEstate, color: '#8B5CF6' },
    { name: 'Equity', value: assets.equity, color: '#10B981' },
    { name: 'Debt Funds', value: assets.debt, color: '#3B82F6' },
    { name: 'Cash & Savings', value: assets.cash, color: '#F59E0B' },
    { name: 'Gold', value: assets.gold, color: '#EF4444' }
  ];

  // Monthly cash flow data
  const cashFlowData = [
    { month: 'Aug', income: 120000, expense: 52000, surplus: 68000 },
    { month: 'Sep', income: 125000, expense: 48000, surplus: 77000 },
    { month: 'Oct', income: 125000, expense: 61000, surplus: 64000 },
    { month: 'Nov', income: 130000, expense: 55000, surplus: 75000 },
    { month: 'Dec', income: 140000, expense: 72000, surplus: 68000 },
    { month: 'Jan', income: 125000, expense: 55000, surplus: 70000 }
  ];

  // Net worth trend data
  const netWorthTrend = [
    { month: 'Aug', netWorth: 1180000 },
    { month: 'Sep', netWorth: 1195000 },
    { month: 'Oct', netWorth: 1210000 },
    { month: 'Nov', netWorth: 1225000 },
    { month: 'Dec', netWorth: 1235000 },
    { month: 'Jan', netWorth: 1250000 }
  ];

  const formatCurrency = (amount: number) => {
    return `₹${Math.abs(amount).toLocaleString('en-IN')}`;
  };

  const formatLakhs = (amount: number) => {
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  return (
    <div className="space-y-8">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Net Worth</p>
              <p className="text-2xl font-bold">{formatLakhs(netWorth)}</p>
            </div>
            <ArrowTrendingUpIcon className="h-8 w-8 text-green-200" />
          </div>
          <p className="text-green-100 text-sm mt-2">+5.8% from last month</p>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Assets</p>
              <p className="text-2xl font-bold">{formatLakhs(assets.total)}</p>
            </div>
            <ArrowTrendingUpIcon className="h-8 w-8 text-blue-200" />
          </div>
          <p className="text-blue-100 text-sm mt-2">+3.2% from last month</p>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Total Liabilities</p>
              <p className="text-2xl font-bold">{formatLakhs(liabilities.total)}</p>
            </div>
            <ArrowTrendingDownIcon className="h-8 w-8 text-red-200" />
          </div>
          <p className="text-red-100 text-sm mt-2">-2.1% from last month</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Monthly Surplus</p>
              <p className="text-2xl font-bold">{formatCurrency(cashFlow.monthlyIncome - cashFlow.monthlyExpense)}</p>
            </div>
            <CurrencyRupeeIcon className="h-8 w-8 text-purple-200" />
          </div>
          <p className="text-purple-100 text-sm mt-2">56% savings rate</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Asset Allocation */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Asset Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={assetData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {assetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [formatCurrency(value), 'Value']} />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            {assetData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}: {formatLakhs(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Net Worth Trend */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Net Worth Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={netWorthTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatLakhs} />
              <Tooltip formatter={(value: number) => [formatCurrency(value), 'Net Worth']} />
              <Line 
                type="monotone" 
                dataKey="netWorth" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cash Flow Analysis */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Monthly Cash Flow Analysis</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={cashFlowData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatLakhs} />
            <Tooltip formatter={(value: number) => [formatCurrency(value), '']} />
            <Legend />
            <Bar dataKey="income" fill="#10B981" name="Income" />
            <Bar dataKey="expense" fill="#EF4444" name="Expenses" />
            <Bar dataKey="surplus" fill="#3B82F6" name="Surplus" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              {cashFlow.recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(transaction.date).toLocaleDateString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      transaction.category === 'Income' ? 'bg-green-100 text-green-800' :
                      transaction.category === 'Food' ? 'bg-orange-100 text-orange-800' :
                      transaction.category === 'Shopping' ? 'bg-purple-100 text-purple-800' :
                      transaction.category === 'Investment' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {transaction.category}
                    </span>
                  </td>
                  <td className={`py-3 px-4 text-sm font-medium text-right ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : ''}
                    {formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            View All Transactions →
          </button>
        </div>
      </div>

      {/* Financial Health Score */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">💡 Financial Health Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">85</div>
            <div className="text-sm text-gray-600">Financial Health Score</div>
            <div className="text-xs text-green-600">Excellent</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">24%</div>
            <div className="text-sm text-gray-600">Debt-to-Asset Ratio</div>
            <div className="text-xs text-blue-600">Healthy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">6.8x</div>
            <div className="text-sm text-gray-600">Emergency Fund Months</div>
            <div className="text-xs text-purple-600">Well Prepared</div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-white rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Consider increasing equity allocation to 60% for better long-term growth</li>
            <li>• Your emergency fund is excellent - consider investing excess in equity funds</li>
            <li>• Home loan EMI is manageable - prepayment not urgent given low interest rates</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;