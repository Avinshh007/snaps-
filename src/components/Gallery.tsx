import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GALLERY_ITEMS } from '../data/mockData';
import { Play, Eye, Heart, Flame } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');

  const categories = [
    'All',
    'Wedding',
    'Haldi',
    'Product Shoot',
    'Engagement',
  ];

  const filteredItems =
    activeTab === 'All'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeTab);

  return (
    <section id="gallery" className="py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5" />
            <span>Instagram Reels</span>
          </div>

          <h2 className="font-bebas text-4xl sm:text-6xl text-white uppercase tracking-tight">
            Viral <span className="text-gradient">Reels Gallery</span>
          </h2>

          <p className="font-inter text-neutral-400 text-sm mt-3">
            Click any thumbnail to watch the original Instagram Reel.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-full text-xs font-space font-semibold transition ${activeTab === cat
                  ? 'bg-gradient-brand text-white'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}

              onClick={() =>
                window.open(item.instagramUrl, "_blank")
              }

              className="group relative aspect-[9/16] rounded-3xl overflow-hidden cursor-pointer border border-neutral-800 hover:border-orange-500 transition-all duration-500"
            >

              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded-full text-xs text-white">
                {item.category}
              </div>

              <div className="absolute inset-0 flex items-center justify-center">

                <div className="w-16 h-16 rounded-full bg-gradient-brand flex items-center justify-center">

                  <Play className="text-white fill-white ml-1" />

                </div>

              </div>

              <div className="absolute bottom-4 left-4 right-4">

                <div className="flex items-center space-x-2 mb-2">

                  <img
                    src={item.creatorAvatar}
                    className="w-8 h-8 rounded-full"
                  />

                  <span className="text-white text-xs">
                    {item.creatorName}
                  </span>

                </div>

                <h3 className="text-white font-bold mb-2">
                  {item.title}
                </h3>

                <div className="flex gap-4 text-neutral-300 text-xs">

                  <span className="flex items-center gap-1">
                    <Eye size={14} />
                    {item.views}
                  </span>

                  <span className="flex items-center gap-1">
                    <Heart size={14} />
                    {item.likes}
                  </span>

                </div>

              </div>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
};