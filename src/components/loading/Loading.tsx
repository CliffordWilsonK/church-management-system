import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </div>
  );
}

export function LoadingTable() {
  return (
    <div className="w-full animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex space-x-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
}

export function LoadingValue() {
  return (
    <div className="inline-flex items-center">
      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
} 