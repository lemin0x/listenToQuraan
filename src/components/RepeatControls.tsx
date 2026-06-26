'use client';
import { memo, useCallback } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import { RepeatIcon } from './icons/RepeatIcon';
import { RepeatOneIcon } from './icons/RepeatOneIcon';

export const RepeatControls = memo(function RepeatControls() {
  const pointA = usePlayerStore((s) => s.pointA);
  const pointB = usePlayerStore((s) => s.pointB);
  const repeatMode = usePlayerStore((s) => s.repeatMode);
  const setPointA = usePlayerStore((s) => s.setPointA);
  const setPointB = usePlayerStore((s) => s.setPointB);
  const clearRepeat = usePlayerStore((s) => s.clearRepeat);
  const setRepeatMode = usePlayerStore((s) => s.setRepeatMode);

  const hasAB = pointA !== null && pointB !== null;
  const isABActive = repeatMode === 'ab-repeat' && hasAB;

  const handleSetA = useCallback(() => {
    setPointA(usePlayerStore.getState().currentTime);
  }, [setPointA]);

  const handleSetB = useCallback(() => {
    if (pointA !== null) {
      setPointB(usePlayerStore.getState().currentTime);
    }
  }, [pointA, setPointB]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => setRepeatMode(repeatMode === 'loop' ? 'off' : 'loop')}
        className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
          repeatMode === 'loop'
            ? 'bg-accent text-white'
            : 'bg-elevated text-secondary hover:text-primary'
        }`}
        aria-label={repeatMode === 'loop' ? 'Disable loop' : 'Enable loop'}
      >
        <RepeatIcon className="h-4 w-4" />
        Loop
      </button>

      <button
        onClick={handleSetA}
        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
          pointA !== null
            ? 'bg-highlight text-base'
            : 'bg-elevated text-secondary hover:text-primary'
        }`}
        aria-label="Set repeat point A"
      >
        Set A
      </button>

      <button
        onClick={handleSetB}
        disabled={pointA === null}
        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
          pointB !== null
            ? 'bg-danger text-white'
            : 'bg-elevated text-secondary hover:text-primary disabled:opacity-40'
        }`}
        aria-label="Set repeat point B"
      >
        Set B
      </button>

      {hasAB && (
        <button
          onClick={() => setRepeatMode(isABActive ? 'off' : 'ab-repeat')}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            isABActive
              ? 'bg-accent text-white'
              : 'bg-elevated text-secondary hover:text-primary'
          }`}
          aria-label={isABActive ? 'Disable A-B repeat' : 'Enable A-B repeat'}
        >
          <RepeatOneIcon className="h-4 w-4" />
        </button>
      )}

      {(pointA !== null || pointB !== null || repeatMode === 'loop') && (
        <button
          onClick={clearRepeat}
          className="rounded-md px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:text-danger/80"
          aria-label="Clear repeat settings"
        >
          Clear
        </button>
      )}
    </div>
  );
});
