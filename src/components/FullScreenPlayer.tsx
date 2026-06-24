'use client';

import { usePlayerStore } from '@/stores/playerStore';
import { ProgressBar } from './ProgressBar';
import { TransportControls } from './TransportControls';
import { SpeedControl } from './SpeedControl';
import { RepeatControls } from './RepeatControls';
import { SavedSegments } from './SavedSegments';
import { CloseIcon } from './icons/CloseIcon';

type Props = {
  onSeek: (time: number) => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
};

export function FullScreenPlayer({ onSeek, onSkipBack, onSkipForward }: Props) {
  const currentRecording = usePlayerStore((s) => s.currentRecording);
  const isFullScreen = usePlayerStore((s) => s.isFullScreen);
  const toggleFullScreen = usePlayerStore((s) => s.toggleFullScreen);
  const surahName = usePlayerStore((s) => s.surahName);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);

  if (!currentRecording || !isFullScreen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-base">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm text-secondary">{surahName}</span>
        <button
          onClick={toggleFullScreen}
          className="flex h-8 w-8 items-center justify-center rounded-full text-secondary transition-colors hover:text-primary"
          aria-label="Close player"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
        <div className="text-center">
          <p className="text-xl font-semibold text-primary">{currentRecording.title}</p>
          <p className="mt-1 text-sm text-secondary">{currentRecording.reciter}</p>
        </div>

        <ProgressBar onSeek={onSeek} />

        <TransportControls
          onSkipBack={onSkipBack}
          onSkipForward={onSkipForward}
          size="lg"
        />

        <SpeedControl />

        <RepeatControls />

        <div className="w-full max-w-sm">
          <SavedSegments />
        </div>
      </div>
    </div>
  );
}
