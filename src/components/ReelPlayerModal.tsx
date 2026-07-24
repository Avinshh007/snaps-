import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Volume2, VolumeX, Eye, Share2, Sparkles, Flame, CheckCircle2 } from 'lucide-react';

interface ReelPlayerModalProps {
  reel: {
    title: string;
    creatorName: string;
    creatorAvatar: string;
    thumbnail: string;
    views?: string;
    likes?: string;
  } | null;
  onClose: () => void;
  onBookCreator: () => void;
}

export const ReelPlayerModal: React.FC<ReelPlayerModalProps> = ({
  reel,
  onClose,
  onBookCreator,
}) => {
  if (!reel) return null;

  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-2xl">
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/80 hover:bg-neutral-800 text-white border border-neutral-700 transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* 9:16 Vertical Reel Player Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm aspect-[9/16] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 z-10 flex flex-col justify-between"
        >
          {/* Simulated Video Frame */}
          <img
            src={reel.thumbnail}
            alt={reel.title}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Top Overlay Gradient & Audio Control */}
          <div className="relative z-10 p-4 bg-gradient-to-b from-black/80 via-black/30 to-transparent flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="bg-gradient-brand text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                <Flame className="w-3 h-3" />
                <span>SNAP REEL</span>
              </span>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/20 hover:bg-black"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>
          </div>

          {/* Right Side Social Actions Column */}
          <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center space-y-4 text-white">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="flex flex-col items-center group"
            >
              <div className={`p-3 rounded-full backdrop-blur-md border transition ${isLiked ? 'bg-red-600 border-red-500' : 'bg-black/50 border-white/20 hover:bg-black'}`}>
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-white text-white' : 'text-white'}`} />
              </div>
              <span className="text-[10px] font-mono mt-1 font-bold">{reel.likes || '240K'}</span>
            </button>

            <div className="flex flex-col items-center">
              <div className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/20">
                <Eye className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-[10px] font-mono mt-1 font-bold">{reel.views || '1.2M'}</span>
            </div>

            <button className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/20 hover:bg-black">
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Bottom Info Overlay */}
          <div className="relative z-10 p-5 bg-gradient-to-t from-black via-black/80 to-transparent pt-12">
            <div className="flex items-center space-x-2.5 mb-2">
              <img
                src={reel.creatorAvatar}
                alt={reel.creatorName}
                className="w-10 h-10 rounded-full object-cover border-2 border-amber-500"
              />
              <div>
                <div className="flex items-center space-x-1">
                  <span className="font-space font-bold text-xs text-white">
                    {reel.creatorName}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                </div>
                <span className="text-[10px] text-amber-300 font-mono">Verified Snap Stories Reel</span>
              </div>
            </div>

            <h3 className="font-space font-bold text-sm text-white line-clamp-2 mb-3">
              {reel.title}
            </h3>

            <button
              onClick={() => {
                onClose();
                onBookCreator();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-brand text-white font-space font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,59,0,0.5)] hover:brightness-110 transition flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Book Reel Shoot</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
