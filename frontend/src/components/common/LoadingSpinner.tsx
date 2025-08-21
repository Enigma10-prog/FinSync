import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center space-x-3 text-gray-600">
      <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
      <span>Loading...</span>
    </div>
  );
};

export default LoadingSpinner;


