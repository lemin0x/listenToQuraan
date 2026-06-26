'use client';
import { memo, useRef, useCallback, useEffect, useMemo, type MouseEvent, type TouchEvent, type KeyboardEvent } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import { formatTime } from '@/lib/utils';

type Props = {
  onSeek: (time: number) => void;
  showMarkers?: boolean;
};

export const ProgressBar = memo(function ProgressBar({ onSeek, showMarkers = true }: Props) {
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const pointA = usePlayerStore((s) => s.pointA);
  const pointB = usePlayerStore((s) => s.pointB);
  const barRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const progress = useMemo(() => duration > 0 ? (currentTime / duration) * 100 : 0, [currentTime, duration]);
  const aPct = useMemo(() => duration > 0 && pointA !== null ? (pointA / duration) * 100 : 0, [duration, pointA]);
  const bPct = useMemo(() => duration > 0 && pointB !== null ? (pointB / duration) * 100 : 0, [duration, pointB]);

  const calculateTime = useCallback((clientX: number) => {
    const bar = barRef.current;
    if (!bar || duration <= 0) return 0;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return ratio * duration;
  }, [duration]);

  const handleInteraction = useCallback((clientX: number) => {
    onSeek(calculateTime(clientX));
  }, [onSeek, calculateTime]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    isDraggingRef.current = true;
    handleInteraction(e.clientX);
  }, [handleInteraction]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    isDraggingRef.current = true;
    handleInteraction(e.touches[0].clientX);
  }, [handleInteraction]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (duration <= 0) return;
    const step = e.shiftKey ? duration * 0.1 : 5;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onSeek(Math.min(currentTime + step, duration));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onSeek(Math.max(currentTime - step, 0));
    } else if (e.key === 'Home') {
      e.preventDefault();
      onSeek(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      onSeek(duration);
    }
  }, [duration, currentTime, onSeek]);

  useEffect(() => {
    if (!isDraggingRef.current) return;
    const onMove = (ev: globalThis.MouseEvent) => handleInteraction(ev.clientX);
    const onUp = () => { isDraggingRef.current = false; };
    const onTouchMove = (ev: globalThis.TouchEvent) => handleInteraction(ev.touches[0].clientX);
    const onTouchEnd = () => { isDraggingRef.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [handleInteraction]);

  const formatAriaValue = (seconds: number): string => {
    if (seconds <= 0) return '0 minutes 0 seconds';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const parts: string[] = [];
    if (h > 0) parts.push(`${h} ${h === 1 ? 'hour' : 'hours'}`);
    if (m > 0) parts.push(`${m} ${m === 1 ? 'minute' : 'minutes'}`);
    if (s > 0 || parts.length === 0) parts.push(`${s} ${s === 1 ? 'second' : 'seconds'}`);
    return parts.join(' ');
  };

  return (
    <div className="w-full">
      <div
        ref={barRef}
        className="relative h-2 cursor-pointer rounded-full bg-elevated"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onKeyDown={handleKeyDown}
        role="slider"
        aria-label="Audio progress"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
        aria-valuetext={formatAriaValue(currentTime)}
        tabIndex={0}
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-accent"
          style={{ width: `${progress}%` }}
        />
        {showMarkers && pointA !== null && (
          <div className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-highlight"
            style={{ left: `${aPct}%` }} />
        )}
        {showMarkers && pointB !== null && (
          <div className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-danger"
            style={{ left: `${bPct}%` }} />
        )}
        {pointA !== null && pointB !== null && (
          <div className="absolute top-0 h-full rounded-full bg-accent/20"
            style={{ left: `${Math.min(aPct, bPct)}%`, width: `${Math.abs(bPct - aPct)}%` }} />
        )}
      </div>
      <div className="mt-1 flex justify-between text-xs text-secondary">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
});
