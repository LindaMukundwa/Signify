# Signify — HackPrinceton Project

## Overview

Signify is a client-side React + TypeScript + Vite web app that helps Deaf and hard-of-hearing people communicate with hearing people who don't know ASL. It targets two scenarios: emergency encounters with first responders as well as day-to-day encounters with pharmacies, clinics, etc.

**Deployed on:** Vercel (auto-deploy from GitHub)  
**No backend. No database. All data stays on the user's device.**

---

## Core decisions

| Decision | Choice | Reason |
|---|---|---|
| Framework | React + Vite + TypeScript | Fast dev server, strong typing |
| State management | Zustand + localStorage middleware | Simpler than Context, built-in persistence |
| Styling | Tailwind CSS | Fast responsive UI under time pressure |
| QR strategy | Base64 profile in URL param | No backend needed, works on any device |
| Fingerspelling output | One letter at a time | Scoped, reliable, demo-safe |
| Phrase set | Fixed medical set + user-addable custom | Balance of speed and flexibility |
| Target devices | Mobile + desktop (fully responsive) | Demo on any device |

---

## Project structure

```
src/
  components/
    medical-id/
      MedicalIDCard.tsx       # Apple ID-style read-only card
      MedicalIDForm.tsx       # Single-screen onboarding form
      QRDisplay.tsx           # QR code + share/copy button
    phrase-pad/
      PhrasePad.tsx           # Card grid layout
      PhraseCard.tsx          # Individual tap-to-speak card
      AddPhraseModal.tsx      # Custom phrase entry modal
    fingerspelling/
      FingerspellCamera.tsx   # Camera feed + landmark overlay
      LetterDisplay.tsx       # Large letter readout
    shared/
      BottomNav.tsx           # Mobile-friendly tab bar
      Button.tsx              # Base button component
      Card.tsx                # Base card surface
      Modal.tsx               # Base modal wrapper
  pages/
    HomePage.tsx              # Entry screen + nav hub
    MedicalIDPage.tsx
    PhrasePadPage.tsx
    FingerspellingPage.tsx
    ResponderPage.tsx         # QR scan landing (no auth, read-only)
  hooks/
    useMedicalProfile.ts      # Read/write profile from store
    usePhrases.ts             # Phrase CRUD operations
    useSpeech.ts              # SpeechSynthesis + SpeechRecognition
    useHandDetection.ts       # MediaPipe Hands wrapper
  store/
    profileStore.ts           # Zustand slice for medical profile
    phraseStore.ts            # Zustand slice for phrases
  lib/
    encodeProfile.ts          # base64 encode/decode for QR URL
    generateQR.ts             # qrcode.js wrapper
    defaultPhrases.ts         # Fixed medical phrase set
    classifyHandshape.ts      # TF.js inference wrapper
  types/
    profile.ts                # MedicalProfile interface
    phrase.ts                 # Phrase interface
  styles/
    tokens.css                # Design tokens
```

---

## Data types

```typescript
// types/profile.ts
export interface MedicalProfile {
  name: string;
  age: string;
  bloodType: string;
  allergies: string[];
  medications: string[];           // name, dosage as strings
  conditions: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  insuranceProvider: string;
  insuranceMemberId: string;
  communicationNote: string;       // e.g. "Deaf/uses ASL"
  dnr: boolean;
  lastUpdated: string;             // ISO date string
}

// types/phrase.ts
export type PhraseCategory = 'medical' | 'emergency' | 'daily' | 'custom';

export interface Phrase {
  id: string;
  text: string;
  category: PhraseCategory;
  isDefault: boolean;
}
```

---

## QR code strategy

The profile is never stored on a server. Instead:

1. User fills in `MedicalIDForm` → saved to `profileStore` → persisted in `localStorage`
2. On `QRDisplay`, the profile is JSON-stringified → base64-encoded → appended as a URL param:
   ```
   https://signify.vercel.app/profile?data=BASE64_STRING
   ```
3. First responder scans QR → browser opens `ResponderPage` → decodes param → renders read-only profile

