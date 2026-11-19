# Snap Stories booking site

React + Vite booking site. Booking details are prepared in the browser and opened in WhatsApp for the customer to review and send to the Snap Stories team. No booking backend or booking API is required.

## Run locally

Install dependencies and start Vite:

```sh
npm install
npm run dev
```

Open `http://localhost:3000`.

## WhatsApp booking flow

1. Complete the booking form and select **Confirm Booking Request**.
2. The site synchronously opens WhatsApp to `+91 82474 32669` with a prefilled message containing the booking ID, customer contact details, event, package, date and time, guest count, venue, address, Google Maps link, and notes.
3. Review the message and tap **Send** in WhatsApp. The site cannot send the message on the customer's behalf.
4. Step 6 has **Send via WhatsApp** to reopen the same prefilled message, **Call Snap Stories**, and **Return to Home**.

The message uses WhatsApp bold formatting and is limited to 1,500 characters. Long values are shortened to fit.

## App environment values

Copy `.env.example` to `.env` only if you need to configure the existing Gemini or AI Studio app values. WhatsApp booking does not require a token, server, or environment variables.
