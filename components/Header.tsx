// components/Header.tsx
import React from 'react';
import { APP_NAME, CONTACT_PHONE } from '../constants';
import { Page } from '../types';

interface HeaderProps {
  onNavigate: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <header className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary-blue cursor-pointer" onClick={(e) => { e.preventDefault(); onNavigate(Page.HOME); }}>
          {APP_NAME}
        </h1>
        <nav className="hidden md:flex space-x-6 items-center">
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(Page.HOME); }} className="text-secondary-dark hover:text-primary-blue transition-colors duration-200">Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(Page.HOW_IT_WORKS); }} className="text-secondary-dark hover:text-primary-blue transition-colors duration-200">How It Works</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(Page.ORDER_TRACKING); }} className="text-secondary-dark hover:text-primary-blue transition-colors duration-200">Track Order</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(Page.CONTACT); }} className="text-secondary-dark hover:text-primary-blue transition-colors duration-200">Contact</a>
          <span className="text-secondary-dark font-medium">{CONTACT_PHONE}</span>
          <button
            onClick={(e) => { e.preventDefault(); onNavigate(Page.HOME); }}
            className="bg-primary-blue text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-lg"
          >
            Book Now
          </button>
        </nav>
        {/* Mobile menu icon would go here */}
        <div className="md:hidden">
          <button className="text-secondary-dark focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;