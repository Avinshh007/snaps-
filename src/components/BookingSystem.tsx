import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EventCategory, TimeSlotId, Booking, EventLocation } from '../types';
import { EVENT_CATEGORIES, TIME_SLOTS } from '../data/mockData';
import { EventLocationPicker } from './EventLocationPicker';
import { WhatsAppService } from '../services/whatsappService';
import { generateBookingId } from '../services/invoiceService';
import {
  X,
  CheckCircle2,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  User,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  PartyPopper,
  AlertCircle,
  MessageSquare,
  Send,
  ExternalLink,
  Users,
  FileText,
  Download,
  Phone,
} from 'lucide-react';

interface BookingSystemProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDate?: string;
  preselectedSlot?: TimeSlotId;
  preselectedCategory?: EventCategory;
  onBookingConfirmed: (newBooking: Booking) => void;
}

export const BookingSystem: React.FC<BookingSystemProps> = ({
  isOpen,
  onClose,
  preselectedDate = '2026-08-15',
  preselectedSlot = 'evening',
  preselectedCategory = 'Wedding',
  onBookingConfirmed,
}) => {
  if (!isOpen) return null;

  // 6 Steps:
  // 1: Event Type & Duration
  // 2: Date & Slot
  // 3: Customer Contact Details
  // 4: Event Location (Google Maps)
  // 5: Booking Summary & WhatsApp Confirmation
  // 6: Confirmation Ticket Pass
  const [step, setStep] = useState<number>(1);

  // Form states
  const [eventType, setEventType] = useState<EventCategory>(preselectedCategory);
  const [duration, setDuration] = useState<string>('4 Hours Coverage');
  const [date, setDate] = useState<string>(preselectedDate);
  const [timeSlot, setTimeSlot] = useState<TimeSlotId>(preselectedSlot);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCompletedBooking(null);
      if (preselectedCategory) setEventType(preselectedCategory);
      if (preselectedDate) setDate(preselectedDate);
      if (preselectedSlot) setTimeSlot(preselectedSlot);
    }
  }, [isOpen, preselectedCategory, preselectedDate, preselectedSlot]);

  // Customer Details
  const [customerName, setCustomerName] = useState('Rahul Verma');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 12345');
  const [customerEmail, setCustomerEmail] = useState('rahul.verma@example.com');
  const [guestsCount, setGuestsCount] = useState<string>('100-250 Guests');
  const [additionalNotes, setAdditionalNotes] = useState<string>('Cinematic wedding reels with slow-motion bridal entry.');

  // Location state
  const [eventLocation, setEventLocation] = useState<EventLocation | null>(null);

  // Validation Error State
  const [validationError, setValidationError] = useState<string | null>(null);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);

  // Pricing math
  const basePrices: Record<EventCategory, number> = {
    Wedding: 19999,
    Engagement: 12999,
    Reception: 17999,
    Haldi: 14999,
    Mehendi: 14999,
    Birthday: 11999,
    'Birthday Celebration': 11999,
    Anniversary: 12999,
    'Car shoot': 9999,
    'Baby Shower': 11999,
    Housewarming: 10999,
    'Corporate Event': 15999,
    'Product Shoot': 16999,
    'Fashion Shoot': 14999,
    'College Event': 11999,
    Sangeet: 14999,
    'Pre-Wedding Shoot': 16999,
    Other: 9999,
  };

  const totalAmount = basePrices[eventType] || 14999;
  const advanceAmount = Math.round(totalAmount * 0.25);
  const balanceAmount = totalAmount - advanceAmount;

  const handleNextStep = () => {
    setValidationError(null);

    if (step === 3) {
      if (!customerName.trim() || !customerPhone.trim()) {
        setValidationError('Please fill in your Full Name and Mobile Number to proceed.');
        return;
      }
    }

    if (step === 4) {
      if (!eventLocation || !eventLocation.latitude || !eventLocation.longitude) {
        setValidationError('Please select your event location using GPS or Search.');
        return;
      }
      if (!eventLocation.confirmed) {
        setValidationError('Please click "Confirm Location" on the location card before proceeding.');
        return;
      }
    }

    if (step < 5) setStep(step + 1);
  };

  const handleBackStep = () => {
    setValidationError(null);
    if (step > 1) setStep(step - 1);
  };

  const handleConfirmWhatsAppBooking = () => {
    setValidationError(null);

    // Validation check
    if (!customerName.trim() || !customerPhone.trim()) {
      setValidationError('Please enter your Full Name and Mobile Number.');
      setStep(3);
      return;
    }

    if (!eventLocation || !eventLocation.confirmed) {
      setValidationError('Please select and confirm your shoot location before submitting.');
      setStep(4);
      return;
    }

    const slotObj = TIME_SLOTS.find((s) => s.id === timeSlot);
    const slotLabel = slotObj?.label || 'Evening Prime';
    const timeRange = slotObj?.timeRange || '4:00 PM - 8:00 PM';
    const creatorName = 'Snap Stories 4K Team';

    // Create Booking object for local state display
    const newBookingObj: Booking = {
      id: `bk-${Date.now()}`,
      bookingNumber: generateBookingId(),
      customerName,
      customerEmail,
      customerPhone,
      creatorId: 'team-pro',
      creatorName,
      creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      eventType,
      city: eventLocation.city || eventLocation.venueName?.split(',')[0] || 'Hyderabad',
      date,
      slot: timeSlot,
      slotLabel,
      timeRange,
      totalAmount,
      advancePaid: advanceAmount,
      balanceAmount,
      paymentMethod: 'UPI',
      paymentStatus: 'Pending',
      status: 'Confirmed',
      createdAt: new Date().toISOString().split('T')[0],
      deliverablesDueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      eventLocation,
      duration,
      guestsCount,
      notes: additionalNotes,
    };

    // Open WhatsApp during the user's click gesture, before any asynchronous work.
    WhatsAppService.sendBookingToAdmin(newBookingObj);
    setCompletedBooking(newBookingObj);
    try {
      onBookingConfirmed(newBookingObj);
    } catch (error) {
      console.warn('Could not update the local booking view:', error);
    }
    setStep(6);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-2xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-[#121212] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl z-10 my-auto text-white flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/80">
            <div className="flex items-center space-x-2.5">
              <span className="bg-gradient-brand text-white text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Step {step} of 6
              </span>
              <h2 className="font-space font-bold text-base sm:text-lg text-white">
                {step === 1 && '1. Choose Event Type'}
                {step === 2 && '2. Choose Event Date & Time'}
                {step === 3 && '3. Customer Details'}
                {step === 4 && '4. Where is your event?'}
                {step === 5 && '5. Review Booking & Send'}
                {step === 6 && '6. Booking Request Prepared'}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/60 hover:bg-black text-neutral-400 hover:text-white border border-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar Indicator */}
          <div className="w-full h-1 bg-neutral-900">
            <div
              className="h-full bg-gradient-brand transition-all duration-300 shadow-[0_0_10px_#FF3B00]"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>

          {/* Body Scrollable Area */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
            {/* Validation Banner */}
            {validationError && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-mono flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{validationError}</span>
              </div>
            )}

            {/* STEP 1: EVENT TYPE & DURATION */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-space font-bold text-sm text-white mb-1">
                    Select Your Event Category *
                  </h3>
                  <p className="text-xs text-neutral-400 font-inter">
                    Pick the special occasion you want our 4K Reel production crew to shoot.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {EVENT_CATEGORIES.map((ev) => (
                    <button
                      key={ev}
                      type="button"
                      onClick={() => setEventType(ev)}
                      className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between h-24 ${eventType === ev
                        ? 'bg-gradient-brand text-white border-amber-400 font-bold shadow-[0_0_20px_rgba(255,59,0,0.4)]'
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                        }`}
                    >
                      <PartyPopper className={`w-4 h-4 ${eventType === ev ? 'text-white' : 'text-amber-400'}`} />
                      <div>
                        <span className="font-space text-xs font-semibold block">{ev}</span>
                        <span className="text-[10px] font-mono opacity-80">
                          From ₹{(basePrices[ev] || 14999).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Duration / Package option */}
                <div className="pt-4 border-t border-neutral-800 space-y-2">
                  <label className="text-xs font-mono uppercase text-amber-400 font-bold block">
                    Choose Coverage Duration / Package
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { label: '4 Hours Express', detail: '1x 4K Master Reel + Teaser' },
                      { label: '8 Hours Full Day', detail: '3x 4K Master Reels + Raw Footages' },
                      { label: '12 Hours Grand Production', detail: '5x 4K Reels + Drone Cinema' },
                    ].map((pkg) => (
                      <button
                        key={pkg.label}
                        type="button"
                        onClick={() => setDuration(pkg.label)}
                        className={`p-3 rounded-2xl border text-left transition ${duration === pkg.label
                          ? 'bg-gradient-brand text-white border-amber-400 font-bold'
                          : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                          }`}
                      >
                        <div className="font-space text-xs font-bold">{pkg.label}</div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">{pkg.detail}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: CHOOSE DATE & TIME */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-space font-bold text-sm text-white mb-1">
                    Select Event Date & Time Slot *
                  </h3>
                  <p className="text-xs text-neutral-400 font-inter">
                    Choose when your event is scheduled.
                  </p>
                </div>

                {/* Date Picker */}
                <div className="bg-neutral-900/80 border border-neutral-800 p-5 rounded-3xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-amber-400 font-bold">
                      Available Dates (August / September 2026)
                    </span>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="bg-black border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-amber-400 font-mono focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
                    {[
                      '2026-08-10',
                      '2026-08-12',
                      '2026-08-15',
                      '2026-08-18',
                      '2026-08-20',
                      '2026-08-25',
                      '2026-08-28',
                      '2026-09-01',
                      '2026-09-05',
                      '2026-09-10',
                      '2026-09-15',
                      '2026-09-20',
                    ].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDate(d)}
                        className={`p-2.5 rounded-2xl border text-center transition ${date === d
                          ? 'bg-gradient-brand text-white border-amber-400 font-bold shadow-[0_0_15px_rgba(255,59,0,0.4)]'
                          : 'bg-black/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                          }`}
                      >
                        <div className="text-xs font-bold">{d.slice(8)}</div>
                        <div className="text-[10px] text-neutral-400 uppercase">{d.slice(5, 7)} / 2026</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slot Picker */}
                <div className="space-y-3">
                  <label className="text-xs font-mono uppercase text-amber-400 font-bold block">
                    Select Event Time Slot *
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setTimeSlot(slot.id)}
                        className={`p-4 rounded-2xl border text-left transition flex items-center justify-between ${timeSlot === slot.id
                          ? 'bg-gradient-brand text-white border-amber-400 font-bold shadow-[0_0_20px_rgba(255,59,0,0.4)]'
                          : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                          }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Clock className={`w-5 h-5 ${timeSlot === slot.id ? 'text-white' : 'text-amber-400'}`} />
                          <div>
                            <div className="font-space text-xs font-bold">{slot.label}</div>
                            <div className="text-[11px] opacity-80">{slot.timeRange}</div>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono uppercase bg-black/40 px-2 py-0.5 rounded-full">
                          OPEN
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: CUSTOMER DETAILS */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-space font-bold text-sm text-white mb-1">
                    Customer & Event Contact Information
                  </h3>
                  <p className="text-xs text-neutral-400 font-inter">
                    Please share your details so our team can coordinate the reel shoot.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-neutral-300 block mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Rahul Kumar"
                        className="w-full bg-black/80 border border-neutral-800 rounded-2xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-neutral-300 block mb-1">
                      Mobile Number (WhatsApp) *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-black/80 border border-neutral-800 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      className="w-full bg-black/80 border border-neutral-800 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1 flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>Number of Guests (Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(e.target.value)}
                      placeholder="e.g. 150 Guests"
                      className="w-full bg-black/80 border border-neutral-800 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1 flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>Additional Requirements / Notes</span>
                  </label>
                  <textarea
                    rows={3}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Specify special songs, bride/groom entry, drone footage requests, or lighting notes..."
                    className="w-full bg-black/80 border border-neutral-800 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 font-inter resize-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: EVENT LOCATION (GOOGLE MAPS) */}
            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-space font-bold text-sm text-white mb-1">
                    Where is your event? *
                  </h3>
                  <p className="text-xs text-neutral-400 font-inter">
                    Provide the exact venue location so your assigned cinematographer can navigate seamlessly.
                  </p>
                </div>

                <EventLocationPicker
                  location={eventLocation}
                  onChangeLocation={(loc) => setEventLocation(loc)}
                  onConfirmLocation={() => {
                    if (eventLocation) {
                      setEventLocation({ ...eventLocation, confirmed: true });
                    }
                  }}
                />
              </div>
            )}

            {/* STEP 5: REVIEW BOOKING & WHATSAPP CHECKOUT */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-space font-bold text-sm text-white mb-1">
                    Review Booking & Submit via WhatsApp
                  </h3>
                  <p className="text-xs text-neutral-400 font-inter">
                    Verify your booking details before sending directly to our WhatsApp booking desk.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="glass-card p-5 rounded-3xl border border-neutral-800 space-y-3 bg-neutral-900/90">
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">Event Coverage</span>
                      <h4 className="font-space font-bold text-base text-amber-400">{eventType} Reel Shoot</h4>
                    </div>
                    <span className="bg-amber-500/20 text-amber-300 font-mono text-xs font-bold px-3 py-1 rounded-full border border-amber-500/40">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-neutral-400 font-mono text-[10px]">CUSTOMER NAME:</span>
                      <div className="font-bold text-white">{customerName}</div>
                    </div>
                    <div>
                      <span className="text-neutral-400 font-mono text-[10px]">MOBILE NUMBER:</span>
                      <div className="font-bold text-white">{customerPhone}</div>
                    </div>
                    <div>
                      <span className="text-neutral-400 font-mono text-[10px]">EVENT DATE & TIME:</span>
                      <div className="font-bold text-white">{date} ({timeSlot})</div>
                    </div>
                    <div>
                      <span className="text-neutral-400 font-mono text-[10px]">COVERAGE DURATION:</span>
                      <div className="font-bold text-white">{duration}</div>
                    </div>
                  </div>

                  {eventLocation && (
                    <div className="pt-3 border-t border-neutral-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400 font-mono text-[10px] uppercase">📍 Shoot Location:</span>
                        {eventLocation.verified && (
                          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                            ✔ VERIFIED GPS LOCATION
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-white text-sm">{eventLocation.venueName || 'Selected Venue'}</div>
                      <div className="text-neutral-300 text-xs font-inter">{eventLocation.formattedAddress}</div>
                      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-amber-400 gap-2 pt-1 border-t border-neutral-800/80">
                        <span>Lat: {eventLocation.latitude.toFixed(6)}, Lng: {eventLocation.longitude.toFixed(6)}</span>
                        <a
                          href={eventLocation.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 hover:underline flex items-center space-x-1 font-bold"
                        >
                          <span>Open in Google Maps</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Confirm Booking Button */}
                <button
                  type="button"
                  onClick={handleConfirmWhatsAppBooking}
                  className="w-full py-4 rounded-2xl bg-gradient-brand text-white font-space font-bold text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(255,59,0,0.5)] hover:brightness-110 active:scale-98 transition flex items-center justify-center space-x-2.5"
                >
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>Confirm Booking Request</span>
                  <Send className="w-4 h-4 ml-1" />
                </button>

                <p className="text-[11px] text-neutral-400 text-center font-inter">
                  Clicking "Confirm Booking Request" opens WhatsApp with your booking details ready to send to our team.
                </p>
              </div>
            )}

            {/* STEP 6: BOOKING REQUEST PREPARED */}
            {step === 6 && completedBooking && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto glow-orange">
                  <MessageSquare className="w-8 h-8 text-emerald-400" />
                </div>

                <div className="space-y-2">
                  <span className="bg-emerald-500/20 text-emerald-400 font-mono text-xs px-3.5 py-1 rounded-full border border-emerald-500/40 uppercase font-bold">
                    Booking request prepared
                  </span>
                  <h3 className="font-bebas text-3xl sm:text-4xl text-white mt-2">
                    Thank You, {completedBooking.customerName}!
                  </h3>
                  <p className="text-sm text-neutral-300 font-inter max-w-lg mx-auto leading-relaxed">
                    Booking request prepared. Tap Send in WhatsApp to deliver it to our team.
                  </p>
                  <p className="text-xs font-mono text-amber-400 pt-1">
                    Booking Reference: <span className="font-bold text-white bg-neutral-900 px-2.5 py-1 rounded-lg border border-neutral-800">{completedBooking.bookingNumber}</span>
                  </p>
                </div>

                {/* Booking Summary Card */}
                <div className="glass-card p-6 rounded-3xl border border-neutral-800 text-left space-y-3">
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-neutral-800">
                    <span className="text-neutral-400">Customer Details</span>
                    <span className="font-bold text-white">{completedBooking.customerName} ({completedBooking.customerPhone})</span>
                  </div>

                  <div className="flex justify-between items-center text-xs pb-3 border-b border-neutral-800">
                    <span className="text-neutral-400">Event & Schedule</span>
                    <span className="font-bold text-amber-400">
                      {completedBooking.eventType} - {completedBooking.date} ({completedBooking.slotLabel})
                    </span>
                  </div>

                  {completedBooking.eventLocation && (
                    <div className="flex justify-between items-center text-xs pb-3 border-b border-neutral-800">
                      <span className="text-neutral-400">Shoot Location</span>
                      <a
                        href={completedBooking.eventLocation.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-amber-400 hover:underline flex items-center space-x-1"
                      >
                        <span>{completedBooking.eventLocation.venueName || 'View on Google Maps'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  {completedBooking.notes && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-400">Special Notes</span>
                      <span className="text-neutral-300 font-inter">{completedBooking.notes}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={WhatsAppService.callAdmin}
                    className="py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-space font-bold text-xs uppercase tracking-wider transition flex items-center justify-center space-x-1.5 shadow-lg"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Snap Stories</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => WhatsAppService.sendBookingToAdmin(completedBooking)}
                    className="py-3 px-3 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-space font-bold text-xs uppercase tracking-wider transition flex items-center justify-center space-x-1.5 shadow-lg"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send via WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="py-3 px-3 rounded-2xl bg-gradient-brand text-white font-space font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition flex items-center justify-center space-x-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Return to Home</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Navigation Buttons (Steps 1 to 5) */}
          {step < 6 && (
            <div className="p-5 border-t border-neutral-800 bg-neutral-900/80 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBackStep}
                disabled={step === 1}
                className="px-5 py-2.5 rounded-full border border-neutral-700 text-xs font-semibold text-neutral-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={step === 4 && (!eventLocation || !eventLocation.confirmed)}
                  className="px-6 py-2.5 rounded-full bg-gradient-brand text-white text-xs font-bold font-space uppercase tracking-wider shadow-lg hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center space-x-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmWhatsAppBooking}
                  className="px-6 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold font-space uppercase tracking-wider shadow-lg hover:bg-emerald-500 transition flex items-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Confirm booking</span>
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
