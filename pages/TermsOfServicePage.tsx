// pages/TermsOfServicePage.tsx
import React from 'react';
import { Page } from '../types';

interface TermsOfServicePageProps {
  onNavigate: (page: Page) => void;
}

const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ onNavigate }) => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h2 className="text-4xl font-extrabold text-secondary-dark mb-10 text-center leading-tight">
        QuickDrop SD <span className="text-primary-blue">Terms of Service</span>
      </h2>

      <p className="text-lg text-gray-700 mb-8">
        Welcome to QuickDrop SD! These Terms of Service ("Terms") govern your use of the QuickDrop SD website and services. By accessing or using our services, you agree to be bound by these Terms.
      </p>

      {/* Section 1 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-bold text-primary-blue mb-4">1. Agreement to Terms</h3>
        <p className="text-gray-700 leading-relaxed">
          By using our services, you confirm that you have read, understood, and agree to be bound by these Terms, as well as our Privacy Policy and Cancellation/Refund Policies. If you do not agree with any part of these Terms, you must not use our services.
        </p>
      </div>

      {/* Section 2 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-bold text-primary-blue mb-4">2. Services Offered</h3>
        <p className="text-gray-700 leading-relaxed">
          QuickDrop SD provides furniture delivery and assembly services within the San Diego area. Our services include:
        </p>
        <ul className="list-disc list-inside text-gray-700 ml-4 mt-3 space-y-1">
          <li>Delivery of furniture from a specified pickup location to a delivery address.</li>
          <li>Assembly of furniture items, available as an add-on to delivery services.</li>
          <li>Optional add-on services such as rush delivery, stair fees, packaging removal, extra stops, after-hours delivery, and old furniture removal.</li>
        </ul>
      </div>

      {/* Section 3 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-bold text-primary-blue mb-4">3. Booking and Payment</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-3 leading-relaxed">
          <li>
            <span className="font-semibold">Upfront Pricing:</span> All service prices, including packages and add-ons, are displayed upfront. You agree to pay the total price calculated at checkout.
          </li>
          <li>
            <span className="font-semibold">Payment:</span> Full payment is required at the time of booking to secure your service. We use Stripe for secure payment processing.
          </li>
          <li>
            <span className="font-semibold">Cancellation and Refunds:</span> Our Cancellation Policy and Refund Policy are integral parts of these Terms. Please review them carefully before booking. Note that no refunds are issued for completed jobs.
          </li>
        </ul>
      </div>

      {/* Section 4 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-bold text-primary-blue mb-4">4. Proof of Delivery (POD)</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-3 leading-relaxed">
          <li>
            <span className="font-semibold">Dual-Approval System:</span> Services are considered completed only after both our driver and the customer (you) have approved the job through our digital Proof of Delivery system.
          </li>
          <li>
            <span className="font-semibold">Driver Approval:</span> Our driver will confirm job completion, upload photos, and obtain necessary signatures via their application.
          </li>
          <li>
            <span className="font-semibold">Customer Approval:</span> You will receive a secure link to review the job details and proof, and to provide your final approval. Your approval signifies satisfaction with the service.
          </li>
          <li>
            <span className="font-semibold">Disputes:</span> If you are not satisfied, you may dispute the completion before approving. A supervisor will then contact you to resolve the issue.
          </li>
        </ul>
      </div>

      {/* Section 5 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-bold text-primary-blue mb-4">5. Customer Responsibilities</h3>
        <p className="text-gray-700 leading-relaxed">
          As a customer, you are responsible for:
        </p>
        <ul className="list-disc list-inside text-gray-700 ml-4 mt-3 space-y-1">
          <li>Providing accurate pickup and delivery addresses.</li>
          <li>Ensuring accessibility for our team and vehicles at both locations.</li>
          <li>Being present or arranging for an authorized representative to be present during the agreed-upon time window.</li>
          <li>Inspecting furniture upon delivery and assembly before providing final approval.</li>
        </ul>
      </div>

      {/* Section 6 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-bold text-primary-blue mb-4">6. Limitation of Liability</h3>
        <p className="text-gray-700 leading-relaxed">
          QuickDrop SD will exercise reasonable care in providing its services. However, we are not liable for:
        </p>
        <ul className="list-disc list-inside text-gray-700 ml-4 mt-3 space-y-1">
          <li>Damages to items not directly caused by our negligence during handling or assembly.</li>
          <li>Damages resulting from pre-existing conditions of furniture or inadequate packaging.</li>
          <li>Loss or damage to property if access is unsafe or obstructed.</li>
          <li>Indirect, incidental, special, or consequential damages arising from the use of our services.</li>
        </ul>
      </div>

      {/* Section 7 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-bold text-primary-blue mb-4">7. Changes to Terms</h3>
        <p className="text-gray-700 leading-relaxed">
          QuickDrop SD reserves the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on our website. Your continued use of the services after such modifications constitutes your acceptance of the new Terms.
        </p>
      </div>

      <div className="text-center mt-12">
        <button
          onClick={() => onNavigate(Page.HOME)}
          className="bg-primary-blue text-white px-8 py-4 rounded-md text-xl font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default TermsOfServicePage;