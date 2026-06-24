'use client';

import { usePlayerStore } from '@/stores/playerStore';
import { ProgressBar } from './ProgressBar';
import { TransportControls } from './TransportControls';
import { ExpandIcon } from './icons/ExpandIcon';
import { togglePlayback } from '@/hooks/useAudioPlayer';

type Props = {
  onSeek: (time: number) => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
};

export function MiniPlayer({ onSeek, onSkipBack, onSkipForward }: Props) {
  const currentRecording = usePlayerStore((s) => s.currentRecording);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const toggleFullScreen = usePlayerStore((s) => s.toggleFullScreen);
  const surahName = usePlayerStore((s) => s.surahName);
  const isLoading = usePlayerStore((s) => s.isLoading);
  const autoplayBlocked = usePlayerStore((s) => s.autoplayBlocked);

  if (!currentRecording) return null;

  return (
    <div className="border-t border-border bg-surface">
      {autoplayBlocked && (
        <div className="px-4 py-1.5 text-center text-xs text-danger">
          Click play to start playback
        </div>
      )}
      <ProgressBar onSeek={onSeek} showMarkers={false} />

      <div className="flex items-center gap-3 px-4 py-2">
        <button
          onClick={toggleFullScreen}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
          aria-label="Expand player"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-elevated">
            {isLoading ? (
              <span className="flex h-4 w-4 animate-ping rounded-full bg-accent" />
            ) : (
              <span className="text-lg font-semibold text-accent">
                {surahName?.charAt(0) ?? 'Q'}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium text-primary">{currentRecording.title}</p>
              {isLoading && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />}
            </div>
            <p className="truncate text-xs text-secondary">
              {surahName} &middot; {currentRecording.reciter}
            </p>
          </div>
        </button>

        <button
          onClick={togglePlayback}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-hover"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          onClick={toggleFullScreen}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-secondary transition-colors hover:text-primary"
          aria-label="Expand player"
        >
          <ExpandIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
