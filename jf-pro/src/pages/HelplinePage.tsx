import { ArrowLeft, Brain, ShieldCheck, Phone } from 'lucide-react';
import { useState } from 'react';

interface Props { onBack: () => void; }

const TOPICS = [
  'How do I deal with imposter syndrome and extreme work isolation in Udaipur?',
  'My Indian family stigmatises seeing a therapist. What can I do?',
  'I feel overwhelming urban loneliness and find it hard to maintain stable friendships.',
  'I feel completely burned out and unmotivated. How do I balance my mental wellness?',
];

export default function HelplinePage({ onBack }: Props) {
  const [query, setQuery] = useState('');

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '28px 24px' }}>
      <button
        onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 13, cursor: 'pointer', background: 'none', border: 'none', marginBottom: 14, fontFamily: 'inherit' }}
      >
        <ArrowLeft size={14} /> Back
      </button>

      {/* Hero banner */}
      <div style={{ background: '#7C3AED', borderRadius: 14, padding: 28, color: '#fff', textAlign: 'center', marginBottom: 20 }}>
        <Brain size={30} style={{ display: 'block', margin: '0 auto 10px' }} />
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Psychiatric Helpline</h2>
        <p style={{ fontSize: 13, opacity: .85 }}>
          Combating Urban Loneliness &amp; Stigma · RABF Pioneering Pillar · Certified Medical Support
        </p>
      </div>

      {/* Ethics cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
        <div className="card-soft" style={{ padding: 13 }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1F2937', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
            <ShieldCheck size={13} color="#7C3AED" /> Stigma-free listening
          </h4>
          <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5 }}>
            Every dialogue is 100% confidential. Clinical anxiety is rising — we're here before struggles escalate.
          </p>
        </div>
        <div className="card-soft" style={{ padding: 13 }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1F2937', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Phone size={13} color="#7C3AED" /> Direct support access
          </h4>
          <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5 }}>
            Bridges you to certified medical therapists and psychiatrists for immediate triage.
          </p>
        </div>
      </div>

      {/* Counselor card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 18, marginBottom: 16 }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#fff', flexShrink: 0 }}>
          DM
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#5B21B6', fontWeight: 600, marginBottom: 2 }}>Certified Psychiatrist Advisor · RABF Desk</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1F2937' }}>Dr. Aarav Mehta</div>
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
            Toll Free: <strong>1800-RABF-HELP</strong> · Consult regarding stress, anxiety, or social stigmas.
          </div>
        </div>
      </div>

      {/* Consult input */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          className="jf-input"
          style={{ flex: 1 }}
          placeholder="e.g. How can I manage corporate isolation and build real connections?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn-primary" onClick={() => query.trim() && alert(`Dr. Aarav Mehta will respond to: "${query}"`)}>
          Consult →
        </button>
      </div>

      {/* Topics */}
      <div style={{ fontSize: 11, fontWeight: 700, color: '#5B21B6', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.5px' }}>
        Suggested Topics
      </div>
      {TOPICS.map((t) => (
        <div key={t} className="topic-row" onClick={() => setQuery(t)}>
          <span>{t}</span>
          <ArrowLeft size={13} style={{ transform: 'rotate(180deg)', flexShrink: 0 }} />
        </div>
      ))}

      {/* Simulated hotline note */}
      <div style={{ background: '#1F2937', borderRadius: 8, padding: 14, marginTop: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>
          Simulated Hotline Voice Desk
        </div>
        <p style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.5 }}>
          In real-life operations, the 24/7 Helpline Desk is toll-free, providing immediate triage and psychiatric consultations for people in distress.
        </p>
        <div style={{ background: '#111827', borderRadius: 6, padding: '8px 12px', marginTop: 10, fontSize: 13, fontWeight: 700, color: '#A78BFA', fontFamily: 'monospace' }}>
          Toll Free Desk: 1800-RABF-HELP
        </div>
      </div>
    </div>
  );
}
