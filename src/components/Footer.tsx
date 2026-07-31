import React from 'react';
import { Logo } from './Logo';
import { Instagram, Youtube, Facebook, MessageCircle, ArrowUpRight, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBooking }) => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-neutral-900 pt-20 pb-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF3B00]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-neutral-900">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" showSubtitle={true} />
            <p className="font-inter text-xs text-neutral-400 max-w-sm leading-relaxed">
              Snap Stories is India's premier luxury platform for booking on-demand Instagram Reel Shoots for Weddings, Engagements, Corporate Events & Special Occasions. Express 24-hour delivery in 4K.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-neutral-900 hover:bg-gradient-brand text-neutral-300 hover:text-white transition"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-neutral-900 hover:bg-emerald-600 text-neutral-300 hover:text-white transition"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-neutral-900 hover:bg-red-600 text-neutral-300 hover:text-white transition"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-neutral-900 hover:bg-blue-600 text-neutral-300 hover:text-white transition"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-space text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              Explore Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-inter">
              {['home', 'why-us', 'packages', 'gallery', 'testimonials', 'faq'].map((id) => (
                <li key={id}>
                  <button
                    onClick={() => onNavigate(id)}
                    className="hover:text-white transition capitalize"
                  >
                    {id.replace('-', ' ')}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services / Occasions */}
          <div>
            <h4 className="font-space text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              Special Occasions
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-inter">
              {['Weddings', 'Haldi & Mehendi', 'Engagements', 'Corporate Summits', 'Baby Showers', 'Temple Events'].map(
                (item) => (
                  <li key={item}>
                    <button onClick={onOpenBooking} className="hover:text-white transition">
                      {item}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="font-space text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              Headquarters
            </h4>
            <div className="text-xs text-neutral-400 space-y-2 font-inter">
              <p>📍 KAKINADA</p>
              <p>✉️ bhargav@snapstories.in</p>
              <p>📞 +91 9876543210 (24x7 Support)</p>
            </div>
            <button
              onClick={onOpenBooking}
              className="mt-4 px-4 py-2.5 rounded-full bg-gradient-brand text-white text-xs font-bold uppercase font-space tracking-wider shadow-lg hover:brightness-110 transition inline-flex items-center space-x-1"
            >
              <span>Book Shoot Now</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 font-mono">
          <p>© 2026 SNAP STORIES INC. All Rights Reserved.</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <a href="#terms" className="hover:text-neutral-300">Terms of Service</a>
            <a href="#privacy" className="hover:text-neutral-300">Privacy Policy</a>
            <span className="flex items-center text-amber-500">
              Made with <Heart className="w-3 h-3 mx-1 fill-amber-500" /> for India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
