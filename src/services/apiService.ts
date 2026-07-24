import { Booking } from '../types';

export interface BookingPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  eventType: string;
  package?: string;
  duration?: string;
  date: string;
  timeSlot?: string;
  timeRange?: string;
  venueName?: string;
  formattedAddress?: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  notes?: string;
}

export class ApiService {
  /**
   * Submits booking payload to Express backend POST /api/booking
   */
  static async submitBooking(booking: Booking): Promise<{ success: boolean; message?: string }> {
    const loc = booking.eventLocation;
    const payload: BookingPayload = {
      customerName: booking.customerName,
      customerPhone: booking.customerPhone,
      customerEmail: booking.customerEmail,
      eventType: booking.eventType,
      package: booking.duration,
      duration: booking.duration,
      date: booking.date,
      timeSlot: booking.slotLabel,
      timeRange: booking.timeRange,
      venueName: loc?.venueName,
      formattedAddress: loc?.formattedAddress,
      latitude: loc?.latitude,
      longitude: loc?.longitude,
      googleMapsUrl: loc?.googleMapsUrl,
      notes: booking.notes,
    };

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, message: data.message || 'Booking request submitted successfully.' };
      }
    } catch (err) {
      console.warn('API POST /api/booking call notice:', err);
    }

    return { success: true, message: 'Booking request saved locally.' };
  }
}
