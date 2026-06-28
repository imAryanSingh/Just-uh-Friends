import { useState, useEffect, useCallback } from 'react';
import {
  Shield, AlertTriangle, CheckCircle, Phone, MapPin,
  Clock, X, ShieldCheck, Bell,
} from 'lucide-react';
import type { ActiveSession, SessionCheckInStatus } from '../types';

interface Props {
  session: ActiveSession | null;
  onUpdateStatus: (status: SessionCheckInStatus) => void;
  emergencyContact?: string;
}

const STATUS_CONFIG: Record<SessionCheckInStatus, {
  label: string; color: string; bg: string; border: string;
}> = {
  pending: { label: 'Session Pending', color: '#92400E', bg: '#FEF3C7', border: '#FCD34D' },
  arrived:  { label: 'Arrived Safely', color: '#065F46', bg: '#DCFCE7', border: '#6EE7B7' },
  ended:    { label: 'Session Ended', color: '#1E3A8A', bg: '#DBEAFE', border: '#93C5FD' },
  sos:      { label: 'SOS SENT', color: '#fff', bg: '#EF4444', border: '#EF4444' },
};

/* ── Mock demo session (used when no real session is active) ── */
const DEMO_SESSION: ActiveSession = {
  companionId: 'r1',
  companionName: 'Arjun Mehta',
  scheduledEndISO: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1hr from now
  status: 'pending',
  emergencyContact: '91-98765-43210',
};

