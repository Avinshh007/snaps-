import React from 'react';
import { motion } from 'motion/react';
import { Zap, ShieldCheck, DollarSign, Camera, Film, Clock, Wand2, Sparkles } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Instant Online Booking',
      desc: 'Lock in top creators for your exact event date and time slot in under 60 seconds with 25% advance.',
      color: 'from-orange-500 to-amber-500',
    },
    {
      icon: ShieldCheck,
      title: '100% Verified Creators',
      desc: 'Rigorous background checks, portfolio verification, and equipment inspection for every creator.',
      color: 'from-red-500 to-orange-500',
    },
    {
      icon: DollarSign,
      title: 'Affordable Packages',
      desc: 'Transparent pricing with no hidden charges. Premium reel creators for every budget requirement.',
      color: 'from-amber-500 to-yellow-500',
    },
    {
      icon: Camera,
      title: 'Professional Equipment',
      desc: 'Sony FX3, RED Komodo, DJI Mavic 3 Drones, 4K Cinema Gimbals & Studio Wireless Audio Systems.',
      color: 'from-orange-600 to-red-500',
    },
    {
      icon: Film,
      title: '4K Cinematic Reels',
      desc: 'Color-graded 9:16 vertical cinema format designed explicitly for high Instagram & YouTube algorithm reach.',
      color: 'from-amber-400 to-orange-500',
    },
    {
      icon: Clock,
      title: 'Ultra-Fast Delivery',
      desc: 'Receive master edited reels within 12 to 24 hours while event hype is live. Same-day AirDrop transfer.',
      color: 'from-red-500 to-amber-500',
    },
    {
      icon: Wand2,
      title: 'Creative Beat-Sync Editing',
      desc: 'Trending audio curation, voiceover integration, custom subtitles, and viral transition choreography.',
      color: 'from-orange-500 to-yellow-400',
    },
    {
      icon: Sparkles,
      title: 'Dedicated Reel Director',
      desc: 'Creators guide poses, dance hooks, and natural candid moments on-site so you look stunning effortlesly.',
      color: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <section id="why-us" className="py-24 bg-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#FF3B00]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Snap Stories Difference</span>
          </div>
          <h2 className="font-bebas text-4xl sm:text-6xl text-white uppercase tracking-tight">
            Why Choose <span className="text-gradient">Snap Stories</span>
          </h2>
          <p className="font-inter text-neutral-400 text-sm sm:text-base mt-3">
            Reinventing event memories. We bring high-end production quality and viral short-form storytelling straight to your phone screen.
          </p>
        </div>

        {/* Features Bento Grid with Framer Motion Staggered Reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.96 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] },
                  },
                }}
                className="glass-card glass-card-hover p-6 rounded-3xl relative group overflow-hidden"
              >
                {/* Top glow border highlight */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} p-0.5 mb-6 flex items-center justify-center shadow-[0_0_20px_rgba(255,59,0,0.2)] group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                <h3 className="font-space font-bold text-lg text-white mb-2 group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>

                <p className="font-inter text-xs text-neutral-400 leading-relaxed">
                  {item.desc}
                </p>

                {/* Subtle bottom gradient accent on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
