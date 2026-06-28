import { useState, useRef, useEffect } from 'react';
import {
  MessageCircle, Send, AlertTriangle, Phone, X,
  Shield, ChevronDown, ChevronUp, Bot,
} from 'lucide-react';

/* ── Crisis keyword detection ─────────────────────────────── */
const CRISIS_KEYWORDS = [
  'want to die', 'kill myself', 'end my life', 'suicide', 'suicidal',
  'self harm', 'self-harm', 'hurt myself', 'cutting myself', 'no reason to live',
  'can\'t go on', 'want to disappear', 'not worth living', 'worthless', 'hopeless',
  'give up on life', 'overdose', 'harm myself',
];

const CONCERN_KEYWORDS = [
  'depressed', 'depression', 'very sad', 'extremely lonely', 'nobody cares',
  'feel empty', 'can\'t cope', 'breaking down', 'mental breakdown',
  'panic attack', 'anxiety attack', 'can\'t breathe', 'falling apart',
];

const INAPPROPRIATE_KEYWORDS = [
  'romance', 'romantic', 'sexual', 'sex', 'intimate', 'kiss', 'physical',
  'date me', 'girlfriend', 'boyfriend', 'relationship',
];

type MessageLevel = 'normal' | 'concern' | 'crisis' | 'flagged';

interface Message {
  id: string;
  role: 'user' | 'system';
  text: string;
  level: MessageLevel;
  timestamp: Date;
}

function detectLevel(text: string): MessageLevel {
  const lower = text.toLowerCase();
  if (CRISIS_KEYWORDS.some(k => lower.includes(k))) return 'crisis';
  if (INAPPROPRIATE_KEYWORDS.some(k => lower.includes(k))) return 'flagged';
  if (CONCERN_KEYWORDS.some(k => lower.includes(k))) return 'concern';
  return 'normal';
}

const HELPLINES = [
  { name: 'iCall (TISS)', number: '9152987821', available: 'Mon–Sat 8AM–10PM' },
  { name: 'Vandrevala Foundation', number: '1860-2662-345', available: '24/7' },
  { name: 'AASRA', number: '9820466627', available: '24/7' },
  { name: 'National Emergency', number: '112', available: '24/7' },
];

function CrisisAlert({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div style={{
      background: '#FEF2F2', border: '2px solid #FCA5A5',
      borderRadius: 12, padding: 16, marginBottom: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
        <AlertTriangle size={20} color="#EF4444" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 800, fontSize: 14, color: '#991B1B', marginBottom: 4 }}>
            We noticed you may be going through something serious.
          </div>
          <p style={{ fontSize: 13, color: '#7F1D1D', lineHeight: 1.5, margin: 0 }}>
            Your session has been paused. You're not alone — please reach out to a helpline right now. They're free and confidential.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {HELPLINES.map(h => (
          <a
            key={h.number}
            href={`tel:${h.number.replace(/-/g, '')}`}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: '#fff', border: '1.5px solid #FCA5A5',
              borderRadius: 10, padding: '10px 12px', textDecoration: 'none',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#1F2937' }}>{h.name}</div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>{h.available}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#EF4444' }}>{h.number}</span>
              <div style={{
                background: '#EF4444', borderRadius: '50%', width: 28, height: 28,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Phone size={12} color="#fff" />
              </div>
            </div>
          </a>
        ))}
      </div>

      <button
        onClick={onDismiss}
        style={{
          width: '100%', padding: '10px 0', borderRadius: 10, fontSize: 13,
          fontWeight: 600, background: '#F3F4F6', color: '#374151',
          border: 'none', cursor: 'pointer',
        }}
      >
        I'm safe, continue
      </button>
    </div>
  );
}

function ConcernBanner() {
  return (
    <div style={{
      background: '#FEF3C7', border: '1.5px solid #FCD34D',
      borderRadius: 10, padding: '10px 14px', marginBottom: 10,
      display: 'flex', alignItems: 'flex-start', gap: 8,
    }}>
      <AlertTriangle size={14} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ fontSize: 12, color: '#92400E', lineHeight: 1.5 }}>
        <strong>We're here for you.</strong> If things feel heavy, consider speaking to a companion with the 🛡️ Mental Health badge — or call iCall: 9152987821. It's free.
      </div>
    </div>
  );
}

function FlaggedWarning({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div style={{
      background: '#FEF3C7', border: '1.5px solid #FCD34D',
      borderRadius: 10, padding: '12px 14px', marginBottom: 10,
    }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <Shield size={14} color="#D97706" style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 12, color: '#92400E', lineHeight: 1.5 }}>
          <strong>Just Friends is a platonic platform.</strong> Requests for romantic or physical interactions aren't permitted and may result in your booking being cancelled.
        </div>
      </div>
      <button
        onClick={onDismiss}
        style={{
          fontSize: 11, background: 'none', border: 'none',
          color: '#D97706', cursor: 'pointer', fontWeight: 600,
          textDecoration: 'underline', padding: 0,
        }}
      >
        I understand — continue
      </button>
    </div>
  );
}

interface Props {
  companionName?: string;
  onCrisisDetected?: () => void;
  onFlaggedDetected?: () => void;
}

