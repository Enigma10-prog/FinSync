import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const taxFormSchema = z.object({
  basicSalary: z
    .number({ invalid_type_error: 'Basic salary must be a number' })
    .nonnegative('Basic salary cannot be negative'),
  hra: z
    .number({ invalid_type_error: 'HRA must be a number' })
    .nonnegative('HRA cannot be negative')
    .default(0),
  otherAllowances: z
    .number({ invalid_type_error: 'Other allowances must be a number' })
    .nonnegative('Other allowances cannot be negative')
    .default(0),
  section80C: z
    .number({ invalid_type_error: 'Section 80C must be a number' })
    .min(0)
    .max(150000, '80C deduction capped at ₹1,50,000')
    .default(0),
  section80D: z
    .number({ invalid_type_error: 'Section 80D must be a number' })
    .min(0)
    .max(25000, '80D deduction capped at ₹25,000')
    .default(0),
  homeLoanInterest: z
    .number({ invalid_type_error: 'Home loan interest must be a number' })
    .min(0)
    .max(200000, 'Home loan interest capped at ₹2,00,000')
    .default(0),
  regime: z.enum(['old', 'new']).default('old'),
});

type TaxFormData = z.infer<typeof taxFormSchema>;

const TaxCalculator = () => {
  const [taxResult, setTaxResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<TaxFormData>({
    resolver: zodResolver(taxFormSchema),
    defaultValues: {
      basicSalary: 0,
      hra: 0,
      otherAllowances: 0,
      section80C: 0,
      section80D: 0,
      homeLoanInterest: 0,
      regime: 'old',
    },
  });

  const watchedRegime = watch('regime');

  const calculateTax = async (data: TaxFormData) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const grossIncome = data.basicSalary + data.hra + data.otherAllowances;
      let taxableIncome = grossIncome;
      let deductions = 0;

      if (data.regime === 'old') {
        deductions = Math.min(data.section80C, 150000) + 
                   Math.min(data.section80D, 25000) + 
                   Math.min(data.homeLoanInterest, 200000);
        taxableIncome = Math.max(grossIncome - deductions - 50000, 0); // Standard deduction
      } else {
        taxableIncome = Math.max(grossIncome - 50000, 0); // Only standard deduction in new regime
      }

      let tax = 0;
      if (data.regime === 'old') {
        // Old regime tax slabs
        if (taxableIncome > 250000) tax += Math.min(taxableIncome - 250000, 250000) * 0.05;
        if (taxableIncome > 500000) tax += Math.min(taxableIncome - 500000, 500000) * 0.20;
        if (taxableIncome > 1000000) tax += (taxableIncome - 1000000) * 0.30;
      } else {
        // New regime tax slabs
        if (taxableIncome > 250000) tax += Math.min(taxableIncome - 250000, 250000) * 0.05;
        if (taxableIncome > 500000) tax += Math.min(taxableIncome - 500000, 250000) * 0.10;
        if (taxableIncome > 750000) tax += Math.min(taxableIncome - 750000, 250000) * 0.15;
        if (taxableIncome > 1000000) tax += Math.min(taxableIncome - 1000000, 250000) * 0.20;
        if (taxableIncome > 1250000) tax += Math.min(taxableIncome - 1250000, 250000) * 0.25;
        if (taxableIncome > 1500000) tax += (taxableIncome - 1500000) * 0.30;
      }

      const cess = tax * 0.04; // 4% cess
      const totalTax = tax + cess;

      setTaxResult({
        grossIncome,
        taxableIncome,
        deductions,
        tax,
        cess,
        totalTax,
        regime: data.regime,
        netIncome: grossIncome - totalTax
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Income Tax Calculator</h2>
      
      <form onSubmit={handleSubmit(calculateTax)} className="space-y-6">
        {/* Tax Regime Selection */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Select Tax Regime</h3>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="old"
                {...register('regime')}
                className="mr-2 text-blue-600"
              />
              <span>Old Regime (with deductions)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="new"
                {...register('regime')}
                className="mr-2 text-blue-600"
              />
              <span>New Regime (lower rates, no deductions)</span>
            </label>
          </div>
        </div>

        {/* Income Details */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Income Details (Annual)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Basic Salary (₹)
              </label>
              <input
                type="number"
                step="any"
                {...register('basicSalary', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 600000"
              />
              {errors.basicSalary && (
                <p className="mt-1 text-sm text-red-600">{errors.basicSalary.message as string}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HRA Received (₹)
              </label>
              <input
                type="number"
                step="any"
                {...register('hra', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 240000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Other Allowances (₹)
              </label>
              <input
                type="number"
                step="any"
                {...register('otherAllowances', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 60000"
              />
            </div>
          </div>
        </div>

        {/* Deductions (only for old regime) */}
        {watchedRegime === 'old' && (
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Deductions & Investments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section 80C Investments (₹)
                  <span className="text-xs text-gray-500 ml-1">(Max: ₹1,50,000)</span>
                </label>
                <input
                  type="number"
                  step="any"
                  {...register('section80C', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 150000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Health Insurance 80D (₹)
                  <span className="text-xs text-gray-500 ml-1">(Max: ₹25,000)</span>
                </label>
                <input
                  type="number"
                  step="any"
                  {...register('section80D', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 25000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Home Loan Interest (₹)
                  <span className="text-xs text-gray-500 ml-1">(Max: ₹2,00,000)</span>
                </label>
                <input
                  type="number"
                  step="any"
                  {...register('homeLoanInterest', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 200000"
                />
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Calculating...' : 'Calculate Tax'}
        </button>
      </form>

      {/* Tax Results */}
      {taxResult && (
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            Tax Calculation Results ({taxResult.regime === 'old' ? 'Old Regime' : 'New Regime'})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Gross Annual Income:</span>
                <span className="font-medium">₹{taxResult.grossIncome.toLocaleString('en-IN')}</span>
              </div>
              
              {taxResult.regime === 'old' && taxResult.deductions > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Deductions:</span>
                  <span className="font-medium text-green-600">₹{taxResult.deductions.toLocaleString('en-IN')}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Taxable Income:</span>
                <span className="font-medium">₹{taxResult.taxableIncome.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Income Tax:</span>
                <span className="font-medium">₹{taxResult.tax.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Health & Education Cess (4%):</span>
                <span className="font-medium">₹{taxResult.cess.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                <span className="text-gray-900">Total Tax:</span>
                <span className="text-red-600">₹{taxResult.totalTax.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-gray-900">Net Take-home:</span>
                <span className="text-green-600">₹{taxResult.netIncome.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxCalculator;