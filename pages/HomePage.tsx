// pages/HomePage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import PackageCard from '../components/PackageCard';
import AddOnToggle from '../components/AddOnToggle';
import { PACKAGES, ADD_ONS } from '../constants';
import { Page, Package, PickupLocationType, OrderPaymentStatus, BookingItem } from '../types';
import { useBooking } from '../context/BookingContext';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for booking items

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { bookingDetails, selectPackage, calculateTotalPrice, updateBookingDetails, addBookingItem, updateBookingItem, removeBookingItem } = useBooking();

  // Local state for temporary item input before adding to context
  const [newItem, setNewItem] = useState<Omit<BookingItem, 'id'>>({ name: '', color: '', size: '', description: '' });

  const handlePackageSelect = (pkg: Package) => {
    selectPackage(pkg);
    // Scroll to new 'Item & Pickup Details' section after package selection
    setTimeout(() => {
      document.getElementById('item-pickup-details-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAddItem = () => {
    if (newItem.name.trim()) {
      addBookingItem({ ...newItem, id: uuidv4() });
      setNewItem({ name: '', color: '', size: '', description: '' }); // Clear input fields
    } else {
      alert('Item Name/Product is required.');
    }
  };

  const handleUpdateItem = (id: string, field: keyof Omit<BookingItem, 'id'>, value: string) => {
    updateBookingItem(id, { [field]: value });
  };

  // Validation for Step 2 fields
  const isStep2Complete = useMemo(() => {
    const { pickupLocationType, storeName, orderPaymentStatus, orderConfirmationName, orderReceiptNumber, recipientName, bookingItems } = bookingDetails;

    // Validate pickup details
    if (!pickupLocationType || !orderPaymentStatus || !orderConfirmationName.trim() || !orderReceiptNumber.trim() || !recipientName.trim()) {
      return false;
    }
    if (pickupLocationType === PickupLocationType.STORE_RETAILER && !storeName.trim()) {
      return false;
    }

    // Validate booking items
    if (bookingItems.length === 0) {
      return false;
    }
    for (const item of bookingItems) {
      if (!item.name.trim()) {
        return false;
      }
    }

    return true;
  }, [bookingDetails]);


  const totalPrice = useMemo(() => calculateTotalPrice(), [calculateTotalPrice, bookingDetails.selectedPackage, bookingDetails.selectedAddOns]);

  useEffect(() => {
    updateBookingDetails({ totalPrice });
  }, [totalPrice, updateBookingDetails]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-secondary-dark mb-4">
          QuickDrop SD: Fast Furniture Delivery & Assembly in San Diego.
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Select your package below to get started. Full upfront pricing—no hidden fees!
        </p>
      </section>

      {/* Step 1: Choose Your Package */}
      <section className="mb-12">
        <h3 className="text-2xl font-bold text-secondary-dark mb-6 text-center">Step 1: Choose Your Package</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PACKAGES.map((pkg) => (
            <PackageCard
              key={pkg.name}
              pkg={pkg}
              isSelected={bookingDetails.selectedPackage?.name === pkg.name}
              onSelect={handlePackageSelect}
            />
          ))}
        </div>
      </section>

      {/* Step 2: Item & Pickup Details - Only visible after package selection */}
      {bookingDetails.selectedPackage && (
        <section id="item-pickup-details-section" className="mb-12 animate-fade-in-up bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-2xl font-bold text-secondary-dark mb-6 text-center">Step 2: Item & Pickup Details</h3>

          {/* Pickup Details Sub-section */}
          <div className="mb-8 p-4 bg-light-gray rounded-md">
            <h4 className="text-xl font-semibold text-secondary-dark mb-4">Pickup Information</h4>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location Type <span className="text-accent-red">*</span></label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="pickupLocationType"
                    value={PickupLocationType.STORE_RETAILER}
                    checked={bookingDetails.pickupLocationType === PickupLocationType.STORE_RETAILER}
                    onChange={(e) => updateBookingDetails({ pickupLocationType: e.target.value as PickupLocationType })}
                    className="form-radio text-primary-blue h-5 w-5"
                  />
                  <span className="ml-2 text-gray-700">Store/Retailer</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="pickupLocationType"
                    value={PickupLocationType.PRIVATE_RESIDENCE}
                    checked={bookingDetails.pickupLocationType === PickupLocationType.PRIVATE_RESIDENCE}
                    onChange={(e) => updateBookingDetails({ pickupLocationType: e.target.value as PickupLocationType })}
                    className="form-radio text-primary-blue h-5 w-5"
                  />
                  <span className="ml-2 text-gray-700">Private Residence/Other</span>
                </label>
              </div>
            </div>

            {bookingDetails.pickupLocationType === PickupLocationType.STORE_RETAILER && (
              <div className="mb-4">
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">Store Name <span className="text-accent-red">*</span></label>
                <input
                  type="text"
                  id="storeName"
                  value={bookingDetails.storeName}
                  onChange={(e) => updateBookingDetails({ storeName: e.target.value })}
                  placeholder="e.g., IKEA, Living Spaces"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-blue focus:border-primary-blue"
                  required
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Status <span className="text-accent-red">*</span></label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="orderPaymentStatus"
                    value={OrderPaymentStatus.NEEDS_PAYMENT}
                    checked={bookingDetails.orderPaymentStatus === OrderPaymentStatus.NEEDS_PAYMENT}
                    onChange={(e) => updateBookingDetails({ orderPaymentStatus: e.target.value as OrderPaymentStatus })}
                    className="form-radio text-primary-blue h-5 w-5"
                  />
                  <span className="ml-2 text-gray-700">Needs to be Paid For</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="orderPaymentStatus"
                    value={OrderPaymentStatus.PRE_PAID}
                    checked={bookingDetails.orderPaymentStatus === OrderPaymentStatus.PRE_PAID}
                    onChange={(e) => updateBookingDetails({ orderPaymentStatus: e.target.value as OrderPaymentStatus })}
                    className="form-radio text-primary-blue h-5 w-5"
                  />
                  <span className="ml-2 text-gray-700">Pre-Paid (Only Pickup Required)</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4 md:mb-0">
                <label htmlFor="orderConfirmationName" className="block text-sm font-medium text-gray-700 mb-1">Order Confirmation Name <span className="text-accent-red">*</span></label>
                <input
                  type="text"
                  id="orderConfirmationName"
                  value={bookingDetails.orderConfirmationName}
                  onChange={(e) => updateBookingDetails({ orderConfirmationName: e.target.value })}
                  placeholder="Name on order/seller"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-blue focus:border-primary-blue"
                  required
                />
              </div>
              <div className="mb-4 md:mb-0">
                <label htmlFor="orderReceiptNumber" className="block text-sm font-medium text-gray-700 mb-1">Order/Receipt Number <span className="text-accent-red">*</span></label>
                <input
                  type="text"
                  id="orderReceiptNumber"
                  value={bookingDetails.orderReceiptNumber}
                  onChange={(e) => updateBookingDetails({ orderReceiptNumber: e.target.value })}
                  placeholder="Confirmation # or Receipt #"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-blue focus:border-primary-blue"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1">Recipient Name <span className="text-accent-red">*</span></label>
              <input
                type="text"
                id="recipientName"
                value={bookingDetails.recipientName}
                onChange={(e) => updateBookingDetails({ recipientName: e.target.value })}
                placeholder="Name of person receiving delivery"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-blue focus:border-primary-blue"
                required
              />
            </div>
          </div>

          {/* Dynamic Item List Sub-section */}
          <div className="p-4 bg-light-gray rounded-md">
            <h4 className="text-xl font-semibold text-secondary-dark mb-4">Items to be Delivered <span className="text-accent-red">*</span></h4>

            {bookingDetails.bookingItems.length === 0 && (
                <p className="text-gray-600 text-center py-4">No items added yet. Click "Add Item" to begin.</p>
            )}

            {bookingDetails.bookingItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-md shadow-sm mb-4 border border-gray-200 relative">
                <h5 className="font-semibold text-primary-blue mb-3">Item: {item.name || 'Untitled Item'}</h5>
                <button
                  onClick={() => removeBookingItem(item.id)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-accent-red transition-colors duration-200"
                  aria-label="Remove item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor={`item-name-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">Item Name/Product <span className="text-accent-red">*</span></label>
                    <input
                      type="text"
                      id={`item-name-${item.id}`}
                      value={item.name}
                      onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-blue focus:border-primary-blue"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor={`item-color-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">Color/Variant</label>
                    <input
                      type="text"
                      id={`item-color-${item.id}`}
                      value={item.color}
                      onChange={(e) => handleUpdateItem(item.id, 'color', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-blue focus:border-primary-blue"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor={`item-size-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">Size/Dimensions</label>
                    <input
                      type="text"
                      id={`item-size-${item.id}`}
                      value={item.size}
                      onChange={(e) => handleUpdateItem(item.id, 'size', e.target.value)}
                      placeholder="e.g., 60x30x20 inches, Estimated 50 lbs"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-blue focus:border-primary-blue"
                    />
                     <p className="text-xs text-gray-500 mt-1">Include estimated weight/size for driver planning.</p>
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor={`item-description-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      id={`item-description-${item.id}`}
                      value={item.description}
                      onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                      rows={2}
                      placeholder="Special notes: 'Flat-pack', 'Very heavy box', 'Fragile'"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-blue focus:border-primary-blue"
                    ></textarea>
                  </div>
                </div>
              </div>
            ))}

            {/* New Item Input */}
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 mt-6">
                <h5 className="font-semibold text-secondary-dark mb-3">Add New Item</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="new-item-name" className="block text-sm font-medium text-gray-700 mb-1">Item Name/Product <span className="text-accent-red">*</span></label>
                    <input
                      type="text"
                      id="new-item-name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-blue focus:border-primary-blue"
                      placeholder="e.g., MALM Desk"
                    />
                  </div>
                  <div>
                    <label htmlFor="new-item-color" className="block text-sm font-medium text-gray-700 mb-1">Color/Variant</label>
                    <input
                      type="text"
                      id="new-item-color"
                      value={newItem.color}
                      onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-blue focus:border-primary-blue"
                      placeholder="e.g., White Oak"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="new-item-size" className="block text-sm font-medium text-gray-700 mb-1">Size/Dimensions</label>
                    <input
                      type="text"
                      id="new-item-size"
                      value={newItem.size}
                      onChange={(e) => setNewItem({ ...newItem, size: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-blue focus:border-primary-blue"
                      placeholder="e.g., 60x30x20 inches, Estimated 50 lbs"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="new-item-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      id="new-item-description"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      rows={2}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-blue focus:border-primary-blue"
                      placeholder="Short notes: 'Flat-pack', 'Very heavy box', etc."
                    ></textarea>
                  </div>
                </div>
                <button
                  onClick={handleAddItem}
                  className="w-full bg-primary-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Add Item
                </button>
            </div>
          </div>
        </section>
      )}

      {/* Step 3: Customize Your Order (Add-Ons) - Only visible after Step 2 completion */}
      {bookingDetails.selectedPackage && isStep2Complete && (
        <section id="add-ons-section" className="mb-12 animate-fade-in-up">
          <h3 className="text-2xl font-bold text-secondary-dark mb-6 text-center">Step 3: Customize Your Order (Add-Ons)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ADD_ONS.map((addOn) => (
              <AddOnToggle key={addOn.id} addOn={addOn} />
            ))}
          </div>
        </section>
      )}

      {/* Summary & Checkout Bar (Sticky) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-xl py-4 px-4 sm:px-6 z-40 border-t-2 border-primary-blue">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center mb-2 sm:mb-0">
            <span className="text-lg font-medium text-secondary-dark mr-4">
              Selected Package: <span className="font-semibold text-primary-blue">{bookingDetails.selectedPackage?.name || 'None'}</span>
            </span>
            <span className="text-lg font-medium text-secondary-dark">
              Add-Ons Total: <span className="font-semibold text-accent-green">${(totalPrice - (bookingDetails.selectedPackage?.basePrice || 0)).toFixed(2)}</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-secondary-dark">
              GRAND TOTAL: <span className="text-primary-blue">${totalPrice.toFixed(2)}</span>
            </span>
            <button
              onClick={() => onNavigate(Page.CHECKOUT)}
              disabled={!bookingDetails.selectedPackage || !isStep2Complete}
              className={`
                px-8 py-3 rounded-md text-lg font-semibold transition-colors duration-300
                ${bookingDetails.selectedPackage && isStep2Complete
                  ? 'bg-accent-green text-white hover:bg-green-600 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;