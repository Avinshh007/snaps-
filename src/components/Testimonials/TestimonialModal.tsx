import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Star, ShieldCheck, Sparkles, Volume2, Instagram, ExternalLink } from 'lucide-react';
import { TestimonialScreenshot } from './TestimonialCard';

interface TestimonialModalProps {
  isOpen: boolean;
  currentIndex: number;
  testimonials: TestimonialScreenshot[];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * Component: TestimonialModal
 * Fullscreen lightbox modal with blurred backdrop, floating particle lights,
 * keyboard navigation, active slide counter, and verified client details.
 */
export const TestimonialModal: React.FC<TestimonialModalProps> = ({
  isOpen,
  currentIndex,
  testimonials,
  onClose,
  onPrev,
  onNext,
}) => {
  const currentItem = testimonials[currentIndex];

  // Handle keyboard events (Escape to close, Left/Right for navigation)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === 'ArrowRight') {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || !currentItem) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none">
        {/* Dark & Blurred Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-2xl"
        />

        {/* Floating Light Ambient Glow Effects behind modal */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#FF3B00]/20 rounded-full blur-[140px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#FFB000]/15 rounded-full blur-[140px]" />
          
          {/* Subtle floating sparkle particles */}
          <motion.div
            animate={{ y: [0, -20, 0], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-20 left-20 text-amber-400/40"
          >
            <Sparkles className="w-8 h-8" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute bottom-20 right-20 text-orange-500/40"
          >
            <Sparkles className="w-10 h-10" />
          </motion.div>
        </div>

        {/* Modal Main Wrapper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative z-10 max-w-lg w-full max-h-[90vh] flex flex-col items-center justify-center my-auto"
        >
          {/* Top Control Bar */}
          <div className="w-full flex items-center justify-between mb-3 px-2">
            {/* Slide Counter & Audio Playing Indicator */}
            <div className="flex items-center space-x-3">
              <span className="bg-neutral-900/90 border border-neutral-800 text-white font-mono text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                {currentIndex + 1} / {testimonials.length}
              </span>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono animate-pulse">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Romantic Music Active</span>
              </span>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              title="Close modal (Esc)"
              className="w-10 h-10 rounded-full bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white hover:border-amber-500 hover:bg-neutral-800 flex items-center justify-center transition-all shadow-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Testimonial Image Container */}
          <div className="relative w-full rounded-3xl overflow-hidden glass-card border border-neutral-800/80 shadow-2xl bg-neutral-950 flex flex-col items-center justify-center">
            {/* Sparkle border glow effect */}
            <div className="absolute inset-0 border border-amber-500/30 rounded-3xl pointer-events-none shadow-[0_0_40px_rgba(255,176,0,0.15)]" />

            <div className="relative w-full max-h-[70vh] overflow-y-auto flex justify-center bg-black">
              <motion.img
                key={currentItem.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={currentItem.image}
                alt={`${currentItem.clientName} Review Fullscreen`}
                className="w-auto h-full max-h-[70vh] object-contain mx-auto"
              />
            </div>

            {/* Modal Bottom Detail Bar */}
            <div className="w-full p-4 bg-neutral-900/90 backdrop-blur-md border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-space font-bold text-sm text-white flex items-center space-x-1.5">
                  <span>{currentItem.clientName}</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </h3>
                <p className="text-xs font-mono text-amber-400 mt-0.5">
                  {currentItem.eventType}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <a
                  href="https://www.instagram.com/snaps._.stories?igsh=aWZ4OGMycDZrZjB6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-space font-bold text-[10px] uppercase tracking-wider hover:brightness-110 transition shadow-md"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>@snaps._.stories</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <div className="flex items-center space-x-1">
                  {[...Array(currentItem.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="w-full flex items-center justify-between mt-4 px-2">
            <button
              onClick={onPrev}
              className="flex items-center space-x-1 px-4 py-2 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs font-space font-semibold text-neutral-300 hover:text-white hover:border-amber-500 transition shadow-lg"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={onNext}
              className="flex items-center space-x-1 px-4 py-2 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs font-space font-semibold text-neutral-300 hover:text-white hover:border-amber-500 transition shadow-lg"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
