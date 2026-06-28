import type { Platform } from '../types';

export interface PlatformInfo {
  id: Platform;
  name: string;
  emoji: string;
  cities: string;
  tagline: string;
  description: string;
  features: string[];
  iconBg: string;
}

export const platforms: PlatformInfo[] = [
  {
    id: 'RABF',
    name: 'Rent A Boy Friend',
    emoji: '💗',
    cities: 'Udaipur & Jodhpur',
    tagline: 'Your friendly listener in the City of Lakes',
    description:
      'Breaking mental health stigmas one chai at a time. Platonic companionship for loneliness, depression relief, and real conversations over Rajasthan\'s iconic sunsets.',
    features: ['Mental Health Support', 'City Walks', 'Depression Relief', 'Free Helpline'],
    iconBg: '#FDE7F3',
  },
  {
    id: 'KoPartner',
    name: 'KoPartner',
    emoji: '🤝',
    cities: 'Udaipur & Jodhpur',
    tagline: 'Activity companion for every occasion',
    description:
      'Shopping buddy, movie companion, dinner escort, travel partner — KoPartner keeps you company for every event and outing across the Blue and Lake cities.',
    features: ['Shopping Buddy', 'Movie Companion', 'Dinner Escort', 'Heritage Walks'],
    iconBg: '#D1FAE5',
  },
  {
    id: 'Kumpanio',
    name: 'Kumpanio',
    emoji: '🏙️',
    cities: 'Udaipur (New Arrivals)',
    tagline: 'Find your footing in a new city',
    description:
      'Just relocated to Udaipur or Jodhpur? Kumpanio helps you navigate — from apartment hunting and coffee spots to building your first social circle.',
    features: ['City Navigation', 'Apartment Hunt', 'Tech Stress Relief', 'Community Building'],
    iconBg: '#DBEAFE',
  },
];
