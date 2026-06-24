'use client';

import { usePlayerStore } from '@/stores/playerStore';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function SpeedControl() {
  const playbackRate = usePlayerStore((s) => s.playbackRate);
  const setPlaybackRate = usePlayerStore((s) => s.setPlaybackRate);

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Playback speed">
      {SPEEDS.map((speed) => (
        <button
          key={speed}
          onClick={() => setPlaybackRate(speed)}
          className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
            playbackRate === speed
              ? 'bg-accent text-white'
              : 'bg-elevated text-secondary hover:text-primary'
          }`}
          role="radio"
          aria-checked={playbackRate === speed}
          aria-label={`${speed}x speed`}
        >
          {speed}x
        </button>
      ))}
    </div>
  );
}
