import wedding1 from "../assets/reels/wedding1.jpg"
import wedding2 from "../assets/reels/wedding2.jpg"
import babyday from "../assets/reels/babyday.jpg"
import car from "../assets/reels/car.jpg"
import creator from "../assets/reels/creator.jpg"
import { Creator, PackagePreset, GalleryItem, Testimonial, FAQItem, Booking, EventCategory, TimeSlot } from '../types';

export const CITIES = [
  'Mumbai',
  'Delhi NCR',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Jaipur',
  'Goa',
  'Pune',
  'Ahmedabad',
  'Chandigarh',
  'Udaipur'
];

export const EVENT_CATEGORIES: EventCategory[] = [
  'Wedding',
  'Engagement',
  'Reception',
  'Haldi',
  'Mehendi',
  'Birthday',
  'Anniversary',
  'Baby Shower',
  'Housewarming',
  'Corporate Event',
  'Product Shoot',
  'Fashion Shoot',
  'College Event',
  'Other'
];

export const TIME_SLOTS: TimeSlot[] = [
  { id: 'morning', label: 'Morning Slot', timeRange: '6:00 AM - 10:00 AM', available: true },
  { id: 'afternoon', label: 'Afternoon Slot', timeRange: '11:00 AM - 3:00 PM', available: true },
  { id: 'evening', label: 'Evening Prime', timeRange: '4:00 PM - 8:00 PM', available: true },
  { id: 'night', label: 'Night Party', timeRange: '8:00 PM - 12:00 AM', available: true }
];