export default function CrisisEscalation({
  companionName = 'Your Companion',
  onCrisisDetected,
  onFlaggedDetected,
}: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm0',
      role: 'system',
      text: `Hi! This is your pre-session message thread with ${companionName}. You can share what's on your mind before your session. Our AI monitors all messages for your safety.`,
      level: 'normal',
      timestamp: new Date(),
    },
  ]);
  const [crisisActive, setCrisisActive] = useState(false);
  const [concernActive, setConcernActive] = useState(false);
  const [flaggedActive, setFlaggedActive] = useState(false);
  const [sessionPaused, setSessionPaused] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  function sendMessage() {
    if (!input.trim() || sessionPaused) return;

    const level = detectLevel(input);
    const newMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input.trim(),
      level,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Handle detected level
    if (level === 'crisis') {
      setCrisisActive(true);
      setSessionPaused(true);
      onCrisisDetected?.();
      setMessages(prev => [...prev, {
        id: Date.now() + 'r',
        role: 'system',
        text: '⚠️ Session paused. Please reach out to a helpline below — they\'re trained to help and it\'s completely free and confidential.',
        level: 'crisis',
        timestamp: new Date(),
      }]);
    } else if (level === 'flagged') {
      setFlaggedActive(true);
      onFlaggedDetected?.();
    } else if (level === 'concern') {
      setConcernActive(true);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const unreadCrisis = crisisActive && !open;
  const messageCount = messages.filter(m => m.role === 'user').length;

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Toggle header */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', borderRadius: open ? '12px 12px 0 0' : 12,
          background: unreadCrisis ? '#FEF2F2' : '#F5F3FF',
          border: `1.5px solid ${unreadCrisis ? '#FCA5A5' : '#E9D5FF'}`,
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MessageCircle size={15} color={unreadCrisis ? '#EF4444' : '#7C3AED'} />
          <span style={{ fontSize: 13, fontWeight: 700, color: unreadCrisis ? '#991B1B' : '#1F2937' }}>
            Pre-Session Message Thread
          </span>
          <span style={{
            fontSize: 10, background: '#7C3AED', color: '#fff',
            padding: '1px 6px', borderRadius: 100, fontWeight: 700,
          }}>AI Moderated</span>
          {messageCount > 0 && (
            <span style={{
              fontSize: 10, background: '#E9D5FF', color: '#5B21B6',
              padding: '1px 6px', borderRadius: 100, fontWeight: 700,
            }}>{messageCount}</span>
          )}
        </div>
        {open ? <ChevronUp size={14} color="#6B7280" /> : <ChevronDown size={14} color="#6B7280" />}
      </button>

      {open && (
        <div style={{
          border: '1.5px solid #E9D5FF', borderTop: 'none',
          borderRadius: '0 0 12px 12px', overflow: 'hidden',
        }}>
          {/* Alerts */}
          <div style={{ padding: '12px 14px 0' }}>
            {crisisActive && (
              <CrisisAlert onDismiss={() => {
                setCrisisActive(false);
                setSessionPaused(false);
              }} />
            )}
            {flaggedActive && !crisisActive && (
              <FlaggedWarning onDismiss={() => setFlaggedActive(false)} />
            )}
            {concernActive && !crisisActive && !flaggedActive && (
              <ConcernBanner />
            )}
          </div>

          {/* Messages */}
          <div style={{
            maxHeight: 240, overflowY: 'auto', padding: '10px 14px',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            {messages.map(m => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {m.role === 'system' && (
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', background: '#E9D5FF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginRight: 6, alignSelf: 'flex-end',
                  }}>
                    <Bot size={12} color="#7C3AED" />
                  </div>
                )}
                <div style={{
                  maxWidth: '75%', padding: '8px 12px',
                  fontSize: 12, lineHeight: 1.5,
                  background: m.role === 'user'
                    ? m.level === 'crisis' ? '#FEE2E2'
                    : m.level === 'flagged' ? '#FEF3C7'
                    : '#7C3AED'
                    : '#F5F3FF',
                  color: m.role === 'user'
                    ? m.level === 'crisis' ? '#991B1B'
                    : m.level === 'flagged' ? '#92400E'
                    : '#fff'
                    : '#374151',
                  borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  border: m.level === 'crisis' ? '1px solid #FCA5A5'
                    : m.level === 'flagged' ? '1px solid #FCD34D' : 'none',
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '10px 14px', borderTop: '1px solid #F3F4F6',
            display: 'flex', gap: 8, alignItems: 'flex-end',
            background: sessionPaused ? '#FEF2F2' : '#fff',
          }}>
            {sessionPaused ? (
              <div style={{ flex: 1, fontSize: 12, color: '#EF4444', padding: '8px 0' }}>
                ⚠️ Messaging paused. Please call a helpline or dismiss the alert above.
              </div>
            ) : (
              <>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message your companion or share what's on your mind…"
                  rows={2}
                  style={{
                    flex: 1, resize: 'none', border: '1.5px solid #E9D5FF',
                    borderRadius: 8, padding: '8px 10px', fontSize: 12,
                    fontFamily: 'inherit', outline: 'none', color: '#1F2937',
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: input.trim() ? '#7C3AED' : '#E9D5FF',
                    border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Send size={14} color="#fff" />
                </button>
              </>
            )}
          </div>

          {/* Moderation note */}
          <div style={{
            padding: '6px 14px 10px',
            fontSize: 10, color: '#9CA3AF',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <Shield size={9} />
            All messages are AI-moderated for your safety. Inappropriate requests will be flagged.
          </div>
        </div>
      )}
    </div>
  );
}
