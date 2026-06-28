import { useState } from 'react';
import {
  Gift, Users, GraduationCap, Briefcase, Zap,
  ArrowLeft, Copy, Check, Share2, Phone, Mail,
  Star, Clock, ChevronRight, Tag,
} from 'lucide-react';
import type { User } from '../types';

interface Props {
  user: User | null;
  onBack: () => void;
  onNeedAuth: () => void;
}

/* ── Mock last-minute discount companions ── */
const LAST_MINUTE = [
  {
    id: 'r1', name: 'Arjun Mehta', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop',
    activity: 'Lake Walk', city: 'Udaipur', originalRate: 499, discountPct: 20,
    availableUntil: '7:00 PM', slot: '5:30 PM', rating: 4.9,
  },
  {
    id: 'ku2', name: 'Siddharth Kulkarni', photo: 'https://images.unsplash.com/photo-1530268729831-4b0b9e170218?w=60&h=60&fit=crop',
    activity: 'Sunset Stroll', city: 'Udaipur', originalRate: 599, discountPct: 25,
    availableUntil: '6:30 PM', slot: '4:00 PM', rating: 4.9,
  },
  {
    id: 'r2', name: 'Rohan Desai', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop',
    activity: 'Foodie Tour', city: 'Jodhpur', originalRate: 299, discountPct: 20,
    availableUntil: '8:00 PM', slot: '6:00 PM', rating: 4.7,
  },
];

/* ── Section components ──────────────────────────────────── */

function ReferSection({ user, onNeedAuth }: { user: User | null; onNeedAuth: () => void }) {
  const [copied, setCopied] = useState(false);
  const referCode = user ? `JF-${user.firstName.toUpperCase().slice(0, 3)}${user.aadhaarLast4}` : 'JF-XXXXX';

  function handleCopy() {
    navigator.clipboard.writeText(referCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleWhatsApp() {
    if (!user) { onNeedAuth(); return; }
    const msg = encodeURIComponent(
      `Hey! Try Just Friends — Rajasthan's first verified platonic companionship platform in Udaipur & Jodhpur 🙏\n\nUse my code *${referCode}* and we both get ₹100 credits after your first session!\n\nhttps://justfriends.in`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  }

  return (
    <div className="card" style={{ padding: 20, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Users size={18} color="#22C55E" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, color: '#1F2937' }}>Refer & Earn</div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>₹100 for you + ₹100 for your friend</div>
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
        borderRadius: 12, padding: 16, marginBottom: 16, textAlign: 'center',
      }}>
        <div style={{ fontSize: 12, color: '#065F46', marginBottom: 6 }}>Your referral code</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#065F46', letterSpacing: 2 }}>{referCode}</div>
        <div style={{ fontSize: 11, color: '#059669', marginTop: 4 }}>
          Credited after friend's first completed session
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={handleCopy}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 700,
            background: copied ? '#DCFCE7' : '#F5F3FF',
            color: copied ? '#065F46' : '#5B21B6',
            border: `1.5px solid ${copied ? '#86EFAC' : '#E9D5FF'}`,
            cursor: 'pointer',
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
        <button
          onClick={handleWhatsApp}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 700,
            background: '#25D366', color: '#fff', border: 'none', cursor: 'pointer',
          }}
        >
          <Share2 size={14} />
          Share on WhatsApp
        </button>
      </div>

      <div style={{ marginTop: 14, fontSize: 12, color: '#6B7280', lineHeight: 1.6 }}>
        <strong>How it works:</strong><br />
        1. Share your code · 2. Friend registers & books · 3. Both get ₹100 credits · 4. No limit on referrals!
      </div>
    </div>
  );
}

