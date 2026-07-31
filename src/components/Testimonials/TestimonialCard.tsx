import React from 'react';
import { motion } from 'motion/react';
import { Star, ShieldCheck, Sparkles, Maximize2 } from 'lucide-react';

export interface TestimonialScreenshot {
  id: string;
  image: string;
  clientName: string;
  eventType: string;
  rating: number;
  highlightText?: string;
  platform?: 'WhatsApp' | 'Instagram' | 'Google';
}

interface TestimonialCardProps {
  testimonial: TestimonialScreenshot;
  index: number;
  onClick: () => void;
}

/**
 * Component: TestimonialCard
 * Renders an individual screenshot review card with glassmorphism, 
 * hover animations, 5-star rating, and verified client badge.
 */
export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  index,
  onClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className="glass-card glass-card-hover rounded-3xl border border-neutral-800/80 overflow-hidden shadow-2xl cursor-pointer group flex flex-col justify-between relative bg-black/60 backdrop-blur-xl"
    >
      {/* Platform & Verified Badge Header */}
      <div className="p-4 flex items-center justify-between border-b border-neutral-800/60 bg-neutral-900/40">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold tracking-wider">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Verified Client</span>
          </span>
        </div>

        {/* 5-Star Rating */}
        <div className="flex items-center space-x-0.5">
          {[...Array(testimonial.rating || 5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          ))}
        </div>
      </div>

      {/* Screenshot Preview with Zoom & Hover Lightbox Icon */}
      <div className="relative aspect-[9/16] max-h-80 overflow-hidden bg-neutral-950 flex items-center justify-center">
        <img
          src={testimonial.image}
          alt={`${testimonial.clientName} Review`}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-300" />

        {/* Hover Lightbox Indicator */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <Maximize2 className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Highlight Quote pill if present */}
        {testimonial.highlightText && (
          <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-neutral-800 text-[11px] font-inter text-neutral-200 line-clamp-2">
            "{testimonial.highlightText}"
          </div>
        )}
      </div>

      {/* Card Footer Details */}
      <div className="p-4 border-t border-neutral-800/60 bg-neutral-900/60 flex items-center justify-between">
        <div>
          <h4 className="font-space font-bold text-xs sm:text-sm text-white flex items-center space-x-1">
            <span>{testimonial.clientName}</span>
          </h4>
          <p className="text-[11px] font-mono text-amber-400/90 mt-0.5">
            {testimonial.eventType}
          </p>
        </div>

        <span className="text-[10px] font-mono text-neutral-400 flex items-center space-x-1 bg-neutral-800/60 px-2 py-1 rounded-lg">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>View Story</span>
        </span>
      </div>
    </motion.div>
  );
};
