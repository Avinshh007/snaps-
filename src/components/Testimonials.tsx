import React from 'react';
import { motion } from 'motion/react';
import { TESTIMONIALS } from '../data/mockData';
import { Star, Play, Quote, CheckCircle2, Sparkles } from 'lucide-react';

interface TestimonialsProps {
  onPlayVideoTestimonial: (title: string, clientName: string, avatar: string, thumbnail: string) => void;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ onPlayVideoTestimonial }) => {
  return (
    <section id="testimonials" className="py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>4.9/5 Star Client Satisfaction</span>
          </div>
          <h2 className="font-bebas text-4xl sm:text-6xl text-white uppercase tracking-tight">
            Loved By <span className="text-gradient">Brides & Brands</span>
          </h2>
          <p className="font-inter text-neutral-400 text-sm mt-3">
            Real stories from clients who captured their dream moments with Snap Stories Reel Creators.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="glass-card glass-card-hover rounded-3xl p-6 border border-neutral-800/80 flex flex-col justify-between relative group"
            >
              {/* Optional Video Thumbnail Header */}
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
      </div>
    </section>
  );
};