```typescript
// lib/encodeProfile.ts
export const encodeProfile = (profile: MedicalProfile): string =>
  btoa(unescape(encodeURIComponent(JSON.stringify(profile))));

export const decodeProfile = (encoded: string): MedicalProfile =>
  JSON.parse(decodeURIComponent(escape(atob(encoded))));
```

> **Note:** Base64-encoded URLs can get long. If the URL exceeds ~2KB, QR codes become dense and harder to scan. Keep field values concise. A future improvement could use compression (e.g. `lz-string`) before encoding.

---

## UI consistency guidelines

### Design language

Signify uses a clean, clinical aesthetic, which is inspired by Apple Health and Apple ID. The goal is to feel trustworthy and readable at a glance, especially under stress.

- Flat surfaces, no gradients on functional elements
- Generous whitespace — breathing room signals calm
- High contrast text — legibility is non-negotiable
- Rounded cards with subtle borders, never heavy shadows

### Color tokens (`styles/tokens.css`)

```css
:root {
  /* Brand */
  --color-primary: #1D9E75;        /* Teal — main actions */
  --color-primary-dark: #0F6E56;
  --color-primary-light: #E1F5EE;

  /* Semantic */
  --color-danger: #E24B4A;         /* Allergies, DNR flag */
  --color-warning: #BA7517;        /* Caution fields */
  --color-success: #639922;        /* Confirmed/saved states */

  /* Surfaces */
  --color-bg: #F8F8F7;
  --color-surface: #FFFFFF;
  --color-surface-secondary: #F1EFE8;

  /* Text */
  --color-text-primary: #2C2C2A;
  --color-text-secondary: #5F5E5A;
  --color-text-muted: #888780;

  /* Borders */
  --color-border: rgba(0,0,0,0.1);
  --color-border-strong: rgba(0,0,0,0.2);

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-full: 9999px;

  /* Spacing scale */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
}
```

### Typography

| Use | Size | Weight | Color |
|---|---|---|---|
| Page title | 22px | 600 | `--color-text-primary` |
| Section header | 16px | 600 | `--color-text-primary` |
| Body / labels | 15px | 400 | `--color-text-primary` |
| Secondary label | 13px | 400 | `--color-text-secondary` |
| Muted / metadata | 12px | 400 | `--color-text-muted` |
| Phrase card text | 17px | 500 | `--color-text-primary` |
| Letter display | 96px | 700 | `--color-primary` |

Font family: system-ui, -apple-system (native feel, no loading time).

### Component rules

**Cards**
- Background: `--color-surface`
- Border: `0.5px solid --color-border`
- Border radius: `--radius-md` (12px) for content cards, `--radius-lg` (20px) for the Medical ID card
- Padding: 16px standard, 20px for the Medical ID card

**Buttons**
- Primary: `--color-primary` background, white text, `--radius-full` pill shape
- Secondary: white background, `--color-border-strong` border, `--color-text-primary` text
- Danger: `--color-danger` background, white text
- Minimum tap target: 44px height (mobile accessibility)
- Never use fewer than 44px height on any interactive element

**Form inputs**
- Height: 48px
- Border: `1px solid --color-border`
- Border radius: `--radius-sm` (8px)
- Focus ring: `2px solid --color-primary` with `outline-offset: 2px`
- Placeholder: `--color-text-muted`
- Error state: `1px solid --color-danger` border + red helper text below

**Bottom navigation**
- Fixed to bottom on mobile
- 56px tall
- 3 tabs: Medical ID / Phrase Pad / Fingerspell
- Active tab: `--color-primary` icon + label
- Inactive: `--color-text-muted`

### Medical ID card — Apple ID reference

The card mirrors Apple ID's aesthetic: photo/avatar area at top, name large and centered, then a clean two-column field grid below. Critical fields (allergies, DNR) are highlighted in red.

```
┌─────────────────────────────────┐
│  [avatar / initials circle]     │
│  Full Name                      │  ← 22px, centered
│  Last updated: Jan 12 2025      │  ← 12px muted
├─────────────────────────────────┤
│  Blood type     │  Age          │
│  Allergies  ← red badge if any  │
│  Medications                    │
│  Conditions                     │
├─────────────────────────────────┤
│  Emergency contact              │
│  Name / Phone / Relation        │
├─────────────────────────────────┤
│  Insurance provider             │
│  Member ID                      │
│  [QR Code button]               │
└─────────────────────────────────┘
```

