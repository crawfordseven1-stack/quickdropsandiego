// pages/PrivacyPolicyPage.tsx
import React from 'react';
import { Page } from '../types';
import { APP_WEBSITE, CONTACT_EMAIL } from '../constants'; // Import CONTACT_EMAIL

interface PrivacyPolicyPageProps {
  onNavigate: (page: Page) => void;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h2 className="text-4xl font-extrabold text-secondary-dark mb-10 text-center leading-tight">
        QuickDrop SD <span className="text-primary-blue">Privacy Policy</span>
      </h2>

      <p className="text-lg text-gray-700 mb-8">
        Your privacy is important to us. This Privacy Policy describes how QuickDrop SD collects, uses, and shares your personal information.
      </p>

      {/* Section 1 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-bold text-primary-blue mb-4">1. Information We Collect</h3>
        <p className="text-gray-700 leading-relaxed">
          We collect information you provide directly to us when you use our services, such as when you book a delivery, create an account, or contact us. This may include your name, email address, phone number, physical addresses (pickup and delivery), and payment information. We also collect usage data (e.g., pages visited) and, with your permission, location data.
        </p>
      </div>

      {/* Section 2 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-bold text-primary-blue mb-4">2. How We Use Your Information</h3>
        <p className="text-gray-700 leading-relaxed">
          We use the information we collect to:
        </p>
        <ul className="list-disc list-inside text-gray-700 ml-4 mt-3 space-y-1">
          <li>Provide, maintain, and improve our services.</li>
          <li>Process your bookings and payments.</li>
          <li>Communicate with you about your bookings, services, and promotional offers.</li>
          <li>Monitor and analyze trends, usage, and activities in connection with our services.</li>
          <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities.</li>
        </ul>
      </div>

      {/* Section 3 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-bold text-primary-blue mb-4">3. Sharing Your Information</h3>
        <p className="text-gray-700 leading-relaxed">
          We may share your information with:
        </p>
        <ul className="list-disc list-inside text-gray-700 ml-4 mt-3 space-y-1">
          <li>Service providers who assist us in operating our business (e.g., payment processors, analytics providers).</li>
          <li>Law enforcement or other government agencies if required by law.</li>
          <li>Third parties in connection with a merger, acquisition, or sale of assets.</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mt-3">
          We do not sell your personal information to third parties for their direct marketing purposes without your explicit consent.
        </p>
      </div>

      {/* Section 4 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-bold text-primary-blue mb-4">4. Your Choices</h3>
        <p className="text-gray-700 leading-relaxed">
          You have certain choices regarding your personal information:
        </p>
        <ul className="list-disc list-inside text-gray-700 ml-4 mt-3 space-y-1">
          <li>You can update your account information through your profile settings (if applicable).</li>
          <li>You can opt out of receiving promotional emails from us by following the instructions in those emails.</li>
          <li>You can disable location services on your device to prevent us from collecting location information.</li>
        </ul>
      </div>

      {/* Section 5 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-bold text-primary-blue mb-4">5. Contact Us</h3>
        <p className="text-gray-700 leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us at <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary-blue hover:underline">{CONTACT_EMAIL}</a> or visit <a href={`https://${APP_WEBSITE}`} target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:underline">{APP_WEBSITE}</a>.
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

export default PrivacyPolicyPage;