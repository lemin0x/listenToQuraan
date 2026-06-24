# Quran Audio

A minimalist web application for listening to Qur'an audio recordings. Focused on simplicity, speed, and memorization.

## Features

- **Browse Surahs** — All 114 surahs listed with Arabic and English names
- **Audio Recordings** — Multiple recordings per surah (full, partial, memorization)
- **Persistent Player** — Audio continues playing across page navigation
- **A-B Repeat** — Set start and end points to loop specific segments for memorization
- **Saved Segments** — Save A-B repeat segments locally via browser storage
- **Playback Speed** — 0.5x to 2x speed control
- **PWA Support** — Installable on desktop and mobile, works offline
- **Dark Theme** — Calm, focused, night-friendly design

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State:** Zustand
- **Audio:** Native HTML5 Audio API
- **PWA:** @serwist/turbopack
- **Storage:** Cloudflare R2 (abstracted, configurable)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding Content

1. Upload MP3 files to `public/audio/` or Cloudflare R2
2. Add an entry to `public/data/surahs.json`

Example surah entry:

```json
{
  "id": 1,
  "nameArabic": "الفاتحة",
  "nameEnglish": "Al-Fatiha",
  "audios": [
    {
      "id": "alafasy-full",
      "title": "Full Recitation",
      "reciter": "Alafasy",
      "audioUrl": "/audio/fatiha/alafasy-full.mp3",
      "duration": 42
    }
  ]
}
```

### Connect Cloudflare R2

Set the environment variable:

```
NEXT_PUBLIC_R2_BASE_URL=https://your-bucket.r2.cloudflarestorage.com
```

Audio URLs in `surahs.json` will automatically be prefixed with this base URL. No code changes needed.

## Building

```bash
npm run build
npm start
```

## Deploy to Vercel

```bash
vercel
```

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── layout.tsx        # Root layout with header + player
│   ├── page.tsx          # Home — surah grid
│   ├── surah/[id]/       # Surah recordings page
│   └── ~offline/         # Offline fallback page
├── components/           # React components
│   ├── BottomPlayer.tsx  # Persistent player orchestrator
│   ├── MiniPlayer.tsx    # Compact player bar
│   ├── FullScreenPlayer.tsx  # Full-screen mobile player
│   ├── ProgressBar.tsx   # Seekable progress with A/B markers
│   ├── RepeatControls.tsx    # A-B repeat controls
│   ├── SpeedControl.tsx  # Playback speed selector
│   ├── SavedSegments.tsx # Saved A-B segments
│   └── icons/            # Inline SVG icons
├── stores/               # Zustand state
│   ├── playerStore.ts    # Audio player state
│   └── segmentsStore.ts  # Persisted A-B segments
├── hooks/
│   └── useAudioPlayer.ts # Audio element management
└── lib/
    ├── types.ts          # TypeScript types
    ├── data.ts           # Data fetching
    ├── audio-source.ts   # R2 abstraction
    └── utils.ts          # Formatting utilities
```
