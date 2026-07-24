import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQS } from '../data/mockData';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string>('faq-1');

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? '' : id);
  };

  return (
    <section id="faq" className="py-24 bg-black relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-bebas text-4xl sm:text-6xl text-white uppercase tracking-tight">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="font-inter text-neutral-400 text-sm mt-3">
            Everything you need to know about booking, slot availability, express reel delivery & equipment.
          </p>
        </div>

        {/* Animated Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="glass-card rounded-2xl border border-neutral-800/80 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between focus:outline-none"
                >
                  <span className="font-space font-bold text-sm sm:text-base text-white">
                    {faq.question}
                  </span>
                  <div
                    className={`p-2 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-gradient-brand text-white border-transparent' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 pb-5 text-xs sm:text-sm text-neutral-400 font-inter leading-relaxed border-t border-neutral-900 pt-3"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