export const MOCK_CREATORS: Creator[] = [
  {
    id: 'cr-1',
    name: 'Snap stories',
    handle: '@snapstories',
    avatar: creator,
    coverImage: wedding1,
    city: 'Mumbai',
    rating: 4.95,
    reviewsCount: 142,
    experienceYears: 6,
    completedBookings: 210,
    followers: '480K',
    totalViews: '35M+',
    startingPrice: 14999,
    languages: ['Hindi', 'English', 'Marathi'],
    gender: 'Male',
    equipment: ['Sony FX3 Cinema Camera', 'DJI Mavic 3 Cine Drone', 'Gimbal Ronin RS3 Pro', 'Wireless Audio System'],
    specialties: ['Wedding', 'Engagement', 'Reception', 'Haldi', 'Mehendi', 'Fashion Shoot'],
    bio: 'Pioneer in slow-motion emotional wedding storytelling & viral transition reels. Directed over 200+ celebrity & luxury weddings across India & Dubai.',
    verified: true,
    featured: true,
    badges: ['Top Rated 2026', 'Wedding Specialist', '4K Cinema Pro'],
    portfolioVideos: [
      {
        id: 'v1',
        title: 'Royalty at Leela Palace Wedding',
        thumbnail: wedding1,
        views: '2.4M',
        category: 'Wedding'
      },
      {
        id: 'v2',
        title: 'Sunset Haldi Color Burst',
        thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
        views: '1.8M',
        category: 'Haldi'
      },
      {
        id: 'v3',
        title: 'Grand Entrance & Sangeet Beat Sync',
        thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80',
        views: '3.1M',
        category: 'Wedding'
      }
    ],
    packages: [
      {
        id: 'p1',
        name: 'Single Viral Reel Blast',
        price: 14999,
        duration: '4 Hours Coverage',
        reelsCount: 1,
        deliverables: ['1x 4K Master Reel (45s)', 'Color Graded with Trending Audio', 'Color-matched teaser clip', '24-Hour Express Delivery']
      },
      {
        id: 'p2',
        name: 'Grand Event Cinema Pack',
        price: 28999,
        duration: '8 Hours Coverage',
        reelsCount: 3,
        deliverables: ['3x 4K Master Reels', 'Drone Aerial Transitions Included', 'Same-Day Edit Hook Reel', 'Raw Footage AirDrop On-Site'],
        popular: true
      }
    ],
    availableSlots: {
      '2026-07-25': ['morning', 'evening'],
      '2026-07-26': ['afternoon', 'night'],
      '2026-07-27': ['morning', 'afternoon', 'evening']
    }
  },
  {
    id: 'cr-2',
    name: 'Riya Verma',
    handle: '@riya_creatives',
    avatar: creator,
    coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    city: 'Delhi NCR',
    rating: 4.92,
    reviewsCount: 118,
    experienceYears: 5,
    completedBookings: 185,
    followers: '320K',
    totalViews: '28M+',
    startingPrice: 12999,
    languages: ['Telugu', 'English'],
    gender: 'Female',
    equipment: ['Canon R5 C', 'DJI Osmo Pocket 3 Pro', 'Soft RGB Panel Lights', 'Rode Wireless PRO'],
    specialties: ['Engagement', 'Birthday', 'Baby Shower', 'Fashion Shoot', 'Haldi'],
    bio: 'Aesthetic mood reels with organic audio soundscapes. Specializing in intimate candid moments, vibrant bridal entries, and sleek fashion event coverage.',
    verified: true,
    featured: true,
    badges: ['Aesthetic Master', 'Viral Creator', 'Express Delivery'],
    portfolioVideos: [
      {
        id: 'v4',
        title: 'Boho Chic Engagement Vows',
        thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80',
        views: '1.2M',
        category: 'Engagement'
      },
      {
        id: 'v5',
        title: 'Pastel Dream Baby Shower',
        thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
        views: '950K',
        category: 'Baby Shower'
      }
    ],
    packages: [
      {
        id: 'p3',
        name: 'Aesthetic Storytelling Reel',
        price: 12999,
        duration: '3 Hours Coverage',
        reelsCount: 1,
        deliverables: ['1x Ultra-Aesthetic Reel', 'Custom Audio Mix & Voiceover', '12-Hour Rush Delivery']
      },
      {
        id: 'p4',
        name: 'Full Event Reel Trilogy',
        price: 24999,
        duration: '6 Hours Coverage',
        reelsCount: 3,
        deliverables: ['3x Signature Instagram Reels', 'Behind-the-scenes stories Pack', 'Custom Color Preset Applied'],
        popular: true
      }
    ],
    availableSlots: {
      '2026-07-25': ['afternoon', 'night'],
      '2026-07-26': ['morning', 'evening']
    }
  },
  {
    id: 'cr-3',
    name: 'Vikramaditya Roy',
    handle: '@vikram_drone_reels',
    avatar: creator,
    coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    city: 'Bengaluru',
    rating: 4.98,
    reviewsCount: 160,
    experienceYears: 7,
    completedBookings: 240,
    followers: '610K',
    totalViews: '50M+',
    startingPrice: 18999,
    languages: ['English', 'Kannada', 'Hindi', 'Tamil'],
    gender: 'Male',
    equipment: ['Sony A7S III', 'FPV Cinema Drone', 'DJI Mavic 3 Pro', 'Godox Continuous Lights'],
    specialties: ['Wedding', 'Corporate Event', 'Product Shoot', 'College Event', 'Other'],
    bio: 'FPV Drone Reel Director & High-octane camera specialist. Known for breathtaking aerial entry shots, corporate summits, and palace scale celebrations.',
    verified: true,
    featured: true,
    badges: ['FPV Drone Master', '50M+ Views', 'Corporate Lead'],
    portfolioVideos: [
      {
        id: 'v6',
        title: 'Palace Aerial Wedding Flythrough',
        thumbnail: wedding1,
        views: '4.8M',
        category: 'Wedding'
      },
      {
        id: 'v7',
        title: 'Tech Summit Aftermovie Reel',
        thumbnail: wedding1,
        views: '1.5M',
        category: 'Corporate Event'
      }
    ],
    packages: [
      {
        id: 'p5',
        name: 'FPV Aerial Cinematic Reel',
        price: 18999,
        duration: '4 Hours Coverage',
        reelsCount: 1,
        deliverables: ['1x FPV Indoor/Outdoor Flythrough Reel', '4K 60fps Smooth Slow Mo', 'Instant Raw Transfer']
      },
      {
        id: 'p6',
        name: 'Ultimate Destination Experience',
        price: 36999,
        duration: '10 Hours Full Day',
        reelsCount: 4,
        deliverables: ['4x Master Reels (2 Drone + 2 Ground)', 'Same-Night Event Teaser', '4K Drone RAW Clips'],
        popular: true
      }
    ],
    availableSlots: {
      '2026-07-25': ['morning', 'afternoon', 'evening', 'night'],
      '2026-07-28': ['morning', 'night']
    }
  },
  {
    id: 'cr-4',
    name: 'Ananya Deshmukh',
    handle: '@ananya_glam_reels',
    avatar: creator,
    coverImage: wedding1,
    city: 'Hyderabad',
    rating: 4.89,
    reviewsCount: 94,
    experienceYears: 4,
    completedBookings: 130,
    followers: '210K',
    totalViews: '18M+',
    startingPrice: 11999,
    languages: ['Telugu', 'Hindi', 'English'],
    gender: 'Female',
    equipment: ['Sony A7 IV', 'Gimbal Scorp Pro', 'Softbox Studio Light', 'DJI Mic 2'],
    specialties: ['Haldi', 'Mehendi', 'Engagement', 'Birthday', 'Housewarming'],
    bio: 'Capturing joyful colors, intricate mehendi details, and lively dance reels. Expertise in traditional Telugu & South Indian celebrations.',
    verified: true,
    featured: false,
    badges: ['Traditional Expert', 'Quick Turnaround'],
    portfolioVideos: [
      {
        id: 'v8',
        title: 'Nizam Palace Mehendi Magic',
        thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
        views: '1.1M',
        category: 'Mehendi'
      }
    ],
    packages: [
      {
        id: 'p7',
        name: 'Cultural Celebration Reel',
        price: 11999,
        duration: '4 Hours Coverage',
        reelsCount: 1,
        deliverables: ['1x Vibrant 4K Reel', 'Custom Folk/Trending Beat Sync', '24h Delivery']
      }
    ],
    availableSlots: {
      '2026-07-26': ['morning', 'afternoon']
    }
  },
  {
    id: 'cr-5',
    name: 'Karan Mehra',
    handle: '@karan_cinematics',
    avatar: creator,
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    city: 'Jaipur',
    rating: 4.96,
    reviewsCount: 175,
    experienceYears: 8,
    completedBookings: 290,
    followers: '550K',
    totalViews: '42M+',
    startingPrice: 19999,
    languages: ['Hindi', 'English', 'Rajasthani'],
    gender: 'Male',
    equipment: ['RED Komodo 6K', 'Zeiss Cinema Lenses', 'DJI Mavic 3 Pro', 'Aputure 300d Lights'],
    specialties: ['Wedding', 'Reception', 'Fashion Shoot', 'Product Shoot', 'Other'],
    bio: 'Palace wedding cinema director based in Jaipur. Known for royal color grading, dramatic lighting, and high-impact reel trailers.',
    verified: true,
    featured: true,
    badges: ['Royal Palace Specialist', '6K Cinema Director', 'Top Rated'],
    portfolioVideos: [
      {
        id: 'v9',
        title: 'Rambagh Palace Heritage Wedding',
        thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
        views: '5.2M',
        category: 'Wedding'
      }
    ],
    packages: [
      {
        id: 'p8',
        name: 'Royal Heritage Package',
        price: 19999,
        duration: '5 Hours Coverage',
        reelsCount: 2,
        deliverables: ['2x 6K Master Reels', 'Royal Color Grade', 'Drone Aerial Views', 'Express Delivery']
      }
    ],
    availableSlots: {
      '2026-07-27': ['morning', 'afternoon', 'evening']
    }
  },
  {
    id: 'cr-6',
    name: 'Siddharth & Rhea',
    handle: '@duo_stories',
    avatar: creator,
    coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    city: 'Goa',
    rating: 4.97,
    reviewsCount: 130,
    experienceYears: 5,
    completedBookings: 190,
    followers: '410K',
    totalViews: '31M+',
    startingPrice: 16999,
    languages: ['English', 'Hindi', 'Konkani'],
    gender: 'Male',
    equipment: ['Dual Sony A7S III Setup', 'Underwater Housing', 'DJI Mini 4 Pro', 'Rode Wireless'],
    specialties: ['Wedding', 'Engagement', 'Fashion Shoot', 'Anniversary', 'Other'],
    bio: 'India’s premier duo reel creators for Beach & Destination Weddings in Goa, Udaipur, and Kerala. 2x camera angles captured simultaneously!',
    verified: true,
    featured: true,
    badges: ['Duo Camera Team', 'Beach Wedding Lead'],
    portfolioVideos: [
      {
        id: 'v10',
        title: 'Sunset Beach Vows in North Goa',
        thumbnail: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80',
        views: '2.9M',
        category: 'Wedding'
      }
    ],
    packages: [
      {
        id: 'p9',
        name: 'Duo Beach Sunset Special',
        price: 16999,
        duration: '4 Hours Coverage',
        reelsCount: 2,
        deliverables: ['2x Reels (Dual Angle Edit)', 'Drone Beach Overhead Shots', 'Same-Day Reel Drop']
      }
    ],
    availableSlots: {
      '2026-07-25': ['evening', 'night'],
      '2026-07-26': ['afternoon', 'evening']
    }
  }
];

