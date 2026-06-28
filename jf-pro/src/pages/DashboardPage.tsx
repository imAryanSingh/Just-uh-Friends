import { useState } from 'react';
import {
  Wallet, Heart, BookOpen, Activity, Plus, Minus,
  Star, ChevronRight, TrendingUp, Gift, Users, AlertCircle,
  CheckCircle, ArrowLeft,
} from 'lucide-react';
import type { User, SessionMemory, WalletTransaction, WishlistedCompanion, CheckInResponse } from '../types';
import PanicButton from '../components/PanicButton';
import type { SessionCheckInStatus } from '../types';

/* ── Mock data ────────────────────────────────────────────────── */
const MOCK_SESSIONS: SessionMemory[] = [
  {
    id: 's1',
    companionId: 'r1',
    companionName: 'Arjun Mehta',
    companionPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&face',
    date: '2025-06-28',
    activity: 'Lake Walk',
    venue: 'Ambrai Ghat, Udaipur',
    rating: 5,
    note: 'Felt calmer after the walk. Talked about work stress.',
    platform: 'RABF',
  },
  {
    id: 's2',
    companionId: 'k1',
    companionName: 'Kavya Sharma',
    companionPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&face',
    date: '2025-06-21',
    activity: 'Café Chat',
    venue: 'Millets of Mewar, Udaipur',
    rating: 5,
    note: 'Amazing conversation. Left feeling energised.',
    platform: 'KoPartner',
  },
  {
    id: 's3',
    companionId: 'r3',
    companionName: 'Vikram Nair',
    companionPhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=60&h=60&fit=crop&face',
    date: '2025-06-14',
    activity: 'Yoga + Fateh Sagar Walk',
    venue: 'Fateh Sagar Lake, Udaipur',
    rating: 5,
    note: 'Best session yet. Burnout is getting better.',
    platform: 'RABF',
  },
];

const MOCK_TRANSACTIONS: WalletTransaction[] = [
  { id: 't1', type: 'credit', amount: 500, description: 'Wallet top-up', date: '2025-06-25' },
  { id: 't2', type: 'bonus', amount: 25, description: '5% bonus on ₹500 load', date: '2025-06-25' },
  { id: 't3', type: 'debit', amount: 998, description: 'Booking – Arjun Mehta (2h)', date: '2025-06-28' },
  { id: 't4', type: 'credit', amount: 100, description: 'Referral bonus – Priya joined', date: '2025-06-20' },
  { id: 't5', type: 'debit', amount: 499, description: 'Booking – Kavya Sharma (1h)', date: '2025-06-21' },
];

const MOCK_WISHLIST: WishlistedCompanion[] = [
  {
    id: 'r3',
    name: 'Vikram Nair',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=60&h=60&fit=crop&face',
    city: 'Udaipur',
    platform: 'RABF',
    ratePerHour: 799,
    rating: 5.0,
    available: false,
  },
  {
    id: 'k2',
    name: 'Priya Jain',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&face',
    city: 'Udaipur',
    platform: 'KoPartner',
    ratePerHour: 549,
    rating: 4.9,
    available: true,
  },
];

const CHECKIN_QUESTIONS = [
  'How connected do you feel to people around you this week?',
  'How often did you feel genuinely understood by someone?',
  'How would you rate your overall emotional wellbeing today?',
];

