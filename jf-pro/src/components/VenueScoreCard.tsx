import { useState } from 'react';
import {
  Shield, Eye, Sun, Users, MapPin, ExternalLink,
  ChevronDown, ChevronUp, AlertTriangle, CheckCircle,
} from 'lucide-react';

interface VenueScore {
  name: string;
  address: string;
  city: string;
  lighting: number;   // 1–5
  cctv: number;       // 1–5
  crowdedness: number; // 1–5 (higher = more public = safer)
  communityReports: number; // verified safe visits
  mapsQuery: string;
  category: string;
  partnerDiscount?: string; // e.g. "15% off for JF sessions"
}

const VENUE_DB: VenueScore[] = [
  // Udaipur
  {
    name: 'Ambrai Ghat',
    address: 'Ambrai, Udaipur',
    city: 'Udaipur',
    lighting: 4,
    cctv: 3,
    crowdedness: 5,
    communityReports: 148,
    mapsQuery: 'Ambrai+Ghat+Udaipur',
    category: 'Lakeside',
  },
  {
    name: 'Millets of Mewar',
    address: 'Bhupalpura, Udaipur',
    city: 'Udaipur',
    lighting: 5,
    cctv: 5,
    crowdedness: 4,
    communityReports: 93,
    mapsQuery: 'Millets+of+Mewar+Udaipur',
    category: 'Café',
    partnerDiscount: '15% off for JF sessions',
  },
  {
    name: 'Upre by 1559 AD',
    address: 'Lake Pichola, Udaipur',
    city: 'Udaipur',
    lighting: 5,
    cctv: 5,
    crowdedness: 4,
    communityReports: 72,
    mapsQuery: 'Upre+1559+AD+Udaipur',
    category: 'Restaurant',
    partnerDiscount: '10% off for JF sessions',
  },
  {
    name: 'Fateh Sagar Lake Promenade',
    address: 'Fateh Sagar, Udaipur',
    city: 'Udaipur',
    lighting: 3,
    cctv: 2,
    crowdedness: 5,
    communityReports: 210,
    mapsQuery: 'Fateh+Sagar+Lake+Udaipur',
    category: 'Lakeside',
  },
  {
    name: 'City Palace Complex',
    address: 'City Palace Road, Udaipur',
    city: 'Udaipur',
    lighting: 5,
    cctv: 5,
    crowdedness: 5,
    communityReports: 185,
    mapsQuery: 'City+Palace+Udaipur',
    category: 'Heritage',
  },
  // Jodhpur
  {
    name: 'Mehrangarh Fort Viewpoint',
    address: 'Fort Road, Jodhpur',
    city: 'Jodhpur',
    lighting: 4,
    cctv: 4,
    crowdedness: 5,
    communityReports: 132,
    mapsQuery: 'Mehrangarh+Fort+Jodhpur',
    category: 'Heritage',
  },
  {
    name: 'Clock Tower (Sardar Market)',
    address: 'Sardar Market, Jodhpur',
    city: 'Jodhpur',
    lighting: 5,
    cctv: 4,
    crowdedness: 5,
    communityReports: 167,
    mapsQuery: 'Sardar+Market+Jodhpur',
    category: 'Market',
  },
  {
    name: 'Toorji Ka Jhalra (Stepwell)',
    address: 'Near Clock Tower, Jodhpur',
    city: 'Jodhpur',
    lighting: 4,
    cctv: 3,
    crowdedness: 4,
    communityReports: 89,
    mapsQuery: 'Toorji+Ka+Jhalra+Jodhpur',
    category: 'Heritage',
  },
];

function scoreVenue(v: VenueScore): number {
  return Math.round(((v.lighting + v.cctv + v.crowdedness) / 15) * 100);
}

function ScoreMeter({ value, label, icon }: { value: number; label: string; icon: React.ReactNode }) {
  const pct = (value / 5) * 100;
  const color = value >= 4 ? '#22C55E' : value >= 3 ? '#F59E0B' : '#EF4444';
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#6B7280', marginBottom: 4 }}>
        {icon} {label}
      </div>
      <div style={{ background: '#F3F4F6', borderRadius: 100, height: 6, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%', borderRadius: 100,
          background: color, transition: 'width 0.4s',
        }} />
      </div>
      <div style={{ fontSize: 10, color, fontWeight: 700, marginTop: 2 }}>{value}/5</div>
    </div>
  );
}

function SafetyBadge({ score }: { score: number }) {
  if (score >= 85) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#DCFCE7', color: '#065F46', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}>
      <CheckCircle size={10} /> Highly Safe
    </span>
  );
  if (score >= 65) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#FEF3C7', color: '#92400E', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}>
      <Shield size={10} /> Safe
    </span>
  );
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#FEE2E2', color: '#991B1B', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}>
      <AlertTriangle size={10} /> Use Caution
    </span>
  );
}

interface Props {
  suggestedVenueName?: string; // venue typed by user in booking
  city?: string;
  onSelectVenue?: (name: string) => void;
}

