// pages/CheckoutPage.tsx
import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { Page, PaymentStatus, PickupLocationType, OrderPaymentStatus, JobStatus, ServiceType } from '../types';
import { CANCELLATION_POLICY, REFUND_POLICY, TIME_WINDOWS, CONTACT_EMAIL } from '../constants'; // Import CONTACT_EMAIL
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { sendBookingConfirmationEmail, sendBookingConfirmationSMS } from '../utils/emailService'; // Import the new utility and SMS utility

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
  const [paymentErrorMessage, setPaymentErrorMessage] = useState<string | null>(null); // New state for specific payment errors

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
    setPaymentErrorMessage(null);

    // Send confirmation email and SMS
    sendBookingConfirmationEmail(updatedDetails);
    sendBookingConfirmationSMS(updatedDetails.customerPhone, newBookingId);

    localStorage.setItem(`booking_${newBookingId}`, JSON.stringify(updatedDetails));
  };

  const handleProcessPayment = async () => {
    setPaymentErrorMessage(null);

    // Ensure all critical booking details are present before attempting payment
    if (!bookingDetails.selectedPackage || !bookingDetails.pickupAddress || (bookingDetails.serviceType === ServiceType.DELIVERY && !bookingDetails.deliveryAddress) || !bookingDetails.dateRequested || !bookingDetails.timeWindow || !bookingDetails.customerEmail || !bookingDetails.customerPhone || bookingDetails.bookingItems.length === 0) {
      setPaymentErrorMessage("Please ensure all required booking details (package, addresses, date, time, contact info, and at least one item) are filled out on the homepage before proceeding to payment.");
      return;
    }


    setIsProcessing(true);

    if (selectedPaymentMethod === PaymentMethod.STRIPE) {
      // Simulate Stripe payment
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      const paymentSuccessful = Math.random() > 0.1; // 90% success rate for demo

      if (paymentSuccessful) {
        handleSuccessfulPayment();
      } else {
        setPaymentErrorMessage("Stripe payment failed. Please try again or choose another method.");
        setIsProcessing(false);
      }
    } else if (selectedPaymentMethod === PaymentMethod.VENMO) {
      // For Venmo, we just show instructions and assume offline payment completion
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsVenmoInstructionsOpen(true);
      setIsProcessing(false); // Stop processing spinner, user interaction required
      // We don't call handleSuccessfulPayment immediately for Venmo,
      // as it's an offline transaction the user needs to complete.
      // A real system would have a backend callback or manual verification.
    }
  };

  const handleVenmoPaymentConfirmedOffline = () => {
    // This function would be called by the user after they complete the Venmo payment offline
    // In a real app, this would trigger a backend process to verify payment
    handleSuccessfulPayment(); // For demo purposes, immediately mark as successful
    setIsVenmoInstructionsOpen(false);
  };

  const handleReturnHomeAfterConfirmation = () => {
    setIsConfirmationModalOpen(false);
    resetBooking(); // Clear booking details after successful checkout
    onNavigate(Page.ORDER_TRACKING); // Navigate to order tracking page
  };

  const currentTotalPrice = bookingDetails.totalPrice || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h2 className="text-3xl font-bold text-secondary-dark mb-8 text-center">Checkout</h2>

      {bookingDetails.selectedPackage ? (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-primary-blue mb-4">Order Summary</h3>
          <p className="text-gray-700 mb-2">Service Type: <span className="capitalize">{bookingDetails.serviceType}</span></p>
          <p className="text-gray-700 mb-2">Package: {bookingDetails.selectedPackage.name} (${bookingDetails.selectedPackage.basePrice.toFixed(2)})</p>
          {bookingDetails.selectedAddOns.length > 0 && (
            <div className="mb-2">
              <p className="font-semibold text-gray-700">Add-Ons:</p>
              <ul className="list-disc list-inside text-gray-700 ml-4">
                {bookingDetails.selectedAddOns.map(addOn => (
                  <li key={addOn.id}>
                    {addOn.name} {addOn.quantity ? `(x${addOn.quantity})` : ''} {addOn.option ? `(${addOn.option})` : ''}: +${addOn.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <p className="text-2xl font-bold text-secondary-dark">Grand Total: <span className="text-primary-blue">${currentTotalPrice.toFixed(2)}</span></p>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-center">
          <p className="text-xl text-gray-700">No package selected. Please go back to the <a href="#" onClick={() => onNavigate(Page.HOME)} className="text-primary-blue hover:underline">homepage</a> to start your booking.</p>
        </div>
      )}

      {!isPaymentSuccess && bookingDetails.selectedPackage && (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-primary-blue mb-4">Payment Method</h3>
            <div className="flex flex-col space-y-3">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={PaymentMethod.STRIPE}
                  checked={selectedPaymentMethod === PaymentMethod.STRIPE}
                  onChange={() => setSelectedPaymentMethod(PaymentMethod.STRIPE)}
                  className="form-radio text-primary-blue h-5 w-5"
                />
                <span className="ml-2 text-gray-700 text-lg">Pay with Card (Stripe)</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={PaymentMethod.VENMO}
                  checked={selectedPaymentMethod === PaymentMethod.VENMO}
                  onChange={() => setSelectedPaymentMethod(PaymentMethod.VENMO)}
                  className="form-radio text-primary-blue h-5 w-5"
                />
                <span className="ml-2 text-gray-700 text-lg">Pay with Venmo</span>
              </label>
            </div>
          </div>

          {paymentErrorMessage && (
            <div className="bg-accent-red/10 border border-accent-red text-accent-red p-3 rounded-md mb-4" role="alert">
              <p className="font-semibold">Payment Error:</p>
              <p>{paymentErrorMessage}</p>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-primary-blue mb-4">Policies</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Review our <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(Page.CANCELLATION_POLICY_PAGE); }} className="text-primary-blue hover:underline font-medium">Cancellation Policy</a></li>
              <li>Review our <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(Page.REFUND_POLICY_PAGE); }} className="text-primary-blue hover:underline font-medium">Refund Policy</a></li>
            </ul>
            <p className="font-bold text-accent-red mt-3 text-lg">⚠️ No refunds on completed jobs.</p>
          </div>

          <button
            onClick={handleProcessPayment}
            disabled={isProcessing || !bookingDetails.selectedPackage}
            className={`
              w-full py-3 rounded-md text-xl font-bold transition-colors duration-300
              ${isProcessing || !bookingDetails.selectedPackage
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-accent-green text-white hover:bg-green-600 shadow-lg'
              }
            `}
          >
            {isProcessing ? <LoadingSpinner message="Processing Payment..." /> : `Pay $${currentTotalPrice.toFixed(2)}`}
          </button>
        </>
      )}

      {isPaymentSuccess && (
        <div className="bg-accent-green/10 border border-accent-green text-accent-green p-6 rounded-lg shadow-md text-center">
          <p className="text-2xl font-bold mb-4">Payment Successful!</p>
          <p className="text-lg">Your booking has been confirmed. A confirmation email and SMS have been sent.</p>
          <p className="text-lg mt-2">Your Tracking Number is: <span className="font-bold">{bookingDetails.bookingId}</span></p>
          <button
            onClick={handleReturnHomeAfterConfirmation}
            className="mt-6 bg-primary-blue text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            View Order Tracking
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal isOpen={isConfirmationModalOpen} onClose={() => { /* don't close, force navigation */ }} title="Booking Confirmed!">
        <p className="text-gray-700 mb-4">Your booking with QuickDrop SD is complete!</p>
        <p className="text-gray-700 mb-4">Your Tracking Number: <span className="font-bold text-primary-blue">{bookingDetails.bookingId}</span></p>
        <p className="text-gray-700 mb-6">A confirmation email and SMS have been sent to you with all the details.</p>
        <button onClick={handleReturnHomeAfterConfirmation} className="w-full bg-primary-blue text-white py-2 rounded-md hover:bg-blue-700">
          Go to Order Tracking
        </button>
      </Modal>

      {/* Venmo Instructions Modal */}
      <Modal isOpen={isVenmoInstructionsOpen} onClose={() => setIsVenmoInstructionsOpen(false)} title="Complete Venmo Payment">
        <p className="text-gray-700 mb-4">Please complete your payment of <span className="font-bold text-primary-blue">${currentTotalPrice.toFixed(2)}</span> via Venmo to @QuickDropSD.</p>
        <p className="text-gray-700 mb-4">
          Include your name and a brief description of the service (e.g., "Furniture Delivery" or "Removal") in the Venmo note.
          Your booking will be fully confirmed once we receive and verify the payment.
        </p>
        <p className="text-sm text-gray-600 mb-6">
          You can close this window and proceed with the Venmo app. Once completed, click "I have paid" to acknowledge.
          We will contact you if there are any issues with verification.
        </p>
        <button
          onClick={handleVenmoPaymentConfirmedOffline}
          disabled={isProcessing}
          className={`w-full bg-accent-green text-white py-2 rounded-md hover:bg-green-600 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''} mb-2`}
        >
          {isProcessing ? <LoadingSpinner message="Verifying..." /> : "I have paid via Venmo"}
        </button>
        <button onClick={() => setIsVenmoInstructionsOpen(false)} className="w-full bg-gray-300 text-secondary-dark py-2 rounded-md hover:bg-gray-400">
          Cancel & Return to Payment Options
        </button>
      </Modal>

    </div>
  );
};

export default CheckoutPage;