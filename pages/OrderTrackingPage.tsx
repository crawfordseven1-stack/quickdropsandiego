// pages/OrderTrackingPage.tsx
import React, { useState } from 'react';
import { Page, BookingDetails, JobStatus, ProofOfDelivery } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { sendBookingConfirmationEmail, sendBookingConfirmationSMS } from '../utils/emailService'; // Import email and SMS services

interface OrderTrackingPageProps {
  onNavigate: (page: Page) => void;
}

const getStatusColor = (status: JobStatus | undefined) => {
  switch (status) {
    case JobStatus.SCHEDULED:
      return 'text-primary-blue';
    case JobStatus.IN_TRANSIT:
    case JobStatus.DRIVER_APPROVED:
      return 'text-orange-500';
    case JobStatus.CUSTOMER_APPROVED:
    case JobStatus.COMPLETED:
      return 'text-accent-green';
    case JobStatus.DISPUTED:
      return 'text-accent-red';
    default:
      return 'text-gray-500';
  }
};

const getEstimatedDeliveryTime = (bookingDetails: BookingDetails | null, pod: ProofOfDelivery | null): string => {
  if (!bookingDetails) {
    return 'N/A';
  }

  switch (bookingDetails.jobStatus) {
    case JobStatus.COMPLETED:
    case JobStatus.CUSTOMER_APPROVED:
      const completionDate = pod?.approvalTimestamp ? new Date(pod.approvalTimestamp).toLocaleDateString() : 'recently';
      return `Job Completed on ${completionDate}.`;
    case JobStatus.DRIVER_APPROVED:
      return 'Driver has completed the job. Awaiting your final approval.';
    case JobStatus.DISPUTED:
      return 'Job Disputed. A representative will contact you shortly.';
    case JobStatus.SCHEDULED:
      return `Scheduled for ${bookingDetails.dateRequested} (${bookingDetails.timeWindow}).`;
    case JobStatus.IN_TRANSIT:
      if (pod?.driverLocation) {
        return `Driver is en route and nearing the delivery area. Last updated: ${new Date(pod.driverLocation.timestamp).toLocaleTimeString()}.`;
      }
      return `Driver is in transit. Expected within your selected time window.`;
    default:
      return 'Status unknown. Please contact support if you need further assistance.';
  }
};