export default function VenueScoreCard({ suggestedVenueName, city, onSelectVenue }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [cityFilter, setCityFilter] = useState<string>(city ?? 'Udaipur');

  // If user typed a venue, try to fuzzy-match
  const directMatch = suggestedVenueName
    ? VENUE_DB.find(v =>
        v.name.toLowerCase().includes(suggestedVenueName.toLowerCase()) ||
        suggestedVenueName.toLowerCase().includes(v.name.toLowerCase())
      )
    : null;

  const filtered = VENUE_DB.filter(v => v.city === cityFilter);

  if (directMatch) {
    const score = scoreVenue(directMatch);
    return (
      <div style={{
        background: '#F5F3FF', border: '1.5px solid #C4B5FD',
        borderRadius: 12, padding: 14, marginTop: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Shield size={14} color="#7C3AED" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#5B21B6' }}>Venue Safety Score</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: score >= 85 ? '#22C55E' : score >= 65 ? '#F59E0B' : '#EF4444' }}>
              {score}%
            </span>
            <SafetyBadge score={score} />
          </div>
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: '#1F2937', marginBottom: 2 }}>{directMatch.name}</div>
        <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 12 }}>{directMatch.address}</div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
          <ScoreMeter value={directMatch.lighting} label="Lighting" icon={<Sun size={10} />} />
          <ScoreMeter value={directMatch.cctv} label="CCTV" icon={<Eye size={10} />} />
          <ScoreMeter value={directMatch.crowdedness} label="Public" icon={<Users size={10} />} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
          <span style={{ color: '#6B7280' }}>
            <CheckCircle size={10} style={{ display: 'inline', verticalAlign: -1, marginRight: 3 }} color="#22C55E" />
            {directMatch.communityReports} verified JF sessions here
          </span>
          {directMatch.partnerDiscount && (
            <span style={{ background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: 100, fontWeight: 700, fontSize: 10 }}>
              🎁 {directMatch.partnerDiscount}
            </span>
          )}
        </div>

        <a
          href={`https://www.google.com/maps/search/${directMatch.mapsQuery}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            marginTop: 10, fontSize: 12, color: '#7C3AED', fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <MapPin size={11} /> View on Google Maps <ExternalLink size={10} />
        </a>
      </div>
    );
  }

  // Show venue browser
  return (
    <div style={{
      background: '#F5F3FF', border: '1.5px solid #E9D5FF',
      borderRadius: 12, padding: 14, marginTop: 8,
    }}>
      <button
        onClick={() => setExpanded(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', background: 'none',
          border: 'none', cursor: 'pointer', padding: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Shield size={14} color="#7C3AED" />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#5B21B6' }}>Browse Safe Venues</span>
          <span style={{ fontSize: 10, background: '#7C3AED', color: '#fff', padding: '1px 6px', borderRadius: 100 }}>
            {VENUE_DB.length} rated
          </span>
        </div>
        {expanded ? <ChevronUp size={14} color="#6B7280" /> : <ChevronDown size={14} color="#6B7280" />}
      </button>

      {expanded && (
        <div style={{ marginTop: 14 }}>
          {/* City toggle */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            {['Udaipur', 'Jodhpur'].map(c => (
              <button
                key={c}
                onClick={() => setCityFilter(c)}
                style={{
                  padding: '5px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                  background: cityFilter === c ? '#7C3AED' : '#fff',
                  color: cityFilter === c ? '#fff' : '#6B7280',
                  border: `1.5px solid ${cityFilter === c ? '#7C3AED' : '#E9D5FF'}`,
                  cursor: 'pointer',
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(v => {
              const score = scoreVenue(v);
              return (
                <div
                  key={v.name}
                  className="card"
                  style={{ padding: 14, cursor: onSelectVenue ? 'pointer' : 'default' }}
                  onClick={() => onSelectVenue?.(v.name)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#1F2937' }}>{v.name}</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{v.category} · {v.communityReports} JF sessions</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: 900, color: score >= 85 ? '#22C55E' : score >= 65 ? '#F59E0B' : '#EF4444' }}>
                        {score}%
                      </span>
                      <SafetyBadge score={score} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                    <ScoreMeter value={v.lighting} label="Lighting" icon={<Sun size={10} />} />
                    <ScoreMeter value={v.cctv} label="CCTV" icon={<Eye size={10} />} />
                    <ScoreMeter value={v.crowdedness} label="Public" icon={<Users size={10} />} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {v.partnerDiscount ? (
                      <span style={{ fontSize: 10, background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: 100, fontWeight: 700 }}>
                        🎁 {v.partnerDiscount}
                      </span>
                    ) : <span />}
                    <a
                      href={`https://www.google.com/maps/search/${v.mapsQuery}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{ fontSize: 11, color: '#7C3AED', display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none', fontWeight: 600 }}
                    >
                      <MapPin size={10} /> Maps <ExternalLink size={9} />
                    </a>
                  </div>

                  {onSelectVenue && (
                    <button
                      className="btn-full"
                      style={{ marginTop: 10, padding: '7px 0', fontSize: 12 }}
                      onClick={e => { e.stopPropagation(); onSelectVenue(v.name + ', ' + v.city); }}
                    >
                      Use this venue
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
