// types.ts

export enum Page {
  HOME = 'HOME',
  CHECKOUT = 'CHECKOUT',
  DRIVER_APPROVAL = 'DRIVER_APPROVAL',
  CUSTOMER_APPROVAL = 'CUSTOMER_APPROVAL',
  HOW_IT_WORKS = 'HOW_IT_WORKS',
  TERMS_OF_SERVICE = 'TERMS_OF_SERVICE',
  ORDER_TRACKING = 'ORDER_TRACKING',
  CONTACT = 'CONTACT',
  CANCELLATION_POLICY_PAGE = 'CANCELLATION_POLICY_PAGE', // New policy page
  REFUND_POLICY_PAGE = 'REFUND_POLICY_PAGE',         // New policy page
  PRIVACY_POLICY_PAGE = 'PRIVACY_POLICY_PAGE',        // New policy page
  NOT_FOUND = 'NOT_FOUND',
}

export enum ServiceType {
  DELIVERY = 'delivery',
  REMOVAL = 'removal',
}

export interface Package {
  name: string;
  basePrice: number;
  description: string;
  icon: string; // Tailwind class or SVG content
}

export interface AddOn {
  id: string;
  name: string;
  basePrice: number | [number, number]; // Fixed price or range for dynamic pricing
  description: string;
  type: 'toggle' | 'dropdown' | 'input' | 'upsell';
  options?: { value: string; label: string; price: number }[];
  maxQuantity?: number; // For input types like 'Stair Fees', 'Extra Stops'
  applicableServices?: ServiceType[]; // New field to specify which services this add-on applies to
}

export interface SelectedAddOn {
  id: string;
  name: string;
  price: number;
  quantity?: number; // For add-ons like stair fees, extra stops
  option?: string; // For dropdowns like rush delivery
}

export enum PickupLocationType {
  STORE_RETAILER = 'Store/Retailer',
  PRIVATE_RESIDENCE = 'Private Residence/Other',
}

export enum OrderPaymentStatus {
  NEEDS_PAYMENT = 'Needs to be Paid For',
  PRE_PAID = 'Pre-Paid (Only Pickup Required)',
}

export interface BookingItem {
  id: string; // Client-side unique ID for management
  name: string;
  color: string;
  size: string;
  description: string;
}

export interface BookingDetails {
  serviceType: ServiceType; // New field
  selectedPackage: Package | null;
  selectedAddOns: SelectedAddOn[];
  pickupAddress: string;
  deliveryAddress: string;
  dateRequested: string;
  timeWindow: string;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  jobStatus: JobStatus;
  bookingId?: string; // Generated after initial booking, used for POD
  customerSignature?: string; // Base64 image data for customer signature

  // New fields for 'Item & Pickup Details'
  pickupLocationType: PickupLocationType | null;
  storeName: string;
  orderPaymentStatus: OrderPaymentStatus | null;
  orderConfirmationName: string;
  orderReceiptNumber: string;
  recipientName: string;
  bookingItems: BookingItem[];
}

export enum PaymentStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  FAILED = 'Failed',
}

export enum JobStatus {
  SCHEDULED = 'Scheduled',
  IN_TRANSIT = 'In Transit',
  DRIVER_APPROVED = 'Driver Approved',
  CUSTOMER_APPROVED = 'Customer Approved',
  COMPLETED = 'Completed',
  DISPUTED = 'Disputed',
}

export interface ProofOfDelivery {
  bookingId: string;
  driverApproved: boolean;
  customerApproved: boolean;
  driverSignatureUrl?: string; // URL to uploaded driver signature
  customerSignatureUrl?: string; // URL to uploaded customer signature (or confirmation hash)
  photoUrls: string[]; // URLs to uploaded proof photos
  approvalTimestamp?: string; // ISO string
  driverLocation?: { latitude: number; longitude: number; timestamp: string };
}

/*
 * Backend Database Schema Update (Conceptual)
 *
 * UPDATE Bookings Table:
 *   ADD COLUMN service_type VARCHAR(50) NOT NULL DEFAULT 'delivery'; -- From ServiceType enum
 *   ADD COLUMN pickup_type VARCHAR(50);             -- From PickupLocationType enum
 *   ADD COLUMN store_name VARCHAR(255);             -- Required if pickup_type is 'Store/Retailer'
 *   ADD COLUMN payment_required BOOLEAN;            -- From OrderPaymentStatus enum
 *   ADD COLUMN order_confirmation_name VARCHAR(255);
 *   ADD COLUMN order_receipt_number VARCHAR(255);
 *   ADD COLUMN recipient_name VARCHAR(255);
 *
 * CREATE NEW BookingItems Table:
 *   booking_item_id UUID PRIMARY KEY;
 *   booking_id UUID NOT NULL;                      -- FOREIGN KEY REFERENCES Bookings(booking_id)
 *   item_name VARCHAR(255) NOT NULL;
 *   item_color VARCHAR(100);
 *   item_size VARCHAR(255);
 *   item_description TEXT;
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
 *   FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id) ON DELETE CASCADE;
 */