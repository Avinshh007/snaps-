import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Booking, User } from '../../types';
import {
  Shield,
  TrendingUp,
  DollarSign,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  BarChart3,
  Search,
  Bell,
  X,
  Sparkles,
  Video,
  MapPin,
  ExternalLink,
  Copy,
  Navigation,
  Check,
  Compass,
  ShieldCheck,
  Lock,
  LogOut,
} from 'lucide-react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from '@vis.gl/react-google-maps';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface AdminDashboardProps {
  bookings: Booking[];
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ bookings, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('snap_admin_auth') === 'true';
  });

  const [adminEmail, setAdminEmail] = useState('admin@snapstories.com');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'analytics' | 'bookings' | 'coupons'>('analytics');
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(bookings[0]?.id || null);
  const [copiedCoordsId, setCopiedCoordsId] = useState<string | null>(null);

  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalAdvanceCollected = bookings.reduce((sum, b) => sum + b.advancePaid, 0);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = adminEmail.trim().toLowerCase();
    const cleanPass = adminPassword.trim();

    if (
      (cleanEmail === 'admin@snapstories.com' || cleanEmail === 'admin') &&
      (cleanPass === 'admin123' || cleanPass === 'admin' || cleanPass === 'snapstories123')
    ) {
      sessionStorage.setItem('snap_admin_auth', 'true');
      setIsAuthenticated(true);
      setLoginError(null);
    } else {
      setLoginError('Invalid credentials. Use email: admin@snapstories.com and password: admin123');
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('snap_admin_auth');
    setIsAuthenticated(false);
  };

  const handleCopyCoordinates = (id: string, lat: number, lng: number) => {
    const coordsStr = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    navigator.clipboard.writeText(coordsStr);
    setCopiedCoordsId(id);
    setTimeout(() => setCopiedCoordsId(null), 2500);
  };

  // Render Admin Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[140] bg-black/95 backdrop-blur-2xl text-white flex items-center justify-center p-4 font-inter">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md bg-[#121212] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center text-white mx-auto shadow-[0_0_25px_rgba(255,59,0,0.5)]">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="font-bebas text-3xl text-white tracking-wide">SNAP STORIES ADMIN LOGIN</h2>
            <p className="text-xs text-neutral-400 font-mono">Restricted Command Portal Access</p>
          </div>

          {/* Quick Auto-Fill Demo Credentials Badge */}
          <div
            onClick={() => {
              setAdminEmail('admin@snapstories.com');
              setAdminPassword('admin123');
              setLoginError(null);
            }}
            className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs cursor-pointer hover:bg-amber-500/20 transition space-y-1.5 group"
          >
            <div className="flex items-center justify-between font-mono font-bold">
              <span>🔑 Admin Access Credentials:</span>
              <span className="text-[10px] bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded-full uppercase">Click to Fill</span>
            </div>
            <div className="font-mono text-[11px] text-amber-200/90 flex justify-between pt-0.5">
              <span>Email: <strong className="text-white">admin@snapstories.com</strong></span>
              <span>Pass: <strong className="text-white">admin123</strong></span>
            </div>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-mono">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono text-neutral-400 uppercase font-bold block mb-1.5">
                Admin Email / Username
              </label>
              <input
                type="text"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@snapstories.com"
                className="w-full bg-black/90 border border-neutral-800 rounded-2xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-neutral-400 uppercase font-bold block mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/90 border border-neutral-800 rounded-2xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-brand text-white font-space font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,59,0,0.4)] hover:brightness-110 active:scale-98 transition flex items-center justify-center space-x-2"
            >
              <Lock className="w-4 h-4 text-white" />
              <span>Login to Admin Command</span>
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[140] bg-black/95 backdrop-blur-2xl text-white overflow-y-auto flex flex-col font-inter">
      {/* Header */}
      <div className="p-6 border-b border-neutral-800 bg-[#0d0d0d] flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-brand flex items-center justify-center text-white shadow-lg">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bebas text-2xl tracking-wide text-white">SNAP STORIES ADMIN COMMAND</h2>
            <p className="text-[10px] font-mono text-amber-400 uppercase">Platform Overview & Shoot Navigation Center</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleAdminLogout}
            className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-mono font-bold text-neutral-300 hover:text-white transition flex items-center space-x-1.5"
          >
            <LogOut className="w-3.5 h-3.5 text-amber-400" />
            <span>Logout</span>
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-white text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Dashboard Container */}
      <div className="max-w-7xl mx-auto w-full p-6 space-y-8 flex-1">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-3xl border border-neutral-800">
            <div className="text-[10px] font-mono text-neutral-400 uppercase">Gross Platform GMV</div>
            <div className="font-bebas text-3xl text-gradient mt-1">₹{totalRevenue.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1">+24% vs Last Month</div>
          </div>

          <div className="glass-card p-5 rounded-3xl border border-neutral-800">
            <div className="text-[10px] font-mono text-neutral-400 uppercase">Advance Cashflow</div>
            <div className="font-bebas text-3xl text-amber-400 mt-1">₹{totalAdvanceCollected.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-amber-400 font-mono mt-1">25% Locked Deposits</div>
          </div>

          <div className="glass-card p-5 rounded-3xl border border-neutral-800">
            <div className="text-[10px] font-mono text-neutral-400 uppercase">Active Bookings</div>
            <div className="font-bebas text-3xl text-white mt-1">{bookings.length} Events</div>
            <div className="text-[10px] text-orange-400 font-mono mt-1">Confirmed & Scheduled</div>
          </div>

          <div className="glass-card p-5 rounded-3xl border border-neutral-800">
            <div className="text-[10px] font-mono text-neutral-400 uppercase">GPS Navigation Status</div>
            <div className="font-bebas text-3xl text-emerald-400 mt-1">100% Active</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1">Live Creator Dispatch</div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-2 border-b border-neutral-800 pb-3">
          {[
            { id: 'analytics', label: 'Analytics & Revenue' },
            { id: 'bookings', label: 'Manage Bookings & Shoot Locations' },
            { id: 'coupons', label: 'Promo Coupons' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-space font-bold transition ${
                activeTab === t.id
                  ? 'bg-gradient-brand text-white shadow-lg'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content: Analytics */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-3xl border border-neutral-800">
              <h3 className="font-space text-sm font-bold text-white mb-4 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>Monthly Booking Growth Graph</span>
              </h3>
              <div className="space-y-4 pt-4">
                {[
                  { month: 'Apr 2026', amount: '₹1,20,000', pct: '60%' },
                  { month: 'May 2026', amount: '₹1,85,000', pct: '75%' },
                  { month: 'Jun 2026', amount: '₹2,40,000', pct: '90%' },
                  { month: 'Jul 2026 (Live)', amount: '₹3,10,000', pct: '100%' },
                ].map((bar, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono text-neutral-400">
                      <span>{bar.month}</span>
                      <span className="text-amber-400 font-bold">{bar.amount}</span>
                    </div>
                    <div className="w-full h-3 bg-neutral-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-brand rounded-full"
                        style={{ width: bar.pct }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-neutral-800">
              <h3 className="font-space text-sm font-bold text-white mb-4">
                Top Performing Cities
              </h3>
              <div className="space-y-3">
                {[
                  { city: 'Mumbai', share: '38%', bookings: '42 Bookings' },
                  { city: 'Delhi NCR', share: '28%', bookings: '31 Bookings' },
                  { city: 'Hyderabad', share: '24%', bookings: '26 Bookings' },
                  { city: 'Bengaluru', share: '10%', bookings: '12 Bookings' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                    <span className="font-space font-bold text-xs text-white">{row.city}</span>
                    <div className="text-right">
                      <span className="font-mono text-xs text-amber-400 font-bold">{row.share}</span>
                      <div className="text-[10px] text-neutral-500 font-mono">{row.bookings}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Manage Bookings & Shoot Locations */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-space text-base font-bold text-white">Live Creator Shoot Queue</h3>
                  <p className="text-xs text-neutral-400 font-inter">
                    Click any booking to inspect shoot location coordinates, embedded Google Maps, and navigation tools.
                  </p>
                </div>
                <span className="bg-amber-500/20 text-amber-300 font-mono text-xs px-3 py-1 rounded-full border border-amber-500/40">
                  {bookings.length} Bookings Active
                </span>
              </div>

              <div className="space-y-4">
                {bookings.map((b) => {
                  const isExpanded = expandedBookingId === b.id;
                  const loc = b.eventLocation;
                  const lat = loc?.latitude || 17.4325;
                  const lng = loc?.longitude || 78.4071;
                  const mapsUrl = loc?.googleMapsUrl || `https://www.google.com/maps?q=${lat},${lng}`;
                  const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

                  return (
                    <div
                      key={b.id}
                      className={`rounded-3xl border transition overflow-hidden ${
                        isExpanded
                          ? 'bg-neutral-900/90 border-amber-500/50 shadow-[0_0_30px_rgba(255,176,0,0.15)]'
                          : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      {/* Booking Summary Header Row */}
                      <div
                        onClick={() => setExpandedBookingId(isExpanded ? null : b.id)}
                        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-neutral-900/50 transition"
                      >
                        <div className="flex items-center space-x-3.5">
                          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 font-mono font-bold text-xs">
                            <MapPin className="w-5 h-5 text-amber-400" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-xs font-bold text-amber-400">{b.bookingNumber}</span>
                              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                                {b.status}
                              </span>
                              {loc?.verified && (
                                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center space-x-1">
                                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                                  <span>VERIFIED GPS</span>
                                </span>
                              )}
                            </div>
                            <h4 className="font-space font-bold text-sm text-white mt-0.5">
                              {b.eventType} — {b.customerName} ({b.customerPhone})
                            </h4>
                            <p className="text-xs text-neutral-400 font-inter">
                              📍 {loc?.venueName || 'Event Venue'} • {b.date} ({b.timeRange})
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end space-x-4">
                          <div className="text-right">
                            <div className="font-mono font-bold text-gradient text-sm">
                              ₹{b.totalAmount.toLocaleString('en-IN')}
                            </div>
                            <div className="text-[10px] text-neutral-400 font-mono">Advance: ₹{b.advancePaid}</div>
                          </div>

                          <button
                            type="button"
                            className="px-3.5 py-1.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs font-space font-semibold text-white hover:bg-neutral-700 transition"
                          >
                            {isExpanded ? 'Hide Location' : 'View Location & Map'}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Location Inspection Card */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-5 border-t border-neutral-800/80 bg-black/60 space-y-5"
                        >
                          <div className="flex flex-col lg:flex-row gap-6">
                            {/* Left Column: Location Details */}
                            <div className="flex-1 space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <MapPin className="w-5 h-5 text-amber-400" />
                                  <h5 className="font-space font-bold text-sm text-white uppercase tracking-wider">
                                    📍 Shoot Location Details
                                  </h5>
                                </div>
                                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-emerald-500/40 flex items-center space-x-1">
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  <span>Verified Shoot Location</span>
                                </span>
                              </div>

                              <div className="bg-neutral-900/80 border border-neutral-800 p-4 rounded-2xl space-y-2 text-xs">
                                <div>
                                  <span className="text-neutral-400 font-mono text-[10px] uppercase block">Venue / Building:</span>
                                  <span className="font-bold text-white text-sm">{loc?.venueName || 'Selected Shoot Location'}</span>
                                </div>
                                <div>
                                  <span className="text-neutral-400 font-mono text-[10px] uppercase block">Full Address:</span>
                                  <span className="text-neutral-200 font-inter leading-relaxed">{loc?.formattedAddress}</span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-neutral-800 text-[11px] font-mono">
                                  <div>
                                    <span className="text-neutral-500 block text-[10px]">CITY</span>
                                    <span className="text-amber-400 font-bold">{loc?.city || 'Hyderabad'}</span>
                                  </div>
                                  <div>
                                    <span className="text-neutral-500 block text-[10px]">STATE</span>
                                    <span className="text-white">{loc?.state || 'Telangana'}</span>
                                  </div>
                                  <div>
                                    <span className="text-neutral-500 block text-[10px]">POSTAL CODE</span>
                                    <span className="text-white">{loc?.postalCode || '500033'}</span>
                                  </div>
                                  <div>
                                    <span className="text-neutral-500 block text-[10px]">GPS ACCURACY</span>
                                    <span className="text-emerald-400 font-bold">±{loc?.accuracy || 15}m</span>
                                  </div>
                                </div>

                                <div className="pt-2 text-[11px] font-mono text-neutral-400">
                                  <span className="text-neutral-500">EXACT COORDINATES: </span>
                                  <span className="text-amber-400 font-bold">
                                    {lat.toFixed(6)}, {lng.toFixed(6)}
                                  </span>
                                </div>
                              </div>

                              {/* Navigation Action Buttons */}
                              <div className="flex flex-wrap gap-2.5 pt-1">
                                <a
                                  href={mapsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-2.5 rounded-xl bg-gradient-brand text-white font-space font-bold text-xs uppercase tracking-wider hover:brightness-110 transition flex items-center space-x-2 shadow-lg"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  <span>Open in Google Maps</span>
                                </a>

                                <button
                                  type="button"
                                  onClick={() => handleCopyCoordinates(b.id, lat, lng)}
                                  className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-white font-space font-bold text-xs transition flex items-center space-x-2"
                                >
                                  {copiedCoordsId === b.id ? (
                                    <>
                                      <Check className="w-4 h-4 text-emerald-400" />
                                      <span className="text-emerald-400">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-4 h-4 text-amber-400" />
                                      <span>Copy Coordinates</span>
                                    </>
                                  )}
                                </button>

                                <a
                                  href={navUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-space font-bold text-xs uppercase tracking-wider transition flex items-center space-x-2"
                                >
                                  <Navigation className="w-4 h-4 fill-white" />
                                  <span>Open Navigation</span>
                                </a>
                              </div>
                            </div>

                            {/* Right Column: Embedded Map Viewport */}
                            <div className="w-full lg:w-80 h-60 lg:h-auto rounded-2xl border border-neutral-800 overflow-hidden relative bg-neutral-950 shrink-0 shadow-inner">
                              {hasValidKey ? (
                                <APIProvider apiKey={API_KEY} version="weekly">
                                  <Map
                                    defaultCenter={{ lat, lng }}
                                    center={{ lat, lng }}
                                    defaultZoom={16}
                                    zoom={16}
                                    mapId={`ADMIN_MAP_${b.id}`}
                                    internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                                    style={{ width: '100%', height: '100%' }}
                                  >
                                    <AdvancedMarker position={{ lat, lng }} title={loc?.venueName || b.customerName}>
                                      <Pin background="#FF3B00" glyphColor="#FFFFFF" borderColor="#FFA800" />
                                    </AdvancedMarker>
                                  </Map>
                                </APIProvider>
                              ) : (
                                <div className="w-full h-full relative bg-neutral-950 flex flex-col items-center justify-center p-4 text-center space-y-2">
                                  <div className="absolute inset-0 bg-[radial-gradient(#ff3b00_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
                                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400 z-10 shadow-lg">
                                    <MapPin className="w-5 h-5 animate-bounce" />
                                  </div>
                                  <div className="z-10 space-y-1">
                                    <span className="font-space font-bold text-xs text-white block">Shoot Pin Selected</span>
                                    <span className="text-[10px] text-amber-400 font-mono block">
                                      {lat.toFixed(6)}, {lng.toFixed(6)}
                                    </span>
                                  </div>
                                </div>
                              )}

                              <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-neutral-800 text-[10px] font-mono text-neutral-300 flex items-center justify-between">
                                <span>📍 {loc?.city || 'Shoot Site'}</span>
                                <a
                                  href={mapsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-amber-400 hover:underline flex items-center space-x-1"
                                >
                                  <span>View Map</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Promo Coupons */}
        {activeTab === 'coupons' && (
          <div className="glass-card p-6 rounded-3xl border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-space text-sm font-bold text-white">Active Promo Coupons</h3>
                <p className="text-xs text-neutral-400">Discount codes for wedding and corporate events</p>
              </div>
              <button className="px-4 py-2 rounded-xl bg-gradient-brand text-white font-space font-bold text-xs uppercase tracking-wider">
                + Create New Coupon
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex justify-between items-center">
                <div>
                  <span className="font-mono text-amber-400 font-bold text-sm">WEDDING2026</span>
                  <p className="text-xs text-neutral-400">₹2,000 Flat OFF on Grand Wedding Pack</p>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full">ACTIVE</span>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex justify-between items-center">
                <div>
                  <span className="font-mono text-amber-400 font-bold text-sm">SNAPFIRST</span>
                  <p className="text-xs text-neutral-400">10% OFF for First-time Instant Bookings</p>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full">ACTIVE</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
