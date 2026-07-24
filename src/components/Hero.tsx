import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Video, Sparkles, Star, MapPin, Play, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { CITIES, EVENT_CATEGORIES } from '../data/mockData';

interface HeroProps {
  onOpenBooking: () => void;
  onExploreCreators: () => void;
  onQuickFilter: (city: string, eventType: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenBooking,
  onExploreCreators,
  onQuickFilter,
}) => {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickFilter(selectedCity, selectedEvent);
  };

  const counters = [
    { value: '500+', label: 'Reel Shoots Delivered' },
    { value: '10K+', label: 'Reels Created' },
    { value: '50+', label: 'Indian Cities' },
    { value: '4.9★', label: 'Client Rating' },
  ];

  return (
    <section className="relative min-h-screen pt-28 pb-20 flex flex-col justify-center overflow-hidden bg-black select-none">
      {/* Background Cinematic Atmosphere & Lighting */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dark Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f15_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />

        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#FF3B00]/25 via-[#FF6A00]/15 to-transparent rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#FFB000]/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#FF3B00]/15 rounded-full blur-[120px]" />
      </div>

      {/* Floating Animated Icons / Camera / Drone / Reel */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Camera Icon */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-8 md:left-20 hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-md shadow-[0_0_25px_rgba(255,59,0,0.25)] text-orange-500"
        >
          <Camera className="w-7 h-7" />
        </motion.div>

        {/* Floating Drone Icon */}
        <motion.div
          animate={{ y: [0, 18, 0], rotate: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 right-8 md:right-24 hidden sm:flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-md shadow-[0_0_25px_rgba(255,176,0,0.25)] text-amber-400"
        >
          <Video className="w-8 h-8" />
        </motion.div>

        {/* Floating Instagram Reel Icon */}
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [-4, 4, -4] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 left-12 md:left-32 hidden lg:flex items-center justify-center p-3 rounded-2xl bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-orange-900/40 border border-pink-500/30 backdrop-blur-md text-pink-400"
        >
          <div className="flex items-center space-x-2 text-xs font-mono font-bold">
            <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
            <span>INSTAGRAM REELS</span>
          </div>
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
        {/* Top Eyebrow Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-neutral-900/90 border border-amber-500/30 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(255,59,0,0.2)]"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span className="text-xs font-space font-semibold tracking-wider uppercase text-amber-200">
            India's #1 On-Demand Instagram Reel Creator Booking
          </span>
          <span className="bg-gradient-brand text-black font-extrabold text-[10px] px-2 py-0.5 rounded-full">
            LIVE
          </span>
        </motion.div>

        {/* Main Display Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-bebas text-5xl sm:text-7xl lg:text-9xl tracking-tight leading-[0.9] text-white uppercase mb-6"
        >
          Capture Every Moment. <br />
          <span className="text-gradient drop-shadow-[0_0_35px_rgba(255,59,0,0.4)]">
            Create Viral Memories.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto font-inter text-base sm:text-lg md:text-xl text-neutral-300 font-normal leading-relaxed mb-10"
        >
          Book India's Best Instagram Reel Creators for <span className="text-white font-semibold underline decoration-amber-500/50">Weddings</span>, Engagements, Haldi, Corporate Events, and Every Special Occasion. Delivered in 4K within 24 Hours.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-brand text-white font-space font-bold text-sm uppercase tracking-wider shadow-[0_0_35px_rgba(255,59,0,0.4)] hover:shadow-[0_0_50px_rgba(255,59,0,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>Book Reel Shoot</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreCreators}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-700 hover:border-amber-500 font-space font-medium text-sm tracking-wider transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Explore Packages</span>
          </button>
        </motion.div>

        {/* Hero Interactive Quick Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl mx-auto glass-card p-3 sm:p-4 rounded-3xl border border-neutral-800/80 mb-20 shadow-2xl"
        >
          <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative flex items-center bg-black/60 border border-neutral-800 rounded-2xl px-4 py-3">
              <MapPin className="w-5 h-5 text-amber-500 mr-2 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-white focus:outline-none cursor-pointer"
              >
                <option value="" className="bg-neutral-900 text-neutral-400">Select City...</option>
                {CITIES.map((c) => (
                  <option key={c} value={c} className="bg-neutral-900 text-white">{c}</option>
                ))}
              </select>
            </div>

            <div className="relative flex items-center bg-black/60 border border-neutral-800 rounded-2xl px-4 py-3">
              <Camera className="w-5 h-5 text-orange-500 mr-2 shrink-0" />
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-white focus:outline-none cursor-pointer"
              >
                <option value="" className="bg-neutral-900 text-neutral-400">Select Event Type...</option>
                {EVENT_CATEGORIES.map((ev) => (
                  <option key={ev} value={ev} className="bg-neutral-900 text-white">{ev}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-brand text-white font-space font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-2xl hover:brightness-110 transition shadow-[0_0_20px_rgba(255,59,0,0.3)]"
            >
              Search Packages & Slots
            </button>
          </form>
        </motion.div>

        {/* Animated Metrics Counters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8 border-t border-neutral-900"
        >
          {counters.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center p-4 rounded-2xl glass-card">
              <div className="font-bebas text-3xl sm:text-4xl md:text-5xl text-gradient font-bold tracking-tight">
                {item.value}
              </div>
              <div className="text-xs font-inter text-neutral-400 uppercase tracking-widest mt-1">
                {item.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
