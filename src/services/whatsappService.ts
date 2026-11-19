import type { Booking } from '../types';

const ADMIN_WHATSAPP_NUMBER = '918247432669';
const COMPANY_NAME = 'Snap Stories';
const MAX_MESSAGE_LENGTH = 1500;

function formatValue(value: string | number | undefined | null, fallback: string, maxLength: number): string {
  if (maxLength <= 0) return '';

  const text = String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\*/g, '').trim() || fallback;
  if (text.length <= maxLength) return text;
  if (maxLength <= 3) return text.slice(0, maxLength);
  return `${text.slice(0, maxLength - 3)}...`;
}

/** Frontend-only WhatsApp integration. The customer must tap Send in WhatsApp. */
export class WhatsAppService {
  static readonly ADMIN_PHONE = '+91 82474 32669';

  static buildAdminMessage(booking: Booking): string {
    const location = booking.eventLocation;
    const mapsUrl = location?.googleMapsUrl || (
      location && Number.isFinite(location.latitude) && Number.isFinite(location.longitude)
        ? `https://maps.google.com/?q=${location.latitude},${location.longitude}`
        : 'Not provided'
    );

    const time = [booking.slotLabel, booking.timeRange].filter(Boolean).join(' ');
    const lines = [
      `*NEW BOOKING REQUEST - ${COMPANY_NAME}*`,
      '',
      `*Booking ID:* ${formatValue(booking.bookingNumber, 'Not provided', 40)}`,
      `*Customer:* ${formatValue(booking.customerName, 'Not provided', 80)}`,
      `*Phone:* ${formatValue(booking.customerPhone, 'Not provided', 32)}`,
      `*Email:* ${formatValue(booking.customerEmail, 'Not provided', 100)}`,
      '',
      `*Event:* ${formatValue(booking.eventType, 'Not provided', 60)}`,
      `*Package:* ${formatValue(booking.duration, '4K Master Reel Coverage', 70)}`,
      `*Date:* ${formatValue(booking.date, 'Not provided', 20)}`,
      `*Time:* ${formatValue(time, 'Not provided', 60)}`,
      `*Guests:* ${formatValue(booking.guestsCount, 'Not provided', 32)}`,
      '',
      `*Venue:* ${formatValue(location?.venueName, 'Selected Venue', 80)}`,
      `*Address:* ${formatValue(location?.formattedAddress, 'Selected Address', 160)}`,
      `*Google Maps:* ${formatValue(mapsUrl, 'Not provided', 250)}`,
    ];

    const messageWithoutNotes = lines.join('\n');
    const notesLabel = '*Special Notes:* ';
    const availableNotesLength = Math.max(0, MAX_MESSAGE_LENGTH - messageWithoutNotes.length - 1 - notesLabel.length);
    const notes = formatValue(booking.notes, 'None', availableNotesLength);
    const message = `${messageWithoutNotes}\n${notesLabel}${notes}`;

    return message.length <= MAX_MESSAGE_LENGTH ? message : message.slice(0, MAX_MESSAGE_LENGTH);
  }

  static buildUrl(text: string, phone: string = ADMIN_WHATSAPP_NUMBER): string {
    const digits = phone.replace(/\D/g, '');
    if (!/^\d{8,15}$/.test(digits)) throw new Error('A valid WhatsApp phone number is required.');
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  }

  /** Call synchronously from the confirm click so mobile browsers allow the WhatsApp window. */
  static sendBookingToAdmin(booking: Booking): boolean {
    try {
      const url = this.buildUrl(this.buildAdminMessage(booking));
      const whatsappWindow = window.open(url, '_blank');
      if (whatsappWindow) whatsappWindow.opener = null;
      return Boolean(whatsappWindow);
    } catch (error) {
      console.warn('Could not open WhatsApp:', error);
      return false;
    }
  }

  static callAdmin(): void {
    window.open(`tel:${WhatsAppService.ADMIN_PHONE.replace(/\s/g, '')}`);
  }
}