function GiftSection({ user, onNeedAuth }: { user: User | null; onNeedAuth: () => void }) {
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [platform, setPlatform] = useState('RABF');
  const [sessions, setSessions] = useState(1);
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);

  const platforms = [
    { id: 'RABF', label: 'RABF', emoji: '🤝' },
    { id: 'KoPartner', label: 'KoPartner', emoji: '💜' },
    { id: 'Kumpanio', label: 'Kumpanio', emoji: '🏙️' },
  ];

  const pricePerSession = { RABF: 499, KoPartner: 549, Kumpanio: 399 }[platform] ?? 499;
  const total = pricePerSession * sessions;

  function handleSend() {
    if (!user) { onNeedAuth(); return; }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="card" style={{ padding: 20, marginBottom: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🎁</div>
        <div style={{ fontWeight: 800, fontSize: 16, color: '#1F2937', marginBottom: 8 }}>Gift Sent!</div>
        <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>
          <strong>{recipientName}</strong> will receive a WhatsApp message with their gift session link. Valid for 30 days.
        </p>
        <button
          onClick={() => { setSent(false); setRecipientName(''); setRecipientPhone(''); setNote(''); }}
          className="btn-primary"
          style={{ marginTop: 16, padding: '8px 20px' }}
        >
          Send Another Gift
        </button>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 20, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Gift size={18} color="#F59E0B" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, color: '#1F2937' }}>Gift a Session</div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>Send via WhatsApp · Perfect for Diwali, birthdays</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 4, display: 'block' }}>Recipient's Name</label>
          <input className="jf-input" placeholder="Their first name" value={recipientName} onChange={e => setRecipientName(e.target.value)} />
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 4, display: 'block' }}>WhatsApp Number</label>
          <input className="jf-input" placeholder="+91 98765 43210" value={recipientPhone} onChange={e => setRecipientPhone(e.target.value)} />
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 8, display: 'block' }}>Platform</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {platforms.map(p => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 10, fontSize: 12, fontWeight: 700,
                  border: `1.5px solid ${platform === p.id ? '#7C3AED' : '#E9D5FF'}`,
                  background: platform === p.id ? '#F5F3FF' : '#fff',
                  color: platform === p.id ? '#5B21B6' : '#6B7280',
                  cursor: 'pointer',
                }}
              >
                {p.emoji} {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 8, display: 'block' }}>Sessions to Gift</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3, 5].map(n => (
              <button
                key={n}
                onClick={() => setSessions(n)}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 10, fontSize: 12, fontWeight: 700,
                  border: `1.5px solid ${sessions === n ? '#7C3AED' : '#E9D5FF'}`,
                  background: sessions === n ? '#7C3AED' : '#fff',
                  color: sessions === n ? '#fff' : '#6B7280',
                  cursor: 'pointer',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 4, display: 'block' }}>Personal Note (optional)</label>
          <textarea
            className="jf-input"
            placeholder="e.g. Wishing you less lonely days this Diwali 🪔"
            rows={2}
            value={note}
            onChange={e => setNote(e.target.value)}
            style={{ resize: 'none' }}
          />
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#F5F3FF', borderRadius: 10, padding: '10px 14px',
        }}>
          <span style={{ fontSize: 13, color: '#374151' }}>Total: <strong style={{ color: '#5B21B6' }}>₹{total}</strong></span>
          <span style={{ fontSize: 11, color: '#6B7280' }}>{sessions} session{sessions > 1 ? 's' : ''} × ₹{pricePerSession}</span>
        </div>

        <button
          className="btn-full"
          onClick={handleSend}
          disabled={!recipientName.trim() || !recipientPhone.trim()}
        >
          🎁 Send Gift Card via WhatsApp
        </button>
      </div>
    </div>
  );
}

