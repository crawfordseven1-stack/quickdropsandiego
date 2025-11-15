// pages/DriverApprovalPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Page, JobStatus, ProofOfDelivery } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { useBooking } from '../context/BookingContext'; // Only for simulated context, not real

interface DriverApprovalPageProps {
  onNavigate: (page: Page) => void;
  bookingIdParam?: string; // For direct access via a simulated link
}

const DriverApprovalPage: React.FC<DriverApprovalPageProps> = ({ onNavigate, bookingIdParam }) => {
  const { updateBookingDetails } = useBooking(); // Using bookingDetails for basic info here
  const [bookingId, setBookingId] = useState('');
  const [isJobFound, setIsJobFound] = useState(false);
  const [proofPhotos, setProofPhotos] = useState<File[]>([]);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [driverLocation, setDriverLocation] = useState<{ latitude: number; longitude: number; timestamp: string } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bookingIdFromUrl = params.get('bookingId') || params.get('token'); // support token later
    if (bookingIdFromUrl) {
      setBookingId(bookingIdFromUrl);
    } else if (bookingIdParam) {
      setBookingId(bookingIdParam);
    }
  }, [bookingIdParam]);

  useEffect(() => {
    if (bookingId) {
        // For demo, we check localStorage. A real app would fetch from a backend.
        const storedBooking = localStorage.getItem(`booking_${bookingId}`);
        if (storedBooking) {
            setIsJobFound(true);
        } else {
            setIsJobFound(false);
        }
    } else {
        setIsJobFound(false);
    }
  }, [bookingId]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProofPhotos(Array.from(e.target.files));
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      lastPoint.current = { x: clientX - rect.left, y: clientY - rect.top };
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && lastPoint.current) {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const currentPoint = { x: clientX - rect.left, y: clientY - rect.top };

      ctx.beginPath();
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.stroke();
      lastPoint.current = currentPoint;
    }
  };

  const endDrawing = () => {
    isDrawing.current = false;
    lastPoint.current = null;
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureImage(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureImage(null);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDriverLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date().toISOString(),
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get current location. Please ensure location services are enabled.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleDriverConfirmCompletion = async () => {
    if (!bookingId) {
      alert("Please enter a booking ID.");
      return;
    }
    if (proofPhotos.length === 0) {
      alert("Please upload at least one proof photo.");
      return;
    }
    if (!signatureImage) {
      alert("Customer signature is required.");
      return;
    }
    if (!driverLocation) {
      alert("Driver location is required. Please click 'Capture Location'.");
      return;
    }

    setIsProcessing(true);
    // Simulate backend call to update POD
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real app, upload images and signature, get URLs
    const simulatedPhotoUrls = proofPhotos.map((_, i) => `https://picsum.photos/400/300?random=${Date.now() + i}`);
    const simulatedSignatureUrl = "https://example.com/driver-signature.png"; // Placeholder

    const newProofOfDelivery: ProofOfDelivery = {
      bookingId: bookingId,
      driverApproved: true,
      customerApproved: false, // Customer still needs to approve
      driverSignatureUrl: simulatedSignatureUrl,
      customerSignatureUrl: undefined,
      photoUrls: simulatedPhotoUrls,
      approvalTimestamp: undefined,
      driverLocation: driverLocation,
    };

    // Update booking state in localStorage (simulated)
    const bookingDataRaw = localStorage.getItem(`booking_${bookingId}`);
    if (bookingDataRaw) {
        const bookingData = JSON.parse(bookingDataRaw);
        bookingData.jobStatus = JobStatus.DRIVER_APPROVED;
        localStorage.setItem(`booking_${bookingId}`, JSON.stringify(bookingData));
    }
    
    localStorage.setItem(`pod_${bookingId}`, JSON.stringify(newProofOfDelivery));

    setIsProcessing(false);
    alert("Driver approval recorded! Customer will be notified for final approval.");
    onNavigate(Page.HOME); // Or to a driver dashboard
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h2 className="text-3xl font-bold text-secondary-dark mb-8 text-center">Driver Job Completion</h2>

      {!isJobFound && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <label htmlFor="bookingId" className="block text-sm font-medium text-gray-700 mb-2">Enter Booking ID</label>
          <input
            type="text"
            id="bookingId"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue"
          />
          <p className="mt-4 text-sm text-gray-500">
            For demonstration, use the Booking ID from a completed checkout.
          </p>
        </div>
      )}

      {isJobFound && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg font-semibold mb-4">Confirming completion for Booking ID: <span className="text-primary-blue">{bookingId}</span></p>

          <div className="mb-6">
            <label htmlFor="proofPhotos" className="block text-sm font-medium text-gray-700 mb-2">Mandatory Proof Photos (at least 1)</label>
            <input
              type="file"
              id="proofPhotos"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-blue file:text-white hover:file:bg-blue-700"
            />
            {proofPhotos.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {proofPhotos.map((file, index) => (
                  <img key={index} src={URL.createObjectURL(file)} alt={`Proof ${index + 1}`} className="w-full h-auto rounded-md object-cover" />
                ))}
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Signature</label>
            <div className="border border-gray-300 rounded-md overflow-hidden bg-light-gray">
              <canvas
                ref={canvasRef}
                width={400}
                height={150}
                className="w-full bg-white cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={endDrawing}
              ></canvas>
            </div>
            <button onClick={clearSignature} className="mt-2 text-sm text-primary-blue hover:underline">Clear Signature</button>
            {signatureImage && <img src={signatureImage} alt="Customer Signature Preview" className="mt-2 w-32 h-auto" />}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Driver Location & Time</label>
            <button
              onClick={getLocation}
              disabled={isProcessing}
              className="bg-gray-200 text-secondary-dark px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              {driverLocation ? "Location Captured!" : "Capture Location"}
            </button>
            {driverLocation && (
              <p className="mt-2 text-sm text-gray-700">
                Lat: {driverLocation.latitude.toFixed(4)}, Lng: {driverLocation.longitude.toFixed(4)} at {new Date(driverLocation.timestamp).toLocaleTimeString()}
              </p>
            )}
          </div>

          <button
            onClick={handleDriverConfirmCompletion}
            disabled={isProcessing || proofPhotos.length === 0 || !signatureImage || !driverLocation}
            className={`
              w-full py-3 rounded-md text-xl font-bold transition-colors duration-300
              ${isProcessing || !isJobFound || proofPhotos.length === 0 || !signatureImage || !driverLocation
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-accent-green text-white hover:bg-green-600 shadow-lg'
              }
            `}
          >
            {isProcessing ? <LoadingSpinner message="Submitting..." /> : "Job Completed (Driver Approval)"}
          </button>
        </div>
      )}
    </div>
  );
};

export default DriverApprovalPage;