### Phrase pad cards

- 2-column grid on mobile, 3-column on desktop
- Card height: 80px minimum
- Text: 17px, 500 weight, centered
- Tap feedback: scale(0.96) + brief teal background flash
- Category pills above each group: Medical / Emergency / Daily / Custom

### Fingerspelling screen

- Camera feed: full-width, 16:9 ratio, rounded corners
- Letter display: centered below feed, 96px bold, teal color
- Confidence indicator: thin progress bar below the letter
- If no hand detected: muted "Show your hand" placeholder text

### Responsive breakpoints

```css
/* Mobile first */
/* sm: */ @media (min-width: 640px)  { ... }
/* md: */ @media (min-width: 768px)  { ... }
/* lg: */ @media (min-width: 1024px) { ... }
```

On desktop, the app renders in a centered max-width container (`max-w-lg` / 512px) to maintain a mobile-app feel. The bottom nav becomes a left sidebar on `lg`.

---

## Phrase pad — default medical set

```typescript
// lib/defaultPhrases.ts — sample entries
export const DEFAULT_PHRASES: Phrase[] = [
  // Medical
  { id: 'med-1', text: 'I am Deaf. I use ASL.', category: 'medical', isDefault: true },
  { id: 'med-2', text: 'Please write things down.', category: 'medical', isDefault: true },
  { id: 'med-3', text: 'I have a nut allergy.', category: 'medical', isDefault: true },
  { id: 'med-4', text: 'I need my medication.', category: 'medical', isDefault: true },
  // Emergency
  { id: 'em-1',  text: 'Call 911.', category: 'emergency', isDefault: true },
  { id: 'em-2',  text: 'I am having chest pain.', category: 'emergency', isDefault: true },
  { id: 'em-3',  text: 'Check my Medical ID.', category: 'emergency', isDefault: true },
  // Daily
  { id: 'dy-1',  text: 'Can you type your response?', category: 'daily', isDefault: true },
  { id: 'dy-2',  text: 'Please speak slowly.', category: 'daily', isDefault: true },
  { id: 'dy-3',  text: 'Yes.', category: 'daily', isDefault: true },
  { id: 'dy-4',  text: 'No.', category: 'daily', isDefault: true },
  { id: 'dy-5',  text: 'Thank you.', category: 'daily', isDefault: true },
];
```

---

## Fingerspelling — implementation notes

- Library: `@mediapipe/hands` loaded via CDN in `useHandDetection.ts`
- Model input: 21 landmarks × 3 coordinates (x, y, z) = 63 floats per frame
- Classifier: pre-trained TF.js model from ASL alphabet Kaggle dataset
- Skip: J and Z (require motion — show as unsupported with a tooltip)
- Confidence threshold: only display a letter if confidence > 0.85
- Frame rate: run inference every 3 frames to reduce CPU load on mobile

---

## Deployment

1. Push to GitHub
2. Connect repo to Vercel (auto-detects Vite)
3. Set build command: `vite build`, output dir: `dist`
4. Set the live URL in `lib/generateQR.ts` as `VITE_APP_URL` env var in Vercel dashboard
5. QR codes will automatically point to the production URL

```typescript
// lib/generateQR.ts
const BASE_URL = import.meta.env.VITE_APP_URL ?? 'http://localhost:5173';
export const buildResponderURL = (profile: MedicalProfile): string =>
  `${BASE_URL}/profile?data=${encodeProfile(profile)}`;
```

---

## Accessibility notes

- All interactive elements: minimum 44×44px touch target
- All images/icons: `aria-label` or `aria-hidden` appropriately
- Form fields: always paired with a visible `<label>` element
- Camera feed: `aria-live` region for letter output (screen reader compat)
- Color is never the only indicator of state (always paired with text or icon)
- Responder page: no JavaScript required to display profile (render on load)