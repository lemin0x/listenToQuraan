'use client';

import { usePlayerStore } from '@/stores/playerStore';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { SkipBackIcon } from './icons/SkipBackIcon';
import { SkipForwardIcon } from './icons/SkipForwardIcon';

type Props = {
  onSkipBack: () => void;
  onSkipForward: () => void;
  size?: 'sm' | 'lg';
};

export function TransportControls({ onSkipBack, onSkipForward, size = 'sm' }: Props) {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const togglePlay = usePlayerStore((s) => s.togglePlay);

  const btnSize = size === 'lg' ? 'h-14 w-14' : 'h-10 w-10';
  const iconSize = size === 'lg' ? 'h-7 w-7' : 'h-5 w-5';
  const skipSize = size === 'lg' ? 'h-10 w-10' : 'h-8 w-8';
  const skipIcon = size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={onSkipBack}
        className={`${skipSize} flex items-center justify-center rounded-full text-secondary transition-colors hover:text-primary`}
        aria-label="Skip backward 15 seconds"
      >
        <SkipBackIcon className={skipIcon} />
      </button>

      <button
        onClick={togglePlay}
        className={`${btnSize} flex items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-hover`}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <PauseIcon className={iconSize} /> : <PlayIcon className={iconSize} />}
      </button>

      <button
        onClick={onSkipForward}
        className={`${skipSize} flex items-center justify-center rounded-full text-secondary transition-colors hover:text-primary`}
        aria-label="Skip forward 15 seconds"
      >
        <SkipForwardIcon className={skipIcon} />
      </button>
    </div>
  );
}
