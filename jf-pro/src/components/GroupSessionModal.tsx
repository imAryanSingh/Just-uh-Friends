import { useState } from 'react';
import { X, Users, Plus, Trash2, Check, ShieldCheck, Split } from 'lucide-react';
import type { Companion, User } from '../types';
import { ACTIVITIES, TIME_SLOTS } from '../data/companions';

interface Props {
  companion: Companion;
  user: User;
  onClose: () => void;
}

interface GroupMember {
  id: string;
  name: string;
  phone: string;
  paid: boolean;
}

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

export default function GroupSessionModal({ companion: c, user, onClose }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const [step, setStep] = useState<Step>(1);

  // Step 1 — session details
  const [activity, setActivity] = useState('');
  const [date, setDate] = useState(today);
  const [slot, setSlot] = useState('');
  const [duration, setDuration] = useState(2);
  const [venue, setVenue] = useState('');

  // Group members (organiser is always included)
  const [members, setMembers] = useState<GroupMember[]>([
    { id: 'u0', name: user.firstName + ' ' + user.lastName, phone: user.phone, paid: true },
    { id: 'u1', name: '', phone: '', paid: false },
  ]);

  const [bookingRef] = useState('JFG-' + Math.random().toString(36).substr(2, 6).toUpperCase());

  // Pricing
  const baseCompanion = c.ratePerHour * duration;
  const gps = 250;
  const groupSurcharge = Math.round(baseCompanion * 0.1); // 10% for group coordination
  const subtotal = baseCompanion + gps + groupSurcharge;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const validMembers = members.filter(m => m.name.trim() && m.phone.trim());
  const memberCount = Math.max(validMembers.length, 1);
  const perPerson = Math.ceil(total / memberCount);
  const advance = Math.ceil(perPerson * 0.5);

  function addMember() {
    if (members.length >= 4) return;
    setMembers(m => [...m, { id: 'u' + Date.now(), name: '', phone: '', paid: false }]);
  }

  function removeMember(id: string) {
    if (members.length <= 2) return;
    setMembers(m => m.filter(x => x.id !== id));
  }

  function updateMember(id: string, field: 'name' | 'phone', value: string) {
    setMembers(m => m.map(x => x.id === id ? { ...x, [field]: value } : x));
  }

  function goStep2() {
    if (!activity) { alert('Select an activity.'); return; }
    if (!slot) { alert('Select a time slot.'); return; }
    if (!venue.trim()) { alert('Enter a venue.'); return; }
    if (validMembers.length < 2) { alert('Add at least one more group member.'); return; }
    setStep(2);
  }

  function goStep3() {
    setStep(3);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
        {/* Header */}
        <div style={{ padding: '22px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1F2937', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={18} color="#7C3AED" />
              {step === 3 ? '✅ Group Session Booked!' : 'Group Session'}
            </h3>
            {step < 3 && (
              <p style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                Share one companion among 2–4 friends. Bill splits automatically.
              </p>
            )}
          </div>
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
              <img src={c.photo} alt={c.name} onError={e => { (e.target as HTMLImageElement).style.background = '#EDE9FE'; }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1F2937' }}>{c.name}, {c.age}</div>
                <div style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  📍 {c.city}
                  <span className="aadh-badge" style={{ fontSize: 10 }}><ShieldCheck size={10} /> Aadhaar</span>
                </div>
              </div>
              <div style={{ fontWeight: 800, color: '#5B21B6', fontSize: 14 }}>₹{c.ratePerHour}/hr</div>
            </div>
          )}

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <>
              <div className="f-group">
                <label className="f-label">Activity</label>
                <select className="jf-select" value={activity} onChange={e => setActivity(e.target.value)}>
                  <option value="">Select activity...</option>
                  {ACTIVITIES.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="f-group">
                  <label className="f-label">Date</label>
                  <input className="jf-input" type="date" min={today} value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="f-group">
                  <label className="f-label">Duration</label>
                  <select className="jf-select" value={duration} onChange={e => setDuration(Number(e.target.value))}>
                    {[1, 2, 3, 4].map(h => <option key={h} value={h}>{h} hr{h > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>

              <div className="f-group">
                <label className="f-label">Time Slot</label>
                <div className="slots-grid">
                  {TIME_SLOTS.map(s => (
                    <button key={s} className={`slot-btn ${slot === s ? 'on' : ''}`} onClick={() => setSlot(s)}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="f-group">
                <label className="f-label">Public Venue</label>
                <input
                  className="jf-input"
                  placeholder="e.g. Millets of Mewar, Udaipur"
                  value={venue}
                  onChange={e => setVenue(e.target.value)}
                />
              </div>

              {/* Group Members */}
              <div className="f-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <label className="f-label" style={{ margin: 0 }}>Group Members ({members.length}/4)</label>
                  {members.length < 4 && (
                    <button
                      onClick={addMember}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 4, fontSize: 12,
                        color: '#7C3AED', background: '#F5F3FF', border: '1.5px solid #E9D5FF',
                        borderRadius: 100, padding: '4px 10px', cursor: 'pointer', fontWeight: 600,
                      }}
                    >
                      <Plus size={11} /> Add Member
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {members.map((m, i) => (
                    <div key={m.id} style={{
                      background: i === 0 ? '#F5F3FF' : '#fff',
                      border: '1.5px solid #E9D5FF',
                      borderRadius: 10, padding: '10px 12px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: i === 0 ? 0 : 8 }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: '50%',
                          background: '#7C3AED', color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 800, flexShrink: 0,
                        }}>
                          {i + 1}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 13, color: '#374151', flex: 1 }}>
                          {i === 0 ? `${m.name} (You — Organiser)` : `Member ${i + 1}`}
                        </span>
                        {i > 1 && (
                          <button onClick={() => removeMember(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}>
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                      {i > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          <input
                            className="jf-input"
                            placeholder="Full name"
                            value={m.name}
                            onChange={e => updateMember(m.id, 'name', e.target.value)}
                            style={{ fontSize: 12, padding: '7px 10px' }}
                          />
                          <input
                            className="jf-input"
                            placeholder="Mobile"
                            value={m.phone}
                            onChange={e => updateMember(m.id, 'phone', e.target.value)}
                            style={{ fontSize: 12, padding: '7px 10px' }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Live split preview */}
              <div style={{
                background: '#EDE9FE', border: '1.5px solid #C4B5FD',
                borderRadius: 10, padding: '12px 14px', marginBottom: 16,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <Split size={16} color="#7C3AED" />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#5B21B6' }}>
                    ₹{perPerson}/person
                  </div>
                  <div style={{ fontSize: 11, color: '#7C3AED' }}>
                    Total ₹{total} ÷ {memberCount} members · Advance ₹{advance}/person
                  </div>
                </div>
              </div>

              <button className="btn-full" onClick={goStep2}>
                Next: Review & Pay →
              </button>
            </>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <>
              <div className="invoice-box">
                <div className="inv-row"><span>Companionship ({duration}h)</span><span>₹{baseCompanion}</span></div>
                <div className="inv-row"><span>GPS Tracking</span><span>₹{gps}</span></div>
                <div className="inv-row"><span>Group Coordination (10%)</span><span>₹{groupSurcharge}</span></div>
                <div className="inv-row"><span>GST (18%)</span><span>₹{gst}</span></div>
                <div className="inv-total"><span>Total</span><span>₹{total}</span></div>
              </div>

              {/* Per-person split */}
              <div style={{ background: '#F5F3FF', border: '1.5px solid #E9D5FF', borderRadius: 10, padding: '14px', marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#5B21B6', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Split size={13} /> Split Bill — ₹{perPerson} per person
                </div>
                {validMembers.map((m, i) => (
                  <div key={m.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 0', borderBottom: i < validMembers.length - 1 ? '1px solid #E9D5FF' : 'none',
                  }}>
                    <div style={{ fontSize: 13, color: '#374151' }}>
                      {m.name || `Member ${i + 1}`}
                      {i === 0 && <span style={{ fontSize: 10, color: '#7C3AED', marginLeft: 6 }}>Organiser</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#1F2937' }}>₹{advance}</span>
                      {i === 0 ? (
                        <span style={{ fontSize: 10, background: '#DCFCE7', color: '#065F46', padding: '2px 7px', borderRadius: 100, fontWeight: 700 }}>
                          Paid ✓
                        </span>
                      ) : (
                        <span style={{ fontSize: 10, background: '#FEF3C7', color: '#92400E', padding: '2px 7px', borderRadius: 100, fontWeight: 700 }}>
                          Link sent
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                background: '#EFF6FF', border: '1.5px solid #BFDBFE',
                borderRadius: 10, padding: '12px 14px', marginBottom: 14,
                fontSize: 12, color: '#1E3A8A',
              }}>
                💬 Each group member will receive a WhatsApp payment link from Just Friends. All must pay before the session is confirmed.
              </div>

              <div className="oath-box">
                <input type="checkbox" id="group-oath" defaultChecked={false} onChange={() => {}} />
                <label htmlFor="group-oath">
                  I confirm all group members are aware of Just Friends' platonic conduct policy and have consented to the session.
                </label>
              </div>

              <button className="btn-full" onClick={goStep3}>
                🔒 Confirm & Send Payment Links
              </button>
            </>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div className="success-wrap">
              <div className="success-icon">🎉</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1F2937', marginBottom: 8 }}>
                Group Session Confirmed!
              </h3>
              <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, marginBottom: 8 }}>
                <strong>{c.name}</strong> has been notified. Payment links have been sent to {validMembers.length - 1} member{validMembers.length > 2 ? 's' : ''} via WhatsApp.
              </p>
              <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 4 }}>📅 {date} · {slot} · {activity}</p>
              <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>📍 {venue}</p>
              <div style={{ background: '#F5F3FF', border: '1.5px solid #E9D5FF', borderRadius: 10, padding: '12px 16px', marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: '#5B21B6', fontWeight: 700, marginBottom: 6 }}>Split Summary</div>
                {validMembers.map((m, i) => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#374151', paddingBottom: 4 }}>
                    <span>{m.name || `Member ${i + 1}`}</span>
                    <span style={{ fontWeight: 700 }}>₹{advance}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 13, background: '#EDE9FE', color: '#5B21B6', padding: '6px 14px', borderRadius: 100, fontWeight: 600, display: 'inline-block', marginBottom: 16 }}>
                Ref: {bookingRef}
              </div>
              <br />
              <button className="btn-primary" onClick={onClose}>Done ✓</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
