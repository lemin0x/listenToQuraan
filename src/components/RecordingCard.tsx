'use client';

import type { AudioRecording } from '@/lib/types';
import { formatTime } from '@/lib/utils';
import { PlayIcon } from './icons/PlayIcon';
import { usePlayerStore } from '@/stores/playerStore';

type Props = {
  recording: AudioRecording;
  surahId: number;
  surahName: string;
};

export function RecordingCard({ recording, surahId, surahName }: Props) {
  const play = usePlayerStore((s) => s.play);
  const currentRecording = usePlayerStore((s) => s.currentRecording);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const isCurrent = currentRecording?.id === recording.id;

  return (
    <button
      onClick={() => play(recording, surahId, surahName)}
      className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
        isCurrent
          ? 'border-accent/50 bg-accent/5'
          : 'border-border bg-surface hover:border-accent/30 hover:bg-elevated'
      }`}
      aria-label={`Play ${recording.title} by ${recording.reciter}`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
          isCurrent && isPlaying
            ? 'bg-accent text-white'
            : 'bg-elevated text-secondary group-hover:text-accent'
        }`}
      >
        <PlayIcon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-primary">{recording.title}</p>
        <p className="text-xs text-secondary">{recording.reciter}</p>
      </div>
      {recording.duration && (
        <span className="shrink-0 text-xs text-secondary">
          {formatTime(recording.duration)}
        </span>
      )}
    </button>
  );
}