/* ── Sub-components ─────────────────────────────────────────── */
function WalletTab() {
  const balance = MOCK_TRANSACTIONS.reduce((sum, t) =>
    t.type === 'debit' ? sum - t.amount : sum + t.amount, 0
  );
  const [topUpAmount, setTopUpAmount] = useState(500);

  const presets = [200, 500, 1000, 2000];

  return (
    <div>
      {/* Balance card */}
      <div style={{
        background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
        borderRadius: 16, padding: 24, marginBottom: 20, color: '#fff',
      }}>
        <div style={{ fontSize: 12, color: '#C4B5FD', marginBottom: 6 }}>JF Credits Balance</div>
        <div style={{ fontSize: 36, fontWeight: 900, marginBottom: 4 }}>₹{balance.toLocaleString()}</div>
        <div style={{ fontSize: 12, color: '#C4B5FD', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Gift size={12} /> Load ₹500+ and earn 5% bonus credits
        </div>
      </div>

      {/* Top up */}
      <div className="card" style={{ padding: 18, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 12 }}>Add Credits</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {presets.map(p => (
            <button
              key={p}
              onClick={() => setTopUpAmount(p)}
              style={{
                padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700,
                border: `1.5px solid ${topUpAmount === p ? '#7C3AED' : '#E9D5FF'}`,
                background: topUpAmount === p ? '#F5F3FF' : '#fff',
                color: topUpAmount === p ? '#7C3AED' : '#6B7280',
                cursor: 'pointer',
              }}
            >
              ₹{p}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }}>₹</span>
            <input
              type="number"
              className="jf-input"
              value={topUpAmount}
              onChange={e => setTopUpAmount(Number(e.target.value))}
              style={{ paddingLeft: 24 }}
            />
          </div>
          <button className="btn-primary" style={{ padding: '10px 20px', whiteSpace: 'nowrap' }}>
            Add ₹{topUpAmount} {topUpAmount >= 500 && <span style={{ opacity: 0.8 }}>+₹{Math.round(topUpAmount * 0.05)} bonus</span>}
          </button>
        </div>
      </div>

      {/* Transaction history */}
      <div className="card" style={{ padding: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 14 }}>Transaction History</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {MOCK_TRANSACTIONS.map((tx, i) => (
            <div
              key={tx.id}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: i < MOCK_TRANSACTIONS.length - 1 ? '1px solid #F3F4F6' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  background: tx.type === 'debit' ? '#FEE2E2' : tx.type === 'bonus' ? '#FEF3C7' : '#DCFCE7',
                }}>
                  {tx.type === 'debit'
                    ? <Minus size={14} color="#EF4444" />
                    : tx.type === 'bonus'
                    ? <Gift size={14} color="#F59E0B" />
                    : <Plus size={14} color="#22C55E" />
                  }
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1F2937' }}>{tx.description}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>{tx.date}</div>
                </div>
              </div>
              <div style={{
                fontSize: 14, fontWeight: 700,
                color: tx.type === 'debit' ? '#EF4444' : tx.type === 'bonus' ? '#F59E0B' : '#22C55E',
              }}>
                {tx.type === 'debit' ? '-' : '+'}₹{tx.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Pending rating for a just-ended session */
const PENDING_RATING: SessionMemory & { pendingRating: true } = {
  id: 'pending',
  companionId: 'k1',
  companionName: 'Karthik Rao',
  companionPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop',
  date: new Date().toISOString().split('T')[0],
  activity: 'Movie Buddy',
  venue: 'Celebration Mall, Udaipur',
  rating: 0,
  note: '',
  platform: 'KoPartner',
  pendingRating: true,
};

function PostSessionRating({ session, onDone }: { session: typeof PENDING_RATING; onDone: () => void }) {
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div style={{
        background: '#DCFCE7', border: '1.5px solid #86EFAC',
        borderRadius: 14, padding: 16, marginBottom: 16, textAlign: 'center',
      }}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>🙏</div>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#065F46' }}>Review submitted! Thanks.</div>
        <div style={{ fontSize: 12, color: '#059669', marginTop: 4 }}>
          Your {stars}★ review helps other users find great companions.
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #FEF3C7, #FEF9C3)',
      border: '2px solid #FCD34D', borderRadius: 14, padding: 16, marginBottom: 16,
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 12 }}>
        ⭐ Rate Your Recent Session
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <img src={session.companionPhoto} alt={session.companionName}
          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 13 }}>{session.companionName}</div>
          <div style={{ fontSize: 11, color: '#6B7280' }}>{session.activity} · {session.venue}</div>
        </div>
      </div>

      {/* Star picker */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {[1,2,3,4,5].map(n => (
          <button
            key={n}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setStars(n)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <Star
              size={28}
              fill={(hover || stars) >= n ? '#F59E0B' : 'none'}
              color={(hover || stars) >= n ? '#F59E0B' : '#D1D5DB'}
            />
          </button>
        ))}
        {stars > 0 && (
          <span style={{ fontSize: 13, color: '#92400E', fontWeight: 700, alignSelf: 'center', marginLeft: 4 }}>
            {['', 'Poor', 'Fair', 'Good', 'Great', 'Amazing!'][stars]}
          </span>
        )}
      </div>

      <textarea
        className="jf-input"
        placeholder="Add a note about this session (optional)…"
        rows={2}
        value={note}
        onChange={e => setNote(e.target.value)}
        style={{ resize: 'none', marginBottom: 10, fontSize: 12 }}
      />

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className="btn-primary"
          disabled={stars === 0}
          onClick={() => setSubmitted(true)}
          style={{ flex: 1, padding: '9px 0', fontSize: 13 }}
        >
          Submit Review
        </button>
        <button
          onClick={onDone}
          style={{
            padding: '9px 14px', borderRadius: 100, fontSize: 13,
            background: 'none', border: '1.5px solid #FCD34D',
            color: '#92400E', cursor: 'pointer', fontWeight: 600,
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}

function SessionsTab() {
  const [showRating, setShowRating] = useState(true);
  const [bookAgainId, setBookAgainId] = useState<string | null>(null);

  return (
    <div>
      {/* Post-session rating prompt */}
      {showRating && (
        <PostSessionRating session={PENDING_RATING} onDone={() => setShowRating(false)} />
      )}

      <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>
        Your private session journal — only visible to you.
      </div>
      {MOCK_SESSIONS.map(s => (
        <div key={s.id} className="card" style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <img
              src={s.companionPhoto}
              alt={s.companionName}
              style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{s.companionName}</span>
                <div style={{ display: 'flex' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={11} fill={i < s.rating ? '#F59E0B' : 'none'} color={i < s.rating ? '#F59E0B' : '#D1D5DB'} />
                  ))}
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>
                {s.date} · {s.activity} · {s.venue}
              </div>
              <div style={{
                background: '#F5F3FF', borderRadius: 8, padding: '8px 10px',
                fontSize: 12, color: '#5B21B6', fontStyle: 'italic', lineHeight: 1.5,
                marginBottom: 10,
              }}>
                "{s.note}"
              </div>
              {/* Book Again shortcut */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setBookAgainId(bookAgainId === s.id ? null : s.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '5px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700,
                    background: '#F5F3FF', border: '1.5px solid #E9D5FF',
                    color: '#5B21B6', cursor: 'pointer',
                  }}
                >
                  🔁 Book Again
                </button>
                <span style={{
                  fontSize: 10, color: '#9CA3AF', alignSelf: 'center',
                  background: '#F3F4F6', padding: '3px 8px', borderRadius: 100,
                }}>
                  {s.platform}
                </span>
              </div>

              {/* Book Again quick form */}
              {bookAgainId === s.id && (
                <div style={{
                  marginTop: 10, padding: 12,
                  background: '#F5F3FF', borderRadius: 10,
                  border: '1.5px solid #E9D5FF',
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#5B21B6', marginBottom: 8 }}>
                    Quick re-book · {s.companionName}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input type="date" className="jf-input" style={{ fontSize: 12, flex: 1 }} defaultValue={new Date().toISOString().split('T')[0]} />
                    <select className="jf-select" style={{ fontSize: 12, flex: 1 }}>
                      <option>10:00 AM</option>
                      <option>2:00 PM</option>
                      <option selected>5:30 PM</option>
                    </select>
                  </div>
                  <button className="btn-primary" style={{ width: '100%', marginTop: 8, padding: '8px 0', fontSize: 12 }}>
                    Confirm Re-booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* AI Insight */}
      <div style={{
        background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)',
        border: '1.5px solid #C4B5FD', borderRadius: 14, padding: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <Activity size={14} color="#7C3AED" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#5B21B6' }}>Your Monthly Insight</span>
          <span style={{ fontSize: 10, background: '#7C3AED', color: '#fff', padding: '1px 6px', borderRadius: 100 }}>AI</span>
        </div>
        <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: 0 }}>
          You've had <strong>3 sessions</strong> this month — all involving outdoor activity or café settings.
          Your notes consistently mention feeling "calmer" and "energised" after sessions.
          Consider booking a recurring weekly slot with Arjun to build that momentum.
        </p>
      </div>
    </div>
  );
}

function WishlistTab() {
  return (
    <div>
      <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>
        You'll be notified when saved companions become available.
      </div>
      {MOCK_WISHLIST.map(c => (
        <div key={c.id} className="card" style={{ padding: 14, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src={c.photo}
            alt={c.name}
            style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{c.name}</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12, color: '#6B7280' }}>
              <span>₹{c.ratePerHour}/hr</span>
              <span>·</span>
              <Star size={11} fill="#F59E0B" color="#F59E0B" />
              <span>{c.rating}</span>
              <span>·</span>
              <span>{c.city}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <span className={c.available ? 'avail-on' : 'avail-off'}>
              <span className={c.available ? 'dot-on' : 'dot-off'} />
              {c.available ? 'Available' : 'Busy'}
            </span>
            {c.available && (
              <button className="btn-primary" style={{ padding: '5px 14px', fontSize: 12 }}>Book</button>
            )}
          </div>
        </div>
      ))}

      {MOCK_WISHLIST.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF' }}>
          <Heart size={32} style={{ marginBottom: 8, opacity: 0.3 }} />
          <p>No saved companions yet.<br />Tap the heart icon on any profile.</p>
        </div>
      )}
    </div>
  );
}

function CheckInTab() {
  const [scores, setScores] = useState<[number, number, number]>([0, 0, 0]);
  const [submitted, setSubmitted] = useState(false);

  const loneliness = scores.every(s => s > 0)
    ? Math.round(((5 - (scores.reduce((a, b) => a + b, 0) / 3)) / 4) * 100)
    : null;

  function handleSubmit() {
    if (scores.every(s => s > 0)) setSubmitted(true);
  }

  if (submitted) {
    const score = loneliness ?? 0;
    const label = score < 30 ? 'You\'re doing well' : score < 60 ? 'Moderate loneliness detected' : 'High loneliness detected';
    const color = score < 30 ? '#059669' : score < 60 ? '#D97706' : '#DC2626';
    const bg    = score < 30 ? '#DCFCE7' : score < 60 ? '#FEF3C7' : '#FEE2E2';
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <CheckCircle size={40} color={color} style={{ marginBottom: 12 }} />
        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1F2937', marginBottom: 8 }}>Check-in recorded</h3>
        <div style={{ background: bg, borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'inline-block' }}>
          <div style={{ fontSize: 28, fontWeight: 900, color }}>
            {score}%
          </div>
          <div style={{ fontSize: 13, color, fontWeight: 600 }}>{label}</div>
        </div>
        <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>
          {score >= 60
            ? 'We recommend talking to someone today. Consider booking a session or calling iCall: 9152987821.'
            : 'Keep it up! Regular companionship sessions can help maintain this.'}
        </p>
        {score >= 60 && (
          <a href="tel:9152987821" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#7C3AED', color: '#fff', padding: '10px 20px',
            borderRadius: 100, fontWeight: 700, fontSize: 13, textDecoration: 'none',
            marginTop: 10,
          }}>
            Call iCall Helpline
          </a>
        )}
      </div>
    );
  }

  return (
    <div>
      <div style={{
        background: '#F5F3FF', border: '1.5px solid #E9D5FF',
        borderRadius: 12, padding: 14, marginBottom: 20,
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <AlertCircle size={16} color="#7C3AED" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 12, color: '#5B21B6', margin: 0, lineHeight: 1.5 }}>
          This weekly check-in is anonymous and private. It helps us suggest the right companion and resources for you.
        </p>
      </div>

      {CHECKIN_QUESTIONS.map((q, i) => (
        <div key={i} style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10, lineHeight: 1.5 }}>
            {i + 1}. {q}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => setScores(prev => {
                  const next = [...prev] as [number, number, number];
                  next[i] = n;
                  return next;
                })}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 14,
                  fontWeight: 700, cursor: 'pointer',
                  background: scores[i] === n ? '#7C3AED' : '#F5F3FF',
                  color: scores[i] === n ? '#fff' : '#6B7280',
                  border: `1.5px solid ${scores[i] === n ? '#7C3AED' : '#E9D5FF'}`,
                  transition: 'all 0.15s',
                }}
              >
                {n}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>
            <span>Not at all</span><span>Very much</span>
          </div>
        </div>
      ))}

      <button
        className="btn-primary"
        onClick={handleSubmit}
        disabled={!scores.every(s => s > 0)}
        style={{ width: '100%', padding: '12px 0' }}
      >
        Submit Check-in
      </button>
    </div>
  );
}

/* ── Main Dashboard ─────────────────────────────────────────── */
type Tab = 'sessions' | 'wallet' | 'wishlist' | 'checkin' | 'safety';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'sessions', label: 'My Sessions', icon: <BookOpen size={14} /> },
  { id: 'wallet',   label: 'JF Credits', icon: <Wallet size={14} /> },
  { id: 'wishlist', label: 'Saved', icon: <Heart size={14} /> },
  { id: 'checkin',  label: 'Check-in', icon: <Activity size={14} /> },
  { id: 'safety',   label: 'Safety', icon: <TrendingUp size={14} /> },
];

