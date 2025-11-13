// components/PackageCard.tsx
import React from 'react';
import { Package } from '../types';

interface PackageCardProps {
  pkg: Package;
  isSelected: boolean;
  onSelect: (pkg: Package) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg, isSelected, onSelect }) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md p-6 text-center cursor-pointer
        transform transition-all duration-300 hover:scale-105
        ${isSelected ? 'border-4 border-primary-blue ring-4 ring-primary-blue/30' : 'border border-gray-200'}
      `}
      onClick={() => onSelect(pkg)}
    >
      <div dangerouslySetInnerHTML={{ __html: pkg.icon }} />
      <h3 className="text-xl font-semibold mt-4 text-secondary-dark">{pkg.name}</h3>
      <p className="text-3xl font-bold text-primary-blue my-2">${pkg.basePrice}</p>
      <p className="text-sm text-gray-600 mb-4 h-16 flex items-center justify-center">{pkg.description}</p>
      <button
        className={`
          w-full py-2 rounded-md font-medium
          ${isSelected
            ? 'bg-primary-blue text-white'
            : 'bg-gray-200 text-secondary-dark hover:bg-primary-blue hover:text-white'
          }
          transition-colors duration-200
        `}
      >
        {isSelected ? 'Selected' : 'Select Package'}
      </button>
    </div>
  );
};

export default PackageCard;
