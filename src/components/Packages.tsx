import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PACKAGE_PRESETS, EVENT_CATEGORIES } from '../data/mockData';
import { CheckCircle2, Sparkles, Clock, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { EventCategory } from '../types';

interface PackagesProps {
  onSelectPackageBooking: (packageName: string, category: EventCategory, price: number) => void;
}

export const Packages: React.FC<PackagesProps> = ({ onSelectPackageBooking }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(PACKAGE_PRESETS.map((p) => p.category)))];

  const filteredPackages =
    selectedCategory === 'All'
      ? PACKAGE_PRESETS
      : PACKAGE_PRESETS.filter((p) => p.category === selectedCategory);

  return (
    <section id="packages" className="py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Experiential Bundles</span>
          </div>
          <h2 className="font-bebas text-4xl sm:text-6xl text-white uppercase tracking-tight">
            Event <span className="text-gradient">Reel Packages</span>
          </h2>
          <p className="font-inter text-neutral-400 text-sm mt-3">
            Fixed transparent pricing with guaranteed 24-hour turnaround, color grading, and custom beat sync.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-space font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-gradient-brand text-white shadow-[0_0_15px_rgba(255,59,0,0.4)]'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Package Grid with Staggered Framer Motion Reveal */}
        <motion.div
          key={selectedCategory}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.12,
                delayChildren: 0.05,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredPackages.map((pkg) => (
            <motion.div
              key={pkg.id}
              variants={{
                hidden: { opacity: 0, y: 35, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className={`glass-card glass-card-hover rounded-3xl overflow-hidden border flex flex-col relative group ${
                pkg.popular
                  ? 'border-amber-500/60 shadow-[0_0_30px_rgba(255,176,0,0.15)] bg-gradient-to-b from-amber-950/20 via-[#181818] to-[#181818]'
                  : 'border-neutral-800/80'
              }`}
            >
              {/* Image banner */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-transparent" />

                {pkg.badge && (
                  <div className="absolute top-3 left-3 bg-gradient-brand text-white text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full shadow-lg flex items-center space-x-1">
                    <Flame className="w-3 h-3" />
                    <span>{pkg.badge}</span>
                  </div>
                )}

                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-neutral-700 text-xs text-neutral-300 font-mono flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{pkg.duration}</span>
                </div>
              </div>

              {/* Package Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold mb-1">
                  {pkg.category}
                </div>
                <h3 className="font-space font-bold text-xl text-white mb-3">{pkg.title}</h3>

                {/* Price Display */}
                <div className="flex items-baseline space-x-2 mb-6 pb-6 border-b border-neutral-800/80">
                  <span className="font-bebas text-4xl text-gradient font-bold">
                    ₹{pkg.price.toLocaleString('en-IN')}
                  </span>
                  {pkg.originalPrice && (
                    <span className="font-mono text-sm text-neutral-500 line-through">
                      ₹{pkg.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full ml-auto">
                    25% ADVANCE LOCK
                  </span>
                </div>

                {/* Deliverables List */}
                <ul className="space-y-3 mb-8 flex-1">
                  {pkg.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-xs text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span className="font-inter">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => onSelectPackageBooking(pkg.title, pkg.category, pkg.price)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-brand text-white font-space font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,59,0,0.3)] hover:brightness-110 active:scale-98 transition flex items-center justify-center space-x-2"
                >
                  <span>Book This Package</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
