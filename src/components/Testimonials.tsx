import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TESTIMONIALS } from '../data/mockData';
import { Star, Play, CheckCircle2, Sparkles, MessageCircleHeart, Instagram, ExternalLink } from 'lucide-react';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { TestimonialCard, TestimonialScreenshot } from './Testimonials/TestimonialCard';
import { TestimonialModal } from './Testimonials/TestimonialModal';

// Import Screenshot Review Images from Assets
import review1 from '../assets/testimonials/review1.png';
import review2 from '../assets/testimonials/review2.png';
import review3 from '../assets/testimonials/review3.png';
import review4 from '../assets/testimonials/review4.png';
import review5 from '../assets/testimonials/review5.png';

interface TestimonialsProps {
  onPlayVideoTestimonial: (title: string, clientName: string, avatar: string, thumbnail: string) => void;
}

// Screenshot Testimonial Data Set
const SCREENSHOT_TESTIMONIALS: TestimonialScreenshot[] = [
  {
    id: 'sc-1',
    image: review1,
    clientName: 'Bhargava Veduru & Team',
    eventType: 'Wedding Reel Edit',
    rating: 5,
    highlightText: 'Quality is too good as well as the editing... First client, first smile! So grateful!',
    platform: 'WhatsApp',
  },
  {
    id: 'sc-2',
    image: review2,
    clientName: 'Nihal & Ananya',
    eventType: 'Anniversary Special Reel',
    rating: 5,
    highlightText: 'Baboi ah clarity yekda... Super Bro... Pichi lepav!',
    platform: 'WhatsApp',
  },
  {
    id: 'sc-3',
    image: review3,
    clientName: 'Bhargav & Family',
    eventType: 'First Event Reel',
    rating: 5,
    highlightText: 'Super Bhargav... Excellent... Nak ela kavalanukunnano ala vachindi!',
    platform: 'WhatsApp',
  },
  {
    id: 'sc-4',
    image: review4,
    clientName: 'SnapStories Client',
    eventType: 'Event Reel Shoot',
    rating: 5,
    highlightText: 'Hard work pays off – another client crushing it with SnapStories! Chala satisfied!',
    platform: 'WhatsApp',
  },
  {
    id: 'sc-5',
    image: review5,
    clientName: 'Range Rover Event Client',
    eventType: 'Car & Event Shoot',
    rating: 5,
    highlightText: 'Super andi... Chla baga chasaru... Thank you so much for the lovely feedback!',
    platform: 'WhatsApp',
  },
];

export const Testimonials: React.FC<TestimonialsProps> = ({ onPlayVideoTestimonial }) => {
  // Modal & Audio state management
  const [modalOpen, setModalOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  // Background Music Hook (Soft romantic instrumental with 2s fade-in & fade-out)
  const { playMusic, stopMusic, preloadAudio } = useBackgroundMusic();

  const handleOpenScreenshot = (index: number) => {
    setActiveIdx(index);
    setModalOpen(true);
    playMusic();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    stopMusic();
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % SCREENSHOT_TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + SCREENSHOT_TESTIMONIALS.length) % SCREENSHOT_TESTIMONIALS.length);
  };

  return (
    <section id="testimonials" className="py-24 bg-black relative select-none">
      {/* Cinematic Ambient Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-10 w-[450px] h-[450px] bg-gradient-to-tr from-[#FF3B00]/15 via-transparent to-transparent rounded-full blur-[130px]" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#FFB000]/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Header: Loved By Brides & Brands */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>4.9/5 Star Client Satisfaction</span>
          </div>
          <h2 className="font-bebas text-4xl sm:text-6xl text-white uppercase tracking-tight">
            Loved By <span className="text-gradient">Brides & Brands</span>
          </h2>
          <p className="font-inter text-neutral-400 text-sm mt-3">
            Real stories from clients who captured their dream moments with Snap Stories Reel Creators.
          </p>
        </div>

        {/* 1. Top 3 Video & Featured Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="glass-card glass-card-hover rounded-3xl p-6 border border-neutral-800/80 flex flex-col justify-between relative group"
            >
              {/* Video Thumbnail Header */}
              {t.hasVideo && t.videoThumbnail && (
                <div
                  onClick={() =>
                    onPlayVideoTestimonial(t.event, t.clientName, t.avatar, t.videoThumbnail!)
                  }
                  className="relative h-44 rounded-2xl overflow-hidden mb-6 cursor-pointer border border-neutral-800 group-hover:border-orange-500 transition-colors"
                >
                  <img
                    src={t.videoThumbnail}
                    alt={t.clientName}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-mono text-amber-300">
                    Video Review
                  </span>
                </div>
              )}

              {/* Rating Stars */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Comment text */}
              <p className="font-inter text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6 flex-1 italic">
                "{t.comment}"
              </p>

              {/* Client Info Footer */}
              <div className="flex items-center space-x-3 pt-4 border-t border-neutral-800/80">
                <img
                  src={t.avatar}
                  alt={t.clientName}
                  loading="lazy"
                  className="w-10 h-10 rounded-full object-cover border border-amber-500"
                />
                <div>
                  <h4 className="font-space font-bold text-sm text-white flex items-center space-x-1">
                    <span>{t.clientName}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  </h4>
                  <p className="text-[11px] font-mono text-neutral-400">
                    {t.clientRole} • {t.event} ({t.city})
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 2. Real Client Screenshot Reviews Grid Section */}
        <div className="pt-8 border-t border-neutral-900">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-orange-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
                <MessageCircleHeart className="w-3.5 h-3.5 text-orange-400" />
                <span>Verified WhatsApp & Instagram Feedback</span>
              </div>
              <h3 className="font-bebas text-3xl sm:text-5xl text-white uppercase tracking-tight">
                Client Chat <span className="text-gradient">Screenshots</span>
              </h3>
            </div>

            {/* Direct Link to Instagram Page */}
            <a
              href="https://www.instagram.com/snaps._.stories?igsh=aWZ4OGMycDZrZjB6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-space font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-pink-500/25 hover:scale-105 transition-all duration-300 group shrink-0"
            >
              <Instagram className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-300" />
              <span>See More on Instagram @snaps._.stories</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Screenshot Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {SCREENSHOT_TESTIMONIALS.map((item, idx) => (
              <TestimonialCard
                key={item.id}
                testimonial={item}
                index={idx}
                onClick={() => handleOpenScreenshot(idx)}
              />
            ))}
          </div>

          {/* Bottom Instagram Banner CTA */}
          <div className="mt-12 text-center">
            <a
              href="https://www.instagram.com/snaps._.stories?igsh=aWZ4OGMycDZrZjB6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 px-6 py-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-pink-500/50 text-neutral-300 hover:text-white font-space font-medium text-xs tracking-wider transition-all duration-300 shadow-xl group"
            >
              <Instagram className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
              <span>Follow <strong>@snaps._.stories</strong> on Instagram for Live Client Stories & Highlights</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. Fullscreen Lightbox Modal with Background Music */}
      <TestimonialModal
        isOpen={modalOpen}
        currentIndex={activeIdx}
        testimonials={SCREENSHOT_TESTIMONIALS}
        onClose={handleCloseModal}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </section>
  );
};
