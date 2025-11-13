// pages/CheckoutPage.tsx
import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { Page, PaymentStatus, PickupLocationType, OrderPaymentStatus, JobStatus } from '../types';
import { CANCELLATION_POLICY, REFUND_POLICY, TIME_WINDOWS } from '../constants';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

interface CheckoutPageProps {
  onNavigate: (page: Page) => void;
}

enum PaymentMethod {
  STRIPE = 'stripe',
  VENMO = 'venmo',
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { bookingDetails, updateBookingDetails, calculateTotalPrice, resetBooking } = useBooking();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.STRIPE);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false); // Renamed from isModalOpen for clarity
  const [isVenmoInstructionsOpen, setIsVenmoInstructionsOpen] = useState(false); // New state for Venmo instructions modal

  useEffect(() => {
    // Ensure total price is up-to-date
    const currentTotalPrice = calculateTotalPrice();
    updateBookingDetails({ totalPrice: currentTotalPrice });
  }, [bookingDetails.selectedAddOns, bookingDetails.selectedPackage, calculateTotalPrice, updateBookingDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateBookingDetails({ [name]: value });
  };

  const handleSuccessfulPayment = () => {
    // Generate a unique bookingId here and save to backend (simulated)
    const newBookingId = `QDS-${Date.now()}`;
    const updatedDetails = {
      ...bookingDetails,
      bookingId: newBookingId,
      paymentStatus: PaymentStatus.PAID,
      jobStatus: JobStatus.SCHEDULED,
    };
    updateBookingDetails(updatedDetails);
    setIsPaymentSuccess(true);
    setIsConfirmationModalOpen(true);

    // Save complete booking details to localStorage for tracking purposes
    localStorage.setItem(`booking_${newBookingId}`, JSON.stringify(updatedDetails));
  };

  const handleProcessPayment = async () => {
    if (!bookingDetails.selectedPackage) {
      alert("Please select a package first.");
      onNavigate(Page.HOME);
      return;
    }
    if (!bookingDetails.pickupAddress || !bookingDetails.deliveryAddress || !bookingDetails.dateRequested || !bookingDetails.timeWindow) {
      alert("Please fill in all required delivery details.");
      return;
    }
    // New validation for Step 2 details
    if (!bookingDetails.pickupLocationType || !bookingDetails.orderPaymentStatus || !bookingDetails.orderConfirmationName.trim() || !bookingDetails.orderReceiptNumber.trim() || !bookingDetails.recipientName.trim()) {
      alert("Please complete all required item and pickup details.");
      onNavigate(Page.HOME); // Navigate back to ensure they fill it
      return;
    }
    if (bookingDetails.pickupLocationType === PickupLocationType.STORE_RETAILER && !bookingDetails.storeName.trim()) {
      alert("Please enter the store name for pickup.");
      onNavigate(Page.HOME);
      return;
    }
    if (bookingDetails.bookingItems.length === 0 || bookingDetails.bookingItems.some(item => !item.name.trim())) {
      alert("Please add at least one item and ensure all item names are filled.");
      onNavigate(Page.HOME);
      return;
    }

    if (selectedPaymentMethod === PaymentMethod.VENMO) {
        setIsVenmoInstructionsOpen(true);
        return; // Open instructions, then wait for user to confirm payment was sent
    }

    // For Stripe, proceed directly
    setIsProcessing(true);
    // Simulate Stripe payment processing
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    const paymentSuccessful = Math.random() > 0.1; // 90% success rate for simulation

    if (paymentSuccessful) {
      handleSuccessfulPayment();
    } else {
      updateBookingDetails({ paymentStatus: PaymentStatus.FAILED });
      alert("Payment failed. Please try again or use a different payment method.");
    }
    setIsProcessing(false);
  };

  const handleVenmoConfirmed = async () => {
    setIsVenmoInstructionsOpen(false); // Close instructions modal
    setIsProcessing(true); // Start processing for booking confirmation (simulation)

    // Simulate network delay for verification
    await new Promise(resolve => setTimeout(resolve, 3000));
    const venmoPaymentSuccessful = Math.random() > 0.1; // 90% success rate for simulation

    if (venmoPaymentSuccessful) {
        handleSuccessfulPayment();
    } else {
        updateBookingDetails({ paymentStatus: PaymentStatus.FAILED });
        alert("Venmo payment confirmation failed or was not received. Please verify and try again.");
    }
    setIsProcessing(false);
  };

  const closeConfirmationModalAndReset = () => {
    setIsConfirmationModalOpen(false);
    resetBooking(); // Clear booking details
    onNavigate(Page.HOME); // Go back to home
  };

  if (!bookingDetails.selectedPackage) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-secondary-dark mb-4">No package selected.</h2>
        <p className="text-gray-700 mb-6">Please go back to the home page to select your delivery and assembly package.</p>
        <button
          onClick={() => onNavigate(Page.HOME)}
          className="bg-primary-blue text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Go to Home Page
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-secondary-dark mb-8 text-center">Checkout</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Summary */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-secondary-dark mb-4">Order Summary</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center text-lg">
              <span className="font-medium">Package:</span>
              <span className="font-semibold text-primary-blue">{bookingDetails.selectedPackage.name}</span>
              <span className="font-bold">${bookingDetails.selectedPackage.basePrice.toFixed(2)}</span>
            </div>
            {bookingDetails.selectedAddOns.length > 0 && (
              <div className="border-t border-gray-200 pt-3">
                <p className="font-medium text-gray-700 mb-2">Add-Ons:</p>
                {bookingDetails.selectedAddOns.map((addOn) => (
                  <div key={addOn.id} className="flex justify-between items-center text-sm text-gray-600 ml-4">
                    <span>{addOn.name} {addOn.quantity ? `(x${addOn.quantity})` : ''} {addOn.option ? `(${addOn.option})` : ''}</span>
                    <span>+${addOn.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between items-center text-xl font-bold border-t-2 border-gray-300 pt-4 mt-4">
              <span>Total:</span>
              <span className="text-accent-green">${bookingDetails.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-secondary-dark mb-4 mt-8">Pickup & Delivery Details</h3>

          {/* Pickup Information Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-light-gray rounded-md">
            <div className="col-span-full">
              <p className="font-medium text-gray-700">Pickup Location Type:</p>
              <p className="text-secondary-dark font-semibold">{bookingDetails.pickupLocationType}</p>
            </div>
            {bookingDetails.pickupLocationType === PickupLocationType.STORE_RETAILER && (
              <div className="col-span-full">
                <p className="font-medium text-gray-700">Store Name:</p>
                <p className="text-secondary-dark">{bookingDetails.storeName}</p>
              </div>
            )}
            <div className="col-span-full">
              <p className="font-medium text-gray-700">Order Status:</p>
              <p className="text-secondary-dark font-semibold">{bookingDetails.orderPaymentStatus}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Order Confirmation Name:</p>
              <p className="text-secondary-dark">{bookingDetails.orderConfirmationName}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Order/Receipt Number:</p>
              <p className="text-secondary-dark">{bookingDetails.orderReceiptNumber}</p>
            </div>
            <div className="col-span-full">
              <p className="font-medium text-gray-700">Recipient Name:</p>
              <p className="text-secondary-dark">{bookingDetails.recipientName}</p>
            </div>
          </div>

          {/* Items List Display */}
          <div className="mb-6 p-4 bg-light-gray rounded-md">
            <h4 className="text-xl font-bold text-secondary-dark mb-2">Items:</h4>
            {bookingDetails.bookingItems.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700 ml-4">
                {bookingDetails.bookingItems.map((item, index) => (
                  <li key={item.id || index} className="mb-2">
                    <p className="font-semibold">{item.name}</p>
                    {item.color && <p className="text-sm">Color: {item.color}</p>}
                    {item.size && <p className="text-sm">Size/Dimensions: {item.size}</p>}
                    {item.description && <p className="text-sm">Notes: {item.description}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No items specified.</p>
            )}
          </div>

          {/* Addresses and Schedule Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div className="col-span-full">
              <label htmlFor="pickupAddress" className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
              <input
                type="text"
                name="pickupAddress"
                id="pickupAddress"
                value={bookingDetails.pickupAddress}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue"
              />
            </div>
            <div className="col-span-full">
              <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
              <input
                type="text"
                name="deliveryAddress"
                id="deliveryAddress"
                value={bookingDetails.deliveryAddress}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue"
              />
            </div>
            <div>
              <label htmlFor="dateRequested" className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
              <input
                type="date"
                name="dateRequested"
                id="dateRequested"
                value={bookingDetails.dateRequested}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]} // Min date is today
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue"
              />
            </div>
            <div>
              <label htmlFor="timeWindow" className="block text-sm font-medium text-gray-700 mb-1">Time Window</label>
              <select
                name="timeWindow"
                id="timeWindow"
                value={bookingDetails.timeWindow}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue bg-white"
              >
                <option value="">Select a time window</option>
                {TIME_WINDOWS.map(window => (
                  <option key={window} value={window}>{window}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-secondary-dark mb-4">Payment Method</h3>
            <div className="mb-6 p-4 bg-light-gray rounded-md">
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={PaymentMethod.STRIPE}
                    checked={selectedPaymentMethod === PaymentMethod.STRIPE}
                    onChange={() => setSelectedPaymentMethod(PaymentMethod.STRIPE)}
                    className="form-radio text-primary-blue h-5 w-5"
                    aria-label="Pay with Credit Card via Stripe"
                  />
                  <span className="ml-2 text-gray-700">Credit Card (Stripe)</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={PaymentMethod.VENMO}
                    checked={selectedPaymentMethod === PaymentMethod.VENMO}
                    onChange={() => setSelectedPaymentMethod(PaymentMethod.VENMO)}
                    className="form-radio text-primary-blue h-5 w-5"
                    aria-label="Pay with Venmo"
                  />
                  <span className="ml-2 text-gray-700">Venmo</span>
                </label>
              </div>
              <p className="text-accent-red font-semibold mt-4" role="alert">
                ⚠️ Cash on Delivery (COD) is NOT accepted. All payments must be processed upfront digitally.
              </p>
            </div>

            <button
              onClick={handleProcessPayment}
              disabled={isProcessing || isPaymentSuccess}
              className={`
                w-full py-3 rounded-md text-xl font-bold transition-colors duration-300
                ${isProcessing || isPaymentSuccess
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-primary-blue text-white hover:bg-blue-700 shadow-lg'
                }
              `}
              aria-live="polite"
            >
              {isProcessing
                ? <LoadingSpinner message="Processing Payment..." />
                : `Pay with ${selectedPaymentMethod === PaymentMethod.STRIPE ? 'Stripe (Credit Card)' : 'Venmo'}`
              }
            </button>
            {isPaymentSuccess && (
              <p className="text-center text-accent-green mt-4 font-semibold" aria-live="assertive">Payment Successful! Your booking is confirmed.</p>
            )}
            {bookingDetails.paymentStatus === PaymentStatus.FAILED && (
              <p className="text-center text-accent-red mt-4 font-semibold" aria-live="assertive">Payment Failed. Please try again.</p>
            )}
          </div>
        </div>

        {/* Policies Section */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-secondary-dark mb-4">Important Policies</h3>

          <div className="mb-6">
            <h4 className="text-xl font-bold text-primary-blue mb-2">{CANCELLATION_POLICY.title}</h4>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
              {CANCELLATION_POLICY.details.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold text-primary-blue mb-2">{REFUND_POLICY.title}</h4>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
              {REFUND_POLICY.details.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="font-bold text-accent-red mt-3 text-lg">⚠️ No refunds on completed jobs.</p>
          </div>
        </div>
      </div>

      <Modal isOpen={isConfirmationModalOpen} onClose={closeConfirmationModalAndReset} title="Booking Confirmed!">
        <p className="text-gray-700 mb-4">Thank you for your booking!</p>
        <p className="text-gray-700 mb-4">Your Booking ID: <span className="font-bold text-primary-blue">{bookingDetails.bookingId || 'N/A'}</span></p>
        <p className="text-gray-700 mb-4">We've received your payment of <span className="font-bold">${bookingDetails.totalPrice.toFixed(2)}</span>. Your service is scheduled for <span className="font-bold">{bookingDetails.dateRequested}</span> during the <span className="font-bold">{bookingDetails.timeWindow}</span> window.</p>
        <p className="text-gray-700 mb-6">A confirmation email with all details will be sent shortly.</p>
        <button onClick={closeConfirmationModalAndReset} className="w-full bg-primary-blue text-white py-2 rounded-md hover:bg-blue-700">
          Done
        </button>
      </Modal>

      <Modal isOpen={isVenmoInstructionsOpen} onClose={() => setIsVenmoInstructionsOpen(false)} title="Pay with Venmo">
        <p className="text-gray-700 mb-4">
          To complete your booking, please send <span className="font-bold text-primary-blue">${bookingDetails.totalPrice.toFixed(2)}</span> to our Venmo account:
        </p>
        <div className="text-center bg-light-gray p-4 rounded-md mb-4">
          <p className="font-bold text-xl text-secondary-dark">@QuickDropSD_Official</p> {/* Placeholder Venmo handle */}
          <p className="text-sm text-gray-600 mt-1">Please include your name and "QuickDrop SD Booking" in the Venmo note.</p>
          {/* In a real app, a QR code image would go here */}
        </div>
        <p className="text-gray-700 mb-6">
          Once you have sent the payment on Venmo, click "I have sent the payment" below to confirm your booking.
          Please note, your booking will only be confirmed after we verify the payment.
        </p>
        <button onClick={handleVenmoConfirmed} disabled={isProcessing} className="w-full bg-primary-blue text-white py-2 rounded-md hover:bg-blue-700">
          {isProcessing ? <LoadingSpinner message="Confirming..." /> : "I have sent the payment"}
        </button>
        <button onClick={() => setIsVenmoInstructionsOpen(false)} className="mt-4 w-full bg-gray-300 text-secondary-dark py-2 rounded-md hover:bg-gray-400">
          Cancel Payment
        </button>
      </Modal>
    </div>
  );
};

export default CheckoutPage;