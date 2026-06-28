import { useState } from 'react';
import {
  X, Check, RefreshCw, Calendar, Clock, Heart,
  Tag, ChevronRight, Info, Star,
} from 'lucide-react';
import type { Companion, User } from '../types';
import { ACTIVITIES, TIME_SLOTS } from '../data/companions';

interface Props {
  companion: Companion;
  user: User;
  onClose: () => void;
  onWishlist?: (companionId: string) => void;
  wishlisted?: boolean;
}

type Frequency = 'weekly' | 'biweekly' | 'monthly';

const FREQ_CONFIG: Record<Frequency, { label: string; discount: number; description: string }> = {
  weekly:    { label: 'Every Week',   discount: 15, description: 'Best for consistent emotional support' },
  biweekly:  { label: 'Every 2 Weeks', discount: 10, description: 'Balanced rhythm for most users' },
  monthly:   { label: 'Once a Month',  discount: 5,  description: 'Occasional companionship' },
};

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

type Step = 1 | 2 | 3;

function StepDot({ n, current }: { n: Step; current: Step }) {
  const done = current > n;
  const active = current === n;
  return (
    <div className={`step-dot ${done ? 'done' : active ? 'active' : ''}`}>
      {done ? <Check size={13} /> : n}
    </div>
  );
}

