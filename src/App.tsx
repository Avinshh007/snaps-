import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Loader } from './components/Loader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Packages } from './components/Packages';
import { Gallery } from './components/Gallery';
import { ReelPlayerModal } from './components/ReelPlayerModal';
import { BookingSystem } from './components/BookingSystem';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { Booking, EventCategory, TimeSlotId } from './types';
import { INITIAL_BOOKINGS } from './data/mockData';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    return typeof window !== 'undefined' && window.location.pathname === '/admin';
  });

  // Application State Data
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('snap_stories_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPreselects, setBookingPreselects] = useState<{
    date?: string;
    slot?: TimeSlotId;
    category?: EventCategory;
  }>({});

  const [activeReelModal, setActiveReelModal] = useState<{
    title: string;
    creatorName: string;
    creatorAvatar: string;
    thumbnail: string;
    views?: string;
    likes?: string;
  } | null>(null);

  // Quick filters from Hero
  const [heroCityFilter, setHeroCityFilter] = useState('');
  const [heroEventFilter, setHeroEventFilter] = useState('');

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('snap_stories_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenPackageBooking = (packageName: string, category: EventCategory, price: number) => {
    setBookingPreselects({
      category,
    });
    setIsBookingOpen(true);
  };

  const handleQuickHeroFilter = (city: string, eventType: string) => {
    setHeroCityFilter(city);
    setHeroEventFilter(eventType);
    handleNavigate('packages');
  };

  const handleAddBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-black text-white font-inter selection:bg-[#FF3B00] selection:text-white transition-colors duration-300">
        {/* 1. Premium Animated Page Loader */}
        {loading && <Loader onComplete={() => setLoading(false)} />}

        {!loading && (
          <>
            {/* 2. Glassmorphic Navigation Bar */}
            <Navbar
              activeSection={activeSection}
              onNavigate={handleNavigate}
              onOpenBooking={() => {
                setBookingPreselects({});
                setIsBookingOpen(true);
              }}
            />

            {/* 3. Hero Section */}
            <Hero
              onOpenBooking={() => {
                setBookingPreselects({});
                setIsBookingOpen(true);
              }}
              onExploreCreators={() => handleNavigate('packages')}
              onQuickFilter={handleQuickHeroFilter}
            />

            {/* 4. Why Choose Snap Stories */}
            <WhyChooseUs />

            {/* 5. Packages */}
            <Packages onSelectPackageBooking={handleOpenPackageBooking} />

            {/* 6. Gallery */}
            <Gallery onOpenReelModal={(reel) => setActiveReelModal(reel)} />

            {/* 7. Testimonials */}
            <Testimonials
              onPlayVideoTestimonial={(event, clientName, avatar, thumbnail) =>
                setActiveReelModal({
                  title: `${event} Client Review`,
                  creatorName: clientName,
                  creatorAvatar: avatar,
                  thumbnail,
                  views: '450K',
                  likes: '32K',
                })
              }
            />

            {/* 8. FAQ Accordions */}
            <FAQ />

            {/* 9. Luxury Footer */}
            <Footer
              onNavigate={handleNavigate}
              onOpenBooking={() => {
                setBookingPreselects({});
                setIsBookingOpen(true);
              }}
            />

            {/* Reel Video Player Modal */}
            <ReelPlayerModal
              reel={activeReelModal}
              onClose={() => setActiveReelModal(null)}
              onBookCreator={() => {
                setIsBookingOpen(true);
              }}
            />

            {/* Step-by-Step Booking Wizard */}
            <BookingSystem
              isOpen={isBookingOpen}
              onClose={() => setIsBookingOpen(false)}
              preselectedDate={bookingPreselects.date}
              preselectedSlot={bookingPreselects.slot}
              preselectedCategory={bookingPreselects.category}
              onBookingConfirmed={handleAddBooking}
            />

            {/* Admin Dashboard */}
            {isAdminOpen && (
              <AdminDashboard bookings={bookings} onClose={() => setIsAdminOpen(false)} />
            )}
          </>
        )}
      </div>
    </ThemeProvider>
  );
}