export const PACKAGE_PRESETS: PackagePreset[] = [
  {
    id: 'pkg-1',
    title: 'Wedding Reel Deluxe',
    category: 'Wedding',
    price: 24999,
    originalPrice: 32000,
    duration: '8 Hours Full Event Coverage',
    deliverables: [
      '3x 4K Master Instagram Reels (45-60s)',
      'Drone Aerial Entry & Vows Coverage',
      'Trending Audio & Voiceover Sync',
      'Raw Footage AirDrop On-Site',
      'Guaranteed 24-Hour Express Delivery'
    ],
    badge: 'Most Popular',
    popular: true,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pkg-2',
    title: 'Engagement & Roka Magic',
    category: 'Engagement',
    price: 14999,
    originalPrice: 19000,
    duration: '4 Hours Ring Ceremony Coverage',
    deliverables: [
      '2x Aesthetic Ultra-HD Reels',
      'Slow-Motion Ring Exchange & Reactions',
      'Custom Color Preset Applied',
      'Next-Day Reel Release'
    ],
    badge: 'Best Value',
    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pkg-3',
    title: 'Haldi & Mehendi Color Blast',
    category: 'Haldi',
    price: 12999,
    originalPrice: 16500,
    duration: '4 Hours Fun & Flowers Coverage',
    deliverables: [
      '2x High-Energy Beat Synced Reels',
      'Macro Shot Mehendi Details & Flower Shower',
      'Express Edit within 18 Hours'
    ],
    badge: 'Trending',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pkg-4',
    title: 'Corporate Summit & Keynote',
    category: 'Corporate Event',
    price: 18999,
    originalPrice: 24000,
    duration: '6 Hours Conference / Launch',
    deliverables: [
      '2x LinkedIn & IG Professional Reels',
      'Speaker Highlights & Crowd Energy',
      'Custom Subtitles & Brand Watermark',
      '48-Hour Turnaround'
    ],
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pkg-5',
    title: 'Luxury Birthday Bash',
    category: 'Birthday',
    price: 9999,
    originalPrice: 13500,
    duration: '3 Hours Evening Party',
    deliverables: [
      '1x High-Energy Party Hype Reel',
      'Cake Cutting & Slow-Mo Cheers',
      '24-Hour Express Edit'
    ],
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pkg-6',
    title: 'Temple Event & Seva Reel',
    category: 'Other',
    price: 11999,
    originalPrice: 15000,
    duration: '4 Hours Sacred Event Coverage',
    deliverables: [
      '1x Devotional High-Definition Reel',
      'Soothing Ambient Audio & Chants',
      '4K Resolution Deliverable'
    ],
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pkg-7',
    title: 'FPV Drone Reel Director',
    category: 'Wedding',
    price: 29999,
    originalPrice: 38000,
    duration: '6 Hours Aerial Focus',
    deliverables: [
      '2x FPV Indoor/Outdoor Flythrough Reels',
      '1x Cinema Ground Reel',
      '4K 60fps Ultra Smooth Raw Footage'
    ],
    badge: 'Exclusive',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pkg-8',
    title: 'Baby Shower & Gender Reveal',
    category: 'Baby Shower',
    price: 10999,
    originalPrice: 14000,
    duration: '3 Hours Celebration Coverage',
    deliverables: [
      '1x Emotionally Touched Reel',
      'Custom Soft Color Grading',
      '24-Hour Delivery'
    ],
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Great Indian Wedding',
    category: 'Wedding',
    creatorName: 'snap stories',
    creatorAvatar: creator,
    thumbnail: wedding1,
    instagramUrl: 'https://www.instagram.com/reel/DaxnbhEzfAb/?igsh=MW1mM2wydDM3cWJqcg==',
    isReel: true,
    aspectRatio: '9:16'
  },
  {
    id: 'g-2',
    title: 'Night sangeet',
    category: 'Haldi',
    creatorName: 'Snap stories',
    creatorAvatar: creator,
    thumbnail: wedding2,
    instagramUrl: 'https://www.instagram.com/reel/DavEXe0T5JK/?igsh=MWVjYTdjd3F4YXpqag%3D%3D',
    isReel: true,
    aspectRatio: '9:16'
  },
  {
    id: 'g-3',
    title: 'Baby girl Birthday Celebration',
    category: 'Wedding',
    creatorName: 'Vikramaditya Roy',
    creatorAvatar: creator,
    thumbnail: babyday,
    instagramUrl: 'https://www.instagram.com/reel/DYOSlT_zqkS/?igsh=MXNicnNkeTUxY2NzcQ==',
    isReel: true,
    aspectRatio: '9:16'
  },
  {
    id: 'g-4',
    title: 'Luxary on wheels range rover',
    category: 'Wedding',
    creatorName: 'snap stories',
    creatorAvatar: creator,
    thumbnail: car,
    instagramUrl: 'https://www.instagram.com/reel/DXf_Qvsk7M0/?igsh=cTNxdmt2eHdzMHht',
    isReel: true,
    aspectRatio: '9:16'
  },
  {
    id: 'g-5',
    title: 'Glitz & Glam Product Launch',
    category: 'Product Shoot',
    creatorName: 'Snap stories',
    creatorAvatar: creator,
    thumbnail: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80',
    isReel: true,
    aspectRatio: '9:16'
  },
  {
    id: 'g-6',
    title: 'Goa Beach Sunset Vows',
    category: 'Wedding',
    creatorName: 'Snap stories',
    creatorAvatar: creator,
    thumbnail: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80',
    isReel: true,
    aspectRatio: '9:16'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    clientName: 'Priya & Rohan Mehta',
    clientRole: 'Bride & Groom',
    event: 'Udaipur Palace Wedding',
    city: 'Udaipur',
    rating: 5,
    comment: 'Snap Stories was the best decision of our entire wedding! Aarav delivered our viral entrance reel in under 12 hours while our guests were still at the reception. It got 1.5 million views on Instagram within 2 days!',
    avatar: creator,
    instagramUrl: 'https://www.instagram.com/reel/DaxnbhEzfAb/?igsh=MW1mM2wydDM3cWJqcg==',
    hasVideo: true,
    videoThumbnail: wedding1
  },
  {
    id: 't-2',
    clientName: 'Vikramaditya Kapoor',
    clientRole: 'Founder & CEO, NexGen AI',
    event: 'Annual Tech Conclave 2026',
    city: 'Bengaluru',
    rating: 5,
    comment: 'We needed a high-impact corporate reel maker who could capture our keynote energy. Snap Stories creator Vikram arrived on time with top-tier FPV gear and delivered 3 master reels that elevated our brand presence immensely.',
    avatar: creator,
    instagramUrl: 'https://www.instagram.com/reel/DaxnbhEzfAb/?igsh=MW1mM2wydDM3cWJqcg==',
    hasVideo: false
  },
  {
    id: 't-3',
    clientName: 'Anushka & Dev',
    clientRole: 'Engagement Couple',
    event: 'Roka Ceremony',
    city: 'Delhi NCR',
    rating: 5,
    comment: 'Super seamless booking system! Selected date, time slot, creator Riya, paid advance online, and everything was handled like clockwork. The reels were so cinematic and romantic!',
    avatar: creator,
    hasVideo: true,
    instagramUrl: 'https://www.instagram.com/reel/DaxnbhEzfAb/?igsh=MW1mM2wydDM3cWJqcg==',
    videoThumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80'
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'General',
    question: 'How is Snap Stories different from booking a traditional photographer?',
    answer: 'Snap Stories is specifically tailored for short-form video content (Instagram Reels, YouTube Shorts, TikToks). Our creators bring specialized mobile and cinema gimbals, trending audio knowledge, viral camera transition techniques, and deliver color-graded 9:16 vertical reels within 12 to 24 hours—so you can post live while event hype is fresh!'
  },
  {
    id: 'faq-2',
    category: 'Booking & Slots',
    question: 'How do time slots work and can I book multiple slots?',
    answer: 'We divide each day into 4 main slots: Morning (6AM-10AM), Afternoon (11AM-3PM), Evening (4PM-8PM), and Night (8PM-12AM). You can book a single slot or combine back-to-back slots for full-day coverage.'
  },
  {
    id: 'faq-3',
    category: 'Delivery',
    question: 'When will I receive my completed Instagram Reels?',
    answer: 'All our creators guarantee express delivery between 12 to 24 hours after the event slot completes. Many creators also provide same-day sneak peeks on-site via AirDrop or direct link transfer.'
  },
  {
    id: 'faq-4',
    category: 'Equipment',
    question: 'What equipment do Snap Stories Reel Creators use?',
    answer: 'Creators use top-of-the-line cinema setups including Sony FX3 / A7S III, RED Komodo, iPhone 15 Pro Max / 16 Pro, DJI Ronin RS3 gimbals, FPV Drones, and wireless studio audio systems.'
  },
  {
    id: 'faq-5',
    category: 'Payments',
    question: 'How does payment work?',
    answer: 'You pay a small 25% advance online via Razorpay, Stripe, UPI, or Cards to instantly lock down the creator for your chosen date and slot. The remaining balance is paid directly after creator arrival on event day.'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-1002',
    bookingNumber: 'SS-2026-9813',
    customerName: 'Meera Kapadia',
    customerEmail: 'meera@example.com',
    customerPhone: '+91 91234 56789',
    creatorId: 'cr-2',
    creatorName: 'Riya Verma',
    creatorAvatar: creator,
    eventType: 'Engagement',
    city: 'Delhi NCR',
    date: '2026-07-25',
    slot: 'afternoon',
    slotLabel: 'Afternoon Slot',
    timeRange: '11:00 AM - 3:00 PM',
    totalAmount: 14999,
    advancePaid: 3750,
    balanceAmount: 11249,
    paymentMethod: 'Card',
    paymentStatus: 'Paid Advance',
    status: 'Confirmed',
    createdAt: '2026-07-20',
    deliverablesDueDate: '2026-07-26'
  }
];