const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ onNavigate }) => {
  const [bookingIdInput, setBookingIdInput] = useState('');
  const [trackedBookingDetails, setTrackedBookingDetails] = useState<BookingDetails | null>(null);
  const [proofOfDelivery, setProofOfDelivery] = useState<ProofOfDelivery | null>(null); // New state for POD
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Effect to load all booking IDs on component mount
  // This useEffect and associated states (showAllOrders, allOrders) are removed
  // for privacy reasons, as all bookings should not be visible to any user without authentication.

  const handleTrackOrder = async () => {
    if (!bookingIdInput.trim()) {
      setMessage("Please enter a Booking ID to track your order.");
      setTrackedBookingDetails(null);
      setProofOfDelivery(null);
      return;
    }

    setIsLoading(true);
    setMessage('');
    setTrackedBookingDetails(null);
    setProofOfDelivery(null);

    // Simulate API call to fetch booking details
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Retrieve from localStorage (simulated backend storage)
    const storedBookingString = localStorage.getItem(`booking_${bookingIdInput}`);
    const storedPodString = localStorage.getItem(`pod_${bookingIdInput}`);

    if (storedBookingString) {
      const storedBooking: BookingDetails = JSON.parse(storedBookingString);
      setTrackedBookingDetails(storedBooking);
      setMessage(`Tracking information for Booking ID: ${bookingIdInput}`);

      if (storedPodString) {
        const storedPod: ProofOfDelivery = JSON.parse(storedPodString);
        setProofOfDelivery(storedPod);
      }
    } else {
      setMessage("Booking ID not found. Please check the ID and try again.");
      setTrackedBookingDetails(null); // Explicitly clear if not found
    }
    setIsLoading(false);
  };

  const handleResendEmail = (booking: BookingDetails) => {
    if (booking.customerEmail && booking.bookingId) {
      sendBookingConfirmationEmail(booking);
      setMessage(`Simulated email re-sent for Booking ID: ${booking.bookingId}. Check console.`);
    } else {
      setMessage("Cannot resend email: Customer email or Booking ID is missing.");
    }
  };

  const handleResendSMS = (booking: BookingDetails) => {
    if (booking.customerPhone && booking.bookingId) {
      sendBookingConfirmationSMS(booking.customerPhone, booking.bookingId);
      setMessage(`Simulated SMS re-sent for Booking ID: ${booking.bookingId}. Check console.`);
    } else {
      setMessage("Cannot resend SMS: Customer phone or Booking ID is missing.");
    }
  };

  const estimatedDeliveryTime = getEstimatedDeliveryTime(trackedBookingDetails, proofOfDelivery);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h2 className="text-4xl font-extrabold text-secondary-dark mb-10 text-center leading-tight">
        Track Your <span className="text-primary-blue">Order</span>
      </h2>

      <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl mx-auto">
        Enter your unique Booking ID below to get real-time updates on the status of your order.
      </p>

      <div className="bg-white p-8 rounded-lg shadow-xl mb-8 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            id="bookingId"
            value={bookingIdInput}
            onChange={(e) => setBookingIdInput(e.target.value)}
            placeholder="e.g., QDS-1678888888888"
            className="flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue text-secondary-dark"
            aria-label="Booking ID input"
          />
          <button
            onClick={handleTrackOrder}
            disabled={isLoading}
            className={`
              px-6 py-3 rounded-md font-semibold transition-colors duration-300
              ${isLoading
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-primary-blue text-white hover:bg-blue-700 shadow-md'
              }
            `}
          >
            {isLoading ? <LoadingSpinner message="Tracking..." /> : "Track Order"}
          </button>
        </div>

        {message && (
          <p className={`text-center mb-6 text-base ${trackedBookingDetails ? 'text-gray-700' : 'text-accent-red'}`}>
            {message}
          </p>
        )}

        {isLoading && <LoadingSpinner message="Loading order details..." />}

        {trackedBookingDetails && (
          <div className="mt-8 space-y-4 animate-fade-in-up">
            <h3 className="text-2xl font-bold text-secondary-dark mb-4">Job Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-light-gray p-4 rounded-md">
                <p className="font-semibold text-gray-700">Booking ID:</p>
                <p className="text-primary-blue font-bold text-lg">{trackedBookingDetails.bookingId}</p>
              </div>
              <div className="bg-light-gray p-4 rounded-md">
                <p className="font-semibold text-gray-700">Current Status:</p>
                <p className={`font-bold text-lg ${getStatusColor(trackedBookingDetails.jobStatus)}`}>
                  {trackedBookingDetails.jobStatus || 'Unknown'}
                </p>
              </div>
              <div className="bg-light-gray p-4 rounded-md col-span-1 md:col-span-2">
                <p className="font-semibold text-gray-700">Estimated Delivery Time:</p>
                <p className="text-secondary-dark font-bold text-lg">{estimatedDeliveryTime}</p>
              </div>
              <div className="bg-light-gray p-4 rounded-md">
                <p className="font-semibold text-gray-700">Package:</p>
                <p className="text-secondary-dark">{trackedBookingDetails.selectedPackage?.name}</p>
              </div>
              <div className="bg-light-gray p-4 rounded-md">
                <p className="font-semibold text-gray-700">Total Price:</p>
                <p className="text-secondary-dark">${trackedBookingDetails.totalPrice.toFixed(2)}</p>
              </div>
              <div className="bg-light-gray p-4 rounded-md col-span-1 md:col-span-2">
                <p className="font-semibold text-gray-700">Pickup Address:</p>
                <p className="text-secondary-dark">{trackedBookingDetails.pickupAddress}</p>
              </div>
              {trackedBookingDetails.serviceType === 'delivery' && (
                <div className="bg-light-gray p-4 rounded-md col-span-1 md:col-span-2">
                  <p className="font-semibold text-gray-700">Delivery Address:</p>
                  <p className="text-secondary-dark">{trackedBookingDetails.deliveryAddress}</p>
                </div>
              )}
              <div className="bg-light-gray p-4 rounded-md">
                <p className="font-semibold text-gray-700">Requested Date:</p>
                <p className="text-secondary-dark">{trackedBookingDetails.dateRequested}</p>
              </div>
              <div className="bg-light-gray p-4 rounded-md">
                <p className="font-semibold text-gray-700">Time Window:</p>
                <p className="text-secondary-dark">{trackedBookingDetails.timeWindow}</p>
              </div>
              <div className="bg-light-gray p-4 rounded-md">
                <p className="font-semibold text-gray-700">Customer Email:</p>
                <p className="text-secondary-dark">{trackedBookingDetails.customerEmail}</p>
              </div>
              <div className="bg-light-gray p-4 rounded-md">
                <p className="font-semibold text-gray-700">Customer Phone:</p>
                <p className="text-secondary-dark">{trackedBookingDetails.customerPhone}</p>
              </div>
            </div>

            {trackedBookingDetails.selectedAddOns.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="font-semibold text-secondary-dark mb-2">Selected Add-Ons:</p>
                <ul className="list-disc list-inside text-gray-700 ml-4">
                  {trackedBookingDetails.selectedAddOns.map(addOn => (
                    <li key={addOn.id}>
                      {addOn.name} {addOn.quantity ? `(x${addOn.quantity})` : ''} {addOn.option ? `(${addOn.option})` : ''}: +${addOn.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {proofOfDelivery?.photoUrls && proofOfDelivery.photoUrls.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="font-semibold text-secondary-dark mb-2">Proof Photos:</p>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {proofOfDelivery.photoUrls.map((url, index) => (
                    <img key={index} src={url} alt={`Proof ${index + 1}`} className="w-full h-40 object-cover rounded-md shadow-sm" />
                  ))}
                </div>
              </div>
            )}

            {proofOfDelivery?.driverLocation && (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="font-semibold text-secondary-dark">Driver Last Known Location:</p>
                <p className="text-sm text-gray-600 ml-4">Lat: {proofOfDelivery.driverLocation.latitude.toFixed(4)}, Lng: {proofOfDelivery.driverLocation.longitude.toFixed(4)} at {new Date(proofOfDelivery.driverLocation.timestamp).toLocaleTimeString()}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <button
                onClick={() => handleResendEmail(trackedBookingDetails)}
                className="bg-primary-blue text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg"
              >
                Resend Confirmation Email
              </button>
              <button
                onClick={() => handleResendSMS(trackedBookingDetails)}
                className="bg-accent-green text-white px-6 py-3 rounded-md font-semibold hover:bg-green-600 transition-colors duration-300 shadow-lg"
              >
                Resend Confirmation SMS
              </button>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => onNavigate(Page.HOME)}
                className="bg-gray-500 text-white px-8 py-4 rounded-md text-xl font-semibold hover:bg-gray-600 transition-colors duration-300 shadow-lg"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;