# Signify 🤟

> Real-time ASL fingerspelling recognition and medical ID sharing for Deaf and hard-of-hearing users, built at HackPrinceton.

**Live app:** [signify.vercel.app](https://signify.vercel.app)

---

## Inspiration ☆

I have been learning ASL this semester and been very grateful to have people who use this as a primary form of communication, educate and explain the struggles they face. Communication breakdowns between Deaf and hard-of-hearing individuals and hearing people, especially that with first responders, pharmacists, and clinic staff can be dangerous. In an emergency, seconds matter and writing things down or waiting for an interpreter isn't always an option.

There is a historic inequity that people who need hearing accomodations have not been granted, and while there are many strides that have been done to try and fix these, there are still not enough. I wanted to build something that lives entirely on the user's device: no account, no server, no data leaving their hands. Signify is a tool that places accessibility-first and acts as a communication bridge for the crucial moments.

---

## What it does ???

Signify has three core features:

**Medical ID** - A digital emergency card modelled after Apple Health's Medical ID. Users are able to fill in allergies, medications, conditions, emergency contacts, and insurance. The profile is encoded as a QR code that any first responder can scan to get an instant read-only view with no app required. Ideally, it will use the built-in shortcuts on both Android and iOS but for now, uses a QR code API.

**Phrase Pad** - A tap-to-speak card grid with 12+ built-in medical and emergency phrases such as "I am Deaf. I use ASL.", "Call 911.", "I need my medication." Users can also add custom phrases. Each card fires the browser's text-to-speech API so a hearing person can hear the message immediately.

**Fingerspelling** - A live camera feed that uses on-device machine learning to recognise ASL hand shapes letter by letter. Hold a sign for 0.8 seconds to commit it; spell out words one letter at a time. Works entirely offline after the first load.

---

## How it was built

### Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS + CSS custom properties |
| State | Zustand with localStorage persistence |
| Routing | React Router v7 |
| Hand detection | `@mediapipe/tasks-vision` (HandLandmarker) |
| Inference | TensorFlow.js (`tf.loadGraphModel`) |
| QR encoding | Base64 profile embedded in URL param |
| Icons | Lucide React |
| Deployment | Vercel |

### Architecture

<a><img src="/src/images/architecture.jpg" alt="General Architecute" width="800"/></a>

<a><img src="/src/images/userFlow.jpg" alt="User Flow" width="800"/></a>

The app is entirely client-side so no backend, no database. All profile data is stored in `localStorage` via Zustand. The QR code encodes the full medical profile as a base64 URL parameter so a first responder's phone can decode it without installing anything. This is also for patient privacy because of HIPPA laws.

The fingerspelling pipeline:
1. `@mediapipe/tasks-vision` streams 21 hand landmarks (63 floats) per video frame
2. Landmarks are passed to a TensorFlow.js `GraphModel` trained on the ASL alphabet
3. The model outputs a 29-class probability vector (A–Z + space, del, nothing)
4. A letter is committed after it is held confidently (>85%) for 800 ms

### Model

The classifier is a three-layer dense network trained on the [ASL Alphabet Kaggle dataset](https://www.kaggle.com/datasets/grassknoted/asl-alphabet/data). It was trained and exported in Google Colab [(https://drive.google.com/drive/folders/1NY9BDhMJodj9YgAOed61MurthxZh2tVc?usp=sharing)] and converted to TensorFlow.js `GraphModel` format for in-browser inference.

<a><img src="/src/images/Screenshot 2026-04-19 at 07.22.10.png" alt="Training Epochs" width="800"/></a>

---

## Challenges faced 

**MediaPipe + modern Chrome** - `@mediapipe/hands@0.4` crashes on newer V8 engines due to a breaking change in how Emscripten handles `Module.arguments`. Migrating to `@mediapipe/tasks-vision` (Google's current library) resolved this but required a full rewrite of the hand detection hook.

**Vite + WASM bundling** - Vite's dependency optimizer tries to pre-bundle WASM-backed packages and mangles their exports. We had to exclude `@mediapipe/tasks-vision` from `optimizeDeps` and pin the WASM CDN URL to the exact installed version to prevent version drift between the JS loader and the WASM binary.

**Camera + React rendering race** - The video element was conditionally rendered after permission was granted, so `videoRef.current` was always `null` when `getUserMedia` resolved. The fix was to always keep the `<video>` element in the DOM (hidden with CSS) so the ref is available before the async call returns.

**Model training** - Static hand images don't capture the full variation of real-world signing (lighting, skin tone, hand angle, camera distance). Achieving a confidence threshold high enough for reliable letter commits while low enough to stay responsive took significant iteration on training data augmentation and the hold-time threshold.

**QR code URL length** - Base64-encoding a full medical profile can exceed 2 KB, which makes QR codes dense and hard to scan. We kept field values concise and noted `lz-string` compression as a future improvement.

---

## Accomplishments 💭

- Fully client-side: zero backend, zero data leaves the device
- Real-time ASL recognition running at 20+ FPS in-browser on a laptop camera
- QR medical ID that any phone can scan without installing an app
- Accessible design: 44px minimum touch targets, `aria-live` regions for screen readers, color never the sole state indicator
- Responsive from 320px mobile to desktop, deployed and live on Vercel
- And I did it solo :)

---

## What I learned 👩‍💻

- How to integrate WebAssembly-backed ML pipelines (MediaPipe + TF.js) inside a Vite/React app and the sharp edges that come with WASM in modern bundlers
- The gap between training accuracy and real-world usability, a model that scores 97% on a test set can still feel unreliable when the user's lighting is different
- How to design for users under stress: generous whitespace, high-contrast text, and large tap targets aren't nice-to-haves, they are the feature
- How to encode meaningful data (a full medical profile) into a URL that works across any device without a backend
- Building for mobile-only because that is my target

---

## What's next for Signify ⁉

- **Two-hand and motion letters** - J and Z require motion tracking; adding temporal modelling would complete the alphabet
- **URL compression** - `lz-string` compression before base64 encoding to keep QR codes scannable even with long profiles
- **Offline model caching** - Cache the TF.js model weights in IndexedDB so the fingerspelling feature works on first load with no internet
- **Phrase customisation sync** - Optional encrypted export/import of custom phrases via QR or share sheet
- **Responder mode improvements** - Text-size controls and a high-contrast mode optimised for bright outdoor light
- **More languages** - BSL, LSF, and other signed languages share the same landmark-based approach; the pipeline generalises
- **Built for Mobile** - Integrate the Android and iOS application to work natively on someone's device.

---

## Built with ♡

`React` · `TypeScript` · `Vite` · `Tailwind CSS` · `TensorFlow.js` · `MediaPipe Tasks Vision` · `Zustand` · `React Router` · `Lucide React` · `Vercel`

---

## Running locally

```bash
git clone https://github.com/<your-username>/signify.git
cd signify
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Camera access is required for the fingerspelling feature.

### Environment variables

| Variable | Description |
|---|---|
| `VITE_APP_URL` | The production URL used in QR code links (e.g. `https://signify.vercel.app`) |

---

## License

MIT
