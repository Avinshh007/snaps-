import jsPDF from 'jspdf';
import { Booking } from '../types';

/**
 * Generates a unique client-side Booking ID (e.g. SNAP-20260722-00125)
 */
export function generateBookingId(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `SNAP-${dateStr}-${randomNum}`;
}

/**
 * Client-Side PDF Invoice Generator using jsPDF.
 * Creates a branded PDF document without requiring any database or backend server.
 */
export class InvoiceService {
  static generatePDF(booking: Booking): jsPDF {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const loc = booking.eventLocation;
    const lat = loc?.latitude ? loc.latitude.toFixed(6) : '17.432500';
    const lng = loc?.longitude ? loc.longitude.toFixed(6) : '78.407100';
    const mapsUrl = loc?.googleMapsUrl || `https://www.google.com/maps?q=${lat},${lng}`;
    const invoiceNum = booking.bookingNumber.replace('SNAP-', 'INV-').replace('SS-2026-', 'INV-20260722-');

    // Brand Colors
    const primaryColor = [255, 59, 0]; // #FF3B00 Brand Red/Orange
    const darkBg = [18, 18, 18];
    const textDark = [30, 30, 30];
    const textMuted = [100, 100, 100];
    const greenPaid = [16, 185, 129];

    // Header Background Accent Banner
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 8, 'F');

    // Company Header Title
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('SNAP STORIES', 15, 24);

    doc.setFontSize(9);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text('4K MASTER REEL PRODUCTION STUDIOS', 15, 29);
    doc.text('Support Helpline: +91 8247432669 | Website: snapstories.in', 15, 33);

    // Invoice Meta Right-Aligned Box
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('TAX INVOICE', 195, 22, { align: 'right' });

    doc.setFontSize(9);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(`Booking ID: ${booking.bookingNumber}`, 195, 27, { align: 'right' });
    doc.text(`Invoice No: ${invoiceNum}`, 195, 31, { align: 'right' });
    doc.text(`Date: ${booking.createdAt || new Date().toLocaleDateString('en-IN')}`, 195, 35, { align: 'right' });

    // Payment Status Pill Banner
    doc.setFillColor(236, 253, 245); // Light green bg
    doc.setDrawColor(greenPaid[0], greenPaid[1], greenPaid[2]);
    doc.roundedRect(150, 40, 45, 10, 2, 2, 'FD');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(greenPaid[0], greenPaid[1], greenPaid[2]);
    doc.text('PAYMENT: PAID', 172.5, 46.5, { align: 'center' });

    // Divider Line
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(15, 54, 195, 54);

    // Two Columns: Customer Info & Event Details
    let y = 62;

    // Customer Column
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('CUSTOMER DETAILS', 15, y);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(`Name: ${booking.customerName}`, 15, y + 6);
    doc.text(`Phone: ${booking.customerPhone}`, 15, y + 11);
    doc.text(`Email: ${booking.customerEmail || 'N/A'}`, 15, y + 16);

    // Event Column
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('EVENT SCHEDULE', 110, y);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(`Event Type: ${booking.eventType}`, 110, y + 6);
    doc.text(`Date: ${booking.date}`, 110, y + 11);
    doc.text(`Time Slot: ${booking.slotLabel} (${booking.timeRange})`, 110, y + 16);
    doc.text(`Coverage: ${booking.duration || '4 Hours Master Shoot'}`, 110, y + 21);

    // Location Box (Full Width Card)
    y += 30;
    doc.setFillColor(248, 249, 250);
    doc.setDrawColor(230, 230, 230);
    doc.roundedRect(15, y, 180, 36, 3, 3, 'FD');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('VERIFIED SHOOT LOCATION', 20, y + 7);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(loc?.venueName || 'Selected Event Venue', 20, y + 13);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    const splitAddr = doc.splitTextToSize(loc?.formattedAddress || 'Selected Venue Address', 170);
    doc.text(splitAddr, 20, y + 18);

    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(`GPS Coordinates: ${lat}, ${lng} | Google Maps: ${mapsUrl}`, 20, y + 30);

    // Pricing Table Header
    y += 44;
    doc.setFillColor(darkBg[0], darkBg[1], darkBg[2]);
    doc.rect(15, y, 180, 8, 'F');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('ITEM / SERVICE DESCRIPTION', 20, y + 5.5);
    doc.text('DURATION', 125, y + 5.5);
    doc.text('AMOUNT', 190, y + 5.5, { align: 'right' });

    // Table Row
    y += 8;
    doc.setFillColor(255, 255, 255);
    doc.rect(15, y, 180, 12, 'F');
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(`4K Master Reel Coverage (${booking.eventType})`, 20, y + 7);
    doc.text(booking.duration || '4 Hours', 125, y + 7);
    doc.text(`Rs. ${booking.totalAmount.toLocaleString('en-IN')}`, 190, y + 7, { align: 'right' });

    doc.setDrawColor(230, 230, 230);
    doc.line(15, y + 12, 195, y + 12);

    // Summary Totals
    y += 18;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text('Subtotal:', 140, y);
    doc.text(`Rs. ${booking.totalAmount.toLocaleString('en-IN')}`, 190, y, { align: 'right' });

    doc.text('GST / Service Tax (Included):', 140, y + 5);
    doc.text('Rs. 0.00', 190, y + 5, { align: 'right' });

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('TOTAL AMOUNT:', 140, y + 12);
    doc.text(`Rs. ${booking.totalAmount.toLocaleString('en-IN')}`, 190, y + 12, { align: 'right' });

    // Footer Box
    doc.setDrawColor(220, 220, 220);
    doc.line(15, 265, 195, 265);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('Thank you for choosing Snap Stories.', 105, 272, { align: 'center' });

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text('For any assistance contact helpline: 8247432669 | Official Invoice Document', 105, 277, { align: 'center' });

    return doc;
  }

  /**
   * Downloads the generated PDF invoice locally to the customer device
   */
  static downloadInvoice(booking: Booking) {
    const doc = this.generatePDF(booking);
    const fileName = `${booking.bookingNumber}_Invoice.pdf`;
    doc.save(fileName);
  }
}
