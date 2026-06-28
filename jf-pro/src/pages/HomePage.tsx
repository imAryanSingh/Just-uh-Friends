import { useState } from 'react';
import {
  MapPin, Shield, Star, Heart, ChevronRight, Zap,
  TrendingUp, Globe, Moon, Sun, Users, Gift,
} from 'lucide-react';
import type { Platform } from '../types';
import { platforms } from '../data/platforms';
import { companions } from '../data/companions';

interface Props {
  onSelectPlatform: (p: Platform) => void;
  onHelpline: () => void;
}

/* ── Anonymous success stories ──────────────────────────── */
const STORIES = [
  {
    id: 's1',
    platform: 'RABF',
    city: 'Udaipur',
    quote: 'I moved to Udaipur alone for work. After three months of eating dinner by myself, I found Just Friends. My first session with a companion at Ambrai Ghat was the first time I\'d genuinely laughed in weeks.',
    initials: 'P.S.',
    mood: '😊',
    outcome: 'Feels less alone',
  },
  {
    id: 's2',
    platform: 'KoPartner',
    city: 'Jodhpur',
    quote: 'My social anxiety made attending my cousin\'s wedding feel impossible. I booked a companion for the evening. Nobody knew — it just felt like I\'d brought a confident friend. I actually enjoyed it.',
    initials: 'R.K.',
    mood: '🎉',
    outcome: 'Overcame social anxiety',
  },
  {
    id: 's3',
    platform: 'Kumpanio',
    city: 'Udaipur',
    quote: 'I was burning out and kept cancelling plans. My companion just walked with me at Fateh Sagar every Saturday morning. No agenda. It reset something in me I didn\'t know was broken.',
    initials: 'A.M.',
    mood: '🌅',
    outcome: 'Recovered from burnout',
  },
];

/* ── Loneliness report teaser ───────────────────────────── */
const REPORT_STATS = [
  { value: '67%', label: 'of Udaipur respondents felt moderately lonely in 2024' },
  { value: '2.3x', label: 'higher loneliness in 20–35 age group vs national avg' },
  { value: '89%', label: 'said a single positive social interaction improved their day' },
];

/* ── Seasonal festival banner ───────────────────────────── */
function FestivalBanner() {
  const now = new Date();
  const month = now.getMonth() + 1;
  // Show during Oct–Nov (Diwali), Mar–Apr (Teej/Gangaur), Feb (Valentine adj)
  const festivals: Record<number, { name: string; emoji: string; desc: string }> = {
    10: { name: 'Diwali', emoji: '🪔', desc: 'Feeling lonely during Diwali? Festival companions available in Udaipur & Jodhpur.' },
    11: { name: 'Diwali', emoji: '🪔', desc: 'Post-Diwali loneliness is real. Book a companion for a lake walk this week.' },
    3:  { name: 'Gangaur', emoji: '🌸', desc: 'Gangaur season! Join a guided heritage walk with a local companion.' },
    4:  { name: 'Teej', emoji: '🎋', desc: 'Teej is coming. Don\'t spend it alone — book a festival companion.' },
  };
  const festival = festivals[month];
  if (!festival) return null;
  return (
    <div style={{
      background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
      border: '1.5px solid #FCD34D',
      borderRadius: 14,
      padding: '16px 20px',
      marginBottom: 24,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
    }}>
      <span style={{ fontSize: 28, flexShrink: 0 }}>{festival.emoji}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: '#92400E', marginBottom: 3 }}>
          {festival.name} Special
        </div>
        <div style={{ fontSize: 13, color: '#B45309' }}>{festival.desc}</div>
      </div>
      <span style={{
        background: '#F59E0B', color: '#fff',
        fontSize: 11, fontWeight: 700,
        padding: '4px 10px', borderRadius: 100,
        whiteSpace: 'nowrap', flexShrink: 0,
      }}>
        Book Now
      </span>
    </div>
  );
}

