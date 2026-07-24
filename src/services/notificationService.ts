import { Booking } from '../types';

const ADMIN_WHATSAPP_NUMBER =
  (import.meta as any).env?.VITE_ADMIN_WHATSAPP_NUMBER ||
  (process.env as any)?.VITE_ADMIN_WHATSAPP_NUMBER ||
  '8247432669';

const COMPANY_NAME =
  (import.meta as any).env?.VITE_COMPANY_NAME ||
  (process.env as any)?.VITE_COMPANY_NAME ||
  'Snap Stories';

export class NotificationService {
  /**
   * Generates Customer WhatsApp Message matching exact prompt specifications
   */
  static generateCustomerMessage(booking: Booking): string {
    const loc = booking.eventLocation;
    const lat = loc?.latitude ? loc.latitude.toFixed(6) : '17.432500';
    const lng = loc?.longitude ? loc.longitude.toFixed(6) : '78.407100';
    const mapsUrl = loc?.googleMapsUrl || `https://www.google.com/maps?q=${lat},${lng}`;

    return `Hello ${booking.customerName},

Thank you for choosing ${COMPANY_NAME}.

Your booking has been successfully confirmed.

Booking ID:
${booking.bookingNumber}

Invoice Status:
✅ PAID

Package:
${booking.duration || '4K Master Reel Coverage'}

Event:
${booking.eventType}

Date:
${booking.date}

Time:
${booking.slotLabel} (${booking.timeRange})

Venue:
${loc?.venueName || 'Selected Event Venue'}

Location:
${loc?.formattedAddress || 'Selected Address'}

Google Maps:
${mapsUrl}

Invoice:
PDF generated and available for download on website

For any assistance contact:

📞 8247432669

We look forward to capturing your beautiful memories.`;
  }

  /**
   * Generates Admin WhatsApp Message matching exact prompt specifications
   */
  static generateAdminMessage(booking: Booking): string {
    const loc = booking.eventLocation;
    const lat = loc?.latitude ? loc.latitude.toFixed(6) : '17.432500';
    const lng = loc?.longitude ? loc.longitude.toFixed(6) : '78.407100';
    const mapsUrl = loc?.googleMapsUrl || `https://www.google.com/maps?q=${lat},${lng}`;

    return `📢 NEW BOOKING RECEIVED

Booking ID:
${booking.bookingNumber}

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
${loc?.venueName || 'Selected Event Venue'}

Complete Address:
${loc?.formattedAddress || 'Selected Address'}

Latitude:
${lat}

Longitude:
${lng}

Google Maps:
${mapsUrl}

Payment Status:
✅ PAID

Special Notes:
${booking.notes || 'None'}`;
  }

  /**
   * Dispatches WhatsApp deep link URL to open WhatsApp client
   */
  static sendWhatsAppDeepLink(phone: string, message: string): boolean {
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
      const encodedMsg = encodeURIComponent(message);
      const url = `https://wa.me/${formattedPhone}?text=${encodedMsg}`;
      const openedWindow = window.open(url, '_blank');
      return Boolean(openedWindow);
    } catch (err) {
      console.warn('WhatsApp notification error:', err);
      return false;
    }
  }

  /**
   * Trigger Customer Confirmation WhatsApp Notification
   */
  static sendCustomerNotification(booking: Booking): boolean {
    const message = this.generateCustomerMessage(booking);
    return this.sendWhatsAppDeepLink(booking.customerPhone, message);
  }

  /**
   * Trigger Admin / Owner Alert WhatsApp Notification (Default 8247432669)
   */
  static sendAdminNotification(booking: Booking): boolean {
    const message = this.generateAdminMessage(booking);
    return this.sendWhatsAppDeepLink(ADMIN_WHATSAPP_NUMBER, message);
  }
}
