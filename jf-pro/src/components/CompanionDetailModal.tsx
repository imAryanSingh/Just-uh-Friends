import { useState } from 'react';
import {
  X, MapPin, Star, ShieldCheck, Shield, RefreshCw,
  Globe, Heart, Video, Award, Check, Play,
} from 'lucide-react';
import type { Companion } from '../types';
import CompanionReviewSummary from './CompanionReviewSummary';

interface Props {
  companion: Companion;
  onClose: () => void;
  onBook: (c: Companion) => void;
  onRecurring?: (c: Companion) => void;
  wishlisted?: boolean;
  onWishlist?: (id: string) => void;
  userTags?: string[];
}

const tierClass: Record<string, string> = {
  Basic: 'tier-basic',
  Premium: 'tier-premium',
  Elite: 'tier-elite',
};

/* Interest tag compatibility */
function compatScore(companionTags: string[], userTags: string[]): number {
  if (!userTags || userTags.length === 0) return 0;
  const matched = companionTags.filter(t =>
    userTags.some(u => u.toLowerCase() === t.toLowerCase())
  ).length;
  return Math.round((matched / Math.max(companionTags.length, 1)) * 100);
}

/* Video intro placeholder */
function VideoIntro({ name }: { name: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#5B21B6', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 8 }}>
        30-Second Video Intro
      </div>
      <div
        onClick={() => setPlaying(true)}
        style={{
          background: playing ? '#1F2937' : 'linear-gradient(135deg, #1F2937, #374151)',
          borderRadius: 12, height: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', position: 'relative', overflow: 'hidden',
        }}
      >
        {playing ? (
          <div style={{ textAlign: 'center', color: '#fff' }}>
            <Video size={24} style={{ display: 'block', margin: '0 auto 6px', opacity: 0.4 }} />
            <span style={{ fontSize: 11, color: '#9CA3AF' }}>Video plays in production</span>
          </div>
        ) : (
          <>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Play size={20} color="#fff" fill="#fff" style={{ marginLeft: 2 }} />
            </div>
            <div style={{
              position: 'absolute', bottom: 8, left: 12,
              fontSize: 11, color: '#E5E7EB', fontWeight: 600,
            }}>
              {name.split(' ')[0]}'s intro · 0:28
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function CompanionDetailModal({
  companion: c,
  onClose,
  onBook,
  onRecurring,
  wishlisted = false,
  onWishlist,
  userTags = [],
}: Props) {
  const [gpsOn, setGpsOn] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(wishlisted);

  const compat = userTags.length > 0 ? compatScore(c.tags, userTags) : null;

  function handleWishlist() {
    setIsWishlisted(v => !v);
    onWishlist?.(c.id);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1F2937' }}>Companion Profile</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              style={{
                width: 34, height: 34, borderRadius: '50%',
                background: isWishlisted ? '#FEE2E2' : '#F5F3FF',
                border: `1.5px solid ${isWishlisted ? '#FCA5A5' : '#E9D5FF'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
              title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart size={15} color={isWishlisted ? '#EF4444' : '#9CA3AF'} fill={isWishlisted ? '#EF4444' : 'none'} />
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ padding: '0 24px', overflowY: 'auto', maxHeight: '65vh' }}>

          {/* Photo + core info */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <img
              src={c.photo} alt={c.name}
              style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }}
              onError={(e) => { (e.target as HTMLImageElement).style.background = '#EDE9FE'; }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#1F2937' }}>{c.name}, {c.age}</div>
              <div style={{ fontSize: 13, color: '#6B7280', margin: '2px 0 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={11} /> {c.city} · {c.platform}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                <span className={tierClass[c.tier]}>{c.tier}</span>
                <span className="aadh-badge"><ShieldCheck size={10} /> Aadhaar Verified</span>
                {c.available
                  ? <span className="avail-on"><span className="dot-on" />{c.availableNow ? 'Available Now' : 'Available'}</span>
                  : <span className="avail-off"><span className="dot-off" />Unavailable</span>}
              </div>
            </div>
          </div>

          {/* Trust badge strip */}
          <div style={{
            display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14,
            padding: '10px 12px', background: '#F5F3FF',
            borderRadius: 10, border: '1px solid #E9D5FF',
          }}>
            {c.backgroundVerified && (
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100,
                background: '#DBEAFE', color: '#1E3A8A',
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
                <Shield size={10} /> Police Verified
              </span>
            )}
            {c.mentalHealthBadge && (
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100,
                background: '#EDE9FE', color: '#5B21B6',
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
                <Award size={10} /> MH First Aid
              </span>
            )}
            {c.insuranceBadge && (
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100,
                background: '#FEF3C7', color: '#92400E',
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
                <Check size={10} /> Insured
              </span>
            )}
          </div>

          {/* Compatibility score */}
          {compat !== null && (
            <div style={{
              marginBottom: 14, padding: '10px 14px',
              background: compat >= 70 ? '#DCFCE7' : compat >= 40 ? '#FEF3C7' : '#F3F4F6',
              borderRadius: 10,
              border: `1px solid ${compat >= 70 ? '#86EFAC' : compat >= 40 ? '#FCD34D' : '#E5E7EB'}`,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: compat >= 70 ? '#065F46' : compat >= 40 ? '#92400E' : '#4B5563' }}>
                {compat}% interest match with your profile
              </div>
              <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
                Based on shared tags: {c.tags.filter(t => userTags.some(u => u.toLowerCase() === t.toLowerCase())).join(', ') || 'none'}
              </div>
            </div>
          )}

          {/* Languages */}
          {c.languages && c.languages.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              <Globe size={13} color="#6B7280" />
              {c.languages.map(l => (
                <span key={l} style={{
                  fontSize: 11, background: '#F3F4F6', color: '#374151',
                  padding: '3px 9px', borderRadius: 100, fontWeight: 600,
                }}>{l}</span>
              ))}
            </div>
          )}

          {/* Video Intro */}
          <VideoIntro name={c.name} />

          {/* Bio */}
          <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.6, marginBottom: 14 }}>{c.bio}</p>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {c.tags.map((t) => (
              <span key={t} style={{ fontSize: 11, background: '#F5F3FF', border: '1px solid #E9D5FF', color: '#5B21B6', padding: '3px 9px', borderRadius: 100 }}>{t}</span>
            ))}
          </div>

          {/* GPS toggle */}
          <div className="gps-row">
            <div>
              <div style={{ fontSize: 13, color: '#1F2937', fontWeight: 600 }}>📍 Real-time GPS tracking</div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>Active during your session for safety</div>
            </div>
            <div
              className={`toggle-sw ${gpsOn ? '' : 'off'}`}
              onClick={() => setGpsOn(!gpsOn)}
              role="switch"
              aria-checked={gpsOn}
            />
          </div>

          {/* AI Review Summary */}
          <CompanionReviewSummary companion={c} compact />

          {/* Individual reviews */}
          <div style={{ fontSize: 11, fontWeight: 700, color: '#5B21B6', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.5px' }}>
            User Reviews
          </div>
          <div style={{ marginBottom: 16 }}>
            {c.reviews.map((r, i) => (
              <div key={i} className="review-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#1F2937' }}>{r.author}</span>
                  <span style={{ color: '#F59E0B', fontSize: 12 }}>
                    {Array.from({ length: r.stars }).map((_, j) => <Star key={j} size={10} fill="#F59E0B" style={{ display: 'inline' }} />)}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5 }}>{r.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer book bar */}
        <div style={{ padding: '14px 24px', borderTop: '1.5px solid #E9D5FF' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#5B21B6' }}>₹{c.ratePerHour}/hr</div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>
                {c.sessions} sessions · <Star size={11} fill="#F59E0B" style={{ display: 'inline', verticalAlign: -1 }} /> {c.rating}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {onRecurring && (
                <button
                  onClick={() => { onClose(); onRecurring(c); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '9px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700,
                    background: '#F5F3FF', color: '#5B21B6',
                    border: '1.5px solid #C4B5FD', cursor: 'pointer',
                  }}
                >
                  <RefreshCw size={13} /> Recurring
                </button>
              )}
              <button className="btn-primary" onClick={() => { onClose(); onBook(c); }}>
                📅 Book Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
