import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';

interface LoaderProps {
  onComplete: () => void;
}

export const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onComplete(), 400);
          return 100;
        }
        return prev + 5;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
        className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Background atmospheric ambient glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF3B00]/15 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#FFB000]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Lightning strike background flash effect */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-radial from-[#FF3B00]/40 via-transparent to-transparent animate-lightning" />

        {/* Logo Container */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 flex flex-col items-center"
        >
          <Logo size="xl" showSubtitle={true} />

          {/* Loading Progress Bar */}
          <div className="w-64 h-[2px] bg-neutral-900 rounded-full mt-10 overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-brand shadow-[0_0_12px_#FF3B00]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          <div className="flex items-center justify-between w-64 mt-3 text-neutral-500 font-mono text-xs uppercase tracking-wider">
            <span>CINEMATIC EXPERIENCE</span>
            <span className="text-amber-500 font-bold">{progress}%</span>
          </div>
        </motion.div>

        {/* Skip button */}
        <button
          onClick={onComplete}
          className="absolute bottom-8 right-8 text-neutral-500 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors py-2 px-4 border border-neutral-800 rounded-full hover:border-neutral-600"
        >
          Skip Intro →
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
