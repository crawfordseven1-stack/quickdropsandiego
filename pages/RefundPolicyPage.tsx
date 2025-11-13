// pages/RefundPolicyPage.tsx
import React from 'react';
import { Page } from '../types';
import { REFUND_POLICY } from '../constants';

interface RefundPolicyPageProps {
  onNavigate: (page: Page) => void;
}

const RefundPolicyPage: React.FC<RefundPolicyPageProps> = ({ onNavigate }) => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h2 className="text-4xl font-extrabold text-secondary-dark mb-10 text-center leading-tight">
        QuickDrop SD <span className="text-primary-blue">Refund Policy</span>
      </h2>

      <p className="text-lg text-gray-700 mb-8">
        Our commitment is to provide excellent service. Please review our refund policy below:
      </p>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-bold text-primary-blue mb-4">{REFUND_POLICY.title}</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-3 leading-relaxed">
          {REFUND_POLICY.details.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <p className="font-bold text-accent-red mt-3 text-lg">⚠️ No refunds on completed jobs.</p>
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

export default RefundPolicyPage;