/* ── Available Now strip ────────────────────────────────── */
function AvailableNowStrip({ onSelectPlatform }: { onSelectPlatform: (p: Platform) => void }) {
  const nowCompanions = companions.filter(c => c.availableNow).slice(0, 4);
  if (nowCompanions.length === 0) return null;
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', flexShrink: 0,
          boxShadow: '0 0 0 3px #DCFCE7', animation: 'pulse-dot 2s infinite' }} />
        <span style={{ fontWeight: 800, fontSize: 15, color: '#1F2937' }}>Available Right Now</span>
        <span style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>
          {nowCompanions.length} companions free in the next 2 hours
        </span>
      </div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
        {nowCompanions.map(c => (
          <div
            key={c.id}
            onClick={() => onSelectPlatform(c.platform)}
            style={{
              flexShrink: 0, width: 140,
              background: '#fff', border: '1.5px solid #DCFCE7',
              borderRadius: 14, padding: 12, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ position: 'relative', marginBottom: 8 }}>
              <img
                src={c.photo} alt={c.name}
                style={{ width: '100%', height: 72, objectFit: 'cover', borderRadius: 10 }}
              />
              <span style={{
                position: 'absolute', bottom: 4, right: 4,
                background: '#22C55E', color: '#fff',
                fontSize: 9, fontWeight: 700,
                padding: '2px 6px', borderRadius: 100,
              }}>LIVE</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#1F2937', marginBottom: 2 }}>
              {c.name.split(' ')[0]}
            </div>
            <div style={{ fontSize: 10, color: '#6B7280', marginBottom: 4 }}>{c.tags[0]} · {c.city}</div>
            <div style={{ fontWeight: 800, fontSize: 13, color: '#5B21B6' }}>₹{c.ratePerHour}/hr</div>
          </div>
        ))}
      </div>
      <style>{`@keyframes pulse-dot { 0%,100%{box-shadow:0 0 0 3px #DCFCE7} 50%{box-shadow:0 0 0 6px #DCFCE780} }`}</style>
    </div>
  );
}

/* ── Trust signals ──────────────────────────────────────── */
const TRUST_ITEMS = [
  { icon: <Shield size={18} color="#7C3AED" />, label: '100% Aadhaar Verified', desc: 'Every companion ID-verified before onboarding' },
  { icon: <Star size={18} color="#F59E0B" />,   label: '4.9★ Avg Rating', desc: 'Based on 3,200+ completed sessions' },
  { icon: <Globe size={18} color="#0369A1" />,  label: 'Hindi · English · Marwari', desc: 'Book in your preferred language' },
  { icon: <Zap size={18} color="#22C55E" />,    label: 'Sub-30 min booking', desc: 'From browse to confirmed in minutes' },
];

