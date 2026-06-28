import { useState } from 'react';
import { Star, Sparkles, ThumbsUp, ThumbsDown, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import type { Companion } from '../types';

/* ─── Static AI-generated summaries per companion id ──────────
   In production these would be generated server-side by calling
   the Anthropic API over all accumulated reviews.               */
const AI_SUMMARIES: Record<string, {
  headline: string;
  positives: string[];
  watchouts: string[];
  bestFor: string[];
  sentiment: number; // 0–100
}> = {
  r1: {
    headline: 'Users consistently describe Arjun as a calm, judgment-free presence who makes difficult conversations feel natural.',
    positives: ['Exceptional at active listening', 'Always punctual and well-prepared', 'Walks near Ambrai Ghat praised as "therapeutic"'],
    watchouts: ['Sessions occasionally run slightly over scheduled time'],
    bestFor: ['Processing work stress', 'First-time platform users', 'Outdoor walk sessions'],
    sentiment: 96,
  },
  r2: {
    headline: 'Rohan shines as a city explorer — reviews highlight his deep local knowledge and relaxed, easy-going energy.',
    positives: ['Best-in-class local food recommendations', 'Very easy to talk to', 'Excellent at finding hidden city gems'],
    watchouts: ['Less suited for deeper emotional support sessions'],
    bestFor: ['City exploration', 'Food tours', 'Casual company'],
    sentiment: 88,
  },
  r3: {
    headline: 'Vikram is the platform\'s highest-rated companion for burnout and career anxiety, praised for his structured yet warm approach.',
    positives: ['Certified coaching methodology', 'Yoga sessions highly calming', 'Remarkable consistency across 500+ sessions'],
    watchouts: ['Advance booking essential — typically booked 1–2 weeks out'],
    bestFor: ['Burnout recovery', 'Career anxiety', 'Serious wellbeing goals'],
    sentiment: 99,
  },
  k1: {
    headline: 'Karthik brings genuine enthusiasm to everyday outings — reviews call him "the friend you wish you had in the city".',
    positives: ['Makes mundane errands enjoyable', 'Great fashion sense and shopping advice', 'Always on time'],
    watchouts: ['Prefers in-person over virtual sessions'],
    bestFor: ['Shopping trips', 'Movie outings', 'Casual social confidence'],
    sentiment: 91,
  },
  k2: {
    headline: 'Aditya is the go-to companion for Jodhpur experiences — reviewers call his heritage knowledge "encyclopaedic".',
    positives: ['Exceptional heritage walk guides', 'Polished and presentable for dining events', 'Proactive in suggesting unique spots'],
    watchouts: ['Tends to book up on weekends — plan ahead'],
    bestFor: ['Out-of-city visitors', 'Dinner events', 'Weekend heritage exploration'],
    sentiment: 94,
  },
  k3: {
    headline: 'Pranav excels at social event companionship — users specifically choose him for weddings and corporate gatherings.',
    positives: ['Effortlessly socially adept', 'Never oversteps boundaries', 'Handles awkward situations with grace'],
    watchouts: ['Premium price point — worth it for events, less so for casual meetups'],
    bestFor: ['Wedding season', 'Corporate events', 'Social anxiety situations'],
    sentiment: 95,
  },
  ku1: {
    headline: 'Dev is Udaipur\'s top-rated newcomer guide — reviews credit him with dramatically shortening the city-adjustment curve.',
    positives: ['Knows every neighbourhood intimately', 'Practical help beyond companionship (housing, transit)', 'Patient and unhurried'],
    watchouts: ['Primarily focused on city logistics — not the best for emotional support'],
    bestFor: ['New residents', 'City orientation', 'Coffee shop discovery'],
    sentiment: 90,
  },
  ku2: {
    headline: 'Siddharth connects on a peer level that users describe as "rare" — particularly valued by professionals navigating relocation stress.',
    positives: ['Authentic peer-to-peer energy', 'Career conversations are grounded and honest', 'Sunset walks at Dudh Talai consistently praised'],
    watchouts: ['Schedule fills quickly; advance notice recommended'],
    bestFor: ['Professional relocators', 'Career check-ins', 'Stress-relief walks'],
    sentiment: 93,
  },
  ku3: {
    headline: 'Harsh has transformed social lives in Jodhpur — reviews document real, lasting connections made through his introductions.',
    positives: ['Unmatched community network', 'Makes group introductions feel effortless', 'High energy without being overwhelming'],
    watchouts: ['Best in group or networking contexts — one-on-one is slightly less his forte'],
    bestFor: ['Newcomers wanting social integration', 'Networking events', 'Young professional community'],
    sentiment: 98,
  },
};

function SentimentBar({ score }: { score: number }) {
  const color = score >= 90 ? '#22C55E' : score >= 75 ? '#F59E0B' : '#EF4444';
  const label = score >= 90 ? 'Excellent' : score >= 75 ? 'Good' : 'Mixed';
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.5px' }}>
          Sentiment Score
        </span>
        <span style={{ fontSize: 12, fontWeight: 800, color }}>
          {score}/100 · {label}
        </span>
      </div>
      <div style={{ height: 8, background: '#F3F4F6', borderRadius: 100, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${score}%`,
            borderRadius: 100,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            transition: 'width 0.6s ease',
          }}
        />
      </div>
    </div>
  );
}

interface Props {
  companion: Companion;
  compact?: boolean; // show collapsed by default in card view
}

export default function CompanionReviewSummary({ companion: c, compact = false }: Props) {
  const [expanded, setExpanded] = useState(!compact);
  const summary = AI_SUMMARIES[c.id];

  /* Fallback for companions without a pre-built summary */
  if (!summary) {
    const avgStars = c.reviews.length
      ? c.reviews.reduce((s, r) => s + r.stars, 0) / c.reviews.length
      : c.rating;
    return (
      <div style={{
        background: '#F5F3FF', border: '1.5px solid #E9D5FF',
        borderRadius: 12, padding: '12px 14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <Sparkles size={13} color="#7C3AED" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#5B21B6' }}>AI Review Summary</span>
        </div>
        <p style={{ fontSize: 12, color: '#374151', margin: 0 }}>
          Based on {c.sessions} sessions, users rate {c.name.split(' ')[0]} an average of {avgStars.toFixed(1)} stars.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: '#FAFAF9',
      border: '1.5px solid #E9D5FF',
      borderRadius: 14,
      overflow: 'hidden',
      marginBottom: 14,
    }}>
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '12px 14px',
          background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)',
          border: 'none', cursor: 'pointer', borderBottom: expanded ? '1.5px solid #E9D5FF' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={13} color="#fff" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#5B21B6' }}>AI Review Analysis</div>
            <div style={{ fontSize: 10, color: '#9CA3AF' }}>Based on {c.sessions} sessions</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 1 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={11} fill={i < Math.round(c.rating) ? '#F59E0B' : 'none'} color={i < Math.round(c.rating) ? '#F59E0B' : '#D1D5DB'} />
            ))}
          </div>
          {expanded ? <ChevronUp size={14} color="#9CA3AF" /> : <ChevronDown size={14} color="#9CA3AF" />}
        </div>
      </button>

      {/* Body */}
      {expanded && (
        <div style={{ padding: '14px 14px' }}>
          {/* Sentiment bar */}
          <SentimentBar score={summary.sentiment} />

          {/* AI headline */}
          <div style={{
            background: '#fff', border: '1px solid #E9D5FF',
            borderRadius: 10, padding: '10px 12px', marginBottom: 12,
            fontSize: 13, color: '#374151', lineHeight: 1.6, fontStyle: 'italic',
          }}>
            "{summary.headline}"
          </div>

          {/* Positives */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
              <ThumbsUp size={12} color="#22C55E" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#065F46', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                Users consistently praise
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {summary.positives.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 12, color: '#374151' }}>
                  <span style={{ color: '#22C55E', fontSize: 14, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>✓</span>
                  {p}
                </div>
              ))}
            </div>
          </div>

          {/* Watch-outs */}
          {summary.watchouts.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                <ThumbsDown size={12} color="#D97706" />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                  Worth knowing
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {summary.watchouts.map((w, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 12, color: '#374151' }}>
                    <span style={{ color: '#D97706', fontSize: 14, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>◦</span>
                    {w}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Best for */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
              <TrendingUp size={12} color="#7C3AED" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#5B21B6', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                Best for
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {summary.bestFor.map(b => (
                <span key={b} style={{
                  fontSize: 11, background: '#EDE9FE', color: '#5B21B6',
                  padding: '3px 10px', borderRadius: 100, fontWeight: 600,
                }}>
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
