// pages/HowItWorksPage.tsx
import React from 'react';
import { Page } from '../types';

interface HowItWorksPageProps {
  onNavigate: (page: Page) => void;
}

const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h2 className="text-4xl font-extrabold text-secondary-dark mb-10 text-center leading-tight">
        How It Works: The QuickDrop SD <span className="text-primary-blue">3-Step Process</span>
      </h2>

      <p className="text-lg text-gray-700 mb-12 text-center max-w-2xl mx-auto">
        At QuickDrop SD, we make furniture delivery and assembly simple, transparent, and fully accountable.
      </p>

      {/* Step 1 */}
      <div className="bg-white p-8 rounded-lg shadow-xl mb-10 flex flex-col md:flex-row items-center animate-fade-in-up">
        <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8 text-primary-blue">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-20 h-20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.15-4.659 3.14-7.005-.4-.148-.91-.293-1.403-.464M16.5 10.5V6.75M16.5 10.5h3.75M16.5 10.5L18 12m-3-10.5V7.5m0 0H7.757M15 7.5L13.5 9m-1.5-6h2.25m-2.25 0h-1.5V2.25m3.75 0v1.5m-4.5 9V9" />
          </svg>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-secondary-dark mb-4">
            <span className="text-primary-blue">1.</span> Choose Your Package & Customize
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-3 text-lg">
            <li>
              <span className="font-semibold">Transparent Pricing:</span> Select one of our <span className="font-bold">Delivery Packages</span> (Small, Medium, Large, Premium) right on the homepage, with all prices clearly displayed upfront.
            </li>
            <li>
              <span className="font-semibold">Customize:</span> Add optional services like <span className="font-bold">Assembly</span> (available as an add-on), <span className="font-bold">Rush Delivery</span>, <span className="font-bold">Stair Fees</span> ($10/flight), or the <span className="font-bold">Old Furniture Removal</span> upsell to perfectly match your needs.
            </li>
          </ul>
        </div>
      </div>

      {/* Step 2 */}
      <div className="bg-white p-8 rounded-lg shadow-xl mb-10 flex flex-col md:flex-row items-center animate-fade-in-up">
        <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8 text-accent-green">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-20 h-20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h8.25m-10.5 1.5H21a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 21 4.5H3.75A2.25 2.25 0 0 0 1.5 6.75v10.5A2.25 2.25 0 0 0 3.75 19.5Z" />
          </svg>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-secondary-dark mb-4">
            <span className="text-accent-green">2.</span> Secure Upfront Booking
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-3 text-lg">
            <li>
              <span className="font-semibold">Full Payment Required:</span> We use <span className="font-bold">Stripe</span> to process secure, full upfront payment. This locks in your service slot and price—no surprise charges on delivery day.
            </li>
            <li>
              <span className="font-semibold">Flexible Cancellation:</span> Review our clear <span className="font-bold">Cancellation Policy</span> (e.g., 100% refund with 24+ hours notice) before completing your booking.
            </li>
          </ul>
        </div>
      </div>

      {/* Step 3 */}
      <div className="bg-white p-8 rounded-lg shadow-xl mb-10 flex flex-col md:flex-row items-center animate-fade-in-up">
        <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8 text-primary-blue">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-20 h-20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.478-1.687 3.246A6.985 6.985 0 0 1 12 21a6.985 6.985 0 0 1-7.313-5.754C2.63 14.478 2 13.268 2 12c0-1.268.63-2.478 1.687-3.246A6.985 6.985 0 0 1 12 3a6.985 6.985 0 0 1 7.313 5.754C21.37 9.522 22 10.732 22 12Z" />
          </svg>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-secondary-dark mb-4">
            <span className="text-primary-blue">3.</span> Dual-Approval Delivery (POD)
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-3 text-lg">
            <li>
              <span className="font-semibold">Delivery & Assembly:</span> Our team arrives on schedule to complete your job according to the details of your booking.
            </li>
            <li>
              <span className="font-semibold">Job Confirmation:</span> We utilize a <span className="font-bold">Dual-Approval</span> system to ensure mutual satisfaction:
              <ul className="list-circle list-inside ml-6 mt-2 space-y-1">
                <li><span className="font-bold">Driver Approval:</span> Our driver confirms the job is done on their app, uploading mandatory photos and signatures.</li>
                <li><span className="font-bold">Customer Approval:</span> You, the customer, click <span className="font-bold text-accent-green">"Delivery Completed"</span> via a secure link to confirm you are satisfied with the service.</li>
              </ul>
            </li>
            <li>
              <span className="font-semibold">Final Policy:</span> The job is officially flagged as <span className="font-bold text-accent-green">Completed</span> only after both the driver and the customer have approved it, which then enforces our "No Refunds on Completed Jobs" policy.
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-12">
        <button
          onClick={() => onNavigate(Page.HOME)}
          className="bg-primary-blue text-white px-8 py-4 rounded-md text-xl font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg"
        >
          Book Your Service Now!
        </button>
      </div>
    </div>
  );
};

export default HowItWorksPage;