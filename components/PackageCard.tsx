// components/PackageCard.tsx
import React from 'react';
import { Package } from '../types';

interface PackageCardProps {
  pkg: Package;
  isSelected: boolean;
  onSelect: (pkg: Package) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg, isSelected, onSelect }) => {
  const isRemoval = pkg.name.toLowerCase().includes('removal');
  const selectedColorClass = isRemoval ? 'border-accent-red ring-accent-red/30' : 'border-primary-blue ring-primary-blue/30';
  const priceColorClass = isRemoval ? 'text-accent-red' : 'text-primary-blue';
  const buttonSelectedClass = isRemoval ? 'bg-accent-red' : 'bg-primary-blue';
  const buttonHoverClass = isRemoval ? 'hover:bg-accent-red' : 'hover:bg-primary-blue';

  return (
    <div
      className={`
        bg-white rounded-lg shadow-md p-6 text-center cursor-pointer
        transform transition-all duration-300 hover:scale-105
        ${isSelected ? `border-4 ${selectedColorClass}` : 'border border-gray-200'}
      `}
      onClick={() => onSelect(pkg)}
    >
      <div dangerouslySetInnerHTML={{ __html: pkg.icon }} />
      <h3 className="text-xl font-semibold mt-4 text-secondary-dark">{pkg.name}</h3>
      <p className={`text-3xl font-bold my-2 ${priceColorClass}`}>${pkg.basePrice}</p>
      <p className="text-sm text-gray-600 mb-4 h-16 flex items-center justify-center">{pkg.description}</p>
      <button
        className={`
          w-full py-2 rounded-md font-medium
          ${isSelected
            ? `${buttonSelectedClass} text-white`
            : `bg-gray-200 text-secondary-dark hover:text-white ${buttonHoverClass}`
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