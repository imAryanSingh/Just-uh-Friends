import { useState } from 'react';
import { X, Check, ShieldCheck } from 'lucide-react';
import type { Companion, User } from '../types';
import { ACTIVITIES, TIME_SLOTS } from '../data/companions';

interface Props {
  companion: Companion;
  user: User;
  onClose: () => void;
}

type Step = 1 | 2 | 3;

/* ── QR pattern (static decorative) ── */
const QR_CELLS = [
  [1,1,1,1,1,1,1,0,1,0,0,0,1,0,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,1,1,0,1,1,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,0,1,0,0,0,0,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,1,1,0,1,0,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0],
  [1,0,1,1,0,1,1,1,1,0,1,0,1,1,1,1,0,0,1,0,1],
  [0,1,1,0,0,1,0,1,0,1,1,1,0,0,0,1,1,0,0,1,0],
  [1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,0,1,0,0,1],
  [0,0,1,0,1,0,0,0,0,1,0,0,1,0,0,1,0,1,1,0,0],
  [1,1,0,0,1,1,1,1,1,0,1,1,0,1,0,1,1,0,0,1,1],
  [0,0,0,0,0,0,0,1,1,0,1,0,1,0,0,1,0,1,0,0,1],
  [0,0,0,0,0,0,0,1,0,0,1,1,0,0,1,0,1,0,0,1,0],
  [1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,0,0,1,1,0,1],
  [1,0,0,0,0,0,1,0,1,0,0,1,1,1,1,1,0,0,0,0,1],
  [1,0,1,1,1,0,1,1,0,1,0,0,0,0,1,0,1,0,1,0,0],
  [1,0,1,1,1,0,1,0,1,0,1,1,0,0,1,1,0,0,0,1,0],
  [1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,1,0,1,0,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,0,0,1,1],
];

function QRCode() {
  const sz = 100 / QR_CELLS.length;
  return (
    <svg width="120" height="120" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {QR_CELLS.flatMap((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={Math.round(c * sz)}
              y={Math.round(r * sz)}
              width={Math.round(sz)}
              height={Math.round(sz)}
              fill="#7C3AED"
            />
          ) : null
        )
      )}
    </svg>
  );
}

/* ── Step dot ── */
function StepDot({ n, current }: { n: Step; current: Step }) {
  const done = current > n;
  const active = current === n;
  return (
    <div className={`step-dot ${done ? 'done' : active ? 'active' : ''}`}>
      {done ? <Check size={13} /> : n}
    </div>
  );
}

