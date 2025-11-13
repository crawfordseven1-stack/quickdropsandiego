import React from 'react';
import { Page } from '../types';
import { CONTACT_EMAIL, CONTACT_PHONE, APP_WEBSITE } from '../constants';

interface ContactPageProps {
  onNavigate: (page: Page) => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h2 className="text-4xl font-extrabold text-secondary-dark mb-10 text-center leading-tight">
        Contact <span className="text-primary-blue">QuickDrop SD</span>
      </h2>

      <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl mx-auto">
        Have questions or need assistance? Reach out to us using the contact information below. We're here to help!
      </p>

      <div className="bg-white p-8 rounded-lg shadow-xl mb-8 border border-gray-200 text-center">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-primary-blue mb-3">Get in Touch</h3>
          <p className="text-gray-700 text-lg mb-2">
            <strong>Phone:</strong> <a href={`tel:${CONTACT_PHONE}`} className="text-primary-blue hover:underline">{CONTACT_PHONE}</a>
          </p>
          <p className="text-gray-700 text-lg">
            <strong>Email:</strong> <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary-blue hover:underline">{CONTACT_EMAIL}</a>
          </p>
        </div>

        <div className="mb-6 border-t border-gray-200 pt-6">
          <h3 className="text-2xl font-bold text-primary-blue mb-3">Our Website</h3>
          <p className="text-gray-700 text-lg">
            Visit our website for more information: <a href={`https://${APP_WEBSITE}`} target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:underline">{APP_WEBSITE}</a>
          </p>
        </div>

        <p className="text-md text-gray-600 mt-6">
          Our team is available to assist you during business hours.
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

export default ContactPage;