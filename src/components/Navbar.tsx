import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { User, Role } from '../types';
import { Calendar, UserCheck, Shield, Sparkles, Menu, X, ArrowRight, LogIn, Sun, Moon, Camera } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  currentUser?: User | null;
  onOpenAuth?: (defaultTab?: 'login' | 'register') => void;
  onOpenBooking: () => void;
  onSelectDashboard?: (role: Role) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  currentUser,
  onOpenAuth,
  onOpenBooking,
  onSelectDashboard,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'why-us', label: 'Services' },
    { id: 'packages', label: 'Packages' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'testimonials', label: 'Reviews' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-nav py-3.5 shadow-2xl shadow-black/80'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div onClick={() => onNavigate('home')}>
          <Logo size="md" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 glass-card px-4 py-1.5 rounded-full border-neutral-800/80">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-space font-medium tracking-wide transition-all duration-300 ${
                activeSection === link.id
                  ? 'bg-gradient-brand text-white shadow-[0_0_15px_rgba(255,59,0,0.4)]'
                  : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right CTA / User controls */}
        <div className="hidden sm:flex items-center space-x-3">
          {/* Dark / Light Mode Switcher */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-full border border-neutral-800 hover:border-amber-500/50 bg-neutral-900/60 transition-all text-xs text-neutral-300 hover:text-white group"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
                <span className="hidden xl:inline text-xs font-mono font-medium">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-orange-500 group-hover:-rotate-12 transition-transform duration-300" />
                <span className="hidden xl:inline text-xs font-mono font-medium">Dark</span>
              </>
            )}
          </button>

          {/* Book Creator Button */}
          <button
            onClick={onOpenBooking}
            className="group relative inline-flex items-center justify-center p-0.5 overflow-hidden rounded-full font-medium transition-transform active:scale-95"
          >
            <span className="absolute inset-0 bg-gradient-brand transition-all duration-300 group-hover:opacity-90 shadow-[0_0_20px_rgba(255,59,0,0.5)]" />
            <span className="relative px-5 py-2.5 rounded-full bg-black/40 backdrop-blur-md transition-all duration-300 group-hover:bg-transparent text-white text-xs font-space font-bold uppercase tracking-wider flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Book Creator</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="lg:hidden flex items-center space-x-2">
          <button
            onClick={onOpenBooking}
            className="bg-gradient-brand text-white px-3 py-1.5 rounded-full text-xs font-bold"
          >
            Book
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-300 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-xl border-b border-neutral-800 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-space font-medium ${
                  activeSection === link.id
                    ? 'bg-gradient-brand text-white font-bold'
                    : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-800 space-y-3">
            {/* Theme Toggle Mobile */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
              <span className="text-xs font-mono text-neutral-400">Appearance Theme</span>
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-neutral-800 bg-neutral-900 text-xs font-space font-medium text-amber-400 hover:border-amber-500"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-orange-500" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => {
                onOpenBooking();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 bg-gradient-brand text-white rounded-xl text-xs font-space font-bold uppercase tracking-wider shadow-lg"
            >
              Book Reel Creator Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
