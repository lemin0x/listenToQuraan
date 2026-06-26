# Future Plan

## Audio

- No R2 bucket — audio files are tracked in git under `public/audio/`
- Some surahs still have missing files (Al-Fatiha: `various-complete-quran-fast.mp3`, Al-Baqarah: `ahmed-al-ajmy-full.m4a`)

### Library suggestion: howler.js (Recommended)
Replace manual `HTMLAudioElement` singleton + event listeners with [howler.js](https://howlerjs.com/) (~10KB gzipped).

**Why**: Eliminates all the race conditions and manual state sync bugs we fixed. One library handles:
- Format fallback (try `.m4a` → fallback to `.mp3`)
- Lifecycle (no singleton, no race conditions, no manual event listeners)
- Error recovery (built-in `onloaderror`, `onplayerror`)
- Cross-browser consistency

**Migration sketch** — `playRecording` goes from ~50 lines to ~15:
```typescript
let howl: Howl | null = null;

export function playRecording(recording, surahId, surahName) {
  howl?.unload();
  store.play(recording, surahId, surahName);
  howl = new Howl({
    src: [getAudioUrl(recording)],
    html5: true,
    autoplay: true,
    onload: () => store.setLoading(false),
    onend: () => { /* handle ended */ },
  });
}
```

No `seekingRef`, no `canplay` listener, no `play()` promise catches.

### Alternative: use-sound
Hook wrapper around howler, simpler API but designed for short sound effects, not persistent players. Not ideal for this app.

### Alternative: Stick with native Audio API (already fixed)
The bugs are already fixed. Ship as-is if you don't want extra dependencies.

## Performance

- `React.memo` and `useMemo` added to key components
- `RepeatControls` no longer subscribes to `currentTime`
- If more speed needed: lazy-load surah data, compress large audio files

## Deploy

- `NEXT_PUBLIC_R2_BASE_URL` not needed (audio served from `public/`)
- CI deploy workflow needs `VERCEL_TOKEN` secret in GitHub
