// context/BookingContext.tsx
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Package, AddOn, SelectedAddOn, BookingDetails, PaymentStatus, JobStatus, PickupLocationType, OrderPaymentStatus, BookingItem, ServiceType } from '../types';
// Fix: Import PACKAGES and ADD_ONS from constants.ts
import { PACKAGES, ADD_ONS, OLD_FURNITURE_REMOVAL_OPTIONS } from '../constants';

interface BookingContextType {
  bookingDetails: BookingDetails;
  updateBookingDetails: (details: Partial<BookingDetails>) => void;
  selectPackage: (pkg: Package) => void;
  toggleAddOn: (addOnId: string, isChecked: boolean, value?: string | number) => void;
  getAddOnPrice: (addOnId: string, currentPackageName: string | null, quantity?: number) => number;
  calculateTotalPrice: () => number;
  resetBooking: () => void;
  addBookingItem: (item: BookingItem) => void;
  updateBookingItem: (id: string, updatedItem: Partial<BookingItem>) => void;
  removeBookingItem: (id: string) => void;
}

const defaultBookingDetails: BookingDetails = {
  serviceType: ServiceType.DELIVERY,
  selectedPackage: null,
  selectedAddOns: [],
  pickupAddress: '',
  deliveryAddress: '',
  dateRequested: '',
  timeWindow: '',
  totalPrice: 0,
  paymentStatus: PaymentStatus.PENDING,
  jobStatus: JobStatus.SCHEDULED,
  // New fields for 'Item & Pickup Details'
  pickupLocationType: null,
  storeName: '',
  orderPaymentStatus: null,
  orderConfirmationName: '',
  orderReceiptNumber: '',
  recipientName: '',
  bookingItems: [],
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>(defaultBookingDetails);

  const getAddOnPrice = useCallback((addOnId: string, currentPackageName: string | null, quantity?: number): number => {
    const addOn = ADD_ONS.find((a) => a.id === addOnId);
    if (!addOn) return 0;

    let price = 0;

    switch (addOn.id) {
      case "rush-delivery":
        const selectedOption = addOn.options?.find(opt => opt.value === (bookingDetails.selectedAddOns.find(sa => sa.id === addOnId)?.option || 'standard'));
        price = selectedOption?.price || 0;
        break;
      case "stair-fees":
        price = addOn.basePrice as number * (quantity || 0);
        break;
      case "packaging-removal":
        if (Array.isArray(addOn.basePrice) && currentPackageName) {
          // Dynamic pricing based on package size
          const packageIndex = PACKAGES.findIndex(p => p.name === currentPackageName);
          if (packageIndex === 0) price = addOn.basePrice[0]; // Small
          else if (packageIndex === 1) price = addOn.basePrice[0]; // Medium (using lower end of range)
          else if (packageIndex >= 2) price = addOn.basePrice[1]; // Large, Premium (using higher end)
          else price = addOn.basePrice[0]; // Default to lower if package not found
        } else {
          price = addOn.basePrice as number || 0;
        }
        break;
      case "extra-stops":
        price = addOn.basePrice as number * (quantity || 0);
        break;
      case "after-hours-delivery":
        price = addOn.basePrice as number || 0;
        break;
      case "old-furniture-removal":
        // This is an upsell, price will be set explicitly when adding
        price = bookingDetails.selectedAddOns.find(sa => sa.id === addOnId)?.price || 0;
        break;
      default:
        price = addOn.basePrice as number || 0;
    }
    return price;
  }, [bookingDetails.selectedAddOns]);


  const calculateTotalPrice = useCallback(() => {
    let total = bookingDetails.selectedPackage?.basePrice || 0;
    bookingDetails.selectedAddOns.forEach((addOn) => {
      total += addOn.price;
    });
    return total;
  }, [bookingDetails.selectedPackage, bookingDetails.selectedAddOns]);

  const updateBookingDetails = useCallback((details: Partial<BookingDetails>) => {
    setBookingDetails((prev) => {
      const newState = { ...prev, ...details };

      // If serviceType is changing, reset the package and incompatible add-ons
      if (details.serviceType && details.serviceType !== prev.serviceType) {
        newState.selectedPackage = null;
        newState.selectedAddOns = [];
      }

      return newState;
    });
  }, []);

  const selectPackage = useCallback((pkg: Package) => {
    setBookingDetails((prev) => ({
      ...prev,
      selectedPackage: pkg,
      // Recalculate prices for add-ons that depend on package size (e.g., packaging removal)
      selectedAddOns: prev.selectedAddOns.map(sa => {
        if (sa.id === 'packaging-removal') {
          return { ...sa, price: getAddOnPrice(sa.id, pkg.name) };
        }
        return sa;
      })
    }));
  }, [getAddOnPrice]);

  const toggleAddOn = useCallback((addOnId: string, isChecked: boolean, value?: string | number) => {
    setBookingDetails((prev) => {
      const currentPackageName = prev.selectedPackage?.name || null;
      let newSelectedAddOns = [...prev.selectedAddOns];
      const existingAddOnIndex = newSelectedAddOns.findIndex((ao) => ao.id === addOnId);
      const addOnDef = ADD_ONS.find((a) => a.id === addOnId);

      if (!addOnDef) return prev;

      if (isChecked) {
        // Add the add-on
        if (existingAddOnIndex === -1) {
          let price = 0;
          let quantity = 0;
          let option: string | undefined;

          if (addOnId === 'rush-delivery' && typeof value === 'string') {
            option = value;
            const selectedOption = addOnDef.options?.find(opt => opt.value === option);
            price = selectedOption?.price || 0;
          } else if ((addOnId === 'stair-fees' || addOnId === 'extra-stops') && typeof value === 'number') {
            quantity = value;
            price = getAddOnPrice(addOnId, currentPackageName, quantity);
          } else if (addOnId === 'packaging-removal' || addOnId === 'after-hours-delivery') {
            price = getAddOnPrice(addOnId, currentPackageName);
          } else if (addOnId === 'old-furniture-removal' && typeof value === 'number') {
            // Price for upsell is explicitly passed
            price = value;
          }

          newSelectedAddOns.push({
            id: addOnId,
            name: addOnDef.name,
            price,
            quantity: quantity > 0 ? quantity : undefined,
            option: option,
          });
        } else {
          // Update existing add-on (e.g., quantity or dropdown option change)
          const updatedAddOn = { ...newSelectedAddOns[existingAddOnIndex] };
          if (addOnId === 'rush-delivery' && typeof value === 'string') {
            updatedAddOn.option = value;
            const selectedOption = addOnDef.options?.find(opt => opt.value === updatedAddOn.option);
            updatedAddOn.price = selectedOption?.price || 0;
          } else if ((addOnId === 'stair-fees' || addOnId === 'extra-stops') && typeof value === 'number') {
            updatedAddOn.quantity = value;
            updatedAddOn.price = getAddOnPrice(addOnId, currentPackageName, updatedAddOn.quantity);
          } else if (addOnId === 'old-furniture-removal' && typeof value === 'number') {
             updatedAddOn.price = value;
          }
          newSelectedAddOns[existingAddOnIndex] = updatedAddOn;
        }
      } else {
        // Remove the add-on
        newSelectedAddOns = newSelectedAddOns.filter((ao) => ao.id !== addOnId);
      }

      return { ...prev, selectedAddOns: newSelectedAddOns };
    });
  }, [getAddOnPrice]);

  const addBookingItem = useCallback((item: BookingItem) => {
    setBookingDetails((prev) => ({
      ...prev,
      bookingItems: [...prev.bookingItems, item],
    }));
  }, []);

  const updateBookingItem = useCallback((id: string, updatedItem: Partial<BookingItem>) => {
    setBookingDetails((prev) => ({
      ...prev,
      bookingItems: prev.bookingItems.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      ),
    }));
  }, []);

  const removeBookingItem = useCallback((id: string) => {
    setBookingDetails((prev) => ({
      ...prev,
      bookingItems: prev.bookingItems.filter((item) => item.id !== id),
    }));
  }, []);

  const resetBooking = useCallback(() => {
    setBookingDetails(defaultBookingDetails);
  }, []);

  const value = {
    bookingDetails,
    updateBookingDetails,
    selectPackage,
    toggleAddOn,
    getAddOnPrice,
    calculateTotalPrice,
    resetBooking,
    addBookingItem,
    updateBookingItem,
    removeBookingItem,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};