import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChartBarIcon, CreditCardIcon, CurrencyRupeeIcon, Cog6ToothIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();
  const nav = [
    { to: '/dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { to: '/tax-hub', label: 'Tax Hub', icon: CurrencyRupeeIcon },
    { to: '/credit-cards', label: 'Credit Cards', icon: CreditCardIcon },
    { to: '/profile', label: 'Profile', icon: UserCircleIcon },
    { to: '/settings', label: 'Settings', icon: Cog6ToothIcon },
  ];

  return (
    <aside className="hidden lg:block w-64 bg-white border-r min-h-screen p-4">
      <nav className="space-y-1">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                active ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;


