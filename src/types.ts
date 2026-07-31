export type Role = 'customer' | 'creator' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
}

export type EventCategory =
  | 'Wedding'
  | 'Engagement'
  | 'Reception'
  | 'Haldi'
  | 'Mehendi'
  | 'Birthday Celebration'
  | 'Anniversary'
  | 'Car shoot'
  | 'Baby Shower'
  | 'Housewarming'
  | 'Corporate Event'
  | 'Product Shoot'
  | 'Fashion Shoot'
  | 'College Event'
  | 'Birthday'
  | 'Sangeet'
  | 'Pre-Wedding Shoot'
  | 'Other';

export interface EventLocation {
  venueName?: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  placeId?: string;
  googleMapsUrl: string;
  confirmed: boolean;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  accuracy?: number;
  verified?: boolean;
}

export type TimeSlotId = 'morning' | 'afternoon' | 'evening' | 'night';

export interface TimeSlot {
  id: TimeSlotId;
  label: string;
  timeRange: string;
  available: boolean;
}

export interface CreatorPackage {
  id: string;
  name: string;
  price: number;
  duration: string;
  reelsCount: number;
  deliverables: string[];
  popular?: boolean;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage: string;
  city: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  completedBookings: number;
  followers: string;
  totalViews: string;
  startingPrice: number;
  languages: string[];
  gender: 'Male' | 'Female' | 'Other';
  equipment: string[];
  specialties: EventCategory[];
  bio: string;
  verified: boolean;
  featured?: boolean;
  badges: string[];
  portfolioVideos: {
    id: string;
    title: string;
    thumbnail: string;
    videoUrl?: string;
    views: string;
    category: EventCategory;
  }[];
  packages: CreatorPackage[];
  availableSlots: {
    [dateStr: string]: TimeSlotId[]; // array of available slots for a given YYYY-MM-DD
  };
}

export interface PackagePreset {
  id: string;
  title: string;
  category: EventCategory;
  duration: string;
  deliverables: string[];
  badge?: string;
  popular?: boolean;
  image: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: EventCategory;
  creatorName: string;
  creatorAvatar: string;
  thumbnail: string;
  videoUrl?: string;
  instagramUrl?: string;

  isReel: boolean;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
  views?: string;
  likes?: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  eventType: EventCategory;
  city: string;
  date: string;
  slot: TimeSlotId;
  slotLabel: string;
  timeRange: string;
  totalAmount: number;
  advancePaid: number;
  balanceAmount: number;
  paymentMethod: 'Razorpay' | 'Stripe' | 'UPI' | 'Card' | 'Wallet';
  paymentStatus: 'Paid Advance' | 'Fully Paid' | 'Pending';
  status: 'Confirmed' | 'Completed' | 'In Progress' | 'Cancelled';
  createdAt: string;
  deliverablesDueDate: string;
  reelDeliverableUrl?: string;
  eventLocation?: EventLocation;
  duration?: string;
  guestsCount?: string;
  notes?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  event: string;
  city: string;
  rating: number;
  comment: string;
  avatar: string;
  instagramUrl: string;
  videoThumbnail?: string;
  hasVideo?: boolean;
}

export type NotificationType = 'booking' | 'payment' | 'shoot' | 'deliverable' | 'system';

export interface SocketNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  bookingNumber?: string;
  actionUrl?: string;
  socketEvent: string;
  amount?: number;
  metadata?: {
    cinematographer?: string;
    city?: string;
    deliverableUrl?: string;
    paymentMethod?: string;
  };
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}
