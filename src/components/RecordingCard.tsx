'use client';
import { memo } from 'react';
import type { AudioRecording } from '@/lib/types';
import { formatTime } from '@/lib/utils';
import { PlayIcon } from './icons/PlayIcon';
import { usePlayerStore } from '@/stores/playerStore';
import { playRecording } from '@/hooks/useAudioPlayer';

type Props = {
  recording: AudioRecording;
  surahId: number;
  surahName: string;
};

export const RecordingCard = memo(function RecordingCard({ recording, surahId, surahName }: Props) {
  const currentRecording = usePlayerStore((s) => s.currentRecording);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const isLoading = usePlayerStore((s) => s.isLoading);
  const autoplayBlocked = usePlayerStore((s) => s.autoplayBlocked);
  const isCurrent = currentRecording?.id === recording.id;
  const showSpinner = isCurrent && isLoading;
  const showPlayIcon = isCurrent && isPlaying && !isLoading;
  const showBlocked = isCurrent && autoplayBlocked && !isPlaying;

  return (
    <button
      onClick={() => playRecording(recording, surahId, surahName)}
      className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
        isCurrent
          ? 'border-accent/50 bg-accent/5'
          : 'border-border bg-surface hover:border-accent/30 hover:bg-elevated'
      }`}
      aria-label={`Play ${recording.title} by ${recording.reciter}`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
          showPlayIcon ? 'bg-accent text-white' : 'bg-elevated text-secondary'
        }`}
      >
        {showSpinner ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        ) : (
          <PlayIcon className="h-5 w-5" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-primary">{recording.title}</p>
        <p className="truncate text-xs text-secondary">
          {recording.reciter}
          {showBlocked && <span className="ml-2 text-danger">Click to play</span>}
        </p>
      </div>
      {recording.duration && (
        <span className="shrink-0 text-xs text-secondary">
          {formatTime(recording.duration)}
        </span>
      )}
    </button>
  );
});
