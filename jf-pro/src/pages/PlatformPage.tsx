import { useState } from 'react';
import { ArrowLeft, MapPin, RefreshCw, Users, Tag } from 'lucide-react';
import CompanionCard from '../components/CompanionCard';
import CompanionDetailModal from '../components/CompanionDetailModal';
import BookingModal from '../components/BookingModal';
import MoodMatcher from '../components/MoodMatcher';
import RecurringBookingModal from '../components/RecurringBookingModal';
import CrisisEscalation from '../components/CrisisEscalation';
import GroupSessionModal from '../components/GroupSessionModal';
import { companionsByPlatform } from '../data/companions';
import { platforms } from '../data/platforms';
import type { Companion, Platform, User } from '../types';

interface Props {
  platform: Platform;
  user: User | null;
  onBack: () => void;
  onNeedAuth: () => void;
}

type CityFilter = '' | 'Udaipur' | 'Jodhpur';
type TierFilter = '' | 'Basic' | 'Premium' | 'Elite';
type BookingMode = 'single' | 'recurring' | 'group';

export default function PlatformPage({ platform, user, onBack, onNeedAuth }: Props) {
  const info = platforms.find((p) => p.id === platform)!;
  const [cityFilter, setCityFilter] = useState<CityFilter>('');
  const [tierFilter, setTierFilter] = useState<TierFilter>('');
  const [detailComp, setDetailComp] = useState<Companion | null>(null);
  const [bookingComp, setBookingComp] = useState<Companion | null>(null);
  const [bookingMode, setBookingMode] = useState<BookingMode>('single');
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  let list = companionsByPlatform(platform);
  if (cityFilter) list = list.filter((c) => c.city === cityFilter);
  if (tierFilter) list = list.filter((c) => c.tier === tierFilter);

  const availableNowCount = list.filter(c => c.available).length;

  function handleBook(c: Companion, mode: BookingMode = 'single') {
    if (!user) { onNeedAuth(); return; }
    setBookingComp(c);
    setBookingMode(mode);
  }

  function toggleWishlist(id: string) {
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 24px' }}>
      {/* Back */}
      <button
        className="back-btn"
        onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 13, cursor: 'pointer', background: 'none', border: 'none', marginBottom: 14, fontFamily: 'inherit' }}
      >
        <ArrowLeft size={14} /> Back to Platforms
      </button>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1F2937' }}>{info.name}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
          <p style={{ color: '#6B7280', fontSize: 14, display: 'flex', alignItems: 'center', gap: 4, margin: 0 }}>
            <MapPin size={12} /> {info.cities} · {info.tagline}
          </p>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: '#DCFCE7', color: '#065F46', fontSize: 11,
            fontWeight: 700, padding: '2px 9px', borderRadius: 100,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
            {availableNowCount} available now
          </span>
        </div>
      </div>

      {/* Crisis Escalation / Pre-session chat */}
      <CrisisEscalation
        companionName="your companion"
        onCrisisDetected={() => {}}
        onFlaggedDetected={() => {}}
      />

      {/* Mood Matcher */}
      <MoodMatcher
        companions={companionsByPlatform(platform)}
        onBook={handleBook}
        onViewProfile={setDetailComp}
      />

      {/* Filters + Booking mode toggle */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6B7280' }}>
            <MapPin size={13} /> City:
            <select className="jf-select" style={{ width: 'auto', padding: '5px 10px' }} value={cityFilter} onChange={(e) => setCityFilter(e.target.value as CityFilter)}>
              <option value="">All Cities</option>
              <option value="Udaipur">Udaipur</option>
              <option value="Jodhpur">Jodhpur</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6B7280' }}>
            Tier:
            <select className="jf-select" style={{ width: 'auto', padding: '5px 10px' }} value={tierFilter} onChange={(e) => setTierFilter(e.target.value as TierFilter)}>
              <option value="">All Tiers</option>
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
              <option value="Elite">Elite</option>
            </select>
          </div>
        </div>

        {/* Booking mode selector */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { mode: 'single' as BookingMode, label: 'Single', icon: null },
            { mode: 'recurring' as BookingMode, label: 'Recurring', icon: <RefreshCw size={11} />, badge: '-15%' },
            { mode: 'group' as BookingMode, label: 'Group', icon: <Users size={11} /> },
          ].map(({ mode, label, icon, badge }) => (
            <button
              key={mode}
              onClick={() => setBookingMode(mode)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '6px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                border: `1.5px solid ${bookingMode === mode ? '#7C3AED' : '#E9D5FF'}`,
                background: bookingMode === mode ? '#F5F3FF' : '#fff',
                color: bookingMode === mode ? '#5B21B6' : '#6B7280',
                cursor: 'pointer', position: 'relative',
              }}
            >
              {icon}
              {label}
              {badge && (
                <span style={{
                  background: '#DCFCE7', color: '#065F46',
                  fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 100,
                }}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Booking mode info banner */}
      {bookingMode === 'recurring' && (
        <div style={{
          background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)',
          border: '1.5px solid #C4B5FD', borderRadius: 12,
          padding: '10px 16px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 8, fontSize: 13,
        }}>
          <RefreshCw size={14} color="#7C3AED" />
          <span style={{ color: '#5B21B6' }}>
            <strong>Recurring mode:</strong> Book weekly or bi-weekly sessions with a companion at up to 15% off. Tap any "Book" to set up your recurring schedule.
          </span>
        </div>
      )}
      {bookingMode === 'group' && (
        <div style={{
          background: '#EFF6FF', border: '1.5px solid #BFDBFE',
          borderRadius: 12, padding: '10px 16px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 8, fontSize: 13,
        }}>
          <Users size={14} color="#1D4ED8" />
          <span style={{ color: '#1D4ED8' }}>
            <strong>Group mode:</strong> Book one companion for 2–4 people. Bill split automatically. Great for office outings or friend groups.
          </span>
        </div>
      )}

      {/* Wishlist count if any */}
      {wishlist.size > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 12, color: '#EF4444', marginBottom: 12,
        }}>
          <Tag size={12} />
          {wishlist.size} companion{wishlist.size > 1 ? 's' : ''} saved to your wishlist
        </div>
      )}

      {/* Grid */}
      {list.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {list.map((c) => (
            <div key={c.id} style={{ position: 'relative' }}>
              <CompanionCard
                companion={c}
                onViewProfile={setDetailComp}
                onBook={(comp) => handleBook(comp, bookingMode)}
              />
              {/* Wishlist heart overlay */}
              <button
                onClick={e => { e.stopPropagation(); toggleWishlist(c.id); }}
                style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
                title={wishlist.has(c.id) ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={wishlist.has(c.id) ? '#EF4444' : 'none'} stroke={wishlist.has(c.id) ? '#EF4444' : '#9CA3AF'} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#6B7280' }}>
          No companions found for the selected filters.
        </div>
      )}

      {/* Companion detail modal */}
      {detailComp && (
        <CompanionDetailModal
          companion={detailComp}
          onClose={() => setDetailComp(null)}
          onBook={(c) => { setDetailComp(null); handleBook(c, bookingMode); }}
        />
      )}

      {/* Booking modals */}
      {bookingComp && user && bookingMode === 'single' && (
        <BookingModal
          companion={bookingComp}
          user={user}
          onClose={() => setBookingComp(null)}
        />
      )}
      {bookingComp && user && bookingMode === 'recurring' && (
        <RecurringBookingModal
          companion={bookingComp}
          user={user}
          onClose={() => setBookingComp(null)}
          wishlisted={wishlist.has(bookingComp.id)}
          onWishlist={toggleWishlist}
        />
      )}
      {bookingComp && user && bookingMode === 'group' && (
        <GroupSessionModal
          companion={bookingComp}
          user={user}
          onClose={() => setBookingComp(null)}
        />
      )}
    </div>
  );
}