interface Props {
  user: User;
  onBack: () => void;
}

export default function DashboardPage({ user, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('sessions');

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 20px' }}>
      {/* Back */}
      <button
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          color: '#6B7280', fontSize: 13, cursor: 'pointer',
          background: 'none', border: 'none', marginBottom: 16, fontFamily: 'inherit',
        }}
      >
        <ArrowLeft size={14} /> Back
      </button>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 800, color: '#fff',
          }}>
            {user.firstName[0]}
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#1F2937' }}>
              Hey, {user.firstName} 👋
            </div>
            <div style={{ fontSize: 13, color: '#6B7280' }}>{user.city} · Member</div>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10, marginTop: 16,
        }}>
          {[
            { label: 'Sessions', value: '3', icon: <Users size={14} color="#7C3AED" /> },
            { label: 'This Month', value: '3', icon: <Activity size={14} color="#059669" /> },
            { label: 'Avg Rating', value: '5.0 ★', icon: <Star size={14} color="#F59E0B" /> },
          ].map(s => (
            <div key={s.label} className="card-soft" style={{ padding: '12px 14px', borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#1F2937' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Refer & Earn banner */}
      <div style={{
        background: 'linear-gradient(135deg, #FEF3C7, #FEF9C3)',
        border: '1.5px solid #FCD34D', borderRadius: 12,
        padding: '12px 16px', marginBottom: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 2 }}>
            🎁 Refer a friend, earn ₹100 each
          </div>
          <div style={{ fontSize: 11, color: '#B45309' }}>Both get credits after their first session</div>
        </div>
        <button style={{
          background: '#F59E0B', color: '#fff', border: 'none',
          padding: '8px 14px', borderRadius: 100, fontSize: 12,
          fontWeight: 700, cursor: 'pointer', display: 'flex',
          alignItems: 'center', gap: 4,
        }}>
          Share <ChevronRight size={12} />
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto',
        paddingBottom: 4, scrollbarWidth: 'none',
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '8px 14px', borderRadius: 100, fontSize: 12,
              fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer',
              background: activeTab === t.id ? '#7C3AED' : '#F5F3FF',
              color: activeTab === t.id ? '#fff' : '#6B7280',
              border: `1.5px solid ${activeTab === t.id ? '#7C3AED' : '#E9D5FF'}`,
              transition: 'all 0.15s',
            }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'sessions' && <SessionsTab />}
      {activeTab === 'wallet'   && <WalletTab />}
      {activeTab === 'wishlist' && <WishlistTab />}
      {activeTab === 'checkin'  && <CheckInTab />}
      {activeTab === 'safety'   && (
        <div>
          <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>
            Manage your active session safety. The panic button sends your GPS to your emergency contact and our safety team instantly.
          </p>
          <PanicButton
            session={null}
            onUpdateStatus={(_: SessionCheckInStatus) => {}}
            emergencyContact="91-98765-43210"
          />
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Emergency Contact</div>
            <input
              className="jf-input"
              placeholder="Enter emergency contact number"
              defaultValue="91-98765-43210"
              style={{ marginBottom: 10 }}
            />
            <button className="btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>Save Contact</button>
          </div>
        </div>
      )}
    </div>
  );
}
