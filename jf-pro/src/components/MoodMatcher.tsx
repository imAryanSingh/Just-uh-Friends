import { useState } from 'react';
import {
  Zap, Clock, Heart, Wind, Map, MessageCircle, Smile,
  Sparkles, Filter, ChevronRight, Star
} from 'lucide-react';
import type { Companion, Mood } from '../types';

interface MoodConfig {
  mood: Mood;
  label: string;
  emoji: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  description: string;
  suggestedTags: string[];
}

const MOODS: MoodConfig[] = [
  {
    mood: 'lonely',
    label: 'Lonely',
    emoji: '🌙',
    icon: <Heart size={20} />,
    color: '#7C3AED',
    bg: '#F5F3FF',
    border: '#C4B5FD',
    description: 'Need warm company',
    suggestedTags: ['Listener', 'Mental Health', 'Peer Support'],
  },
  {
    mood: 'anxious',
    label: 'Anxious',
    emoji: '🌊',
    icon: <Wind size={20} />,
    color: '#0369A1',
    bg: '#E0F2FE',
    border: '#7DD3FC',
    description: 'Feeling overwhelmed',
    suggestedTags: ['Yoga', 'Life Coach', 'Burnout', 'Mental Health'],
  },
  {
    mood: 'bored',
    label: 'Bored',
    emoji: '⚡',
    icon: <Zap size={20} />,
    color: '#B45309',
    bg: '#FEF3C7',
    border: '#FCD34D',
    description: 'Need some fun',
    suggestedTags: ['Foodie', 'City Tour', 'Gaming', 'Casual'],
  },
  {
    mood: 'need-to-vent',
    label: 'Need to vent',
    emoji: '💬',
    icon: <MessageCircle size={20} />,
    color: '#BE185D',
    bg: '#FCE7F3',
    border: '#F9A8D4',
    description: 'Just want to talk',
    suggestedTags: ['Listener', 'Peer Support', 'Mental Health'],
  },
  {
    mood: 'want-to-explore',
    label: 'Explore city',
    emoji: '🗺️',
    icon: <Map size={20} />,
    color: '#065F46',
    bg: '#DCFCE7',
    border: '#86EFAC',
    description: 'Adventure awaits',
    suggestedTags: ['City Tour', 'Heritage Walk', 'City Guide', 'Foodie'],
  },
  {
    mood: 'stressed',
    label: 'Stressed',
    emoji: '🔥',
    icon: <Filter size={20} />,
    color: '#B91C1C',
    bg: '#FEE2E2',
    border: '#FCA5A5',
    description: 'Work / life pressure',
    suggestedTags: ['Burnout', 'Life Coach', 'Walking Companion', 'Yoga'],
  },
  {
    mood: 'celebratory',
    label: 'Celebrate!',
    emoji: '🎉',
    icon: <Smile size={20} />,
    color: '#6D28D9',
    bg: '#EDE9FE',
    border: '#A78BFA',
    description: 'Good news to share',
    suggestedTags: ['Casual', 'Foodie', 'Community', 'Networking'],
  },
];

interface Props {
  companions: Companion[];
  onBook: (c: Companion) => void;
  onViewProfile: (c: Companion) => void;
}

function scoreCompanion(c: Companion, mood: MoodConfig, availableNow: boolean): number {
  let score = 0;
  if (availableNow && !c.available) return -1;

  // Tag match
  const matchedTags = c.tags.filter(t =>
    mood.suggestedTags.some(s => t.toLowerCase().includes(s.toLowerCase()))
  );
  score += matchedTags.length * 30;

  // Mood tags
  if (c.moodTags?.includes(mood.mood)) score += 40;

  // Tier bonus for serious moods
  if (['anxious', 'stressed', 'need-to-vent'].includes(mood.mood)) {
    if (c.tier === 'Elite') score += 20;
    if (c.tier === 'Premium') score += 10;
    if (c.mentalHealthBadge) score += 25;
  }

  score += c.rating * 5;
  if (c.available) score += 15;
  return score;
}

