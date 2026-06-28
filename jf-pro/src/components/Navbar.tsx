import { Heart, Phone, UserCheck, LogOut, LayoutDashboard, Briefcase, Gift } from 'lucide-react';
import type { User } from '../types';

interface NavbarProps {
  onHome: () => void;
  onHelpline: () => void;
  onAuth: () => void;
  user: User | null;
  onLogout: () => void;
  onDashboard?: () => void;
  onCompanionDashboard?: () => void;
  onRewards?: () => void;
}

export default function Navbar({
  onHome, onHelpline, onAuth, user, onLogout, onDashboard, onCompanionDashboard, onRewards,
}: NavbarProps) {
  return (
    <nav
      style={{
        background: '#fff',
        borderBottom: '1.5px solid #E9D5FF',
        padding: '0 24px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <button
        onClick={onHome}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          fontWeight: 700, fontSize: 17, color: '#5B21B6',
          cursor: 'pointer', border: 'none', background: 'none',
          fontFamily: 'inherit',
        }}
      >
        <div
          style={{
            width: 36, height: 36, background: '#7C3AED',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Heart size={17} color="#fff" fill="#fff" />
        </div>
        Just Friends
      </button>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {user ? (
          <>
            <button
              onClick={onDashboard}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#F5F3FF', border: '1.5px solid #E9D5FF',
                borderRadius: 100, padding: '6px 12px', fontSize: 12,
                color: '#5B21B6', fontWeight: 600, cursor: 'pointer',
              }}
              title="My Dashboard"
            >
              <LayoutDashboard size={13} />
              <span style={{ display: 'none' }} className="md-show">Dashboard</span>
            </button>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#F5F3FF', border: '1px solid #E9D5FF',
                borderRadius: 100, padding: '6px 14px', fontSize: 13,
                color: '#5B21B6', fontWeight: 600,
              }}
            >
              <UserCheck size={14} />
              {user.firstName} · {user.city}
            </div>
            <button className="btn-ghost" onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <LogOut size={13} />
            </button>
          </>
        ) : (
          <>
            <button className="btn-ghost" onClick={onAuth}>Login</button>
            <button className="btn-primary" onClick={onAuth}>Register</button>
          </>
        )}

        {/* Companion dashboard - visible to all for demo */}
        <button
          onClick={onCompanionDashboard}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#1F2937', border: 'none',
            borderRadius: 100, padding: '7px 13px', fontSize: 12,
            color: '#fff', fontWeight: 600, cursor: 'pointer',
          }}
          title="Companion Dashboard"
        >
          <Briefcase size={13} />
          <span>Companion</span>
        </button>

        {/* Rewards */}
        <button
          onClick={onRewards}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#FEF3C7', border: '1.5px solid #FCD34D',
            borderRadius: 100, padding: '7px 13px', fontSize: 12,
            color: '#92400E', fontWeight: 700, cursor: 'pointer',
          }}
          title="Rewards & Savings"
        >
          <Gift size={13} />
          <span>Rewards</span>
        </button>

        <button
          className="btn-primary"
          onClick={onHelpline}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Phone size={13} />
          Helpline
        </button>
      </div>
    </nav>
  );
}