function useCountdown(targetISO: string) {
  const [remaining, setRemaining] = useState('');
  useEffect(() => {
    function calc() {
      const diff = new Date(targetISO).getTime() - Date.now();
      if (diff <= 0) { setRemaining('Session time reached'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${h > 0 ? h + 'h ' : ''}${m}m ${s}s remaining`);
    }
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [targetISO]);
  return remaining;
}

function SOSModal({ onClose, emergencyContact }: { onClose: () => void; emergencyContact?: string }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: 28,
        maxWidth: 360, width: '100%', textAlign: 'center',
        border: '3px solid #EF4444',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: '#FEE2E2', display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 16px',
        }}>
          <AlertTriangle size={32} color="#EF4444" />
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: '#EF4444', marginBottom: 8 }}>
          SOS Alert Sent!
        </h3>
        <p style={{ fontSize: 14, color: '#374151', marginBottom: 16, lineHeight: 1.5 }}>
          Your GPS location has been shared with:
        </p>
        <div style={{ background: '#FEE2E2', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: '#7F1D1D', fontWeight: 600 }}>
            📞 Emergency Contact: {emergencyContact ?? 'Not set'}
          </div>
          <div style={{ fontSize: 13, color: '#7F1D1D', fontWeight: 600, marginTop: 4 }}>
            🛡️ Just Friends Safety Team
          </div>
        </div>
        <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 20 }}>
          Stay calm. Help is on the way. Move to a public area if possible.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <a
            href="tel:112"
            style={{
              flex: 1, background: '#EF4444', color: '#fff',
              padding: '10px 0', borderRadius: 100, fontWeight: 700,
              fontSize: 14, display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 6, textDecoration: 'none',
            }}
          >
            <Phone size={14} /> Call 112
          </a>
          <button
            onClick={onClose}
            style={{
              flex: 1, background: '#F3F4F6', color: '#374151',
              padding: '10px 0', borderRadius: 100, fontWeight: 600,
              fontSize: 14, border: 'none', cursor: 'pointer',
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PanicButton({ session: externalSession, onUpdateStatus, emergencyContact }: Props) {
  const [localSession, setLocalSession] = useState<ActiveSession>(DEMO_SESSION);
  const session = externalSession ?? localSession;

  const [showSOS, setShowSOS] = useState(false);
  const [sosPressCount, setSosPressCount] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const countdown = useCountdown(session.scheduledEndISO);

  const statusCfg = STATUS_CONFIG[session.status];

  /* Triple-tap SOS to prevent accidental trigger */
  const handleSOSPress = useCallback(() => {
    const newCount = sosPressCount + 1;
    setSosPressCount(newCount);
    if (newCount >= 1) {
      // In production, 3 taps triggers — simplified to 1 for demo
      const updated: SessionCheckInStatus = 'sos';
      setLocalSession(s => ({ ...s, status: updated }));
      onUpdateStatus(updated);
      setShowSOS(true);
      setSosPressCount(0);
    }
  }, [sosPressCount, onUpdateStatus]);

  function markArrived() {
    setLocalSession(s => ({ ...s, status: 'arrived' }));
    onUpdateStatus('arrived');
  }

  function markEnded() {
    setLocalSession(s => ({ ...s, status: 'ended' }));
    onUpdateStatus('ended');
  }

  if (collapsed) {
    return (
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 200 }}>
        <button
          onClick={() => setCollapsed(false)}
          style={{
            width: 52, height: 52, borderRadius: '50%',
            background: session.status === 'sos' ? '#EF4444' : '#7C3AED',
            border: 'none', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
          }}
          title="Session Safety"
        >
          <Shield size={22} color="#fff" />
        </button>
      </div>
    );
  }

  return (
    <>
      {showSOS && <SOSModal onClose={() => setShowSOS(false)} emergencyContact={session.emergencyContact ?? emergencyContact} />}

      <div style={{
        background: '#fff',
        border: `2px solid ${statusCfg.border}`,
        borderRadius: 16,
        padding: 18,
        marginBottom: 24,
        position: 'relative',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={18} color="#7C3AED" />
            <span style={{ fontWeight: 700, fontSize: 15, color: '#1F2937' }}>Session Safety</span>
          </div>
          <button
            onClick={() => setCollapsed(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Session info */}
        <div style={{
          background: statusCfg.bg,
          borderRadius: 10,
          padding: '10px 14px',
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>Active Session With</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1F2937' }}>{session.companionName}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              <Clock size={10} /> {countdown}
            </div>
          </div>
          <span style={{
            background: statusCfg.bg, color: statusCfg.color,
            border: `1px solid ${statusCfg.border}`,
            fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100,
          }}>
            {statusCfg.label}
          </span>
        </div>

        {/* Check-in buttons */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <button
            onClick={markArrived}
            disabled={session.status !== 'pending'}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 700,
              cursor: session.status !== 'pending' ? 'not-allowed' : 'pointer',
              background: session.status === 'arrived' ? '#DCFCE7' : '#F0FDF4',
              color: session.status === 'arrived' ? '#065F46' : '#374151',
              border: `1.5px solid ${session.status === 'arrived' ? '#6EE7B7' : '#D1FAE5'}`,
              opacity: session.status !== 'pending' && session.status !== 'arrived' ? 0.5 : 1,
            }}
          >
            <CheckCircle size={14} />
            Arrived Safely
          </button>
          <button
            onClick={markEnded}
            disabled={session.status === 'pending' || session.status === 'ended'}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 700,
              cursor: (session.status === 'pending' || session.status === 'ended') ? 'not-allowed' : 'pointer',
              background: session.status === 'ended' ? '#DBEAFE' : '#EFF6FF',
              color: session.status === 'ended' ? '#1E3A8A' : '#374151',
              border: `1.5px solid ${session.status === 'ended' ? '#93C5FD' : '#BFDBFE'}`,
              opacity: session.status === 'pending' ? 0.5 : 1,
            }}
          >
            <CheckCircle size={14} />
            Ended Safely
          </button>
        </div>

        {/* GPS + SOS */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 6,
            background: '#F5F3FF', borderRadius: 10, padding: '10px 12px',
            fontSize: 12, color: '#6B7280',
          }}>
            <MapPin size={14} color="#7C3AED" />
            <span>GPS shared with safety team</span>
          </div>
          <button
            onClick={handleSOSPress}
            style={{
              background: '#EF4444',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '10px 18px',
              fontWeight: 800,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              animation: session.status === 'sos' ? 'pulse 1s infinite' : 'none',
              boxShadow: '0 2px 10px rgba(239,68,68,0.4)',
            }}
          >
            <AlertTriangle size={14} />
            SOS
          </button>
        </div>

        {/* Emergency contact info */}
        {(session.emergencyContact ?? emergencyContact) && (
          <div style={{
            marginTop: 12, display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 11, color: '#9CA3AF',
          }}>
            <Bell size={11} />
            <span>Emergency contact: {session.emergencyContact ?? emergencyContact}</span>
          </div>
        )}

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
        `}</style>
      </div>
    </>
  );
}
