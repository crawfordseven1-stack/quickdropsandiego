// App.tsx
import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';
import DriverApprovalPage from './pages/DriverApprovalPage';
import CustomerApprovalPage from './pages/CustomerApprovalPage';
import HowItWorksPage from './pages/HowItWorksPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import ContactPage from './pages/ContactPage';
import CancellationPolicyPage from './pages/CancellationPolicyPage'; // New import
import RefundPolicyPage from './pages/RefundPolicyPage';         // New import
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';        // New import
import { BookingProvider } from './context/BookingContext';
import { Page } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [dynamicBookingId, setDynamicBookingId] = useState<string | undefined>(undefined);

  const handleNavigate = (page: Page, bookingId?: string) => {
    setCurrentPage(page);
    if (bookingId) {
      setDynamicBookingId(bookingId);
    } else {
      setDynamicBookingId(undefined);
    }
    window.scrollTo(0, 0); // Scroll to top on navigation
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME:
        return <HomePage onNavigate={handleNavigate} />;
      case Page.CHECKOUT:
        return <CheckoutPage onNavigate={handleNavigate} />;
      case Page.DRIVER_APPROVAL:
        return <DriverApprovalPage onNavigate={handleNavigate} bookingIdParam={dynamicBookingId} />;
      case Page.CUSTOMER_APPROVAL:
        return <CustomerApprovalPage onNavigate={handleNavigate} bookingIdParam={dynamicBookingId} />;
      case Page.HOW_IT_WORKS:
        return <HowItWorksPage onNavigate={handleNavigate} />;
      case Page.TERMS_OF_SERVICE:
        return <TermsOfServicePage onNavigate={handleNavigate} />;
      case Page.ORDER_TRACKING:
        return <OrderTrackingPage onNavigate={handleNavigate} />;
      case Page.CONTACT:
        return <ContactPage onNavigate={handleNavigate} />;
      case Page.CANCELLATION_POLICY_PAGE: // New case
        return <CancellationPolicyPage onNavigate={handleNavigate} />;
      case Page.REFUND_POLICY_PAGE:       // New case
        return <RefundPolicyPage onNavigate={handleNavigate} />;
      case Page.PRIVACY_POLICY_PAGE:      // New case
        return <PrivacyPolicyPage onNavigate={handleNavigate} />;
      default:
        return (
          <div className="container mx-auto px-4 py-16 text-center">
            <h2 className="text-4xl font-bold text-secondary-dark mb-4">404 - Page Not Found</h2>
            <p className="text-lg text-gray-700 mb-8">The page you are looking for does not exist.</p>
            <button
              onClick={() => handleNavigate(Page.HOME)}
              className="bg-primary-blue text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Go to Home Page
            </button>
          </div>
        );
    }
  };

  return (
    <BookingProvider>
      <div className="min-h-screen flex flex-col">
        <Header onNavigate={handleNavigate} />
        <main className="flex-grow pb-24"> {/* Added padding-bottom to avoid overlap with sticky bar */}
          {renderPage()}
        </main>
        <Footer onNavigate={handleNavigate} />
      </div>
    </BookingProvider>
  );
}

export default App;