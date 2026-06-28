# Just Friends v2.0

Udaipur & Jodhpur — Verified Platonic Companionship Platform  
Purple & white design · Aadhaar registration · 50% UPI advance booking · No API needed

## How to Run

### Requirements
- [Node.js](https://nodejs.org/) (LTS version)

### Steps

```bash
cd just-friends
npm install
npm run dev
```

Open: `http://localhost:5173`

---

## File Structure

```
just-friends/
├── index.html                    ← App shell & font import
├── package.json                  ← Dependencies
├── vite.config.ts                ← Vite bundler config
├── tailwind.config.js            ← Purple brand colours
├── postcss.config.js
├── tsconfig.json
└── src/
    ├── main.tsx                  ← React entry point
    ├── App.tsx                   ← Page router + global state
    ├── index.css                 ← Design system (purple/white)
    │
    ├── types/
    │   └── index.ts              ← Companion, User, Platform types
    │
    ├── data/
    │   ├── companions.ts         ← 9 companions (Udaipur & Jodhpur)
    │   └── platforms.ts          ← RABF, KoPartner, Kumpanio metadata
    │
    ├── components/
    │   ├── Navbar.tsx            ← Sticky nav (logo, auth state, helpline)
    │   ├── CompanionCard.tsx     ← Photo card with book button
    │   ├── CompanionDetailModal.tsx ← Full profile popup (reviews, GPS toggle)
    │   └── BookingModal.tsx      ← 3-step booking + UPI 50% advance flow
    │
    └── pages/
        ├── HomePage.tsx          ← Hero + stats + 3 platform cards
        ├── AuthPage.tsx          ← Login / Register (Aadhaar, emergency contact)
        ├── PlatformPage.tsx      ← Companion grid with city + tier filters
        └── HelplinePage.tsx      ← Dr. Aarav Mehta helpline + consult input
```

## Key Features
- **Udaipur & Jodhpur only** — city locked at registration
- **Aadhaar verification** — mandatory for all users
- **50% UPI advance** — QR code + screenshot upload before confirm
- **Companion profiles** — real photos, reviews, GPS toggle, availability
- **3-step booking** — activity → invoice → payment → confirmation
- **Platonic Oath** — checkbox required before confirming any booking
- **Auth gate** — booking redirects unauthenticated users to register

## Build for Production

```bash
npm run build
npm run preview
```