export default function RecurringBookingModal({
  companion: c, user, onClose, onWishlist, wishlisted = false,
}: Props) {
  const [step, setStep] = useState<Step>(1);
  const [activity, setActivity] = useState('');
  const [weekday, setWeekday] = useState('Saturday');
  const [slot, setSlot] = useState('');
  const [duration, setDuration] = useState(2);
  const [frequency, setFrequency] = useState<Frequency>('weekly');
  const [sessions, setSessions] = useState(4); // commitment in sessions
  const [oathChecked, setOathChecked] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(wishlisted);
  const [confirmed, setConfirmed] = useState(false);

  const freqConfig = FREQ_CONFIG[frequency];
  const baseRate = c.ratePerHour * duration;
  const discountAmt = Math.round(baseRate * freqConfig.discount / 100);
  const discountedRate = baseRate - discountAmt;
  const gst = Math.round(discountedRate * 0.18);
  const perSession = discountedRate + gst;
  const totalCommitment = perSession * sessions;
  const advanceFirst = Math.round(perSession * 0.5);

  const bookingRef = 'JFSR-' + Math.random().toString(36).substr(2, 6).toUpperCase();

  const step1Valid = activity && weekday && slot;

  function handleWishlist() {
    setIsWishlisted(v => !v);
    onWishlist?.(c.id);
  }

  if (confirmed) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box" onClick={e => e.stopPropagation()}>
          <div className="success-wrap">
            <div className="success-icon">🔁</div>
            <h3 style={{ fontSize: 19, fontWeight: 800, color: '#1F2937', marginBottom: 8 }}>
              Recurring Session Set!
            </h3>
            <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, marginBottom: 6 }}>
              You've locked in <strong>{freqConfig.label}</strong> sessions with <strong>{c.name}</strong>.
            </p>
            <div style={{
              background: '#F5F3FF', border: '1.5px solid #E9D5FF',
              borderRadius: 12, padding: '14px 18px', marginBottom: 16, textAlign: 'left',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: '#374151' }}>
                <span>📅 Every <strong>{weekday}</strong> at <strong>{slot}</strong></span>
                <span>⏱ {duration}h · {activity}</span>
                <span>💰 ₹{perSession}/session (saved ₹{discountAmt})</span>
                <span>🔁 {sessions} sessions committed</span>
              </div>
            </div>
            <div style={{
              display: 'inline-block', fontSize: 13,
              background: '#EDE9FE', color: '#5B21B6',
              padding: '6px 14px', borderRadius: 100, fontWeight: 700, marginBottom: 20,
            }}>
              {bookingRef}
            </div>
            <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 20 }}>
              {c.name} will be notified and confirm within 2 hours. You'll get a reminder 24 hours before every session.
            </p>
            <button className="btn-primary" onClick={onClose}>Done ✓</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '20px 24px 0',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 16,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RefreshCw size={16} color="#7C3AED" />
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1F2937' }}>Recurring Session</h3>
            </div>
            <p style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
              Build a real connection. Save up to 15%.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Wishlist heart */}
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
              <Heart
                size={15}
                color={isWishlisted ? '#EF4444' : '#9CA3AF'}
                fill={isWishlisted ? '#EF4444' : 'none'}
              />
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Companion preview */}
        <div style={{
          margin: '0 24px 16px',
          padding: '12px 14px',
          background: '#F5F3FF', borderRadius: 10,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <img
            src={c.photo} alt={c.name}
            style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{c.name}</div>
            <div style={{ fontSize: 11, color: '#6B7280', display: 'flex', gap: 6 }}>
              <span>₹{c.ratePerHour}/hr</span>
              <span>·</span>
              <Star size={10} fill="#F59E0B" color="#F59E0B" />
              <span>{c.rating}</span>
              <span>· {c.sessions} sessions</span>
            </div>
          </div>
          <span style={{
            background: '#DCFCE7', color: '#065F46', fontSize: 11,
            fontWeight: 700, padding: '3px 9px', borderRadius: 100,
          }}>
            Up to 15% off
          </span>
        </div>

        {/* Step progress */}
        <div style={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          {([1, 2, 3] as Step[]).map((n, i) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', flex: n < 3 ? 1 : 'none' }}>
              <StepDot n={n} current={step} />
              {i < 2 && (
                <div style={{ flex: 1, height: 2, background: step > n ? '#7C3AED' : '#E9D5FF', margin: '0 4px' }} />
              )}
            </div>
          ))}
          <span style={{ fontSize: 11, color: '#6B7280', marginLeft: 6 }}>
            {step === 1 ? 'Schedule' : step === 2 ? 'Frequency' : 'Confirm'}
          </span>
        </div>

        {/* Scrollable body */}
        <div style={{ padding: '0 24px 24px', overflowY: 'auto', maxHeight: '50vh' }}>

          {/* ── STEP 1: Schedule ── */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, display: 'block' }}>
                  Activity
                </label>
                <select className="jf-select" value={activity} onChange={e => setActivity(e.target.value)}>
                  <option value="">Select activity…</option>
                  {ACTIVITIES.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, display: 'block' }}>
                  Preferred Day
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {WEEKDAYS.map(d => (
                    <button
                      key={d}
                      onClick={() => setWeekday(d)}
                      style={{
                        padding: '6px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                        border: `1.5px solid ${weekday === d ? '#7C3AED' : '#E9D5FF'}`,
                        background: weekday === d ? '#7C3AED' : '#fff',
                        color: weekday === d ? '#fff' : '#6B7280',
                        cursor: 'pointer',
                      }}
                    >
                      {d.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, display: 'block' }}>
                  Time Slot
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {TIME_SLOTS.map(s => (
                    <button
                      key={s}
                      onClick={() => setSlot(s)}
                      style={{
                        padding: '6px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                        border: `1.5px solid ${slot === s ? '#7C3AED' : '#E9D5FF'}`,
                        background: slot === s ? '#7C3AED' : '#fff',
                        color: slot === s ? '#fff' : '#6B7280',
                        cursor: 'pointer',
                        position: 'relative',
                      }}
                    >
                      {s}
                      {s === '5:30 PM' && (
                        <span style={{
                          position: 'absolute', top: -7, right: -4,
                          fontSize: 9, background: '#F59E0B', color: '#fff',
                          padding: '1px 4px', borderRadius: 100, fontWeight: 800,
                        }}>🌅</span>
                      )}
                    </button>
                  ))}
                </div>
                {slot === '5:30 PM' && (
                  <p style={{ fontSize: 11, color: '#D97706', marginTop: 6 }}>
                    🌅 Sunset Slot — Udaipur's premium window. A small premium applies.
                  </p>
                )}
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, display: 'block' }}>
                  Duration: {duration}h
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, color: '#6B7280' }}>1h</span>
                  <input
                    type="range" min={1} max={8} value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                    style={{ flex: 1, accentColor: '#7C3AED' }}
                  />
                  <span style={{ fontSize: 11, color: '#6B7280' }}>8h</span>
                </div>
              </div>

              <button
                className="btn-full"
                disabled={!step1Valid}
                onClick={() => setStep(2)}
              >
                Next: Choose Frequency <ChevronRight size={14} style={{ display: 'inline', verticalAlign: -2 }} />
              </button>
            </div>
          )}

          {/* ── STEP 2: Frequency & Pricing ── */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 10, display: 'block' }}>
                  How often?
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(Object.entries(FREQ_CONFIG) as [Frequency, typeof FREQ_CONFIG[Frequency]][]).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => setFrequency(key)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 14px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                        border: `2px solid ${frequency === key ? '#7C3AED' : '#E9D5FF'}`,
                        background: frequency === key ? '#F5F3FF' : '#fff',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#1F2937' }}>{cfg.label}</div>
                        <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{cfg.description}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          background: cfg.discount >= 15 ? '#DCFCE7' : '#F5F3FF',
                          color: cfg.discount >= 15 ? '#065F46' : '#5B21B6',
                          fontSize: 12, fontWeight: 800,
                          padding: '3px 9px', borderRadius: 100,
                        }}>
                          -{cfg.discount}%
                        </span>
                        {frequency === key && <Check size={16} color="#7C3AED" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sessions commitment */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, display: 'block' }}>
                  Commit for: {sessions} sessions
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[2, 4, 8, 12].map(n => (
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
                      {n}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing summary */}
              <div className="invoice-box">
                <div style={{ fontSize: 12, fontWeight: 700, color: '#5B21B6', marginBottom: 10 }}>
                  <Tag size={12} style={{ display: 'inline', verticalAlign: -2, marginRight: 4 }} />
                  Price per session
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, color: '#374151' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Standard rate ({duration}h)</span>
                    <span>₹{baseRate}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#22C55E' }}>
                    <span>Recurring discount (-{freqConfig.discount}%)</span>
                    <span>-₹{discountAmt}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>GST (18%)</span>
                    <span>₹{gst}</span>
                  </div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontWeight: 800, fontSize: 14, color: '#5B21B6',
                    borderTop: '1px solid #E9D5FF', paddingTop: 8, marginTop: 4,
                  }}>
                    <span>Per session</span>
                    <span>₹{perSession}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6B7280' }}>
                    <span>Total commitment ({sessions} sessions)</span>
                    <span>₹{totalCommitment}</span>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                background: '#EFF6FF', border: '1px solid #BFDBFE',
                borderRadius: 10, padding: '10px 12px', fontSize: 12, color: '#1E3A8A',
              }}>
                <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>First session advance: ₹{advanceFirst}. Remaining sessions billed 48 hours before each meetup. Cancel anytime with 72 hours notice.</span>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: 100, fontSize: 13,
                    fontWeight: 600, background: '#F5F3FF', color: '#5B21B6',
                    border: '1.5px solid #E9D5FF', cursor: 'pointer',
                  }}
                >
                  ← Back
                </button>
                <button className="btn-full" style={{ flex: 2 }} onClick={() => setStep(3)}>
                  Review & Confirm →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Confirm ── */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Summary card */}
              <div style={{
                background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)',
                border: '1.5px solid #C4B5FD', borderRadius: 14, padding: 18,
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#5B21B6', marginBottom: 12 }}>
                  📋 Booking Summary
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, color: '#374151' }}>
                  <div><span style={{ color: '#9CA3AF' }}>Companion</span><br /><strong>{c.name}</strong></div>
                  <div><span style={{ color: '#9CA3AF' }}>Activity</span><br /><strong>{activity}</strong></div>
                  <div><span style={{ color: '#9CA3AF' }}>Schedule</span><br /><strong>{freqConfig.label}, {weekday}s</strong></div>
                  <div><span style={{ color: '#9CA3AF' }}>Time</span><br /><strong>{slot} · {duration}h</strong></div>
                  <div><span style={{ color: '#9CA3AF' }}>Sessions</span><br /><strong>{sessions} booked</strong></div>
                  <div><span style={{ color: '#9CA3AF' }}>Per session</span><br /><strong style={{ color: '#5B21B6' }}>₹{perSession}</strong></div>
                </div>
                <div style={{
                  marginTop: 12, padding: '8px 12px',
                  background: '#fff', borderRadius: 8, fontSize: 12, color: '#065F46', fontWeight: 600,
                }}>
                  💰 You save ₹{discountAmt * sessions} vs individual bookings
                </div>
              </div>

              <div className="oath-box">
                <input
                  type="checkbox" id="oath-recurring"
                  checked={oathChecked}
                  onChange={e => setOathChecked(e.target.checked)}
                />
                <label htmlFor="oath-recurring">
                  <strong>The Platonic Oath:</strong> I commit to treating my companion with complete respect in every session, meeting only in public venues, and never requesting romantic or physically intimate gestures.
                </label>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setStep(2)}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: 100, fontSize: 13,
                    fontWeight: 600, background: '#F5F3FF', color: '#5B21B6',
                    border: '1.5px solid #E9D5FF', cursor: 'pointer',
                  }}
                >
                  ← Back
                </button>
                <button
                  className="btn-full"
                  style={{ flex: 2 }}
                  disabled={!oathChecked}
                  onClick={() => setConfirmed(true)}
                >
                  🔒 Start Recurring Series
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