function StudentSection({ user, onNeedAuth }: { user: User | null; onNeedAuth: () => void }) {
  const [college, setCollege] = useState('');
  const [enrollmentId, setEnrollmentId] = useState('');
  const [applied, setApplied] = useState(false);

  const colleges = [
    'Mohanlal Sukhadia University (MLSU)',
    'Pacific University Udaipur',
    'NIMS University Jaipur',
    'Jai Narain Vyas University (Jodhpur)',
    'MBM University Jodhpur',
    'Other',
  ];

  return (
    <div className="card" style={{ padding: 20, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <GraduationCap size={18} color="#7C3AED" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, color: '#1F2937' }}>Student Plan</div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>30% off for verified students · Udaipur & Jodhpur colleges</div>
        </div>
      </div>

      {applied ? (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎓</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1F2937', marginBottom: 6 }}>Application received!</div>
          <p style={{ fontSize: 13, color: '#6B7280' }}>
            We'll verify your enrollment and activate the student discount within 24 hours.
          </p>
        </div>
      ) : (
        <>
          <div style={{
            background: '#F5F3FF', borderRadius: 10, padding: 14, marginBottom: 14,
            display: 'flex', gap: 8,
          }}>
            <Tag size={14} color="#7C3AED" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 12, color: '#5B21B6', lineHeight: 1.5 }}>
              30% discount applied at checkout once verified. Works on all platforms — RABF, KoPartner, Kumpanio.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 4, display: 'block' }}>College / University</label>
              <select className="jf-select" value={college} onChange={e => setCollege(e.target.value)}>
                <option value="">Select your college…</option>
                {colleges.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 4, display: 'block' }}>Enrollment / Student ID</label>
              <input className="jf-input" placeholder="e.g. 22BTECH0042" value={enrollmentId} onChange={e => setEnrollmentId(e.target.value)} />
            </div>

            <button
              className="btn-full"
              onClick={() => { if (!user) { onNeedAuth(); return; } if (college && enrollmentId) setApplied(true); }}
              disabled={!college || !enrollmentId.trim()}
            >
              Apply for Student Discount
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function CorporateSection({ user, onNeedAuth }: { user: User | null; onNeedAuth: () => void }) {
  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="card" style={{ padding: 20, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Briefcase size={18} color="#1D4ED8" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, color: '#1F2937' }}>Corporate Wellness</div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>Bulk session bundles · Employee mental wellness</div>
        </div>
      </div>

      {submitted ? (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📧</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1F2937', marginBottom: 6 }}>Inquiry submitted!</div>
          <p style={{ fontSize: 13, color: '#6B7280' }}>
            Our team will reach out to <strong>{email}</strong> within 1 business day with a customised package.
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            {[
              { n: '₹999', l: '/employee/month', d: 'Starter (5–15 emp)' },
              { n: '₹799', l: '/employee/month', d: 'Growth (15–50 emp)' },
              { n: '₹599', l: '/employee/month', d: 'Enterprise (50+)' },
              { n: '1 hr/mo', l: 'guaranteed', d: 'Per employee' },
            ].map(s => (
              <div key={s.d} style={{ background: '#EFF6FF', borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#1D4ED8' }}>{s.n}</div>
                <div style={{ fontSize: 10, color: '#3B82F6' }}>{s.l}</div>
                <div style={{ fontSize: 11, color: '#374151', marginTop: 2 }}>{s.d}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input className="jf-input" placeholder="Company Name" value={company} onChange={e => setCompany(e.target.value)} />
            <input className="jf-input" placeholder="Your Name" value={contactName} onChange={e => setContactName(e.target.value)} />
            <input className="jf-input" placeholder="Work Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="jf-input" placeholder="Team Size" type="number" value={teamSize} onChange={e => setTeamSize(e.target.value)} />

            <div style={{ display: 'flex', gap: 8 }}>
              <a
                href="tel:9876543210"
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 700,
                  background: '#DBEAFE', color: '#1D4ED8', border: 'none', textDecoration: 'none',
                }}
              >
                <Phone size={13} /> Call Sales
              </a>
              <button
                className="btn-full"
                style={{ flex: 2 }}
                onClick={() => { if (!company || !email) return; setSubmitted(true); }}
                disabled={!company.trim() || !email.trim()}
              >
                <Mail size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: -2 }} />
                Submit Inquiry
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function LastMinuteSection() {
  const [booked, setBooked] = useState<string[]>([]);

  return (
    <div className="card" style={{ padding: 20, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={18} color="#EF4444" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#1F2937' }}>Last-Minute Deals</div>
            <div style={{ fontSize: 12, color: '#6B7280' }}>Fill empty slots · Up to 25% off · Today only</div>
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: '#FEE2E2', borderRadius: 100, padding: '4px 10px',
        }}>
          <Clock size={11} color="#EF4444" />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#EF4444' }}>Expires today</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {LAST_MINUTE.map(lm => {
          const discountedRate = Math.round(lm.originalRate * (1 - lm.discountPct / 100));
          const isBooked = booked.includes(lm.id);
          return (
            <div
              key={lm.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: 12, background: '#FFF7ED',
                border: '1.5px solid #FED7AA', borderRadius: 12,
                opacity: isBooked ? 0.6 : 1,
              }}
            >
              <img
                src={lm.photo} alt={lm.name}
                style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{lm.name}</div>
                <div style={{ fontSize: 11, color: '#6B7280' }}>
                  {lm.activity} · {lm.city} · {lm.slot}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                  <Star size={10} fill="#F59E0B" color="#F59E0B" />
                  <span style={{ fontSize: 11, color: '#6B7280' }}>{lm.rating}</span>
                  <span style={{ fontSize: 10, color: '#EF4444', fontWeight: 700 }}>· -{lm.discountPct}%</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#EF4444' }}>₹{discountedRate}</div>
                  <div style={{ fontSize: 10, color: '#9CA3AF', textDecoration: 'line-through' }}>₹{lm.originalRate}</div>
                </div>
                <button
                  onClick={() => setBooked(b => [...b, lm.id])}
                  disabled={isBooked}
                  style={{
                    padding: '5px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700,
                    background: isBooked ? '#E9D5FF' : '#EF4444',
                    color: isBooked ? '#5B21B6' : '#fff',
                    border: 'none', cursor: isBooked ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isBooked ? 'Booked ✓' : 'Book Now'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 12, fontSize: 11, color: '#9CA3AF', textAlign: 'center' }}>
        Last-minute slots refresh daily at 12 PM. Check back tomorrow for new deals.
      </div>
    </div>
  );
}

/* ── Tab definitions ─────────────────────────────────────── */
type Tab = 'refer' | 'gift' | 'student' | 'corporate' | 'deals';

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'deals',     label: 'Flash Deals', emoji: '⚡' },
  { id: 'refer',     label: 'Refer & Earn', emoji: '🤝' },
  { id: 'gift',      label: 'Gift Session', emoji: '🎁' },
  { id: 'student',   label: 'Student', emoji: '🎓' },
  { id: 'corporate', label: 'Corporate', emoji: '🏢' },
];

export default function RewardsPage({ user, onBack, onNeedAuth }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('deals');

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
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1F2937', marginBottom: 4 }}>
          Rewards & Savings
        </h2>
        <p style={{ fontSize: 13, color: '#6B7280' }}>
          Refer friends, gift sessions, unlock student & corporate plans.
        </p>
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
            <span>{t.emoji}</span>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'deals'     && <LastMinuteSection />}
      {activeTab === 'refer'     && <ReferSection user={user} onNeedAuth={onNeedAuth} />}
      {activeTab === 'gift'      && <GiftSection user={user} onNeedAuth={onNeedAuth} />}
      {activeTab === 'student'   && <StudentSection user={user} onNeedAuth={onNeedAuth} />}
      {activeTab === 'corporate' && <CorporateSection user={user} onNeedAuth={onNeedAuth} />}
    </div>
  );
}
