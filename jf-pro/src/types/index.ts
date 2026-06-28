export type Platform = 'RABF' | 'KoPartner' | 'Kumpanio';
export type CompanionTier = 'Basic' | 'Premium' | 'Elite';
export type Page = 'home' | 'auth' | 'platform' | 'helpline' | 'dashboard' | 'companion-dashboard' | 'rewards';
export type City = 'Udaipur' | 'Jodhpur';

export type Mood =
  | 'lonely'
  | 'anxious'
  | 'bored'
  | 'need-to-vent'
  | 'want-to-explore'
  | 'stressed'
  | 'celebratory';

export interface Review {
  author: string;
  stars: number;
  text: string;
}

export interface Companion {
  id: string;
  name: string;
  age: number;
  city: City;
  platform: Platform;
  tier: CompanionTier;
  ratePerHour: number;
  bio: string;
  tags: string[];
  photo: string;
  rating: number;
  sessions: number;
  available: boolean;
  availableNow?: boolean; // free within next 2 hours
  reviews: Review[];
  languages?: string[];
  mentalHealthBadge?: boolean;
  insuranceBadge?: boolean;
  backgroundVerified?: boolean;
  moodTags?: Mood[];
}

export interface User {
  firstName: string;
  lastName: string;
  phone: string;
  city: City;
  aadhaarLast4: string;
}

export interface BookingDetails {
  activity: string;
  date: string;
  slot: string;
  duration: number;
  venue: string;
}

// ── Session Memory Card ──────────────────────────────────────────
export interface SessionMemory {
  id: string;
  companionId: string;
  companionName: string;
  companionPhoto: string;
  date: string;
  activity: string;
  venue: string;
  rating: number;
  note: string;
  platform: Platform;
}

// ── JF Credits Wallet ────────────────────────────────────────────
export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit' | 'bonus';
  amount: number;
  description: string;
  date: string;
}

export interface Wallet {
  balance: number;
  transactions: WalletTransaction[];
}

// ── Wishlist ─────────────────────────────────────────────────────
export type WishlistedCompanion = Pick<
  Companion,
  'id' | 'name' | 'photo' | 'city' | 'platform' | 'ratePerHour' | 'rating' | 'available'
>;

// ── Weekly Wellbeing Check-in ────────────────────────────────────
export interface CheckInResponse {
  weekOf: string; // ISO date string
  scores: [number, number, number]; // 1–5 for each of 3 questions
  loneliness: number; // derived composite
}

// ── Session Check-in State ───────────────────────────────────────
export type SessionCheckInStatus = 'pending' | 'arrived' | 'ended' | 'sos';

export interface ActiveSession {
  companionId: string;
  companionName: string;
  scheduledEndISO: string;
  status: SessionCheckInStatus;
  emergencyContact?: string;
}

// ── Companion Earnings ───────────────────────────────────────────
export interface CompanionEarning {
  week: string;
  sessions: number;
  earnings: number;
  cancellations: number;
  avgRating: number;
}

export type CompanionLevel = 'Basic' | 'Premium' | 'Elite';
