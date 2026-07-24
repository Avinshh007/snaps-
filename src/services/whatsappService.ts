import { Booking } from '../types';

const ADMIN_PHONE =
  (import.meta as any).env?.VITE_ADMIN_WHATSAPP_NUMBER ||
  (process.env as any)?.VITE_ADMIN_WHATSAPP_NUMBER ||
  '8247432669';

const COMPANY_NAME =
  (import.meta as any).env?.VITE_COMPANY_NAME ||
  (process.env as any)?.VITE_COMPANY_NAME ||
  'Snap Stories';

export class WhatsAppService {
  /**
   * Admin WhatsApp Message Template matching exact specs
   */
  static generateAdminMessage(booking: Booking): string {
    const loc = booking.eventLocation;
    const lat = loc?.latitude ? loc.latitude.toFixed(6) : '17.432500';
    const lng = loc?.longitude ? loc.longitude.toFixed(6) : '78.407100';
    const mapsUrl = loc?.googleMapsUrl || `https://www.google.com/maps?q=${lat},${lng}`;

    return `📢 NEW BOOKING REQUEST

Customer:
${booking.customerName}

Phone:
${booking.customerPhone}

Email:
${booking.customerEmail || 'Not Provided'}

Package:
${booking.duration || '4K Master Reel Coverage'}

Event:
${booking.eventType}

Date:
${booking.date}

Time:
${booking.slotLabel} (${booking.timeRange})

Venue:
${loc?.venueName || 'Selected Venue'}

Address:
${loc?.formattedAddress || 'Selected Address'}

Latitude:
${lat}

Longitude:
${lng}

Google Maps:
${mapsUrl}

Special Notes:
${booking.notes || 'None'}

Please contact the customer and confirm the booking.`;
  }

  /**
   * Customer WhatsApp Message Template matching exact specs
   */
  static generateCustomerMessage(booking: Booking): string {
    const loc = booking.eventLocation;

    return `Hello ${booking.customerName},

Thank you for choosing ${COMPANY_NAME}.

Your booking request has been received successfully.

Our team will contact you shortly to confirm your booking.

Booking Details

Event:
${booking.eventType}

Package:
${booking.duration || '4K Master Reel Coverage'}

Date:
${booking.date}

Venue:
${loc?.venueName || 'Selected Venue'}

Thank you for trusting ${COMPANY_NAME} ❤️

For any queries contact
${ADMIN_PHONE}`;
  }

  /**
   * Fallback browser deep-link launcher
   */
  static openWhatsAppLink(phone: string, text: string): boolean {
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
      const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
      const win = window.open(url, '_blank');
      return Boolean(win);
    } catch (e) {
      console.warn('WhatsApp link launch notice:', e);
      return false;
    }
  }
}
