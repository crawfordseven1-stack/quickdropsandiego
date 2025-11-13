// components/Footer.tsx
import React from 'react';
import { APP_WEBSITE, CONTACT_PHONE, CONTACT_EMAIL, CANCELLATION_POLICY, REFUND_POLICY } from '../constants';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-secondary-dark text-white py-8 mt-12">
      <div className="container mx-auto px-4 text-center md:flex md:justify-between md:items-center">
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-semibold mb-2">QuickDrop SD</h3>
          <p className="text-sm">Fast Furniture Delivery & Assembly</p>
          <p className="text-sm">{APP_WEBSITE}</p>
        </div>

        <div className="mb-6 md:mb-0">
          <h4 className="text-lg font-semibold mb-2">Contact Us</h4>
          <p className="text-sm">Phone: <a href={`tel:${CONTACT_PHONE}`} className="hover:underline">{CONTACT_PHONE}</a></p>
          <p className="text-sm">Email: <a href={`mailto:${CONTACT_EMAIL}`} className="hover:underline">{CONTACT_EMAIL}</a></p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2">Policies</h4>
          <ul className="text-sm space-y-1">
            <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate(Page.CANCELLATION_POLICY_PAGE); }} className="hover:underline">Cancellation Policy</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate(Page.REFUND_POLICY_PAGE); }} className="hover:underline">Refund Policy</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate(Page.TERMS_OF_SERVICE); }} className="hover:underline">Terms of Service</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate(Page.PRIVACY_POLICY_PAGE); }} className="hover:underline">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 pt-6 border-t border-gray-700 text-sm text-gray-400 text-center">
        &copy; {new Date().getFullYear()} {APP_WEBSITE}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;