export default function MoodMatcher({ companions, onBook, onViewProfile }: Props) {
  const [selectedMood, setSelectedMood] = useState<MoodConfig | null>(null);
  const [availableNow, setAvailableNow] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const moodConfig = selectedMood ?? MOODS[0];

  const matches = companions
    .map(c => ({ c, score: scoreCompanion(c, moodConfig, availableNow) }))
    .filter(x => x.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(x => x.c);

  function handleFindMatch() {
    if (!selectedMood) return;
    setShowResults(true);
  }

  function reset() {
    setSelectedMood(null);
    setShowResults(false);
    setAvailableNow(false);
  }

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
        borderRadius: 16,
        padding: '20px 24px',
        marginBottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Sparkles size={18} color="#E9D5FF" />
            <span style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Mood Matcher</span>
            <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.2)', color: '#E9D5FF', padding: '2px 8px', borderRadius: 100, fontWeight: 700 }}>AI</span>
          </div>
          <p style={{ color: '#C4B5FD', fontSize: 13, margin: 0 }}>
            How are you feeling right now? We'll find the perfect companion.
          </p>
        </div>

        {/* Available Now Toggle */}
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
          <Clock size={14} color="#E9D5FF" />
          <span style={{ color: '#E9D5FF', fontSize: 13, fontWeight: 600 }}>Available now</span>
          <div
            onClick={() => setAvailableNow(v => !v)}
            style={{
              width: 40, height: 22, borderRadius: 100,
              background: availableNow ? '#A78BFA' : 'rgba(255,255,255,0.2)',
              position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
              flexShrink: 0,
            }}
          >
            <div style={{
              position: 'absolute', top: 3, left: availableNow ? 21 : 3,
              width: 16, height: 16, borderRadius: '50%', background: '#fff',
              transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }} />
          </div>
        </label>
      </div>

      {/* Mood grid */}
      <div style={{
        background: '#F5F3FF',
        border: '1.5px solid #E9D5FF',
        borderTop: 'none',
        borderRadius: '0 0 16px 16px',
        padding: '20px 24px',
      }}>
        {!showResults ? (
          <>
            <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 14 }}>Select your current mood:</p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: 10,
              marginBottom: 18,
            }}>
              {MOODS.map(m => (
                <button
                  key={m.mood}
                  onClick={() => setSelectedMood(m)}
                  style={{
                    background: selectedMood?.mood === m.mood ? m.bg : '#fff',
                    border: `1.5px solid ${selectedMood?.mood === m.mood ? m.border : '#E9D5FF'}`,
                    borderRadius: 12,
                    padding: '12px 10px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.15s',
                    transform: selectedMood?.mood === m.mood ? 'scale(1.03)' : 'scale(1)',
                    boxShadow: selectedMood?.mood === m.mood ? `0 4px 12px ${m.border}80` : 'none',
                  }}
                >
                  <span style={{ fontSize: 22 }}>{m.emoji}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: selectedMood?.mood === m.mood ? m.color : '#374151' }}>{m.label}</span>
                  <span style={{ fontSize: 10, color: '#9CA3AF', textAlign: 'center' }}>{m.description}</span>
                </button>
              ))}
            </div>

            <button
              className="btn-primary"
              onClick={handleFindMatch}
              disabled={!selectedMood}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 0' }}
            >
              <Sparkles size={15} />
              Find My Match
              <ChevronRight size={15} />
            </button>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: 13, color: '#6B7280' }}>
                  Best matches for{' '}
                  <span style={{
                    background: moodConfig.bg,
                    color: moodConfig.color,
                    padding: '2px 10px',
                    borderRadius: 100,
                    fontWeight: 700,
                    fontSize: 12,
                  }}>
                    {moodConfig.emoji} {moodConfig.label}
                  </span>
                  {availableNow && (
                    <span style={{ marginLeft: 6, fontSize: 11, color: '#059669', fontWeight: 600 }}>
                      · Available now
                    </span>
                  )}
                </span>
              </div>
              <button
                onClick={reset}
                style={{ fontSize: 12, color: '#7C3AED', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Change mood
              </button>
            </div>

            {matches.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: '#6B7280', fontSize: 14 }}>
                No companions available right now. Try turning off "Available now".
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {matches.map((c, i) => (
                  <div
                    key={c.id}
                    className="card"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                      background: i === 0 ? '#FFF7ED' : '#fff',
                      borderColor: i === 0 ? '#FCD34D' : '#E9D5FF',
                    }}
                  >
                    {i === 0 && (
                      <span style={{
                        position: 'absolute', top: -8, left: 12,
                        background: '#F59E0B', color: '#fff', fontSize: 10,
                        fontWeight: 800, padding: '2px 8px', borderRadius: 100,
                      }}>BEST MATCH</span>
                    )}
                    <img
                      src={c.photo}
                      alt={c.name}
                      style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: '#1F2937' }}>{c.name}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 12, color: '#F59E0B', fontWeight: 700 }}>
                          <Star size={11} fill="#F59E0B" /> {c.rating}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {c.tags.slice(0, 2).map(t => (
                          <span key={t} style={{
                            fontSize: 10, background: moodConfig.bg, color: moodConfig.color,
                            padding: '1px 6px', borderRadius: 100, fontWeight: 600,
                          }}>{t}</span>
                        ))}
                        <span style={{ fontSize: 10, color: '#6B7280' }}>· {c.city}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                      <button
                        className="btn-primary"
                        onClick={() => onBook(c)}
                        style={{ padding: '6px 14px', fontSize: 12 }}
                      >
                        Book
                      </button>
                      <button
                        onClick={() => onViewProfile(c)}
                        style={{
                          fontSize: 12, color: '#7C3AED', fontWeight: 600,
                          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center',
                        }}
                      >
                        Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
