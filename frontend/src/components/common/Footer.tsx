import React from 'react';
import { CurrencyRupeeIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <CurrencyRupeeIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">WealthWise</span>
            </div>
            <p className="text-gray-300 max-w-md">
              Your trusted financial advisory platform for tax optimization, investment planning, 
              and smart credit card recommendations tailored for the Indian market.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/tax-calculator" className="text-gray-300 hover:text-white transition-colors">Tax Calculator</a></li>
              <li><a href="/investment-planner" className="text-gray-300 hover:text-white transition-colors">Investment Planner</a></li>
              <li><a href="/retirement-planning" className="text-gray-300 hover:text-white transition-colors">Retirement Planning</a></li>
              <li><a href="/insurance" className="text-gray-300 hover:text-white transition-colors">Insurance</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: support@wealthwise.in</li>
              <li>Phone: +91 98765 43210</li>
              <li>Mon-Fri: 9AM-6PM IST</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 WealthWise. All rights reserved. | Made with ❤️ for Indian investors.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;