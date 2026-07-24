import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SocketNotification, NotificationType } from '../../types';
import {
  Bell,
  CheckCircle2,
  CreditCard,
  Video,
  Clock,
  Sparkles,
  Zap,
  Filter,
  Check,
  Trash2,
  Radio,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Send,
  AlertCircle,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface NotificationCenterProps {
  notifications?: SocketNotification[];
  onNotificationRead?: (id: string) => void;
  onClearAll?: () => void;
}

// Initial mock notifications for Socket.IO feed
const INITIAL_NOTIFICATIONS: SocketNotification[] = [
  {
    id: 'notif-1',
    type: 'payment',
    title: 'Payment Confirmed & Slot Locked',
    message: '25% Advance payment of ₹4,999 via UPI (Txn #UPI-9823140) received successfully. Slot locked for Grand Wedding Shoot.',
    timestamp: 'Just now',
    read: false,
    bookingNumber: 'SS-9821',
    socketEvent: 'payment:confirmation',
    amount: 4999,
    metadata: {
      paymentMethod: 'UPI / PhonePe',
      city: 'Mumbai',
    },
  },
  {
    id: 'notif-2',
    type: 'booking',
    title: 'Cinematographer Crew Assigned',
    message: 'Lead Cinematographer Rahul Sharma & 4K Drone Specialist team assigned for Haldi & Mehendi on 28th July 2026.',
    timestamp: '12 mins ago',
    read: false,
    bookingNumber: 'SS-9821',
    socketEvent: 'booking:status_update',
    metadata: {
      cinematographer: 'Rahul Sharma (4K Sony Alpha FX3)',
      city: 'Mumbai',
    },
  },
  {
    id: 'notif-3',
    type: 'deliverable',
    title: '4K Edited Reel Delivered (24h Express)',
    message: 'Your high-res color-graded Instagram Reel is ready! Google Drive download link and WhatsApp preview generated.',
    timestamp: '1 hour ago',
    read: true,
    bookingNumber: 'SS-8802',
    socketEvent: 'reel:delivered',
    metadata: {
      deliverableUrl: 'https://drive.google.com/file/d/snapstories-reel-4k-master/view',
    },
  },
  {
    id: 'notif-4',
    type: 'shoot',
    title: 'Pre-Shoot Location Survey Complete',
    message: 'Our local Mumbai shoot coordinator completed the venue lighting check for Taj Lands End. All set for 18:00 slot.',
    timestamp: '3 hours ago',
    read: true,
    bookingNumber: 'SS-9821',
    socketEvent: 'shoot:reminder',
  },
];

export const NotificationCenter: React.FC<NotificationCenterProps> = () => {
  const [notifications, setNotifications] = useState<SocketNotification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<NotificationType | 'all'>('all');
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [autoSimulate, setAutoSimulate] = useState<boolean>(true);
  const [lastEventTime, setLastEventTime] = useState<string>('Just now');
  const [pingMs, setPingMs] = useState<number>(28);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [latestToast, setLatestToast] = useState<SocketNotification | null>(null);

  // Ping jitter simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPingMs(Math.floor(Math.random() * 15) + 18);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Socket event generator helper
  const emitSocketEvent = (eventData: Omit<SocketNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: SocketNotification = {
      ...eventData,
      id: `socket-notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setLastEventTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setLatestToast(newNotif);

    // Auto dismiss toast after 5 seconds
    setTimeout(() => {
      setLatestToast((curr) => (curr?.id === newNotif.id ? null : curr));
    }, 5000);
  };

  // Auto Socket event emitter loop
  useEffect(() => {
    if (!autoSimulate || !isConnected) return;

    const mockEventsPool = [
      {
        type: 'payment' as NotificationType,
        title: 'Instant UPI Payment Verified',
        message: 'Advance payment of ₹3,749 confirmed for Corporate Event Shoot in Bengaluru (Txn #RAZORPAY-881023).',
        bookingNumber: 'SS-9844',
        socketEvent: 'payment:confirmation',
        amount: 3749,
        metadata: { paymentMethod: 'Razorpay UPI', city: 'Bengaluru' },
      },
      {
        type: 'booking' as NotificationType,
        title: 'Status Updated: Crew En Route',
        message: 'Cinematography team lead Ananya Roy is en route to venue Taj Palace, New Delhi with 4K Gimbal setup.',
        bookingNumber: 'SS-9850',
        socketEvent: 'booking:status_update',
        metadata: { cinematographer: 'Ananya Roy (RED Komodo & Sony A7SIII)', city: 'New Delhi' },
      },
      {
        type: 'deliverable' as NotificationType,
        title: 'New 4K Reel Render Uploaded',
        message: 'Colorist uploaded 4K HDR Color Grade V2 for Wedding Reception reel. Tap to preview draft render.',
        bookingNumber: 'SS-9821',
        socketEvent: 'reel:delivered',
        metadata: { deliverableUrl: 'https://drive.google.com' },
      },
      {
        type: 'shoot' as NotificationType,
        title: 'Shoot Slot Reminder (2 hours to go)',
        message: 'Your Evening Sunset Reel Shoot begins at 17:00 at Marine Drive. Please have outfit changes ready!',
        bookingNumber: 'SS-9821',
        socketEvent: 'shoot:reminder',
        metadata: { city: 'Mumbai' },
      },
    ];

    const interval = setInterval(() => {
      const randomEv = mockEventsPool[Math.floor(Math.random() * mockEventsPool.length)];
      emitSocketEvent(randomEv);
    }, 12000);

    return () => clearInterval(interval);
  }, [autoSimulate, isConnected]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const triggerManualSimulation = (type: NotificationType) => {
    if (type === 'payment') {
      emitSocketEvent({
        type: 'payment',
        title: 'Live UPI Advance Confirmed!',
        message: 'Advance of ₹4,999 received via GPay. Slot confirmed for 4K Wedding Reel shoot in Mumbai.',
        bookingNumber: 'SS-9821',
        socketEvent: 'payment:confirmation',
        amount: 4999,
        metadata: { paymentMethod: 'Google Pay UPI', city: 'Mumbai' },
      });
    } else if (type === 'booking') {
      emitSocketEvent({
        type: 'booking',
        title: 'Crew Assigned: Executive Director',
        message: 'Senior Director Vikramaditya & 2 Assistant Camera Operators assigned to your event.',
        bookingNumber: 'SS-9821',
        socketEvent: 'booking:status_update',
        metadata: { cinematographer: 'Vikramaditya (Senior Director)', city: 'Mumbai' },
      });
    } else if (type === 'deliverable') {
      emitSocketEvent({
        type: 'deliverable',
        title: 'Express 24-Hour Reel Link Ready',
        message: '4K Edited Instagram Reel with trending audio sync & color grading is ready for Instagram download!',
        bookingNumber: 'SS-9821',
        socketEvent: 'reel:delivered',
        metadata: { deliverableUrl: 'https://drive.google.com' },
      });
    } else {
      emitSocketEvent({
        type: 'shoot',
        title: 'Crew On-Site Confirmation',
        message: 'Snap Stories 4K team has arrived at venue and started gear setup (Gimbals, Lighting & Audio Mics).',
        bookingNumber: 'SS-9821',
        socketEvent: 'shoot:reminder',
      });
    }
  };

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
      case 'booking':
        return <CheckCircle2 className="w-4 h-4 text-amber-400" />;
      case 'deliverable':
        return <Video className="w-4 h-4 text-purple-400" />;
      case 'shoot':
        return <Clock className="w-4 h-4 text-orange-400" />;
      default:
        return <Zap className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="glass-card rounded-3xl border border-neutral-800 p-5 sm:p-6 space-y-6 relative overflow-hidden bg-neutral-950/80">
      {/* Real-time Socket Toast Alert Banner */}
      <AnimatePresence>
        {latestToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-4 right-4 left-4 sm:left-auto sm:max-w-md z-30 bg-neutral-900 border-2 border-amber-500/80 rounded-2xl p-4 shadow-[0_0_30px_rgba(255,176,0,0.3)] flex items-start justify-between gap-3"
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500 flex items-center justify-center shrink-0 text-amber-400 mt-0.5">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md font-bold">
                    Socket Event: {latestToast.socketEvent}
                  </span>
                </div>
                <h5 className="font-space font-bold text-xs text-white mt-1">{latestToast.title}</h5>
                <p className="text-[11px] text-neutral-300 font-inter line-clamp-2 mt-0.5">{latestToast.message}</p>
              </div>
            </div>

            <button
              onClick={() => setLatestToast(null)}
              className="text-neutral-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Socket.IO Connection & Live Engine Status Bar */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center">
            <span
              className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-emerald-500 shadow-[0_0_10px_#10B981]' : 'bg-red-500'
              }`}
            />
            {isConnected && (
              <span className="absolute w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-75" />
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Socket.IO Live Feed Engine
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.2 rounded-full">
                {pingMs}ms latency
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 font-mono">
              wss://socket.snapstories.in:443/v1/realtime • Listening to <span className="text-amber-400">booking:status_update</span> & <span className="text-amber-400">payment:confirmation</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setAutoSimulate(!autoSimulate)}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-mono flex items-center space-x-1.5 transition ${
              autoSimulate
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${autoSimulate ? 'animate-spin' : ''}`} />
            <span>{autoSimulate ? 'Live Stream: ACTIVE' : 'Live Stream: PAUSED'}</span>
          </button>

          <button
            onClick={() => setIsConnected(!isConnected)}
            className="p-1.5 rounded-xl bg-neutral-800 border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white"
            title="Toggle Socket Connection"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-400' : 'text-red-400'}`} />
          </button>
        </div>
      </div>

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400 shadow-lg">
              <Bell className="w-5 h-5" />
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-brand text-white font-mono font-bold text-[10px] flex items-center justify-center shadow-md animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>

          <div>
            <h3 className="font-space font-bold text-base sm:text-lg text-white flex items-center space-x-2">
              <span>Real-Time Notification Center</span>
              <span className="text-[10px] font-mono font-normal bg-neutral-900 border border-neutral-800 text-amber-400 px-2 py-0.5 rounded-full">
                Socket.IO v4.7
              </span>
            </h3>
            <p className="text-xs text-neutral-400">
              Live updates for booking slot confirmations, payment receipts & 24h 4K reel deliveries
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center space-x-2 self-end md:self-auto">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500 text-xs text-neutral-300 hover:text-white flex items-center space-x-1.5 transition"
            >
              <Check className="w-3.5 h-3.5 text-amber-400" />
              <span>Mark all read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-red-500 text-xs text-neutral-400 hover:text-red-400 flex items-center space-x-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Manual Event Simulation Buttons */}
      <div className="bg-neutral-900/40 p-3 rounded-2xl border border-neutral-800/80 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
          <span className="flex items-center space-x-1.5 text-amber-400 font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Real-Time Socket.IO Broadcast:</span>
          </span>
          <span>Click to trigger instant WebSocket event</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => triggerManualSimulation('payment')}
            className="p-2.5 rounded-xl bg-neutral-900 border border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-500/10 transition text-left space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">payment:confirmation</span>
              <CreditCard className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="text-xs text-white font-medium">Verify UPI Payment</div>
          </button>

          <button
            onClick={() => triggerManualSimulation('booking')}
            className="p-2.5 rounded-xl bg-neutral-900 border border-amber-500/30 hover:border-amber-500 hover:bg-amber-500/10 transition text-left space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">booking:status_update</span>
              <CheckCircle2 className="w-3 h-3 text-amber-400" />
            </div>
            <div className="text-xs text-white font-medium">Assign Crew Member</div>
          </button>

          <button
            onClick={() => triggerManualSimulation('deliverable')}
            className="p-2.5 rounded-xl bg-neutral-900 border border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 transition text-left space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">reel:delivered</span>
              <Video className="w-3 h-3 text-purple-400" />
            </div>
            <div className="text-xs text-white font-medium">Deliver 4K Reel Link</div>
          </button>

          <button
            onClick={() => triggerManualSimulation('shoot')}
            className="p-2.5 rounded-xl bg-neutral-900 border border-orange-500/30 hover:border-orange-500 hover:bg-orange-500/10 transition text-left space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-orange-400 font-bold uppercase">shoot:reminder</span>
              <Clock className="w-3 h-3 text-orange-400" />
            </div>
            <div className="text-xs text-white font-medium">Shoot Location Alert</div>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Updates', count: notifications.length },
          { id: 'payment', label: 'Payments', count: notifications.filter((n) => n.type === 'payment').length },
          { id: 'booking', label: 'Bookings', count: notifications.filter((n) => n.type === 'booking').length },
          { id: 'deliverable', label: '4K Deliverables', count: notifications.filter((n) => n.type === 'deliverable').length },
          { id: 'shoot', label: 'Shoot Alerts', count: notifications.filter((n) => n.type === 'shoot').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium shrink-0 flex items-center space-x-1.5 transition ${
              filter === tab.id
                ? 'bg-gradient-brand text-white shadow-[0_0_15px_rgba(255,59,0,0.4)]'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                filter === tab.id ? 'bg-black/30 text-white' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center space-y-3 bg-neutral-900/30 rounded-2xl border border-neutral-800/60">
              <AlertCircle className="w-8 h-8 text-neutral-600 mx-auto" />
              <div className="text-xs text-neutral-400">No notifications found in this category.</div>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => markAsRead(notif.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                  !notif.read
                    ? 'bg-neutral-900 border-amber-500/50 shadow-[0_0_15px_rgba(255,176,0,0.08)]'
                    : 'bg-neutral-900/40 border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      notif.type === 'payment'
                        ? 'bg-emerald-500/20 border border-emerald-500/40'
                        : notif.type === 'booking'
                        ? 'bg-amber-500/20 border border-amber-500/40'
                        : notif.type === 'deliverable'
                        ? 'bg-purple-500/20 border border-purple-500/40'
                        : 'bg-orange-500/20 border border-orange-500/40'
                    }`}
                  >
                    {getIconForType(notif.type)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-space font-bold text-xs text-white">{notif.title}</span>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      )}
                      <span className="text-[10px] font-mono text-neutral-400 bg-black/50 border border-neutral-800 px-2 py-0.5 rounded-md">
                        {notif.socketEvent}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 font-inter leading-relaxed">{notif.message}</p>

                    {/* Metadata chips */}
                    {notif.metadata && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {notif.metadata.paymentMethod && (
                          <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                            Method: {notif.metadata.paymentMethod}
                          </span>
                        )}
                        {notif.metadata.cinematographer && (
                          <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-md">
                            Crew: {notif.metadata.cinematographer}
                          </span>
                        )}
                        {notif.bookingNumber && (
                          <span className="text-[10px] font-mono bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-md">
                            Booking #{notif.bookingNumber}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-400">{notif.timestamp}</span>

                  {notif.type === 'deliverable' && (
                    <a
                      href="https://drive.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-2.5 py-1 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[11px] font-mono hover:bg-purple-500/30 flex items-center space-x-1"
                    >
                      <span>Download 4K</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {notif.type === 'payment' && (
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      ₹{notif.amount || 4999} Paid
                    </span>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
