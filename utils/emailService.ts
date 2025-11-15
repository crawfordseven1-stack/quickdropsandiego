// utils/emailService.ts
import { BookingDetails, PickupLocationType, ServiceType, Page } from '../types'; // Fix: Import Page
import { CONTACT_EMAIL, CONTACT_PHONE, APP_WEBSITE } from '../constants'; // Import CONTACT_PHONE and APP_WEBSITE

/**
 * Simulates sending a booking confirmation email.
 * In a real application, this would involve an API call to a backend email service.
 */
export const sendBookingConfirmationEmail = (details: BookingDetails) => {
  if (!details.customerEmail || !details.bookingId) {
    console.warn("Skipping email send: Missing customer email or booking ID.");
    return;
  }

  const subject = `QuickDrop SD Booking Confirmation - Tracking Number: ${details.bookingId}`;
  const addOnsSummary = details.selectedAddOns.length > 0
    ? `\n  Add-Ons:\n${details.selectedAddOns.map(ao => `    - ${ao.name} ${ao.quantity ? `(x${ao.quantity})` : ''}${ao.option ? ` (${ao.option})` : ''}: +$${ao.price.toFixed(2)}`).join('\n')}`
    : '\n  Add-Ons: None';

  const deliveryBody = `
Pickup Address: ${details.pickupAddress}
Delivery Address: ${details.deliveryAddress}
Requested Date: ${details.dateRequested}
Time Window: ${details.timeWindow}

Pickup Location Type: ${details.pickupLocationType}
${details.pickupLocationType === PickupLocationType.STORE_RETAILER ? `Store Name: ${details.storeName}\n` : ''}
Order Status: ${details.orderPaymentStatus}
Order Confirmation Name: ${details.orderConfirmationName}
Order/Receipt Number: ${details.orderReceiptNumber}
Recipient Name: ${details.recipientName}
`;

  const removalBody = `
Removal Address: ${details.pickupAddress}
Requested Date: ${details.dateRequested}
Time Window: ${details.timeWindow}
Primary Contact Name: ${details.recipientName}
`;

  const emailBody = `
Dear Customer,

Thank you for your booking with QuickDrop SD!

Your ${details.serviceType} service is confirmed.

Booking ID (Tracking Number): ${details.bookingId}
Total Price Paid: $${details.totalPrice.toFixed(2)}

---
**Booking Summary**
Service Type: ${details.serviceType.charAt(0).toUpperCase() + details.serviceType.slice(1)}
Package: ${details.selectedPackage?.name} - $${details.selectedPackage?.basePrice.toFixed(2)}
${addOnsSummary}

${details.serviceType === ServiceType.DELIVERY ? deliveryBody : removalBody}

Items to be ${details.serviceType === ServiceType.DELIVERY ? 'Delivered' : 'Removed'}:
${details.bookingItems.length > 0 ? details.bookingItems.map(item => `  - ${item.name}${item.color ? ` (${item.color})` : ''}${item.size ? `, ${item.size}` : ''}${item.description ? ` - ${item.description}` : ''}`).join('\n') : '  No specific items listed.'}

---

We will notify you with further updates as your job progresses.
You can track your order at any time using your Tracking Number (${details.bookingId}) on our website: https://${APP_WEBSITE}/#${Page.ORDER_TRACKING}

If you have any questions, please contact us.

Sincerely,
The QuickDrop SD Team
Phone: ${CONTACT_PHONE}
Email: ${CONTACT_EMAIL}
`;

  console.log(`--- SIMULATED EMAIL SENT ---`);
  console.log(`To: ${details.customerEmail}`);
  console.log(`BCC: ${CONTACT_EMAIL}`); // Simulated BCC to QuickDrop SD
  console.log(`Subject: ${subject}`);
  console.log(emailBody);
  console.log(`--- END SIMULATED EMAIL ---`);
};


/**
 * Simulates sending an SMS confirmation.
 * In a real application, this would involve an API call to an SMS gateway.
 */
export const sendBookingConfirmationSMS = (customerPhone: string, bookingId: string) => {
  if (!customerPhone || !bookingId) {
    console.warn("Skipping SMS send: Missing customer phone or booking ID.");
    return;
  }

  // Fix: Use Page.ORDER_TRACKING instead of ServiceType.ORDER_TRACKING
  const smsMessage = `QuickDrop SD: Your booking ${bookingId} is confirmed! Track it at https://${APP_WEBSITE}/#${Page.ORDER_TRACKING}. Contact us: ${CONTACT_PHONE}`;

  console.log(`--- SIMULATED SMS SENT ---`);
  console.log(`To: ${customerPhone}`);
  console.log(`Message: ${smsMessage}`);
  console.log(`--- END SIMULATED SMS ---`);
};