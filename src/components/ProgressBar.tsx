'use client';

import { useRef, useCallback, type MouseEvent, type TouchEvent } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import { formatTime } from '@/lib/utils';

type Props = {
  onSeek: (time: number) => void;
  showMarkers?: boolean;
};

export function ProgressBar({ onSeek, showMarkers = true }: Props) {
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const pointA = usePlayerStore((s) => s.pointA);
  const pointB = usePlayerStore((s) => s.pointB);
  const barRef = useRef<HTMLDivElement>(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const aPct = duration > 0 && pointA !== null ? (pointA / duration) * 100 : 0;
  const bPct = duration > 0 && pointB !== null ? (pointB / duration) * 100 : 0;

  const calculateTime = useCallback(
    (clientX: number) => {
      const bar = barRef.current;
      if (!bar || duration <= 0) return 0;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return ratio * duration;
    },
    [duration],
  );

  const handleInteraction = useCallback(
    (clientX: number) => {
      onSeek(calculateTime(clientX));
    },
    [onSeek, calculateTime],
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      handleInteraction(e.clientX);
      const onMove = (ev: globalThis.MouseEvent) => handleInteraction(ev.clientX);
      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    [handleInteraction],
  );

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      handleInteraction(e.touches[0].clientX);
    },
    [handleInteraction],
  );

  return (
    <div className="w-full">
      <div
        ref={barRef}
        className="relative h-2 cursor-pointer rounded-full bg-elevated"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="slider"
        aria-label="Audio progress"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
        tabIndex={0}
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-accent transition-[width] duration-75"
          style={{ width: `${progress}%` }}
        />
        {showMarkers && pointA !== null && (
          <div
            className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-highlight"
            style={{ left: `${aPct}%` }}
          />
        )}
        {showMarkers && pointB !== null && (
          <div
            className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-danger"
            style={{ left: `${bPct}%` }}
          />
        )}
        {pointA !== null && pointB !== null && (
          <div
            className="absolute top-0 h-full rounded-full bg-accent/20"
            style={{ left: `${aPct}%`, width: `${bPct - aPct}%` }}
          />
        )}
      </div>
      <div className="mt-1 flex justify-between text-xs text-secondary">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
