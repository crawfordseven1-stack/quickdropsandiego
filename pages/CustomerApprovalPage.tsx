// pages/CustomerApprovalPage.tsx
import React, { useState, useEffect } from 'react';
import { Page, ProofOfDelivery, JobStatus, BookingDetails } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

interface CustomerApprovalPageProps {
  onNavigate: (page: Page) => void;
  bookingIdParam?: string; // Passed via simulated unique link
}

const CustomerApprovalPage: React.FC<CustomerApprovalPageProps> = ({ onNavigate, bookingIdParam }) => {
  const [bookingId, setBookingId] = useState('');
  const [pod, setPod] = useState<ProofOfDelivery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bookingIdFromUrl = params.get('bookingId') || params.get('token'); // support token later
    if (bookingIdFromUrl) {
      setBookingId(bookingIdFromUrl);
    } else if (bookingIdParam) {
      setBookingId(bookingIdParam);
    } else {
      setIsLoading(false);
    }
  }, [bookingIdParam]);

  useEffect(() => {
    const fetchPodDetails = async () => {
      if (!bookingId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      // Simulate fetching POD from local storage (would be a backend call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      const storedPod = localStorage.getItem(`pod_${bookingId}`);
      if (storedPod) {
        setPod(JSON.parse(storedPod));
      }
      setIsLoading(false);
    };

    fetchPodDetails();
  }, [bookingId]);

  const handleCustomerApproval = async (approved: boolean) => {
    if (!pod) return;

    setIsProcessing(true);
    // Simulate backend update
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (approved) {
      const updatedPod: ProofOfDelivery = {
        ...pod,
        customerApproved: true,
        approvalTimestamp: new Date().toISOString(),
      };
      setPod(updatedPod);
      localStorage.setItem(`pod_${bookingId}`, JSON.stringify(updatedPod));

      const bookingDataRaw = localStorage.getItem(`booking_${bookingId}`);
      if(bookingDataRaw) {
        const bookingData: BookingDetails = JSON.parse(bookingDataRaw);
        bookingData.jobStatus = JobStatus.COMPLETED;
        localStorage.setItem(`booking_${bookingId}`, JSON.stringify(bookingData));
      }

      setModalMessage("Thank you for confirming! Your job is now officially completed. No refunds on completed jobs.");
      setIsModalOpen(true);
    } else {
      // Handle dispute
      setIsDisputeModalOpen(true);
    }
    setIsProcessing(false);
  };

  const submitDispute = async () => {
    if (!pod) return;
    if (!disputeReason.trim()) {
      alert("Please provide a reason for the dispute.");
      return;
    }

    setIsProcessing(true);
    // Simulate backend update for dispute
    await new Promise(resolve => setTimeout(resolve, 1500));

    const updatedPod: ProofOfDelivery = {
      ...pod,
      customerApproved: false, // Explicitly mark as not approved
    };
    setPod(updatedPod);
    localStorage.setItem(`pod_${bookingId}`, JSON.stringify(updatedPod));

    const bookingDataRaw = localStorage.getItem(`booking_${bookingId}`);
    if(bookingDataRaw) {
        const bookingData: BookingDetails = JSON.parse(bookingDataRaw);
        bookingData.jobStatus = JobStatus.DISPUTED;
        localStorage.setItem(`booking_${bookingId}`, JSON.stringify(bookingData));
    }
    
    setModalMessage("Your dispute has been recorded. A QuickDrop SD supervisor will contact you shortly to resolve the issue.");
    setIsModalOpen(true);
    setIsDisputeModalOpen(false);
    setDisputeReason('');
    setIsProcessing(false);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading job details..." />;
  }

  if (!bookingId) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-secondary-dark mb-4">Invalid or missing Booking ID.</h2>
        <p className="text-gray-700 mb-6">Please ensure you're using the correct link provided for customer approval.</p>
      </div>
    );
  }

  if (!pod) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-secondary-dark mb-4">Job details not found for Booking ID: {bookingId}.</h2>
        <p className="text-gray-700 mb-6">Please contact QuickDrop SD support if you believe this is an error.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h2 className="text-3xl font-bold text-secondary-dark mb-8 text-center">Customer Job Approval</h2>
      <p className="text-lg text-gray-700 mb-6 text-center">Review the service provided for Booking ID: <span className="font-bold text-primary-blue">{bookingId}</span></p>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        <h3 className="text-2xl font-semibold text-secondary-dark mb-4">Proof of Delivery</h3>

        {pod.photoUrls && pod.photoUrls.length > 0 && (
          <div className="mb-4">
            <p className="font-medium text-gray-700 mb-2">Proof Photos:</p>
            <div className="grid grid-cols-2 gap-4">
              {pod.photoUrls.map((url, index) => (
                <img key={index} src={url} alt={`Proof ${index + 1}`} className="w-full h-40 object-cover rounded-md shadow-sm" />
              ))}
            </div>
          </div>
        )}

        {pod.driverLocation && (
          <div className="mb-4">
            <p className="font-medium text-gray-700">Driver Confirmation:</p>
            <p className="text-sm text-gray-600 ml-4">Driver confirmed at Lat: {pod.driverLocation.latitude.toFixed(4)}, Lng: {pod.driverLocation.longitude.toFixed(4)} on {new Date(pod.driverLocation.timestamp).toLocaleString()}</p>
          </div>
        )}

        {pod.customerApproved ? (
          <p className="text-accent-green text-xl font-bold mt-6 text-center">✅ Job Already Approved!</p>
        ) : (
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => handleCustomerApproval(true)}
              disabled={isProcessing}
              className={`
                flex-1 py-3 rounded-md text-xl font-bold transition-colors duration-300
                ${isProcessing
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-accent-green text-white hover:bg-green-600 shadow-lg'
                }
              `}
            >
              {isProcessing ? <LoadingSpinner message="Approving..." /> : "I Approve: Delivery Completed"}
            </button>
            <button
              onClick={() => handleCustomerApproval(false)}
              disabled={isProcessing}
              className={`
                flex-1 py-3 rounded-md text-xl font-bold transition-colors duration-300
                ${isProcessing
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-accent-red text-white hover:bg-red-600 shadow-lg'
                }
              `}
            >
              Dispute Completion
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => onNavigate(Page.HOME)} title="Job Status">
        <p className="text-gray-700 mb-6">{modalMessage}</p>
        <button onClick={() => onNavigate(Page.HOME)} className="w-full bg-primary-blue text-white py-2 rounded-md hover:bg-blue-700">
          Done
        </button>
      </Modal>

      <Modal isOpen={isDisputeModalOpen} onClose={() => setIsDisputeModalOpen(false)} title="Dispute Job Completion">
        <p className="text-gray-700 mb-4">Please provide a brief reason for disputing the job completion:</p>
        <textarea
          value={disputeReason}
          onChange={(e) => setDisputeReason(e.target.value)}
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue mb-4"
          placeholder="e.g., Damaged item, Assembly incomplete, Missing parts..."
        ></textarea>
        <div className="flex justify-end space-x-4">
          <button onClick={() => setIsDisputeModalOpen(false)} className="bg-gray-300 text-secondary-dark px-4 py-2 rounded-md hover:bg-gray-400">
            Cancel
          </button>
          <button onClick={submitDispute} disabled={isProcessing || !disputeReason.trim()} className="bg-accent-red text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50">
            Submit Dispute
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerApprovalPage;