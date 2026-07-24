import React from 'react';
import { Booking } from '../../types';
import { NotificationCenter } from './NotificationCenter';
import {
  UserCheck,
  Calendar,
  Download,
  Star,
  CheckCircle2,
  Clock,
  Heart,
  X,
  Play,
  ArrowRight,
  Sparkles,
  Bell,
} from 'lucide-react';

interface CustomerDashboardProps {
  bookings: Booking[];
  onClose: () => void;
  onOpenBooking: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  bookings,
  onClose,
  onOpenBooking,
}) => {
  const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';

  return (
    <div className="fixed inset-0 z-[140] bg-black/95 backdrop-blur-2xl text-white overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-neutral-800 bg-[#0d0d0d] flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-brand flex items-center justify-center text-white shadow-lg">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bebas text-2xl tracking-wide text-white">MY SNAP STORIES CLIENT HUB</h2>
            <p className="text-[10px] font-mono text-amber-400 uppercase">Upcoming Events & Deliverables</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-white text-neutral-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-6xl mx-auto w-full p-6 space-y-8 flex-1">
        {/* Active Bookings Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-space text-lg font-bold text-white flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>Your Booked Reel Shoots ({bookings.length})</span>
            </h3>

            <button
              onClick={onOpenBooking}
              className="px-4 py-2 rounded-full bg-gradient-brand text-white font-space font-bold text-xs uppercase tracking-wider"
            >
              + Book New Reel Shoot
            </button>
          </div>

          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="glass-card p-6 rounded-3xl border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={b.creatorAvatar || defaultAvatar}
                    alt={b.creatorName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 shrink-0"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-gradient-brand text-white text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
                        {b.bookingNumber}
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                        {b.status}
                      </span>
                    </div>

                    <h4 className="font-space font-bold text-lg text-white mt-1">
                      {b.eventType} ({b.creatorName})
                    </h4>

                    <p className="text-xs text-neutral-400 mt-1 font-inter">
                      📍 {b.city} • Date: <span className="text-amber-400 font-bold">{b.date}</span> ({b.timeRange})
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:items-end space-y-2 border-t md:border-t-0 pt-4 md:pt-0 border-neutral-800">
                  <div className="font-bebas text-2xl text-gradient">
                    ₹{b.totalAmount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs font-mono text-neutral-400">
                    Advance Paid: <span className="text-emerald-400 font-bold">₹{b.advancePaid}</span>
                  </div>

                  <button
                    onClick={() => alert(`Downloading official PDF Tax Invoice for ${b.bookingNumber}`)}
                    className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs font-mono text-neutral-300 hover:text-white flex items-center space-x-1.5 mt-2"
                  >
                    <Download className="w-3.5 h-3.5 text-orange-400" />
                    <span>Download Invoice</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-Time Notification Center (Simulated Socket.IO Feed) */}
        <NotificationCenter />

        {/* 24-Hour Express Guarantee banner */}
        <div className="glass-card p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-space font-bold text-white text-base">24-Hour Express 4K Delivery Guarantee</h4>
            <p className="text-xs text-neutral-300">All edited reels and color-graded color masters are delivered directly via Google Drive & WhatsApp within 24 hours of shoot completion.</p>
          </div>
          <button
            onClick={onOpenBooking}
            className="px-5 py-2.5 rounded-full bg-gradient-brand text-white font-space font-bold text-xs uppercase tracking-wider shrink-0"
          >
            Schedule Slot
          </button>
        </div>
      </div>
    </div>
  );
};