/* ── Stories carousel ───────────────────────────────────── */
function StoriesSection() {
  const [active, setActive] = useState(0);
  const story = STORIES[active];
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1F2937, #374151)',
      borderRadius: 18, padding: 24, marginBottom: 28, color: '#fff',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        <Heart size={16} color="#C4B5FD" fill="#C4B5FD" />
        <span style={{ fontSize: 13, fontWeight: 700, color: '#C4B5FD', textTransform: 'uppercase', letterSpacing: '.6px' }}>
          Just Friends Stories
        </span>
        <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.1)', color: '#9CA3AF', padding: '2px 7px', borderRadius: 100 }}>
          Anonymous · With consent
        </span>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 20, marginBottom: 16,
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ fontSize: 24, marginBottom: 10 }}>{story.mood}</div>
        <p style={{
          fontSize: 14, color: '#E5E7EB', lineHeight: 1.7, fontStyle: 'italic', margin: '0 0 14px',
        }}>
          "{story.quote}"
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF' }}>— {story.initials}</span>
            <span style={{ fontSize: 11, color: '#6B7280', marginLeft: 8 }}>{story.platform} · {story.city}</span>
          </div>
          <span style={{
            fontSize: 11, background: '#DCFCE7', color: '#065F46',
            padding: '3px 10px', borderRadius: 100, fontWeight: 700,
          }}>
            {story.outcome}
          </span>
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
        {STORIES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? 20 : 8, height: 8, borderRadius: 100,
              background: i === active ? '#A78BFA' : 'rgba(255,255,255,0.2)',
              border: 'none', cursor: 'pointer', transition: 'all 0.2s', padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Loneliness report ──────────────────────────────────── */
function LonelinessReport() {
  return (
    <div style={{
      background: '#F5F3FF', border: '1.5px solid #E9D5FF',
      borderRadius: 14, padding: 20, marginBottom: 28,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <TrendingUp size={16} color="#7C3AED" />
        <span style={{ fontWeight: 800, fontSize: 15, color: '#1F2937' }}>Rajasthan Loneliness Report 2024</span>
        <span style={{ fontSize: 10, background: '#7C3AED', color: '#fff', padding: '2px 7px', borderRadius: 100 }}>NEW</span>
      </div>
      <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 16, lineHeight: 1.5 }}>
        Anonymous data from 1,200 users across Udaipur & Jodhpur — India's first city-level loneliness survey.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
        {REPORT_STATS.map(s => (
          <div key={s.value} style={{
            background: '#fff', borderRadius: 10, padding: '12px 10px',
            border: '1px solid #E9D5FF', textAlign: 'center',
          }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#5B21B6', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 10, color: '#6B7280', lineHeight: 1.4 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <button style={{
        width: '100%', padding: '9px 0', borderRadius: 100, fontSize: 12, fontWeight: 700,
        background: 'none', border: '1.5px solid #C4B5FD', color: '#5B21B6', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}>
        Read Full Report <ChevronRight size={13} />
      </button>
    </div>
  );
}

/* ── Feature strip ──────────────────────────────────────── */
const FEATURES = [
  { emoji: '🧠', label: 'Mood Matching', desc: 'AI picks the right companion for how you feel right now' },
  { emoji: '🛡️', label: 'Session Safety', desc: 'GPS check-in + SOS panic button for every meetup' },
  { emoji: '🔁', label: 'Recurring Plans', desc: 'Weekly sessions at 15% off — build a real bond' },
  { emoji: '🎁', label: 'Gift Sessions', desc: 'Send a session to a lonely friend via WhatsApp' },
  { emoji: '💬', label: 'Crisis Protocol', desc: 'AI chat moderation + helpline escalation built in' },
  { emoji: '📊', label: 'Wellbeing Score', desc: 'Weekly loneliness check-in tracks your emotional health' },
];

/* ── Language filter preview ────────────────────────────── */
const LANGUAGES = ['Hindi', 'English', 'Marwari', 'Rajasthani'];

/* ── Main ──────────────────────────────────────────────── */
const stats = [
  { n: '200+', l: 'Companions' },
  { n: '4.9★', l: 'Avg Rating' },
  { n: '2',    l: 'Cities' },
  { n: '100%', l: 'Aadhaar Verified' },
];

export default function HomePage({ onSelectPlatform, onHelpline }: Props) {
  const [activeLang, setActiveLang] = useState('');

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 24px' }}>

      {/* ── Hero ── */}
      <div style={{ textAlign: 'center', padding: '32px 0 24px' }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
          <span className="city-pill"><MapPin size={11} />Udaipur</span>
          <span className="city-pill"><MapPin size={11} />Jodhpur</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#1F2937', lineHeight: 1.2, marginBottom: 10 }}>
          Real Company.<br />
          <span style={{ color: '#7C3AED' }}>Zero Judgment.</span>
        </h1>
        <p style={{ color: '#6B7280', fontSize: 15, maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.6 }}>
          Rajasthan's first verified platonic companionship network.
          Aadhaar-verified companions for walks, conversations, events, and everything in between.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => onSelectPlatform('RABF')}
            className="btn-primary"
            style={{ padding: '12px 28px', fontSize: 15, borderRadius: 100 }}
          >
            Find a Companion →
          </button>
          <button
            onClick={onHelpline}
            style={{
              padding: '12px 24px', fontSize: 15, borderRadius: 100,
              background: '#fff', border: '1.5px solid #E9D5FF',
              color: '#5B21B6', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <Heart size={14} /> Free Helpline
          </button>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="stat-bar" style={{ maxWidth: 560, margin: '0 auto 28px' }}>
        {stats.map((s) => (
          <div key={s.l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#5B21B6' }}>{s.n}</div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── Festival banner (seasonal) ── */}
      <FestivalBanner />

      {/* ── Available Now strip ── */}
      <AvailableNowStrip onSelectPlatform={onSelectPlatform} />

      {/* ── Platform cards ── */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1F2937', marginBottom: 16 }}>
          Choose Your Platform
        </h2>

        {/* Language filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          <Globe size={14} color="#6B7280" />
          <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>Filter by language:</span>
          {LANGUAGES.map(l => (
            <button
              key={l}
              onClick={() => setActiveLang(activeLang === l ? '' : l)}
              style={{
                padding: '4px 11px', borderRadius: 100, fontSize: 11, fontWeight: 600,
                border: `1.5px solid ${activeLang === l ? '#7C3AED' : '#E9D5FF'}`,
                background: activeLang === l ? '#7C3AED' : '#fff',
                color: activeLang === l ? '#fff' : '#6B7280',
                cursor: 'pointer',
              }}
            >
              {l}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {platforms.map((p) => {
            const platformCompanions = companions.filter(c => c.platform === p.id);
            const availNow = platformCompanions.filter(c => c.availableNow).length;
            return (
              <div key={p.id} className="card-soft card-hover" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: p.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                    {p.emoji}
                  </div>
                  {availNow > 0 && (
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      background: '#DCFCE7', color: '#065F46',
                      fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100,
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E' }} />
                      {availNow} now
                    </span>
                  )}
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#1F2937', marginBottom: 3 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>
                  <MapPin size={11} style={{ display: 'inline', verticalAlign: -1 }} /> {p.cities}
                </div>
                <div style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.5, marginBottom: 12 }}>{p.description}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                  {p.features.map((f) => (
                    <span key={f} style={{ fontSize: 11, background: '#fff', border: '1px solid #E9D5FF', color: '#6B7280', padding: '2px 8px', borderRadius: 100 }}>{f}</span>
                  ))}
                </div>
                <button className="btn-full" style={{ fontSize: 13, padding: 9 }} onClick={() => onSelectPlatform(p.id)}>
                  Meet Companions →
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Features strip ── */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1F2937', marginBottom: 16 }}>
          Built Different
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {FEATURES.map(f => (
            <div
              key={f.label}
              className="card"
              style={{ padding: '14px 14px' }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{f.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#1F2937', marginBottom: 4 }}>{f.label}</div>
              <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Trust signals ── */}
      <div style={{
        background: '#F5F3FF', border: '1.5px solid #E9D5FF',
        borderRadius: 14, padding: 20, marginBottom: 28,
      }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: '#1F2937', marginBottom: 16 }}>
          Why Trust Just Friends?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {TRUST_ITEMS.map(t => (
            <div key={t.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: '#fff',
                border: '1.5px solid #E9D5FF', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{t.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#1F2937', marginBottom: 2 }}>{t.label}</div>
                <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.4 }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Just Friends Stories ── */}
      <StoriesSection />

      {/* ── Loneliness Report ── */}
      <LonelinessReport />

      {/* ── Helpline CTA ── */}
      <div style={{ background: '#7C3AED', borderRadius: 14, padding: 28, textAlign: 'center', color: '#fff' }}>
        <Moon size={24} style={{ display: 'block', margin: '0 auto 10px' }} />
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Free Emotional Wellness Helpline</h3>
        <p style={{ fontSize: 14, opacity: .85, marginBottom: 18, lineHeight: 1.5 }}>
          Talk to Dr. Aarav Mehta — certified counsellor — free, confidential, judgment-free.
          Available Mon–Sat, 8 AM–10 PM.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onHelpline}
            style={{ background: '#fff', color: '#5B21B6', fontWeight: 700, padding: '10px 26px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}
          >
            Open Helpline
          </button>
          <a
            href="tel:9152987821"
            style={{
              background: 'rgba(255,255,255,0.15)', color: '#fff',
              fontWeight: 700, padding: '10px 22px', borderRadius: 100,
              border: '1.5px solid rgba(255,255,255,0.3)',
              fontSize: 14, textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <Users size={14} /> iCall: 9152987821
          </a>
        </div>
      </div>
    </div>
  );
}