export default function BookingModal({ companion: c, user, onClose }: Props) {
  const today = new Date().toISOString().split('T')[0];

  const [step, setStep] = useState<Step>(1);
  const [activity, setActivity] = useState('');
  const [date, setDate] = useState(today);
  const [slot, setSlot] = useState('');
  const [duration, setDuration] = useState(2);
  const [venue, setVenue] = useState('');
  const [payUploaded, setPayUploaded] = useState(false);
  const [oathChecked, setOathChecked] = useState(false);
  const [bookingRef] = useState('JF-' + Math.random().toString(36).substr(2, 6).toUpperCase());

  const base = c.ratePerHour * duration + 250;
  const gst = Math.round(base * 0.18);
  const total = Math.round(base + gst);
  const advance = Math.round(total / 2);
  const remaining = total - advance;

  function goStep2() {
    if (!activity) { alert('Please select an activity.'); return; }
    if (!slot)     { alert('Please select a time slot.'); return; }
    if (!venue.trim()) { alert('Please enter a public venue.'); return; }
    setStep(2);
  }

  const canConfirm = payUploaded && oathChecked;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '22px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1F2937' }}>
            {step === 3 ? '✅ Booking Confirmed!' : '📅 Book a Timeline'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '0 24px 24px' }}>
          {/* Step indicator */}
          <div className="step-wrap">
            <StepDot n={1} current={step} />
            <div className={`step-line ${step > 1 ? 'done' : ''}`} />
            <StepDot n={2} current={step} />
            <div className={`step-line ${step > 2 ? 'done' : ''}`} />
            <StepDot n={3} current={step} />
          </div>

          {/* Companion preview */}
          {step < 3 && (
            <div className="comp-prev">
              <img src={c.photo} alt={c.name} onError={(e) => { (e.target as HTMLImageElement).style.background = '#EDE9FE'; }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#1F2937' }}>{c.name}, {c.age}</div>
                <div style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2, flexWrap: 'wrap' }}>
                  📍 {c.city}
                  <span className="aadh-badge" style={{ fontSize: 10 }}><ShieldCheck size={10} /> Aadhaar Verified</span>
                </div>
              </div>
              <div style={{ fontWeight: 800, color: '#5B21B6', fontSize: 14 }}>₹{c.ratePerHour}/hr</div>
            </div>
          )}

          {/* ── STEP 1: Details ── */}
          {step === 1 && (
            <>
              <div className="f-group">
                <label className="f-label">Activity Profile</label>
                <select className="jf-select" value={activity} onChange={(e) => setActivity(e.target.value)}>
                  <option value="">Select activity...</option>
                  {ACTIVITIES.map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>

              <div className="f-group">
                <label className="f-label">Select Date</label>
                <input className="jf-input" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} />
              </div>

              <div className="f-group">
                <label className="f-label">Select Time Slot</label>
                <div className="slots-grid">
                  {TIME_SLOTS.map((s) => (
                    <button
                      key={s}
                      className={`slot-btn ${slot === s ? 'on' : ''}`}
                      onClick={() => setSlot(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="f-group">
                <label className="f-label">Duration: {duration} hr{duration > 1 ? 's' : ''}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, color: '#6B7280' }}>1h</span>
                  <input
                    type="range" min={1} max={8} step={1} value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: 11, color: '#6B7280' }}>8h</span>
                </div>
              </div>

              <div className="f-group">
                <label className="f-label">Proposed Public Venue <span style={{ color: '#DC2626', fontSize: 11 }}>*Required</span></label>
                <input
                  className="jf-input"
                  type="text"
                  placeholder="e.g. Ambrai Ghat lakeside cafe, Udaipur"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                />
              </div>

              <button className="btn-full" onClick={goStep2}>Next: Review & Pay →</button>
            </>
          )}

          {/* ── STEP 2: Payment ── */}
          {step === 2 && (
            <>
              {/* Invoice */}
              <div className="invoice-box">
                <div className="inv-row"><span>Base Companionship</span><span>₹{c.ratePerHour} × {duration} hr{duration > 1 ? 's' : ''}</span></div>
                <div className="inv-row"><span>Real-time GPS Tracking</span><span>₹250</span></div>
                <div className="inv-row"><span>GST (18%)</span><span>₹{gst}</span></div>
                <div className="inv-total"><span>Total</span><span>₹{total}</span></div>
                <div className="inv-half"><span>💰 Pay Now (50% Advance)</span><span>₹{advance}</span></div>
                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 6 }}>
                  Remaining ₹{remaining} paid directly to companion on meetup.
                </div>
              </div>

              {/* UPI QR */}
              <div className="upi-box">
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1F2937' }}>
                  Scan to pay ₹{advance} via UPI
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0', background: '#fff', border: '2px solid #E9D5FF', borderRadius: 8, padding: 8, width: 136, marginLeft: 'auto', marginRight: 'auto' }}>
                  <QRCode />
                </div>
                <div className="upi-id">justfriends@upi</div>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 8, lineHeight: 1.5 }}>
                  Pay ₹{advance} · Add note: {c.name.split(' ')[0]}-JF<br />
                  Upload payment screenshot to confirm booking.
                </div>
              </div>

              {/* Upload */}
              <div className="f-group">
                <label className="f-label">Upload Payment Screenshot <span style={{ color: '#DC2626', fontSize: 11 }}>*Required</span></label>
                <div
                  className={`upload-zone ${payUploaded ? 'done' : ''}`}
                  onClick={() => setPayUploaded(true)}
                >
                  {payUploaded ? (
                    <><Check size={18} color="#22C55E" style={{ display: 'block', margin: '0 auto 4px' }} /><span style={{ color: '#166534', fontWeight: 600 }}>Payment screenshot uploaded ✓</span></>
                  ) : (
                    <>📤<br />Tap to confirm payment</>
                  )}
                </div>
              </div>

              {/* Oath */}
              <div className="oath-box">
                <input
                  type="checkbox"
                  id="oath"
                  checked={oathChecked}
                  onChange={(e) => setOathChecked(e.target.checked)}
                />
                <label htmlFor="oath">
                  <strong>The Platonic Oath:</strong> I promise to treat my companion with complete respect, meet strictly in the listed public place, and never request any romantic or physically intimate gestures.
                </label>
              </div>

              <button
                className="btn-full"
                disabled={!canConfirm}
                onClick={() => setStep(3)}
              >
                🔒 Confirm Booking
              </button>
            </>
          )}

          {/* ── STEP 3: Success ── */}
          {step === 3 && (
            <div className="success-wrap">
              <div className="success-icon">💜</div>
              <h3 style={{ fontSize: 19, fontWeight: 800, color: '#1F2937', marginBottom: 7 }}>
                You're booked, {user.firstName}!
              </h3>
              <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, marginBottom: 6 }}>
                <strong>{c.name}</strong> has been notified and will confirm within 30 minutes.
              </p>
              <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 4 }}>📅 {date} · {slot} · {activity}</p>
              <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>📍 {venue}</p>
              <p style={{ fontSize: 13, color: '#166534', fontWeight: 600, marginBottom: 12 }}>
                ✓ ₹{advance} advance paid · ₹{remaining} on meetup
              </p>
              <div style={{ display: 'inline-block', fontSize: 13, background: '#EDE9FE', color: '#5B21B6', padding: '6px 14px', borderRadius: 100, fontWeight: 600 }}>
                Booking Ref: {bookingRef}
              </div>
              <br /><br />
              <button className="btn-primary" onClick={onClose}>Done ✓</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
