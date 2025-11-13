// constants.ts
import { AddOn, Package } from './types';

export const APP_NAME = "QuickDrop SD";
export const APP_WEBSITE = "quickdropsd.work";
export const CONTACT_PHONE = "(619) 365-5936";
export const CONTACT_EMAIL = "quickdropsd@gmail.com";

export const PACKAGES: Package[] = [
  {
    name: "Small Package",
    basePrice: 65,
    description: "Best for single chairs, small desks. (Delivery only. Assembly available as an add on)",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 mx-auto text-primary-blue">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m12 4.5V16.5m4.5-1.625l-.375-.375M21 14.25V16.5m0 0h-3.375m0 0l-.375.375m0 0H16.5m3-4.5H18m-9-1.5H5.625c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V7.5a1.125 1.125 0 0 0-1.125-1.125H9.375z" />
          </svg>`
  },
  {
    name: "Medium Package",
    basePrice: 110,
    description: "Best for standard bookcases, medium dining sets. (Delivery only. Assembly available as an add on)",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 mx-auto text-primary-blue">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375A1.125 1.125 0 0 1 2.25 17.625V14.25m12 4.5V16.5m4.5-1.625l-.375-.375M21 14.25V16.5m0 0h-3.375m0 0l-.375.375m0 0H16.5m3-4.5H18m-9-1.5H5.625c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V7.5a1.125 1.125 0 0 0-1.125-1.125H9.375z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75V21a.75.75 0 0 0 .75.75h.75A.75.75 0 0 0 13.5 21v-2.25" />
          </svg>`
  },
  {
    name: "Large Package",
    basePrice: 160,
    description: "Best for large sectionals, bedroom sets. (Delivery only. Assembly available as an add on)",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 mx-auto text-primary-blue">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375A1.125 1.125 0 0 1 2.25 17.625V14.25m12 4.5V16.5m4.5-1.625l-.375-.375M21 14.25V16.5m0 0h-3.375m0 0l-.375.375m0 0H16.5m3-4.5H18m-9-1.5H5.625c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V7.5a1.125 1.125 0 0 0-1.125-1.125H9.375z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75V21a.75.75 0 0 0 .75.75h.75A.75.75 0 0 0 13.5 21v-2.25M15 18.75v2.25a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-2.25M9 18.75v2.25a.75.75 0 0 0 .75.75h.75a.75.75 0 0 0 .75-.75v-2.25" />
          </svg>`
  },
  {
    name: "Premium Package",
    basePrice: 220,
    description: "Best for heavy, complex, oversized items. (Delivery only. Assembly available as an add on)",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 mx-auto text-primary-blue">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375A1.125 1.125 0 0 1 2.25 17.625V14.25m12 4.5V16.5m4.5-1.625l-.375-.375M21 14.25V16.5m0 0h-3.375m0 0l-.375.375m0 0H16.5m3-4.5H18m-9-1.5H5.625c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V7.5a1.125 1.125 0 0 0-1.125-1.125H9.375z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75V21a.75.75 0 0 0 .75.75h.75A.75.75 0 0 0 13.5 21v-2.25M15 18.75v2.25a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-2.25M9 18.75v2.25a.75.75 0 0 0 .75.75h.75a.75.75 0 0 0 .75-.75v-2.25M6 18.75v2.25a.75.75 0 0 0 .75.75h.75a.75.75 0 0 0 .75-.75v-2.25M18 18.75v2.25a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-2.25" />
          </svg>`
  },
];

export const ADD_ONS: AddOn[] = [
  {
    id: "rush-delivery",
    name: "Rush Delivery",
    basePrice: 0, // Price determined by dropdown option
    description: "Price varies based on required urgency.",
    type: "dropdown",
    options: [
      { value: "standard", label: "Standard (No Rush Fee)", price: 0 },
      { value: "next-day", label: "Next Day (+$30)", price: 30 },
      { value: "same-day", label: "Same Day (+$60)", price: 60 },
    ],
  },
  {
    id: "stair-fees",
    name: "Stair Fees",
    basePrice: 10, // Per extra flight
    description: "Fee applies per flight beyond the ground floor.",
    type: "input",
    maxQuantity: 10, // Max 10 extra flights
  },
  {
    id: "packaging-removal",
    name: "Packaging Removal",
    basePrice: [15, 25], // Price varies based on package size
    description: "Price varies based on the size of the package selected.",
    type: "toggle",
  },
  {
    id: "extra-stops",
    name: "Extra Stops",
    basePrice: 20, // Per stop
    description: "Price varies based on the number of additional stops.",
    type: "input",
    maxQuantity: 3, // Max 3 extra stops
  },
  {
    id: "after-hours-delivery",
    name: "After-Hours Delivery",
    basePrice: 25, // Flat fee, could be a range $25-$50 but simplified to $25 for now
    description: "Flat fee for service outside standard business hours.",
    type: "toggle",
  },
  {
    id: "old-furniture-removal",
    name: "Old Furniture Removal",
    basePrice: 0, // Upsell, custom pricing
    description: "Customers must be prompted with an upsell option for this service.",
    type: "upsell",
  },
];

export const CANCELLATION_POLICY = {
  title: "Cancellation Policy",
  details: [
    "24+ Hours Notice: 100% Refund (minus 3% processing fee).",
    "Less than 24 Hours: 50% Refund.",
    "At Arrival: 0% Refund.",
  ],
};

export const REFUND_POLICY = {
  title: "Refund Policy",
  details: [
    "No refunds on completed jobs.",
    "100% refund processed within 3-5 days if the job is not completed by QuickDrop SD.",
  ],
};

// Old Furniture Removal Upsell Options (for modal)
export const OLD_FURNITURE_REMOVAL_OPTIONS = [
  { label: "Small Item (e.g., Nightstand)", price: 30 },
  { label: "Medium Item (e.g., Small Chair)", price: 50 },
  { label: "Large Item (e.g., Dresser)", price: 80 },
  { label: "Oversized Item (e.g., Sofa)", price: 120 },
];

export const TIME_WINDOWS = [
  "8 AM - 12 PM",
  "12 PM - 4 PM",
  "4 PM - 8 PM",
];

export const FAKE_STRIPE_PUBLIC_KEY = "pk_test_YOUR_STRIPE_PUBLIC_KEY"; // Placeholder
