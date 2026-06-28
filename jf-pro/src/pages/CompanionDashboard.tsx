import { useState } from 'react';
import {
  TrendingUp, Star, Calendar, BookOpen, Award, Shield,
  ArrowLeft, ChevronRight, Clock, CheckCircle, AlertCircle,
  BarChart2, Bell, Users,
} from 'lucide-react';
import type { CompanionEarning } from '../types';

/* ── Mock Data ─────────────────────────────────────────────── */
const EARNINGS_DATA: CompanionEarning[] = [
  { week: 'Jun 23', sessions: 6, earnings: 3594, cancellations: 0, avgRating: 4.9 },
  { week: 'Jun 16', sessions: 5, earnings: 2995, cancellations: 1, avgRating: 4.8 },
  { week: 'Jun 9',  sessions: 7, earnings: 4193, cancellations: 0, avgRating: 5.0 },
  { week: 'Jun 2',  sessions: 4, earnings: 2396, cancellations: 0, avgRating: 4.7 },
];

const UPCOMING_BOOKINGS = [
  { id: 'b1', userName: 'Priya S.',  activity: 'Lake Walk', date: 'Today', slot: '5:30 PM', duration: 2, amount: 998 },
  { id: 'b2', userName: 'Rahul M.',  activity: 'Café Chat', date: 'Tomorrow', slot: '11:00 AM', duration: 1, amount: 499 },
  { id: 'b3', userName: 'Meera K.',  activity: 'Heritage Walk', date: 'Jun 28', slot: '10:00 AM', duration: 3, amount: 1497 },
];

const TRAINING_COURSES = [
  { id: 'c1', title: 'Active Listening', duration: '45 min', badge: null, completed: true, description: 'Core techniques for deep listening and empathetic responses.' },
  { id: 'c2', title: 'Mental Health First Aid', duration: '4 hrs', badge: '🛡️ MH Badge', completed: false, description: 'Recognize and respond to signs of emotional distress safely.' },
  { id: 'c3', title: 'Conflict De-escalation', duration: '1 hr', badge: null, completed: true, description: 'Handle difficult conversations calmly and professionally.' },
  { id: 'c4', title: 'Cultural Sensitivity – Rajasthan', duration: '30 min', badge: null, completed: false, description: 'Understanding local customs, festivals, and respectful engagement.' },
];

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_BLOCKS = ['10 AM', '12 PM', '2 PM', '4 PM', '6 PM'];

/* ── Level system ────────────────────────────────────────────── */
const LEVELS = [
  { name: 'Basic', minSessions: 0,   color: '#6B7280', bg: '#F3F4F6' },
  { name: 'Premium', minSessions: 50, color: '#5B21B6', bg: '#EDE9FE' },
  { name: 'Elite', minSessions: 200,  color: '#92400E', bg: '#FEF3C7' },
];

function getLevel(sessions: number) {
  return LEVELS.slice().reverse().find(l => sessions >= l.minSessions) ?? LEVELS[0];
}

function LevelBadge({ sessions }: { sessions: number }) {
  const level = getLevel(sessions);
  const next  = LEVELS.find(l => l.minSessions > sessions);
  const progress = next
    ? ((sessions - getLevel(sessions).minSessions) / (next.minSessions - getLevel(sessions).minSessions)) * 100
    : 100;

  return (
    <div className="card" style={{ padding: 18, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Your Level</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              background: level.bg, color: level.color,
              padding: '4px 12px', borderRadius: 100, fontSize: 13, fontWeight: 800,
            }}>
              {level.name}
            </span>
            <Award size={18} color={level.color} />
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#1F2937' }}>{sessions}</div>
          <div style={{ fontSize: 11, color: '#6B7280' }}>Total sessions</div>
        </div>
      </div>

      {/* Progress bar */}
      {next && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9CA3AF', marginBottom: 6 }}>
            <span>{level.name}</span>
            <span>{next.minSessions - sessions} more sessions to {next.name}</span>
          </div>
          <div style={{ background: '#F3F4F6', borderRadius: 100, height: 8, overflow: 'hidden' }}>
            <div style={{
              width: `${progress}%`, height: '100%', borderRadius: 100,
              background: `linear-gradient(90deg, ${level.color}, ${next.color})`,
              transition: 'width 0.5s',
            }} />
          </div>
        </div>
      )}

      {/* Perks */}
      <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
        {['Higher visibility', 'Priority booking', 'Unlock premium rates'].slice(0, level.name === 'Basic' ? 0 : level.name === 'Premium' ? 2 : 3).map(p => (
          <span key={p} style={{
            fontSize: 10, background: level.bg, color: level.color,
            padding: '2px 8px', borderRadius: 100, fontWeight: 600,
          }}>{p}</span>
        ))}
        {level.name === 'Basic' && (
          <span style={{ fontSize: 11, color: '#6B7280' }}>Reach 50 sessions to unlock Premium perks</span>
        )}
      </div>
    </div>
  );
}

