import { Star, Shield, Heart, Zap } from 'lucide-react';
import type { Companion } from '../types';

interface Props {
  companion: Companion;
  onViewProfile: (c: Companion) => void;
  onBook: (c: Companion) => void;
  wishlisted?: boolean;
  lastMinuteDiscount?: number; // e.g. 20 for 20% off
  userTags?: string[];        // user's interest tags for compatibility score
}

const tierClass: Record<string, string> = {
  Basic: 'tier-basic',
  Premium: 'tier-premium',
  Elite: 'tier-elite',
};

/* Compute interest-tag compatibility score (0–100) */
function compatibilityScore(companionTags: string[], userTags: string[]): number | null {
  if (!userTags || userTags.length === 0) return null;
  const matched = companionTags.filter(t =>
    userTags.some(u => u.toLowerCase() === t.toLowerCase())
  ).length;
  return Math.round((matched / Math.max(companionTags.length, 1)) * 100);
}

function CompatBadge({ score }: { score: number }) {
  const color = score >= 70 ? '#065F46' : score >= 40 ? '#92400E' : '#4B5563';
  const bg    = score >= 70 ? '#DCFCE7'  : score >= 40 ? '#FEF3C7'  : '#F3F4F6';
  return (
    <span style={{
      fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 100,
      background: bg, color, display: 'inline-flex', alignItems: 'center', gap: 3,
    }}>
      {score}% match
    </span>
  );
}

export default function CompanionCard({
  companion: c,
  onViewProfile,
  onBook,
  wishlisted = false,
  lastMinuteDiscount,
  userTags = [],
}: Props) {
  const compat = compatibilityScore(c.tags, userTags);
  const discountedRate = lastMinuteDiscount
    ? Math.round(c.ratePerHour * (1 - lastMinuteDiscount / 100))
    : null;

  return (
    <div className="card card-hover" onClick={() => onViewProfile(c)} style={{ position: 'relative', overflow: 'visible' }}>

      {/* Last-minute discount ribbon */}
      {lastMinuteDiscount && (
        <div style={{
          position: 'absolute', top: -8, left: 10,
          background: '#EF4444', color: '#fff',
          fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 100,
          display: 'flex', alignItems: 'center', gap: 3, zIndex: 2,
          boxShadow: '0 2px 6px rgba(239,68,68,0.4)',
        }}>
          <Zap size={9} /> -{lastMinuteDiscount}% TODAY
        </div>
      )}

      {/* Photo */}
      <div style={{ position: 'relative' }}>
        <img
          className="comp-photo"
          src={c.photo}
          alt={c.name}
          style={{ borderRadius: '14px 14px 0 0' }}
          onError={(e) => { (e.target as HTMLImageElement).style.background = '#EDE9FE'; }}
        />

        {/* Available-now live dot */}
        {c.availableNow && (
          <span style={{
            position: 'absolute', top: 8, left: 8,
            background: '#22C55E', color: '#fff',
            fontSize: 9, fontWeight: 800, padding: '2px 7px',
            borderRadius: 100, display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', flexShrink: 0 }} />
            NOW
          </span>
        )}

        {/* Wishlisted heart indicator */}
        {wishlisted && (
          <span style={{
            position: 'absolute', top: 8, right: 8,
            background: '#FEE2E2', borderRadius: '50%',
            width: 24, height: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Heart size={12} color="#EF4444" fill="#EF4444" />
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: 13 }}>
        {/* Name + tier */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1F2937' }}>{c.name}</div>
            <div style={{ fontSize: 12, color: '#6B7280', marginTop: 1 }}>{c.age} yrs · {c.city}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
            <span className={tierClass[c.tier]}>{c.tier}</span>
            {compat !== null && <CompatBadge score={compat} />}
          </div>
        </div>

        {/* Trust badges row */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 6, flexWrap: 'wrap' }}>
          {c.backgroundVerified && (
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 100,
              background: '#DBEAFE', color: '#1E3A8A',
              display: 'inline-flex', alignItems: 'center', gap: 2,
            }}>
              <Shield size={8} /> Verified
            </span>
          )}
          {c.mentalHealthBadge && (
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 100,
              background: '#EDE9FE', color: '#5B21B6',
            }}>
              🛡️ MH Trained
            </span>
          )}
          {c.insuranceBadge && (
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 100,
              background: '#FEF3C7', color: '#92400E',
            }}>
              ✓ Insured
            </span>
          )}
        </div>

        {/* Availability */}
        <div style={{ marginBottom: 6 }}>
          {c.available ? (
            <span className="avail-on">
              <span className="dot-on" />
              {c.availableNow ? 'Available Now' : 'Available'}
            </span>
          ) : (
            <span className="avail-off"><span className="dot-off" />Unavailable</span>
          )}
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, margin: '6px 0' }}>
          {c.tags.map((t) => (
            <span
              key={t}
              style={{ fontSize: 10, background: '#F5F3FF', border: '1px solid #E9D5FF', color: '#5B21B6', padding: '2px 7px', borderRadius: 100 }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Languages */}
        {c.languages && c.languages.length > 0 && (
          <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 6 }}>
            🗣 {c.languages.slice(0, 3).join(' · ')}
          </div>
        )}

        {/* Rating + rate */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: '#F59E0B', fontWeight: 600 }}>
            <Star size={12} fill="#F59E0B" />
            {c.rating}
            <span style={{ color: '#9CA3AF', fontWeight: 400 }}>({c.sessions})</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            {discountedRate ? (
              <div>
                <span style={{ fontWeight: 800, color: '#EF4444', fontSize: 14 }}>₹{discountedRate}</span>
                <span style={{ fontSize: 10, color: '#9CA3AF', textDecoration: 'line-through', marginLeft: 4 }}>₹{c.ratePerHour}</span>
              </div>
            ) : (
              <div style={{ fontWeight: 800, color: '#5B21B6', fontSize: 14 }}>
                ₹{c.ratePerHour}<span style={{ fontSize: 10, fontWeight: 400, color: '#6B7280' }}>/hr</span>
              </div>
            )}
          </div>
        </div>

        {/* Book button */}
        <button
          className="btn-block"
          onClick={(e) => { e.stopPropagation(); onBook(c); }}
        >
          📅 Book Session
        </button>
      </div>
    </div>
  );
}
