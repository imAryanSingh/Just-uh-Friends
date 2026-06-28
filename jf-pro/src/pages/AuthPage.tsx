import { useState } from 'react';
import { Heart, ShieldCheck, Camera, Upload } from 'lucide-react';
import type { User, City } from '../types';

interface Props {
  onSuccess: (user: User) => void;
}

type Tab = 'login' | 'register';

export default function AuthPage({ onSuccess }: Props) {
  const [tab, setTab] = useState<Tab>('login');

  /* ── LOGIN state ── */
  const [lPhone, setLPhone] = useState('');
  const [lPass,  setLPass]  = useState('');

  /* ── REGISTER state ── */
  const [rFn,    setRFn]    = useState('');
  const [rLn,    setRLn]    = useState('');
  const [rPhone, setRPhone] = useState('');
  const [rEmail, setREmail] = useState('');
  const [rAge,   setRAge]   = useState('');
  const [rGender,setRGender]= useState('');
  const [rCity,  setRCity]  = useState<City | ''>('');
  const [rAadh,  setRAadh]  = useState('');
  const [rPw,    setRPw]    = useState('');
  const [rEcn,   setREcn]   = useState('');
  const [rEcp,   setREcp]   = useState('');
  const [aadhuploaded, setAadhUploaded] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);

  function fmtAadh(v: string) {
    const digits = v.replace(/\D/g, '').slice(0, 12);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  function doLogin() {
    if (!lPhone || lPhone.length < 10) { alert('Enter a valid 10-digit mobile number.'); return; }
    if (!lPass) { alert('Enter your password.'); return; }
    onSuccess({ firstName: 'Friend', lastName: '', phone: lPhone, city: 'Udaipur', aadhaarLast4: '****' });
  }

  function doRegister() {
    if (!rFn || !rLn)               { alert('Please enter your full name.'); return; }
    if (!rPhone || rPhone.length < 10){ alert('Enter a valid 10-digit mobile number.'); return; }
    if (!rAge || parseInt(rAge) < 18){ alert('You must be 18+ to register.'); return; }
    if (!rGender)                    { alert('Please select your gender.'); return; }
    if (!rCity)                      { alert('Please select your city — Udaipur or Jodhpur only.'); return; }
    const digits = rAadh.replace(/\s/g, '');
    if (digits.length !== 12)        { alert('Please enter a valid 12-digit Aadhaar number.'); return; }
    if (!rPw || rPw.length < 8)      { alert('Password must be at least 8 characters.'); return; }
    onSuccess({ firstName: rFn, lastName: rLn, phone: rPhone, city: rCity, aadhaarLast4: '****' + digits.slice(-4) });
  }

  return (
    <div style={{ maxWidth: 440, margin: '0 auto', padding: '32px 24px' }}>
      <div className="card" style={{ padding: 32 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 52, height: 52, background: '#7C3AED', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Heart size={22} color="#fff" fill="#fff" />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1F2937' }}>Just Friends</h2>
          <p style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>Udaipur &amp; Jodhpur — Verified Platonic Companions</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: '#F5F3FF', borderRadius: 100, padding: 4, marginBottom: 24 }}>
          {(['login', 'register'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '8px', borderRadius: 100, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', border: 'none', fontFamily: 'inherit',
                background: tab === t ? '#7C3AED' : 'transparent',
                color: tab === t ? '#fff' : '#6B7280',
                transition: 'all .2s',
              }}
            >
              {t === 'login' ? 'Login' : 'Register'}
            </button>
          ))}
        </div>

        {/* ── LOGIN ── */}
        {tab === 'login' && (
          <>
            <div className="f-group">
              <label className="f-label">Mobile Number</label>
              <input className="jf-input" type="tel" placeholder="10-digit mobile number" value={lPhone} onChange={(e) => setLPhone(e.target.value)} />
            </div>
            <div className="f-group">
              <label className="f-label">Password</label>
              <input className="jf-input" type="password" placeholder="Enter your password" value={lPass} onChange={(e) => setLPass(e.target.value)} />
            </div>
            <button className="btn-full" onClick={doLogin}>Login to Just Friends</button>
            <div style={{ textAlign: 'center', fontSize: 13, color: '#6B7280', marginTop: 14 }}>
              New here?{' '}
              <button style={{ background: 'none', border: 'none', color: '#7C3AED', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }} onClick={() => setTab('register')}>
                Register free
              </button>
            </div>
          </>
        )}

        {/* ── REGISTER ── */}
        {tab === 'register' && (
          <>
            {/* City notice */}
            <div style={{ fontSize: 12, color: '#5B21B6', background: '#F5F3FF', padding: '10px 12px', borderRadius: 8, border: '1px solid #E9D5FF', marginBottom: 16 }}>
              <strong>Service available in Udaipur &amp; Jodhpur only.</strong> Aadhaar verification is mandatory for all bookings.
            </div>

            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="f-group">
                <label className="f-label">First Name</label>
                <input className="jf-input" placeholder="Aryan" value={rFn} onChange={(e) => setRFn(e.target.value)} />
              </div>
              <div className="f-group">
                <label className="f-label">Last Name</label>
                <input className="jf-input" placeholder="Singh" value={rLn} onChange={(e) => setRLn(e.target.value)} />
              </div>
            </div>

            <div className="f-group">
              <label className="f-label">Mobile Number <span style={{ color: '#DC2626', fontSize: 11 }}>*</span></label>
              <input className="jf-input" type="tel" placeholder="10-digit mobile number" value={rPhone} onChange={(e) => setRPhone(e.target.value)} />
            </div>

            <div className="f-group">
              <label className="f-label">Email Address</label>
              <input className="jf-input" type="email" placeholder="you@email.com" value={rEmail} onChange={(e) => setREmail(e.target.value)} />
            </div>

            {/* Age + Gender */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="f-group">
                <label className="f-label">Age <span style={{ color: '#DC2626', fontSize: 11 }}>*</span></label>
                <input className="jf-input" type="number" placeholder="18+" min={18} max={60} value={rAge} onChange={(e) => setRAge(e.target.value)} />
              </div>
              <div className="f-group">
                <label className="f-label">Gender <span style={{ color: '#DC2626', fontSize: 11 }}>*</span></label>
                <select className="jf-select" value={rGender} onChange={(e) => setRGender(e.target.value)}>
                  <option value="">Select...</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="f-group">
              <label className="f-label">City <span style={{ color: '#DC2626', fontSize: 11 }}>*</span></label>
              <select className="jf-select" value={rCity} onChange={(e) => setRCity(e.target.value as City)}>
                <option value="">Select city...</option>
                <option value="Udaipur">Udaipur</option>
                <option value="Jodhpur">Jodhpur</option>
              </select>
            </div>

            {/* Aadhaar section */}
            <div style={{ background: '#EDE9FE', border: '1px solid #E9D5FF', borderRadius: 8, padding: 12, marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#5B21B6', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.5px', display: 'flex', alignItems: 'center', gap: 5 }}>
                <ShieldCheck size={13} /> Aadhaar Verification (mandatory)
              </div>
              <div className="f-group" style={{ marginBottom: 8 }}>
                <label className="f-label">Aadhaar Number <span style={{ color: '#DC2626', fontSize: 11 }}>*</span></label>
                <input
                  className="jf-input"
                  placeholder="XXXX XXXX XXXX"
                  maxLength={14}
                  value={rAadh}
                  onChange={(e) => setRAadh(fmtAadh(e.target.value))}
                />
              </div>
              <div
                className={`upload-zone ${aadhuploaded ? 'done' : ''}`}
                onClick={() => setAadhUploaded(true)}
              >
                {aadhuploaded ? (
                  <><ShieldCheck size={18} color="#22C55E" style={{ display: 'block', margin: '0 auto 4px' }} /><span style={{ color: '#166534', fontWeight: 600 }}>Aadhaar uploaded ✓</span></>
                ) : (
                  <><Upload size={18} style={{ display: 'block', margin: '0 auto 4px', color: '#6B7280' }} />Upload Aadhaar front photo</>
                )}
              </div>
              <div style={{ fontSize: 11, color: '#5B21B6', marginTop: 6, opacity: .8 }}>
                Your Aadhaar is encrypted and used only for identity verification. Never shared with companions.
              </div>
            </div>

            {/* Emergency contact */}
            <div className="f-group">
              <label className="f-label">Emergency Contact Name</label>
              <input className="jf-input" placeholder="Parent / sibling name" value={rEcn} onChange={(e) => setREcn(e.target.value)} />
            </div>
            <div className="f-group">
              <label className="f-label">Emergency Contact Phone</label>
              <input className="jf-input" type="tel" placeholder="Emergency contact number" value={rEcp} onChange={(e) => setREcp(e.target.value)} />
            </div>

            {/* Profile photo */}
            <div className="f-group">
              <label className="f-label">Profile Photo</label>
              <div className={`upload-zone ${photoUploaded ? 'done' : ''}`} onClick={() => setPhotoUploaded(true)}>
                {photoUploaded ? (
                  <><Camera size={18} color="#22C55E" style={{ display: 'block', margin: '0 auto 4px' }} /><span style={{ color: '#166534', fontWeight: 600 }}>Photo uploaded ✓</span></>
                ) : (
                  <><Camera size={18} style={{ display: 'block', margin: '0 auto 4px', color: '#6B7280' }} />Upload a clear profile photo</>
                )}
              </div>
            </div>

            <div className="f-group">
              <label className="f-label">Set Password <span style={{ color: '#DC2626', fontSize: 11 }}>*</span></label>
              <input className="jf-input" type="password" placeholder="Min. 8 characters" value={rPw} onChange={(e) => setRPw(e.target.value)} />
            </div>

            <button className="btn-full" onClick={doRegister}>Create My Account &amp; Verify</button>
          </>
        )}
      </div>
    </div>
  );
}
