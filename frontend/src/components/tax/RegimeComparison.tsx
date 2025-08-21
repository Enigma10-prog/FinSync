import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const RegimeComparison = () => {
  const [comparison, setComparison] = useState<any>(null);
  const { register, handleSubmit } = useForm();

  const compareRegimes = (data: any) => {
    const grossIncome = parseFloat(data.income) || 0;
    const deductions80C = Math.min(parseFloat(data.section80C) || 0, 150000);
    const deductions80D = Math.min(parseFloat(data.section80D) || 0, 25000);
    const homeLoanInterest = Math.min(parseFloat(data.homeLoanInterest) || 0, 200000);

    // Old Regime Calculation
    const oldDeductions = deductions80C + deductions80D + homeLoanInterest + 50000; // Standard deduction
    const oldTaxableIncome = Math.max(grossIncome - oldDeductions, 0);
    let oldTax = 0;
    
    if (oldTaxableIncome > 250000) oldTax += Math.min(oldTaxableIncome - 250000, 250000) * 0.05;
    if (oldTaxableIncome > 500000) oldTax += Math.min(oldTaxableIncome - 500000, 500000) * 0.20;
    if (oldTaxableIncome > 1000000) oldTax += (oldTaxableIncome - 1000000) * 0.30;
    
    const oldCess = oldTax * 0.04;
    const oldTotalTax = oldTax + oldCess;

    // New Regime Calculation
    const newTaxableIncome = Math.max(grossIncome - 50000, 0); // Only standard deduction
    let newTax = 0;
    
    if (newTaxableIncome > 250000) newTax += Math.min(newTaxableIncome - 250000, 250000) * 0.05;
    if (newTaxableIncome > 500000) newTax += Math.min(newTaxableIncome - 500000, 250000) * 0.10;
    if (newTaxableIncome > 750000) newTax += Math.min(newTaxableIncome - 750000, 250000) * 0.15;
    if (newTaxableIncome > 1000000) newTax += Math.min(newTaxableIncome - 1000000, 250000) * 0.20;
    if (newTaxableIncome > 1250000) newTax += Math.min(newTaxableIncome - 1250000, 250000) * 0.25;
    if (newTaxableIncome > 1500000) newTax += (newTaxableIncome - 1500000) * 0.30;
    
    const newCess = newTax * 0.04;
    const newTotalTax = newTax + newCess;

    setComparison({
      grossIncome,
      oldRegime: {
        taxableIncome: oldTaxableIncome,
        deductions: oldDeductions,
        tax: oldTax,
        cess: oldCess,
        totalTax: oldTotalTax,
        netIncome: grossIncome - oldTotalTax
      },
      newRegime: {
        taxableIncome: newTaxableIncome,
        deductions: 50000,
        tax: newTax,
        cess: newCess,
        totalTax: newTotalTax,
        netIncome: grossIncome - newTotalTax
      },
      savings: oldTotalTax - newTotalTax,
      recommendation: oldTotalTax < newTotalTax ? 'old' : 'new'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tax Regime Comparison</h2>
      <p className="text-gray-600 mb-6">
        Compare the old vs new tax regime to find out which one saves you more money based on your income and investments.
      </p>

      <form onSubmit={handleSubmit(compareRegimes)} className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Annual Gross Income (₹) *
            </label>
            <input
              type="number"
              {...register('income', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 1200000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section 80C Investments (₹)
            </label>
            <input
              type="number"
              {...register('section80C')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 150000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Health Insurance Premium (₹)
            </label>
            <input
              type="number"
              {...register('section80D')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 25000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Home Loan Interest (₹)
            </label>
            <input
              type="number"
              {...register('homeLoanInterest')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 200000"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Compare Tax Regimes
        </button>
      </form>

      {comparison && (
        <div className="space-y-6">
          {/* Recommendation Card */}
          <div className={`p-6 rounded-lg border-2 ${
            comparison.recommendation === 'old' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <h3 className="text-xl font-semibold mb-2">
              💡 Recommendation: {comparison.recommendation === 'old' ? 'Old Regime' : 'New Regime'}
            </h3>
            <p className="text-gray-700">
              {comparison.recommendation === 'old' 
                ? `The old regime will save you ₹${Math.abs(comparison.savings).toLocaleString('en-IN')} more than the new regime.`
                : `The new regime will save you ₹${Math.abs(comparison.savings).toLocaleString('en-IN')} more than the old regime.`
              }
            </p>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Particulars</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Old Regime</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">New Regime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="bg-white">
                  <td className="px-6 py-4 text-sm text-gray-900">Gross Income</td>
                  <td className="px-6 py-4 text-sm text-center">₹{comparison.grossIncome.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-sm text-center">₹{comparison.grossIncome.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Total Deductions</td>
                  <td className="px-6 py-4 text-sm text-center text-green-600">₹{comparison.oldRegime.deductions.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-sm text-center">₹{comparison.newRegime.deductions.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 text-sm text-gray-900">Taxable Income</td>
                  <td className="px-6 py-4 text-sm text-center">₹{comparison.oldRegime.taxableIncome.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-sm text-center">₹{comparison.newRegime.taxableIncome.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Income Tax</td>
                  <td className="px-6 py-4 text-sm text-center">₹{comparison.oldRegime.tax.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-sm text-center">₹{comparison.newRegime.tax.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 text-sm text-gray-900">Health & Education Cess (4%)</td>
                  <td className="px-6 py-4 text-sm text-center">₹{comparison.oldRegime.cess.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-sm text-center">₹{comparison.newRegime.cess.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-yellow-50 font-semibold">
                  <td className="px-6 py-4 text-sm text-gray-900">Total Tax Payable</td>
                  <td className="px-6 py-4 text-sm text-center text-red-600">₹{comparison.oldRegime.totalTax.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-sm text-center text-red-600">₹{comparison.newRegime.totalTax.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-green-50 font-semibold">
                  <td className="px-6 py-4 text-sm text-gray-900">Net Take-home Income</td>
                  <td className="px-6 py-4 text-sm text-center text-green-600">₹{comparison.oldRegime.netIncome.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-sm text-center text-green-600">₹{comparison.newRegime.netIncome.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Key Insights */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-3">📊 Key Insights</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Old regime allows deductions but has higher tax rates for middle slabs</li>
              <li>• New regime has lower tax rates but doesn't allow most deductions</li>
              <li>• If your total eligible deductions are high (₹2L+), old regime is usually better</li>
              <li>• New regime works better for those with minimal deductions and higher income</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegimeComparison;