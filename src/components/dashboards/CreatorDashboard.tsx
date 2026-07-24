import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Booking } from '../../types';
import {
  Camera,
  MapPin,
  ExternalLink,
  Navigation,
  CheckCircle2,
  Clock,
  User,
  Phone,
  ShieldCheck,
  Calendar,
  X,
  Compass,
  Copy,
  Check,
  Car,
  RefreshCw,
  Sparkles,
  Award,
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

// Default creator studio base: Jubilee Hills, Hyderabad
const CREATOR_DEFAULT_BASE = { lat: 17.4325, lng: 78.4071 };

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

interface CreatorDashboardProps {
  bookings: Booking[];
  onClose: () => void;
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({ bookings, onClose }) => {
  const [selectedBookingId, setSelectedBookingId] = useState<string>(bookings[0]?.id || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Creator's live coordinates for distance matrix math
  const [creatorCoords, setCreatorCoords] = useState<{ lat: number; lng: number }>(CREATOR_DEFAULT_BASE);
  const [isLocatingCreator, setIsLocatingCreator] = useState(false);
  const [creatorLocStatus, setCreatorLocStatus] = useState<string | null>(null);

  const selectedBooking = bookings.find((b) => b.id === selectedBookingId) || bookings[0];

  // Request creator's current location for travel distance calculation
  const handleDetectCreatorLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocatingCreator(true);
    setCreatorLocStatus('Detecting creator base position...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCreatorCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocatingCreator(false);
        setCreatorLocStatus('Creator GPS active');
      },
      () => {
        setIsLocatingCreator(false);
        setCreatorLocStatus('Using default studio base');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  useEffect(() => {
    handleDetectCreatorLocation();
  }, []);

  const handleCopyCoords = (lat: number, lng: number, id: string) => {
    navigator.clipboard.writeText(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-[140] bg-black/95 backdrop-blur-2xl text-white overflow-y-auto flex flex-col font-inter">
      {/* Header */}
      <div className="p-6 border-b border-neutral-800 bg-[#0d0d0d] flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-brand flex items-center justify-center text-white shadow-lg">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bebas text-2xl tracking-wide text-white">SNAP STORIES CREATOR PORTAL</h2>
            <p className="text-[10px] font-mono text-amber-400 uppercase">Assigned Reel Shoots & Navigation</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-white text-neutral-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto w-full p-6 space-y-8 flex-1">
        {/* Top Status & Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-5 rounded-3xl border border-neutral-800">
            <div className="text-[10px] font-mono text-neutral-400 uppercase">Assigned Shoots</div>
            <div className="font-bebas text-3xl text-gradient mt-1">{bookings.length} Events</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1">Confirmed Shoot Schedule</div>
          </div>

          <div className="glass-card p-5 rounded-3xl border border-neutral-800">
            <div className="text-[10px] font-mono text-neutral-400 uppercase">Master Equipment</div>
            <div className="font-bebas text-3xl text-amber-400 mt-1">4K Cinema Ready</div>
            <div className="text-[10px] text-amber-400 font-mono mt-1">Gimbal & Slow-Mo Master</div>
          </div>

          <div className="glass-card p-5 rounded-3xl border border-neutral-800">
            <div className="text-[10px] font-mono text-neutral-400 uppercase">GPS Navigation Engine</div>
            <div className="font-bebas text-3xl text-white mt-1">Turn-by-Turn</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1">Direct Google Maps Dispatch</div>
          </div>
        </div>

        {/* Shoot Selector & Location Inspector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Assigned Bookings List (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-space text-sm font-bold text-white flex items-center justify-between">
              <span>Assigned Shoot List</span>
              <span className="text-[10px] font-mono text-amber-400">Select to View Map</span>
            </h3>

            <div className="space-y-3">
              {bookings.map((b) => {
                const isSelected = b.id === selectedBookingId;
                const loc = b.eventLocation;
                const distKm = loc
                  ? calculateDistanceKm(creatorCoords.lat, creatorCoords.lng, loc.latitude, loc.longitude)
                  : 4.2;

                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBookingId(b.id)}
                    className={`w-full text-left p-4 rounded-3xl border transition space-y-2 relative overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500/10 via-neutral-900 to-neutral-900 border-amber-500/60 shadow-[0_0_20px_rgba(255,176,0,0.15)]'
                        : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-amber-400 font-bold">{b.bookingNumber}</span>
                      <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                        {b.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-space font-bold text-sm text-white">{b.eventType}</h4>
                      <p className="text-xs text-neutral-300 font-inter">
                        👤 {b.customerName} ({b.customerPhone})
                      </p>
                    </div>

                    <div className="text-[11px] font-mono text-neutral-400 flex items-center justify-between pt-1 border-t border-neutral-800/80">
                      <span>📍 {loc?.city || 'Shoot Venue'}</span>
                      <span className="text-amber-400 font-bold flex items-center space-x-1">
                        <Car className="w-3 h-3" />
                        <span>{distKm} km</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Location Inspection & Navigation Card (8 Cols) */}
          {selectedBooking && (
            <div className="lg:col-span-8 space-y-6">
              {(() => {
                const b = selectedBooking;
                const loc = b.eventLocation;
                const sLat = loc?.latitude || 17.4325;
                const sLng = loc?.longitude || 78.4071;

                const distKm = calculateDistanceKm(creatorCoords.lat, creatorCoords.lng, sLat, sLng);
                const estTravelMins = Math.round((distKm / 25) * 60 + 2); // 25km/h avg speed + buffer

                const googleMapsUrl = loc?.googleMapsUrl || `https://www.google.com/maps?q=${sLat},${sLng}`;
                const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${sLat},${sLng}`;

                return (
                  <div className="glass-card p-6 rounded-3xl border border-neutral-800 space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="bg-gradient-brand text-white text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
                            {b.bookingNumber}
                          </span>
                          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold flex items-center space-x-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>VERIFIED SHOOT LOCATION</span>
                          </span>
                        </div>

                        <h3 className="font-space font-bold text-xl text-white mt-1">
                          {b.eventType} Shoot — {b.customerName}
                        </h3>
                        <p className="text-xs text-neutral-400 font-inter">
                          Date: <span className="text-amber-400 font-bold">{b.date}</span> ({b.timeRange}) • Duration: {b.duration || '4 Hours'}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={handleDetectCreatorLocation}
                          disabled={isLocatingCreator}
                          className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs font-mono text-neutral-300 hover:text-white flex items-center space-x-1.5 transition"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isLocatingCreator ? 'animate-spin' : ''}`} />
                          <span>{creatorLocStatus || 'Recalculate Distance'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Customer Contact & Distance Metrics Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-1">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase">Customer Contact:</span>
                        <div className="font-bold text-white flex items-center space-x-1.5">
                          <Phone className="w-3.5 h-3.5 text-amber-400" />
                          <a href={`tel:${b.customerPhone}`} className="hover:underline">
                            {b.customerPhone}
                          </a>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-1">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase">Estimated Distance:</span>
                        <div className="font-bold text-amber-400 font-mono text-sm flex items-center space-x-1.5">
                          <Car className="w-4 h-4 text-amber-400" />
                          <span>{distKm} km away</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-1">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase">Est. Drive Time:</span>
                        <div className="font-bold text-emerald-400 font-mono text-sm flex items-center space-x-1.5">
                          <Clock className="w-4 h-4 text-emerald-400" />
                          <span>~{estTravelMins} mins drive</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Map Viewport Container */}
                    <div className="relative w-full h-72 rounded-3xl border border-neutral-800 overflow-hidden bg-neutral-950 shadow-2xl">
                      {hasValidKey ? (
                        <APIProvider apiKey={API_KEY} version="weekly">
                          <Map
                            defaultCenter={{ lat: sLat, lng: sLng }}
                            center={{ lat: sLat, lng: sLng }}
                            defaultZoom={17}
                            zoom={17}
                            mapId={`CREATOR_MAP_${b.id}`}
                            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                            style={{ width: '100%', height: '100%' }}
                          >
                            <AdvancedMarker position={{ lat: sLat, lng: sLng }} title={loc?.venueName || b.customerName}>
                              <Pin background="#FF3B00" glyphColor="#FFFFFF" borderColor="#FFA800" />
                            </AdvancedMarker>
                          </Map>
                        </APIProvider>
                      ) : (
                        <div className="w-full h-full relative bg-neutral-950 flex flex-col items-center justify-center p-6 text-center space-y-3">
                          <div className="absolute inset-0 bg-[radial-gradient(#ff3b00_1px,transparent_1px)] [background-size:18px_18px] opacity-25" />
                          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400 z-10 shadow-lg">
                            <MapPin className="w-6 h-6 animate-bounce text-amber-400" />
                          </div>

                          <div className="z-10 space-y-1">
                            <h4 className="font-space font-bold text-sm text-white">Shoot Site Location Pin</h4>
                            <p className="text-xs text-amber-400 font-mono font-bold">
                              {sLat.toFixed(6)}, {sLng.toFixed(6)}
                            </p>
                          </div>

                          <div className="z-10 text-xs text-neutral-200 bg-neutral-900/90 border border-neutral-800 px-4 py-2 rounded-2xl max-w-md font-inter line-clamp-2">
                            📍 {loc?.formattedAddress || 'Customer Shoot Location'}
                          </div>
                        </div>
                      )}

                      <div className="absolute bottom-3 left-3 right-3 z-10 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-neutral-800 text-[10px] font-mono text-neutral-300 flex items-center justify-between">
                        <span>📍 {loc?.venueName || 'Shoot Site'}</span>
                        <a
                          href={googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:underline flex items-center space-x-1 font-bold"
                        >
                          <span>Open Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Complete Verified Address Card */}
                    <div className="bg-neutral-900/80 border border-neutral-800 p-5 rounded-3xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                          📍 Verified Customer Shoot Address
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCoords(sLat, sLng, b.id)}
                          className="text-[10px] font-mono text-neutral-400 hover:text-white flex items-center space-x-1"
                        >
                          {copiedId === b.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Coordinates Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-amber-400" />
                              <span>Copy Coordinates ({sLat.toFixed(6)}, {sLng.toFixed(6)})</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="font-space font-bold text-base text-white">
                        {loc?.venueName || 'Selected Shoot Location'}
                      </div>
                      <p className="text-xs text-neutral-200 font-inter leading-relaxed">
                        {loc?.formattedAddress}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-neutral-400 pt-2 border-t border-neutral-800">
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
                    </div>

                    {/* Creator Primary Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <a
                        href={navigationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-space font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:brightness-110 transition flex items-center justify-center space-x-2.5"
                      >
                        <Navigation className="w-4 h-4 fill-white" />
                        <span>Start Turn-by-Turn Navigation</span>
                      </a>

                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-4 rounded-2xl bg-gradient-brand text-white font-space font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(255,59,0,0.4)] hover:brightness-110 transition flex items-center justify-center space-x-2.5"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Open in Google Maps App</span>
                      </a>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
