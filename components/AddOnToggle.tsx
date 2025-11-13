// components/AddOnToggle.tsx
import React, { useState, useEffect } from 'react';
import { AddOn, SelectedAddOn } from '../types';
import { useBooking } from '../context/BookingContext';
import { OLD_FURNITURE_REMOVAL_OPTIONS } from '../constants';
import Modal from './Modal';

interface AddOnToggleProps {
  addOn: AddOn;
}

const AddOnToggle: React.FC<AddOnToggleProps> = ({ addOn }) => {
  const { bookingDetails, toggleAddOn, getAddOnPrice } = useBooking();
  const [isEnabled, setIsEnabled] = useState(false);
  const [inputValue, setInputValue] = useState<string | number>(addOn.type === 'dropdown' ? (addOn.options?.[0]?.value || '') : 1);
  const [isUpsellModalOpen, setIsUpsellModalOpen] = useState(false);
  const [selectedUpsellPrice, setSelectedUpsellPrice] = useState(0);

  useEffect(() => {
    const isCurrentlySelected = bookingDetails.selectedAddOns.some(sa => sa.id === addOn.id);
    setIsEnabled(isCurrentlySelected);

    if (isCurrentlySelected) {
      const selectedAddOn = bookingDetails.selectedAddOns.find(sa => sa.id === addOn.id);
      if (addOn.type === 'dropdown' && selectedAddOn?.option) {
        setInputValue(selectedAddOn.option);
      } else if (addOn.type === 'input' && selectedAddOn?.quantity) {
        setInputValue(selectedAddOn.quantity);
      } else if (addOn.id === 'old-furniture-removal' && selectedAddOn?.price) {
        setSelectedUpsellPrice(selectedAddOn.price);
      }
    } else {
      // Reset input value when disabled
      setInputValue(addOn.type === 'dropdown' ? (addOn.options?.[0]?.value || '') : 1);
      setSelectedUpsellPrice(0);
    }
  }, [bookingDetails.selectedAddOns, addOn.id, addOn.type, addOn.options]);


  const currentPackageName = bookingDetails.selectedPackage?.name || null;
  const priceDisplay = isEnabled ? `+$${getAddOnPrice(addOn.id, currentPackageName, typeof inputValue === 'number' ? inputValue : undefined).toFixed(2)}` : '';

  const handleToggle = (checked: boolean) => {
    if (addOn.id === 'old-furniture-removal' && checked) {
      setIsUpsellModalOpen(true);
    } else if (addOn.id === 'old-furniture-removal' && !checked) {
      toggleAddOn(addOn.id, false);
      setSelectedUpsellPrice(0);
    } else {
      setIsEnabled(checked);
      if (addOn.type === 'dropdown') {
         toggleAddOn(addOn.id, checked, inputValue as string);
      } else if (addOn.type === 'input') {
         toggleAddOn(addOn.id, checked, inputValue as number);
      } else {
         toggleAddOn(addOn.id, checked);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value, 10) : e.target.value;
    setInputValue(value);
    toggleAddOn(addOn.id, true, value);
  };

  const handleUpsellConfirm = (price: number) => {
    setSelectedUpsellPrice(price);
    toggleAddOn(addOn.id, true, price);
    setIsEnabled(true);
    setIsUpsellModalOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
      <div className="flex-1 mb-2 sm:mb-0">
        <div className="font-semibold text-lg text-secondary-dark">{addOn.name}</div>
        <p className="text-gray-600 text-sm">{addOn.description}</p>
        {(addOn.id === 'old-furniture-removal' && isEnabled && selectedUpsellPrice > 0) && (
           <p className="text-accent-green text-sm mt-1">Selected Price: +${selectedUpsellPrice.toFixed(2)}</p>
        )}
        {isEnabled && priceDisplay && addOn.id !== 'old-furniture-removal' && <span className="text-accent-green text-sm">{priceDisplay}</span>}
      </div>
      <div className="flex items-center space-x-4">
        {addOn.type === 'dropdown' && isEnabled && addOn.options && (
          <select
            value={inputValue as string}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-md focus:ring-primary-blue focus:border-primary-blue"
          >
            {addOn.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
        {addOn.type === 'input' && isEnabled && (
          <input
            type="number"
            min="1"
            max={addOn.maxQuantity || 1}
            value={inputValue as number}
            onChange={handleInputChange}
            className="w-20 p-2 border border-gray-300 rounded-md text-center focus:ring-primary-blue focus:border-primary-blue"
          />
        )}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            value=""
            className="sr-only peer"
            checked={isEnabled}
            onChange={(e) => handleToggle(e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-blue/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-blue"></div>
        </label>
      </div>

      <Modal isOpen={isUpsellModalOpen} onClose={() => setIsUpsellModalOpen(false)} title="Old Furniture Removal">
        <p className="text-gray-700 mb-4">Select the size of the item you need removed for custom pricing.</p>
        {OLD_FURNITURE_REMOVAL_OPTIONS.map((option) => (
          <button
            key={option.label}
            onClick={() => handleUpsellConfirm(option.price)}
            className="block w-full text-left py-3 px-4 mb-2 bg-light-gray hover:bg-gray-200 rounded-md transition-colors duration-200"
          >
            {option.label} <span className="float-right font-semibold text-primary-blue">+${option.price.toFixed(2)}</span>
          </button>
        ))}
        <button onClick={() => setIsUpsellModalOpen(false)} className="mt-4 w-full bg-gray-300 text-secondary-dark py-2 rounded-md hover:bg-gray-400">
          Cancel
        </button>
      </Modal>
    </div>
  );
};

export default AddOnToggle;
