// pages/CheckoutPage.tsx
import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { Page, PaymentStatus, PickupLocationType, OrderPaymentStatus, JobStatus, ServiceType } from '../types';
import { CANCELLATION_POLICY, REFUND_POLICY, TIME_WINDOWS, CONTACT_EMAIL } from '../constants'; // Import CONTACT_EMAIL
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

  const sendBookingConfirmationEmail = (details: typeof bookingDetails) => {
    const subject = `QuickDrop SD Booking Confirmation - ID: ${details.bookingId}`;
    const addOnsSummary = details.selectedAddOns.length > 0
      ? `\n  Add-Ons:\n${details.selectedAddOns.map(ao => `    - ${ao.name} ${ao.quantity ? `(x${ao.quantity})` : ''}${ao.option ? ` (${ao.option})` : ''}: +$${ao.price.toFixed(2)}`).join('\n')}`
      : '\n  Add-Ons: None';
      
    const deliveryBody = `
Pickup Address: ${details.pickupAddress}
Delivery Address: ${details.deliveryAddress}
Requested Date: ${details.dateRequested}
Time Window: ${details.timeWindow}

Pickup Location Type: ${details.pickupLocationType}
${details.pickupLocationType === PickupLocationType.STORE_RETAILER ? `Store Name: ${details.storeName}\n` : ''}
Order Status: ${details.orderPaymentStatus}
Order Confirmation Name: ${details.orderConfirmationName}
Order/Receipt Number: ${details.orderReceiptNumber}
Recipient Name: ${details.recipientName}
`;

    const removalBody = `
Removal Address: ${details.pickupAddress}
Requested Date: ${details.dateRequested}
Time Window: ${details.timeWindow}
Primary Contact Name: ${details.recipientName}
`;

    const emailBody = `
Dear Customer,

Thank you for your booking with QuickDrop SD!

Your ${details.serviceType} service is confirmed.

Booking ID: ${details.bookingId}
Total Price Paid: $${details.totalPrice.toFixed(2)}

---
**Booking Summary**
Service Type: ${details.serviceType.charAt(0).toUpperCase() + details.serviceType.slice(1)}
Package: ${details.selectedPackage?.name} - $${details.selectedPackage?.basePrice.toFixed(2)}
${addOnsSummary}

${details.serviceType === ServiceType.DELIVERY ? deliveryBody : removalBody}

Items to be ${details.serviceType === ServiceType.DELIVERY ? 'Delivered' : 'Removed'}:
${details.bookingItems.length > 0 ? details.bookingItems.map(item => `  - ${item.name}${item.color ? ` (${item.color})` : ''}${item.size ? `, ${item.size}` : ''}${item.description ? ` - ${item.description}` : ''}`).join('\n') : '  No specific items listed.'}

---

We will notify you with further updates as your job progresses.
You can track your order at any time using your Booking ID on our website.

If you have any questions, please contact us at ${CONTACT_EMAIL}.

Sincerely,
The QuickDrop SD Team
`;

    console.log(`--- SIMULATED EMAIL SENT ---`);
    console.log(`To: Customer Email (not captured in this demo)`);
    console.log(`Subject: ${subject}`);
    console.log(emailBody);
    console.log(`--- END SIMULATED EMAIL ---`);
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

    sendBookingConfirmationEmail(updatedDetails);
    localStorage.setItem(`booking_${newBookingId}`, JSON.stringify(updatedDetails));
  };

  const handleProcessPayment = async () => {
    setPaymentErrorMessage(null);

    if (!bookingDetails.selectedPackage) {
      setPaymentErrorMessage("No package selected. Please go back to the home page.");
      onNavigate(Page.HOME);
      return;
    }
    
    if (!bookingDetails.pickupAddress.trim()) {
      const addressField = bookingDetails.serviceType === ServiceType.DELIVERY ? "pickup address" : "removal address";
      setPaymentErrorMessage(`Please enter a valid ${addressField} on the home page.`);
      onNavigate(Page.HOME);
      return;
    }
    if (bookingDetails.serviceType === ServiceType.DELIVERY && !bookingDetails.deliveryAddress.trim()) {
      setPaymentErrorMessage("Please enter a valid delivery address on the home page.");
      onNavigate(Page.HOME);
      return;
    }
    if (!bookingDetails.dateRequested || !bookingDetails.timeWindow) {
      setPaymentErrorMessage("Please select a preferred date and time window on the home page.");
      onNavigate(Page.HOME);
      return;
    }

    if (bookingDetails.serviceType === ServiceType.DELIVERY) {
      if (!bookingDetails.pickupLocationType || !bookingDetails.orderPaymentStatus || !bookingDetails.orderConfirmationName.trim() || !bookingDetails.orderReceiptNumber.trim() || !bookingDetails.recipientName.trim()) {
        setPaymentErrorMessage("Please complete all required item and pickup details on the home page.");
        onNavigate(Page.HOME);
        return;
      }
      if (bookingDetails.pickupLocationType === PickupLocationType.STORE_RETAILER && !bookingDetails.storeName.trim()) {
        setPaymentErrorMessage("Please enter the store name for pickup on the home page.");
        onNavigate(Page.HOME);
        return;
      }
    }

    if (bookingDetails.bookingItems.length === 0 || bookingDetails.bookingItems.some(item => !item.name.trim())) {
      setPaymentErrorMessage("Please add at least one item and ensure all item names are filled on the home page.");
      onNavigate(Page.HOME);
      return;
    }

    if (selectedPaymentMethod === PaymentMethod.VENMO) {
        setIsVenmoInstructionsOpen(true);
        return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const paymentSuccessful = Math.random() > 0.1;

    if (paymentSuccessful) {
      handleSuccessfulPayment();
    } else {
      updateBookingDetails({ paymentStatus: PaymentStatus.FAILED });
      setPaymentErrorMessage("Credit card payment failed. Please check your card details or try Venmo.");
    }
    setIsProcessing(false);
  };

  const handleVenmoConfirmed = async () => {
    setPaymentErrorMessage(null);
    setIsVenmoInstructionsOpen(false);
    setIsProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 3000));
    const venmoPaymentSuccessful = Math.random() > 0.1;

    if (venmoPaymentSuccessful) {
        handleSuccessfulPayment();
    } else {
        updateBookingDetails({ paymentStatus: PaymentStatus.FAILED });
        setPaymentErrorMessage("Venmo payment confirmation could not be verified. Please ensure you have sent the payment and try again.");
    }
    setIsProcessing(false);
  };

  const closeConfirmationModalAndReset = () => {
    setIsConfirmationModalOpen(false);
    resetBooking();
    setPaymentErrorMessage(null);
    onNavigate(Page.HOME);
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

          <h3 className="text-2xl font-semibold text-secondary-dark mb-4 mt-8">{bookingDetails.serviceType === ServiceType.DELIVERY ? 'Pickup & Delivery Details' : 'Removal Details'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-light-gray rounded-md">
            {bookingDetails.serviceType === ServiceType.DELIVERY && (
              <>
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
              </>
            )}
            <div className="col-span-full">
              <p className="font-medium text-gray-700">{bookingDetails.serviceType === ServiceType.DELIVERY ? 'Recipient Name:' : 'Primary Contact Name:'}</p>
              <p className="text-secondary-dark">{bookingDetails.recipientName}</p>
            </div>
            <div className="col-span-full">
              <p className="font-medium text-gray-700">{bookingDetails.serviceType === ServiceType.DELIVERY ? 'Pickup Address:' : 'Removal Address:'}</p>
              <p className="text-secondary-dark">{bookingDetails.pickupAddress}</p>
            </div>
            {bookingDetails.serviceType === ServiceType.DELIVERY && (
              <div className="col-span-full">
                <p className="font-medium text-gray-700">Delivery Address:</p>
                <p className="text-secondary-dark">{bookingDetails.deliveryAddress}</p>
              </div>
            )}
            <div>
              <p className="font-medium text-gray-700">Preferred Date:</p>
              <p className="text-secondary-dark">{bookingDetails.dateRequested}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Time Window:</p>
              <p className="text-secondary-dark">{bookingDetails.timeWindow}</p>
            </div>
          </div>

          <div className="mb-6 p-4 bg-light-gray rounded-md">
            <h4 className="text-xl font-bold text-secondary-dark mb-2">Items to be {bookingDetails.serviceType === ServiceType.DELIVERY ? 'Delivered' : 'Removed'}:</h4>
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
            ) : (<p className="text-gray-600">No items specified.</p>)}
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-secondary-dark mb-4">Payment Method</h3>
            <div className="mb-6 p-4 bg-light-gray rounded-md">
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="inline-flex items-center">
                  <input type="radio" name="paymentMethod" value={PaymentMethod.STRIPE} checked={selectedPaymentMethod === PaymentMethod.STRIPE} onChange={() => setSelectedPaymentMethod(PaymentMethod.STRIPE)} className="form-radio text-primary-blue h-5 w-5" aria-label="Pay with Credit Card via Stripe"/>
                  <span className="ml-2 text-gray-700">Credit Card (Stripe)</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="paymentMethod" value={PaymentMethod.VENMO} checked={selectedPaymentMethod === PaymentMethod.VENMO} onChange={() => setSelectedPaymentMethod(PaymentMethod.VENMO)} className="form-radio text-primary-blue h-5 w-5" aria-label="Pay with Venmo"/>
                  <span className="ml-2 text-gray-700">Venmo</span>
                </label>
              </div>
              <p className="text-accent-red font-semibold mt-4" role="alert">
                ⚠️ Cash on Delivery (COD) is NOT accepted. All payments must be processed upfront digitally.
              </p>
            </div>
            <button onClick={handleProcessPayment} disabled={isProcessing || isPaymentSuccess} className={`w-full py-3 rounded-md text-xl font-bold transition-colors duration-300 ${isProcessing || isPaymentSuccess ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-primary-blue text-white hover:bg-blue-700 shadow-lg'}`} aria-live="polite">
              {isProcessing ? <LoadingSpinner message="Processing Payment..." /> : `Pay with ${selectedPaymentMethod === PaymentMethod.STRIPE ? 'Stripe (Credit Card)' : 'Venmo'}`}
            </button>
            {paymentErrorMessage && (<p className="text-center text-accent-red mt-4 font-semibold" aria-live="assertive">{paymentErrorMessage}</p>)}
            {isPaymentSuccess && (<p className="text-center text-accent-green mt-4 font-semibold" aria-live="assertive">Payment Successful! Your booking is confirmed.</p>)}
            {bookingDetails.paymentStatus === PaymentStatus.FAILED && !paymentErrorMessage && (<p className="text-center text-accent-red mt-4 font-semibold" aria-live="assertive">Payment Failed. Please try again.</p>)}
          </div>
        </div>
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-secondary-dark mb-4">Important Policies</h3>
          <div className="mb-6">
            <h4 className="text-xl font-bold text-primary-blue mb-2">{CANCELLATION_POLICY.title}</h4>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
              {CANCELLATION_POLICY.details.map((item, index) => (<li key={index}>{item}</li>))}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold text-primary-blue mb-2">{REFUND_POLICY.title}</h4>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
              {REFUND_POLICY.details.map((item, index) => (<li key={index}>{item}</li>))}
            </ul>
            <p className="font-bold text-accent-red mt-3 text-lg">⚠️ No refunds on completed jobs.</p>
          </div>
        </div>
      </div>
      <Modal isOpen={isConfirmationModalOpen} onClose={closeConfirmationModalAndReset} title="Booking Confirmed!">
        <p className="text-gray-700 mb-4">Thank you for your booking!</p>
        <p className="text-gray-700 mb-4">Your Booking ID: <span className="font-bold text-primary-blue">{bookingDetails.bookingId || 'N/A'}</span></p>
        <p className="text-gray-700 mb-4">We've received your payment of <span className="font-bold">${bookingDetails.totalPrice.toFixed(2)}</span>. Your service is scheduled for <span className="font-bold">{bookingDetails.dateRequested}</span> during the <span className="font-bold">{bookingDetails.timeWindow}</span> window.</p>
        <p className="text-gray-700 mb-6">A confirmation email with all details will be sent shortly (check console for simulated email).</p>
        <button onClick={closeConfirmationModalAndReset} className="w-full bg-primary-blue text-white py-2 rounded-md hover:bg-blue-700">Done</button>
      </Modal>
      <Modal isOpen={isVenmoInstructionsOpen} onClose={() => {setIsVenmoInstructionsOpen(false); setPaymentErrorMessage(null);}} title="Pay with Venmo">
        <p className="text-gray-700 mb-4">To complete your booking, please send <span className="font-bold text-primary-blue">${bookingDetails.totalPrice.toFixed(2)}</span> to our Venmo account:</p>
        <div className="text-center bg-light-gray p-4 rounded-md mb-4">
          <p className="font-bold text-xl text-secondary-dark">@QuickDropSD_Official</p>
          <p className="text-sm text-gray-600 mt-1">Please include your name and "QuickDrop SD Booking" in the Venmo note.</p>
        </div>
        <p className="text-gray-700 mb-6">Once you have sent the payment on Venmo, click "I have sent the payment" below to confirm your booking. Please note, your booking will only be confirmed after we verify the payment.</p>
        {paymentErrorMessage && (<p className="text-center text-accent-red mb-4 font-semibold" aria-live="assertive">{paymentErrorMessage}</p>)}
        <button onClick={handleVenmoConfirmed} disabled={isProcessing} className="w-full bg-primary-blue text-white py-2 rounded-md hover:bg-blue-700">
          {isProcessing ? <LoadingSpinner message="Confirming..." /> : "I have sent the payment"}
        </button>
        <button onClick={() => {setIsVenmoInstructionsOpen(false); setPaymentErrorMessage(null);}} className="mt-4 w-full bg-gray-300 text-secondary-dark py-2 rounded-md hover:bg-gray-400">Cancel Payment</button>
      </Modal>
    </div>
  );
};

export default CheckoutPage;