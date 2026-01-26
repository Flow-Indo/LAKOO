import React from 'react';

export default function ProductGridSkeleton() {
  const items = Array.from({ length: 8 });
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {items.map((_, i) => (
        <div key={i} className="bg-white border rounded-lg p-3 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded mb-2" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

