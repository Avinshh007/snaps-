import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Environment Variables Configuration
const META_WHATSAPP_TOKEN = process.env.META_WHATSAPP_TOKEN || '';
const META_PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID || '';
const ADMIN_WHATSAPP_NUMBER = process.env.ADMIN_WHATSAPP_NUMBER || '8247432669';
const COMPANY_NAME = process.env.COMPANY_NAME || 'Snap Stories';

/**
 * Clean phone formatting utility
 */
function formatWhatsAppPhone(phone) {
  if (!phone) return '';
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 10) return `91${clean}`;
  return clean;
}

/**
 * Meta WhatsApp Business Cloud API Messaging Service
 */
async function sendMetaWhatsAppMessage(toPhone, messageText) {
  const recipient = formatWhatsAppPhone(toPhone);

  if (!META_WHATSAPP_TOKEN || !META_PHONE_NUMBER_ID) {
    console.log(`[SIMULATED META WHATSAPP DISPATCH] -> To: ${recipient}`);
    console.log(`[MESSAGE BODY]:\n${messageText}\n----------------------------------`);
    return { success: true, simulated: true };
  }

  const metaUrl = `https://graph.facebook.com/v21.0/${META_PHONE_NUMBER_ID}/messages`;
  try {
    const response = await axios.post(
      metaUrl,
      {
        messaging_product: 'whatsapp',
        to: recipient,
        type: 'text',
        text: { body: messageText },
      },
      {
        headers: {
          Authorization: `Bearer ${META_WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return { success: true, data: response.data };
  } catch (err) {
    console.error('Meta WhatsApp API Error:', err.response?.data || err.message);
    return { success: false, error: err.response?.data || err.message };
  }
}

/**
 * POST /api/booking
 * Modular controller pipeline ready for future database expansion
 */
app.post('/api/booking', async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      eventType,
      package: pkgName,
      duration,
      date,
      timeSlot,
      timeRange,
      venueName,
      formattedAddress,
      latitude,
      longitude,
      googleMapsUrl,
      notes,
    } = req.body;

    if (!customerName || !customerPhone) {
      return res.status(400).json({ success: false, error: 'Customer name and phone number are required.' });
    }

    const latStr = typeof latitude === 'number' ? latitude.toFixed(6) : (latitude || '17.432500');
    const lngStr = typeof longitude === 'number' ? longitude.toFixed(6) : (longitude || '78.407100');
    const mapsLink = googleMapsUrl || `https://www.google.com/maps?q=${latStr},${lngStr}`;
    const displayPkg = pkgName || duration || '4K Master Reel Coverage';

    // ----------------------------------------------------
    // [FUTURE DATABASE INTEGRATION POINT]
    // Insert database persistence logic here (Prisma, PostgreSQL, MongoDB, etc.):
    // const savedBooking = await DatabaseService.createBooking(req.body);
    // ----------------------------------------------------

    // 1. Admin WhatsApp Message
    const adminMessage = `📢 NEW BOOKING REQUEST

Customer:
${customerName}

Phone:
${customerPhone}

Email:
${customerEmail || 'Not Provided'}

Package:
${displayPkg}

Event:
${eventType}

Date:
${date}

Time:
${timeSlot || timeRange || 'Evening'}

Venue:
${venueName || 'Selected Venue'}

Address:
${formattedAddress || 'Selected Address'}

Latitude:
${latStr}

Longitude:
${lngStr}

Google Maps:
${mapsLink}

Special Notes:
${notes || 'None'}

Please contact the customer and confirm the booking.`;

    // 2. Customer WhatsApp Message
    const customerMessage = `Hello ${customerName},

Thank you for choosing ${COMPANY_NAME}.

Your booking request has been received successfully.

Our team will contact you shortly to confirm your booking.

Booking Details

Event:
${eventType}

Package:
${displayPkg}

Date:
${date}

Venue:
${venueName || 'Selected Venue'}

Thank you for trusting ${COMPANY_NAME} ❤️

For any queries contact
${ADMIN_WHATSAPP_NUMBER}`;

    // Concurrent WhatsApp Dispatch
    const [adminResult, customerResult] = await Promise.all([
      sendMetaWhatsAppMessage(ADMIN_WHATSAPP_NUMBER, adminMessage),
      sendMetaWhatsAppMessage(customerPhone, customerMessage),
    ]);

    return res.json({
      success: true,
      message: 'Booking request processed successfully.',
      notifications: {
        admin: adminResult,
        customer: customerResult,
      },
    });
  } catch (error) {
    console.error('Backend booking processing error:', error);
    return res.status(500).json({ success: false, error: 'Server error processing booking request.' });
  }
});

// Single Page Application Fallback Routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Snap Stories Backend Server active on port ${PORT}`);
});