function EarningsTab() {
  const totalEarnings = EARNINGS_DATA.reduce((s, w) => s + w.earnings, 0);
  const totalSessions = EARNINGS_DATA.reduce((s, w) => s + w.sessions, 0);
  const maxEarning = Math.max(...EARNINGS_DATA.map(w => w.earnings));

  return (
    <div>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'This Month', value: `₹${totalEarnings.toLocaleString()}`, icon: <TrendingUp size={14} color="#7C3AED" />, color: '#7C3AED' },
          { label: 'Sessions Done', value: totalSessions, icon: <Users size={14} color="#059669" />, color: '#059669' },
          { label: 'Avg Rating', value: '4.85 ★', icon: <Star size={14} color="#F59E0B" />, color: '#F59E0B' },
          { label: 'Cancellations', value: '1', icon: <AlertCircle size={14} color="#EF4444" />, color: '#EF4444' },
        ].map(s => (
          <div key={s.label} className="card-soft" style={{ padding: '14px 16px', borderRadius: 12 }}>
            <div style={{ marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#6B7280' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="card" style={{ padding: 18, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <BarChart2 size={14} color="#7C3AED" />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Weekly Earnings</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 80 }}>
          {EARNINGS_DATA.map(w => (
            <div key={w.week} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ fontSize: 10, color: '#7C3AED', fontWeight: 700 }}>₹{(w.earnings / 1000).toFixed(1)}k</div>
              <div style={{
                width: '100%', borderRadius: '6px 6px 0 0',
                height: `${(w.earnings / maxEarning) * 56}px`,
                background: 'linear-gradient(180deg, #7C3AED, #C4B5FD)',
                transition: 'height 0.3s',
              }} />
              <div style={{ fontSize: 10, color: '#9CA3AF' }}>{w.week}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Payout info */}
      <div style={{
        background: '#F0FDF4', border: '1.5px solid #86EFAC',
        borderRadius: 12, padding: '12px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#065F46' }}>Next Payout</div>
          <div style={{ fontSize: 12, color: '#059669' }}>₹{totalEarnings.toLocaleString()} · Every Monday</div>
        </div>
        <CheckCircle size={20} color="#22C55E" />
      </div>
    </div>
  );
}

function BookingsTab() {
  return (
    <div>
      {UPCOMING_BOOKINGS.map(b => (
        <div key={b.id} className="card" style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1F2937' }}>{b.userName}</div>
              <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{b.activity}</div>
            </div>
            <span style={{
              fontSize: 13, fontWeight: 800, color: '#7C3AED',
              background: '#F5F3FF', padding: '4px 10px', borderRadius: 100,
            }}>
              ₹{b.amount}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#6B7280' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={11} /> {b.date}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={11} /> {b.slot} · {b.duration}h
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn-primary" style={{ flex: 1, padding: '8px 0', fontSize: 13 }}>Confirm</button>
            <button style={{
              flex: 1, padding: '8px 0', fontSize: 13, borderRadius: 100,
              background: '#FEE2E2', color: '#EF4444', border: 'none', cursor: 'pointer', fontWeight: 600,
            }}>Decline</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function CalendarTab() {
  const [slots, setSlots] = useState<Record<string, boolean>>({
    'Mon-10 AM': true, 'Mon-2 PM': true, 'Wed-4 PM': true,
    'Fri-10 AM': true, 'Sat-5 PM (Sunset)': true, 'Sun-10 AM': true,
  });

  function toggle(key: string) {
    setSlots(s => ({ ...s, [key]: !s[key] }));
  }

  return (
    <div>
      <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>
        Set your open slots. Users can only book into pre-declared windows — no last-minute surprises.
      </div>
      <div style={{
        overflowX: 'auto', marginBottom: 16,
      }}>
        <table style={{ borderCollapse: 'collapse', minWidth: 500, width: '100%' }}>
          <thead>
            <tr>
              <td style={{ width: 60 }} />
              {WEEK_DAYS.map(d => (
                <td key={d} style={{ textAlign: 'center', padding: '6px 4px', fontSize: 11, fontWeight: 700, color: '#6B7280' }}>{d}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_BLOCKS.map(t => (
              <tr key={t}>
                <td style={{ fontSize: 10, color: '#9CA3AF', paddingRight: 8, whiteSpace: 'nowrap' }}>{t}</td>
                {WEEK_DAYS.map(d => {
                  const key = `${d}-${t}`;
                  const on = slots[key] ?? false;
                  return (
                    <td key={d} style={{ padding: '3px 3px', textAlign: 'center' }}>
                      <button
                        onClick={() => toggle(key)}
                        style={{
                          width: '100%', minWidth: 28, height: 28, borderRadius: 6,
                          background: on ? '#7C3AED' : '#F5F3FF',
                          border: `1.5px solid ${on ? '#7C3AED' : '#E9D5FF'}`,
                          cursor: 'pointer', transition: 'all 0.15s',
                        }}
                        title={key}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sunset slot note */}
      <div style={{
        background: '#FFF7ED', border: '1.5px solid #FCD34D',
        borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#92400E',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Bell size={13} />
        <span><strong>Sunset Slot (5:30–7 PM):</strong> Udaipur's premium window. Enable it to charge 20% more automatically.</span>
      </div>

      <button className="btn-primary" style={{ width: '100%', marginTop: 16, padding: '12px 0' }}>
        Save Availability
      </button>
    </div>
  );
}

function TrainingTab() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const completed = TRAINING_COURSES.filter(c => c.completed).length;

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: '#F5F3FF', borderRadius: 12, padding: '12px 16px', marginBottom: 16,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#5B21B6', marginBottom: 4 }}>
            {completed} of {TRAINING_COURSES.length} courses completed
          </div>
          <div style={{ background: '#E9D5FF', borderRadius: 100, height: 6 }}>
            <div style={{
              width: `${(completed / TRAINING_COURSES.length) * 100}%`,
              height: '100%', borderRadius: 100, background: '#7C3AED',
            }} />
          </div>
        </div>
        <BookOpen size={20} color="#7C3AED" />
      </div>

      {TRAINING_COURSES.map(course => (
        <div key={course.id} className="card" style={{ padding: 14, marginBottom: 10 }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
            onClick={() => setExpandedId(expandedId === course.id ? null : course.id)}
          >
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: course.completed ? '#DCFCE7' : '#F5F3FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {course.completed
                ? <CheckCircle size={18} color="#22C55E" />
                : <BookOpen size={18} color="#7C3AED" />
              }
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#1F2937' }}>{course.title}</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 11, color: '#6B7280', marginTop: 2 }}>
                <Clock size={10} /> {course.duration}
                {course.badge && (
                  <span style={{
                    background: '#EDE9FE', color: '#5B21B6',
                    padding: '1px 7px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                  }}>{course.badge}</span>
                )}
              </div>
            </div>
            <ChevronRight
              size={16}
              color="#9CA3AF"
              style={{ transform: expandedId === course.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}
            />
          </div>

          {expandedId === course.id && (
            <div style={{
              marginTop: 12, paddingTop: 12, borderTop: '1px solid #F3F4F6',
              fontSize: 13, color: '#374151', lineHeight: 1.5,
            }}>
              <p style={{ margin: '0 0 12px' }}>{course.description}</p>
              {course.completed ? (
                <span style={{
                  background: '#DCFCE7', color: '#065F46', fontSize: 12,
                  padding: '4px 12px', borderRadius: 100, fontWeight: 700,
                }}>
                  ✓ Completed
                </span>
              ) : (
                <button className="btn-primary" style={{ padding: '8px 18px', fontSize: 12 }}>
                  Start Course →
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────── */
type Tab = 'earnings' | 'bookings' | 'calendar' | 'training' | 'level';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'earnings',  label: 'Earnings',  icon: <TrendingUp size={13} /> },
  { id: 'bookings',  label: 'Bookings',  icon: <Calendar size={13} /> },
  { id: 'calendar',  label: 'My Slots',  icon: <Clock size={13} /> },
  { id: 'training',  label: 'Training',  icon: <BookOpen size={13} /> },
  { id: 'level',     label: 'My Level',  icon: <Award size={13} /> },
];

interface Props {
  onBack: () => void;
}

export default function CompanionDashboard({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('earnings');

  const companionName = 'Arjun Mehta'; // In production: from auth context
  const totalSessions = 312;

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
      <div style={{
        background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
        borderRadius: 16, padding: 22, marginBottom: 20, color: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: '#7C3AED', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 800, color: '#fff',
          }}>
            {companionName[0]}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{companionName}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <span style={{
                background: '#FEF3C7', color: '#92400E',
                fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 100,
              }}>Elite</span>
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>· Udaipur</span>
              <Shield size={12} color="#22C55E" />
              <span style={{ fontSize: 11, color: '#22C55E' }}>Verified</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { label: 'Total Sessions', value: totalSessions },
            { label: 'Avg Rating', value: '5.0 ★' },
            { label: 'Completion Rate', value: '99%' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#9CA3AF' }}>{s.label}</div>
            </div>
          ))}
        </div>
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
              background: activeTab === t.id ? '#1F2937' : '#F5F3FF',
              color: activeTab === t.id ? '#fff' : '#6B7280',
              border: `1.5px solid ${activeTab === t.id ? '#1F2937' : '#E9D5FF'}`,
              transition: 'all 0.15s',
            }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'earnings'  && <EarningsTab />}
      {activeTab === 'bookings'  && <BookingsTab />}
      {activeTab === 'calendar'  && <CalendarTab />}
      {activeTab === 'training'  && <TrainingTab />}
      {activeTab === 'level'     && <LevelBadge sessions={totalSessions} />}
    </div>
  );
}
